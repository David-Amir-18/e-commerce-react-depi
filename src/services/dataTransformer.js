
// Helper to format "2023-10-03 15:10" to "15:10"
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return "00:00";
  return dateTimeString.split(' ')[1];
};

// Helper to format "2023-10-03 15:10" to "Oct 03, 2023"
const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "Jan 1, 2025";
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
};

// Helper to format 205 (minutes) to "3h 25m"
const formatDuration = (minutes) => {
  if (!minutes) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// This is the main function that converts the API data
export const transformSerpApiData = (serpApiData) => {
  const flights = serpApiData.best_flights || serpApiData.other_flights || [];

  return flights.map((flight, index) => {
    const firstLeg = flight.flights[0]; 

    return {
      id: flight.flight_token || index,
      airline: firstLeg.airline,
      airlineLogo: firstLeg.airline_logo,
      flightNumber: firstLeg.flight_number,
      from: firstLeg.departure_airport.name,
      to: firstLeg.arrival_airport.name,
      fromCode: firstLeg.departure_airport.id,
      toCode: firstLeg.arrival_airport.id,
      departTime: formatTime(firstLeg.departure_airport.time),
      arriveTime: formatTime(firstLeg.arrival_airport.time),
      duration: formatDuration(firstLeg.duration),
      stops: flight.flights.length - 1,
      price: flight.price || 0,
      currency: "USD",
      departDate: formatDate(firstLeg.departure_airport.time),
      cabinClass: firstLeg.travel_class || "Economy",
      available: 0, 
      class: firstLeg.travel_class || "Economy",
    };
  });
};