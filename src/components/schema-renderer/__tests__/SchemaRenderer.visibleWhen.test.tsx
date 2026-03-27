import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SchemaRenderer } from "@/components/schema-renderer/SchemaRenderer";
import type { TaskSchema } from "@/types";

vi.mock("@/hooks/use-command-center", () => ({
  useCommandCenter: () => ({
    role: "processor" as const,
    user: { id: "user-1", name: "Test", role: "processor" as const, tenantId: "t1", region: "US" },
    setRole: vi.fn(),
    tasks: [],
    selectedTaskId: null,
    setSelectedTaskId: vi.fn(),
    filters: { client: [], region: [], category: [], status: [], searchQuery: "" },
    setFilters: vi.fn(),
    resetFilters: vi.fn(),
    sortBy: "priority" as const,
    setSortBy: vi.fn(),
    setTasks: vi.fn(),
    setUser: vi.fn(),
  }),
}));

const schemaWithVisibleWhen: TaskSchema = {
  schemaRef: "visible-when-test",
  title: "Conditional step",
  description: "Tests visibleWhen",
  sections: [
    {
      key: "main",
      heading: "Main",
      fields: [
        {
          key: "mode",
          label: "Mode",
          type: "select",
          options: ["ShowExtra", "HideExtra"],
          required: true,
        },
        {
          key: "extra",
          label: "Extra field",
          type: "text",
          placeholder: "Only when Mode is ShowExtra",
          visibleWhen: { field: "mode", equals: "ShowExtra" },
        },
      ],
    },
  ],
  actions: [{ key: "done", label: "Done", variant: "outline" }],
  roleVisibility: {
    processor: { hiddenFields: [], hiddenSections: [], disabledActions: [] },
    attorney: { hiddenFields: [], hiddenSections: [], disabledActions: [] },
  },
};

describe("SchemaRenderer visibleWhen", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hides dependent field until controlling field has a value, then shows when condition matches", async () => {
    render(<SchemaRenderer schema={schemaWithVisibleWhen} initialData={{}} taskId="t1" />);

    expect(screen.queryByPlaceholderText(/only when mode is showextra/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "ShowExtra" } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/only when mode is showextra/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "HideExtra" } });

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/only when mode is showextra/i)).not.toBeInTheDocument();
    });
  });
});
