import React from 'react'

function FlightTypeSelector({ selected, onChange }) {
  const types = ["One Way", "Round Trip", "Multi-City"]

  return (
    <div className="flex justify-center gap-3 mb-6">
      {types.map((type) => (
        <button
          key={type}
          type="button" // Prevents the button from submitting the form
          onClick={() => onChange(type)}
          
          
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
            ${selected === type
              // ACTIVE STATE: (White background, Yellow text, Bold)
              ? "bg-white text-yellow-400 font-bold shadow-lg"
              
              // INACTIVE STATE: (Dark background, Gray text, with hover)
              : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100"
            }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}

export default FlightTypeSelector