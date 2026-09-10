import { useEffect, useState } from "react";
import api from "../services/api";

interface Order {
  id: number;
  order_number: string;
  status: string;
  total: string;
  item_count: number;
  created_at: string;
  paid_at: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (statusFilter) params.status = statusFilter;
    api
      .get("/orders/", { params })
      .then((res) => setOrders(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.item_count || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paid_at
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paid_at ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
