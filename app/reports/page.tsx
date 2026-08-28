"use client";

import { useState, useEffect } from "react";

export default function ReportsPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [department, setDepartment] = useState("All Departments");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(function () {
    async function loadData() {
      try {
        setLoading(true);

        const empRes = await fetch("/api/employees");
        const deptRes = await fetch("/api/departments");

        if (!empRes.ok || !deptRes.ok) {
          throw new Error("Failed to load data");
        }

        const empData = await empRes.json();
        const deptData = await deptRes.json();

        setEmployees(Array.isArray(empData) ? empData : []);
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load employees or departments.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleGenerate() {
    try {
      setError(null);
      setGenerating(true);
      setDownloadUrl(null);

      /*
       * FILTER EMPLOYEES
       *
       * Department can come from API as:
       * 1. emp.department.name
       * 2. emp.department as a string
       */
      const filtered = employees.filter(function (emp) {
        let employeeDepartment = "";

        if (typeof emp.department === "string") {
          employeeDepartment = emp.department;
        } else if (emp.department && emp.department.name) {
          employeeDepartment = emp.department.name;
        }

        const matchesDept =
          department === "All Departments" ||
          employeeDepartment.trim().toLowerCase() ===
            department.trim().toLowerCase();

        const empDate = emp.joiningDate
          ? String(emp.joiningDate).split("T")[0]
          : "";

        const matchesFrom = !fromDate || empDate >= fromDate;
        const matchesTo = !toDate || empDate <= toDate;

        return matchesDept && matchesFrom && matchesTo;
      });

      if (filtered.length === 0) {
        setError("No employees match the selected filters.");
        setGenerating(false);
        return;
      }

      /*
       * PREPARE DATA FOR EXCEL
       */
      const payload = filtered.map(function (emp) {
        let employeeDepartment = "";

        if (typeof emp.department === "string") {
          employeeDepartment = emp.department;
        } else if (emp.department && emp.department.name) {
          employeeDepartment = emp.department.name;
        }

        return {
          name: emp.name || "",
          email: emp.email || "",
          department: employeeDepartment,
          designation: emp.designation || "",
          joiningDate: emp.joiningDate
            ? String(emp.joiningDate).split("T")[0]
            : "",
          status: emp.status || "",
        };
      });

      /*
       * GENERATE EXCEL REPORT
       */
      const res = await fetch("/api/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employees: payload,
        }),
      });

      if (!res.ok) {
        setError("Failed to generate report.");
        setGenerating(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const today = new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "_");

      setFileName("employees_report_" + today + ".xlsx");
      setDownloadUrl(url);
      setGenerating(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating the report.");
      setGenerating(false);
    }
  }

  /*
   * LOADING SCREEN
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

            <h2 className="text-lg font-semibold text-slate-800">
              Loading Reports
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Please wait while employee data is loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * SUCCESS / DOWNLOAD SCREEN
   */
  if (downloadUrl) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-600 mb-1">
              REPORTS
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Employee Reports
            </h1>

            <p className="text-slate-500 mt-2">
              Your employee report is ready to download.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 md:p-10">

              <div className="flex items-center gap-4 mb-7">
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl text-green-600">
                    ✓
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Report Generated Successfully
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your Excel report has been generated successfully.
                  </p>
                </div>
              </div>

              {/* File Information */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    File
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {fileName}
                  </p>
                </div>

                <a
                  href={downloadUrl}
                  download={fileName}
                  className="inline-flex justify-center items-center bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
                >
                  Download Excel
                </a>
              </div>

              {/* Generate Another */}
              <button
                onClick={function () {
                  setDownloadUrl(null);
                  setError(null);
                }}
                className="w-full mt-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg transition"
              >
                Generate Another Report
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /*
   * MAIN REPORT PAGE
   */
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 tracking-wide">
            REPORTS
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">

            <div>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">
                Generate Employee Report
              </h1>

              <p className="text-slate-500 mt-2">
                Filter employee records and download them as an Excel report.
              </p>
            </div>

            {/* Total Employees */}
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">
                Total Employees
              </p>

              <p className="text-xl font-bold text-slate-900">
                {employees.length}
              </p>
            </div>

          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          {/* Card Header */}
          <div className="px-6 md:px-8 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-lg">
                  ▤
                </span>
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Report Filters
                </h2>

                <p className="text-sm text-slate-500">
                  Select the criteria for your report.
                </p>
              </div>

            </div>
          </div>

          {/* Filters */}
          <div className="p-6 md:p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Department */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>

                <select
                  value={department}
                  onChange={function (e) {
                    setDepartment(e.target.value);
                    setError(null);
                  }}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="All Departments">
                    All Departments
                  </option>

                  {departments.map(function (d) {
                    return (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={function (e) {
                    setFromDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Include employees joining from this date.
                </p>
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={function (e) {
                    setToDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Include employees joining until this date.
                </p>
              </div>

            </div>

            {/* Selected Filters */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5">

              <h3 className="text-sm font-semibold text-slate-700 mb-4">
                Selected Criteria
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Department
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {department}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    From Date
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {fromDate || "Any date"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    To Date
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {toDate || "Any date"}
                  </p>
                </div>

              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition shadow-sm"
            >
              {generating
                ? "Generating Report..."
                : "Generate Excel Report"}
            </button>

            <p className="text-center text-xs text-slate-400 mt-3">
              The report will be downloaded in Excel (.xlsx) format.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
