import { useState, useEffect } from "react";
import { Page, Card, Button, TextField, Banner, Modal, FormLayout } from "@shopify/polaris";
import { useAuth } from "../components/AuthContext";
import { Axios } from "../api/api";

const CustomerDashboard = () => {
  const { logout } = useAuth();
  const storedEmail = localStorage.getItem("userEmail");
  const [user, setUser] = useState({ username: "", gender: "", email: storedEmail, city: "", phone: "" });
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const [updateModalActive, setUpdateModalActive] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchComplaints();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await Axios.get(`/users/profile/${storedEmail}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const response = await Axios.post("/complaints/user", { email: storedEmail });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  // Create a new complaint
  const createTicket = async () => {
    if (!newTicket.subject || !newTicket.description) return;

    try {
      const response = await Axios.post("/complaints", {
        username: user.username,
        email: storedEmail,
        subject: newTicket.subject,
        description: newTicket.description,
      });

      setTickets([response.data, ...tickets]);
      setNewTicket({ subject: "", description: "" });
      setModalActive(false);
    } catch (error) {
      console.error("Error creating complaint:", error);
    }
  };

  // Open Update Modal with Selected Complaint Data
  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateModalActive(true);
  };

  // Update a complaint
  const updateTicket = async () => {
    if (!selectedTicket || !selectedTicket.subject || !selectedTicket.description) return;

    try {
      const response = await Axios.put(`/complaints/${selectedTicket._id}`, {
        email: storedEmail,
        subject: selectedTicket.subject,
        description: selectedTicket.description,
      });

      setTickets((prevTickets) =>
        prevTickets.map((ticket) => (ticket._id === selectedTicket._id ? response.data : ticket))
      );
      setUpdateModalActive(false);
    } catch (error) {
      console.error("Error updating complaint:", error);
    }
  };

  // Delete a complaint
  const deleteTicket = async (ticketId) => {
    try {
      await Axios.delete(`/complaints/${ticketId}`, { data: { email: storedEmail } });
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  // Filter tickets based on search and date
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = !dateFilter || new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesDate;
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5", width: "100vw" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          background: "#1f2d3d",
          padding: "20px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          boxShadow: "3px 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", marginBottom: "15px" }}>
          Customer Dashboard
        </div>

        {/* Profile */}
        <div
          style={{
            background: "#2d3e50",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{user.username || "John Doe"}</h2>
          <p style={{ fontSize: "14px", color: "#dcdcdc", marginBottom: "10px" }}>
            {user.gender || "Male"} | {user.city || "Not Provided"}
          </p>
          <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
            {user.phone ? `📞 ${user.phone}` : "📞 Not Provided"}
          </p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>{user.email}</p>
        </div>

        <Button destructive fullWidth onClick={() => logout()}>
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "50px", overflowY: "auto", maxWidth: "calc(100% - 280px)", width: "100%" }}>
        <Page title="My Complaints" primaryAction={<Button primary onClick={() => setModalActive(true)}>New Complaint</Button>}>
          <div style={{ marginBottom: "30px", display: "flex", gap: "15px", justifyContent: "center" }}>
            <TextField placeholder="Search complaints..." value={searchQuery} onChange={setSearchQuery} autoComplete="off" clearButton onClearButtonClick={() => setSearchQuery("")} />
            <TextField label="Filter by Date" type="date" value={dateFilter} onChange={setDateFilter} />
          </div>

          {filteredTickets.length === 0 ? (
            <Banner status="info">No complaints found. Try a different search.</Banner>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
              {filteredTickets.map((ticket) => (
                <Card key={ticket._id} title={ticket.subject} sectioned>
                  <p>{ticket.description}</p>
                  <p><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <Button primary onClick={() => openUpdateModal(ticket)}>Update</Button>
                    <Button destructive onClick={() => deleteTicket(ticket._id)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Page>
      </div>

      {/* Create Complaint Modal */}
    <Modal
      open={modalActive}
      onClose={() => setModalActive(false)}
      title="New Complaint"
      primaryAction={{
        content: "Create Complaint",
        onAction: createTicket,
      }}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Subject"
            value={newTicket.subject}
            onChange={(value) => setNewTicket({ ...newTicket, subject: value })}
            autoComplete="off"
          />
          <TextField
            label="Description"
            value={newTicket.description}
            onChange={(value) => setNewTicket({ ...newTicket, description: value })}
            multiline
            autoComplete="off"
          />
        </FormLayout>
      </Modal.Section>
    </Modal>

      {/* Update Complaint Modal */}
      <Modal open={updateModalActive} onClose={() => setUpdateModalActive(false)} title="Update Complaint" primaryAction={{ content: "Save Changes", onAction: updateTicket }}>
        <Modal.Section>
          <FormLayout>
            <TextField label="Subject" value={selectedTicket?.subject || ""} onChange={(value) => setSelectedTicket({ ...selectedTicket, subject: value })} />
            <TextField label="Description" value={selectedTicket?.description || ""} onChange={(value) => setSelectedTicket({ ...selectedTicket, description: value })} multiline />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
