import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Luggage, CheckCircle, Briefcase, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function BaggageSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengerDetails, passengers, returnRoute } = location.state || {};

  const totalPassengers = passengers?.adults + passengers?.children + passengers?.infants || 0;
  const [selectedBaggage, setSelectedBaggage] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved baggage from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('selectedBaggage');
    if (saved) {
      setSelectedBaggage(JSON.parse(saved));
    } else {
      // Initialize with default for each passenger
      setSelectedBaggage(Array(totalPassengers).fill('standard'));
    }
  }, [totalPassengers]);

  // Redirect if no flight data
  useEffect(() => {
    if (!flight) {
      navigate('/flights');
    }
  }, [flight, navigate]);

  const baggageOptions = [
    {
      id: 'standard',
      name: 'Standard Baggage',
      description: 'Standard baggage allowance included in your ticket',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
      weight: '23 kg',
      pieces: '1 piece',
      price: 0,
      features: [
        '1 checked bag (23 kg)',
        '1 carry-on (8 kg)',
        'Standard priority',
      ],
      color: 'zinc',
      recommended: false,
    },
    {
      id: 'extra',
      name: 'Extra Baggage',
      description: 'Additional baggage allowance for more luggage',
      icon: Luggage,
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&auto=format&fit=crop&q=80',
      weight: '46 kg',
      pieces: '2 pieces',
      price: 50,
      features: [
        '2 checked bags (23 kg each)',
        '1 carry-on (8 kg)',
        'Priority handling',
      ],
      color: 'blue',
      recommended: true,
    },
    {
      id: 'premium',
      name: 'Premium Baggage',
      description: 'Maximum baggage allowance with priority handling',
      icon: Package,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
      weight: '92 kg',
      pieces: '4 pieces',
      price: 120,
      features: [
        '4 checked bags (23 kg each)',
        '2 carry-on bags (8 kg each)',
        'Premium priority handling',
        'Baggage insurance included',
      ],
      color: 'purple',
      recommended: false,
    },
  ];

  const handleBaggageSelect = (passengerIndex, baggageId) => {
    const updated = [...selectedBaggage];
    updated[passengerIndex] = baggageId;
    setSelectedBaggage(updated);
  };

  const getTotalCost = () => {
    return selectedBaggage.reduce((sum, baggageId) => {
      const option = baggageOptions.find(b => b.id === baggageId);
      return sum + (option?.price || 0);
    }, 0);
  };

  const getBaggageCount = (baggageId) => {
    return selectedBaggage.filter(b => b === baggageId).length;
  };

  const handleConfirm = () => {
    // Save to sessionStorage
    sessionStorage.setItem('selectedBaggage', JSON.stringify(selectedBaggage));

    // Mark as completed
    const completed = JSON.parse(sessionStorage.getItem('bookingOptionsCompleted') || '{}');
    completed.baggage = true;
    sessionStorage.setItem('bookingOptionsCompleted', JSON.stringify(completed));

    // Show success message
    setShowSuccess(true);

    // Navigate back after short delay
    setTimeout(() => {
      navigate(returnRoute || '/booking/options', { state: location.state });
    }, 1500);
  };

  if (!flight) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-emerald-400/30 rounded-xl p-8 max-w-md mx-4 animate-in zoom-in duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">Baggage Confirmed!</h3>
                <p className="text-zinc-400">Your baggage selection has been saved successfully</p>
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
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Select Baggage Allowance</h1>
          <p className="text-zinc-400">Choose baggage options for your {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Baggage Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Baggage Options Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {baggageOptions.map(option => {
                const Icon = option.icon;
                const count = getBaggageCount(option.id);
                const isPopular = option.recommended;

                return (
                  <div
                    key={option.id}
                    className={`bg-zinc-900 border-2 rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                      count > 0
                        ? 'border-yellow-400 shadow-yellow-400/20'
                        : 'border-zinc-800 hover:border-zinc-700'
                    } ${isPopular ? 'relative' : ''}`}
                  >
                    {/* Recommended Badge */}
                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-950 text-xs font-bold py-1 px-3 text-center z-10">
                        ⭐ MOST POPULAR
                      </div>
                    )}

                    {/* Image */}
                    <div className={`relative h-32 overflow-hidden ${isPopular ? 'mt-6' : ''}`}>
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {count > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-zinc-950 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {count}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-5 h-5 text-${option.color}-400`} />
                        <h3 className="font-bold text-zinc-100">{option.name}</h3>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">
                            {option.weight}
                          </Badge>
                          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">
                            {option.pieces}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs mb-3">{option.description}</p>

                      {/* Features */}
                      <ul className="space-y-1 mb-4">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                            <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price */}
                      <div className="text-center mb-3 py-2 border-t border-zinc-800">
                        <span className="text-yellow-400 text-2xl font-bold">
                          {option.price === 0 ? 'Included' : `$${option.price}`}
                        </span>
                        {option.price > 0 && (
                          <span className="text-zinc-500 text-xs block">per passenger</span>
                        )}
                      </div>

                      {/* Select Count Display */}
                      {count > 0 && (
                        <div className="text-center mb-2">
                          <Badge className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-xs">
                            {count} passenger{count !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Passenger-wise Selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-zinc-100 mb-4">Assign Baggage to Each Passenger</h3>
              <div className="space-y-3">
                {Array.from({ length: totalPassengers }, (_, i) => i).map(index => {
                  const passengerData = passengerDetails?.[index]?.data;
                  const passengerName = passengerData?.firstName
                    ? `${passengerData.firstName} ${passengerData.lastName}`
                    : `Passenger ${index + 1}`;

                  return (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-800/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-zinc-100">{passengerName}</p>
                        <p className="text-zinc-500 text-sm">
                          {passengerDetails?.[index]?.type || 'Adult'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {baggageOptions.map(option => {
                          const isSelected = selectedBaggage[index] === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={() => handleBaggageSelect(index, option.id)}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                isSelected
                                  ? 'bg-yellow-400 text-zinc-950'
                                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                              }`}
                            >
                              {option.name.replace(' Baggage', '')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Cost Summary */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-4">Cost Summary</h3>

                <div className="space-y-2 mb-4">
                  {baggageOptions.filter(opt => opt.price > 0).map(option => {
                    const count = getBaggageCount(option.id);
                    if (count === 0) return null;

                    return (
                      <div key={option.id} className="flex justify-between text-sm">
                        <span className="text-zinc-400">
                          {option.name} × {count}
                        </span>
                        <span className="text-zinc-100 font-semibold">
                          ${option.price * count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-100 font-semibold">Total</span>
                    <span className="text-yellow-400 text-xl font-bold">${getTotalCost()}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-3">Baggage Policy</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>All passengers receive standard baggage allowance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Extra baggage can be purchased here at a discounted rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Airport baggage fees are higher than pre-booking online</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(returnRoute || '/booking/options', { state: location.state })}
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-yellow-400"
                >
                  Back to Options
                </Button>

                <Button
                  onClick={handleConfirm}
                  className="w-full font-bold shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 shadow-yellow-400/20"
                >
                  Confirm Baggage Selection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaggageSelectionPage;
