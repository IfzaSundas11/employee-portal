"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell, 
  Building2,
  LogOut
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/login/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* DARK SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} bg-[#111625] text-slate-300 flex flex-col justify-between p-4 shadow-xl z-20 transition-all duration-300`}>
        <div>
          {/* Company Brand Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
            <div className="w-9 h-9 bg-purple-600/30 border border-purple-500/30 text-purple-400 rounded-xl flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">Company</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3.5 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl shadow-lg shadow-purple-600/30 transition-all">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/admin/employees" className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all">
              <Users size={18} />
              Employees
            </Link>
            <Link href="/dashboard/tasks" className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all">
              <CheckSquare size={18} />
              Tasks
            </Link>
            <Link href="/admin/audit-logs" className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all">
              <FileText size={18} />
              Audit Logs
            </Link>
            <Link href="/reports" className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all">
              <BarChart3 size={18} />
              Reports
            </Link>
            <Link href="/settings" className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition-all">
              <Settings size={18} />
              Settings
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-slate-800 p-1 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-purple-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-600 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 bg-purple-100 text-purple-700 font-bold rounded-full flex items-center justify-center text-sm border border-purple-200">
                AU
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-[11px] font-semibold text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}