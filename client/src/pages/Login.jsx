import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import "../assets/Auth.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");

      navigate("/shop");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Welcome Back</h1>

        <p className="auth-subtitle">Log in to your account</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button className="auth-button" type="submit">
          Log In
        </button>

        <p className="switch-text">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
