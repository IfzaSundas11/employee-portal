import React from "react";
import { Search } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="w-1.5 h-8 bg-blue-500 absolute left-0 top-6 rounded-r-md"></div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Total Employees</p>
            <p className="text-3xl font-extrabold text-slate-800">128</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="w-1.5 h-8 bg-amber-500 absolute left-0 top-6 rounded-r-md"></div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Active Tasks</p>
            <p className="text-3xl font-extrabold text-slate-800">32</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="w-1.5 h-8 bg-rose-500 absolute left-0 top-6 rounded-r-md"></div>
            <p className="text-xs font-semibold text-slate-500 mb-2">Pending Tasks</p>
            <p className="text-3xl font-extrabold text-slate-800">12</p>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-6">Recent Activities</h2>

        <div className="space-y-6">
          {/* Activity 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center text-xs">
                N
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Nadia <span className="font-normal text-slate-500">uploaded employees.xlsx</span>
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">2 min ago</span>
          </div>

          {/* Activity 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-purple-100 text-purple-700 font-bold rounded-full flex items-center justify-center text-xs">
                A
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Ayesha <span className="font-normal text-slate-500">updated task status</span>
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">15 min ago</span>
          </div>

          {/* Activity 3 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center text-xs">
                AD
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Admin <span className="font-normal text-slate-500">logged in</span>
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">30 min ago</span>
          </div>
        </div>
      </div>

    </div>
  );
}