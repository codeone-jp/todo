import type { FilterStatus, SortBy } from '../types';

interface Props {
  filterStatus: FilterStatus;
  setFilterStatus: (v: FilterStatus) => void;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterPriority: string;
  setFilterPriority: (v: string) => void;
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categories: string[];
  onClearCompleted: () => void;
  completedCount: number;
}

export function FilterBar({
  filterStatus, setFilterStatus,
  filterCategory, setFilterCategory,
  filterPriority, setFilterPriority,
  sortBy, setSortBy,
  searchQuery, setSearchQuery,
  categories,
  onClearCompleted,
  completedCount,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {(['all', 'active', 'completed'] as FilterStatus[]).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterStatus === status
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status === 'all' ? 'すべて' : status === 'active' ? '未完了' : '完了済み'}
          </button>
        ))}
      </div>

      {/* Second row: category, priority, sort */}
      <div className="grid grid-cols-3 gap-2">
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c === 'all' ? 'カテゴリー: すべて' : c}
            </option>
          ))}
        </select>

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="all">優先度: すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="createdAt">作成日順</option>
          <option value="dueDate">期限日順</option>
          <option value="priority">優先度順</option>
        </select>
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="w-full py-2 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-dashed border-red-200 hover:border-red-300"
        >
          完了済み {completedCount} 件を削除
        </button>
      )}
    </div>
  );
}
