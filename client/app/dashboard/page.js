"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBoard, deleteBoard, getBoards } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { checking } = useAuth();

  useEffect(() => {
    if (checking) return;
    const fetchData = async () => {
      try {
        const data = await getBoards();
        setBoards(data.boards);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [checking]);

  const handleCreateBoard = async () => {
    setError("");
    if (!title) return;
    try {
        const data = await createBoard(title);
        setBoards([...boards, data.board])
        setTitle("");
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDeleteBoard = async (id) => {
    setError("");
    const previous = boards;
    setBoards(boards.filter((b) => b.id !== id));
    try {
      await deleteBoard(id);
    } catch (error) {
      setBoards(previous);
      setError(error.message);
    }
  };
  if (checking || loading)
    return <div className="text-muted p-6 text-sm">Loading...</div>;
  return (
    <>
      <div className="min-h-screen bg-bg text-text">
        {/* navbar */}
        <header className="flex justify-between items-center px-6 h-14 border-b border-border">
          <h1 className="text-sm font-semibold">Kanban</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("login");
            }}
            className="text-muted hover:text-text text-sm transition-colors"
          >
            Log out
          </button>
        </header>
        {/* content */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* Create a new board */}
          <div className="flex items-center gap-2 mb-8">
            {error && <p className="text-danger text-sm mb-4">{error}</p>}
            <input
              type="text"
              name="title"
              placeholder="New Board Name"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
              className="bg-surface border border-border focus:border-accent focus:ring-1 focus:ring-accent text-text placeholder:text-faint text-sm px-3 py-2 rounded-[7px] outline-none transition-colors w-64"
            />
            <button
              onClick={handleCreateBoard}
              className="bg-accent hover:bg-[#6872e5] text-white text-sm font-medium px-3 py-2 rounded-[7px] transition-colors"
            >
              Create board
            </button>
          </div>

          <h2 className="text-faint text-xs font-medium uppercase tracking-wide mb-3">
            Your Boards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {!error && boards.length === 0 && (
              <p className="text-faint text-sm">
                No boards yet. Create your first one above.
              </p>
            )}
            {boards.map((board) => (
              <div
                key={board.id}
                className="group bg-surface border border-border hover:border-[#2c2d30] rounded-[7px] p-4 transition-colors"
              >
                <p
                  onClick={() => {
                    router.push(`/board/${board.id}`);
                  }}
                  className="text-text font-medium mb-3 cursor-pointer group-hover:text-accent transition-colors"
                >
                  {board.title}
                </p>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  type="button"
                  className="text-faint hover:text-danger text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
