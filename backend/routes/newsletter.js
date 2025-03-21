const router = require("express").Router();
const Subscription = require("../models/Subscription");

// Add a new subscriber
router.post("/subscribe", async (req, res) => {
  try {
    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email: req.body.email });
    if (existingSubscription) {
      // If already subscribed and active
      if (existingSubscription.active) {
        return res.status(400).json("Email already subscribed");
      } 
      // If previously unsubscribed, reactivate
      else {
        existingSubscription.active = true;
        await existingSubscription.save();
        return res.status(200).json("Subscription reactivated");
      }
    }
    
    // Create new subscription
    const newSubscription = new Subscription({ email: req.body.email });
    const subscription = await newSubscription.save();
    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Unsubscribe
router.post("/unsubscribe", async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ email: req.body.email });
    if (!subscription) {
      return res.status(404).json("Subscription not found");
    }
    
    subscription.active = false;
    await subscription.save();
    res.status(200).json("Successfully unsubscribed");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; 