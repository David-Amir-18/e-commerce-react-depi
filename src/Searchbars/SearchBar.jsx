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
    <div className="flex items-center justify-center px-4 py-6 relative">
      {/* Transparent container with glass morphism effect */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-6xl text-white">
        {/* Flight Type Buttons - Made more subtle */}
        <div className="mb-6">
          <FlightTypeSelector selected={flightType} onChange={setFlightType} />
        </div>

        {/* MOBILE VIEW */}
        <div className="block md:hidden space-y-4">
          {/* From Input */}
          <div className="relative">
            <div className="bg-white/20 rounded-xl p-4 border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
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
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-lg"
              />
            </div>

            {activeInput === "from" && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSuggestion(item.city, "from");
                      }}
                      className="px-4 py-3 hover:bg-amber-50/80 cursor-pointer border-b border-white/20 last:border-b-0"
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
              className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all shadow-lg active:scale-95 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Input */}
          <div className="relative">
            <div className="bg-white/20 rounded-xl p-4 border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
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
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-lg"
              />
            </div>

            {activeInput === "to" && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSuggestion(item.city, "to");
                      }}
                      className="px-4 py-3 hover:bg-amber-50/80 cursor-pointer border-b border-white/20 last:border-b-0"
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
            <div className="bg-white/20 rounded-xl p-4 border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
                Departure
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
              />
            </div>

            {flightType === "Round Trip" && (
              <div className="bg-white/20 rounded-xl p-4 border border-white/30">
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>
            )}
          </div>

          {/* Travellers */}
          <div className="relative">
            <div
              className="bg-white/20 rounded-xl p-4 border border-white/30 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setTravellersOpen(!travellersOpen);
              }}
            >
              <label className="block text-sm font-semibold mb-2 text-white/90">
                Travellers
              </label>
              <div className="w-full bg-transparent text-white outline-none text-lg">
                {adults} Adult{adults > 1 ? "s" : ""}, {infants} Infant{infants > 1 ? "s" : ""}
              </div>
            </div>

            {travellersOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50">
                <div
                  className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 space-y-3 border border-white/20"
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
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
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
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
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
                    className="w-full bg-amber-400 text-gray-900 py-3 rounded-xl mt-2 hover:bg-amber-500 font-semibold transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button className="bg-amber-400 text-gray-900 rounded-xl py-4 w-full hover:bg-amber-500 transition-all font-semibold shadow-lg text-lg">
            Search Flights
          </button>
        </div>

        {/* DESKTOP VIEW - Sleek transparent design */}
        <div className="hidden md:block">
          <div className="flex items-stretch gap-2">
            {/* From */}
            <div className="flex-1 bg-white/20 rounded-xl p-4 relative border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
                From
              </label>
              <input
                type="text"
                placeholder="Departure city"
                value={from}
                onChange={(e) => handleInputChange(e, "from")}
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-lg font-medium"
              />
              {activeInput === "from" && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md text-gray-800 rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto z-50 border border-white/20">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item.city, "from")}
                      className="px-4 py-3 hover:bg-amber-50/80 cursor-pointer border-b border-white/20 last:border-b-0"
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
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all shadow-lg backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="flex-1 bg-white/20 rounded-xl p-4 relative border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
                To
              </label>
              <input
                type="text"
                placeholder="Destination city"
                value={to}
                onChange={(e) => handleInputChange(e, "to")}
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-lg font-medium"
              />
              {activeInput === "to" && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md text-gray-800 rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto z-50 border border-white/20">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item.city, "to")}
                      className="px-4 py-3 hover:bg-amber-50/80 cursor-pointer border-b border-white/20 last:border-b-0"
                    >
                      {item.city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Depart Date */}
            <div className="flex-1 bg-white/20 rounded-xl p-4 border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
                Depart
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full bg-transparent text-white outline-none"
              />
            </div>

            {/* Return Date */}
            {flightType === "Round Trip" && (
              <div className="flex-1 bg-white/20 rounded-xl p-4 border border-white/30">
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>
            )}

            {/* Travellers */}
            <div className="relative">
              <div
                className="bg-white/20 rounded-xl p-4 border border-white/30 cursor-pointer h-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setTravellersOpen(!travellersOpen);
                }}
              >
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Travellers
                </label>
                <div className="w-full bg-transparent text-white outline-none text-lg">
                  {adults} A, {infants} I
                </div>
              </div>

              {travellersOpen && (
                <div className="absolute top-full right-0 mt-2 z-50 min-w-[280px]">
                  <div
                    className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 space-y-3 border border-white/20"
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
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
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
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-700"
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
                      className="w-full bg-amber-400 text-gray-900 py-3 rounded-xl mt-2 hover:bg-amber-500 font-semibold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button className="bg-amber-400 text-gray-900 rounded-xl px-8 py-4 hover:bg-amber-500 transition-all font-semibold shadow-lg text-lg min-w-[140px]">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;