import { Navigate } from "react-router-dom";

function AdminRoutes({ children }) {
  // 1. Look for the mock token in the browser
  const isAdmin = localStorage.getItem("isAdmin");

  // 2. If the token is missing, redirect them to the login page
  // 'replace' prevents them from clicking 'back' to get to the private page
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // 3. If the token is there, render the sub-pages
  return children;
}

export default AdminRoutes;
