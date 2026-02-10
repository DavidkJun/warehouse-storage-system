import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function encodePassword(rawPassword: string): Promise<string> {
  return await bcrypt.hash(rawPassword, SALT_ROUNDS);
}

export async function comparePasswords(
  rawPass: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(rawPass, hash);
}