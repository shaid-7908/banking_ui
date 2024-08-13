//import React from 'react'
import { useSelector } from 'react-redux';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ClipLoader from "react-spinners/ClipLoader";
function Livemessagecomponent() {
    const combinedAttemptMessage = useSelector(
      (state) => state.streamingMessage.combinedAttemptMessage
    );
    const combinedStreamdeAimessage = useSelector(
      (state) => state.streamingMessage.combinedStreamedAiMessages
    );
    const columns2 = useSelector((state) => state.sqlData.columns2);
    const sqlresult = useSelector((state)=>state.sqlData.sqlResult)
    const streaminResponseLoader = useSelector(
      (state) => state.streaminResponse.streaminResponseLoaderStatus);
  return (
    <div
      className="w-full border-[1px] p-2 rounded-md mb-4 bg-white"
      style={{ boxShadow: "0 5px 5px rgba(0, 0, 0, 0.05)" }}
    >
      h
      <div className="bg-slate-800 text-white overflow-y-scroll w-[75vw]">
        <Markdown rehypePlugins={[remarkGfm]}>
          {combinedAttemptMessage}
        </Markdown>
      </div>
      <div className="h-[30vh] overflow-y-scroll w-[75vw] overflow-x-scroll flex justify-center items-center rounded-md border-[1px] ">
        {(!columns2 || columns2.length === 0 || !sqlresult || sqlresult.length === 0) ?(<ClipLoader size={35}/>): ( <table className="w-full border-[1px] text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
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
              </table>)}
       
      </div>
      <div className="overflow-y-scroll w-[75vw]">
        <Markdown rehypePlugins={[remarkGfm]} >
          {combinedStreamdeAimessage}
        </Markdown>
        {streaminResponseLoader ? <ClipLoader size={14} /> : <span></span>}
      </div>
    </div>
  );
}

export default Livemessagecomponent