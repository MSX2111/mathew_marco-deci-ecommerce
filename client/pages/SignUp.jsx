import { useState } from "react";
import api from "../axios/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const user = { name, email, password };
      const response = await api.post("/users/signup", user);
      console.log(response);
      console.log(user);
      setLoading(false);
      localStorage.setItem("Token", "mock_token");
      localStorage.setItem("uid", response.data.id);
      localStorage.setItem("isAdmin", response.data.isAdmin);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }
  return (
    <div className="page-shell auth-page">
      <div className="form-card">
        <h1 className="page-heading">Create your account</h1>
        <form onSubmit={handleSignUp} className="auth-form">
          <label>
            Name
            <input type="text" id="name" placeholder="Name" required />
          </label>
          <label>
            Email
            <input type="email" id="email" placeholder="Email" required />
          </label>
          <label>
            Password
            <input
              type="password"
              id="password"
              placeholder="Password"
              required
            />
          </label>
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? "One moment..." : "Sign up"}
          </button>
        </form>
        <p className="auth-switch">
          Already a member? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
