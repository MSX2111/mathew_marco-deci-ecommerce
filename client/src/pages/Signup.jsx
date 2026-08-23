import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../assets/Auth.css";

function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/user/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Account created successfully!");

      navigate("/shop");
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h1>Create Account</h1>

        <p className="auth-subtitle">Join us and start shopping</p>

        <div className="input-group">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>

        <button className="auth-button" type="submit">
          Sign Up
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;
