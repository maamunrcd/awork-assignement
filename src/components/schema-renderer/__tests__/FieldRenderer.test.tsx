import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { FieldRenderer } from "@/components/schema-renderer/FieldRenderer";
import type { Field } from "@/types";

function Harness({ field, defaultValues = {} }: { field: Field; defaultValues?: Record<string, unknown> }) {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <FieldRenderer field={field} />
    </FormProvider>
  );
}

describe("FieldRenderer", () => {
  it("renders text field", () => {
    render(<Harness field={{ key: "t", label: "Text", type: "text", placeholder: "Type here" }} />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("renders number as spinbutton", () => {
    render(<Harness field={{ key: "n", label: "Num", type: "number" }} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders currency as numeric input", () => {
    const { container } = render(<Harness field={{ key: "m", label: "Money", type: "currency" }} />);
    expect(container.querySelector('input[type="number"]')).toBeTruthy();
  });

  it("renders textarea", () => {
    render(<Harness field={{ key: "ta", label: "Long", type: "textarea", placeholder: "Notes" }} />);
    expect(screen.getByPlaceholderText("Notes")).toBeInTheDocument();
  });

  it("renders select with options", () => {
    render(
      <Harness
        field={{
          key: "s",
          label: "Pick",
          type: "select",
          options: ["A", "B"],
          placeholder: "Choose",
        }}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders checkbox with label wired for click", () => {
    render(<Harness field={{ key: "c", label: "Agree to terms", type: "checkbox" }} />);
    expect(screen.getByLabelText(/agree to terms/i)).toBeInTheDocument();
  });

  it("renders date field as calendar popover trigger", () => {
    render(<Harness field={{ key: "d", label: "D", type: "date" }} />);
    expect(screen.getByRole("button", { name: /pick a date/i })).toBeInTheDocument();
  });

  it("renders time input", () => {
    const { container } = render(<Harness field={{ key: "tm", label: "T", type: "time" }} />);
    expect(container.querySelector('input[type="time"]')).toBeTruthy();
  });

  it("renders table field (empty state)", () => {
    render(
      <Harness
        field={{
          key: "rows",
          label: "Rows",
          type: "table",
          columns: [{ key: "a", label: "Col A", type: "text" }],
          editableColumns: ["a"],
        }}
        defaultValues={{ rows: [] }}
      />
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
