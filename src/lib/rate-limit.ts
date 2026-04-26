const windowMs = 60_000;
const maxRequests = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now > row.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (row.count >= maxRequests) return false;
  row.count += 1;
  return true;
}
