import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // 1. Look for the mock token in the browser
  const token = localStorage.getItem("Token");

  // 2. If the token is missing, redirect them to the login page
  // 'replace' prevents them from clicking 'back' to get to the private page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the token is there, render the sub-pages
  return children;
}

export default ProtectedRoute;
