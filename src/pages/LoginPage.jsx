import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, FormLayout, TextField, Select, Text } from "@shopify/polaris";
import { useAuth } from "../components/AuthContext";
import { Axios } from "../api/api";

const HomePage = () => {
  const { login } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    city: "",
    phone: "",
    gender: "Male",
    email: "",
    password: "",
    role: "customer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (modalType === "register") {
        await Axios.post("/users/register", {
          username: credentials.username,
          city: credentials.city,
          phone: credentials.phone,
          gender: credentials.gender,
          email: credentials.email,
          password: credentials.password,
          role: credentials.role,
        });
        alert("Registration successful! Please login manually.");
        setModalType("login");
        return;
      }

      const response = await Axios.post("/users/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const { role } = response.data.user;
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("userRole", role);
      login({ email: response.data.user.email, role });

      setModalOpen(false);
      setTimeout(() => {
        window.location.href = role === "admin" ? "/admin" : "/customer";
      }, 200);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "60px",
          borderRadius: "15px",
          boxShadow: "0 12px 35px rgba(0,0,0,0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
        }}
      >
        <Text variant="headingXl" style={{ fontWeight: "bold", fontSize: "52px", color: "#f8d210" }}>
          Complaint Management System
        </Text>
        <Text variant="bodyLg" style={{ marginBottom: "25px", fontSize: "22px", color: "#f0f0f0" }}>
          Share your complaints with us, and we will take care of them.
        </Text>
        <div style={{ display: "flex", gap: "35px" }}>
          <Button primary onClick={() => { setModalType("login"); setModalOpen(true); }}>Sign In</Button>
          <Button outline onClick={() => { setModalType("register"); setModalOpen(true); }}>Register</Button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalType === "login" ? "Sign In" : "Register"} sectioned>
        <Modal.Section>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
            <FormLayout>
              {modalType === "register" && (
                <>
                  <TextField label="Username" value={credentials.username} onChange={(value) => setCredentials({ ...credentials, username: value })} required />
                  <TextField label="City" value={credentials.city} onChange={(value) => setCredentials({ ...credentials, city: value })} required />
                  <TextField label="Phone" type="tel" value={credentials.phone} onChange={(value) => setCredentials({ ...credentials, phone: value })} required />
                  <Select label="Gender" options={["Male", "Female", "Other"]} value={credentials.gender} onChange={(value) => setCredentials({ ...credentials, gender: value })} required />
                </>
              )}
              <TextField label="Email" type="email" value={credentials.email} onChange={(value) => setCredentials({ ...credentials, email: value })} required />
              <TextField label="Password" type="password" value={credentials.password} onChange={(value) => setCredentials({ ...credentials, password: value })} required />
              <Select label="Login as" options={[{ label: "Customer", value: "customer" }, { label: "Admin", value: "admin" }]} value={credentials.role} onChange={(value) => setCredentials({ ...credentials, role: value })} required />
              <Button submit primary fullWidth loading={loading}>{modalType === "login" ? "Sign In" : "Register"}</Button>
            </FormLayout>
          </form>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default HomePage;
