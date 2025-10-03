export function resolveField(obj, field) {
  if (!obj || !field) return undefined;
  if (typeof field !== "string") return obj[field];
  if (!field.includes(".")) return obj[field];
  return field.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}
