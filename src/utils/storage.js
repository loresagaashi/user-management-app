const KEY = "localUsers";
const KEY_DELETED = "deletedUserIds";

function canUseStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function loadLocalUsers() {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalUsers(users) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(users || []));
  } catch {
  }
}

export function loadDeletedIds() {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY_DELETED);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveDeletedIds(ids) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(KEY_DELETED, JSON.stringify(Array.from(new Set(ids))));
  } catch {
  }
}
