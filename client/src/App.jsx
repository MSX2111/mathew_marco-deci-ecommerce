import "./App.css";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";
import LogIn from "../pages/LogIn";
import Store from "../pages/Store";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import Home from "../pages/Home";
import AdminRoutes from "../components/AdminRoutes";
import Admin from "../pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute>
              <Store />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoutes>
              <Admin />
            </AdminRoutes>
          }
        />
        <Route
          path="*"
          element={
            <div className="error-page page-shell">
              <h1>Page not found (404)</h1>
              <p>The route you requested does not exist.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
