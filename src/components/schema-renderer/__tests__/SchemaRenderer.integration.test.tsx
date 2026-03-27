import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { SchemaRenderer } from "@/components/schema-renderer/SchemaRenderer";
import type { TaskSchema } from "@/types";

const mockSetRole = vi.fn();
const mockUser = { id: "user-1", name: "Test", role: "processor" as const, tenantId: "t1", region: "US" };

vi.mock("@/hooks/use-command-center", () => ({
  useCommandCenter: () => ({
    role: "processor" as const,
    user: mockUser,
    setRole: mockSetRole,
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

const minimalSchema: TaskSchema = {
  schemaRef: "integration-test",
  title: "Test step",
  description: "Minimal schema for integration test",
  sections: [
    {
      key: "main",
      heading: "Main",
      fields: [
        {
          key: "note",
          label: "Review note",
          type: "text",
          required: true,
          placeholder: "Enter note",
        },
      ],
    },
  ],
  actions: [
    {
      key: "submit",
      label: "Submit",
      variant: "primary",
      requiresAllRequired: true,
    },
    {
      key: "save",
      label: "Save draft",
      variant: "outline",
    },
  ],
  roleVisibility: {
    processor: { hiddenFields: [], hiddenSections: [], disabledActions: [] },
    attorney: { hiddenFields: [], hiddenSections: [], disabledActions: [] },
  },
};

describe("SchemaRenderer integration", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("enables primary action after required field is filled; secondary stays enabled", async () => {
    render(<SchemaRenderer schema={minimalSchema} initialData={{}} taskId="task-123" />);

    const primary = screen.getByRole("button", { name: /submit/i });
    const draft = screen.getByRole("button", { name: /save draft/i });

    expect(primary).toBeDisabled();
    expect(draft).not.toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Enter note"), { target: { value: "Done" } });

    await waitFor(() => expect(primary).not.toBeDisabled());

    fireEvent.click(primary);

    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
    expect(console.log).toHaveBeenCalled();
  });
});
