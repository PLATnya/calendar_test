import { useState, useCallback, useEffect, useRef } from "react";
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

// Fetch Ukraine public holidays for 2026 and create immutable tasks
const fetchHolidayTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2026/ua");
    if (!response.ok) {
      console.error("Failed to fetch holidays:", response.status);
      return [];
    }
    const holidays = await response.json();
    return holidays.map((holiday: { date: string; localName: string; name: string }) => {
      const [year, month, day] = holiday.date.split("-").map(Number);
      return {
        id: `holiday-${holiday.date}`,
        title: holiday.localName,
        description: holiday.name,
        day,
        month: month - 1, // Convert to 0-based month
        year,
        mutable: false,
      };
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isInitialized = useRef(false);

  // Fetch holidays on mount and initialize tasks
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initTasks = async () => {
      const holidayTasks = await fetchHolidayTasks();
      // Combine holiday tasks (immutable) with initial tasks
      setTasks([...holidayTasks, ...INITIAL_TASKS]);
    };
    initTasks();
  }, []);

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
