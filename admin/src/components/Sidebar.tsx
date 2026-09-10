import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Tag,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/vendors", icon: Store, label: "Vendors" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/coupons", icon: Tag, label: "Coupons" },
];

export default function Sidebar() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6 text-primary-400" />
            Android Market
          </h1>
          <p className="text-gray-400 text-xs mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
