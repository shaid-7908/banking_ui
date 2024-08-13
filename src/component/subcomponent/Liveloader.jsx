//import React from 'react'
import { MagnifyingGlass } from 'react-loader-spinner';

function Liveloader() {
  return (
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
  );
}

export default Liveloader