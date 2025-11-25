import React, { useState } from 'react';

const DealsCards = ({ imageUrl, destination, description, price, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div onClick={onClick} className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer border">
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={''} 
          className={`w-full h-full ${imageError ? 'object-contain' : 'object-cover'}`}
          onError={(e) => { 
            e.target.src = './../../../public/Elysium Wings.png';
            setImageError(true);
          }}
        />
      </div>
      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">{destination}</h3>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>
          <span className="text-2xl font-bold text-amber-400">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default DealsCards;