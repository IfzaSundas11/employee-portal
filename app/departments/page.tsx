"use client";

import { useEffect, useState } from "react";
import { Shield, Building2, Plus, Tag, FileText } from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");

      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddClick = () => {
    setEditingDepartment(null);
    setName("");
    setCode("");
    setDescription("");
    setShowModal(true);
  };

  const handleEditClick = (department: Department) => {
    setEditingDepartment(department);
    setName(department.name);
    setCode(department.code);
    setDescription(department.description || "");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !code.trim()) {
      alert("Name and Code are required.");
      return;
    }

    try {
      const response = await fetch("/api/departments", {
        method: editingDepartment ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingDepartment
            ? {
                id: editingDepartment.id,
                name,
                code,
                description,
              }
            : {
                name,
                code,
                description,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setShowModal(false);
      setEditingDepartment(null);
      setName("");
      setCode("");
      setDescription("");

      fetchDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Failed to save department.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await fetch(`/api/departments?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete department.");
        return;
      }

      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department.");
    }
  };

  const colors = ["bg-blue-50 text-blue-600", "bg-green-50 text-green-600", "bg-indigo-50 text-indigo-600", "bg-amber-50 text-amber-600", "bg-pink-50 text-pink-600", "bg-purple-50 text-purple-600"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')",
        }}
      ></div>
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50/90 via-slate-100/85 to-slate-100/90"></div>

      <div className="relative text-slate-900 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">StaffPortal</span>
            <span className="text-xs text-slate-600 font-medium border-l border-slate-300 pl-2 ml-1">Enterprise Portal V2.0</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-700 p-7 mb-6 shadow-lg shadow-indigo-900/10">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute right-16 bottom-[-40px] w-32 h-32 rounded-full bg-white/5"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Departments</h1>
                  <p className="text-indigo-100 text-sm mt-0.5">Manage your organization departments</p>
                </div>
              </div>
              <button
                onClick={handleAddClick}
                className="flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-400">
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-400">
              No departments found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((department, index) => {
                const colorClass = colors[index % colors.length];
                return (
                  <div
                    key={department.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={"w-11 h-11 rounded-xl flex items-center justify-center " + colorClass}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {department.code}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg mb-1">{department.name}</h3>

                    <div className="flex items-start gap-1.5 text-sm text-slate-500 mb-4">
                      <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <p>{department.description || "No description"}</p>
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleEditClick(department)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-slate-500 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <label className="mb-1 block text-sm font-medium text-slate-600">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Department Name"
              className="mb-4 w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="mb-1 block text-sm font-medium text-slate-600">
              Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Department Code"
              className="mb-4 w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="mb-1 block text-sm font-medium text-slate-600">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Department Description"
              rows={4}
              className="mb-5 w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                {editingDepartment ? "Update Department" : "Add Department"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}