import express from "express";
import Redis from "ioredis";

import { subsriber } from "./subscriber.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publisher = new Redis("redis://localhost:6379");

app.post("/notify", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    await publisher.publish("notifications", JSON.stringify(message));
    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error publishing message:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port:", 3000);
});
