//App.js
import React, { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
    {
      id: 1,
      question: "How do I search for flights?",
      answer:
        "Use the search bar at the top of the site: choose origin, destination, dates and passengers, then click Search. You can refine results using filters in the results page.",
    },
    {
      id: 3,
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit/debit cards and some local payment methods depending on your country. All payments are securely processed.",
    },
    {
      id: 4,
      question: "How do I add baggage or select seats?",
      answer:
        "After selecting a flight, you'll see options for baggage, seat selection and extras in the booking flow.",
    },
  ];

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div className='pb-12 max-md:px-0 relative z-10'>
        <div className="container mx-auto px-8 ">
            <h2 className="text-4xl font-bold 
                           mb-9 mt-4 
                           text-white">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border bg-white/10 border-white/30 rounded-lg p-4">
                        <button
                            onClick={() => handleToggle(index)}
                            className="w-full text-start
                                       font-semibold text-amber-300
                                       focus:outline-none
                                       hover:cursor-pointer"
                        >
                            {faq.question}
                        </button>
                        {openIndex === index && (
                            <p className="mt-2 text-white/80">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
};

export default FAQ;