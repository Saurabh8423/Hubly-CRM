import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadStats();
    loadTickets();
    loadUsers();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats load error");
    }
  };

  const loadTickets = async () => {
    try {
      const res = await axios.get("/api/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Ticket load error");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Users load error");
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        tickets,
        users,
        stats,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
