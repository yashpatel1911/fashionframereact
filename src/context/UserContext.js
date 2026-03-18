import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../api/apiConfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.data) {
          setUser(data.data);
          localStorage.setItem("pu_name", data.data.pu_name);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart");
    localStorage.removeItem("pu_name");
    window.dispatchEvent(new Event("cartUpdated")); // notify cart update
    setUser(null); // reset user
    navigate("/"); // go to home
    window.location.reload(); // full reload (if you really want it)
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
