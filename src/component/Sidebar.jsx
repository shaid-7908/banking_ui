//import React from 'react'

function Sidebar() {
  return (
    <div className=' left-0 flex-[20%] bottom-0 z-10 flex items-start justify-center bg-white border-r w-[18vw] h-screen'>
      <button className='bg-white text-sm w-64 border mt-[88px] px-3 py-2 rounded-md flex items-center justify-between'>
        <span className=''>New Chat</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
        </svg>
      </button>
    </div>
  )
}

export default Sidebar