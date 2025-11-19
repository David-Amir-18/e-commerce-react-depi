import React from 'react'

const DealsCards = ({ imageUrl, destination, description, price, onClick }) => {
  return  (
    <div onClick={onClick} className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer border border-zinc-800/50">
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={destination} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/1a1a1a/FFF?text=Elysium'; }} // Fallback
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
}

export default DealsCards