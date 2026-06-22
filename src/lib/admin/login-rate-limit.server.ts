const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type AttemptRecord = {
  count: number;
  lockedUntil: number;
};

const attemptsByEmail = new Map<string, AttemptRecord>();

function getRecord(email: string) {
  return attemptsByEmail.get(email);
}

export function assertLoginNotLocked(email: string) {
  const record = getRecord(email);
  if (!record) return;

  const now = Date.now();
  if (record.lockedUntil > now) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60_000);
    throw new Error(
      `Demasiados intentos fallidos. Espera ${minutesLeft} minuto${minutesLeft === 1 ? "" : "s"} e intenta de nuevo.`,
    );
  }

  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    attemptsByEmail.delete(email);
  }
}

export function recordLoginFailure(email: string) {
  const now = Date.now();
  const current = getRecord(email);
  const count = (current?.count ?? 0) + 1;

  if (count >= MAX_ATTEMPTS) {
    attemptsByEmail.set(email, { count, lockedUntil: now + LOCKOUT_MS });
    return;
  }

  attemptsByEmail.set(email, { count, lockedUntil: 0 });
}

export function clearLoginFailures(email: string) {
  attemptsByEmail.delete(email);
}

export function getLoginLockStatus(email: string) {
  const record = getRecord(email);
  if (!record || record.lockedUntil <= Date.now()) {
    return { locked: false as const, minutesLeft: 0 };
  }

  return {
    locked: true as const,
    minutesLeft: Math.ceil((record.lockedUntil - Date.now()) / 60_000),
  };
}

export async function delayLoginResponse(ms = 1200) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
