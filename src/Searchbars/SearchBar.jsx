import React, { useEffect, useState } from "react";
import FlightTypeSelector from "./FlightTypeSelector";

function SearchBar() {
  const [flightType, setFlightType] = useState("Round Trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [travellersOpen, setTravellersOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);

  // Swap function
  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  // Fetch destinations from JSON
  useEffect(() => {
    fetch("/destination.json")
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Error fetching Destination: ", err));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSuggestions([]);
      setActiveInput(null);
      setTravellersOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = (e, type) => {
    const value = e.target.value;
    setActiveInput(type);

    if (type === "from") setFrom(value);
    else setTo(value);

    if (value.trim().length > 0) {
      const filtered = destinations.filter((item) =>
        item.city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (city, type) => {
    if (type === "from") setFrom(city);
    else setTo(city);
    setSuggestions([]);
  };

  return (
    <div className="flex items-center justify-center p-4 relative">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl text-gray-800">
        {/* Flight Type Buttons */}
        <FlightTypeSelector selected={flightType} onChange={setFlightType} />

        {/* MOBILE VIEW */}
        <div className="block md:hidden space-y-4">
          {/* From Input */}
          <div className="relative">
            <div className="bg-gray-100 rounded-lg p-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                From
              </label>
              <input
                type="text"
                placeholder="Enter departure city"
                value={from}
                onChange={(e) => handleInputChange(e, "from")}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInput("from");
                }}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>

            {activeInput === "from" && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSuggestion(item.city, "from");
                      }}
                      className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-800 font-medium">{item.city}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapLocations}
              className="p-3 rounded-full bg-amber-400 hover:bg-amber-500 text-gray-900 border border-amber-300 transition-all shadow-lg active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Input */}
          <div className="relative">
            <div className="bg-gray-100 rounded-lg p-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                To
              </label>
              <input
                type="text"
                placeholder="Enter destination city"
                value={to}
                onChange={(e) => handleInputChange(e, "to")}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInput("to");
                }}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>

            {activeInput === "to" && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSuggestion(item.city, "to");
                      }}
                      className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-800 font-medium">{item.city}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div
            className={`grid ${
              flightType === "Round Trip" ? "grid-cols-2" : "grid-cols-1"
            } gap-3 relative z-10`}
          >
            <div className="bg-gray-100 rounded-lg p-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Departure
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full bg-transparent text-gray-800 outline-none"
              />
            </div>

            {flightType === "Round Trip" && (
              <div className="bg-gray-100 rounded-lg p-3">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-gray-800 outline-none"
                />
              </div>
            )}
          </div>

          {/* Travellers */}
          <div className="relative">
            <div
              className="bg-gray-100 rounded-lg p-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setTravellersOpen(!travellersOpen);
              }}
            >
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Travellers
              </label>
              <div className="w-full bg-transparent text-gray-800 outline-none">
                {adults} Adult{adults > 1 ? "s" : ""}, {infants} Infant{infants > 1 ? "s" : ""}
              </div>
            </div>

            {travellersOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div
                  className="bg-white rounded-xl shadow-lg p-4 space-y-3 border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    ["Adults", adults, setAdults],
                    ["Infants", infants, setInfants],
                  ].map(([label, count, setter]) => (
                    <div className="flex justify-between items-center" key={label}>
                      <span className="font-medium text-gray-800">{label}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setter(Math.max(0, count - 1));
                          }}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-800">
                          {count}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setter(count + 1);
                          }}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTravellersOpen(false);
                    }}
                    className="w-full bg-amber-400 text-gray-900 py-2 rounded-lg mt-2 hover:bg-amber-500 font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button className="bg-amber-400 text-gray-900 rounded-lg py-3 w-full hover:bg-amber-500 transition-all font-semibold shadow-md">
            Search Flights
          </button>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <div className="flex items-stretch gap-1.5 mb-4">
            {/* From */}
            <div className="flex-1 bg-gray-100 rounded-l-lg p-3 relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                From
              </label>
              <input
                type="text"
                placeholder="departure city"
                value={from}
                onChange={(e) => handleInputChange(e, "from")}
                className="w-full bg-transparent text-gray-800 outline-none"
              />
              {activeInput === "from" && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white text-gray-900 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50 border border-gray-200">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item.city, "from")}
                      className="px-3 py-2 hover:bg-amber-100 cursor-pointer text-sm"
                    >
                      {item.city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Swap */}
            <div className="flex items-center justify-center">
              <button
                onClick={swapLocations}
                className="p-2 rounded-full bg-amber-400 hover:bg-amber-500 text-gray-900 border border-amber-300 transition-all shadow-md active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="flex-1 bg-gray-100 p-3 relative">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                To
              </label>
              <input
                type="text"
                placeholder="destination city"
                value={to}
                onChange={(e) => handleInputChange(e, "to")}
                className="w-full bg-transparent text-gray-800 outline-none"
              />
              {activeInput === "to" && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white text-gray-900 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50 border border-gray-200">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item.city, "to")}
                      className="p-2 hover:bg-amber-100 cursor-pointer"
                    >
                      {item.city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Depart Date */}
            <div className="flex-1 bg-gray-100 p-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Depart
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full bg-transparent text-gray-800 outline-none"
              />
            </div>

            {/* Return Date */}
            {flightType === "Round Trip" && (
              <div className="flex-1 bg-gray-100 p-3">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-gray-800 outline-none"
                />
              </div>
            )}

            {/* Travellers */}
            <div className="relative">
              <div
                className="bg-gray-100 p-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setTravellersOpen(!travellersOpen);
                }}
              >
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Travellers
                </label>
                <div className="w-full bg-transparent text-gray-800 outline-none">
                  {adults} Adult{adults > 1 ? "s" : ""}, {infants} Infant{infants > 1 ? "s" : ""}
                </div>
              </div>

              {travellersOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 min-w-[280px]">
                  <div
                    className="bg-white rounded-xl shadow-lg p-4 space-y-3 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[
                      ["Adults", adults, setAdults],
                      ["Infants", infants, setInfants],
                    ].map(([label, count, setter]) => (
                      <div className="flex justify-between items-center" key={label}>
                        <span className="font-medium text-gray-800">{label}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setter(Math.max(0, count - 1));
                            }}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700 font-medium"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">
                            {count}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setter(count + 1);
                            }}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700 font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTravellersOpen(false);
                      }}
                      className="w-full bg-amber-400 text-gray-900 py-2 rounded-lg mt-2 hover:bg-amber-500 font-semibold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button className="bg-amber-400 text-gray-900 rounded-r-lg px-8 py-3 hover:bg-amber-500 transition-all font-semibold shadow-md">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
