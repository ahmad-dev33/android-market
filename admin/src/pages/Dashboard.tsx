import { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
} from "lucide-react";
import api from "../services/api";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  change,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  change?: string;
}) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/auth/profile/").catch(() => ({ data: null })),
      api.get("/products/?page_size=1").catch(() => ({ data: { count: 0 } })),
      api.get("/orders/?page_size=1").catch(() => ({ data: { count: 0 } })),
    ])
      .then(([, products, orders]) => {
        setStats({
          totalUsers: 0,
          totalProducts: products.data.count || 0,
          totalOrders: orders.data.count || 0,
          totalRevenue: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      change: "+12.5% this month",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
      change: "+8.2% this month",
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Loading overview..." : "Overview of your marketplace"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {["ORD-ABC123", "ORD-DEF456", "ORD-GHI789", "ORD-JKL012"].map(
              (order) => (
                <div
                  key={order}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    Pending
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h2>
          <div className="space-y-3">
            {[
              { name: "Wireless Headphones", sales: 142, revenue: "$4,260" },
              { name: "Phone Case Pro", sales: 98, revenue: "$1,960" },
              { name: "USB-C Hub", sales: 87, revenue: "$2,610" },
              { name: "Screen Protector", sales: 76, revenue: "$760" },
            ].map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {product.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
