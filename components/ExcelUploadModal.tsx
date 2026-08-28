"use client";
import { useState, useRef, useEffect } from "react";

type ParsedRecord = {
  row: number;
  name: string;
  email: string;
  department: string;
  valid: boolean;
  error?: string;
};

export default function ExcelUploadModal({
  onImport,
}: {
  onImport: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [records, setRecords] = useState<ParsedRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(function () {
    if (isOpen) {
      fetch("/api/departments")
        .then(function (res) { return res.json(); })
        .then(function (data) { setDepartments(data); });
    }
  }, [isOpen]);

  const processFile = async (file: File) => {
    setError(null);
    setLoading(true);
    setRecords(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-employees", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setRecords(data.records);
      }
    } catch {
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith(".xlsx")) {
      setError("Please upload an .xlsx file.");
      return;
    }
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const validCount = records ? records.filter(function (r) { return r.valid; }).length : 0;
  const invalidCount = records ? records.length - validCount : 0;

  async function findOrCreateDepartment(deptName: string) {
    const existing = departments.find(function (d) {
      return d.name.toLowerCase() === deptName.toLowerCase() || d.code.toLowerCase() === deptName.toLowerCase();
    });
    if (existing) return existing.id;

    // Department not found, create it automatically
    const res = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: deptName,
        code: deptName.toUpperCase().slice(0, 6),
      }),
    });
    const newDept = await res.json();
    setDepartments(function (prev) { return [...prev, newDept]; });
    return newDept.id;
  }

  const handleConfirmImport = async () => {
    if (!records) return;
    setImporting(true);
    setError(null);

    const valid = records.filter(function (r) { return r.valid; });
    let failCount = 0;

    for (const r of valid) {
      try {
        const departmentId = await findOrCreateDepartment(r.department);

        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: r.name,
            email: r.email,
            departmentId: departmentId,
            designation: "N/A",
            joiningDate: new Date().toISOString().split("T")[0],
            status: "Active",
          }),
        });

        if (!res.ok) failCount++;
      } catch {
        failCount++;
      }
    }

    setImporting(false);

    if (failCount > 0) {
      setError(failCount + " record(s) could not be imported (possibly duplicate emails).");
    }

    onImport();
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setRecords(null);
    setError(null);
  };

  return (
    <>
      <button
        onClick={function () { setIsOpen(true); }}
        className="rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-medium transition-colors"
      >
        Upload Employees
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Upload Employees</h2>
              <button onClick={closeModal} className="text-2xl text-gray-500 hover:text-gray-700 leading-none">
                ×
              </button>
            </div>

            {!records && (
              <div
                onDragOver={function (e) { e.preventDefault(); setDragActive(true); }}
                onDragLeave={function () { setDragActive(false); }}
                onDrop={handleDrop}
                className={"rounded-lg border-2 border-dashed p-10 text-center transition-colors " + (dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300")}
              >
                <div className="mb-3 text-4xl">☁️</div>
                <p className="font-medium text-slate-700">Drag & Drop Excel</p>
                <p className="my-2 text-sm text-gray-500">or</p>

                <label className="cursor-pointer rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-medium transition-colors">
                  Browse File
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={function (e) { handleFileSelect(e.target.files); }}
                  />
                </label>

                <p className="mt-4 text-xs text-gray-500">Supports .xlsx files</p>
              </div>
            )}

            {loading && <p className="text-center text-slate-500 mt-4">Processing file...</p>}

            {error && (
              <p className="text-center text-red-600 mt-4 bg-red-50 rounded-lg p-3">{error}</p>
            )}

            {records && (
              <div className="mt-2">
                <div className="flex gap-4 mb-3 text-sm">
                  <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    {validCount} valid
                  </span>
                  {invalidCount > 0 && (
                    <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full">
                      {invalidCount} invalid
                    </span>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left">Row</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Department</th>
                        <th className="px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map(function (r) {
                        return (
                          <tr key={r.row} className={r.valid ? "" : "bg-red-50"}>
                            <td className="px-3 py-2">{r.row}</td>
                            <td className="px-3 py-2">{r.name || "-"}</td>
                            <td className="px-3 py-2">{r.email || "-"}</td>
                            <td className="px-3 py-2">{r.department || "-"}</td>
                            <td className="px-3 py-2">
                              {r.valid ? (
                                <span className="text-green-700">Valid</span>
                              ) : (
                                <span className="text-red-700">{r.error}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleConfirmImport}
                    disabled={validCount === 0 || importing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {importing ? "Importing..." : "Import " + validCount + " Employee" + (validCount !== 1 ? "s" : "")}
                  </button>
                  <button
                    onClick={function () { setRecords(null); setError(null); }}
                    disabled={importing}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
                  >
                    Upload Different File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}