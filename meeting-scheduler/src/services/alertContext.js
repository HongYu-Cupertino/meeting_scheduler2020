import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
