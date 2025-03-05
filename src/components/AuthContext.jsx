import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
  
    console.log("AuthContext - Checking Storage:", { storedEmail, storedRole });
  
    if (storedEmail && storedRole) {
      setUser({ email: storedEmail, role: storedRole });
    } else {
      setUser(false);  // 🔹 Ensures `user` is not `null`
    }
  }, []);
  

  const login = (credentials) => {
    const assignedRole = credentials.email.trim().toLowerCase() === "admin@admin.com" ? "admin" : credentials.role;

    localStorage.setItem("userEmail", credentials.email);
    localStorage.setItem("userRole", assignedRole);
    
    setUser({ email: credentials.email, role: assignedRole });

    console.log("AuthContext - User Logged In:", { email: credentials.email, role: assignedRole });

    setTimeout(() => {
      window.location.href = assignedRole === "admin" ? "/admin" : "/customer";  // 🔹 Forces full-page reload
    }, 100);
  };

  const logout = () => {
    console.log("AuthContext - Logging out");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setUser(null);
    window.location.href = "/";  // 🔹 Ensures redirection on logout
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
