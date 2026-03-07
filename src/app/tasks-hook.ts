import { useState, useCallback } from "react";
import type { Task } from "@/core/calendar-layout";

const generateId = () => crypto.randomUUID();

// Get current month and year for initial tasks
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const INITIAL_TASKS: Task[] = [
  { id: "init-1", title: "Immovable Task", description: "Cannot be moved", day: 4, month: currentMonth, year: currentYear, mutable: false },
  { id: "init-2", title: "Mutable Task 1", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
  { id: "init-3", title: "Mutable Task 2", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
  { id: "init-4", title: "Mutable Task 3", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
  { id: "init-5", title: "Mutable Task 4", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
  { id: "init-6", title: "Mutable Task 5", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
  { id: "init-7", title: "Mutable Task 6", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
  { id: "init-8", title: "Mutable Task 7", description: "Can be moved", day: 4, month: currentMonth, year: currentYear, mutable: true },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = useCallback((day: number, month: number, year: number, title: string, description: string) => {
    const newTask: Task = {
      id: generateId(),
      title: title.trim() || "Untitled",
      description: description.trim(),
      day,
      month,
      year,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, title: string, description: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, title: title.trim() || "Untitled", description: description.trim() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newDay: number, newMonth: number, newYear: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, day: newDay, month: newMonth, year: newYear } : task))
    );
  }, []);

  const reorderTasks = useCallback((day: number, fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const dayTasks = prev.filter((task) => task.day === day);
      const otherTasks = prev.filter((task) => task.day !== day);
      const reorderedDayTasks = [...dayTasks];
      const [movedTask] = reorderedDayTasks.splice(fromIndex, 1);
      reorderedDayTasks.splice(toIndex, 0, movedTask);
      return [...otherTasks, ...reorderedDayTasks];
    });
  }, []);

  const getTasksForDay = useCallback(
    (day: number, month: number, year: number) => tasks.filter((task) => task.day === day && task.month === month && task.year === year),
    [tasks]
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getTasksForDay,
  };
};
