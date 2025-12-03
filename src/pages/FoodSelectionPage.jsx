import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed, CheckCircle, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export function FoodSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengerDetails, passengers, returnRoute } = location.state || {};

  const totalPassengers = passengers?.adults + passengers?.children + passengers?.infants || 0;
  const [selectedMeals, setSelectedMeals] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved meals from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('selectedMeals');
    if (saved) {
      setSelectedMeals(JSON.parse(saved));
    }
  }, []);

  // Redirect if no flight data
  useEffect(() => {
    if (!flight) {
      navigate('/flights');
    }
  }, [flight, navigate]);

  const mealOptions = [
    {
      id: 'chicken',
      name: 'Grilled Chicken',
      description: 'Tender grilled chicken breast with roasted vegetables and rice',
      price: 15,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&auto=format&fit=crop&q=80',
      category: 'Main Course',
      dietary: ['Gluten-Free'],
    },
    {
      id: 'beef',
      name: 'Beef Steak',
      description: 'Premium beef steak with mashed potatoes and seasonal vegetables',
      price: 20,
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&auto=format&fit=crop&q=80',
      category: 'Main Course',
      dietary: ['High Protein'],
    },
    {
      id: 'fish',
      name: 'Salmon Fillet',
      description: 'Grilled salmon with lemon butter sauce and steamed broccoli',
      price: 18,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop&q=80',
      category: 'Main Course',
      dietary: ['Omega-3', 'Healthy'],
    },
    {
      id: 'pasta',
      name: 'Pasta Primavera',
      description: 'Fresh pasta with seasonal vegetables in a light tomato sauce',
      price: 12,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop&q=80',
      category: 'Main Course',
      dietary: ['Vegetarian'],
    },
    {
      id: 'salad',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan, croutons, and Caesar dressing',
      price: 10,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&auto=format&fit=crop&q=80',
      category: 'Appetizer',
      dietary: ['Vegetarian', 'Light'],
    },
    {
      id: 'vegan',
      name: 'Vegan Bowl',
      description: 'Quinoa, roasted vegetables, chickpeas, and tahini dressing',
      price: 14,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80',
      category: 'Main Course',
      dietary: ['Vegan', 'Gluten-Free'],
    },
  ];

  const beverageOptions = [
    {
      id: 'coffee',
      name: 'Coffee',
      price: 3,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'tea',
      name: 'Tea',
      price: 2,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'juice',
      name: 'Fresh Juice',
      price: 5,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'soda',
      name: 'Soft Drink',
      price: 3,
      image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'water',
      name: 'Water',
      price: 0,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&auto=format&fit=crop&q=80'
    },
  ];

  const handleMealQuantityChange = (mealId, delta, isBeverage = false) => {
    setSelectedMeals(prev => {
      const current = prev[mealId] || 0;
      const newQuantity = Math.max(0, current + delta);

      if (delta > 0) {
        const currentTotal = isBeverage ? getTotalBeverages(prev) : getTotalMeals(prev);
        if (currentTotal >= totalPassengers) {
          return prev;
        }
      }

      if (newQuantity === 0) {
        const { [mealId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [mealId]: newQuantity };
    });
  };

  const getTotalItems = () => {
    return Object.values(selectedMeals).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalMeals = (meals = selectedMeals) => {
    return mealOptions.reduce((sum, meal) => {
      return sum + (meals[meal.id] || 0);
    }, 0);
  };

  const getTotalBeverages = (meals = selectedMeals) => {
    return beverageOptions.reduce((sum, bev) => {
      return sum + (meals[bev.id] || 0);
    }, 0);
  };

  const getTotalCost = () => {
    return Object.entries(selectedMeals).reduce((sum, [id, qty]) => {
      const item = [...mealOptions, ...beverageOptions].find(m => m.id === id);
      return sum + (item?.price || 0) * qty;
    }, 0);
  };

  const handleConfirm = () => {
    sessionStorage.setItem('selectedMeals', JSON.stringify(selectedMeals));

    const completed = JSON.parse(sessionStorage.getItem('bookingOptionsCompleted') || '{}');
    completed.food = true;
    sessionStorage.setItem('bookingOptionsCompleted', JSON.stringify(completed));

    setShowSuccess(true);

    setTimeout(() => {
      navigate(returnRoute || '/booking/options', { state: location.state });
    }, 1500);
  };

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
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">Meals Confirmed!</h3>
                <p className="text-zinc-400">Your meal selection has been saved successfully</p>
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
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Pre-Order Your Meals</h1>
          <p className="text-zinc-400">Select delicious meals for your {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Meals Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Information Notice */}
            <div className="bg-blue-400/10 border border-blue-400/30 rounded-xl p-4">
              <div className="flex gap-3">
                <UtensilsCrossed className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-300 text-sm font-semibold mb-1">
                    Meal Selection Policy
                  </p>
                  <p className="text-blue-300/80 text-xs">
                    Each passenger can pre-order <strong>one main course</strong> and <strong>one beverage</strong>.
                    For {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}, you can select up to {totalPassengers} main dish{totalPassengers > 1 ? 'es' : ''} and {totalPassengers} drink{totalPassengers > 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Course Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-100">Main Courses</h2>
                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  {getTotalMeals()}/{totalPassengers} selected
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {mealOptions.map(meal => {
                  const quantity = selectedMeals[meal.id] || 0;
                  const totalMeals = getTotalMeals();
                  const canAddMore = totalMeals < totalPassengers;

                  return (
                    <div
                      key={meal.id}
                      className="bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all"
                    >
                      {/* Meal Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                        {quantity > 0 && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-zinc-950 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {quantity}
                          </div>
                        )}
                      </div>

                      {/* Meal Details */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-zinc-100">{meal.name}</h3>
                          <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 text-xs">
                            ${meal.price}
                          </Badge>
                        </div>
                        <p className="text-zinc-400 text-sm mb-3">{meal.description}</p>

                        {/* Dietary Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {meal.dietary.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMealQuantityChange(meal.id, -1, false)}
                            disabled={quantity === 0}
                            className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold text-zinc-100">{quantity}</span>
                          <button
                            onClick={() => handleMealQuantityChange(meal.id, 1, false)}
                            disabled={!canAddMore}
                            className="w-8 h-8 rounded-lg bg-yellow-400 text-zinc-950 flex items-center justify-center hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Beverages Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-zinc-100">Beverages</h2>
                <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  {getTotalBeverages()}/{totalPassengers} selected
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {beverageOptions.map(beverage => {
                  const quantity = selectedMeals[beverage.id] || 0;
                  const totalBeverages = getTotalBeverages();
                  const canAddMore = totalBeverages < totalPassengers;

                  return (
                    <div
                      key={beverage.id}
                      className="bg-white/10 border border-white/20 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all"
                    >
                      {/* Beverage Image */}
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={beverage.image}
                          alt={beverage.name}
                          className="w-full h-full object-cover"
                        />
                        {quantity > 0 && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-zinc-950 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
                            {quantity}
                          </div>
                        )}
                      </div>

                      {/* Beverage Details */}
                      <div className="p-3">
                        <div className="text-center mb-3">
                          <h3 className="font-semibold text-zinc-100 text-sm mb-1">{beverage.name}</h3>
                          <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 text-xs">
                            {beverage.price === 0 ? 'Free' : `$${beverage.price}`}
                          </Badge>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleMealQuantityChange(beverage.id, -1, true)}
                            disabled={quantity === 0}
                            className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-semibold text-zinc-100 text-sm">{quantity}</span>
                          <button
                            onClick={() => handleMealQuantityChange(beverage.id, 1, true)}
                            disabled={!canAddMore}
                            className="w-7 h-7 rounded-lg bg-yellow-400 text-zinc-950 flex items-center justify-center hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
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
              {/* Order Summary */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-4">Order Summary</h3>

                {Object.keys(selectedMeals).length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">No items selected</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {Object.entries(selectedMeals).map(([id, qty]) => {
                      const item = [...mealOptions, ...beverageOptions].find(m => m.id === id);
                      if (!item || qty === 0) return null;
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <span className="text-zinc-400">
                            {item.name} × {qty}
                          </span>
                          <span className="text-zinc-100 font-semibold">
                            ${item.price * qty}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-100 font-semibold">Total</span>
                    <span className="text-yellow-400 text-xl font-bold">${getTotalCost()}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-zinc-100 mb-3">Information</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Maximum 1 main course and 1 beverage per passenger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Meals will be served during the flight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>You can skip this step if you prefer standard in-flight service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Special dietary requirements available</span>
                  </li>
                </ul>
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
                  className="w-full font-bold shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-950 shadow-yellow-400/20"
                >
                  Confirm Meal Selection
                </Button>

                <p className="text-zinc-500 text-xs text-center">
                  You can proceed without selecting meals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodSelectionPage;
