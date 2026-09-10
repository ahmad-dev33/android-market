import { useEffect, useState } from "react";
import { Store, CheckCircle } from "lucide-react";
import api from "../services/api";

interface Vendor {
  id: number;
  store_name: string;
  rating_avg: string;
  total_sales: number;
  total_products: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/vendor/", { params: { page_size: 50 } })
      .then((res) => setVendors(res.data.results || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <p className="text-gray-500 text-sm mt-1">Manage marketplace vendors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-500 col-span-full text-center py-8">
            Loading...
          </p>
        ) : vendors.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">
            No vendors found
          </p>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-gray-900">
                      {vendor.store_name}
                    </h3>
                    {vendor.is_verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Joined {new Date(vendor.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {vendor.total_products}
                  </p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {vendor.total_sales}
                  </p>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {parseFloat(vendor.rating_avg).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vendor.is_active ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-1">
                  <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
                    View
                  </button>
                  <button className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 rounded-lg text-red-600">
                    Disable
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
