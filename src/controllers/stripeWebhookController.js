const Stripe = require("stripe");
const PaymentHistory = require("../models/PaymentHistory"); // Payment History model
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc Handle Stripe Webhook Events
 * @route POST /api/stripe/webhook
 */
const stripeWebhookHandler = async (req, res) => {
  // Skip signature verification when testing locally
  if (process.env.NODE_ENV !== "production") {
    console.log("Skipping signature verification for local testing");
    const event = req.body;

    // Handle the event
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Save payment details to the database
        await PaymentHistory.create({
          userId: session.client_reference_id || null,
          paymentId: session.id,
          priceId: session.metadata.priceId,
          status: session.payment_status,
          amount: session.amount_total / 100,
        });

        console.log("Payment history updated for session:", session.id);
      }

      res.status(200).send("Webhook handled successfully.");
    } catch (error) {
      console.error("Stripe Webhook Error:", error);
      res.status(400).send("Webhook Error");
    }
  } else {
    // Normal signature verification for production
    const sig = req.headers["stripe-signature"];
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Save payment details to the database
        await PaymentHistory.create({
          userId: session.client_reference_id || null,
          paymentId: session.id,
          priceId: session.metadata.priceId,
          status: session.payment_status,
          amount: session.amount_total / 100,
        });

        console.log("Payment history updated for session:", session.id);
      }

      res.status(200).send("Webhook handled successfully.");
    } catch (error) {
      console.error("Stripe Webhook Error:", error);
      res.status(400).send("Webhook Error");
    }
  }
};

module.exports = {
  stripeWebhookHandler,
};
