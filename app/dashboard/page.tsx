"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Activity, 
  ArrowUpRight,
  UserCheck,
  FileSpreadsheet,
  X,
  ShieldAlert
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      title: "Total Employees",
      value: "128",
      change: "+12.5%",
      isPositive: true,
      icon: Users,
      lightBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Tasks",
      value: "32",
      change: "+4.2%",
      isPositive: true,
      icon: CheckSquare,
      lightBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Pending Tasks",
      value: "12",
      change: "-2.1%",
      isPositive: false,
      icon: Clock,
      lightBg: "bg-rose-50 text-rose-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Nadia",
      avatar: "N",
      action: "uploaded employees.xlsx",
      time: "2 min ago",
      icon: FileSpreadsheet,
      color: "bg-indigo-100 text-indigo-700",
      date: "Aug 25, 2026 - 02:26 PM"
    },
    {
      id: 2,
      user: "Ayesha",
      avatar: "A",
      action: "updated task status to Completed",
      time: "15 min ago",
      icon: CheckSquare,
      color: "bg-purple-100 text-purple-700",
      date: "Aug 25, 2026 - 02:13 PM"
    },
    {
      id: 3,
      user: "Admin",
      avatar: "AD",
      action: "logged into system",
      time: "30 min ago",
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-700",
      date: "Aug 25, 2026 - 01:58 PM"
    },
    {
      id: 4,
      user: "Ali Khan",
      avatar: "AK",
      action: "created a new task 'Database Migration'",
      time: "1 hour ago",
      icon: CheckSquare,
      color: "bg-blue-100 text-blue-700",
      date: "Aug 25, 2026 - 01:28 PM"
    },
    {
      id: 5,
      user: "System Security",
      avatar: "SS",
      action: "failed login attempt detected from IP 192.168.1.45",
      time: "3 hours ago",
      icon: ShieldAlert,
      color: "bg-rose-100 text-rose-700",
      date: "Aug 25, 2026 - 11:15 AM"
    }
  ];

  return (
    <div className="relative p-8 space-y-8 min-h-full overflow-hidden bg-cover bg-center bg-no-repeat"
         style={{
           backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
         }}
    >
      {/* Light Transparent White Glass Overlay (Opacity low rakhi hai) */}
      <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[2px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Welcome back! Here is what is happening across your staff portal today.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div className={`p-3 rounded-xl ${stat.lightBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                    stat.isPositive
                      ? "bg-emerald-100/80 text-emerald-700"
                      : "bg-rose-100/80 text-rose-700"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 mr-1 inline" />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline transition-all"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentActivities.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center ${item.color}`}>
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.user}{" "}
                    <span className="font-normal text-slate-600">
                      {item.action}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Modal Popup Panel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">All Activity Logs</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content List */}
            <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {recentActivities.map((item) => (
                <div key={item.id} className="py-4 flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${item.color}`}>
                    {item.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.user}{" "}
                      <span className="font-normal text-slate-600">
                        {item.action}
                      </span>
                    </p>
                    <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                      <span>{item.date}</span>
                      <span className="font-medium text-slate-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}