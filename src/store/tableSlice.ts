import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PersonRow } from "../types/RowTypes";

const dummy: PersonRow[] = Array.from({ length: 35 }).map((_, i) => ({
  id: String(i + 1),
  firstName: `First${i + 1}`,
  lastName: `Last${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `9000000${100 + i}`,
  city: ["Mumbai", "Delhi", "Pune", "Bangalore"][i % 4]
}));

interface TableState {
  rows: PersonRow[];
}

const initialState: TableState = {
  rows: dummy
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addRow(state, action: PayloadAction<PersonRow>) {
      state.rows.unshift(action.payload);
    },
    setRows(state, action: PayloadAction<PersonRow[]>) {
      state.rows = action.payload;
    }
  }
});

export const { addRow, setRows } = tableSlice.actions;
export default tableSlice.reducer;
