import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axiosInstance";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function findUser() {
      try {
        const uid = localStorage.getItem("uid");
        const id = { uid };
        const response = await api.post("/users/dashboard", id);
        console.log(response.data.name);
        setUser(response.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    findUser();
  }, [refresh]);

  async function handleUpdate(e) {
    e.preventDefault();
    const uid = localStorage.getItem("uid");
    let name = e.target.name.value;
    let email = e.target.email.value;
    let password = e.target.password.value;
    if (!name) {
      name = user.name;
    }
    if (!email) {
      email = user.email;
    }
    if (!password) {
      password = user.password;
    }
    const newUser = { uid, name, email, password };
    try {
      const response = await api.post("/users/update", newUser);
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  }

  if (!user) {
    return <div>Loading Data...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="page-shell dashboard-page">
        <div className="dashboard-headline">
          <div>
            <h1 className="page-heading">Welcome back, {user.name}</h1>
            <p className="section-subtitle">
              Manage your profile and account settings.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              localStorage.removeItem("Token");
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>

        <div className="form-card">
          <h2 className="section-title">Profile information</h2>
          <form onSubmit={handleUpdate} className="auth-form">
            <label>
              Name
              <input
                type="text"
                id="name"
                name="name"
                placeholder={user.name}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                id="email"
                name="email"
                placeholder={user.email}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Change password"
              />
            </label>
            <button className="btn btn-primary" type="submit">
              Update profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
