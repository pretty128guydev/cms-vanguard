"use client";
const { createContext, useContext, useState } = require("react");

const ToggleContext = createContext({
  isSideBarOpen: false,
  ToggleSidebar: () => {},
});

export const useToggleContext = () => {
  return useContext(ToggleContext);
};

const ToggleProvider = ({ children }) => {
    const [sidebar,setSideBar] = useState(false);
    const ctxValue = {
        isSideBarOpen : sidebar,
        ToggleSidebar : () => {
            setSideBar((p)=>!p);
        }
    };
    return (
        <ToggleContext.Provider value={ctxValue}>
        {children}
        </ToggleContext.Provider>
    );
};

export default ToggleProvider;
