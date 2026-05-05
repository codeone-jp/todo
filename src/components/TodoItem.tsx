import { useState } from 'react';
import type { Todo } from '../types';
import { EditTodoModal } from './EditTodoModal';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  existingCategories: string[];
}

const PRIORITY_CONFIG = {
  high:   { label: '高', bg: 'bg-red-100',   text: 'text-red-600',   dot: 'bg-red-500'   },
  medium: { label: '中', bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
  low:    { label: '低', bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getDueDateStatus(dueDate: string | null, completed: boolean) {
  if (!dueDate || completed) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}日超過`, className: 'text-red-500' };
  if (diff === 0) return { label: '今日まで', className: 'text-orange-500' };
  if (diff <= 3) return { label: `あと${diff}日`, className: 'text-amber-500' };
  return { label: `あと${diff}日`, className: 'text-gray-400' };
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, existingCategories }: Props) {
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const pc = PRIORITY_CONFIG[todo.priority];
  const dueDateStatus = getDueDateStatus(todo.dueDate, todo.completed);

  return (
    <>
      <div className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-md animate-slide-in ${
        todo.completed ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-indigo-200'
      }`}>
        <div className="flex items-start gap-3 p-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              todo.completed
                ? 'bg-indigo-500 border-indigo-500 animate-check-bounce'
                : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <span className={`text-sm font-medium leading-snug break-words ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pc.bg} ${pc.text} flex-shrink-0`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                {pc.label}
              </span>
              {todo.category && (
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium flex-shrink-0">
                  {todo.category}
                </span>
              )}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {todo.dueDate && (
                <span className={`text-xs flex items-center gap-1 ${dueDateStatus?.className ?? 'text-gray-400'}`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(todo.dueDate)}
                  {dueDateStatus && <span>({dueDateStatus.label})</span>}
                </span>
              )}
              {todo.description && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  {expanded ? '▲ 折りたたむ' : '▼ 詳細を見る'}
                </button>
              )}
            </div>

            {/* Expanded description */}
            {expanded && todo.description && (
              <p className="mt-2 text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-3 animate-fade-in">
                {todo.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
              title="編集"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDelete(todo.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  削除
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  戻る
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="削除"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <EditTodoModal
          todo={todo}
          onSave={updates => onUpdate(todo.id, updates)}
          onClose={() => setEditing(false)}
          existingCategories={existingCategories}
        />
      )}
    </>
  );
}
