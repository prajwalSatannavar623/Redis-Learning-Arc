import { Queue } from "bullmq";

const emailQueue = new Queue("welcome-email", {
  connection: {
    host: "localhost",
    port: 6379,
  },
  defaultJobOptions: {
    removeOnComplete: true, // remove the job from the queue when it is completed
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
  removeonFail: 100, // remove the job from the queue when it fails 100 times
});

export { emailQueue };
