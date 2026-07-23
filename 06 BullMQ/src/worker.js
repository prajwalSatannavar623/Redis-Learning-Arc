import { Worker } from "bullmq";

async function sendWelcomeEmail(jobData) {
  const { email, subject, to } = jobData;

  const delay = Math.floor(Math.random() * 1500) + 1500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  console.log(`[EMAIL SENT]: Email sent to ${to} with subject ${subject}`);
}

const welcomeEmailWorker = new Worker(
  "welcome-email",
  async (job) => {
    console.log(`[PROCESSING]: Jod Id: ${job.id}, Job name: ${job.name}`);
    await sendWelcomeEmail(job.data);
    return { success: true, message: "Welcome Email sent successfully" };
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    concurrency: 10,
    removeOnComplete: { count: 500 },
    removeOnFail: { count: 2000 },
  },
);

export { welcomeEmailWorker };
