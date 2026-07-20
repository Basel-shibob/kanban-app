"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBoard, deleteBoard, getBoards } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token is:", token);
    if (!token) {
      router.push("/login");
    }
    const fetchData = async () => {
      const data = await getBoards();
      setBoards(data.boards);
      setLoading(false);
    };
    fetchData();
  }, []);
  const handleCreateBoard = async () => {
    if (title) {
      await createBoard(title);
      setTitle("");
      const data = await getBoards();
      setBoards(data.boards);
    }
  };
  const handleDeleteBoard = async (id) => {
    await deleteBoard(id);
    const data = await getBoards();
    setBoards(data.boards);
  };
  if (loading) return <div className="text-white p-4">Loading...</div>;
  return (
    <>
      <div className="bg-gray-900 min-h-screen text-white">
        {/* navbar */}
        <div className="bg-gray-800 flex justify-between items-center p-4">
          <h1 className="">Kanban Board</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("login");
            }}
          >
            logout
          </button>
        </div>
        {/* content */}
        <div className="p-6">
          <h4>Create a new board</h4>
          <div className="flex items-center mb-6">
            <input
              type="text"
              name="title"
              placeholder="New Board"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 text-white rounded p-2 outline-none"
            />
            <button
              onClick={handleCreateBoard}
              className="bg-purple-600 text-white rounded p-2 ml-2 hover:bg-purple-700"
            >
              + Create
            </button>
          </div>

          <h4 className="text-white font-semibold mb-2 cursor-pointer hover:text-purple-400">
            Your Boards
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {boards.map((board) => (
              <div key={board._id} className="bg-gray-700 rounded-lg p-4">
                <p
                  onClick={() => {
                    router.push(`/board/${board._id}`);
                  }}
                  className="text-white font-semibold mb-2 cursor-pointer hover:text-purple-400"
                >
                  {board.title}
                </p>
                <button
                  onClick={() => handleDeleteBoard(board._id)}
                  type="button"
                  className="bg-red-500 text-white text-sm rounded p-1 hover:bg-red-600 mt-2"
                >
                  Delete Board
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
