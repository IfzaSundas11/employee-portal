"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserRound,
  IdCard,
  Building2,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  
  ShieldCheck,
  Clock3,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const res = await fetch("/api/employees/" + params.id);

        if (!res.ok) {
          setError("Employee not found");
          return;
        }

        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load employee");
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [params.id]);

  if (loading) {
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

        <div className="relative flex min-h-screen items-center justify-center p-6">
          <div className="rounded-2xl border border-white/70 bg-white/90 px-10 py-8 text-center shadow-xl backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <UserRound className="h-6 w-6 animate-pulse text-blue-600" />
            </div>

            <p className="font-medium text-slate-600">
              Loading employee profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
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

        <div className="relative flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <UserRound className="h-7 w-7 text-red-500" />
            </div>

            <h2 className="mb-2 text-xl font-bold text-slate-900">
              Employee Not Found
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              {error || "Employee not found"}
            </p>

            <button
              onClick={() => router.push("/employees")}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </button>
          </div>
        </div>
      </div>
    );
  }

  const joiningDate = employee.joiningDate
    ? new Date(employee.joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

  const isActive =
    employee.status?.trim().toLowerCase() === "active";

  const initial = employee.name?.charAt(0).toUpperCase() || "U";

  const infoCards = [
    {
      label: "Employee ID",
      value: employee.id || "-",
      icon: IdCard,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      full: false,
    },
    {
      label: "Department",
      value: employee.department?.name || "-",
      icon: Building2,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      full: false,
    },
    {
      label: "Email",
      value: employee.email || "-",
      icon: Mail,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      full: false,
    },
    {
      label: "Phone",
      value: employee.phone || "Not provided",
      icon: Phone,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      full: false,
    },
    {
      label: "Designation",
      value: employee.designation || "-",
      icon: BriefcaseBusiness,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      full: false,
    },
    {
      label: "Joining Date",
      value: joiningDate,
      icon: CalendarDays,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      full: false,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')",
        }}
      />

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50/90 via-slate-100/85 to-slate-100/90" />

      <div className="relative p-6 sm:p-8">
        <div className="mx-auto max-w-6xl">

          {/* Top Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => router.push("/employees")}
              className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              Back to Employees
            </button>

            <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              Employee Profile
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-xl shadow-slate-900/10">

            {/* Profile Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-7 py-8 sm:px-10 sm:py-10">

              {/* Decorative circles */}
              <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />
              <div className="absolute right-16 -bottom-20 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute right-40 top-10 h-20 w-20 rounded-full bg-white/5" />

              <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center">

                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl font-bold text-blue-600 shadow-xl ring-4 ring-white/20">
                  {initial}
                </div>

                {/* Employee Name */}
                <div className="text-white">
                  <div className="mb-1 flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-blue-100" />
                    <p className="text-sm font-medium text-blue-100">
                      Employee
                    </p>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {employee.name}
                  </h1>

                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-100 sm:text-base">
                    <BriefcaseBusiness className="h-4 w-4" />
                    {employee.designation || "Employee"}
                  </p>
                </div>

                {/* Status */}
                <div className="sm:ml-auto">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-sm ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isActive ? "bg-green-500" : "bg-pink-500"
                      }`}
                    />
                    {employee.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="p-6 sm:p-8 md:p-10">

              {/* Section Heading */}
              <div className="mb-7 flex items-center gap-4 border-b border-slate-200 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <IdCard className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Employee Information
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Personal and employment details
                  </p>
                </div>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {infoCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${item.iconColor}`}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {item.label}
                          </p>

                          <p className="break-all font-semibold text-slate-800">
                            {item.value}
                          </p>
                        </div>

                      </div>
                    </div>
                  );
                })}

                {/* Status Card */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </p>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isActive
                              ? "bg-green-500"
                              : "bg-pink-500"
                          }`}
                        />
                        {employee.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <Clock3 className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Member Since
                      </p>

                      <p className="font-semibold text-slate-800">
                        {joiningDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Address
                      </p>

                      <p className="font-semibold text-slate-800">
                        {employee.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

                <button
                  onClick={() => router.push("/employees")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Employees
                </button>

               
              </div>

            </div>
          </div>

          {/* Small footer */}
          <div className="mt-5 text-center text-xs text-slate-500">
            StaffPortal • Employee Management System
          </div>

        </div>
      </div>
    </div>
  );
}