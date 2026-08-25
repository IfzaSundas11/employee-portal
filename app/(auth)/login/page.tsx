"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Building2 } from "lucide-react";

export default function LoginPage() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Invalid credentials ❌");
      }
    } catch {
      setMessage("Server error occurred ⚠️");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setResetSubmitted(true);
      } else {
        const data = await res.json();
        setMessage(data.message || "Email not found ❌");
      }
    } catch {
      setMessage("Failed to process request ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 text-slate-800 overflow-hidden">
      {/* Full Background Corporate Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]" />
      </div>

      {/* Left Column - Hero Banner */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative z-10 border-r border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">StaffPortal 🚀</span>
        </div>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400" /> Enterprise Portal V2.0
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
            Smart workforce management made effortless. 💼✨
          </h1>
          <p className="text-slate-200 text-base leading-relaxed drop-shadow">
            Centralized access for attendance, tasks, and personnel administration with modern end-to-end security. 🛡️📊
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Building2 className="w-4 h-4 text-blue-400" /> © 2026 StaffPortal Inc. All rights reserved. 🔒
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8 bg-white/95 p-8 rounded-3xl border border-white/60 shadow-2xl shadow-slate-950/30 backdrop-blur-xl relative">
          
          {!isForgotPassword ? (
            /* Login UI View */
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back 👋</h2>
                <p className="text-sm text-slate-500 mt-1">Please enter your work details to access your portal.</p>
              </div>

              {message && (
                <div className="p-3.5 text-sm bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-medium">
                  {message}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Work Email 📧
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Password 🔑
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Forgot Password UI View */
            <div className="space-y-6">
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSubmitted(false);
                  setMessage("");
                }}
                className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>

              {!resetSubmitted ? (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password 🔐</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Enter your registered email address to receive your recovery link.
                    </p>
                  </div>

                  {message && (
                    <div className="p-3.5 text-sm bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-medium">
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Registered Email 📧
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@company.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Send Reset Link 📩"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Reset Email Sent! 🎉</h3>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    We have processed a password reset link for <span className="text-blue-600 font-semibold">{email}</span>. Please check your inbox. 📬
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}