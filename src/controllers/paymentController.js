const stripe = require("../../config/stripe");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ message: "Price ID is required." });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1, // Assuming single purchase
        },
      ],
      mode: "subscription", // For recurring plans
      success_url: `${process.env.CLIENT_URL}/`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    // Return session ID and the checkout URL
    res
      .status(200)
      .json({ sessionId: session.id, checkoutUrl: session.url, session });
  } catch (error) {
    console.error("Stripe Checkout Session Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
