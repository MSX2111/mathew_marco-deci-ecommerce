import { NavLink } from "react-router-dom";

const NavBar = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <header className="site-header">
      <div className="brand-bar">
        <span className="brand-mark">Mock e-commerce</span>
      </div>
      <nav className="primary-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/store"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Store
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Cart
        </NavLink>
        {isAdmin ? (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Admin
          </NavLink>
        ) : null}
      </nav>
    </header>
  );
};

export default NavBar;
