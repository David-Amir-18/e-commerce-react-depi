import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArmchairIcon, UtensilsCrossed, Luggage, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function BookingOptionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchCriteria, passengerDetails, contactDetails, passengers } = location.state || {};

  const [completedOptions, setCompletedOptions] = useState({
    seats: false,
    food: false,
    baggage: false,
  });

  useEffect(() => {
    const saved = sessionStorage.getItem('bookingOptionsCompleted');
    if (saved) {
      setCompletedOptions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!flight) {
      navigate('/flights');
    }
  }, [flight, navigate]);

  const options = [
    {
      id: 'seats',
      title: 'Seat Selection',
      description: 'Choose your preferred seat for a comfortable journey',
      icon: ArmchairIcon,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
      route: '/booking/seat-selection',
      color: 'blue',
    },
    {
      id: 'food',
      title: 'Meal Selection',
      description: 'Pre-order your in-flight meals and beverages',
      icon: UtensilsCrossed,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      route: '/booking/food-selection',
      color: 'orange',
    },
    {
      id: 'baggage',
      title: 'Baggage Selection',
      description: 'Add extra baggage allowance to your booking',
      icon: Luggage,
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80',
      route: '/booking/baggage-selection',
      color: 'purple',
    },
  ];

  const handleOptionClick = (option) => {
    navigate(option.route, {
      state: {
        flight,
        searchCriteria,
        passengerDetails,
        contactDetails,
        passengers,
        returnRoute: '/booking/options',
      },
    });
  };

  const allOptionsCompleted = completedOptions.seats && completedOptions.food && completedOptions.baggage;

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  if (!flight) {
    return null;
  }

  return (
    <div className="min-h-screen text-white pt-30 pb-12">
      <div className="container mx-auto px-8 ">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Passenger Details</span>
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Customize Your Journey</h1>
          <p className="text-zinc-400">Select your preferences to enhance your flight experience</p>
        </div>

        {/* Flight Summary Badge */}
        <div className="mb-8 bg-white/10 border border-white/20 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-zinc-100">
                <span className="font-bold text-lg">{flight.fromCode}</span>
                <span className="mx-2 text-zinc-500">→</span>
                <span className="font-bold text-lg">{flight.toCode}</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                {flight.airline}
              </Badge>
            </div>
            <div className="text-zinc-400 text-sm">
              {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''} • {flight.departDate}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Options Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-zinc-100 mb-4">Booking Progress</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                    style={{
                      width: `${((Object.values(completedOptions).filter(Boolean).length / 3) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-zinc-400 text-sm font-semibold">
                  {Object.values(completedOptions).filter(Boolean).length}/3 Completed
                </span>
              </div>
            </div>

            {/* Options Cards */}
            <div className="space-y-4">
              {options.map((option) => {
                const Icon = option.icon;
                const isCompleted = completedOptions[option.id];

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="w-full group"
                  >
                    <div className="bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10">
                      <div className="grid md:grid-cols-3 gap-4">                        <div className="relative h-48 md:h-auto overflow-hidden">
                          <img
                            src={option.image}
                            alt={option.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {isCompleted && (
                            <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-2">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}
                        </div>                        <div className="md:col-span-2 p-6 flex flex-col justify-center">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-lg bg-${option.color}-400/10 border border-${option.color}-400/30`}>
                                <Icon className={`w-6 h-6 text-${option.color}-400`} />
                              </div>
                              <div className="text-left">
                                <h3 className="text-xl font-bold text-zinc-100 mb-1">{option.title}</h3>
                                <p className="text-zinc-400 text-sm">{option.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
                          </div>

                          {isCompleted ? (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                              <span className="text-zinc-500 text-xs">Click to modify</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                                Pending
                              </Badge>
                              <span className="text-zinc-500 text-xs">Click to complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Important Notice */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-3">Important</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Complete all three sections to proceed to payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>You can modify your selections anytime before payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Some options may have additional charges</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-yellow-400 hover:text-white"
                >
                  Back to Passenger Details
                </Button>

                <Button
                  disabled={!allOptionsCompleted}
                  onClick={() => {
                    if (allOptionsCompleted) {
                      navigate('/booking/payment', {
                        state: {
                          flight,
                          searchCriteria,
                          passengerDetails,
                          contactDetails,
                          passengers,
                        },
                      });
                    }
                  }}
                  className={`w-full font-bold shadow-lg ${
                    allOptionsCompleted
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 shadow-yellow-400/20'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                </Button>

                {!allOptionsCompleted && (
                  <p className="text-zinc-500 text-xs text-center">
                    Complete all sections to continue to payment
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

export default BookingOptionsPage;
