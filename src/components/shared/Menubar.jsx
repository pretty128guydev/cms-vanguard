import React from "react";
import AdminClaimLinks from "./AdminClaimLinks";

const Menubar = ({children}) => {
  return (
    <div className="min-h-screen hidden sm:block px-3 pb-4 overflow-y-auto min-w-[300px]  bg-white border-r border-r-neutral-200">
      {children}
    </div>
  );
};

export default Menubar;
