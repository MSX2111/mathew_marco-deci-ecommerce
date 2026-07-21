import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/store">Store</Link>
        <Link to="/cart">Your cart</Link>
        {isAdmin ? <Link to="/admin">Admin panel</Link> : null}
      </nav>
    </>
  );
};

export default NavBar;
