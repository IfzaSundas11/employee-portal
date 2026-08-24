"use client";

import { useState, useEffect } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Token {
  id: string;
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  status: string;
  user: { email: string };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const fetchTokens = async () => {
    const res = await fetch("/api/tokens");
    const data = await res.json();
    setTokens(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchTokens();
  }, []);

  const handleAddUser = async () => {
    setError("");
    if (!newUser.email || !newUser.password) {
      setError("Email and password are required!");
      return;
    }
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      setShowModal(false);
      setNewUser({ email: "", password: "", role: "EMPLOYEE" });
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div className="p-6 space-y-8">

      {/* Users Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <UserPlus size={16} />
            Add User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Name</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Email</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Role</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800 font-medium">
                    {user.email.split("@")[0]}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Tokens Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Refresh Tokens</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Token ID</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">User</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Created At</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Expires At</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No tokens found — login to generate tokens
                  </td>
                </tr>
              ) : tokens.map((token) => (
                <tr key={token.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                    {token.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-slate-800">{token.user.email}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(token.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(token.expiresAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {token.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Add New User</h2>
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="user@company.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}