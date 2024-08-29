//import React from 'react'
import { useState } from "react";
import { useDispatch } from "react-redux"
import { clearMessageHistory } from "../features/messageHistorySlice"
import { create_session } from "../features/session/sessionSlice";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";
import axios from 'axios'
const EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours

function Sidebar() {
  const dispatch_in = useDispatch()
  const [sessionHistory,setSessionHistory]=useState([])
  useEffect(()=>{
     axios
       .get(
         "https://workmate-banking-api.onrender.com/sql_chain/session_history_and_chats",
         {
           headers: {
             accept: "application/json",
           },
         }
       )
       .then((response) => {
         console.log(response.data);
         setSessionHistory(response.data);
         // You can handle the data here
       })
       .catch((error) => {
         console.error("Failed to fetch session history and chats:", error);
         // You can handle the error here
       });
  },[])

  const handleNewChat =()=>{
    // Generate a new session ID
    const newSessionId = uuidv4();

    // Set the new session ID and timestamp in local storage
    localStorage.setItem("session_id", newSessionId);
    localStorage.setItem("session_timestamp", new Date().getTime());
    dispatch_in(create_session(newSessionId))
    dispatch_in(clearMessageHistory());
  }
  return (
    <div className=" left-0 flex-[20%] bottom-0 z-10 flex flex-col items-center justify-start bg-white border-r  h-screen">
      <button
        className="bg-white text-sm w-64 border mt-[88px] px-3 py-2 rounded-md flex items-center justify-between"
        onClick={handleNewChat}
      >
        <span className="">New Chat</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.75"
          stroke="currentColor"
          aria-hidden="true"
          data-slot="icon"
          className="h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          ></path>
        </svg>
      </button>
      <div className="w-64 my-4 ">
        <h2 className="font-semibold text-slate-400">History :</h2>
        {sessionHistory.map((e, index) => (
          <div className="my-2 text-sm text-slate-400 bg-slate-200 px-1 py-2 rounded-md" key={index} >{e.first_message}</div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar