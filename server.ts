import { SQSQueue } from "https://deno.land/x/sqs@0.3.7/mod.ts";

// Read .env file and populate environment variables
const envFile = await Deno.readTextFile(".env");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [key, value] = line.split("=");
      return [key, value];
    })
);

// Set the environment variables
for (const [key, value] of Object.entries(env)) {
  Deno.env.set(key, value);
}

// Read environment variables
const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID") || "";
const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY") || "";
const AWS_REGION = Deno.env.get("AWS_REGION") || "";
const AWS_SQS_QUEUE_URL = Deno.env.get("AWS_SQS_QUEUE_URL") || "";

// Initialize SQS client
const sqs = new SQSQueue({
  queueURL: AWS_SQS_QUEUE_URL,
  accessKeyID: AWS_ACCESS_KEY_ID,
  secretKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

async function sendMessage() {
  while (true) {
    try {
      await sqs.sendMessage({
        body: JSON.stringify({
          data: {
            id: crypto.randomUUID(),
            message: "Hello from Deno server",
          },
        }),
      });
      console.log("\x1b[32mSuccessfully sent message to SQS from Deno server\x1b[0m");
      break;
    } catch (error) {
      console.log("Failed to send message to SQS", error);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

sendMessage();
