const Loading = ({ icon: Icon, message = 'Loading...', size = 40 }) => {
  return (
    <div className="p-6 flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <Icon className="animate-bounce text-amber-400 mx-auto mb-4" size={size} />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default Loading;