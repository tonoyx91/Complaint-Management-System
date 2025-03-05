import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { AppProvider } from "@shopify/polaris";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "@shopify/polaris/build/esm/styles.css";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AppProvider i18n={{ en: { Polaris: { Common: { cancel: "Cancel", save: "Save" } } } }}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </AppProvider>
  );
}

export default App;
