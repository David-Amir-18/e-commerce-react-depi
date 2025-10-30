import { createContext, useContext, useState } from 'react';
import { flightAPI } from '../services/api';

const FlightContext = createContext(null);

export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlight must be used within a FlightProvider');
  }
  return context;
};

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search flights using Google Flights API (SerpAPI)
  const searchFlights = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await flightAPI.searchExternalFlights(searchParams);

      if (response.success) {
        setFlights(response.data);
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      const errorMessage = error.message || 'Flight search failed. Please try again.';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear search results
  const clearFlights = () => {
    setFlights([]);
    setError(null);
  };

  const value = {
    flights,
    loading,
    error,
    searchFlights,
    clearFlights,
  };

  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
};
