import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axiosInstance";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(true);
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

  const navigate = useNavigate();

  if (!user) {
    return <div>Loading Data...</div>;
  }

  return (
    <>
      <NavBar />
      <h1>{user.name}'s dashboard</h1>
      <button
        onClick={() => {
          localStorage.removeItem("Token");
          navigate("/login");
        }}
      >
        Log out
      </button>

      <form onSubmit={handleUpdate}>
        <input type="text" id="name" placeholder={user.name} />
        <input type="email" id="email" placeholder={user.email} />
        <input type="text" id="password" placeholder={user.password} />
        <button type="submit">Update profile</button>
      </form>
    </>
  );
};

export default Dashboard;
