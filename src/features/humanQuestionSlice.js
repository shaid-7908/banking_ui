import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  humanQuestion: "",
};

export const humanQuestionSlice = createSlice({
  name: "humanQuestion_slice",
  initialState,
  reducers: {
    setHumanQuestion: (state, action) => {
      state.humanQuestion = action.payload;
    },
    clearHumanQuestion: (state) => {
      state.humanQuestion = "";
    },
  },
});

export const { setHumanQuestion, clearHumanQuestion } =
  humanQuestionSlice.actions;
export default humanQuestionSlice.reducer;
