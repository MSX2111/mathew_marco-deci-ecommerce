import { Navigate } from "react-router-dom";

function AdminRoutes({ children }) {
  
  const isAdmin = localStorage.getItem("isAdmin");

  
  
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  
  return children;
}

export default AdminRoutes;
