export function generateRandomKey(): string {
  const KEY_LENGTH = 7;
  return (Math.random() + 1).toString(36).substring(KEY_LENGTH);
}
