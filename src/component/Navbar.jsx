import { useState } from "react";


function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");
  

  const handleLogout = () => {
    // Clear token and expiration from localStorage
   
  };

  return (
    <div className="text-black bg-white z-50 w-full fixed top-0 h-[70px] border-b border-gray-300 flex justify-between items-center px-7">
      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center justify-center gap-2">
          <span className="font-extrabold text-base">BFAAC</span>
        </div>
        <button className="bg-[#F4F4F5] px-5 py-2 text-sm rounded-md">
          <span className="text-sm mr-2">💭</span>Testmode
        </button>
        <span className="text-gray-500 text-sm">App is in test mode</span>
      </div>
      <nav className="flex items-center px-3 gap-14">
        <a
          href="#"
          className={`font-extrabold text-sm  ${
            activeLink === "Home"
              ? "border px-3 bg-white py-1 rounded-md border-black shadow-xl border-opacity-20"
              : ""
          }`}
          onClick={() => setActiveLink("Home")}
        >
          Home
        </a>
        <a
          href="#"
          className={`font-extrabold text-sm  ${
            activeLink === "Dashboards"
              ? "border px-3 bg-white py-1 rounded-md border-black shadow-xl border-opacity-20"
              : ""
          }`}
          onClick={() => setActiveLink("Dashboards")}
        >
          Dashboards
        </a>
        <a
          className={`font-extrabold text-sm  ${
            activeLink === "Data Sources"
              ? "border px-3 bg-white py-1 rounded-md border-black shadow-xl border-opacity-20"
              : ""
          }`}
          onClick={() => setActiveLink("Data Sources")}
        >
          Data Sources
        </a>
      </nav>
      <div className="flex items-center gap-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border border-black border-opacity-50 focus:outline-none rounded-md placeholder:text-gray-500 placeholder:text-sm px-4 py-1 pl-8 w-52"
          />
          <svg
            className="w-4 h-4 text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"
            ></path>
          </svg>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <h1>⌘</h1>
          </button>
        </div>
        <div
          className="flex items-center py-2 justify-center gap-2"
          onClick={handleLogout}
        >
          <span className="text-sm mt-1 text-gray-800">Log out</span>
          <img
            src="https://app.brewit.ai/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocIleYSvFZBRxieY8JTWXf4f35Abv4TmocSJLrWrw4s4WgUqE53C%3Ds96-c&w=32&q=75"
            className="w-6 h-6 rounded-md"
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
