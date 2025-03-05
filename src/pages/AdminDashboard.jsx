import { useState, useEffect } from "react";
import { Page, Card, TextField, Banner, Modal, FormLayout, Button } from "@shopify/polaris";
import { useAuth } from "../components/AuthContext";
import { Axios } from "../api/api";

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState({ username: "", email: "", role: "" });
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchComplaints();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await Axios.get(`/users/profile/${user.email}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await Axios.get(`/complaints/admin/all?email=${user.email}`);  // ✅ Send email as query param
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };
  

  const addReply = async (ticketId) => {
    if (!replyContent.trim()) return;
    try {
      await Axios.patch(`/complaints/reply/${ticketId}`, { email: user.email, reply: replyContent });
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, reply: replyContent } : ticket
        )
      );
      setReplyContent("");
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    (ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
     ticket.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!dateFilter || new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter)
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5", width: "100vw" }}>
      <div style={{ width: "280px", background: "#2c3e50", padding: "20px", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", boxShadow: "3px 0 10px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", marginBottom: "15px" }}>Admin Dashboard</div>
        <div style={{ background: "#34495e", padding: "20px", borderRadius: "10px", textAlign: "center", boxShadow: "0px 4px 8px rgba(0,0,0,0.2)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{profile.username}</h2>
          <p style={{ fontSize: "14px", color: "#dcdcdc", marginBottom: "10px" }}>{profile.role}</p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>{profile.email}</p>
        </div>
        <Button destructive fullWidth onClick={() => logout()}>Logout</Button>
      </div>
      <div style={{ flex: 1, padding: "50px", overflowY: "auto", maxWidth: "calc(100% - 280px)", width: "100%" }}>
        <Page title="Manage All Users Complaints">
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <TextField placeholder="Search tickets..." value={searchQuery} onChange={setSearchQuery} clearButton onClearButtonClick={() => setSearchQuery("")} />
            <TextField label="Filter by Date" type="date" value={dateFilter} onChange={setDateFilter} />
          </div>
          {filteredTickets.length === 0 ? (
            <Banner status="info">No complaints found.</Banner>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
              {filteredTickets.map(ticket => (
                <Card key={ticket._id} title={ticket.subject} sectioned>
                  <p style={{ fontSize: "16px", marginBottom: "10px" }}>{ticket.description}</p>
                  <p><strong>Customer:</strong> {ticket.username}</p>
                  <p><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  {ticket.reply && (
                    <div style={{ marginTop: "15px", backgroundColor: "#eef2f7", padding: "10px", borderRadius: "5px" }}>
                      <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Admin Reply:</p>
                      <p>{ticket.reply}</p>
                    </div>
                  )}
                  <Button onClick={() => setSelectedTicket(ticket)} style={{ marginTop: "10px" }}>Reply</Button>
                </Card>
              ))}
            </div>
          )}
        </Page>
      </div>
      {selectedTicket && (
        <Modal open={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Reply to: ${selectedTicket.subject}`} primaryAction={{ content: "Send Reply", onAction: () => addReply(selectedTicket._id), disabled: !replyContent.trim() }}>
          <Modal.Section>
            <FormLayout>
              <TextField label="Your Reply" value={replyContent} onChange={setReplyContent} multiline />
            </FormLayout>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
