// /lib/seedanceLimiter.ts

const MAX_CONCURRENT_TASKS = 3;
const MAX_REQUESTS_PER_MINUTE = 5;

const activeTasks = new Map<string, number>();
const requestLog = new Map<string, number[]>();

/**
 * Check if the user can start a new Seedance video generation task
 */
export function canStartNewTask(userId: string): boolean {
  const current = activeTasks.get(userId) || 0;
  return current < MAX_CONCURRENT_TASKS;
}

/**
 * Log task start — increments concurrency and logs timestamp
 */
export function markTaskStart(userId: string): void {
  const now = Date.now();

  // Concurrency tracking
  const current = activeTasks.get(userId) || 0;
  activeTasks.set(userId, current + 1);

  // Rate tracking
  const history = requestLog.get(userId) || [];
  const updatedHistory = [...history.filter(t => now - t < 60_000), now];
  requestLog.set(userId, updatedHistory);
}

/**
 * Log task end — decrements concurrency count
 */
export function markTaskEnd(userId: string): void {
  const current = activeTasks.get(userId) || 1;
  activeTasks.set(userId, Math.max(0, current - 1));
}

/**
 * Check if user is under the 5 requests/minute limit
 */
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const history = requestLog.get(userId) || [];
  const recent = history.filter(t => now - t < 60_000);
  return recent.length < MAX_REQUESTS_PER_MINUTE;
}
