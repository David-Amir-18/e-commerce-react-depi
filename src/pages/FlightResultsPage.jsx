import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FlightCard from "../components/FlightCard";
import FilterSidebar from "../components/FilterSidebar";
import { Plane } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Import your transformer
import { transformSerpApiData } from "../services/dataTransformer"; 

// Helper hook to read URL params
const useFlightSearch = () => {
  const [searchParams] = useSearchParams();
  return {
    origin: searchParams.get("origin"),
    destination: searchParams.get("destination"),
    date: searchParams.get("date"),
    passengers: searchParams.get("passengers"),
    cabin: searchParams.get("cabin"),
  };
};

const FlightResultsPage = () => {
  const criteria = useFlightSearch();
  const navigate = useNavigate();

  // Get your INSECURE API key from .env
  const SERPAPI_KEY = import.meta.env.VITE_SERPAPI_KEY;

  const [allFlights, setAllFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("recommended");

  const [filters, setFilters] = useState({
    stops: [],
    priceRange: [0, 2000],
    airlines: [],
    departureTime: [],
    cabinClass: [],
  });

  // useEffect to FETCH data on page load
  useEffect(() => {
    // If there's no origin in the URL, don't do anything
    if (!criteria.origin || !criteria.destination || !criteria.date) {
      setLoading(false);
      setAllFlights([]); 
      setFilteredFlights([]);
      return; 
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Build the full SerpApi URL
      const serpApiUrl = new URL('https://serpapi.com/search.json');
      serpApiUrl.searchParams.append('engine', 'google_flights');
      serpApiUrl.searchParams.append('api_key', SERPAPI_KEY); // Your key is used here
      serpApiUrl.searchParams.append('departure_id', criteria.origin);
      serpApiUrl.searchParams.append('arrival_id', criteria.destination);
      serpApiUrl.searchParams.append('outbound_date', criteria.date);
      serpApiUrl.searchParams.append('currency', 'USD');
      serpApiUrl.searchParams.append('hl', 'en');
      
      try {
        // Call SerpApi directly using 'fetch'
        const response = await fetch(serpApiUrl.toString());
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch data from SerpApi.");
        }
        
        const serpApiData = await response.json();

        // Transform the data
        const cleanData = transformSerpApiData(serpApiData);
        
        setAllFlights(cleanData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [criteria.origin, criteria.destination, criteria.date, SERPAPI_KEY]); // Reruns if search criteria change

  
  // Wrap 'applyFilters' in 'useCallback'
  const applyFilters = useCallback((currentFilters, currentSort) => {
    let tempFlights = [...allFlights];

    // Filter by stops
    if (currentFilters.stops.length > 0) {
      tempFlights = tempFlights.filter((flight) => {
        const flightStops =
          flight.stops === 0 ? "Non-stop" : flight.stops === 1 ? "1 stop" : "2+ stops";
        return currentFilters.stops.includes(flightStops);
      });
    }
    // Filter by price range
    tempFlights = tempFlights.filter(
      (flight) =>
        flight.price >= currentFilters.priceRange[0] &&
        flight.price <= currentFilters.priceRange[1]
    );
    // Filter by airlines
    if (currentFilters.airlines.length > 0) {
      tempFlights = tempFlights.filter((flight) =>
        currentFilters.airlines.includes(flight.airline)
      );
    }
    // Filter by departure time
    if (currentFilters.departureTime.length > 0) {
      tempFlights = tempFlights.filter((flight) => {
        const departureHour = parseInt(flight.departTime.split(":")[0]);
        let timeCategory = "";
        if (departureHour >= 6 && departureHour < 12) timeCategory = "morning";
        else if (departureHour >= 12 && departureHour < 18) timeCategory = "afternoon";
        else if (departureHour >= 18 && departureHour < 24) timeCategory = "evening";
        else timeCategory = "night";
        return currentFilters.departureTime.includes(timeCategory);
      });
    }
    // Filter by cabin class
    if (currentFilters.cabinClass.length > 0) {
      tempFlights = tempFlights.filter((flight) =>
        currentFilters.cabinClass.includes(flight.class)
      );
    }
    // Sorting logic
    if (currentSort === 'price-low-high') {
      tempFlights.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high-low') {
      tempFlights.sort((a, b) => b.price - a.price);
    }
    setFilteredFlights(tempFlights);
  }, [allFlights]);

  // useEffect to apply filters when state changes
  useEffect(() => {
    applyFilters(filters, sortCriteria);
  }, [filters, allFlights, sortCriteria, applyFilters]);


  // --- Render Logic ---
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24 text-2xl">
        Loading flight results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center pt-24">
        <p className="text-red-500 text-xl">Error: {error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 text-yellow-400 hover:text-yellow-300"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto p-6">
        
        {/* "Back to Search" button */}
        <button
          onClick={() => navigate("/")}
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center space-x-2 text-sm"
        >
          &larr; <span>Back to Search</span>
        </button>

        {/* RESPONSIVE HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-1">
              {criteria.origin || "Origin"} → {criteria.destination || "Destination"}
            </h1>
            <p className="text-zinc-400 text-sm">
              {criteria.date || "Select a Date"} · {criteria.passengers || 1} Passenger · {criteria.cabin || "Economy"}
            </p>
          </div>
          
          <div className="flex items-center text-sm space-x-3 mt-4 lg:mt-0">
            <span className="text-zinc-400">Sort by:</span>
            <Select 
              value={sortCriteria} 
              onValueChange={setSortCriteria}
            >
              <SelectTrigger className="w-[200px] bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-yellow-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low-high">Price (Lower to Higher)</SelectItem>
                <SelectItem value="price-high-low">Price (Higher to Lower)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* RESPONSIVE MAIN CONTENT AREA */}
        <div className="flex flex-col lg:flex-row w-full lg:space-x-8 space-y-8 lg:space-y-0">
          
          {/* LEFT COLUMN: Filters */}
          <div className="w-full lg:w-1/4">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={applyFilters} 
            />
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="w-full lg:w-3/4 space-y-4">
            
            {/* "X flights found" banner */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-yellow-400 flex items-center">
              <Plane className="w-5 h-5 mr-3" />
              <span className="font-semibold">
                {filteredFlights.length} flights found
              </span>
            </div>

            {/* Flight Cards List */}
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
                <FlightCard key={flight.id} {...flight} />
              ))
            ) : (
              // This shows if no flights are found
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-zinc-400">
                <h3 className="text-lg font-semibold text-white mb-2">
                  0 flights found
                </h3>
                <p>No flights found for this search or your current filter settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResultsPage;