import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';
import { Button } from './ui/button';

export function PassengerSelector({ passengers, onPassengersChange }) {
  const totalPassengers = passengers.adults + passengers.children + passengers.infants;
  const maxPassengers = 9;

  const handleIncrement = (type) => {
    if (totalPassengers >= maxPassengers) return;
    onPassengersChange({
      ...passengers,
      [type]: passengers[type] + 1,
    });
  };

  const handleDecrement = (type) => {
    if (passengers[type] <= 0) return;
    if (type === 'adults' && passengers[type] <= 1) return;
    onPassengersChange({
      ...passengers,
      [type]: passengers[type] - 1,
    });
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-zinc-100">Passengers</h2>
      </div>

      {/* Adults */}
      <div className="flex items-center justify-between py-4 border-b border-white/20">
        <div className="flex-1">
          <p className="text-zinc-100 font-semibold">Adults</p>
          <p className="text-zinc-400 text-sm">Ages 12+</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400"
            onClick={() => handleDecrement('adults')}
            disabled={passengers.adults <= 1}
            aria-label="Decrease number of Adult passengers"
          >
            <Minus className="h-4 w-4 text-yellow-400" />
          </Button>
          <span className="text-zinc-100 font-semibold min-w-[3rem] text-center">
            {passengers.adults}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400"
            onClick={() => handleIncrement('adults')}
            disabled={totalPassengers >= maxPassengers}
            aria-label="Increase number of Adult passengers"
          >
            <Plus className="h-4 w-4 text-yellow-400" />
          </Button>
        </div>
      </div>

      {/* Children */}
      <div className="flex items-center justify-between py-4 border-b border-white/20">
        <div className="flex-1">
          <p className="text-zinc-100 font-semibold">Child</p>
          <p className="text-zinc-400 text-sm">Ages 2-11</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400"
            onClick={() => handleDecrement('children')}
            disabled={passengers.children <= 0}
            aria-label="Decrease number of Child passengers"
          >
            <Minus className="h-4 w-4 text-yellow-400" />
          </Button>
          <span className="text-zinc-100 font-semibold min-w-[3rem] text-center">
            {passengers.children}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400"
            onClick={() => handleIncrement('children')}
            disabled={totalPassengers >= maxPassengers}
            aria-label="Increase number of Child passengers"
          >
            <Plus className="h-4 w-4 text-yellow-400" />
          </Button>
        </div>
      </div>

      {/* Infants */}
      <div className="flex items-center justify-between py-4">
        <div className="flex-1">
          <p className="text-zinc-100 font-semibold">Infant</p>
          <p className="text-zinc-400 text-sm">Ages under 2, on lap</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400"
            onClick={() => handleDecrement('infants')}
            disabled={passengers.infants <= 0}
            aria-label="Decrease number of Infant passengers"
          >
            <Minus className="h-4 w-4 text-yellow-400" />
          </Button>
          <span className="text-zinc-100 font-semibold min-w-[3rem] text-center">
            {passengers.infants}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:border-yellow-400"
            onClick={() => handleIncrement('infants')}
            disabled={totalPassengers >= maxPassengers}
            aria-label="Increase number of Infant passengers"
          >
            <Plus className="h-4 w-4 text-yellow-400" />
          </Button>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-zinc-400 text-sm">
          Please note: You can book for a maximum of {maxPassengers} passengers.
        </p>
        <p className="text-yellow-400 text-sm mt-2 font-semibold">
          Total: {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

export default PassengerSelector;
