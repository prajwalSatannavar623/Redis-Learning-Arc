import express, { urlencoded } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  const message = await redis.set(
    BANNER_KEY,
    req.body.message || "Welcome to our Website!!",
  );

  return res.status(201).json({ message });
});

app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);

  return res.status(200).json({ message });
});

app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);

  return res.status(200).json({ message: true });
});

app.get("/banner/exists", async (req, res) => {
  const exist = await redis.exists(BANNER_KEY);

  return res.json({ message: Boolean(exist) });
});

app.listen(3000, () => {
  console.log("Server successfuly running on port:", 3000);
});
