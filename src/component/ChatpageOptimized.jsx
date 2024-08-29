import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import Inputbox from "./subcomponent/Inputbox";
import Livemessagecomponent from "./subcomponent/Livemessagecomponent";
import { create_session } from "../features/session/sessionSlice";
import { setMessageHistory } from "../features/messageHistorySlice";
import Aichatreply from "./Aichatreply";
import Humanreply from "./Humanreply";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { MagnifyingGlass } from "react-loader-spinner";


import Liveloader from "./subcomponent/Liveloader";

const EXPIRATION_TIME = 2 * 60 * 60 * 1000;

function ChatpageOptimized() {
  const renderCount = useRef(0); // Initialize render count
 const scrollRef = useRef(null);
  renderCount.current += 1;
  const [humanQuestion, setHumanQuestion] = useState("");
  //   const [messageHistory, setMessageHistory] = useState([]);
  const loading = useSelector((state) => state.loadingState.loadingStatus);
  const streaminResponseStatus = useSelector(
    (state) => state.streaminResponse.streaminResponseStatus
  );
  const [preloading, setPreloading] = useState(false);

  const [combinedStreamedAiMessages, setCombinedStreamedAiMessages] =
    useState("");
  const [combinedAttemptMessage, setCombinedAttemptMessage] = useState("");
  const [isStreamingResponse2, setIsStreamingResponse2] = useState(false);
  const [liveMessageComponentStatus, setLiveMessageComponentStatus] =
    useState(false);
  const [sqlresult, setSqlresult] = useState([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [columns2, setColumns2] = useState([]);
  const [columnTypes, setColumnTypes] = useState([]);
  const [streamedAiMessages, setStreamedAiMessages] = useState([]);

  const dispatch = useDispatch();
  const session_id = useSelector((state) => state.session.session_id);
  const messageHistory = useSelector((state) => state.messageHistory.messages);
  const chatReload = useSelector((state) => state.chatReload.chatReload);
  const combinedStreamedAiMessagesRef = useRef();
  const sqlQueryRef = useRef();
  const columnRef = useRef();
  const sqlresultRef = useRef();
  const columnTypeRef = useRef();
  console.log(session_id,'in-chat')
  useEffect(() => {
    combinedStreamedAiMessagesRef.current = combinedStreamedAiMessages;
    sqlQueryRef.current = sqlQuery;
    columnRef.current = columns2;
    sqlresultRef.current = sqlresult;
    columnTypeRef.current = columnTypes;
    return () => {
      combinedStreamedAiMessagesRef.current = null;
      sqlQueryRef.current = null;
      columnRef.current = null;
      sqlresultRef.current = null;
      columnTypeRef.current = null;
    };
  }, [combinedStreamedAiMessages, sqlQuery, columns2, sqlresult, columnTypes]);
  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [loading, liveMessageComponentStatus, chatReload, messageHistory]);
  useEffect(() => {
    const storedId = localStorage.getItem("session_id");
    const storedTimestamp = localStorage.getItem("session_timestamp");
    const isExpired =
      !storedTimestamp ||
      new Date().getTime() - storedTimestamp > EXPIRATION_TIME;

    let newId = storedId && !isExpired ? storedId : uuidv4();

    if (isExpired || !storedId) {
      localStorage.setItem("session_id", newId);
      localStorage.setItem("session_timestamp", new Date().getTime());
    }

    dispatch(create_session(newId));
  }, [dispatch]);

  // This useEffect fetches chat history once session_id is created
  useEffect(() => {
    if (session_id) {
      const fetch_chat_history = async (id) => {
        try {
          const response = await axios.get(
            `https://workmate-banking-api.onrender.com/sql_chain/chats/${id}`
          );
          dispatch(setMessageHistory(response.data));
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      };

      fetch_chat_history(session_id);
    }
  }, [dispatch, session_id, chatReload]);

  const renderers = useMemo(
    () => ({
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
    }),
    []
  );

  // const fetchStream = useCallback(async () => {
  //   const req_id = uuidv4();

  //   if (!humanQuestion.trim()) {
  //     alert("Please enter a question.");
  //     return;
  //   }

  //   const humanMessage = {
  //     message: humanQuestion,
  //     sender: "Human",
  //     session_id: session_id,
  //     sql_query: "",
  //   };

  //   setHumanQuestion(""); // Reset the input field
  //   setPreloading(true);
  //   //setLoading("loading");
  //   //setMessageHistory((prev) => [...prev, humanMessage]);

  //   try {
  //     setCombinedStreamedAiMessages("");
  //     setCombinedAttemptMessage("");

  //     const fetchResponse = async (url, body) => {
  //       const response = await fetch(url, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //         body: JSON.stringify(body),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch: ${response.statusText}`);
  //       }

  //       return response.body.getReader();
  //     };

  //     const processStream = async (reader, setCombinedMessage) => {
  //       const decoder = new TextDecoder("utf-8");
  //       let partialMessage = "";

  //       while (true) {
  //         const { done, value } = await reader.read();
  //         if (done) break;

  //         partialMessage += decoder.decode(value, { stream: true });

  //         const messagesArray = partialMessage.split("\n\n");
  //         partialMessage = messagesArray.pop();

  //         setCombinedMessage(
  //           (prevCombined) =>
  //             prevCombined + messagesArray.filter(Boolean).join("\n\n")
  //         );
  //       }

  //       if (partialMessage) {
  //         setCombinedMessage((prevCombined) => prevCombined + partialMessage);
  //       }
  //     };

  //     const reader1 = await fetchResponse(
  //       "http://127.0.0.1:8000/sql_chain/sql_generator/get_sql/v1",
  //       { question: humanQuestion, uuid: session_id, request_id: req_id }
  //     );

  //     await processStream(reader1, setCombinedAttemptMessage);

  //     //setLoading("stop");
  //     setLiveMessageComponentStatus(true);
  //     setIsStreamingResponse2(true);

  //     const [reader2, response3] = await Promise.all([
  //       fetchResponse(
  //         "http://127.0.0.1:8000/sql_chain/sql_generator/get_nlr/v1",
  //         {
  //           question: humanQuestion,
  //           session_id: session_id,
  //           request_id: req_id,
  //         }
  //       ),
  //       fetch("http://127.0.0.1:8000/sql_chain/actual_data", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //         body: JSON.stringify({ request_id: req_id }),
  //       }),
  //     ]);

  //     await processStream(reader2, setCombinedStreamedAiMessages);

  //     if (response3.ok) {
  //       const responseData = await response3.json();
  //       setSqlresult(responseData.results);
  //       setSqlQuery(responseData.query);
  //       setColumns2(responseData.columns);
  //       setColumnTypes(responseData.column_types);
  //     } else {
  //       throw new Error(`Failed to fetch response3: ${response3.statusText}`);
  //     }

  //     setTimeout(() => {
  //       const AiMessage = {
  //         message: combinedStreamedAiMessagesRef.current,
  //         sender: "Ai",
  //         sql_query: sqlQueryRef.current,
  //         columns: columnRef.current,
  //         rows: sqlresultRef.current,
  //         column_types: columnTypeRef.current,
  //       };

  //       //setMessageHistory((prev) => [...prev, AiMessage]);

  //       setLiveMessageComponentStatus(false);
  //       setCombinedStreamedAiMessages("");
  //       setCombinedAttemptMessage("");
  //       setColumns2([]);
  //       setSqlresult([]);
  //     }, 200);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     setLoading("stop");
  //   } finally {
  //     setPreloading(false);
  //   }
  // }, [humanQuestion, session_id]);

  console.log(messageHistory, "msg");
  return (
    <div className="h-[100vh - 70px] bg-slate-100 flex-[80%] mt-[70px] text-cyan-950">
      <div className="h-[75vh] overflow-y-scroll p-4">
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
        {streaminResponseStatus ? <Livemessagecomponent/>:<span></span>}
        {/* {liveMessageComponentStatus ? (
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
        )} */}

        {/*Component for Ai chat */}

        <div className="">
          {loading == "loading" ? <Liveloader /> : <span></span>}
          {/* {airesponse && airesponse.message && (
          <Markdown rehypePlugins={[remarkGfm]} components={renderers}>{`${airesponse.message}`}</Markdown>
        )} */}
          {/* {airesponse && <Aichatreply chatdata={airesponse} />} */}
          {/* {preloading && loading === "loading" ? (
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
          )} */}
        </div>
        <div ref={scrollRef}></div>
      </div>

      <div className="w-full sticky p-4 bottom-0 flex justify-center">
        <Inputbox />
      </div>
    </div>
  );
}

export default ChatpageOptimized;
