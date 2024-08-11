import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

import remarkGfm from "remark-gfm";

const Streamtest = () => {
  const [messages, setMessages] = useState([]);
  const [combinedMessage, setCombinedMessage] = useState("");
  const renderers = {
    table: ({  ...props }) => (
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
    tr: ({  ...props }) => (
      <tr
        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b rounded-md dark:border-gray-700"
        {...props}
      />
    ),
    td: ({  ...props }) => <td className="px-6 py-4" {...props} />,
    th: ({  ...props }) => <th className="px-6 py-4" {...props} />,
    p: ({ ...props }) => <p className="w-[60%]" {...props} />,
  };
  useEffect(() => {
    const fetchStream = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/sql_chain/check_stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            question: 'show me details of 20 patients',
            session_id: "03fb32ed-ce50-4e1b-8728-fef294994dbc",
            request_id: "105b9384-f3ab-402b-a37c-04e361b21b76",
          }),
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let partialMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialMessage += decoder.decode(value, { stream: true });

        const messagesArray = partialMessage.split("");
        // Keep the last partial message in case it's not complete
        partialMessage = messagesArray.pop();

        setMessages((prevMessages) => [
          ...prevMessages,
          ...messagesArray.filter(Boolean),
        ]);
         setCombinedMessage(
           (prevCombined) =>
             prevCombined + messagesArray.filter(Boolean).join("")
         );
      }
    };

    fetchStream().catch(console.error);
  }, []);

  console.log(messages);

  return (
    <div>
      <h1>Chat Responses</h1>
      <div className="w-screen bg-red-400 overflow-y-auto">
        <Markdown rehypePlugins={[remarkGfm]} components={renderers}>
          {combinedMessage}
        </Markdown>
      </div>
    </div>
  );
};

export default Streamtest;
