import React, { useState } from "react";
import { AppContext } from "./AppContext";

export const AppContextProvider = ({ children }) => {
  const [currentContext, setCurrentContext] = useState([]);
  const [theme,setTheme]= useState('light');

  return (
    <AppContext.Provider value={{ currentContext, setCurrentContext ,theme,setTheme}}>
      {children}
    </AppContext.Provider>
  );
};
