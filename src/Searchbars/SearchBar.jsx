import React, { useEffect, useState } from "react";
import FlightTypeSelector from "./FlightTypeSelector";
import { useNavigate } from "react-router-dom";
import { Globe, Building2, Plane } from "lucide-react";

function SearchBar() {
  const [flightType, setFlightType] = useState("Round Trip");
  const [from, setFrom] = useState("");
  const [fromCode, setFromCode] = useState(""); // Store airport code
  const [to, setTo] = useState("");
  const [toCode, setToCode] = useState(""); // Store airport code
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [travellersOpen, setTravellersOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);

  const navigate = useNavigate(); // --- 2. INITIALIZE useNavigate ---

  // Swap function
  const swapLocations = () => {
    const tempCity = from;
    const tempCode = fromCode;
    setFrom(to);
    setFromCode(toCode);
    setTo(tempCity);
    setToCode(tempCode);
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

  // Handle input change with smart filtering
  const handleInputChange = (e, type) => {
    const value = e.target.value;
    setActiveInput(type);
    if (type === "from") setFrom(value);
    else setTo(value);

    // Require at least 2 characters before searching
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const searchTerm = value.toLowerCase();

    // Filter and prioritize results
    const filtered = destinations.filter((item) =>
      item.name && item.name.toLowerCase().includes(searchTerm) ||
      (item.code && item.code.toLowerCase().includes(searchTerm))
    );

    // Sort by relevance and type priority
    const sorted = filtered.sort((a, b) => {
      // Priority order: country > city > airport
      const typeOrder = { country: 0, city: 1, airport: 2 };
      const typeDiff = typeOrder[a.type] - typeOrder[b.type];
      if (typeDiff !== 0) return typeDiff;

      // Then by exact code match
      const aCodeMatch = a.code?.toLowerCase() === searchTerm;
      const bCodeMatch = b.code?.toLowerCase() === searchTerm;
      if (aCodeMatch && !bCodeMatch) return -1;
      if (!aCodeMatch && bCodeMatch) return 1;

      // Then by starts with
      const aStartsWith = a.name? a.name.toLowerCase().startsWith(searchTerm) : "";
      const bStartsWith = b.name ? b.name.toLowerCase().startsWith(searchTerm) : "";
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Finally alphabetically
      return a.name? a.name.localeCompare(b.name) : "";
    });

    // Limit to 30 suggestions for performance
    setSuggestions(sorted.slice(0, 30));
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (destination, type) => {
    if (type === "from") {
      setFrom(destination.name);
      setFromCode(destination.code);
    } else {
      setTo(destination.name);
      setToCode(destination.code);
    }
    setSuggestions([]);
  };

  // --- 3. ADD THE SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !departDate) {
      alert("Please fill in Origin, Destination, and Departure Date.");
      return;
    }

    if (!fromCode || !toCode) {
      alert("Please select a city or airport from the dropdown suggestions.");
      return;
    }

    const queryParams = new URLSearchParams({
      origin: fromCode, // Use airport/city/country code
      destination: toCode, // Use airport/city/country code
      originName: from, // Display name
      destinationName: to, // Display name
      date: departDate,
      passengers: adults + infants,
      cabin: "Economy", // Assuming a default, you can add state for this
      tripType: flightType,
    });

    if (flightType === "Round Trip") {
      queryParams.append('returnDate', returnDate);
    }

    navigate(`/flights?${queryParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-center relative">
      {/* ---  WRAP THE CONTENT IN A <form> --- */}
      
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg text-white"> 
    
        {/* Flight Type Buttons - Made more subtle */}
        <div className="mb-6">
          <FlightTypeSelector selected={flightType} onChange={setFlightType} />
        </div>

        {/* --- 5. REMOVED RESPONSIVE CLASSES --- */}
        {/* This div no longer has 'block md:hidden' so it's always visible */}
        <div className="space-y-4">
          {/* From Input */}
          <div className="relative">
            <div className="bg-white/20 rounded-xl p-4 border border-white/30">
              <label className="block text-sm font-semibold mb-2 text-white/90">
                From
              </label>
              <input
                type="text"
                placeholder="Type at least 2 letters..."
                value={from}
                onChange={(e) => handleInputChange(e, "from")}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInput("from");
                }}
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-lg"
                required
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
                        handleSelectSuggestion(item, "from");
                      }}
                      className="px-4 py-3 hover:bg-amber-50/80 cursor-pointer border-b border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.type === "country" ? (
                            <Globe className="w-5 h-5 text-blue-600" />
                          ) : item.type === "city" ? (
                            <Building2 className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Plane className="w-5 h-5 text-amber-600" />
                          )}
                          <div>
                            <span className="text-gray-800 font-medium">{item.name}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              {item.type === "country" ? "All cities & airports" :
                               item.type === "city" ? "All airports" : item.code}
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs">{item.country}</span>
                      </div>
                    </div>
                  ))}
                  {suggestions.length === 30 && (
                    <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 text-center border-t border-gray-200">
                      Showing top 30 results. Type more letters for specific results.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button" // Use type="button" to prevent form submission
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
                placeholder="Type at least 2 letters..."
                value={to}
                onChange={(e) => handleInputChange(e, "to")}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInput("to");
                }}
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-lg"
                required
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
                        handleSelectSuggestion(item, "to");
                      }}
                      className="px-4 py-3 hover:bg-amber-50/80 cursor-pointer border-b border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.type === "country" ? (
                            <Globe className="w-5 h-5 text-blue-600" />
                          ) : item.type === "city" ? (
                            <Building2 className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Plane className="w-5 h-5 text-amber-600" />
                          )}
                          <div>
                            <span className="text-gray-800 font-medium">{item.name}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              {item.type === "country" ? "All cities & airports" :
                               item.type === "city" ? "All airports" : item.code}
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs">{item.country}</span>
                      </div>
                    </div>
                  ))}
                  {suggestions.length === 30 && (
                    <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 text-center border-t border-gray-200">
                      Showing top 30 results. Type more letters for specific results.
                    </div>
                  )}
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
                required
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
                  required
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
              <label className="block text-sm font-semibold mb-2 text-white/90 text-center">
                Travellers
              </label>
              <div className="w-full bg-transparent text-white outline-none text-lg text-center">
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
                          type="button" // Use type="button"
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
                          type="button" // Use type="button"
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
                    type="button" // Use type="button"
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

          {/* --- 6. UNCOMMENT THE SEARCH BUTTON and make it type="submit" --- */}
          <button type="submit" className="bg-amber-400 text-gray-900 rounded-xl py-4 w-full hover:bg-amber-500 transition-all font-semibold shadow-lg text-lg">
            Search Flights
          </button>
        </div>

      </form> {/* --- 8. CLOSE THE <form> TAG --- */}
    </div>
  );
}

export default SearchBar;