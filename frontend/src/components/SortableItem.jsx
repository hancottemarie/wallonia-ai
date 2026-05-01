import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, city, onRemove, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors"
    >
      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm truncate text-slate-800 dark:text-slate-100">{city.name}</h4>
        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{city.province}</p>
      </div>
      <button
        onPointerDown={(e) => e.stopPropagation()} // Empêche le drag de s'activer quand on veut juste supprimer
        onClick={() => onRemove(city.id)}
        className="text-red-400 hover:text-red-600 text-xs p-2"
      >
        ✕
      </button>
    </div>
  );
}
