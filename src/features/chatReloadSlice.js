import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatReload: false, // initial state
};

const chatReloadSlice = createSlice({
  name: "chatReload",
  initialState,
  reducers: {
    toggleChatReload: (state) => {
      state.chatReload = !state.chatReload; // toggles the chatReload state
    },
    setChatReload: (state, action) => {
      state.chatReload = action.payload; // sets chatReload to a specific value
    },
  },
});

export const { toggleChatReload, setChatReload } = chatReloadSlice.actions;

export default chatReloadSlice.reducer;
