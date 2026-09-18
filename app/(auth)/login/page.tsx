"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [resetLink, setResetLink] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSplashExit();
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  const triggerSplashExit = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 800);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.user?.role === "ADMIN") {
        window.location.href = "/dashboard";
      } else if (data.user?.role === "MANAGER") {
        window.location.href = "/dashboard";
      } else if (data.employeeId) {
        window.location.href = "/employees/" + data.employeeId;
      } else {
        window.location.href = "/profile";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    setModalSuccess("");
    setResetLink("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate reset link");
      }

      setModalSuccess(data.message);
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden font-sans select-none">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-blue-950/80 to-slate-950/95" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-slate-950/95 backdrop-blur-2xl text-white transition-all duration-1000 ease-in-out ${
            isFadingOut
              ? "opacity-0 scale-105 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <div className="pt-6">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-950/60 border border-cyan-500/30 rounded-full backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">
                Enterprise Workspace Portal
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700 blur-xl opacity-80 animate-pulse" />
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-white/20">
                <img
                  src="/logo.png"
                  alt="EMP Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                EMP PORTAL
              </h1>
              <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
                Employee Management & Collaboration System
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold text-cyan-400 tracking-wider uppercase pt-1">
              <span>Manage</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Empower</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Grow</span>
            </div>

            <div className="w-56 h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-6 border border-white/10">
              <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 animate-pulse rounded-full w-full" />
            </div>
          </div>

          <div className="pb-6 flex flex-col items-center gap-3">
            <button
              onClick={triggerSplashExit}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              Skip Intro
            </button>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase font-medium">
              Powered by EMP Workspace
            </p>
          </div>
        </div>
      )}

      <div
        className={`relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100 transition-all duration-700 ${
          showSplash
            ? "opacity-0 translate-y-8 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div className="flex justify-center mb-5">
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src="/logo.png"
              alt="EMP Logo"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Please enter your credentials to access your portal.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Gmail / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-all"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="dot-dot-dot"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-all"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wider"
          >
            {loading ? "Signing In..." : "Sign In to Portal"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Reset Password
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered email address to receive password reset instructions.
              </p>
            </div>

            {modalError && (
              <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {modalSuccess}
                </div>
                {resetLink && (
                  <div className="mt-2 pt-2 border-t border-emerald-200">
                    <p className="font-bold text-slate-700 mb-1">Testing Link:</p>
                    <button
                      type="button"
                      onClick={() => window.open(resetLink, "_blank")}
                      className="text-blue-600 font-semibold underline break-all block text-left"
                    >
                      {resetLink}
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs uppercase tracking-wider"
              >
                {modalLoading ? "Sending Link..." : "Send Reset Link"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}