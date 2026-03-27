import { describe, it, expect } from "vitest";
import { isFieldVisibleForControllingValue } from "@/lib/field-visibility";
import type { Field } from "@/types";

function field(partial: Pick<Field, "visibleWhen">): Pick<Field, "visibleWhen"> {
  return partial;
}

describe("isFieldVisibleForControllingValue", () => {
  it("shows field when there is no visibleWhen", () => {
    expect(isFieldVisibleForControllingValue(field({}), "anything")).toBe(true);
  });

  it("hides when controlling value is unset (null, undefined, empty string)", () => {
    const f = field({
      visibleWhen: { field: "x", equals: "A" },
    });
    expect(isFieldVisibleForControllingValue(f, null)).toBe(false);
    expect(isFieldVisibleForControllingValue(f, undefined)).toBe(false);
    expect(isFieldVisibleForControllingValue(f, "")).toBe(false);
  });

  it("supports equals with string and boolean", () => {
    const str = field({ visibleWhen: { field: "decision", equals: "Defects Found" } });
    expect(isFieldVisibleForControllingValue(str, "Defects Found")).toBe(true);
    expect(isFieldVisibleForControllingValue(str, "Clear")).toBe(false);

    const bool = field({ visibleWhen: { field: "flag", equals: true } });
    expect(isFieldVisibleForControllingValue(bool, true)).toBe(true);
    expect(isFieldVisibleForControllingValue(bool, false)).toBe(false);
  });

  it("treats false as a real value for boolean conditions (not hidden as unset)", () => {
    const f = field({ visibleWhen: { field: "flag", equals: true } });
    expect(isFieldVisibleForControllingValue(f, false)).toBe(false);
  });

  it("supports notEquals", () => {
    const f = field({ visibleWhen: { field: "status", notEquals: "Closed" } });
    expect(isFieldVisibleForControllingValue(f, "Open")).toBe(true);
    expect(isFieldVisibleForControllingValue(f, "Closed")).toBe(false);
  });
});
