import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Vendors from "./pages/Vendors";
import Users from "./pages/Users";
import Coupons from "./pages/Coupons";

export default function App() {
  return (
    <Routes>
      <Route element={<Sidebar />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/users" element={<Users />} />
        <Route path="/coupons" element={<Coupons />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
