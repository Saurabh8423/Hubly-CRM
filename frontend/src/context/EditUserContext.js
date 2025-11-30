// src/context/EditUserContext.js
import { createContext, useState } from "react";

export const EditUserContext = createContext();

export const EditUserProvider = ({ children }) => {
  const [editUser, setEditUser] = useState(null);
  return (
    <EditUserContext.Provider value={{ editUser, setEditUser }}>
      {children}
    </EditUserContext.Provider>
  );
};
