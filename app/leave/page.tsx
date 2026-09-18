"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Shield } from "lucide-react";

export default function LeavePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);

    if (data.length > 0 && !selectedEmployee) {
      setSelectedEmployee(data[0].id);
    }
  }

  async function loadMyLeaves(employeeId: string) {
    setLoading(true);
    const res = await fetch(`/api/leave?employeeId=${employeeId}`);
    const data = await res.json();
    setMyLeaves(data);
    setLoading(false);
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadMyLeaves(selectedEmployee);
    }
  }, [selectedEmployee]);

  async function handleSubmit() {
    setError("");
    setMessage("");

    if (!fromDate || !toDate || !reason) {
      setError("Please fill all fields");
      return;
    }

    const res = await fetch("/api/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: selectedEmployee,
        fromDate,
        toDate,
        reason,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setMessage("Leave request submitted successfully!");
    setFromDate("");
    setToDate("");
    setReason("");
    loadMyLeaves(selectedEmployee);
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
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Leave Management</h1>
                <p className="text-blue-100 text-sm mt-0.5">
                  Apply for paid or personal leave
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4">Submit Leave Request</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <div className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                  {employees.length > 0 ? `${employees.length} employees available` : "No employees loaded"}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Reason for leave..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Submit Request
            </button>

            {message && (
              <p className="mt-3 text-sm text-green-600 font-medium">{message}</p>
            )}
            {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-slate-400" />
              <h2 className="font-bold text-slate-900">Your Leave Requests</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading...</div>
            ) : myLeaves.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No leave requests found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myLeaves.map((leave) => (
                  <div key={leave.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{leave.reason}</p>
                      <p className="text-sm text-slate-500">
                        {leave.fromDate} to {leave.toDate}
                      </p>
                    </div>
                    <div>{statusBadge(leave.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
