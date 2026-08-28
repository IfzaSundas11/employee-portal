"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Plus,
  Shield,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import EmployeeTable from "@/components/EmployeeTable";
import SearchBar from "@/components/SearchBar";
import DepartmentFilter from "@/components/DepartmentFilter";
import Pagination from "@/components/Pagination";
import EmployeeFormModal from "@/components/EmployeeFormModal";
import ExcelUploadModal from "@/components/ExcelUploadModal";

const PAGE_SIZE = 5;

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  async function loadEmployees() {
    try {
      setLoading(true);

      const res = await fetch("/api/employees");

      if (!res.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadEmployees();
  }, []);

  /*
   * FILTER EMPLOYEES
   *
   * Department filter now supports BOTH:
   * - Department name, e.g. "Information Technology"
   * - Department code, e.g. "IT"
   */
  const filtered = useMemo(function () {
    return employees.filter(function (emp) {
      const name = emp.name
        ? String(emp.name).toLowerCase()
        : "";

      const email = emp.email
        ? String(emp.email).toLowerCase()
        : "";

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        name.includes(searchText) ||
        email.includes(searchText);

      /*
       * Get employee department information
       */
      const employeeDepartmentName =
        emp.department && emp.department.name
          ? String(emp.department.name)
          : "";

      const employeeDepartmentCode =
        emp.department && emp.department.code
          ? String(emp.department.code)
          : "";

      /*
       * Department can be:
       * "All"
       * "IT"
       * "Information Technology"
       * etc.
       */
      const selectedDepartment = String(department)
        .trim()
        .toLowerCase();

      const matchesDept =
        department === "All" ||
        employeeDepartmentName.trim().toLowerCase() ===
          selectedDepartment ||
        employeeDepartmentCode.trim().toLowerCase() ===
          selectedDepartment;

      /*
       * Status filter
       */
      const matchesStatus =
        status === "All" ||
        emp.status === status;

      return (
        matchesSearch &&
        matchesDept &&
        matchesStatus
      );
    });
  }, [employees, search, department, status]);

  /*
   * Pagination
   */
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(
    filtered.length / PAGE_SIZE
  );

  /*
   * Active / Inactive Counts
   */
  const activeCount = employees.filter(function (e) {
    return e.status === "Active";
  }).length;

  const inactiveCount = employees.filter(function (e) {
    return e.status === "Inactive";
  }).length;

  /*
   * Department Count
   */
  const deptCount = new Set(
    employees
      .map(function (e) {
        return e.department
          ? e.department.id
          : null;
      })
      .filter(Boolean)
  ).size;

  /*
   * Department Chart Data
   */
  const departmentChartData = useMemo(function () {
    const counts: { [key: string]: number } = {};

    employees.forEach(function (emp) {
      const deptName =
        emp.department && emp.department.name
          ? emp.department.name
          : "No Department";

      if (!counts[deptName]) {
        counts[deptName] = 0;
      }

      counts[deptName]++;
    });

    return Object.keys(counts).map(function (name) {
      return {
        name: name,
        employees: counts[name],
      };
    });
  }, [employees]);

  /*
   * Status Chart Data
   */
  const statusChartData = [
    {
      name: "Active",
      value: activeCount,
    },
    {
      name: "Inactive",
      value: inactiveCount,
    },
  ];

  /*
   * Add Employee
   */
  function handleAddClick() {
    setEditingEmployee(null);
    setShowModal(true);
  }

  /*
   * Edit Employee
   */
  function handleEditClick(emp: any) {
    setEditingEmployee(emp);
    setShowModal(true);
  }

  /*
   * Delete Employee
   */
  async function handleDelete(id: string) {
    try {
      const res = await fetch(
        "/api/employees/" + id,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete employee");
      }

      loadEmployees();
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error
      );
    }
  }

  /*
   * Save Employee
   */
  function handleSave() {
    setShowModal(false);
    loadEmployees();
  }

  /*
   * Excel Import
   */
  function handleBulkImport() {
    loadEmployees();
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')",
        }}
      ></div>

      <div className="fixed inset-0 bg-gradient-to-b from-blue-50/90 via-slate-100/85 to-slate-100/90"></div>

      <div className="relative text-slate-900 p-6 sm:p-8">

        <div className="max-w-7xl mx-auto">

          {/* Portal Header */}
          <div className="flex items-center gap-2 mb-6">

            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Shield className="w-4 h-4 text-white" />
            </div>

            <span className="font-bold text-slate-900">
              StaffPortal
            </span>

            <span className="text-xs text-slate-600 font-medium border-l border-slate-300 pl-2 ml-1">
              Enterprise Portal V2.0
            </span>

          </div>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-7 mb-6 shadow-lg shadow-blue-900/10">

            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10"></div>

            <div className="absolute right-16 bottom-[-40px] w-32 h-32 rounded-full bg-white/5"></div>

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Employee Dashboard
                  </h1>

                  <p className="text-blue-100 text-sm mt-0.5">
                    Manage your team members and their information
                  </p>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                <ExcelUploadModal
                  onImport={handleBulkImport}
                />

                <button
                  onClick={handleAddClick}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Employee
                </button>

              </div>

            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Total Employees */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {employees.length}
                </p>

                <p className="text-sm text-slate-500">
                  Total Employees
                </p>
              </div>

            </div>

            {/* Active Employees */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {activeCount}
                </p>

                <p className="text-sm text-slate-500">
                  Active Employees
                </p>
              </div>

            </div>

            {/* Inactive Employees */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {inactiveCount}
                </p>

                <p className="text-sm text-slate-500">
                  Inactive Employees
                </p>
              </div>

            </div>

            {/* Departments */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {deptCount}
                </p>

                <p className="text-sm text-slate-500">
                  Departments
                </p>
              </div>

            </div>

          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

            {/* Department Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

              <div className="mb-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Employees by Department
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Employee distribution across departments
                </p>
              </div>

              {departmentChartData.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
                  No department data available
                </div>
              ) : (
                <div className="h-56">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={departmentChartData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -15,
                        bottom: 5,
                      }}
                    >

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="employees"
                        name="Employees"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        barSize={42}
                      />

                    </BarChart>
                  </ResponsiveContainer>

                </div>
              )}

            </div>

            {/* Status Chart */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

              <div className="mb-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Employee Status
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Active and inactive employee overview
                </p>
              </div>

              <div className="h-56">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >

                      {statusChartData.map(
                        function (_, index) {
                          return (
                            <Cell
                              key={"cell-" + index}
                              fill={
                                index === 0
                                  ? "#22c55e"
                                  : "#ef4444"
                              }
                            />
                          );
                        }
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>
                </ResponsiveContainer>

              </div>

            </div>

          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

              {/* Search */}
              <SearchBar
                value={search}
                onChange={function (v) {
                  setSearch(v);
                  setPage(1);
                }}
              />

              {/* Department */}
              <DepartmentFilter
                value={department}
                onChange={function (v) {
                  setDepartment(v);
                  setPage(1);
                }}
              />

              {/* Status */}
              <select
                value={status}
                onChange={function (e) {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

              {/* Result Count */}
              <span className="lg:ml-auto text-sm text-slate-500 whitespace-nowrap">
                {filtered.length} employee
                {filtered.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </span>

            </div>

          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            {loading ? (
              <div className="p-12 text-center text-slate-400">
                Loading employees...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No employees found
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Try changing your search or filters.
                </p>

              </div>
            ) : (
              <EmployeeTable
                employees={paginated}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            )}

          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          )}

        </div>
      </div>

      {/* Employee Modal */}
      {showModal && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={function () {
            setShowModal(false);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
}