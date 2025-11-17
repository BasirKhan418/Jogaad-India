import fs from "fs";
import path from "path";

export function writeLog(message: string) {
  try {
    const logDir = path.join(process.cwd(), "logs");

    // Create /logs folder if not exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const logFile = path.join(logDir, "payments.log");

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFile, logMessage);
  } catch (error) {
    console.error("Error writing log:", error);
  }
}
