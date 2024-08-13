// streamingResponseSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState={
    streaminResponseStatus:false,
    streaminResponseLoaderStatus:false,

}
const streamingResponseSlice = createSlice({
  name: "isStreamingResponse2",
  initialState,
  reducers: {
    setStreamingResponseStatus: (state, action) => {
      state.streaminResponseStatus = action.payload
    },
    setStreaminResponseLoaderStatus:(state,action)=>{
      state.streaminResponseLoaderStatus = action.payload
    }
  },
});

export const { setStreamingResponseStatus, setStreaminResponseLoaderStatus } =
  streamingResponseSlice.actions;
export default streamingResponseSlice.reducer;
