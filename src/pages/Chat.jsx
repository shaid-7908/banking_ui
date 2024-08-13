//import React from 'react'
import Navbar from '../component/Navbar'
import Sidebar from '../component/Sidebar'
//import ChatPage from '../component/ChatPage'
import ChatpageOptimized from '../component/ChatpageOptimized';

function Chat() {
  return (
    <>
    <Navbar />
      <div className='flex'>
        <Sidebar />
        <ChatpageOptimized/>
      </div>
    </>
  );
}

export default Chat