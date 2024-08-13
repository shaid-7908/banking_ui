// streamedAiMessagesSlice.js
import { createSlice } from "@reduxjs/toolkit";
 
 const initialState ={
    combinedStreamedAiMessages: "",
    combinedAttemptMessage: "",
  }
 const streamedAiMessagesSlice = createSlice({
   name: "streamedAiMessages",
   initialState,
   reducers: {
     setCombinedStreamedAiMessages: (state, action) => {
       state.combinedStreamedAiMessages = action.payload;
     },
     setCombinedAttemptMessage: (state, action) => {
       state.combinedAttemptMessage = action.payload;
     },
     appendToCombinedStreamedAiMessages: (state, action) => {
       state.combinedStreamedAiMessages += action.payload; // Append new data
     },
     appendToCombinedAttemptMessage: (state, action) => {
       state.combinedAttemptMessage += action.payload; // Append new data
     },
   },
 });

export const { setCombinedStreamedAiMessages, setCombinedAttemptMessage,appendToCombinedAttemptMessage,appendToCombinedStreamedAiMessages } =
  streamedAiMessagesSlice.actions;
export default streamedAiMessagesSlice.reducer;
