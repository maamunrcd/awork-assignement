import { describe, it, expect } from "vitest";
import {
  filterTasks,
  sortTasks,
  taskMatchesRegionFilter,
  type TaskFilters,
} from "@/lib/task-queue-logic";
import type { Task } from "@/types";

const base = (over: Partial<Task>): Task => ({
  id: "1",
  caseNumber: "C-1",
  stepName: "Step",
  category: "FC-Judicial",
  region: "US.IL.Cook",
  client: "Chase",
  priority: 5,
  slaDeadline: "2026-12-01T00:00:00Z",
  assignedRole: "processor",
  status: "pending",
  borrower: "Jane",
  propertyAddress: "1 Main",
  milestoneAtRisk: "m",
  revenueAtRisk: 1000,
  schemaRef: "review-title-search",
  ...over,
});

describe("taskMatchesRegionFilter", () => {
  it("matches exact region", () => {
    expect(taskMatchesRegionFilter("US.IL.Cook", ["US.IL.Cook"])).toBe(true);
  });

  it("matches hierarchical prefix (parent region in filter)", () => {
    expect(taskMatchesRegionFilter("US.IL.Cook", ["US.IL"])).toBe(true);
    expect(taskMatchesRegionFilter("US.TX.Dallas", ["US.IL"])).toBe(false);
  });

  it("does not match unrelated prefix (e.g. US vs USA)", () => {
    expect(taskMatchesRegionFilter("USA.NY", ["US"])).toBe(false);
  });
});

describe("filterTasks", () => {
  const tasks: Task[] = [
    base({ id: "a", caseNumber: "2025-FC-123", borrower: "Sarah Chen", client: "Chase", status: "pending", category: "FC-Judicial", region: "US.IL.Cook" }),
    base({
      id: "b",
      caseNumber: "2025-FC-456",
      borrower: "John Doe",
      client: "Wells Fargo",
      status: "in-progress",
      category: "FC-NonJudicial",
      region: "US.TX.Dallas",
    }),
  ];

  const emptyFilters: TaskFilters = { client: [], region: [], category: [], status: [], searchQuery: "" };

  it("returns all tasks when no filters", () => {
    expect(filterTasks(tasks, emptyFilters)).toHaveLength(2);
  });

  it("composes filters with AND logic", () => {
    const f: TaskFilters = {
      client: ["Chase"],
      status: ["in-progress"],
      category: [],
      region: [],
      searchQuery: "",
    };
    expect(filterTasks(tasks, f)).toHaveLength(0);

    expect(
      filterTasks(tasks, {
        client: ["Chase"],
        status: ["pending"],
        category: ["FC-Judicial"],
        region: [],
        searchQuery: "",
      })
    ).toHaveLength(1);
  });

  it("filters by region using hierarchy", () => {
    expect(
      filterTasks(tasks, {
        ...emptyFilters,
        region: ["US.IL"],
      })
    ).toHaveLength(1);
    expect(
      filterTasks(tasks, {
        ...emptyFilters,
        region: ["US.TX.Dallas"],
      })
    ).toHaveLength(1);
  });

  describe("search functionality", () => {
    it("filters by case number", () => {
      expect(filterTasks(tasks, { ...emptyFilters, searchQuery: "123" })).toHaveLength(1);
      expect(filterTasks(tasks, { ...emptyFilters, searchQuery: "123" })[0].id).toBe("a");
    });

    it("filters by borrower name (case-insensitive)", () => {
      expect(filterTasks(tasks, { ...emptyFilters, searchQuery: "chen" })).toHaveLength(1);
      expect(filterTasks(tasks, { ...emptyFilters, searchQuery: "CHEN" })[0].id).toBe("a");
    });

    it("returns empty for non-matching search", () => {
      expect(filterTasks(tasks, { ...emptyFilters, searchQuery: "xyz" })).toHaveLength(0);
    });
  });
});

describe("sortTasks", () => {
  const tasks: Task[] = [
    base({ id: "low", priority: 1, revenueAtRisk: 100, slaDeadline: "2026-06-01T00:00:00Z" }),
    base({ id: "mid", priority: 5, revenueAtRisk: 500, slaDeadline: "2026-03-01T00:00:00Z" }),
    base({ id: "high", priority: 10, revenueAtRisk: 1000, slaDeadline: "2026-12-01T00:00:00Z" }),
  ];

  it("sorts by priority descending by default expectation", () => {
    const sorted = sortTasks(tasks, "priority");
    expect(sorted.map((t) => t.id)).toEqual(["high", "mid", "low"]);
  });

  it("sorts by slaDeadline ascending", () => {
    const sorted = sortTasks(tasks, "slaDeadline");
    expect(sorted.map((t) => t.id)).toEqual(["mid", "low", "high"]);
  });

  it("sorts by revenueAtRisk descending", () => {
    const sorted = sortTasks(tasks, "revenueAtRisk");
    expect(sorted.map((t) => t.id)).toEqual(["high", "mid", "low"]);
  });
});
