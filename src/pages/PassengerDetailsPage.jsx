import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Clock, Calendar, CheckCircle } from 'lucide-react';
import PassengerSelector from '../components/PassengerSelector';
import PassengerForm from '../components/PassengerForm';
import ContactDetailsForm from '../components/ContactDetailsForm';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function PassengerDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, searchCriteria } = location.state || {};

  // Use search criteria as default, fallback to 1 adult
  const [passengers, setPassengers] = useState({
    adults: parseInt(searchCriteria?.adults) || 1,
    children: parseInt(searchCriteria?.children) || 0,
    infants: parseInt(searchCriteria?.infants) || 0,
  });

  const [passengerDetails, setPassengerDetails] = useState([]);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [contactDetails, setContactDetails] = useState({
    contactPerson: '',
    country: '',
    phoneNumber: '',
    email: '',
  });

  // Redirect if no flight data
  useEffect(() => {
    if (!flight) {
      navigate('/flights');
    }
  }, [flight, navigate]);

  // Generate passenger list based on counts
  useEffect(() => {
    const newPassengerList = [];

    for (let i = 0; i < passengers.adults; i++) {
      newPassengerList.push({
        type: 'Adult',
        data: passengerDetails[newPassengerList.length] || null,
      });
    }

    for (let i = 0; i < passengers.children; i++) {
      newPassengerList.push({
        type: 'Child',
        data: passengerDetails[newPassengerList.length] || null,
      });
    }

    for (let i = 0; i < passengers.infants; i++) {
      newPassengerList.push({
        type: 'Infant',
        data: passengerDetails[newPassengerList.length] || null,
      });
    }

    setPassengerDetails(newPassengerList);

    // Reset to first passenger if current index is out of bounds
    if (currentPassengerIndex >= newPassengerList.length && newPassengerList.length > 0) {
      setCurrentPassengerIndex(newPassengerList.length - 1);
    }
  }, [passengers]);

  const handlePassengerSave = (index, data) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      data,
    };
    setPassengerDetails(updatedDetails);
  };

  const handleNext = () => {
    if (currentPassengerIndex < passengerDetails.length - 1) {
      setCurrentPassengerIndex(currentPassengerIndex + 1);
    }
  };

  const allPassengersCompleted = passengerDetails.every(p => p.data && p.data.title && p.data.firstName && p.data.lastName);

  const contactDetailsCompleted =
    contactDetails.contactPerson &&
    contactDetails.country &&
    contactDetails.phoneNumber &&
    contactDetails.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email);

  const canContinue = allPassengersCompleted && contactDetailsCompleted;

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
          <span>Return to Flights</span>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">Complete Your Booking</h1>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Review Your Flight</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Review Your Flight */}
            <div>
              {/* "Review Your Flight" used to be here */}
              {/* Flight Card */}
              <div className="bg-white/10 rounded-xl border border-white/20 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Airline Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                      {flight.airlineLogo ? (
                        <img src={flight.airlineLogo} alt={flight.airline} className="w-12 h-12 object-contain" />
                      ) : (
                        <Plane className="w-8 h-8 text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-zinc-100 font-semibold text-lg">{flight.airline}</h3>
                      <p className="text-zinc-400 text-sm">{flight.flightNumber}</p>
                    </div>
                  </div>

                  {/* Flight Times */}
                  <div className="flex-1 grid grid-cols-3 items-center gap-4">
                    <div>
                      <p className="text-zinc-100 text-2xl font-bold">{flight.departTime}</p>
                      <p className="text-yellow-400 font-semibold">{flight.fromCode}</p>
                      <p className="text-zinc-400 text-sm">{flight.from}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="text-zinc-400 text-sm mb-1">{flight.duration}</p>
                      <div className="relative w-full">
                        <div className="h-px bg-zinc-700 w-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 px-2">
                          <Plane className="w-4 h-4 text-yellow-400 rotate-90" />
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm mt-1">
                        {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-zinc-100 text-2xl font-bold">{flight.arriveTime}</p>
                      <p className="text-yellow-400 font-semibold">{flight.toCode}</p>
                      <p className="text-zinc-400 text-sm">{flight.to}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/20">
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {flight.departDate}
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                    {flight.cabinClass}
                  </Badge>
                  {flight.stops === 0 && (
                    <Badge variant="secondary" className="bg-blue-400/20 text-blue-300 border-blue-400/30">
                      Direct Flight
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Passenger Selector */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">Select Number of Passengers</h2>
              <PassengerSelector passengers={passengers} onPassengersChange={setPassengers} />
            </div>

            {/* Passenger Details Forms */}
            {passengerDetails.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 mb-4">Complete Passenger Details</h2>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {passengerDetails.map((passenger, index) => {
                    const isCompleted = passenger.data && passenger.data.firstName;
                    const isCurrent = currentPassengerIndex === index;

                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPassengerIndex(index)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          isCurrent
                            ? 'bg-yellow-400 text-zinc-950'
                            : isCompleted
                            ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-400/30'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-yellow-400/50'
                        }`}
                      >
                        {isCompleted && !isCurrent && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>Passenger {index + 1} ({passenger.type})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Current Passenger Form */}
                {passengerDetails[currentPassengerIndex] && (
                  <PassengerForm
                    passengerNumber={currentPassengerIndex + 1}
                    passengerType={passengerDetails[currentPassengerIndex].type}
                    data={passengerDetails[currentPassengerIndex].data}
                    onSave={handlePassengerSave}
                    onNext={handleNext}
                    isLast={currentPassengerIndex === passengerDetails.length - 1}
                  />
                )}
              </div>
            )}

            {/* Contact Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-4">Contact Details</h2>
              <ContactDetailsForm data={contactDetails} onSave={setContactDetails} />
            </div>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-25 space-y-4">
              {/* Price Summary */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-zinc-100 mb-4">Price Summary</h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-white/20">
                  <div className="flex justify-between text-zinc-300">
                    <span>Base Fare ({passengers.adults + passengers.children + passengers.infants} passenger{(passengers.adults + passengers.children + passengers.infants) > 1 ? 's' : ''})</span>
                    <span>${(flight.price * (passengers.adults + passengers.children + passengers.infants)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Taxes & Fees</span>
                    <span>${Math.round(flight.price * 0.15 * (passengers.adults + passengers.children + passengers.infants)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-zinc-100">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">
                      ${Math.round(flight.price * 1.15 * (passengers.adults + passengers.children + passengers.infants)).toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-500">{flight.currency}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-yellow-400 hover:text-white"
                >
                  Return to Flights
                </Button>

                <Button
                  disabled={!canContinue}
                  onClick={() => {
                    if (canContinue) {
                      navigate('/booking/options', {
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
                    canContinue
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 shadow-yellow-400/20'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Options
                </Button>

                {!canContinue && (
                  <p className="text-zinc-500 text-xs text-center">
                    {!allPassengersCompleted
                      ? 'Please complete all passenger details to continue'
                      : 'Please complete contact details to continue'}
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

export default PassengerDetailsPage;
