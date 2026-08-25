"use client";

import { useState, useEffect, useMemo } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  assignee: string;
  initials?: string;
  date: string; // Due Date (YYYY-MM-DD)
  createdAt: string; // ISO string timestamp
  acknowledgedAt?: string | null;
  createdBy?: string;
  status: string;
  subtasks?: string;
  comments?: number;
  tags?: string[];
}

export default function TasksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState<Date>(new Date());

  // Live timer tick to update delay counters every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // New task form states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignee, setNewAssignee] = useState("Nadia");
  const [newPriority, setNewPriority] = useState("High");
  const [newStatus, setNewStatus] = useState("Pending");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);

  // Initial rich dummy data with SLA & Ack attributes
  const initialDummyTasks: Task[] = [
    {
      id: "1",
      title: "Design Employee Management UI",
      description: "Create high-fidelity wireframes and responsive layouts for employee list, details view, and add/edit modal forms.",
      priority: "High",
      assignee: "Nadia",
      initials: "N",
      date: "2026-08-24", // Past Date to trigger Overdue
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hrs ago
      acknowledgedAt: null, // Unacknowledged
      createdBy: "Ayesha",
      status: "Pending",
      subtasks: "3/5 subtasks",
      comments: 4,
      tags: ["UI/UX", "Figma"]
    },
    {
      id: "2",
      title: "Setup PostgreSQL & Prisma ORM",
      description: "Configure Neon PostgreSQL database schema, setup connection string, and generate Prisma Client for backend API routes.",
      priority: "High",
      assignee: "Ayesha",
      initials: "A",
      date: "2026-08-28",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      acknowledgedAt: new Date().toISOString(),
      createdBy: "Ayesha",
      status: "In Progress",
      subtasks: "4/4 subtasks",
      comments: 8,
      tags: ["Database", "Prisma"]
    },
    {
      id: "3",
      title: "Connect GitHub Collaborator Access",
      description: "Add team members as repository collaborators on GitHub and setup branch protection rules for main branch.",
      priority: "Medium",
      assignee: "Ifza",
      initials: "I",
      date: "2026-08-18",
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      acknowledgedAt: new Date().toISOString(),
      createdBy: "Ayesha",
      status: "Completed",
      subtasks: "2/2 subtasks",
      comments: 2,
      tags: ["DevOps", "Git"]
    },
    {
      id: "4",
      title: "API Endpoint for Employee CRUD",
      description: "Build Next.js API routes (/api/employees) supporting GET, POST, PUT, and DELETE with proper error handling.",
      priority: "Medium",
      assignee: "Nadia",
      initials: "N",
      date: "2026-08-25",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      acknowledgedAt: null,
      createdBy: "Ayesha",
      status: "Pending",
      subtasks: "1/4 subtasks",
      comments: 3,
      tags: ["Backend", "Next.js"]
    },
    {
      id: "5",
      title: "Authentication & Role Setup",
      description: "Implement JWT based authentication and middleware for admin/employee role authorizations.",
      priority: "Low",
      assignee: "Ayesha",
      initials: "A",
      date: "2026-08-28",
      createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      acknowledgedAt: new Date().toISOString(),
      createdBy: "Ayesha",
      status: "In Progress",
      subtasks: "0/3 subtasks",
      comments: 1,
      tags: ["Auth", "Security"]
    }
  ];

  const [tasks, setTasks] = useState<Task[]>(initialDummyTasks);

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
          subtasks: t.subtasks || "0/2 subtasks",
          comments: t.comments || 0,
          tags: t.tags || ["Task"]
        }));

        setTasks(() => {
          const apiTitles = new Set(mappedData.map((t) => t.title));
          const filteredDummy = initialDummyTasks.filter((t) => !apiTitles.has(t.title));
          return [...filteredDummy, ...mappedData];
        });
      }
    } catch (err) {
      console.error("Failed to load tasks from API:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Edit form states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDate, setEditDate] = useState("");

  const columnsConfig = [
    { title: "Pending", accent: "#E0A23B", bg: "#FFF9EE" },
    { title: "In Progress", accent: "#3B82D8", bg: "#EFF6FD" },
    { title: "Completed", accent: "#2FAE7D", bg: "#EEFAF3" },
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

  // Helper: Format Time Delays
  const formatDelay = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return "No delay";
    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) return `${days}d ${remainingHours}h delay`;
    if (hours > 0) return `${hours}h ${mins}m delay`;
    return `${mins}m delay`;
  };

  // Helper: Get Due Date Status / Delay
  const getDueDateAlert = (dueDateStr: string, status: string) => {
    if (status === "Completed") return null;
    const dueDate = new Date(dueDateStr + "T23:59:59");
    const diffMs = dueDate.getTime() - now.getTime();

    if (diffMs < 0) {
      const pastTime = new Date(dueDateStr + "T00:00:00");
      return {
        type: "overdue",
        message: `🔴 Delayed by ${formatDelay(pastTime, now)}`
      };
    }

    const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
    if (hoursLeft <= 12) {
      return {
        type: "approaching",
        message: `🟡 Due in ${hoursLeft} hours`
      };
    }

    return null;
  };

  // Handle Acknowledgement Action
  const handleAcknowledge = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents opening modal when clicking acknowledge button
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, acknowledgedAt: new Date().toISOString() } : t
      )
    );
  };

  // Filter tasks based on search query
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

    const newLocalTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      initials: newAssignee.charAt(0),
      createdAt: new Date().toISOString(),
      acknowledgedAt: null,
      createdBy: "Ayesha",
      subtasks: "0/3 subtasks",
      comments: 0,
      tags: ["New"],
    };

    setTasks((prev) => [...prev, newLocalTask]);
    setNewTitle("");
    setNewDescription("");
    setIsFormOpen(false);

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskData),
      });
      fetchTasks();
    } catch (err) {
      console.error("Task API save error", err);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (!taskId) return;

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
    setDraggedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FB]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[26px] font-bold text-[#1F1B3A] tracking-tight">Tasks Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3AFC9] text-sm">⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="text-sm pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A] w-56 focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0] transition-shadow"
              />
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#4F3FF0] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#4335D6] hover:shadow-lg hover:shadow-[#4F3FF0]/25 transition-all flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span> Add Task
            </button>
          </div>
        </div>
        <p className="text-sm text-[#8B87A8] mb-7">
          {completedTasks} of {totalTasks} tasks completed this week
        </p>

        {/* Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columnsConfig.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.title);
            return (
              <div
                key={col.title}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.title)}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-t-xl border border-b-0"
                  style={{ backgroundColor: col.bg, borderColor: "#EDEBF5" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.accent }} />
                    <span className="text-[12px] font-bold tracking-wide uppercase" style={{ color: col.accent }}>
                      {col.title}
                    </span>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#EDEBF5]"
                      style={{ color: col.accent }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-t-0 border-[#EDEBF5] rounded-b-xl p-3 flex flex-col gap-3 min-h-[400px]">
                  {colTasks.map((task, i) => {
                    const dueAlert = getDueDateAlert(task.date, task.status);
                    const isUnacknowledged = !task.acknowledgedAt && task.status !== "Completed";

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className={`group rounded-xl p-4 border transition-all cursor-grab active:cursor-grabbing relative ${
                          isUnacknowledged
                            ? "border-red-300 bg-red-50/20 shadow-sm"
                            : "border-[#EEEDF6] hover:border-[#C9C4EE] hover:shadow-[0_8px_20px_-8px_rgba(79,63,240,0.2)] hover:-translate-y-0.5 bg-white"
                        }`}
                      >
                        <span
                          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: col.accent }}
                        />

                        {/* 1. Unacknowledged Alert Banner */}
                        {isUnacknowledged && (
                          <div className="mb-3 p-2.5 bg-red-100 border border-red-200 rounded-lg flex flex-col gap-2">
                            <span className="text-[11px] font-semibold text-red-700">
                              ⚠️ Action Required: Please Acknowledge!
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-red-600">
                                Delay: {formatDelay(new Date(task.createdAt), now)}
                              </span>
                              <button
                                onClick={(e) => handleAcknowledge(e, task.id)}
                                className="text-[10px] bg-red-600 text-white font-semibold px-2 py-0.5 rounded hover:bg-red-700 transition-colors"
                              >
                                Acknowledge Task
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Priority Tag & Badges */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${priorityStyle[task.priority] || "bg-gray-100 text-gray-700"}`}>
                            {task.priority || "Medium"}
                          </span>
                          {task.tags && (
                            <div className="flex gap-1">
                              {task.tags.map((tag, idx) => (
                                <span key={idx} className="text-[10px] bg-[#F1F0F9] text-[#6B6884] font-medium px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <p className="text-[14px] font-semibold text-[#1F1B3A] mb-1 leading-snug">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[12px] text-[#8B87A8] line-clamp-2 mb-3 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* 2. Due Date / Overdue Delay Alert */}
                        {dueAlert && (
                          <div
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md mb-3 ${
                              dueAlert.type === "overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {dueAlert.message}
                          </div>
                        )}

                        {/* Task Sub-details */}
                        <div className="flex items-center gap-3 text-[11px] text-[#B3AFC9] font-medium mb-3">
                          {task.subtasks && <span>☑ {task.subtasks}</span>}
                          {task.comments !== undefined && <span>💬 {task.comments}</span>}
                        </div>

                        {/* Footer: Assignee & Date */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-[#F2F1F8]">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{
                                backgroundColor: avatarPalette[i % avatarPalette.length].bg,
                                color: avatarPalette[i % avatarPalette.length].text,
                              }}
                            >
                              {task.initials}
                            </div>
                            <span className="text-[12px] text-[#6B6884] font-medium">{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[11.5px] text-[#8B87A8] font-medium">📅 {task.date}</span>
                            {task.acknowledgedAt && (
                              <span className="text-green-600 text-xs font-bold" title="Acknowledged">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="text-[12.5px] text-[#B3AFC9] hover:text-[#4F3FF0] font-medium py-2.5 text-center border border-dashed border-[#E3E1EF] rounded-xl hover:border-[#4F3FF0]/40 transition-all flex items-center justify-center gap-1 mt-1"
                  >
                    <span>+ Add Task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1F1B3A]">Add New Task</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#B3AFC9] hover:text-[#1F1B3A] text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <label className="text-xs font-semibold text-[#8B87A8] block mb-1.5">Title</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Design employee login flow"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-[#E3E1EF] mb-4 bg-white text-[#1F1B3A] focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0]"
            />

            <label className="text-xs font-semibold text-[#8B87A8] block mb-1.5">Description</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Provide specific details about this task..."
              rows={3}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-[#E3E1EF] mb-4 bg-white text-[#1F1B3A] focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0]"
            />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-[#8B87A8] block mb-1.5">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A] focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0]"
                >
                  <option value="Nadia">Nadia</option>
                  <option value="Ayesha">Ayesha</option>
                  <option value="Ifza">Ifza</option>
                  <option value="Ali">Ali</option>
                  <option value="Usman">Usman</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B87A8] block mb-1.5">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A] focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0]"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs font-semibold text-[#8B87A8] block mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A] focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B87A8] block mb-1.5">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A] focus:outline-none focus:ring-2 focus:ring-[#4F3FF0]/15 focus:border-[#4F3FF0]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 text-sm font-medium text-[#8B87A8] border border-[#E3E1EF] py-2.5 rounded-lg hover:bg-[#F6F5FB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 text-sm font-medium text-white bg-[#4F3FF0] py-2.5 rounded-lg hover:bg-[#4335D6] transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details & Edit View Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedTask(null);
            setIsEditing(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#8B87A8]">
                {selectedTask.status}
              </span>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => handleOpenEdit(selectedTask)}
                    className="text-xs bg-[#4F3FF0]/10 text-[#4F3FF0] font-semibold px-2.5 py-1 rounded-lg hover:bg-[#4F3FF0]/20 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditing(false);
                  }}
                  className="text-[#B3AFC9] hover:text-[#1F1B3A] text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#1F1B3A] mb-2">Edit Task Details</h2>

                <div>
                  <label className="text-xs font-semibold text-[#8B87A8] block mb-1">Title</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#8B87A8] block mb-1">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A] h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-[#8B87A8] block mb-1">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full text-sm px-2.5 py-2 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8B87A8] block mb-1">Assignee</label>
                    <select
                      value={editAssignee}
                      onChange={(e) => setEditAssignee(e.target.value)}
                      className="w-full text-sm px-2.5 py-2 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A]"
                    >
                      <option value="Nadia">Nadia</option>
                      <option value="Ayesha">Ayesha</option>
                      <option value="Ifza">Ifza</option>
                      <option value="Ali">Ali</option>
                      <option value="Usman">Usman</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-[#8B87A8] block mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full text-sm px-2.5 py-2 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8B87A8] block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full text-sm px-2.5 py-2 rounded-lg border border-[#E3E1EF] bg-white text-[#1F1B3A]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 text-sm font-medium text-[#8B87A8] border border-[#E3E1EF] py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTask}
                    className="flex-1 text-sm font-medium text-white bg-[#4F3FF0] py-2 rounded-lg hover:bg-[#4335D6]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-[#1F1B3A] mb-2">{selectedTask.title}</h2>
                <p className="text-sm text-[#6B6884] mb-4 leading-relaxed">{selectedTask.description}</p>

                <div className="flex flex-col gap-3 mb-5 pt-4 border-t border-[#F2F1F8]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8B87A8] font-medium">Priority</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityStyle[selectedTask.priority]}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8B87A8] font-medium">Assignee</span>
                    <span className="text-sm font-semibold text-[#1F1B3A]">{selectedTask.assignee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8B87A8] font-medium">Due date</span>
                    <span className="text-sm font-semibold text-[#1F1B3A]">{selectedTask.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8B87A8] font-medium">Acknowledgement Status</span>
                    <span className="text-xs font-semibold text-[#1F1B3A]">
                      {selectedTask.acknowledgedAt ? "✓ Acknowledged" : "⚠️ Pending Acknowledgement"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8B87A8] font-medium">Created by</span>
                    <span className="text-sm font-semibold text-[#1F1B3A]">{selectedTask.createdBy || "Ayesha"}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-full text-sm font-medium text-white bg-[#4F3FF0] py-2.5 rounded-lg hover:bg-[#4335D6] transition-colors"
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
