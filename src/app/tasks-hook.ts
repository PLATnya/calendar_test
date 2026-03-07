import { useState, useCallback } from "react";
import type { Task } from "@/core/calendar-layout";

const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_TASKS: Task[] = [
  { id: "init-1", title: "Immovable Task", description: "Cannot be moved", day: 4, mutable: false },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = useCallback((day: number, title: string, description: string) => {
    const newTask: Task = {
      id: generateId(),
      title: title.trim() || "Untitled",
      description: description.trim(),
      day,
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

  const moveTask = useCallback((id: string, newDay: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, day: newDay } : task))
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
    (day: number) => tasks.filter((task) => task.day === day),
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
