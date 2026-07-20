import api from "../axios/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavBar from "../components/NavBar";

function LogIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function handleLogIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const user = { email, password };
      const response = await api.post("/users/login", user);
      console.log("Logged in successfully");
      console.log(response.data);
      localStorage.setItem("Token", "mock_token");
      localStorage.setItem("uid", response.data.id);
      localStorage.setItem("isAdmin", response.data.isAdmin);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
      console.log("no such user exists");
      setLoading(false);
    }
  }
  return (
    <>
      <form onSubmit={handleLogIn}>
        <input type="email" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />

        <button type="submit" disabled={loading}>
          {loading ? "One moment..." : "Log in"}
        </button>
      </form>
      <p>
        New member? <Link to="/signup">Sign up now</Link>
      </p>
    </>
  );
}

export default LogIn;
