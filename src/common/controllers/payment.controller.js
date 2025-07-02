const stripe = require("../../../config/stripe");
const User = require("../../modules/users/user.model");
const {
  createCheckoutSession,
  handleWebhookEvent,
  cancelActiveSubscription,
  getCurrentSubscription,
} = require("../services/payment.service");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan, billingInterval } = req.body;
    console.log("billingInterval::: ", billingInterval);
    const user = req.user;

    if (!["base", "premium"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }
    if (!["monthly", "yearly"].includes(billingInterval)) {
      return res.status(400).json({ message: "Invalid billing interval" });
    }

    // Check if user already has an active subscription
    const userData = await User.findById(user.id);
    if (userData.subscriptionId && userData.membership !== "free") {
      const currentSubscription = await getCurrentSubscription(
        userData.subscriptionId
      );

      if (currentSubscription.status === "active") {
        return res.status(400).json({
          message: "You already have an active subscription",
          currentPlan: userData.membership,
          subscriptionId: userData.subscriptionId,
        });
      }
    }

    const session = await createCheckoutSession(
      userData,
      plan,
      billingInterval
    );
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user.id);

    if (!userData.subscriptionId) {
      return res.status(400).json({ message: "No active subscription found" });
    }

    const result = await cancelActiveSubscription(userData.subscriptionId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Cancel subscription error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user.id);

    if (!userData.subscriptionId) {
      return res.status(200).json({
        status: "inactive",
        membership: "free",
      });
    }

    const subscription = await getCurrentSubscription(userData.subscriptionId);
    res.status(200).json({
      status: subscription.status,
      membership: userData.membership,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
    });
  } catch (err) {
    console.error("Get subscription status error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Event received:", event.type);
    const result = await handleWebhookEvent(event);

    if (result.processed) {
      console.log(result.message);
    } else if (result.error) {
      console.error("Webhook processing error:", result.error);
    }
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.status(200).json({ received: true });
};

exports.getPlanOptions = async (req, res) => {
  try {
    res.status(200).json({
      plans: {
        base: {
          monthly: 15,
          yearly: 144,
          yearlySavings: "20%", // (15-12)/15
          monthlyEquivalent: 12,
        },
        premium: {
          monthly: 50,
          yearly: 552,
          yearlySavings: "8%", // (50-46)/50
          monthlyEquivalent: 46,
        },
      },
    });
  } catch (err) {
    console.error("Get plan options error:", err);
    res.status(500).json({ message: err.message });
  }
};
