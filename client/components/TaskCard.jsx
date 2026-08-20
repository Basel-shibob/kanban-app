"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, nextLabel, onMove, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="group bg-surface border border-border hover:border-[#2c2d30] rounded-[7px] p-3 transition-colors"
    >
      <p className="text-sm text-text font-medium">{task.title}</p>
      {task.description && (
        <p className="text-xs text-muted mt-1">{task.description}</p>
      )}
      <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMove}
          className="text-xs text-muted hover:text-accent transition-colors"
        >
          {nextLabel}
        </button>
        <button
          onClick={onDelete}
          className="text-xs text-faint hover:text-danger transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
