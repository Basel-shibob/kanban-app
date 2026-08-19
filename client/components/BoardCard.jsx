"use client";
export default function BoardCard({ board, onOpen, onDelete }) {
  return (
    <div
      className="group bg-surface border border-border hover:border-[#2c2d30] rounded-[7px] p-4 transition-colors"
    >
      <p
        onClick={onOpen}
        className="text-text font-medium mb-3 cursor-pointer group-hover:text-accent transition-colors"
      >
        {board.title}
      </p>
      <button
        onClick={onDelete}
        type="button"
        className="text-faint hover:text-danger text-xs transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
