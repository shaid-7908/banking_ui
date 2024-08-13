import { createSlice } from "@reduxjs/toolkit";


const initialState={
    messages:[]
}
const messageHistorySlice = createSlice({
  name: "messageHistory",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessageHistory: (state, action) => {
      state.messages = action.payload;
    },
    clearMessageHistory: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setMessageHistory, clearMessageHistory } =
  messageHistorySlice.actions;

export default messageHistorySlice.reducer;
