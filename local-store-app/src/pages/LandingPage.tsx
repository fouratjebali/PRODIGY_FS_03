import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSearch, faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';


const LandingPage = () => {
  return (
    <div>
      <nav className="flex items-center justify-between bg-[#18230F] text-white px-6 py-4">
        <div className="text-2xl font-bold">Local Store</div>
        <div className="xl:w-96">
          <div className="relative flex flex-wrap items-stretch">
            <input
              type="search"
              className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#255F38] focus:outline-none placeholder-white"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            <span
              className="hover:bg-[#255F38] input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200 cursor-pointer transition duration-1000 ease-in-out"
              id="basic-addon2">
              <FontAwesomeIcon icon={faSearch} className="text-neutral-700 dark:text-neutral-200 cursor-pointer" />
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-5 ml-80">
          <div className="flex items-center cursor-pointer">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <div className="flex flex-col">
              <span className="font-bold uppercase text-white">Smith Street Location</span>
              <p className="text-sm text-white">225 Smith Street</p>
            </div>
          </div>
          <button className="cursor-pointer bg-[#1F7D53] text-white-500 px-4 py-2 rounded hover:bg-[#255F38] transition duration-300 ease-in-out flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Login
          </button>
          <div className="flex items-center cursor-pointer">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            <span>Cart</span>
          </div>
        </div>
      </nav>
      <div className="bg-[#18230F] text-white px-6 py-2 flex justify-center">
        <ul className="flex space-x-15">
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Home</span>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Tools</span>
            <div className="absolute hidden group-hover:block pt-2 left-0">
              <ul className="bg-[#27391C] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Home & Kitchen</span>
            <div className="absolute hidden group-hover:block pt-2 left-0">
              <ul className="bg-[#27391C] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Luggage</span>
            <div className="absolute hidden group-hover:block pt-2 left-0">
              <ul className="bg-[#27391C] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Food</span>
            <div className="absolute hidden group-hover:block pt-2 left-0">
              <ul className="bg-[#27391C] text-white rounded shadow-lg w-48">
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
                <li className="px-4 py-2 hover:bg-[#1F7D53] cursor-default">Work With Us</li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <span className="hover:text-[#98dcbe] cursor-pointer">Gift Cards</span>
          </li>
        </ul>
      </div>
      <div className="bg-[#f8f1e6] text-[#2a2118] py-12 px-6 text-center font-serif">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Books Are Magic</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6">
          Your independent bookstore in Cobble Hill/Carroll Gardens and Brooklyn Heights!
        </p>
        <div className="text-base md:text-lg space-y-2">
          <p>Visit us at <span className="font-semibold">225 Smith St. (at Butler)</span> & <span className="font-semibold">122 Montague St. (at Henry)</span> in Brooklyn.</p>
          <p>Open everyday 10am-6pm. Come say hi!</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;