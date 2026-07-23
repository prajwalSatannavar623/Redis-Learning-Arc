import e from "express";
import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis("redis://localhost:6379");

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No subject",
    body: req.body.body,
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));

  return res.json({
    msg: "Queued",
    job: job,
  });
});

app.get("/emails", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);

  if (!rawJob) {
    return res.json({ msg: "No queued Jobs" });
  }

  // stimulate email sending
  return res.json({
    msg: "Email sent",
    email: JSON.parse(rawJob),
  });
});

app.listen(3000, () => {
  console.log("Server is running on port:", 3000);
});
