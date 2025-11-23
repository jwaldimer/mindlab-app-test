const crypto = require("crypto");

const RAW_SECRET = process.env.ENCRYPTION_SECRET;
const SECRET = String(RAW_SECRET);
const KEY = crypto.createHash("sha256").update(SECRET).digest();
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return null;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return `${iv.toString("base64")}:${encrypted}`;
}

function decrypt(encryptedText) {
  if (!encryptedText) return null;

  const [ivB64, encryptedB64] = encryptedText.split(":");
  const iv = Buffer.from(ivB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  let decrypted = decipher.update(encryptedB64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
