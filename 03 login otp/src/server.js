import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis("redis://localhost:6379");

// utility function:
function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.ceil(Math.random() * 10000);

  await redis.set(otpKey(phone), otp, "EX", 30);

  // actually here, OTP will be seny using services like message and email etc...
  return res.status(200).json({ msg: "OTP sent Successfuly", otp: otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;

  const savedOtp = await redis.get(otpKey(phone));

  if (!savedOtp) {
    return res.status(400).json({ msg: "OTP expired or INVALID" });
  }

  if (Number(savedOtp) !== Number(otp)) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  return res.json({ msg: "OTP verified successfuly" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;

  const ttl = await redis.ttl(otpKey(phone));

  return res.status(200).json({ ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port:", 3000);
});
