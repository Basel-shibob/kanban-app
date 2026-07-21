"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const fetchData = async () => {
      const data = await getTasks(params.id);
      setTasks(data.tasks);
      setLoading(false);
    };
    fetchData();
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

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="bg-gray-800 p-4 flex items-center gap-4">
          <button
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Back
          </button>
          <h4>Board page</h4>
        </div>
        <div className="p-6">
          <input
            name="title"
            placeholder="Title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            name="description"
            placeholder="Add Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* {error && <p>{error}</p>} */}
          <button type="button" onClick={handleCreateTask}>
            add task
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
                {/* Column header */}
                <div className="text-lg font-bold mb-4">To Do</div>

                {/* Filter and map tasks */}
                {tasks
                .filter((task) => task.status === "todo")
                .map((task) => (
                    <div key={task._id} className="bg-gray-700 rounded p-3 mb-3">
                    <p>{task.title}</p>
                    <p>{task.description}</p>
                    <button
                        onClick={() => handleUpdateTask(task._id, "inprogress")}
                        className="bg-blue-500 text-white text-sm rounded p-1 mt-1 hover:bg-blue-600"
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-red-500 text-white text-sm rounded p-1 mt-1 hover:bg-red-600"
                    >
                        Delete Task
                    </button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
                {/* Column header */}
                <div className="text-lg font-bold mb-4">In Progress</div>

                {/* Filter and map tasks */}
                {tasks
                .filter((task) => task.status === "inprogress")
                .map((task) => (
                    <div key={task._id} className="bg-gray-700 rounded p-3 mb-3">
                    <p>{task.title}</p>
                    <p>{task.description}</p>
                    <button
                        onClick={() => handleUpdateTask(task._id, "done")}
                        className="bg-blue-500 text-white text-sm rounded p-1 mt-1 hover:bg-blue-600"
                    >
                        Done
                    </button>
                    <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-red-500 text-white text-sm rounded p-1 mt-1 hover:bg-red-600"
                    >
                        Delete Task
                    </button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
                {/* Column header */}
                <div className="text-lg font-bold mb-4">Done</div>

                {/* Filter and map tasks */}
                {tasks
                .filter((task) => task.status === "done")
                .map((task) => (
                    <div key={task._id} className="bg-gray-700 rounded p-3 mb-3">
                    <p>{task.title}</p>
                    <p>{task.description}</p>
                    <button
                        onClick={() => handleUpdateTask(task._id, "inprogress")}
                        className="bg-blue-500 text-white text-sm rounded p-1 mt-1 hover:bg-blue-600"
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-red-500 text-white text-sm rounded p-1 mt-1 hover:bg-red-600"
                    >
                        Delete Task
                    </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </>
  );
}
