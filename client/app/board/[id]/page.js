"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  updateTask,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Column from "@/components/Column";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const { checking } = useAuth();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );
  const [activeId, setActiveId] = useState(null);
  const activeTask = tasks.find((t) => t.id === activeId);

  useEffect(() => {
    if (checking) return;
    const fetchData = async () => {
      try {
        const data = await getTasks(params.id);
        setTasks(data.tasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [checking]);

  const handleCreateTask = async () => {
    setError("");
    if (!title) return;
    try {
      const data = await createTask(title, description, params.id);
      setTasks([...tasks, data.task]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    setError("");
    const previous = tasks;
    setTasks(tasks.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  };

  const handleUpdateTask = async (id, status) => {
    setError("");
    const previous = tasks;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTask(id, status);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  };

  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskActive = tasks.find((t) => t.id === active.id);
    if (!taskActive) return;

    const overTask = tasks.find((t) => t.id === over.id);
    const destStatus = overTask ? overTask.status : over.id;
    if (!COLUMNS.some((c) => c.key === destStatus)) return;

    const previous = tasks;
    setError("");

    let newDest;

    if (taskActive.status === destStatus) {
      const items = tasks.filter((t) => t.status === destStatus);
      const oldIndex = items.findIndex((t) => t.id === active.id);
      const found = items.findIndex((t) => t.id === over.id);
      const newIndex = found === -1 ? items.length - 1 : found;
      if (oldIndex === newIndex) return;
      newDest = arrayMove(items, oldIndex, newIndex).map((t, i) => ({
        ...t,
        order: i,
      }));
    } else {
      const destItems = tasks.filter((t) => t.status === destStatus);
      const found = destItems.findIndex((t) => t.id === over.id);
      const insertAt = found === -1 ? destItems.length : found;
      newDest = [
        ...destItems.slice(0, insertAt),
        { ...taskActive, status: destStatus },
        ...destItems.slice(insertAt),
      ].map((t, i) => ({ ...t, order: i }));
    }

    const untouched = tasks.filter(
      (t) => t.status !== destStatus && t.id !== active.id,
    );
    setTasks([...untouched, ...newDest]);

    try {
      await reorderTasks(
        params.id,
        destStatus,
        newDest.map((t) => t.id),
      );
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  };

  if (checking || loading)
    return <div className="text-muted p-6 text-sm">Loading…</div>;

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
          {error && <p className="text-danger text-sm mb-4">{error}</p>}
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
          <DndContext
            onDragStart={(e) => setActiveId(e.active.id)}
            collisionDetection={closestCorners}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <DragOverlay>
              {activeTask ? (
                <div className="bg-surface border border-accent rounded-[7px] p-3">
                  <p className="text-sm text-text font-medium">
                    {activeTask.title}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
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
          </DndContext>
        </div>
      </div>
    </>
  );
}
