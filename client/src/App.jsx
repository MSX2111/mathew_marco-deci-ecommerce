import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Navbar />}>
              <Route path="/shop" element={<Shop />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
