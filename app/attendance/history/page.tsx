"use client";
import { useState, useEffect } from "react";
import { Shield, History, CheckCircle2, XCircle, CalendarDays } from "lucide-react";

export default function AttendanceHistoryPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [days, setDays] = useState<any[]>([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function loadEmployees() {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
      if (data.length > 0) {
        setSelectedEmployee(data[0].id);
      }
    }
    loadEmployees();
  }, []);

  useEffect(function () {
    if (!selectedEmployee || !selectedMonth) return;
    loadHistory();
  }, [selectedEmployee, selectedMonth]);

  async function loadHistory() {
    setLoading(true);
    const res = await fetch("/api/attendance/history?employeeId=" + selectedEmployee + "&month=" + selectedMonth);
    const data = await res.json();
    setDays(data.days || []);
    setPresentCount(data.presentCount || 0);
    setAbsentCount(data.absentCount || 0);
    setLoading(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  }

  function formatTime(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }

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
        <div className="max-w-4xl mx-auto">
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
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Attendance History</h1>
                <p className="text-blue-100 text-sm mt-0.5">View monthly attendance records</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
            <select
              value={selectedEmployee}
              onChange={function (e) { setSelectedEmployee(e.target.value); }}
              className="border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {employees.map(function (emp) {
                return <option key={emp.id} value={emp.id}>{emp.name}</option>;
              })}
            </select>

            <input
              type="month"
              value={selectedMonth}
              onChange={function (e) { setSelectedMonth(e.target.value); }}
              className="border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{presentCount}</p>
                <p className="text-sm text-slate-500">Days Present</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{absentCount}</p>
                <p className="text-sm text-slate-500">Days Absent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <h2 className="font-bold text-slate-900">Daily Breakdown</h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading...</div>
            ) : days.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No data for this month.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Check In</th>
                    <th className="px-6 py-3 text-left font-semibold">Check Out</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {days.map(function (day) {
                    return (
                      <tr key={day.date} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{formatDate(day.date)}</td>
                        <td className="px-6 py-4 text-slate-600">{formatTime(day.checkIn)}</td>
                        <td className="px-6 py-4 text-slate-600">{formatTime(day.checkOut)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              "px-2.5 py-1 rounded-full text-xs font-medium " +
                              (day.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700")
                            }
                          >
                            {day.status}
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