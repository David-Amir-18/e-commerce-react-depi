import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, Building2, CheckCircle, Lock, Calendar, User, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { bookingsAPI } from '../services/api';

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengerDetails, contactDetails, passengers } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [paypalEmail, setPaypalEmail] = useState('');

  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
  });

  const [errors, setErrors] = useState({});

  // Redirect if no flight data
  useEffect(() => {
    if (!flight) {
      navigate('/flights');
    }
  }, [flight, navigate]);

  // Get saved selections from sessionStorage
  const savedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
  const savedMeals = JSON.parse(sessionStorage.getItem('selectedMeals') || '{}');
  const savedBaggage = JSON.parse(sessionStorage.getItem('selectedBaggage') || '[]');

  // Calculate costs
  const totalPassengers = passengers?.adults + passengers?.children + passengers?.infants || 0;

  const flightCost = flight?.price * totalPassengers || 0;

  const mealsCost = Object.entries(savedMeals).reduce((sum, [id, qty]) => {
    // Meal prices
    const mealPrices = {
      chicken: 15, beef: 20, fish: 18, pasta: 12, salad: 10, vegan: 14,
      coffee: 3, tea: 2, juice: 5, soda: 3, water: 0
    };
    return sum + (mealPrices[id] || 0) * qty;
  }, 0);

  const baggageCost = savedBaggage.reduce((sum, baggageType) => {
    const prices = { standard: 0, extra: 50, premium: 120 };
    return sum + (prices[baggageType] || 0);
  }, 0);

  const subtotal = flightCost + mealsCost + baggageCost;
  const taxesAndFees = Math.round(subtotal * 0.15);
  const totalCost = subtotal + taxesAndFees;

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    // Format card number (16 digits with spaces)
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      formattedValue = formattedValue.slice(0, 19); // 16 digits + 3 spaces
    }

    // Format expiry date (MM/YY)
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    }

    // Format CVV (3-4 digits)
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    // Format card name (letters and spaces only)
    if (field === 'cardName') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, '');

      if (!cardNumberClean || cardNumberClean.length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!cardDetails.cardName || cardDetails.cardName.trim().length < 3) {
        newErrors.cardName = 'Cardholder name is required';
      }

      if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
        newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
      } else {
        const [monthStr, yearStr] = cardDetails.expiryDate.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        // Current date: November 2025
        const currentYear = 25; // 2025
        const currentMonth = 11; // November

        if (isNaN(month) || month < 1 || month > 12) {
          newErrors.expiryDate = 'Invalid month (01-12)';
        } else if (isNaN(year)) {
          newErrors.expiryDate = 'Invalid year';
        } else if (year < currentYear) {
          newErrors.expiryDate = 'Card has expired';
        } else if (year === currentYear && month < currentMonth) {
          newErrors.expiryDate = 'Card has expired';
        }
        // Current month/year and future dates are valid
      }

      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }

    if (paymentMethod === 'paypal') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!paypalEmail || !emailRegex.test(paypalEmail)) {
        newErrors.paypalEmail = 'Please enter a valid PayPal email address';
      }
    }

    if (paymentMethod === 'bank') {
      if (!bankDetails.accountName || bankDetails.accountName.trim().length < 3) {
        newErrors.accountName = 'Account holder name is required';
      }

      if (!bankDetails.accountNumber || bankDetails.accountNumber.length < 8) {
        newErrors.accountNumber = 'Account number must be at least 8 digits';
      }

      if (!bankDetails.bankName || bankDetails.bankName.trim().length < 3) {
        newErrors.bankName = 'Bank name is required';
      }

      if (!bankDetails.routingNumber || bankDetails.routingNumber.length < 6) {
        newErrors.routingNumber = 'Routing number must be at least 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Transform passengerDetails to match backend schema
      const transformedPassengerDetails = passengerDetails.map(passenger => ({
        type: passenger.type.toLowerCase(), // Convert 'Adult' to 'adult'
        title: passenger.data?.title || '',
        firstName: passenger.data?.firstName || '',
        lastName: passenger.data?.lastName || '',
        dateOfBirth: passenger.data?.dateOfBirth || null,
        nationality: passenger.data?.nationality || '',
        passportNumber: passenger.data?.passportNumber || ''
      }));

      // Transform contactDetails to match backend schema
      const transformedContactDetails = {
        email: contactDetails.email || '',
        phone: contactDetails.phoneNumber || '',
        country: contactDetails.country || ''
      };

      // Prepare booking data
      const bookingData = {
        flightDetails: {
          airline: flight.airline,
          airlineLogo: flight.airlineLogo,
          flightNumber: flight.flightNumber,
          from: flight.from,
          to: flight.to,
          fromCode: flight.fromCode,
          toCode: flight.toCode,
          departTime: flight.departTime,
          arriveTime: flight.arriveTime,
          departDate: flight.departDate,
          duration: flight.duration,
          stops: flight.stops || 0,
          cabinClass: flight.cabinClass || flight.class,
          price: flight.price,
          currency: flight.currency || 'USD'
        },
        seats: totalPassengers,
        passengers: passengers,
        passengerDetails: transformedPassengerDetails,
        contactDetails: transformedContactDetails,
        seatAssignments: savedSeats,
        meals: savedMeals,
        baggage: savedBaggage,
        pricing: {
          flightCost: flightCost,
          mealsCost: mealsCost,
          baggageCost: baggageCost,
          taxesAndFees: taxesAndFees,
          totalCost: totalCost
        },
        paymentMethod: paymentMethod
      };

      // Call the API to create booking
      const response = await bookingsAPI.create(bookingData);

      if (response.success) {
        setBookingReference(response.bookingReference || response.data?.bookingReference);

        // Clear saved selections
        sessionStorage.removeItem('selectedSeats');
        sessionStorage.removeItem('selectedMeals');
        sessionStorage.removeItem('selectedBaggage');
        sessionStorage.removeItem('bookingOptionsCompleted');

        setIsProcessing(false);
        setPaymentSuccess(true);

        // Navigate to home after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        setIsProcessing(false);
        alert(response.message || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Booking error:', error);
      alert(error.message || 'Failed to create booking. Please try again.');
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pay with PayPal balance',
      image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer',
      image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&auto=format&fit=crop&q=80'
    },
  ];

  if (!flight) {
    return null;
  }

  return (
    <div className="min-h-screen text-white pt-30 pb-12">
      <div className="container mx-auto px-8">
        {/* Success Overlay */}
        {paymentSuccess && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white/10 border border-emerald-400/30 rounded-xl p-8 max-w-lg mx-4 animate-in zoom-in duration-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-zinc-100 mb-3">Payment Successful!</h2>
                <p className="text-zinc-400 mb-6">Your booking has been confirmed</p>

                <div className="bg-zinc-800 border border-white/30 rounded-lg p-6 mb-6">
                  <p className="text-zinc-400 text-sm mb-2">Booking Reference</p>
                  <p className="text-yellow-400 text-3xl font-bold tracking-wider">{bookingReference}</p>
                </div>

                <div className="space-y-2 text-sm text-zinc-400 mb-6">
                  <p>✓ Confirmation email sent to {contactDetails?.email}</p>
                  <p>✓ E-tickets will be sent shortly</p>
                  <p>✓ Check-in opens 24 hours before departure</p>
                </div>

                <Button
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 font-bold"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white/10 border border-white/30 rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Processing Payment...</h3>
              <p className="text-zinc-400">Please wait, do not close this page</p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Options</span>
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Complete Your Payment</h1>
          <p className="text-zinc-400">Secure payment powered by industry-standard encryption</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white/10 border border-white/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">Select Payment Method</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {paymentMethods.map(method => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`rounded-xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                          : 'border-white/30 hover:border-yellow-400/50'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={method.image}
                          alt={method.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1.5">
                            <CheckCircle className="w-4 h-4 text-zinc-950" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 bg-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-yellow-400' : 'text-zinc-400'}`} />
                          <h3 className="font-semibold text-zinc-100 text-sm">{method.name}</h3>
                        </div>
                        <p className="text-zinc-500 text-xs">{method.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === 'card' && (
              <div className="bg-white/10 border border-white/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-zinc-100">Card Details</h2>
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="space-y-4">
                  {/* Card Number */}
                  <div>
                    <Label htmlFor="cardNumber" className="text-zinc-300 mb-2 block">
                      Card Number <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full bg-zinc-800 border ${
                          errors.cardNumber ? 'border-red-400' : 'border-white/30'
                        } rounded-md pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <Label htmlFor="cardName" className="text-zinc-300 mb-2 block">
                      Cardholder Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        id="cardName"
                        value={cardDetails.cardName}
                        onChange={(e) => handleCardInputChange('cardName', e.target.value)}
                        placeholder="John Doe"
                        className={`w-full bg-zinc-800 border ${
                          errors.cardName ? 'border-red-400' : 'border-white/30'
                        } rounded-md pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.cardName && (
                      <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-zinc-300 mb-2 block">
                        Expiry Date <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="text"
                          id="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          className={`w-full bg-zinc-800 border ${
                            errors.expiryDate ? 'border-red-400' : 'border-white/30'
                          } rounded-md pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                        />
                      </div>
                      {errors.expiryDate ? (
                        <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>
                      ) : (
                        <p className="text-zinc-500 text-xs mt-1">
                          e.g., 12/25 or 01/26
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvv" className="text-zinc-300 mb-2 block">
                        CVV <span className="text-red-400">*</span>
                      </Label>
                      <input
                        type="text"
                        id="cvv"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        placeholder="123"
                        className={`w-full bg-zinc-800 border ${
                          errors.cvv ? 'border-red-400' : 'border-white/30'
                        } rounded-md px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                      {errors.cvv && (
                        <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                  <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 text-sm font-semibold mb-1">Secure Payment</p>
                    <p className="text-emerald-300/80 text-xs">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Form */}
            {paymentMethod === 'paypal' && (
              <div className="bg-white/10 border border-white/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-zinc-100">PayPal Payment</h2>
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>

                <div className="space-y-4">
                  {/* PayPal Email */}
                  <div>
                    <Label htmlFor="paypalEmail" className="text-zinc-300 mb-2 block">
                      PayPal Email Address <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="email"
                        id="paypalEmail"
                        value={paypalEmail}
                        onChange={(e) => {
                          setPaypalEmail(e.target.value);
                          if (errors.paypalEmail) {
                            setErrors(prev => ({ ...prev, paypalEmail: null }));
                          }
                        }}
                        placeholder="your.email@example.com"
                        className={`w-full bg-zinc-800 border ${
                          errors.paypalEmail ? 'border-red-400' : 'border-white/30'
                        } rounded-md pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.paypalEmail && (
                      <p className="text-red-400 text-xs mt-1">{errors.paypalEmail}</p>
                    )}
                    <p className="text-zinc-500 text-xs mt-1">
                      You'll be redirected to PayPal to complete your payment
                    </p>
                  </div>
                </div>

                {/* PayPal Info */}
                <div className="mt-6 flex items-start gap-3 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-300 text-sm font-semibold mb-1">Secure PayPal Payment</p>
                    <p className="text-blue-300/80 text-xs">
                      Pay securely using your PayPal balance, bank account, or credit card through PayPal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Form */}
            {paymentMethod === 'bank' && (
              <div className="bg-white/10 border border-white/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-zinc-100">Bank Transfer Details</h2>
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>

                <div className="space-y-4">
                  {/* Account Holder Name */}
                  <div>
                    <Label htmlFor="accountName" className="text-zinc-300 mb-2 block">
                      Account Holder Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        id="accountName"
                        value={bankDetails.accountName}
                        onChange={(e) => {
                          setBankDetails(prev => ({ ...prev, accountName: e.target.value }));
                          if (errors.accountName) {
                            setErrors(prev => ({ ...prev, accountName: null }));
                          }
                        }}
                        placeholder="John Doe"
                        className={`w-full bg-zinc-800 border ${
                          errors.accountName ? 'border-red-400' : 'border-white/30'
                        } rounded-md pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.accountName && (
                      <p className="text-red-400 text-xs mt-1">{errors.accountName}</p>
                    )}
                  </div>

                  {/* Bank Name */}
                  <div>
                    <Label htmlFor="bankName" className="text-zinc-300 mb-2 block">
                      Bank Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        id="bankName"
                        value={bankDetails.bankName}
                        onChange={(e) => {
                          setBankDetails(prev => ({ ...prev, bankName: e.target.value }));
                          if (errors.bankName) {
                            setErrors(prev => ({ ...prev, bankName: null }));
                          }
                        }}
                        placeholder="Bank of America"
                        className={`w-full bg-zinc-800 border ${
                          errors.bankName ? 'border-red-400' : 'border-white/30'
                        } rounded-md pl-11 pr-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.bankName && (
                      <p className="text-red-400 text-xs mt-1">{errors.bankName}</p>
                    )}
                  </div>

                  {/* Account Number and Routing Number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber" className="text-zinc-300 mb-2 block">
                        Account Number <span className="text-red-400">*</span>
                      </Label>
                      <input
                        type="text"
                        id="accountNumber"
                        value={bankDetails.accountNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setBankDetails(prev => ({ ...prev, accountNumber: value }));
                          if (errors.accountNumber) {
                            setErrors(prev => ({ ...prev, accountNumber: null }));
                          }
                        }}
                        placeholder="12345678"
                        className={`w-full bg-zinc-800 border ${
                          errors.accountNumber ? 'border-red-400' : 'border-white/30'
                        } rounded-md px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                      {errors.accountNumber && (
                        <p className="text-red-400 text-xs mt-1">{errors.accountNumber}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="routingNumber" className="text-zinc-300 mb-2 block">
                        Routing Number <span className="text-red-400">*</span>
                      </Label>
                      <input
                        type="text"
                        id="routingNumber"
                        value={bankDetails.routingNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setBankDetails(prev => ({ ...prev, routingNumber: value }));
                          if (errors.routingNumber) {
                            setErrors(prev => ({ ...prev, routingNumber: null }));
                          }
                        }}
                        placeholder="123456"
                        className={`w-full bg-zinc-800 border ${
                          errors.routingNumber ? 'border-red-400' : 'border-white/30'
                        } rounded-md px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all`}
                      />
                      {errors.routingNumber && (
                        <p className="text-red-400 text-xs mt-1">{errors.routingNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Info */}
                <div className="mt-6 flex items-start gap-3 p-4 bg-purple-400/10 border border-purple-400/30 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-purple-300 text-sm font-semibold mb-1">Secure Bank Transfer</p>
                    <p className="text-purple-300/80 text-xs">
                      Your bank details are encrypted. Payment will be processed within 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Right Column (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Booking Summary */}
              <div className="bg-white/10 border border-white/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-4">Booking Summary</h3>

                {/* Flight Details */}
                <div className="mb-4 pb-4 border-b border-white/30">
                  <p className="text-zinc-400 text-sm mb-2">Flight</p>
                  <p className="text-zinc-100 font-semibold">
                    {flight.fromCode} → {flight.toCode}
                  </p>
                  <p className="text-zinc-500 text-sm">{flight.airline} • {flight.departDate}</p>
                </div>

                {/* Passengers */}
                <div className="mb-4 pb-4 border-b border-white/30">
                  <p className="text-zinc-400 text-sm mb-2">Passengers</p>
                  <p className="text-zinc-100">{totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}</p>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Flight Fare</span>
                    <span className="text-zinc-100 font-semibold">${flightCost.toLocaleString()}</span>
                  </div>

                  {savedSeats.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Seats ({savedSeats.length})</span>
                      <span className="text-zinc-100 font-semibold">Included</span>
                    </div>
                  )}

                  {mealsCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Meals & Beverages</span>
                      <span className="text-zinc-100 font-semibold">${mealsCost.toLocaleString()}</span>
                    </div>
                  )}

                  {baggageCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Extra Baggage</span>
                      <span className="text-zinc-100 font-semibold">${baggageCost.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Taxes & Fees</span>
                    <span className="text-zinc-100 font-semibold">${taxesAndFees.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-zinc-100">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-400">
                        ${totalCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-500">{flight.currency}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-zinc-300 hover:bg-zinc-700 hover:border-yellow-400 hover:text-white"
                >
                  Back to Options
                </Button>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 font-bold shadow-lg shadow-yellow-400/20"
                >
                  Pay ${totalCost.toLocaleString()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
