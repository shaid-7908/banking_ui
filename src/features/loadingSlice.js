// loadingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    loadingStatus:'stop'
}
const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) =>{
        state.loadingStatus = action.payload
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
