"use client";

import React, { useState, useEffect } from "react";
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
  ShieldAlert,
  Loader2
} from "lucide-react";

interface ActivityItem {
  id: string | number;
  user: string;
  avatar: string;
  action: string;
  time: string;
  date: string;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic States
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Time Formatter for Audit Logs
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently";
    const logDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - logDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch Database Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Employees Count
      const empRes = await fetch("/api/employees");
      if (empRes.ok) {
        const empData = await empRes.json();
        if (Array.isArray(empData)) {
          setTotalEmployees(empData.length);
        }
      }

      // 2. Fetch Tasks Data
      const taskRes = await fetch("/api/tasks");
      if (taskRes.ok) {
        const taskData = await taskRes.json();
        if (Array.isArray(taskData)) {
          const active = taskData.filter((t: any) => t.status === "In Progress" || t.status === "Pending").length;
          const pending = taskData.filter((t: any) => t.status === "Pending").length;
          setActiveTasks(active);
          setPendingTasks(pending);
        }
      }

      // 3. Fetch Real-time Audit Logs / Activities
      const logRes = await fetch("/api/audit-logs");
      if (logRes.ok) {
        const logData = await logRes.json();
        if (Array.isArray(logData)) {
          const mappedLogs: ActivityItem[] = logData.map((log: any, idx: number) => {
            const userName = log.user?.name || log.userName || log.user || "System User";
            return {
              id: log.id || idx,
              user: userName,
              avatar: userName.charAt(0).toUpperCase(),
              action: log.action || log.description || "performed an action",
              time: formatTimeAgo(log.createdAt || log.timestamp),
              date: formatDate(log.createdAt || log.timestamp),
              color: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400",
            };
          });
          setActivities(mappedLogs);
        }
      }
    } catch (error) {
      console.error("Dashboard data fetching error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      change: "Live DB",
      isPositive: true,
      icon: Users,
      lightBg: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Tasks",
      value: activeTasks.toString(),
      change: "Live DB",
      isPositive: true,
      icon: CheckSquare,
      lightBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks.toString(),
      change: "Live DB",
      isPositive: false,
      icon: Clock,
      lightBg: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div
      className="relative p-8 space-y-8 min-h-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="absolute inset-0 bg-slate-50/85 dark:bg-slate-950/90 backdrop-blur-[2px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium">
            Welcome back! Here is what is happening across your staff portal today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-3 rounded-xl ${stat.lightBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin text-slate-400" /> : stat.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                    stat.isPositive
                      ? "bg-emerald-100/80 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                      : "bg-rose-100/80 dark:bg-rose-950 text-rose-700 dark:text-rose-400"
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

      {/* Recent Activities Section */}
      <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/60 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 hover:underline transition-all"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="py-6 flex justify-center items-center gap-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Fetching live activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500">
              No recent activity recorded yet.
            </div>
          ) : (
            activities.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center ${item.color}`}
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {item.user}{" "}
                      <span className="font-normal text-slate-600 dark:text-slate-300">
                        {item.action}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* All Activity Logs Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Activity Logs</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {activities.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-4">No activities found.</div>
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="py-4 flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      {item.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {item.user}{" "}
                        <span className="font-normal text-slate-600 dark:text-slate-300">
                          {item.action}
                        </span>
                      </p>
                      <div className="flex items-center justify-between mt-1 text-xs text-slate-400 dark:text-slate-500">
                        <span>{item.date}</span>
                        <span className="font-medium text-slate-500 dark:text-slate-400">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
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