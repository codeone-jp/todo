import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoItem } from './components/TodoItem';
import { AddTodoModal } from './components/AddTodoModal';
import { FilterBar } from './components/FilterBar';
import { StatsBar } from './components/StatsBar';

export default function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    todos,
    filterStatus, setFilterStatus,
    filterCategory, setFilterCategory,
    filterPriority, setFilterPriority,
    sortBy, setSortBy,
    searchQuery, setSearchQuery,
    categories,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
              </div>
              <p className="text-sm text-gray-500 mt-0.5 ml-10">
                {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              追加
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-4">
          <StatsBar {...stats} />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            onClearCompleted={clearCompleted}
            completedCount={stats.completed}
          />
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              {stats.total === 0 ? (
                <>
                  <p className="text-gray-500 font-medium">タスクはまだありません</p>
                  <p className="text-gray-400 text-sm mt-1">「追加」ボタンで最初のタスクを作りましょう！</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-6 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all text-sm font-medium shadow-sm"
                  >
                    タスクを追加する
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-500 font-medium">条件に一致するタスクがありません</p>
                  <p className="text-gray-400 text-sm mt-1">フィルターを変更してみてください</p>
                </>
              )}
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                existingCategories={categories}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-6">
            {todos.length} 件表示中
          </p>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTodoModal
          onAdd={addTodo}
          onClose={() => setShowAddModal(false)}
          existingCategories={categories}
        />
      )}
    </div>
  );
}
