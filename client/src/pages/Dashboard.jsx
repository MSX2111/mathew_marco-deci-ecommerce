import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../assets/Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        const userData = response.data.user;

        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
      } catch (error) {
        console.error(
          "Error loading profile:",
          error.response?.data || error.message,
        );

        toast.error(error.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await api.put("/user/profile", {
        name,
        email,
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message,
      );

      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h1>Unable to load profile</h1>
          <p>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <p className="dashboard-eyebrow">YOUR ACCOUNT</p>

        <h1>Dashboard</h1>

        <p>Manage your account information and profile.</p>
      </div>

      <div className="dashboard-grid">
        <section className="profile-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <span
              className={
                user.is_admin ? "account-badge admin" : "account-badge"
              }
            >
              {user.is_admin ? "Administrator" : "Customer"}
            </span>
          </div>
        </section>

        <section className="settings-card">
          <div className="card-header">
            <div>
              <p className="dashboard-eyebrow">ACCOUNT SETTINGS</p>

              <h2>Edit Profile</h2>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
            </div>

            <button
              className="save-profile-button"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="account-info-card">
          <h2>Account Information</h2>

          <div className="info-row">
            <span>Account Type</span>

            <strong>{user.is_admin ? "Administrator" : "Customer"}</strong>
          </div>

          <div className="info-row">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div className="info-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
