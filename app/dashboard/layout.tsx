"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  Building2,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Sidebar state (Default desktop par open)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/login/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Employees", href: "/dashboard/employees", icon: Users },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Audit Logs", href: "/dashboard/audit", icon: FileText },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
      {/* Sidebar with Smooth Slide Animation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? "w-64 translate-x-0" 
            : "-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:overflow-hidden"
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              Company
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800/80 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors whitespace-nowrap"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-xl hover:bg-slate-100 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder-slate-400 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm ring-2 ring-indigo-600/10">
                AU
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  Admin User
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium leading-none">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}