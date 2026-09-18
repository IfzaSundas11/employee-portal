"use client";

import { useEffect, useState } from "react";
import { CheckCheck, ClipboardCheck, Shield } from "lucide-react";

export default function ManageLeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaves() {
    setLoading(true);
    const res = await fetch("/api/leave");
    const data = await res.json();
    setLeaves(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  async function handleAction(id: string, status: string) {
    await fetch(`/api/leave/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadLeaves();
  }

  function statusBadge(status: string) {
    if (status === "Approved") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        Pending
      </span>
    );
  }

  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending");

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50/90 via-slate-100/85 to-slate-100/90" />

      <div className="relative text-slate-900 p-6 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">StaffPortal</span>
            <span className="text-xs text-slate-600 font-medium border-l border-slate-300 pl-2 ml-1">
              Enterprise Portal V2.0
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-7 mb-6 shadow-lg shadow-blue-900/10">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Manage Leave Requests</h1>
                <p className="text-blue-100 text-sm mt-0.5">
                  Approve or reject employee leave requests
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <CheckCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pendingLeaves.length}</p>
              <p className="text-sm text-slate-500">Pending Requests</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">All Leave Requests</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading...</div>
            ) : leaves.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No leave requests found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Employee</th>
                    <th className="px-6 py-3 text-left font-semibold">From</th>
                    <th className="px-6 py-3 text-left font-semibold">To</th>
                    <th className="px-6 py-3 text-left font-semibold">Reason</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {leave.employee?.name || leave.employeeId || "Employee"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{leave.fromDate}</td>
                      <td className="px-6 py-4 text-slate-600">{leave.toDate}</td>
                      <td className="px-6 py-4 text-slate-600">{leave.reason}</td>
                      <td className="px-6 py-4">{statusBadge(leave.status)}</td>
                      <td className="px-6 py-4">
                        {leave.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(leave.id, "Approved")}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(leave.id, "Rejected")}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
