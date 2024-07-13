import React from "react";

const Loading = () => {
  return (
    <div className="space-y-4">
      <div className="animate-pulse">
        <div className="w-full h-8 bg-gray-300 rounded"></div>
      </div>

      <div className="animate-pulse">
        <div className="w-full h-10 bg-gray-300 rounded"></div>
      </div>

      <div className="animate-pulse">
        <div className="w-full h-32 bg-gray-300 rounded"></div>
      </div>

      <div className="animate-pulse">
        <div className="w-1/3 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default Loading;
