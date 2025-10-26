import React from 'react'

function FlightTypeSelector({ selected, onChange }) {
  const types = ["One Way", "Round Trip", "Multi-City"]

  return (
    <div className="flex justify-center gap-3 mb-6">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
            ${selected === type
              ? "bg-yellow-500 text-gray-900 shadow-md"
              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
        >
          {type}
        </button>
      ))}
    </div>
  )
}

export default FlightTypeSelector
