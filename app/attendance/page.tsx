"use client";
import { useState, useEffect } from "react";
import { Shield, Clock, CheckCircle2, XCircle, LogIn, LogOut } from "lucide-react";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const now = new Date();
  const today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");

  async function loadData() {
    setLoading(true);
    const empRes = await fetch("/api/employees");
    const empData = await empRes.json();
    setEmployees(empData);
    if (empData.length > 0 && !selectedEmployee) {
      setSelectedEmployee(empData[0].id);
    }

    const attRes = await fetch("/api/attendance?date=" + today);
    const attData = await attRes.json();
    setRecords(attData);
    setLoading(false);
  }

  useEffect(function () {
    loadData();
  }, []);

  async function handleAction(action: string) {
    setError("");
    setMessage("");

    if (!selectedEmployee) {
      setError("Please select an employee");
      return;
    }

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: selectedEmployee, action: action }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setMessage(action === "check-in" ? "Checked in successfully!" : "Checked out successfully!");
    loadData();
  }

  function formatTime(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }

  const presentCount = records.length;
  const totalCount = employees.length;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')",
        }}
      ></div>
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50/90 via-slate-100/85 to-slate-100/90"></div>

      <div className="relative text-slate-900 p-6 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">StaffPortal</span>
            <span className="text-xs text-slate-600 font-medium border-l border-slate-300 pl-2 ml-1">Enterprise Portal V2.0</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-7 mb-6 shadow-lg shadow-blue-900/10">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Attendance</h1>
                <p className="text-blue-100 text-sm mt-0.5">Track daily check-in and check-out</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{presentCount}</p>
                <p className="text-sm text-slate-500">Checked In Today</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalCount - presentCount}</p>
                <p className="text-sm text-slate-500">Not Checked In</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-4">Mark Attendance</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={selectedEmployee}
                onChange={function (e) { setSelectedEmployee(e.target.value); }}
                className="border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employees.map(function (emp) {
                  return <option key={emp.id} value={emp.id}>{emp.name}</option>;
                })}
              </select>

              <button
                onClick={function () { handleAction("check-in"); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Check In
              </button>

              <button
                onClick={function () { handleAction("check-out"); }}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Check Out
              </button>
            </div>

            {message && (
              <p className="text-blue-700 bg-blue-50 rounded-lg p-3 mt-4 text-sm">{message}</p>
            )}
            {error && (
              <p className="text-red-600 bg-red-50 rounded-lg p-3 mt-4 text-sm">{error}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Today's Attendance</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading...</div>
            ) : records.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No one has checked in today.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Employee</th>
                    <th className="px-6 py-3 text-left font-semibold">Check In</th>
                    <th className="px-6 py-3 text-left font-semibold">Check Out</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map(function (rec) {
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{rec.employee.name}</td>
                        <td className="px-6 py-4 text-slate-600">{formatTime(rec.checkIn)}</td>
                        <td className="px-6 py-4 text-slate-600">{formatTime(rec.checkOut)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}