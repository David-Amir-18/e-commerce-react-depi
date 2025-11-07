import React from 'react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plane, Clock, Calendar } from "lucide-react";


export function FlightCard({
  airline = "Airline",
  airlineLogo,
  flightNumber = "AA123",
  from = "Origin City",
  to = "Destination City",
  fromCode = "JFK",
  toCode = "LAX",
  departTime = "00:00",
  arriveTime = "00:00",
  duration = "0h 0m",
  stops = 0,
  price = 0,
  currency = "USD",
  departDate = "Jan 1",
  cabinClass = "Economy",
  available = 0,
  onSelect,
}) {
  return (
    
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 hover:border-yellow-400/50 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Airline and Flight Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
            {airlineLogo ? (
              <img src={airlineLogo} alt={airline} className="w-12 h-12 object-contain" />
            ) : (
              <Plane className="w-8 h-8 text-yellow-400" />
            )}
          </div>
          <div>
            <h3 className="text-zinc-100 font-semibold text-lg">{airline}</h3>
            <p className="text-zinc-400 text-sm">{flightNumber}</p>
          </div>
        </div>

        {/* Flight Times and Route */}
        <div className="flex-1 grid grid-cols-3 items-center gap-4">
          <div>
            <p className="text-zinc-100 text-2xl font-bold">{departTime}</p>
            <p className="text-yellow-400 font-semibold">{fromCode}</p>
            <p className="text-zinc-400 text-sm">{from}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-zinc-400 text-sm mb-1">{duration}</p>
            <div className="relative w-full">
              <div className="h-px bg-zinc-700 w-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-2">
                <Plane className="w-4 h-4 text-yellow-400 rotate-90" />
              </div>
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              {stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="text-right">
            <p className="text-zinc-100 text-2xl font-bold">{arriveTime}</p>
            <p className="text-yellow-400 font-semibold">{toCode}</p>
            <p className="text-zinc-400 text-sm">{to}</p>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
          <div className="text-right">
            <p className="text-zinc-400 text-sm">From</p>
            <p className="text-yellow-400 text-3xl font-bold">
              ${price.toLocaleString()}
            </p>
            <p className="text-zinc-500 text-sm">{currency}</p>
          </div>
          <Button
            className="bg-gradient-to-r from-yellow-400 cursor-pointer to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 w-full shadow-lg shadow-yellow-400/20 font-bold"
            onClick={onSelect}
          >
            Select Flight
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-zinc-800">
        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
          <Calendar className="w-3 h-3 mr-1.5" />
          {departDate}
        </Badge>
        <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
          {cabinClass}
        </Badge>
        <Badge variant="secondary" className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30">
          {available} seats available
        </Badge>
        {stops === 0 && (
          <Badge variant="secondary" className="bg-blue-400/20 text-blue-300 border-blue-400/30">
            Direct Flight
          </Badge>
        )}
      </div>
    </div>
  );
}

// Use 'export default' to match your other files
export default FlightCard;