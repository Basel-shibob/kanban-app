"use client";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Column({ col, tasks, onMove, onDelete }) {
  const items = tasks.filter((t) => t.status === col.key);
  const { setNodeRef } = useDroppable({ id: col.key });
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
      <SortableContext
        items={items.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-2">
          {items.length === 0 && <p className="text-faint text-sm">No tasks</p>}
          {items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              nextLabel={col.nextLabel}
              onMove={() => onMove(task.id, col.next)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
