//import React from 'react'
import Navbar from '../component/Navbar'
import Sidebar from '../component/Sidebar'
import ChatPage from '../component/ChatPage'

function Chat() {
  return (
    <>
    <Navbar />
      <div className='flex'>
        <Sidebar />
        <ChatPage />
      </div>
    </>
  );
}

export default Chat