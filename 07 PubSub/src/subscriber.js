import Redis from "ioredis";

const subsriber = new Redis("redis://localhost:6379");

subsriber.subscribe("notifications", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: ", err);
  } else {
    console.log(
      `Subscribed successfully! This client is currently subscribed to ${count} channels.`,
    );
  }
});

// Event listener for receiving messages from the subscribed channels
subsriber.on("message", (channel, message) => {
  console.log(`Received message from ${channel}: ${JSON.parse(message)}`);
});

subsriber.on("error", (err) => {
  console.error("Redis error: ", err);
});

export { subsriber };
