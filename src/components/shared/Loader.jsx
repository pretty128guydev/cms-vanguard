import React from "react";

const LoadingScreen = ({showLabel=false, label}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col gap-3 items-center justify-center bg-gray-100 z-50">
      <div className="loader"></div>
      {showLabel&&<div className="text-lg font-semibold">{label}</div>}
    </div>
  );
};

export default LoadingScreen;
