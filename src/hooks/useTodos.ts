import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Todo, Priority, FilterStatus, SortBy } from '../types';

const STORAGE_KEY = 'todo-app-todos';

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  const addTodo = useCallback((
    title: string,
    description: string,
    priority: Priority,
    category: string,
    dueDate: string | null,
  ) => {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      priority,
      category,
      dueDate,
      createdAt: now,
      updatedAt: now,
    };
    setTodos(prev => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const categories = ['all', ...Array.from(new Set(todos.map(t => t.category).filter(Boolean)))];

  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

  const filtered = todos
    .filter(t => {
      if (filterStatus === 'active') return !t.completed;
      if (filterStatus === 'completed') return t.completed;
      return true;
    })
    .filter(t => filterCategory === 'all' || t.category === filterCategory)
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return {
    todos: filtered,
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
  };
}
