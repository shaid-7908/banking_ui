//import React from 'react'

function Humanreply({chatdata}) {
    const {message ,sender , session_id , sql_query} = chatdata
  return (
    <div
      className="bg-blue-200 min-h-[40px] p-4 rounded-lg w-[50vw]"
      style={{ boxShadow: "0 5px 5px rgba(0, 0, 0, 0.05)" }}
    >
      {message}
    </div>
  );
}

export default Humanreply