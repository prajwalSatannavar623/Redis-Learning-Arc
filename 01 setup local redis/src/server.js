import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();

  return res.status(200).json({
    redis: reply,
  });
});

app.get("/mongo", async (req, res) => {
  const mongoUrl =
    process.env.MONGO_URL || "mongodb://localhost:27017/chai_aur_redis";

  try {
    const mongoInstance = await mongoose.connect(mongoUrl);
    console.log("MONGODB CONNECTED SUCCESSFULLY");
    return res.status(200).json({
      message: "connected",
      database: mongoInstance.connection.name,
    });
  } catch (error) {
    console.log("MONGO CONNECTION :: ERROR", error);
    return res.json({
      message: "connection error",
      detail: error?.message || "Connection error",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Server is running successfully on port:",
    process.env.PORT || 3000,
  );
});
