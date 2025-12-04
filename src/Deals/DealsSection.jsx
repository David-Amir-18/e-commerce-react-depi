import React, { useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import DealsCards from '../components/ui/DealsCards'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {allDealsData,categories} from './allDealsData';

const DealsSection = () => {
  const [activeTab, setActiveTab] = useState('Cheapest flights');
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const currentDeals = allDealsData[activeTab] || [];

  const handleScroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  const handleDealClick = (deal) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 30);
    const futureDate = dateObj.toISOString().split('T')[0];

    const originCode = 'CAI'; 
    const originName = 'Cairo';
    
    console.log('Searching flights:', {
      from: `${originName} (${originCode})`,
      to: `${deal.dest} (${deal.destCode})`,
      date: futureDate
    });
    
    const queryParams = new URLSearchParams({
      origin: originCode,
      originName: originName,
      destination: deal.destCode,
      destinationName: deal.dest,
      date: futureDate,
      passengers: '1',
      cabin: "Economy",
      tripType: "One Way",
    });

    navigate(`/flights?${queryParams.toString()}`);
  };

  const handleCategoryChange = (category) => {
    setActiveTab(category);
  };

  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });

  return (
    <div className="relative z-10  max-md:pt-10 px-8 max-md:px-0 mx-auto">
      <h2 className="text-4xl font-bold text-white mb-8 mt-5">
        Explore everywhere in {currentMonthName}
      </h2>

      <div className="relative mb-6"> 
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleScroll(-200)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-yellow-400 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="overflow-hidden"> 
            <div 
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm md:text-base font-medium ${
                    activeTab === category
                      ? "bg-yellow-400 text-zinc-950 shadow-lg transform scale-105"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => handleScroll(200)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 hover:text-yellow-400 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-zinc-400 text-sm">
          Showing <span className="text-yellow-400 font-semibold">{currentDeals.length}</span> destinations for{' '}
          <span className="text-white font-semibold">{activeTab}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {currentDeals.map((deal, index) => (
          <div 
            key={deal.id}
            className="animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <DealsCards 
              imageUrl={deal.img}
              destination={deal.dest}
              description={deal.desc}
              price={deal.price}
              onClick={() => handleDealClick(deal)}
            />
          </div>
        ))}
      </div>

      {currentDeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">
            No deals available for this category yet. Check back soon!
          </p>
        </div>
      )}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default DealsSection;