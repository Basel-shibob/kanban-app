"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  verifyToken,
} from "@/lib/api";

const COLUMNS = [
  {
    key: "todo",
    label: "To Do",
    dot: "#8b8f98",
    next: "inprogress",
    nextLabel: "Start",
  },
  {
    key: "inprogress",
    label: "In Progress",
    dot: "#5e6ad2",
    next: "done",
    nextLabel: "Complete",
  },
  {
    key: "done",
    label: "Done",
    dot: "#3fb950",
    next: "inprogress",
    nextLabel: "Reopen",
  },
];

function Column({ col, tasks, onMove, onDelete }) {
  const items = tasks.filter((t) => t.status === col.key);
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: col.dot }}
        />
        <span className="text-sm font-medium text-text">{col.label}</span>
        <span className="text-xs text-faint bg-surface-2 px-1.5 rounded ">
          {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((task) => (
          <div
            key={task._id}
            className="group bg-surface border border-border hover:border-[#2c2d30] rounded-[7px] p-3 transition-colors"
          >
            <p className="text-sm text-text font-medium">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onMove(task._id, col.next)}
                className="text-xs text-muted hover:text-accent transition-colors"
              >
                {col.nextLabel}
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-xs text-faint hover:text-danger transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const isValid = await verifyToken();
      if (!isValid) {
        localStorage.removeItem("token");
        router.push("/login");
      }

      const fetchData = async () => {
        const data = await getTasks(params.id);
        setTasks(data.tasks);
        setLoading(false);
      };
      fetchData();
    };
    checkAuth();
  }, []);

  const handleCreateTask = async () => {
    if (title) {
      await createTask(title, description, params.id);
      setTitle("");
      setDescription("");
      const data = await getTasks(params.id);
      setTasks(data.tasks);
    }
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    const data = await getTasks(params.id);
    setTasks(data.tasks);
  };

  const handleUpdateTask = async (id, status) => {
    await updateTask(id, status);
    const data = await getTasks(params.id);
    setTasks(data.tasks);
  };

  if (loading) return <div className="text-muted p-6 text-sm">Loading…</div>;

  return (
    <>
      <div className="min-h-screen bg-bg text-text">
        <header className="flex items-center gap-3 px-6 h-14 border-b border-border">
          <button
            className="text-muted hover:text-text text-sm transition-colors"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            ← Back
          </button>
          <span className="text-faint">/</span>
          <h1 className="text-sm font-semibold">Board</h1>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-8">
            <input
              placeholder="Task title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              required
              className="bg-surface border border-border focus:border-accent focus:ring-1
              focus:ring-accent text-text placeholder:text-faint text-sm px-3 py-2 rounded-[7px]
              outline-none transition-colors w-48"
            />
            <input
              placeholder="Description (optional)"
              value={description}
              type="text"
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              className="bg-surface border border-border focus:border-accent focus:ring-1 focus:ring-accent text-text placeholder:text-faint text-sm px-3 py-2 rounded-[7px] outline-none
  transition-colors flex-1 max-w-md"
            />
            <button
              type="button"
              onClick={handleCreateTask}
              className="bg-accent hover:bg-[#6872e5] text-white text-sm font-medium px-3 py-2 rounded-[7px] transition-colors whitespace-nowrap"
            >
              Add task
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <Column
                key={col.key}
                col={col}
                tasks={tasks}
                onMove={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
