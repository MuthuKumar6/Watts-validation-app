import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import AssetListPage from "./components/AssetListPage";

export default function App() {
  const [user, setUser] = useState(null);

  // Restore login state on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("panchayatUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    const userToSave = {
      username: userData.username,
      token: userData.token || `demo-token-${Date.now()}`,
    };
    setUser(userToSave);
    localStorage.setItem("panchayatUser", JSON.stringify(userToSave));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("panchayatUser");
  };

  return user ? (
    <AssetListPage user={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} />
  );
}