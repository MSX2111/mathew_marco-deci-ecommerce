import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <nav>
        <Link to="/dashboard">Home</Link>
        <Link to="/store">Store</Link>
        <Link to="/cart">Your cart</Link>
      </nav>
    </>
  );
};

export default NavBar;
