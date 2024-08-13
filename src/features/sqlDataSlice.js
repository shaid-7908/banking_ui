// sqlDataSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    sqlResult: [],
    sqlQuery: "",
    columns2: [],
    columnTypes: [],
  }
const sqlDataSlice = createSlice({
  name: "sqlData",
  initialState,
  reducers: {
    setSqlResult: (state, action) => {
      state.sqlResult = action.payload;
    },
    setSqlQuery: (state, action) => {
      state.sqlQuery = action.payload;
    },
    setColumns2: (state, action) => {
      state.columns2 = action.payload;
    },
    setColumnTypes: (state, action) => {
      state.columnTypes = action.payload;
    },
  },
});

export const { setSqlResult, setSqlQuery, setColumns2, setColumnTypes } =
  sqlDataSlice.actions;
export default sqlDataSlice.reducer;
