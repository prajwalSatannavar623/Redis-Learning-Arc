import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis("redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  const redisId = `user:${req.params.id}:profile`;

  await redis.set(redisId, JSON.stringify(req.body || ""));

  return res.json({ msg: "cache set in json" });
});

app.get("/user/:id/json", async (req, res) => {
  const userProfile = await redis.get(`user:${req.params.id}:profile`);

  if (!userProfile) {
    return res.json({ msg: null });
  }

  return res
    .status(200)
    .json({ user: userProfile ? JSON.parse(userProfile) : null });
});

app.post("/user/:id/hash", async (req, res) => {
  const redisId = `user:${req.params.id}:profile`;

  await redis.hset(redisId, req.body);

  return res.json({ msg: "cache set in hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const userProfile = await redis.hgetall(`user:${req.params.id}:profile`);

  if (!userProfile) {
    return res.json({ msg: null });
  }

  return res.status(200).json({ user: userProfile });
});

app.listen(3000, () => {
  console.log("Server runing on port:", 3000);
});
