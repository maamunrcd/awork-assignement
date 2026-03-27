import type { Field } from "@/types";

/**
 * Evaluates schema `visibleWhen` for a field given the controlling field's current value.
 * Hidden when control is unset (null/undefined/""). Booleans (including false) are real values.
 */
export function isFieldVisibleForControllingValue(
  field: Pick<Field, "visibleWhen">,
  controllingValue: unknown
): boolean {
  if (!field.visibleWhen) return true;
  if (
    controllingValue === undefined ||
    controllingValue === null ||
    controllingValue === ""
  ) {
    return false;
  }

  const { equals, notEquals } = field.visibleWhen;
  if (equals !== undefined) return controllingValue === equals;
  if (notEquals !== undefined) return controllingValue !== notEquals;

  return true;
}
