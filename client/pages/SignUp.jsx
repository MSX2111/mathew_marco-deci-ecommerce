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
      localStorage.setItem("email", user.email);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }
  return (
    <>
      <form onSubmit={handleSignUp}>
        <input type="text" id="name" placeholder="Name" />
        <input type="email" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />

        <button disabled={loading} type="submit">
          {loading ? "One moment..." : "Sign up"}
        </button>
      </form>
      <p>
        Already a member? <Link to="/login">Log in</Link>
      </p>
    </>
  );
}

export default SignUp;
