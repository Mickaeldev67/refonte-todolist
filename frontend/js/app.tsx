import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Container, Button } from "react-bootstrap";
import { getMe, logout } from "./api/authApi";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuthenticated(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <Container className="mt-3">
      <Button onClick={handleLogout} className="mb-3">
        Logout
      </Button>
      <DashboardPage />
    </Container>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);