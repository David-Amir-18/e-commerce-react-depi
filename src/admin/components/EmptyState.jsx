import React from 'react';

const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center border border-white/10">
      {Icon && <Icon className="text-gray-400 mx-auto mb-4" size={48} />}
      <h3 className="text-base sm:text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-400">{message}</p>
    </div>
  );
};
export default EmptyState;
