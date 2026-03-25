export function exportToCsv<T>(
  filename: string,
  data: T[],
  columns: { key: keyof T; label: string }[],
) {
  if (data.length === 0) return;

  const header = columns.map((c) => c.label).join(",");

  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key];
        const str = String(value ?? "");
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(","),
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
