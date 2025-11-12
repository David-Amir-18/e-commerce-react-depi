import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FlightCard from "../components/FlightCard";
import FilterSidebar from "../components/FilterSidebar";
import { Plane } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Import your transformer
import { transformSerpApiData } from "../services/dataTransformer"; 
import SearchBar from "@/Searchbars/SearchBar";
import FlightSearchDropDown from "@/components/ui/FlightSearchDropDown";

// Helper hook to read URL params
const useFlightSearch = () => {
  const [searchParams] = useSearchParams();
  return {
    origin: searchParams.get("origin"),
    destination: searchParams.get("destination"),
    originName: searchParams.get("originName"),
    destinationName: searchParams.get("destinationName"),
    date: searchParams.get("date"),
    passengers: searchParams.get("passengers"),
    cabin: searchParams.get("cabin"),
  };
};

const FlightResultsPage = () => {
  const criteria = useFlightSearch();
  const navigate = useNavigate();

  // Get backend API URL from .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [allFlights, setAllFlights] = useState({ bestFlights: [], otherFlights: [] });
  const [filteredBestFlights, setFilteredBestFlights] = useState([]);
  const [filteredOtherFlights, setFilteredOtherFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("recommended");

  // Pagination state
  const [visibleBestCount, setVisibleBestCount] = useState(5);
  const [visibleOtherCount, setVisibleOtherCount] = useState(5);
  const FLIGHTS_PER_PAGE = 5;

  const [filters, setFilters] = useState({
    stops: [],
    priceRange: [0, 2000],
    airlines: [],
    departureTime: [],
    cabinClass: [],
  });
  
  // Scroll to the top of the page on load
  useEffect(() => window.scrollTo(0, 0), [])

  // useEffect to FETCH data on page load
  useEffect(() => {
    // If there's no origin in the URL, don't do anything
    if (!criteria.origin || !criteria.destination || !criteria.date) {
      setLoading(false);
      setAllFlights({ bestFlights: [], otherFlights: [] });
      setFilteredBestFlights([]);
      setFilteredOtherFlights([]);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Build the backend API URL
      const backendUrl = new URL(`${API_BASE_URL}/flights/search`);
      backendUrl.searchParams.append('origin', criteria.origin);
      backendUrl.searchParams.append('destination', criteria.destination);
      backendUrl.searchParams.append('date', criteria.date);
      backendUrl.searchParams.append('passengers', criteria.passengers || '1');
      backendUrl.searchParams.append('cabin', criteria.cabin || 'Economy');

      try {
        // Call backend API (which calls SerpAPI server-side)
        const response = await fetch(backendUrl.toString());

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch flight data from server.");
        }

        const responseData = await response.json();
        const serpApiData = responseData.data;

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

  }, [criteria.origin, criteria.destination, criteria.date, API_BASE_URL]); // Reruns if search criteria change

  
  // Wrap 'applyFilters' in 'useCallback'
  const applyFilters = useCallback((currentFilters, currentSort) => {
    const filterFlightArray = (flights) => {
      let tempFlights = [...flights];

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
      return tempFlights;
    };

    setFilteredBestFlights(filterFlightArray(allFlights.bestFlights));
    setFilteredOtherFlights(filterFlightArray(allFlights.otherFlights));
  }, [allFlights]);

  // useEffect to apply filters when state changes
  useEffect(() => {
    applyFilters(filters, sortCriteria);
    // Reset pagination when filters change
    setVisibleBestCount(5);
    setVisibleOtherCount(5);
  }, [filters, allFlights, sortCriteria, applyFilters]);

  // Load More handlers
  const loadMoreBestFlights = () => {
    setVisibleBestCount(prev => prev + FLIGHTS_PER_PAGE);
  };

  const loadMoreOtherFlights = () => {
    setVisibleOtherCount(prev => prev + FLIGHTS_PER_PAGE);
  };

  // Get visible flights
  const visibleBestFlights = filteredBestFlights.slice(0, visibleBestCount);
  const visibleOtherFlights = filteredOtherFlights.slice(0, visibleOtherCount);

  const hasMoreBestFlights = visibleBestCount < filteredBestFlights.length;
  const hasMoreOtherFlights = visibleOtherCount < filteredOtherFlights.length;


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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-6 px-8">
        
        {/* "Back to Search" button */}
        <button
          onClick={() => navigate("/")}
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center space-x-2 text-sm"
        >
          <span>&larr;</span><span>Back to Search</span>
        </button>

        {/* RESPONSIVE HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-1">
              {criteria.originName || criteria.origin || "Origin"} → {criteria.destinationName || criteria.destination || "Destination"}
            </h1>
            <p className="text-zinc-400 text-sm">
              {criteria.date || "Select a Date"} · {criteria.passengers || 1} Passenger · {criteria.cabin || "Economy"}
            </p>
          </div>
          
          <div className="flex items-center text-sm space-x-3 mt-4 lg:mt-0">
            <FlightSearchDropDown />
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
        <div className="flex flex-col lg:flex-row w-full lg:space-x-8 space-y-8 lg:space-y-0 pb-25">
          
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
                {filteredBestFlights.length + filteredOtherFlights.length} flights found
              </span>
            </div>

            {/* Best Flights Section */}
            {filteredBestFlights.length > 0 && (
              <>
                <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 p-3 rounded-xl">
                  <h2 className="text-yellow-400 font-bold text-lg flex items-center">
                    <span className="mr-2">⭐</span>
                    Best Flights — Top picks based on price, duration, and convenience
                  </h2>
                  <p className="text-yellow-300/70 text-xs mt-1">
                    Showing {visibleBestFlights.length} of {filteredBestFlights.length} flights
                  </p>
                </div>
                {visibleBestFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    {...flight}
                    onSelect={() => navigate('/passenger-details', { state: { flight, searchCriteria: criteria } })}
                  />
                ))}
                {hasMoreBestFlights && (
                  <button
                    onClick={loadMoreBestFlights}
                    className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Load More Best Flights ({filteredBestFlights.length - visibleBestFlights.length} remaining)
                  </button>
                )}
              </>
            )}

            {/* Other Flights Section */}
            {filteredOtherFlights.length > 0 && (
              <>
                <div className="bg-zinc-800/50 border border-zinc-700 p-3 rounded-xl my-8">
                  <h2 className="text-zinc-300 font-bold text-lg">
                    Other Available Flights
                  </h2>
                  <p className="text-zinc-400 text-xs mt-1">
                    Showing {visibleOtherFlights.length} of {filteredOtherFlights.length} flights
                  </p>
                </div>
                {visibleOtherFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    {...flight}
                    onSelect={() => navigate('/passenger-details', { state: { flight, searchCriteria: criteria } })}
                  />
                ))}
                {hasMoreOtherFlights && (
                  <button
                    onClick={loadMoreOtherFlights}
                    className="w-full bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-600 text-zinc-300 py-3 rounded-xl font-semibold transition-all duration-200 mb-8 mt-4"
                  >
                    Load More Flights ({filteredOtherFlights.length - visibleOtherFlights.length} remaining)
                  </button>
                )}
              </>
            )}

            {/* No Flights Found */}
            {filteredBestFlights.length === 0 && filteredOtherFlights.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg text-zinc-400">
                <h3 className="text-lg font-semibold text-white mb-2">
                  0 flights found
                </h3>
                <p>No flights found for this search or your current filter settings.</p>
              </div>
            )}
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightResultsPage;