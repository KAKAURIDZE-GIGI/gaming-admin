import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportToCsv } from "../exportCsv";

describe("exportToCsv", () => {
  let mockClick: ReturnType<typeof vi.fn>;
  let mockLink: Record<string, unknown>;

  beforeEach(() => {
    mockClick = vi.fn();
    mockLink = { href: "", download: "", click: mockClick };

    vi.spyOn(document, "createElement").mockReturnValue(
      mockLink as unknown as HTMLElement,
    );
    URL.createObjectURL = vi.fn(() => "blob:mock-url");
    URL.revokeObjectURL = vi.fn();
  });

  it("should not create a download for empty data", () => {
    exportToCsv("test", [], [{ key: "name", label: "Name" }]);
    expect(mockClick).not.toHaveBeenCalled();
  });

  it("should generate correct CSV content", () => {
    let blobContent = "";
    const OriginalBlob = globalThis.Blob;
    globalThis.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContent = parts.join("");
      }
    } as unknown as typeof Blob;

    const data = [
      { name: "Alice", score: 100 },
      { name: "Bob", score: 200 },
    ];

    exportToCsv("scores", data, [
      { key: "name", label: "Name" },
      { key: "score", label: "Score" },
    ]);

    expect(blobContent).toBe("Name,Score\nAlice,100\nBob,200");
    expect(mockLink.download).toBe("scores.csv");
    expect(mockClick).toHaveBeenCalled();

    globalThis.Blob = OriginalBlob;
  });

  it("should escape values with commas", () => {
    let blobContent = "";
    const OriginalBlob = globalThis.Blob;
    globalThis.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContent = parts.join("");
      }
    } as unknown as typeof Blob;

    exportToCsv(
      "test",
      [{ name: "Hello, World" }],
      [{ key: "name", label: "Name" }],
    );
    expect(blobContent).toBe('Name\n"Hello, World"');

    globalThis.Blob = OriginalBlob;
  });

  it("should escape values with quotes", () => {
    let blobContent = "";
    const OriginalBlob = globalThis.Blob;
    globalThis.Blob = class MockBlob {
      constructor(parts: string[]) {
        blobContent = parts.join("");
      }
    } as unknown as typeof Blob;

    exportToCsv(
      "test",
      [{ name: 'Say "hello"' }],
      [{ key: "name", label: "Name" }],
    );
    expect(blobContent).toBe('Name\n"Say ""hello"""');

    globalThis.Blob = OriginalBlob;
  });
});
