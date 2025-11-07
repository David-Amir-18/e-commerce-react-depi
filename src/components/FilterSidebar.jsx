// src/components/FilterSidebar.jsx

import React from 'react';
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

// This component receives filter state and a function to update it from FlightResultsPage
const FilterSidebar = ({ filters, setFilters, onApplyFilters }) => {
  
  // This function handles the new range slider
  const handlePriceChange = (e) => {
    const newMaxValue = parseInt(e.target.value); // Get the new max price
    
    // Update the parent's filter state
    setFilters(prevFilters => {
      const updatedFilters = { 
        ...prevFilters, 
        // Keep the min value (index 0), only update the max value (index 1)
        priceRange: [prevFilters.priceRange[0], newMaxValue] 
      };
      
      // Apply filters immediately as the slider moves
      onApplyFilters(updatedFilters); 
      return updatedFilters;
    });
  };

  // This function handles all checkbox clicks
  const handleCheckboxChange = (category, value) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      const updatedFilters = { ...prevFilters, [category]: newValues };
      onApplyFilters(updatedFilters); // Trigger filter application in parent
      return updatedFilters;
    });
  };
  
  // This function resets all filters back to default
  const handleResetFilters = () => {
    const freshFilters = {
      stops: [],
      priceRange: [0, 2000],
      airlines: [],
      departureTime: [],
      cabinClass: [],
    };
    setFilters(freshFilters);
    onApplyFilters(freshFilters);
  };

  // Static options for filters (these could come from API meta-data in a real app)
  const airlinesOptions = ['Delta Airlines', 'United Airlines', 'American Airlines', 'Emirates'];
  const departureTimeOptions = [
    { label: 'Morning (6AM - 12PM)', value: 'morning' },
    { label: 'Afternoon (12PM - 6PM)', value: 'afternoon' },
    { label: 'Evening (6PM - 12AM)', value: 'evening' },
    { label: 'Night (12AM - 6AM)', value: 'night' },
  ];
  const cabinClassOptions = ['Economy', 'Business', 'First Class'];


  return (
    <aside className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 w-full lg:sticky top-24">
      <div className="space-y-6">
        {/* Filter Results Header */}
        <div>
          <h3 className="text-zinc-100 text-xl font-semibold mb-4">Filter Results</h3>
          <Button 
            variant="ghost" 
            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-0"
            onClick={handleResetFilters}
          >
            Reset all filters
          </Button>
        </div>

        <Separator className="bg-zinc-800" />

        {/* STOPS FILTER (Filled In) */}
        <div className="space-y-3">
          <h4 className="text-zinc-200 font-semibold">Stops</h4>
          <div className="space-y-2">
            {['Non-stop', '1 stop', '2+ stops'].map(stopOption => (
              <div key={stopOption} className="flex items-center space-x-2">
                <Checkbox 
                  id={`stop-${stopOption}`}
                  checked={filters.stops.includes(stopOption)}
                  onCheckedChange={() => handleCheckboxChange('stops', stopOption)}
                  className="border-zinc-700 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-zinc-950" 
                />
                <Label htmlFor={`stop-${stopOption}`} className="cursor-pointer text-zinc-300 hover:text-zinc-100">
                  {stopOption}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* PRICE RANGE FILTER (Filled In) */}
        <div className="space-y-3">
          <h4 className="text-zinc-200 font-semibold">Price Range</h4>
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={filters.priceRange[1]} // Control the slider by the max price
              onChange={handlePriceChange}   // Use our new handler
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-yellow-400">${filters.priceRange[0]}</span>
            <span className="text-yellow-400">${filters.priceRange[1]}</span>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* AIRLINES FILTER (Filled In) */}
        <div className="space-y-3">
          <h4 className="text-zinc-200 font-semibold">Airlines</h4>
          <div className="space-y-2">
            {airlinesOptions.map(airline => (
              <div key={airline} className="flex items-center space-x-2">
                <Checkbox 
                  id={`airline-${airline}`}
                  checked={filters.airlines.includes(airline)}
                  onCheckedChange={() => handleCheckboxChange('airlines', airline)}
                  className="border-zinc-700 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-zinc-950"
                />
                <Label htmlFor={`airline-${airline}`} className="cursor-pointer text-zinc-300 hover:text-zinc-100">
                  {airline}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* DEPARTURE TIME FILTER (Filled In) */}
        <div className="space-y-3">
          <h4 className="text-zinc-200 font-semibold">Departure Time</h4>
          <div className="space-y-2">
            {departureTimeOptions.map(timeOption => (
              <div key={timeOption.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`time-${timeOption.value}`}
                  checked={filters.departureTime.includes(timeOption.value)}
                  onCheckedChange={() => handleCheckboxChange('departureTime', timeOption.value)}
                  className="border-zinc-700 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-zinc-950"
                />
                <Label htmlFor={`time-${timeOption.value}`} className="cursor-pointer text-zinc-300 hover:text-zinc-100">
                  {timeOption.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* CABIN CLASS FILTER (Filled In) */}
        <div className="space-y-3">
          <h4 className="text-zinc-200 font-semibold">Cabin Class</h4>
          <div className="space-y-2">
            {cabinClassOptions.map(cabinClass => (
              <div key={cabinClass} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cabin-${cabinClass}`}
                  checked={filters.cabinClass.includes(cabinClass)}
                  onCheckedChange={() => handleCheckboxChange('cabinClass', cabinClass)}
                  className="border-zinc-700 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-zinc-950"
                />
                <Label htmlFor={`cabin-${cabinClass}`} className="cursor-pointer text-zinc-300 hover:text-zinc-100">
                  {cabinClass}
                </Label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default FilterSidebar;