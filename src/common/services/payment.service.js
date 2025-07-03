const stripe = require("../../../config/stripe");
const User = require("../../modules/users/user.model");

const PRICES = {
  base: {
    monthly: "price_1RgM5xCopqkPhEUjKoauybMF", // $15/month
    yearly: "price_1RgN58CopqkPhEUjKxyFJDML", // $144/year ($12/month)
  },
  premium: {
    monthly: "price_1RgM6nCopqkPhEUjdCZopLWE", // $50/month
    yearly: "price_1RgN5mCopqkPhEUjycLsGeKt", // $552/year ($46/month)
  },
};

// Create a new Stripe customer
async function createCustomer(user) {
  return await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: { userId: user.id.toString() },
  });
}

// Get current subscription details
async function getCurrentSubscription(subscriptionId) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

// Cancel active subscription
async function cancelActiveSubscription(subscriptionId) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  await User.findOneAndUpdate(
    { subscriptionId },
    { membership_end_date: new Date(subscription.current_period_end * 1000) }
  );

  return {
    success: true,
    message: "Subscription will be canceled at period end",
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: subscription.current_period_end,
  };
}

// Create checkout session with proper validation
async function createCheckoutSession(user, plan, billingInterval) {
  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await createCustomer(user);
    customerId = customer.id;
    await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
  }

  // Validate the price exists
  const priceId = PRICES[plan]?.[billingInterval];
  if (!priceId) {
    throw new Error(
      `Invalid price configuration for ${plan}-${billingInterval}`
    );
  }

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: priceId, // This must be a valid Stripe price ID
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id.toString(),
      plan,
      billingInterval,
    },
    subscription_data: {
      metadata: {
        userId: user.id.toString(),
        plan,
        billingInterval,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_AUTHENTICATED_SUCCESS_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_UNAUTHENTICATED_SUCCESS_URL}/cancel`,
  });
}

// Handle checkout completion with validation
async function handleCheckoutCompleted(session) {
  const plan = session.metadata.plan;
  const userId = session.metadata.userId;
  const billingInterval = session.metadata.billingInterval;
  const subscriptionId = session.subscription;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (subscription.status !== "active") {
    return {
      processed: false,
      error: `Subscription status is ${subscription.status}`,
    };
  }

  await User.findByIdAndUpdate(userId, {
    membership: plan,
    membership_interval: billingInterval,
    membership_start_date: new Date(),
    membership_end_date: new Date(subscription.current_period_end * 1000),
    subscriptionId: subscriptionId,
  });

  return {
    processed: true,
    message: `Membership updated to ${plan} (${billingInterval})`,
  };
}

// Handle successful payment with validation
async function handlePaymentSucceeded(invoice) {
  if (invoice.billing_reason === "subscription_create") {
    // This is handled by checkout.session.completed
    return { processed: false, message: "Handled by checkout session" };
  }

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription
  );
  const customerId = invoice.customer;

  await User.findOneAndUpdate(
    { stripeCustomerId: customerId },
    {
      membership_end_date: new Date(subscription.current_period_end * 1000),
    }
  );

  return { processed: true, message: "Membership extended" };
}

// Handle subscription cancellation with validation
async function handleSubscriptionCancelled(subscription) {
  await User.findOneAndUpdate(
    { stripeCustomerId: subscription.customer },
    {
      membership: "free",
      subscriptionId: null,
      membership_end_date: new Date(), // Set to now since canceled
    }
  );

  return { processed: true, message: "Membership downgraded to free" };
}

// Process webhook events with better error handling
async function handleWebhookEvent(event) {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        return await handleCheckoutCompleted(event.data.object);
      case "invoice.payment_succeeded":
        return await handlePaymentSucceeded(event.data.object);
      case "customer.subscription.deleted":
        return await handleSubscriptionCancelled(event.data.object);
      case "customer.subscription.updated":
        // Handle subscription changes (upgrades/downgrades)
        return await handleSubscriptionUpdated(event.data.object);
      default:
        return { processed: false, message: "Event type not handled" };
    }
  } catch (err) {
    console.error(`Error processing ${event.type}:`, err);
    return { processed: false, error: err.message };
  }
}

// Handle subscription changes (upgrades/downgrades)
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  const plan =
    subscription.metadata?.plan ||
    (subscription.items.data[0]?.price.id === PRICES.premium.monthly ||
    subscription.items.data[0]?.price.id === PRICES.premium.yearly
      ? "premium"
      : "base");

  // Determine interval from price ID
  const priceId = subscription.items.data[0].price.id;
  const billingInterval =
    priceId === PRICES.base.yearly || priceId === PRICES.premium.yearly
      ? "yearly"
      : "monthly";

  await User.findOneAndUpdate(
    { stripeCustomerId: customerId },
    {
      membership: plan,
      membership_interval: billingInterval,
      membership_end_date: new Date(subscription.current_period_end * 1000),
      subscriptionId: subscription.id,
    }
  );

  return {
    processed: true,
    message: `Subscription updated to ${billingInterval} ${plan}`,
  };
}

module.exports = {
  createCheckoutSession,
  handleWebhookEvent,
  cancelActiveSubscription,
  getCurrentSubscription,
};
