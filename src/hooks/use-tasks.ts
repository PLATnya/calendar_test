'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Task } from '@/core/calendar-layout';

// Get current year for initial tasks
const now = new Date();
const currentYear = now.getFullYear();

// Fetch Ukraine public holidays for a given year and create immutable tasks
const fetchHolidayTasks = async (year: number): Promise<Task[]> => {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ua`);
    if (!response.ok) {
      console.error('Failed to fetch holidays:', response.status);
      return [];
    }
    const holidays = await response.json();
    return holidays.map((holiday: { date: string; localName: string; name: string }) => {
      const [year, month, day] = holiday.date.split('-').map(Number);
      return {
        id: `holiday-${holiday.date}`,
        title: holiday.localName,
        description: holiday.name,
        day,
        month: month - 1, // Convert to 0-based month
        year,
        mutable: false,
        order: 0,
      };
    });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

// Fetch tasks from MongoDB API
const fetchDbTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      console.error('Failed to fetch tasks from API:', response.status);
      return [];
    }
    const tasks = await response.json();
    // Map _id to id for UI compatibility and convert month to 0-based
    return tasks.map(
      (task: {
        _id: string;
        title: string;
        description: string;
        day: number;
        month: number;
        year: number;
        mutable?: boolean;
        order?: number;
      }) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        day: task.day,
        month: task.month - 1, // Convert to 0-based month
        year: task.year,
        mutable: task.mutable ?? true,
        order: task.order ?? 0,
      })
    );
  } catch (error) {
    console.error('Error fetching tasks from API:', error);
    return [];
  }
};

// Create a new task in MongoDB
const createDbTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        day: task.day,
        month: task.month + 1, // Convert back to 1-based for API
        year: task.year,
        mutable: task.mutable,
      }),
    });
    if (!response.ok) {
      console.error('Failed to create task:', response.status);
      return null;
    }
    const createdTask = await response.json();
    // Map _id to id and convert month to 0-based
    return {
      id: createdTask._id,
      title: createdTask.title,
      description: createdTask.description,
      day: createdTask.day,
      month: createdTask.month - 1,
      year: createdTask.year,
      mutable: createdTask.mutable,
      order: createdTask.order ?? 0,
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

// Update a task in MongoDB (title and description only)
const updateDbTask = async (id: string, title: string, description: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
      console.error('Failed to update task:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

// Move a task in MongoDB (update day, month, year)
const moveDbTask = async (
  id: string,
  newDay: number,
  newMonth: number,
  newYear: number
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: newDay,
        month: newMonth + 1, // Convert to 1-based for API
        year: newYear,
      }),
    });
    if (!response.ok) {
      console.error('Failed to move task:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error moving task:', error);
    return false;
  }
};

// Delete a task from MongoDB
const deleteDbTask = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error('Failed to delete task:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

// Reorder tasks in MongoDB (batch update)
const reorderDbTasks = async (
  day: number,
  month: number,
  year: number,
  taskOrders: { id: string; order: number }[]
): Promise<boolean> => {
  try {
    const response = await fetch('/api/tasks/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day,
        month: month + 1, // Convert to 1-based for API
        year,
        taskOrders,
      }),
    });
    if (!response.ok) {
      console.error('Failed to reorder tasks:', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return false;
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisitedYear, setLastVisitedYear] = useState<number>(() => currentYear);
  const isInitialized = useRef(false);

  // Fetch holidays for a given year and replace immutable tasks
  const changeYear = useCallback(
    async (year: number) => {
      if (year === lastVisitedYear) return;

      const holidayTasks = await fetchHolidayTasks(year);

      setTasks((prev) => {
        // Remove immutable tasks (holidays from previous year) and keep DB tasks
        const mutableTasks = prev.filter((task) => task.mutable !== false);
        // Add new holiday tasks for the new year
        return [...holidayTasks, ...mutableTasks];
      });

      setLastVisitedYear(year);
    },
    [lastVisitedYear]
  );

  // Initial load: fetch DB tasks and holidays
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initTasks = async () => {
      setIsLoading(true);
      try {
        // Fetch both DB tasks and holidays in parallel
        const [dbTasks, holidayTasks] = await Promise.all([
          fetchDbTasks(),
          fetchHolidayTasks(currentYear),
        ]);
        // Combine holiday tasks (immutable) with DB tasks (mutable)
        setTasks([...holidayTasks, ...dbTasks]);
      } catch (error) {
        console.error('Error initializing tasks:', error);
        // Fallback to just holidays if DB fails
        const holidayTasks = await fetchHolidayTasks(currentYear);
        setTasks(holidayTasks);
      } finally {
        setIsLoading(false);
      }
    };
    initTasks();
  }, []);

  const addTask = useCallback(
    async (day: number, month: number, year: number, title: string, description: string) => {
      // Get the highest order for tasks on this day
      const dayTasks = tasks.filter(
        (task) => task.day === day && task.month === month && task.year === year
      );
      const maxOrder = dayTasks.reduce((max, task) => Math.max(max, task.order ?? 0), -1);
      const newOrder = maxOrder + 1;

      const newTask: Task = {
        id: '', // Will be set after API response
        title: title.trim() || 'Untitled',
        description: description.trim(),
        day,
        month,
        year,
        mutable: true,
        order: newOrder,
      };

      // Optimistically add to local state first
      const tempId = `temp-${Date.now()}`;
      const optimisticTask: Task = { ...newTask, id: tempId };
      setTasks((prev) => [...prev, optimisticTask]);

      // Then call API
      const createdTask = await createDbTask(newTask);
      if (createdTask) {
        // Replace optimistic task with actual task from DB
        setTasks((prev) => prev.map((t) => (t.id === tempId ? createdTask : t)));
        return createdTask;
      } else {
        // Remove optimistic task if API failed
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
        return null;
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id: string, title: string, description: string) => {
      // Skip immutable tasks
      const task = tasks.find((t) => t.id === id);
      if (!task || task.mutable === false) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, title: title.trim() || 'Untitled', description: description.trim() }
            : t
        )
      );

      // Call API (skip for holiday tasks)
      if (!id.startsWith('holiday-')) {
        await updateDbTask(id, title, description);
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      // Skip immutable tasks
      const task = tasks.find((t) => t.id === id);
      if (!task || task.mutable === false) return;

      // Optimistic delete
      setTasks((prev) => prev.filter((t) => t.id !== id));

      // Call API (skip for holiday tasks)
      if (!id.startsWith('holiday-')) {
        await deleteDbTask(id);
      }
    },
    [tasks]
  );

  const moveTask = useCallback(
    async (id: string, newDay: number, newMonth: number, newYear: number) => {
      // Skip immutable tasks
      const task = tasks.find((t) => t.id === id);
      if (!task || task.mutable === false) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, day: newDay, month: newMonth, year: newYear } : t))
      );

      // Call API (skip for holiday tasks)
      if (!id.startsWith('holiday-')) {
        await moveDbTask(id, newDay, newMonth, newYear);
      }
    },
    [tasks]
  );

  const reorderTasks = useCallback(
    async (day: number, month: number, year: number, fromIndex: number, toIndex: number) => {
      // Get tasks for this day before reordering
      const dayTasks = tasks.filter(
        (task) => task.day === day && task.month === month && task.year === year
      );
      const mutableDayTasks = dayTasks.filter((task) => task.mutable !== false);

      if (mutableDayTasks.length === 0) return;

      // Validate indices are within bounds
      if (
        fromIndex < 0 ||
        fromIndex >= mutableDayTasks.length ||
        toIndex < 0 ||
        toIndex >= mutableDayTasks.length
      ) {
        return;
      }

      // Reorder locally first (optimistic update)
      const reorderedDayTasks = [...mutableDayTasks];
      const [movedTask] = reorderedDayTasks.splice(fromIndex, 1);
      reorderedDayTasks.splice(toIndex, 0, movedTask);

      // Update order values for all mutable tasks
      const reorderedWithOrder = reorderedDayTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      setTasks((prev) => {
        const otherTasks = prev.filter(
          (t) => !(t.day === day && t.month === month && t.year === year && t.mutable !== false)
        );
        return [...otherTasks, ...reorderedWithOrder];
      });

      // Persist to database (skip for holiday tasks)
      const taskOrders = reorderedDayTasks
        .filter((task) => !task.id.startsWith('holiday-'))
        .map((task, index) => ({ id: task.id, order: index }));

      if (taskOrders.length > 0) {
        await reorderDbTasks(day, month, year, taskOrders);
      }
    },
    [tasks]
  );

  const getTasksForDay = useCallback(
    (day: number, month: number, year: number) =>
      tasks.filter((task) => task.day === day && task.month === month && task.year === year),
    [tasks]
  );

  return {
    tasks,
    isLoading,
    lastVisitedYear,
    changeYear,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getTasksForDay,
  };
};
