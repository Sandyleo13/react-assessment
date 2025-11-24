// src/utils/exportExcel.ts
import * as XLSX from "xlsx";
import type { PersonRow } from "../types/RowTypes";

export function exportToExcel(rows: PersonRow[], fileName = "export.xlsx") {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName);
}
