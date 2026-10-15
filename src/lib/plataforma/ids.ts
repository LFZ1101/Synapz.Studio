import { randomBytes } from "crypto";

export function createId(prefix?: string) {
  const id = randomBytes(12).toString("hex");
  return prefix ? `${prefix}_${id}` : id;
}

export function createToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}
