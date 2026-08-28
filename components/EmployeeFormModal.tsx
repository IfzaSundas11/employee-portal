"use client";
import { useState, useEffect } from "react";

export default function EmployeeFormModal({
  employee,
  onClose,
  onSave,
}: {
  employee: any;
  onClose: () => void;
  onSave: () => void;
}) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState(employee ? employee.name : "");
  const [email, setEmail] = useState(employee ? employee.email : "");
  const [phone, setPhone] = useState(employee && employee.phone ? employee.phone : "");
  const [address, setAddress] = useState(employee && employee.address ? employee.address : "");
  const [departmentId, setDepartmentId] = useState(employee && employee.department ? employee.department.id : "");
  const [designation, setDesignation] = useState(employee ? employee.designation : "");
  const [joiningDate, setJoiningDate] = useState(
    employee ? employee.joiningDate.split("T")[0] : ""
  );
  const [status, setStatus] = useState(employee ? employee.status : "Active");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(function () {
    fetch("/api/departments")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setDepartments(data);
        if (!departmentId && data.length > 0) {
          setDepartmentId(data[0].id);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const url = employee ? "/api/employees/" + employee.id : "/api/employees";
    const method = employee ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        address: address,
        departmentId: departmentId,
        designation: designation,
        joiningDate: joiningDate,
        status: status,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setSubmitting(false);
      return;
    }

    onSave();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={function (e) { setName(e.target.value); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={function (e) { setEmail(e.target.value); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={function (e) { setPhone(e.target.value); }}
              placeholder="03XX-XXXXXXX"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
            <textarea
              value={address}
              onChange={function (e) { setAddress(e.target.value); }}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
            <select
              value={departmentId}
              onChange={function (e) { setDepartmentId(e.target.value); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(function (d) {
                return <option key={d.id} value={d.id}>{d.name}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Designation</label>
            <input
              required
              type="text"
              value={designation}
              onChange={function (e) { setDesignation(e.target.value); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Joining Date</label>
            <input
              required
              type="date"
              value={joiningDate}
              onChange={function (e) { setJoiningDate(e.target.value); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
            <select
              value={status}
              onChange={function (e) { setStatus(e.target.value); }}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 rounded-lg p-2 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {submitting ? "Saving..." : employee ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}