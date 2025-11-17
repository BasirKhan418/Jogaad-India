import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

// Convert Readable → text
async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

export async function writeLogToS3(message: string) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const folder = `logs/${yyyy}/${mm}/${dd}`;
  const filename = `${folder}/payments.log`;

  const timestamp = now.toISOString();
  const logLine = `[${timestamp}] ${message}\n`;

  try {
    let existing: string = "";

    try {
      const getCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: filename
      });

      const res = await s3.send(getCmd);
      if (res.Body) existing = await streamToString(res.Body as Readable);
    } catch (err) {
      // File does not exist — ignore
    }

    const putCmd = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      Body: existing + logLine,
      ContentType: "text/plain"
    });

    await s3.send(putCmd);
  } catch (err) {
    console.error("S3 Log Error:", err);
  }
}

export async function fetchLogFromS3(dateString: string) {
  const [yyyy, mm, dd] = dateString.split("-");
  const filename = `logs/${yyyy}/${mm}/${dd}/payments.log`;

  try {
    const getCmd = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename
    });

    const res = await s3.send(getCmd);
    if (!res.Body) return null;

    return await streamToString(res.Body as Readable);
  } catch (err) {
    return null;
  }
}
