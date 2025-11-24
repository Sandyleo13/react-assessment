// src/components/DataTable.tsx
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { PersonRow } from "../types/RowTypes";
import { exportToExcel } from "../utils/exportExcel";

export default function DataTable() {
  const rows = useSelector((s: RootState) => s.table.rows) as PersonRow[];

  const [globalFilter, setGlobalFilter] = useState("");
  const [sortBy, setSortBy] = useState<{ id: keyof PersonRow | null; desc: boolean }>({ id: null, desc: false });
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = useMemo(() => {
    if (!globalFilter) return rows.slice();
    const q = globalFilter.toLowerCase();
    return rows.filter(r =>
      Object.values(r).some(v => (v ?? "").toString().toLowerCase().includes(q))
    );
  }, [rows, globalFilter]);

  const sorted = useMemo(() => {
    if (!sortBy.id) return filtered;
    const arr = filtered.slice().sort((a, b) => {
      const av = (a[sortBy.id!] ?? "").toString();
      const bv = (b[sortBy.id!] ?? "").toString();
      if (av < bv) return sortBy.desc ? 1 : -1;
      if (av > bv) return sortBy.desc ? -1 : 1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy]);

  const pageCount = Math.ceil(sorted.length / pageSize);
  const pageRows = sorted.slice(page * pageSize, page * pageSize + pageSize);

  function toggleSort(column: keyof PersonRow) {
    if (sortBy.id === column) {
      setSortBy({ id: column, desc: !sortBy.desc });
    } else {
      setSortBy({ id: column, desc: false });
    }
  }

  function handleExport() {
    exportToExcel(sorted, "table-export.xlsx");
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input placeholder="Global search..." value={globalFilter} onChange={(e) => { setGlobalFilter(e.target.value); setPage(0); }} />
        <button onClick={() => { setGlobalFilter(""); setPage(0); }}>Clear</button>
        <button onClick={handleExport}>Export filtered → Excel</button>
        <div style={{ marginLeft: "auto" }}>
          <strong>{sorted.length}</strong> results
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => toggleSort("firstName")}>
                First {sortBy.id === "firstName" ? (sortBy.desc ? "▼" : "▲") : ""}
              </th>
              <th style={thStyle} onClick={() => toggleSort("lastName")}>
                Last {sortBy.id === "lastName" ? (sortBy.desc ? "▼" : "▲") : ""}
              </th>
              <th style={thStyle} onClick={() => toggleSort("email")}>
                Email {sortBy.id === "email" ? (sortBy.desc ? "▼" : "▲") : ""}
              </th>
              <th style={thStyle} onClick={() => toggleSort("phone")}>
                Phone {sortBy.id === "phone" ? (sortBy.desc ? "▼" : "▲") : ""}
              </th>
              <th style={thStyle} onClick={() => toggleSort("city")}>
                City {sortBy.id === "city" ? (sortBy.desc ? "▼" : "▲") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle} data-label="First">{r.firstName}</td>
                <td style={tdStyle} data-label="Last">{r.lastName}</td>
                <td style={tdStyle} data-label="Email">{r.email}</td>
                <td style={tdStyle} data-label="Phone">{r.phone}</td>
                <td style={tdStyle} data-label="City">{r.city}</td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 20 }}>No results</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={() => setPage(0)} disabled={page === 0}>First</button>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
        <span>Page {page + 1} of {pageCount}</span>
        <button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page + 1 >= pageCount}>Next</button>
        <button onClick={() => setPage(pageCount - 1)} disabled={page + 1 >= pageCount}>Last</button>
        <div style={{ marginLeft: "auto" }}>
          <small>Showing {pageRows.length} of {sorted.length}</small>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  cursor: "pointer",
  background: "#f7f7f7",
  fontWeight: 600,
  whiteSpace: "nowrap"
};

const tdStyle: React.CSSProperties = {
  padding: "8px 10px",
  verticalAlign: "middle",
  whiteSpace: "nowrap"
};
