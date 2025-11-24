// src/App.tsx
import DataTable from "./components/DataTable";
import AddRowForm from "./components/AddRowForm";

export default function App() {
  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1>React Table — Assessment</h1>
      <p>
        Features: Pagination(10/page), Global filter, Sort, Export filtered to
        Excel, Add via form (react-hook-form), Redux Toolkit
      </p>

      <AddRowForm />

      <DataTable />
    </div>
  );
}
