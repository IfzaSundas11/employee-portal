"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  Eye,
  Search,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  _count?: {
    employees: number;
  };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  status: string;
  department?: {
    id: string;
    name: string;
  } | null;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/departments");

      if (!res.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await res.json();

      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Department fetch error:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // FILTER DEPARTMENTS
  // =========================
  const filteredDepartments = departments.filter((department) => {
    const searchText = search.toLowerCase().trim();

    return (
      department.name.toLowerCase().includes(searchText) ||
      department.code.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // OPEN ADD MODAL
  // =========================
  const openAddModal = () => {
    setEditingDepartment(null);
    setName("");
    setCode("");
    setDescription("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEditModal = (department: Department) => {
    setEditingDepartment(department);

    setName(department.name);
    setCode(department.code);
    setDescription(department.description || "");

    setShowModal(true);
  };

  // =========================
  // SAVE DEPARTMENT
  // =========================
  const handleSave = async () => {
    if (!name.trim() || !code.trim()) {
      alert("Department name and code are required.");
      return;
    }

    try {
      const method = editingDepartment ? "PUT" : "POST";

      const body = editingDepartment
        ? {
            id: editingDepartment.id,
            name: name.trim(),
            code: code.trim(),
            description: description.trim(),
          }
        : {
            name: name.trim(),
            code: code.trim(),
            description: description.trim(),
          };

      const res = await fetch("/api/departments", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setShowModal(false);

      setName("");
      setCode("");
      setDescription("");
      setEditingDepartment(null);

      fetchDepartments();
    } catch (error) {
      console.error("Save department error:", error);
      alert("Failed to save department.");
    }
  };

  // =========================
  // DELETE DEPARTMENT
  // =========================
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/departments?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete department.");
        return;
      }

      fetchDepartments();
    } catch (error) {
      console.error("Delete department error:", error);
      alert("Failed to delete department.");
    }
  };

  // =========================
  // VIEW EMPLOYEES
  // =========================
  const handleViewEmployees = async (department: Department) => {
    try {
      const res = await fetch("/api/employees");

      if (!res.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await res.json();

      const departmentEmployees = Array.isArray(data)
        ? data.filter(
            (employee: Employee) =>
              employee.department?.id === department.id
          )
        : [];

      setEmployees(departmentEmployees);
      setSelectedDepartment(department);
      setShowEmployees(true);
    } catch (error) {
      console.error("Employee fetch error:", error);
      alert("Failed to load employees.");
    }
  };

  // =========================
  // STATS
  // =========================
  const totalDepartments = departments.length;

  const totalEmployees = departments.reduce(
    (total, department) =>
      total + (department._count?.employees || 0),
    0
  );

  const emptyDepartments = departments.filter(
    (department) => (department._count?.employees || 0) === 0
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= HEADER ================= */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">StaffPortal</h1>
            <p className="text-sm text-slate-300">
              Enterprise Portal V2.0
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={22} />
            <span className="font-medium">
              Department Management
            </span>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* HERO */}
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Departments
            </h2>

            <p className="mt-1 text-slate-500">
              Manage your organization departments
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Department
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">

          {/* Total Departments */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Building2 size={24} />
              </div>

              <span className="text-sm font-medium text-slate-500">
                Total Departments
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {totalDepartments}
            </p>
          </div>

          {/* Assigned Employees */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <Users size={24} />
              </div>

              <span className="text-sm font-medium text-slate-500">
                Assigned Employees
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {totalEmployees}
            </p>
          </div>

          {/* Empty Departments */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <Building2 size={24} />
              </div>

              <span className="text-sm font-medium text-slate-500">
                Empty Departments
              </span>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {emptyDepartments}
            </p>
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search department by name or code..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-11 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {search && (
            <p className="mt-2 text-sm text-slate-500">
              Showing {filteredDepartments.length} department
              {filteredDepartments.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ================= DEPARTMENT CARDS ================= */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading departments...
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Building2
              size={45}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-xl font-semibold text-slate-700">
              {search
                ? "No Matching Departments"
                : "No Departments Found"}
            </h3>

            <p className="mt-2 text-slate-500">
              {search
                ? "Try searching with another department name or code."
                : "Add your first department to get started."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDepartments.map((department) => {
              const employeeCount =
                department._count?.employees || 0;

              return (
                <div
                  key={department.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* CARD TOP */}
                  <div className="mb-5 flex items-start justify-between">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                      <Building2 size={25} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {department.code}
                    </span>
                  </div>

                  {/* NAME */}
                  <h3 className="text-xl font-bold text-slate-900">
                    {department.name}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-2 min-h-[48px] text-sm text-slate-500">
                    {department.description ||
                      "No description available."}
                  </p>

                  {/* EMPLOYEE COUNT */}
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={18} />

                      {employeeCount}{" "}
                      {employeeCount === 1
                        ? "Employee"
                        : "Employees"}
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        employeeCount > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {employeeCount > 0
                        ? "Assigned"
                        : "Empty"}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-5 flex gap-2">

                    {/* VIEW EMPLOYEES */}
                    <button
                      onClick={() =>
                        handleViewEmployees(department)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <Eye size={17} />
                      View Employees
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() =>
                        openEditModal(department)
                      }
                      className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                      title="Edit"
                    >
                      <Pencil size={17} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(department.id)
                      }
                      className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ================= ADD / EDIT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h3>

                <p className="text-sm text-slate-500">
                  Enter department information
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">

              {/* NAME */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Department Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Information Technology"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* CODE */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Department Code
                </label>

                <input
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                  placeholder="e.g. IT"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-blue-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Department description..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                {editingDepartment
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EMPLOYEES MODAL ================= */}
      {showEmployees && selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {selectedDepartment.name}
                </h3>

                <p className="text-sm text-slate-500">
                  Employees in this department
                </p>
              </div>

              <button
                onClick={() =>
                  setShowEmployees(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* EMPLOYEES */}
            {employees.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <Users
                  size={40}
                  className="mx-auto mb-3 text-slate-300"
                />

                <p className="font-semibold text-slate-600">
                  No employees assigned
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] space-y-3 overflow-y-auto">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {employee.name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {employee.email}
                      </p>

                      <p className="text-sm text-slate-500">
                        {employee.designation}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CLOSE */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  setShowEmployees(false)
                }
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
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