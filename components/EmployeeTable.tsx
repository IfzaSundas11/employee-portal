import { Employee } from "@/lib/types";

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (id: string) => void;
}) {
  if (employees.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        No employees found matching your criteria.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
        <tr>
          <th className="px-6 py-3 text-left font-semibold">Name</th>
          <th className="px-6 py-3 text-left font-semibold">Email</th>
          <th className="px-6 py-3 text-left font-semibold">Department</th>
          <th className="px-6 py-3 text-left font-semibold">Designation</th>
          <th className="px-6 py-3 text-left font-semibold">Status</th>
          <th className="px-6 py-3 text-left font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {employees.map((emp) => (
          <tr
            key={emp.id}
            className="transition-colors hover:bg-slate-50"
          >
            {/* Name */}
            <td className="px-6 py-4 font-medium text-slate-900">
              {emp.name}
            </td>

            {/* Email */}
            <td className="px-6 py-4 text-slate-600">
              {emp.email}
            </td>

            {/* Department */}
           <td className="px-6 py-4 text-slate-600">
  {typeof emp.department === "object"
    ? emp.department.name
    : emp.department}
</td>

            {/* Designation */}
            <td className="px-6 py-4 text-slate-600">
              {emp.designation}
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  emp.status?.trim().toLowerCase() === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-pink-100 text-pink-700"
                }`}
              >
                {emp.status}
              </span>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">

                {/* View Profile */}
                <a
                  href={`/employees/${emp.id}`}
                  className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  View Profile
                </a>

                {/* Edit */}
                <button
                  onClick={() => onEdit(emp)}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(emp.id)}
                  className="font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}