import express from "express";
import Redis from "ioredis";

import { emailQueue } from "./queue.js";
import { welcomeEmailWorker } from "./worker.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add("send-welcome-email", {
    email: "Thanks for registering on our platform.",
    subject: `Welcome ${req.body.to}!`,
    to: req.body.to,
  });

  return res.status(200).json({ msg: "Welcome email queued" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
