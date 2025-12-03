import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArmchairIcon, CheckCircle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function SeatSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengerDetails, passengers, returnRoute } = location.state || {};

  const totalPassengers = passengers?.adults + passengers?.children + passengers?.infants || 0;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('selectedSeats');
    if (saved) {
      setSelectedSeats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!flight) {
      navigate('/flights');
    }
  }, [flight, navigate]);

  const rows = 30;
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  const occupiedSeats = ['1A', '1B', '2C', '3D', '5E', '5F', '7A', '8B', '10C', '12D', '15E', '18F', '20A', '22B'];

  const premiumRows = [1, 2, 3, 4, 5];

  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < totalPassengers) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const getSeatStatus = (seatNumber, rowNum) => {
    if (occupiedSeats.includes(seatNumber)) {
      return 'occupied';
    }
    if (selectedSeats.includes(seatNumber)) {
      return 'selected';
    }
    if (premiumRows.includes(rowNum)) {
      return 'premium';
    }
    return 'available';
  };

  const getSeatStyles = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700';
      case 'selected':
        return 'bg-yellow-400 text-zinc-950 border-yellow-500 shadow-lg shadow-yellow-400/30';
      case 'premium':
        return 'bg-blue-400/20 text-blue-300 border-blue-400/40 hover:bg-blue-400/30 cursor-pointer';
      default:
        return 'bg-white/10 text-zinc-300 border-zinc-700 hover:border-yellow-400/50 cursor-pointer hover:bg-zinc-800';
    }
  };

  const handleConfirm = () => {
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));

    const completed = JSON.parse(sessionStorage.getItem('bookingOptionsCompleted') || '{}');
    completed.seats = true;
    sessionStorage.setItem('bookingOptionsCompleted', JSON.stringify(completed));

    setShowSuccess(true);

    setTimeout(() => {
      navigate(returnRoute || '/booking/options', { state: location.state });
    }, 1500);
  };

  const canConfirm = selectedSeats.length === totalPassengers;

  if (!flight) {
    return null;
  }

  return (
    <div className="min-h-screen text-white pt-30 pb-12">
      <div className="container mx-auto px-8">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white/10 border border-emerald-400/30 rounded-xl p-8 max-w-md mx-4 animate-in zoom-in duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">Seats Confirmed!</h3>
                <p className="text-zinc-400">Your seat selection has been saved successfully</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(returnRoute || '/booking/options', { state: location.state })}
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Options</span>
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Select Your Seats</h1>
          <p className="text-zinc-400">Choose {totalPassengers} seat{totalPassengers > 1 ? 's' : ''} for your journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Seat Map - Left Column (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-black/70 border border-white/20 rounded-xl p-6">
              {/* Aircraft Front */}
              <div className="mb-6 text-center">
                <div className="inline-block bg-zinc-800 rounded-full px-6 py-2 border border-zinc-700">
                  <span className="text-zinc-400 text-sm font-semibold">← Front of Aircraft</span>
                </div>
              </div>

              {/* Column Headers */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-2 items-center">
                  {columns.slice(0, 3).map(col => (
                    <div key={col} className="w-10 text-center text-zinc-500 text-sm font-semibold">
                      {col}
                    </div>
                  ))}
                  <div className="w-8" /> {/* Aisle */}
                  {columns.slice(3).map(col => (
                    <div key={col} className="w-10 text-center text-zinc-500 text-sm font-semibold">
                      {col}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Rows */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {Array.from({ length: rows }, (_, i) => i + 1).map(rowNum => (
                  <div key={rowNum} className="flex items-center justify-center gap-2">
                    {/* Row Number */}
                    <div className="w-8 text-center text-zinc-500 text-sm font-semibold">
                      {rowNum}
                    </div>

                    {/* Left Seats (A, B, C) */}
                    {columns.slice(0, 3).map(col => {
                      const seatNumber = `${rowNum}${col}`;
                      const status = getSeatStatus(seatNumber, rowNum);
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => handleSeatClick(seatNumber)}
                          disabled={status === 'occupied'}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${getSeatStyles(status)}`}
                          title={`Seat ${seatNumber} - ${status}`}
                        >
                          <ArmchairIcon className="w-5 h-5" />
                        </button>
                      );
                    })}

                    {/* Aisle */}
                    <div className="w-8 border-l border-r border-white/20 h-10 flex items-center justify-center">
                      <div className="text-zinc-700 text-xs">||</div>
                    </div>

                    {/* Right Seats (D, E, F) */}
                    {columns.slice(3).map(col => {
                      const seatNumber = `${rowNum}${col}`;
                      const status = getSeatStatus(seatNumber, rowNum);
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => handleSeatClick(seatNumber)}
                          disabled={status === 'occupied'}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all ${getSeatStyles(status)}`}
                          title={`Seat ${seatNumber} - ${status}`}
                        >
                          <ArmchairIcon className="w-5 h-5" />
                        </button>
                      );
                    })}

                    {/* Row Number */}
                    <div className="w-8 text-center text-zinc-500 text-sm font-semibold">
                      {rowNum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Selection Summary */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-4">Your Selection</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Required:</span>
                    <span className="text-zinc-100 font-semibold">{totalPassengers} seat{totalPassengers > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Selected:</span>
                    <span className={`font-semibold ${selectedSeats.length === totalPassengers ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {selectedSeats.length > 0 && (
                    <div className="pt-3 border-t border-white/20">
                      <p className="text-zinc-400 text-xs mb-2">Selected Seats:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                          <Badge key={seat} className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                            {seat}
                            <button
                              onClick={() => handleSeatClick(seat)}
                              className="ml-1 hover:text-yellow-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-4">Legend</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 border-2 border-zinc-700 rounded-lg flex items-center justify-center">
                      <ArmchairIcon className="w-4 h-4 text-zinc-300" />
                    </div>
                    <span className="text-zinc-400 text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-400/20 border-2 border-blue-400/40 rounded-lg flex items-center justify-center">
                      <ArmchairIcon className="w-4 h-4 text-blue-300" />
                    </div>
                    <span className="text-zinc-400 text-sm">Premium (Extra Legroom)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
                      <ArmchairIcon className="w-4 h-4 text-zinc-950" />
                    </div>
                    <span className="text-zinc-400 text-sm">Your Selection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 border-2 border-zinc-700 rounded-lg flex items-center justify-center">
                      <ArmchairIcon className="w-4 h-4 text-zinc-600" />
                    </div>
                    <span className="text-zinc-400 text-sm">Occupied</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(returnRoute || '/booking/options', { state: location.state })}
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-yellow-400 hover:text-white"
                >
                  Back to Options
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className={`w-full font-bold shadow-lg ${
                    canConfirm
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 shadow-yellow-400/20'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Seat Selection
                </Button>

                {!canConfirm && (
                  <p className="text-zinc-500 text-xs text-center">
                    {selectedSeats.length < totalPassengers
                      ? `Select ${totalPassengers - selectedSeats.length} more seat${totalPassengers - selectedSeats.length !== 1 ? 's' : ''}`
                      : 'Please select exactly ' + totalPassengers + ' seat' + (totalPassengers !== 1 ? 's' : '')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;
