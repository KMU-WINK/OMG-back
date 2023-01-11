import crypto from "crypto";

const sha256 = (content: string) =>
  crypto.createHash("sha256").update(content).digest("hex");

export { sha256 };
