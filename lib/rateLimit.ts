const buckets = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, limitPerMin = 10) {
  const now = Date.now();
  const windowMs = 60_000;
  const b = buckets.get(key);
  if (!b || now > b.resetAt) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return { ok: true }; }
  if (b.count >= limitPerMin) return { ok: false };
  b.count += 1; buckets.set(key, b); return { ok: true };
}
