import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"

const ALGORITHM = "aes-256-gcm"
// ponytail: fixed salt — per-token salts if key rotation ever needed
const SALT = "star-trail-v1"

function getKey(): Buffer {
  const passphrase = process.env.ENCRYPTION_PASSPHRASE
  if (!passphrase) throw new Error("ENCRYPTION_PASSPHRASE is not set")
  return scryptSync(passphrase, SALT, 32)
}

export function encrypt(text: string): string {
  const key = getKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString("base64")
}

export function decrypt(data: string): string {
  const key = getKey()
  const buf = Buffer.from(data, "base64")
  const iv = buf.subarray(0, 16)
  const tag = buf.subarray(16, 32)
  const encrypted = buf.subarray(32)
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")
}
