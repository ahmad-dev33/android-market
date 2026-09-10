import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../services/api";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  date_joined: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/auth/profile/")
      .then((res) => {
        if (res.data) {
          setUsers([res.data]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage platform users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>
              Connect your Django admin at <code>/admin/</code> for full user
              management, or extend this dashboard with a users API endpoint.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
