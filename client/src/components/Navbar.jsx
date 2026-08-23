import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "../assets/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate("/shop")}>
          GameStore
        </div>

        <div className="navbar-links">
          <button
            className={
              location.pathname === "/shop" ? "nav-link active" : "nav-link"
            }
            onClick={() => navigate("/shop")}
          >
            Shop
          </button>

          <button
            className={
              location.pathname === "/cart" ? "nav-link active" : "nav-link"
            }
            onClick={() => navigate("/cart")}
          >
            Cart
          </button>

          <button
            className={
              location.pathname === "/dashboard"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          {user?.is_admin && (
            <button
              className={
                location.pathname === "/admin" ? "nav-link active" : "nav-link"
              }
              onClick={() => navigate("/admin")}
            >
              Admin
            </button>
          )}
        </div>

        <div className="navbar-user">
          <span>{user?.name || user?.email || "User"}</span>

          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default Navbar;
