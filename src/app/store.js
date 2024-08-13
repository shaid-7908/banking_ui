import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from '../features/session/sessionSlice'
import humanQuestionReducer from '../features/humanQuestionSlice'
import messageHistoryReducer from '../features/messageHistorySlice'
import loadingReducer from '../features/loadingSlice'
import streamedAiMessageReducer from '../features/streamedAiMessageSlice'
import sqlDataReducer from '../features/sqlDataSlice'
import streaminResponseReducer from "../features/streaminResponseSlice";
import chatReloadReducer from "../features/chatReloadSlice"

export const store = configureStore({
  reducer: {
    session:sessionReducer,
    humanQuestion:humanQuestionReducer,
    messageHistory:messageHistoryReducer,
    loadingState:loadingReducer,
    streamingMessage:streamedAiMessageReducer,
    sqlData:sqlDataReducer,
    streaminResponse:streaminResponseReducer,
    chatReload:chatReloadReducer
  }
});
