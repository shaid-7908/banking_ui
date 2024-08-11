//import React from 'react'
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Humanreply from "./Humanreply";
import Aichatreply from "./Aichatreply";
import { useSelector, useDispatch } from "react-redux";
import { create_session } from "../features/session/sessionSlice";
import { LuSendHorizonal } from "react-icons/lu";
import { MagnifyingGlass } from "react-loader-spinner";
import ClipLoader from "react-spinners/ClipLoader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
const EXPIRATION_TIME = 2 * 60 * 60 * 1000;

function ChatPage() {
  const [humanquestion, setHumanquestion] = useState("");
  const [messageHistory, setMessageHistory] = useState([{}]);
  const [airesponse, setAiresponse] = useState("");
  const [preloading, setPreloading] = useState(false);
  const [loading, setLoading] = useState("stop");
  const [id, setId] = useState(null);
  const [attemptmessages, setAttemptmessages] = useState([]);
  const [combinedAttemptMessage, setCombinedAttemptMessage] = useState("");
  const [sqlresult, setSqlresult] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [columnTypes, setColumnTypes] = useState([]);
  const [streamedAiMessages, setStreamedAiMessages] = useState([]);
  const [isStreamingResponse2, setIsStreamingResponse2] = useState(false);
  const [combinedStreamedAiMessages, setCombinedStreamedAiMessages] =
    useState("");
  const [liveMessageComponentStatus, setLiveMessageComponentStatus] =
    useState(false);

  const combinedStreamedAiMessagesRef = useRef(combinedStreamedAiMessages);

  const columnRef = useRef(columns2);

  const sqlresultRef = useRef(sqlresult);

  const columnTypeRef = useRef(columnTypes);
  const sqlQueryRef = useRef(sqlQuery);

  const scrollRef = useRef(null);
  //console.log(messageHistory, "messagehistory");
  const session_id = useSelector((state) => state.session_id);
  console.log(session_id, "new");
  const dispatch = useDispatch();

  const renderers = {
    table: ({ ...props }) => (
      <table
        className="w-[50%] border-[1px] text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400"
        {...props}
      />
    ),
    thead: ({ ...props }) => (
      <thead
        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        {...props}
      />
    ),
    tr: ({ ...props }) => (
      <tr
        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b rounded-md dark:border-gray-700"
        {...props}
      />
    ),
    td: ({ ...props }) => <td className="px-6 py-4" {...props} />,
    th: ({ ...props }) => <th className="px-6 py-4" {...props} />,
    p: ({ ...props }) => <p className="w-[60%]" {...props} />,
  };
  const handleChange = (e) => {
    setHumanquestion(e.target.value);
  };

  const emptyDivRef = useRef(null);

  useEffect(() => {
    if (emptyDivRef.current) {
      emptyDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [airesponse, messageHistory,liveMessageComponentStatus,combinedStreamedAiMessages]);

  useEffect(() => {
    const storedId = localStorage.getItem("session_id");
    const storedTimestamp = localStorage.getItem("session_timestamp");

    const isExpired =
      !storedTimestamp ||
      new Date().getTime() - storedTimestamp > EXPIRATION_TIME;

    let newId;
    if (storedId && !isExpired) {
      newId = storedId;
    } else {
      newId = uuidv4();
      localStorage.setItem("session_id", newId);
      localStorage.setItem("session_timestamp", new Date().getTime());
    }

    dispatch(create_session(newId));
    async function fetch_chat_history() {
      await axios
        .get(
          `https://workmate-banking-api.onrender.com/sql_chain/chats/${session_id}`
        )
        .then((res) => setMessageHistory(res.data));
      console.log("hello");
    }
    fetch_chat_history();
  }, [session_id]);




  useEffect(() => {
    sqlQueryRef.current = sqlQuery;
  }, [sqlQuery]);
  useEffect(() => {
    combinedStreamedAiMessagesRef.current = combinedStreamedAiMessages;
  }, [combinedStreamedAiMessages]);
  useEffect(() => {
    columnTypeRef.current = columnTypes;
  }, [columnTypes]);
  useEffect(() => {
    columnRef.current = columns2;
  }, [columns2]);

  useEffect(() => {
    sqlresultRef.current = sqlresult;
  }, [sqlresult]);
  const fetchStream = async () => {
    let req_id = uuidv4();
    if (!humanquestion.trim()) {
      alert("Please enter a question.");
      return;
    }
    setHumanquestion("");
    if (session_id) {
      const humanmessage = {
        message: humanquestion,
        sender: "Human",
        session_id: session_id,
        sql_query: "",
      };
      setPreloading(true);
      setMessageHistory((prev) => [...prev, humanmessage]);
      setLoading("loading");

      try {
        // Reset combinedStreamedAiMessages before starting a new fetch
        setCombinedStreamedAiMessages("");

        const response = await fetch(
          "https://workmate-banking-api.onrender.com/sql_chain/sql_generator/get_sql/v1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              question: humanquestion,
              uuid: session_id,
              request_id: req_id,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch stream:", response.statusText);
          setLoading("stop");
          setPreloading(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let partialMessage = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          partialMessage += decoder.decode(value, { stream: true });

          const messagesArray = partialMessage.split("\n\n");

          partialMessage = messagesArray.pop();

          setAttemptmessages((prevMessages) => [
            ...prevMessages,
            ...messagesArray.filter(Boolean),
          ]);

          setCombinedAttemptMessage(
            (prevCombined) =>
              prevCombined + messagesArray.filter(Boolean).join("\n\n")
          );
        }

        if (partialMessage) {
          setAttemptmessages((prevMessages) => [
            ...prevMessages,
            partialMessage,
          ]);
          setCombinedAttemptMessage(
            (prevCombined) => prevCombined + partialMessage
          );
        }

        setLoading("stop");
        setLiveMessageComponentStatus(true);
        setIsStreamingResponse2(true);

        const [response2, response3] = await Promise.all([
          fetch(
            "https://workmate-banking-api.onrender.com/sql_chain/sql_generator/get_nlr/v1",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                question: humanquestion,
                session_id: session_id,
                request_id: req_id,
              }),
            }
          ),
          fetch(
            "https://workmate-banking-api.onrender.com/sql_chain/actual_data",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                request_id: req_id,
              }),
            }
          ),
        ]);

        if (!response2.ok) {
          console.error("Failed to fetch stream:", response2.statusText);
          setIsStreamingResponse2(false);
          return;
        }

        const reader2 = response2.body.getReader();
        const decoder2 = new TextDecoder("utf-8");

        let partialMessage2 = "";

        while (true) {
          const { done, value } = await reader2.read();
          if (done) break;

          partialMessage2 += decoder2.decode(value, { stream: true });

          const messagesArray2 = partialMessage2.split("\n\n");

          partialMessage2 = messagesArray2.pop();

          setStreamedAiMessages((prevMessages) => [
            ...prevMessages,
            ...messagesArray2.filter(Boolean),
          ]);

          setCombinedStreamedAiMessages(
            (prevCombined) =>
              prevCombined + messagesArray2.filter(Boolean).join("\n\n")
          );
        }

        if (partialMessage2) {
          setStreamedAiMessages((prevMessages) => [
            ...prevMessages,
            partialMessage2,
          ]);
          setCombinedStreamedAiMessages(
            (prevCombined) => prevCombined + partialMessage2
          );
        }

        setIsStreamingResponse2(false);

        if (response3.ok) {
          const responseData = await response3.json();

          setSqlresult(responseData.results);
          setSqlQuery(responseData.query);
          setColumns2(responseData.columns);
          setColumnTypes(responseData.column_types);
        } else {
          console.error("Failed to fetch response3:", response3.statusText);
        }

        // Use useEffect to watch for changes in combinedStreamedAiMessages
        setTimeout(() => {
          console.log(
            combinedStreamedAiMessages,
            "combined message before updating Aimessage"
          );
          // const finalCombinedStreamedAiMessages = combinedStreamedAiMessages;

          const Aimessage = {
            message: combinedStreamedAiMessagesRef.current,
            sender: "Ai",
            sql_query: sqlQueryRef.current,
            columns: columnRef.current,
            rows: sqlresultRef.current,
            column_types: columnTypeRef.current,
          };
          console.log(Aimessage, "op ai");
          setMessageHistory((prev) => [...prev, Aimessage]);
          
          setLiveMessageComponentStatus(false);
          setCombinedStreamedAiMessages("");
          setCombinedAttemptMessage("");
          setColumns2([]);
          setSqlresult([]);
        }, 200);
      } catch (error) {
        console.error("An error occurred:", error);
        setLoading("stop");
        setPreloading(false);
      }
    } else {
      alert("no session id found");
    }
  };

  console.log(columnTypes, "cl types");
  return (
    <div className="h-[100vh - 70px] bg-slate-100 flex-[80%] mt-[70px] text-cyan-950 p-4">
      <div className="h-[75vh] overflow-y-scroll w-full " ref={scrollRef}>
        {/*Component for human chat*/}
        {messageHistory.map((msg, index) => {
          if (msg.sender === "Human") {
            return (
              <div key={index} className="flex justify-end p-4 ">
                <Humanreply chatdata={msg} />
              </div>
            );
          }
          if (msg.sender === "Ai") {
            return (
              <div key={`${index}-${uuidv4()}`}>
                <Aichatreply chatdata={msg} />
              </div>
            );
          }
        })}

        {/*Live component */}
        {liveMessageComponentStatus ? (
          <div
            className="w-full border-[1px] p-2 rounded-md mb-4 bg-white"
            style={{ boxShadow: "0 5px 5px rgba(0, 0, 0, 0.05)" }}
          >
            <div className="bg-slate-800 text-white overflow-y-scroll w-[75vw]">
              <Markdown rehypePlugins={[remarkGfm]}>
                {combinedAttemptMessage}
              </Markdown>
            </div>

            <div className="h-[30vh] overflow-y-scroll w-[75vw] overflow-x-scroll rounded-md border-[1px] ">
              <table className="w-full border-[1px] text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    {columns2?.map((column, index) => (
                      <th className="px-6 py-4" key={index}>
                        {column.replace("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sqlresult?.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      {columns2?.map((column, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                          {typeof row[column] === "number"
                            ? row[column].toFixed(2)
                            : row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-y-scroll w-[75vw]">
              <Markdown rehypePlugins={[remarkGfm]} components={renderers}>
                {combinedStreamedAiMessages}
              </Markdown>
              {isStreamingResponse2 ? <ClipLoader size={14} /> : <span></span>}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {/*Component for Ai chat */}

        <div className="">
          {/* {airesponse && airesponse.message && (
          <Markdown rehypePlugins={[remarkGfm]} components={renderers}>{`${airesponse.message}`}</Markdown>
        )} */}
          {/* {airesponse && <Aichatreply chatdata={airesponse} />} */}
          {preloading && loading === "loading" ? (
            <div
              className="border-[1px] w-[30%] bg-white rounded-md py-2 px-4 flex items-center my-2"
              style={{ boxShadow: "0 5px 5px rgba(0, 0, 0, 0.05)" }}
            >
              <div>
                <MagnifyingGlass
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="magnifying-glass-loading"
                  wrapperStyle={{}}
                  wrapperClass="magnifying-glass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              </div>
              Analyzing response...
            </div>
          ) : (
            <span></span>
          )}
        </div>
        <div ref={emptyDivRef} style={{ height: "1px" }}></div>
      </div>

      {/*Input component */}
      <div
        className="w-full sticky p-4 bottom-0 flex justify-center"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(0.5px)",
          WebkitBackdropFilter: "blur(0.5px)",
        }}
      >
        <div className="w-[70%] bg-white border-[1px] p-4  flex justify-between items-center rounded-md">
          <textarea
            className="border-none outline-none w-[80%] h-20 resize-none overflow-y-auto"
            placeholder="Type your message here"
            value={humanquestion}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevents the default action of adding a newline
                fetchStream();
              }
            }}
          />
          <div onClick={fetchStream} className="cursor-pointer p-4">
            <div className="text-2xl">
              <LuSendHorizonal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
