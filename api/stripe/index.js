const stripe_key = process.env.STRIPE_KEY;
const express = require("express");
const stripe = require("stripe")(stripe_key);

const router = express.Router();

router.post("/intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!", paymentIntent);
      // Handle successful payment here
      break;
    case "payment_intent.payment_failed":
      const paymentFailedIntent = event.data.object;
      console.log("PaymentIntent failed!", paymentFailedIntent);
      // Handle failed payment here
      break;
    // Add more cases to handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

router.post("/customer", async (req, res) => {
  const { email, name } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    res.send(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ error: error.message });
  }
});

router.patch("/customer", async (req, res) => {
  const { email, name, customerId } = req.body;

  try {
    const customer = await stripe.customers.update(customerId, {
      email: email,
      name: name,
    });

    res.send(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/product", async (req, res) => {
  const { name, description } = req.body;

  try {
    const product = await stripe.products.create({
      name: name,
      description: description,
    });

    res.send(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: error.message });
  }
});

router.patch("/product", async (req, res) => {
  const { name, description, productId } = req.body;

  try {
    const product = await stripe.products.update(productId, {
      name: name,
      description: description,
    });

    res.send(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/price", async (req, res) => {
  const { productId, unitAmount, currency, recurring } = req.body;

  try {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: unitAmount, // amount in the smallest currency unit, e.g., cents for USD
      currency: currency,
      recurring: recurring, // pass {interval: 'month'} for monthly or {interval: 'year'} for yearly
    });

    res.send(price);
  } catch (error) {
    console.error("Error creating price:", error);
    res.status(500).send({ error: error.message });
  }
});

router.patch("/price", async (req, res) => {
  const { priceId, productId, unitAmount, currency, recurring } = req.body;

  try {
    const price = await stripe.prices.update(priceId, {
      product: productId,
      unit_amount: unitAmount, // amount in the smallest currency unit, e.g., cents for USD
      currency: currency,
      recurring: recurring, // pass {interval: 'month'} for monthly or {interval: 'year'} for yearly
    });

    res.send(price);
  } catch (error) {
    console.error("Error creating price:", error);
    res.status(500).send({ error: error.message });
  }
});

router.post("/subscription", async (req, res) => {
  const { customerId, priceId, paymentMethodId } = req.body;

  try {
    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set the default payment method on the customer
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    res.send(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(400).send({ error: { message: error.message } });
  }
});

module.exports = router;
