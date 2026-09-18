"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Clock3,
  CheckCircle2,
  AlertCircle,
  UserRound,
  CalendarDays,
  MessageCircle,
  ListChecks,
  X,
  Pencil,
  GripVertical,
  Shield,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  assignee: string;
  initials?: string;
  date: string;
  createdAt: string;
  acknowledgedAt?: string | null;
  createdBy?: string;
  status: string;
  subtasks?: string;
  comments?: number;
  tags?: string[];
}

interface Employee {
  id: string;
  name: string;
}

export default function TasksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState<Date>(new Date());

  // Live timer
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic Employees State
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch Dynamic Employees List
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees"); // یا /api/users
      const data = await res.json();
      if (Array.isArray(data)) {
        const mappedEmployees = data.map((emp: any) => ({
          id: String(emp.id),
          name: emp.name || emp.username || "Unknown",
        }));
        setEmployees(mappedEmployees);
        if (mappedEmployees.length > 0) {
          setNewAssignee(mappedEmployees[0].name);
        }
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  // New task form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newPriority, setNewPriority] = useState("High");
  const [newStatus, setNewStatus] = useState("Pending");
  const [newDueDate, setNewDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks directly from Database
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();

      if (Array.isArray(data)) {
        const mappedData: Task[] = data.map((t: any) => ({
          ...t,
          id: t.id ? String(t.id) : String(Date.now()),
          initials: t.assignee ? t.assignee.charAt(0) : "A",
          date: t.date || "2026-08-20",
          createdAt: t.createdAt || new Date().toISOString(),
          acknowledgedAt: t.acknowledgedAt || null,
          status: t.status || "Pending",
          priority: t.priority || "Medium",
          subtasks: t.subtasks || "0/0 subtasks",
          comments: t.comments || 0,
          tags: t.tags || ["Task"],
        }));

        setTasks(mappedData);
      }
    } catch (err) {
      console.error("Failed to load tasks from API:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // Selected task
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Edit form
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDate, setEditDate] = useState("");

  const columnsConfig = [
    {
      title: "Pending",
      accent: "#E0A23B",
      bg: "#FFF9EE",
      icon: Clock3,
    },
    {
      title: "In Progress",
      accent: "#3B82D8",
      bg: "#EFF6FD",
      icon: AlertCircle,
    },
    {
      title: "Completed",
      accent: "#2FAE7D",
      bg: "#EEFAF3",
      icon: CheckCircle2,
    },
  ];

  const priorityStyle: Record<string, string> = {
    High: "bg-[#FDECEC] text-[#D64545]",
    Medium: "bg-[#FDF3E4] text-[#C9871F]",
    Low: "bg-[#E9F8EF] text-[#25945F]",
  };

  const avatarPalette = [
    { bg: "#EDEBFC", text: "#4F3FF0" },
    { bg: "#FFE9E5", text: "#C2402F" },
    { bg: "#E4F7EF", text: "#177A54" },
    { bg: "#FCEFDA", text: "#8A5C13" },
  ];

  // Format delay
  const formatDelay = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();

    if (diffMs <= 0) return "No delay";

    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days}d ${remainingHours}h delay`;
    }

    if (hours > 0) {
      return `${hours}h ${mins}m delay`;
    }

    return `${mins}m delay`;
  };

  // Due date alert
  const getDueDateAlert = (dueDateStr: string, status: string) => {
    if (status === "Completed") return null;

    const dueDate = new Date(`${dueDateStr}T23:59:59`);
    const diffMs = dueDate.getTime() - now.getTime();

    if (diffMs < 0) {
      const pastTime = new Date(`${dueDateStr}T00:00:00`);

      return {
        type: "overdue",
        message: `Delayed by ${formatDelay(pastTime, now)}`,
      };
    }

    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));

    if (hoursLeft <= 12) {
      return {
        type: "approaching",
        message: `Due in ${hoursLeft} hours`,
      };
    }

    return null;
  };

  // Acknowledge
  const handleAcknowledge = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              acknowledgedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  // Search
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const q = searchQuery.toLowerCase();

    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.assignee.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  // Open edit
  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);
    setEditAssignee(task.assignee);
    setEditStatus(task.status);
    setEditDate(task.date);
    setIsEditing(true);
  };

  // Update
  const handleUpdateTask = () => {
    if (!selectedTask) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? {
              ...t,
              title: editTitle,
              description: editDescription,
              priority: editPriority,
              assignee: editAssignee,
              initials: editAssignee.charAt(0),
              status: editStatus,
              date: editDate,
            }
          : t
      )
    );

    setSelectedTask(null);
    setIsEditing(false);
  };

  // Create
  const handleCreateTask = async () => {
    if (newTitle.trim() === "") return;

    const newTaskData = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      assignee: newAssignee,
      status: newStatus,
      date: newDueDate,
    };

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData),
      });

      fetchTasks();
    } catch (err) {
      console.error("Task API save error", err);
    }

    setNewTitle("");
    setNewDescription("");
    setIsFormOpen(false);
  };

  // Drag start
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  // Drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Drop
  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;

    if (!taskId) return;

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: targetStatus,
            }
          : t
      )
    );

    setDraggedTaskId(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80')",
        }}
      />

      {/* Light Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50/90 via-slate-100/88 to-slate-100/92" />

      {/* Main Content */}
      <div className="relative p-6 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Top Brand Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>

            <div className="h-6 w-px bg-slate-300" />

            <div>
              <div className="text-sm font-bold text-slate-800">
                StaffPortal
              </div>

              <div className="text-xs text-slate-500">Enterprise Portal V2.0</div>
            </div>
          </div>

          {/* Hero */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-7 py-7 shadow-lg">
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
            <div className="absolute right-12 bottom-[-55px] h-40 w-40 rounded-full bg-white/10" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <ClipboardList className="h-7 w-7 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Tasks Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-blue-100">
                    Manage your team tasks, progress and deadlines
                  </p>
                </div>
              </div>

              {/* Hero Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 pl-10 text-sm text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-white/40 sm:w-56"
                  />
                </div>

                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md transition hover:bg-blue-50 hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <ListChecks className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Tasks
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {totalTasks}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Completed
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {completedTasks}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
                  <Clock3 className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pending
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-800">
                    {tasks.filter((t) => t.status === "Pending").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress text */}
          <div className="mb-5">
            <p className="text-sm font-medium text-slate-600">
              <span className="font-bold text-slate-800">
                {completedTasks}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">{totalTasks}</span>{" "}
              tasks completed this week
            </p>
          </div>

          {/* Board */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {columnsConfig.map((col) => {
              const colTasks = filteredTasks.filter(
                (t) => t.status === col.title
              );

              const ColumnIcon = col.icon;

              return (
                <div
                  key={col.title}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.title)}
                  className="min-w-0"
                >
                  {/* Column Header */}
                  <div
                    className="flex items-center justify-between rounded-t-2xl border border-b-0 px-5 py-4"
                    style={{
                      backgroundColor: col.bg,
                      borderColor: "#E2E8F0",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${col.accent}20`,
                        }}
                      >
                        <ColumnIcon
                          className="h-4 w-4"
                          style={{
                            color: col.accent,
                          }}
                        />
                      </div>

                      <span
                        className="text-xs font-bold uppercase tracking-wide"
                        style={{
                          color: col.accent,
                        }}
                      >
                        {col.title}
                      </span>

                      <span
                        className="rounded-full border bg-white px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          color: col.accent,
                          borderColor: "#E2E8F0",
                        }}
                      >
                        {colTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Body */}
                  <div className="min-h-[430px] rounded-b-2xl border border-t-0 border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm">
                    {colTasks.length === 0 ? (
                      <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                          <ClipboardList className="h-5 w-5 text-slate-400" />
                        </div>

                        <p className="text-sm font-semibold text-slate-500">
                          No tasks found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Drag a task here or add a new task
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {colTasks.map((task, i) => {
                          const dueAlert = getDueDateAlert(
                            task.date,
                            task.status
                          );

                          const isUnacknowledged =
                            !task.acknowledgedAt &&
                            task.status !== "Completed";

                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              onClick={() => setSelectedTask(task)}
                              className={`group relative cursor-grab rounded-2xl border bg-white p-4 shadow-sm transition-all active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-md ${
                                isUnacknowledged
                                  ? "border-red-300 bg-red-50/30"
                                  : "border-slate-200 hover:border-blue-200"
                              }`}
                            >
                              <span
                                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                style={{
                                  backgroundColor: col.accent,
                                }}
                              />

                              <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                                <GripVertical className="h-4 w-4 text-slate-300" />
                              </div>

                              {isUnacknowledged && (
                                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-600" />

                                    <span className="text-[11px] font-bold text-red-700">
                                      Action Required: Please Acknowledge!
                                    </span>
                                  </div>

                                  <div className="mt-2 flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-medium text-red-600">
                                      Delay:{" "}
                                      {formatDelay(
                                        new Date(task.createdAt),
                                        now
                                      )}
                                    </span>

                                    <button
                                      onClick={(e) =>
                                        handleAcknowledge(e, task.id)
                                      }
                                      className="rounded-lg bg-red-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-red-700"
                                    >
                                      Acknowledge
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="mb-3 flex items-center justify-between gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    priorityStyle[task.priority] ||
                                    "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {task.priority || "Medium"}
                                </span>

                                {task.tags && (
                                  <div className="flex flex-wrap justify-end gap-1">
                                    {task.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-md bg-slate-100 px-1.5 py-1 text-[9px] font-semibold text-slate-500"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <p className="mb-1.5 pr-4 text-sm font-bold leading-snug text-slate-800">
                                {task.title}
                              </p>

                              {task.description && (
                                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                                  {task.description}
                                </p>
                              )}

                              {dueAlert && (
                                <div
                                  className={`mb-3 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-bold ${
                                    dueAlert.type === "overdue"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {dueAlert.message}
                                </div>
                              )}

                              <div className="mb-3 flex items-center gap-4 text-[11px] font-medium text-slate-400">
                                {task.subtasks && (
                                  <span className="flex items-center gap-1">
                                    <ListChecks className="h-3.5 w-3.5" />
                                    {task.subtasks}
                                  </span>
                                )}

                                {task.comments !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    {task.comments}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                                    style={{
                                      backgroundColor:
                                        avatarPalette[i % avatarPalette.length]
                                          .bg,
                                      color:
                                        avatarPalette[i % avatarPalette.length]
                                          .text,
                                    }}
                                  >
                                    {task.initials}
                                  </div>

                                  <div>
                                    <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                                      <UserRound className="h-3 w-3" />
                                      {task.assignee}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                                  <span className="text-[10px] font-medium text-slate-500">
                                    {task.date}
                                  </span>

                                  {task.acknowledgedAt && (
                                    <CheckCircle2
                                      className="ml-1 h-3.5 w-3.5 text-green-500"
                                      title="Acknowledged"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-semibold text-slate-400 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="py-6 text-center text-xs text-slate-500">
            StaffPortal • Employee Management System
          </div>
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Add New Task
                  </h2>

                  <p className="text-xs text-slate-400">
                    Create a new team task
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Title */}
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Title
            </label>

            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Design employee login flow"
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {/* Description */}
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Description
            </label>

            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Provide specific details about this task..."
              rows={3}
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {/* Assignee + Priority */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Assignee
                </label>

                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Priority
                </label>

                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Due Date + Status */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Due Date
                </label>

                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Status
                </label>

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTask}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASK DETAILS / EDIT MODAL */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onClick={() => {
            setSelectedTask(null);
            setIsEditing(false);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {selectedTask.status}
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    Task Details
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => handleOpenEdit(selectedTask)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditing(false);
                  }}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* EDIT MODE */}
            {isEditing ? (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-800">
                  Edit Task Details
                </h2>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Title
                  </label>

                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>

                {/* Priority + Assignee */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                      Priority
                    </label>

                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                      Assignee
                    </label>

                    <select
                      value={editAssignee}
                      onChange={(e) => setEditAssignee(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status + Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                      Status
                    </label>

                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Edit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUpdateTask}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW MODE */
              <div>
                <h2 className="mb-2 text-xl font-bold text-slate-800">
                  {selectedTask.title}
                </h2>

                <p className="mb-5 text-sm leading-relaxed text-slate-500">
                  {selectedTask.description || "No description provided."}
                </p>

                <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                  {/* Priority */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Priority
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        priorityStyle[selectedTask.priority] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {selectedTask.priority}
                    </span>
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Assignee
                    </span>

                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <UserRound className="h-3.5 w-3.5 text-blue-500" />
                      {selectedTask.assignee}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Due Date
                    </span>

                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                      {selectedTask.date}
                    </span>
                  </div>

                  {/* Acknowledgement */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-400">
                      Acknowledgement
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        selectedTask.acknowledgedAt
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedTask.acknowledgedAt
                        ? "✓ Acknowledged"
                        : "⚠ Pending Acknowledgement"}
                    </span>
                  </div>

                  {/* Created By */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Created By
                    </span>

                    <span className="text-sm font-semibold text-slate-700">
                      {selectedTask.createdBy || "System"}
                    </span>
                  </div>

                  {/* Subtasks */}
                  {selectedTask.subtasks && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        Subtasks
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {selectedTask.subtasks}
                      </span>
                    </div>
                  )}

                  {/* Comments */}
                  {selectedTask.comments !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        Comments
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {selectedTask.comments}
                      </span>
                    </div>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelectedTask(null)}
                  className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}