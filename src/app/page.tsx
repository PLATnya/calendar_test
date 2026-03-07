"use client";

import { useState, useRef, useEffect } from "react";
import { useCalendarLayout } from "./calendar-layout-hook";
import { useTasks } from "./tasks-hook";
import type { Task } from "@/core/calendar-layout";

type EditingTask = {
  task: Task;
  day: number;
  position: { top: number; left: number; width: number };
} | null;

type AddingTask = {
  day: number;
  position: { top: number; left: number; width: number };
} | null;

export default function Home() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, reorderTasks } = useTasks();
  const [filterText, setFilterText] = useState("");
  const filteredTasks = filterText
    ? tasks.filter((task) => task.title.toLowerCase().includes(filterText.toLowerCase()))
    : tasks;
  const { weekDays, monthLabel, cells, goToPreviousMonth, goToNextMonth } =
    useCalendarLayout(filteredTasks);
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<EditingTask>(null);
  const [addingTask, setAddingTask] = useState<AddingTask>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const addButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const handleGoToPreviousMonth = () => {
    setSelectedDay(null);
    setEditingTask(null);
    setAddingTask(null);
    goToPreviousMonth();
  };

  const handleGoToNextMonth = () => {
    setSelectedDay(null);
    setEditingTask(null);
    setAddingTask(null);
    goToNextMonth();
  };

  const handleStartAddTask = (day: number) => {
    const addButton = addButtonRefs.current.get(day);
    if (addButton) {
      const rect = addButton.getBoundingClientRect();
      const parentRect = addButton.offsetParent?.getBoundingClientRect();
      if (parentRect) {
        setAddingTask({
          day,
          position: {
            top: rect.top - parentRect.top,
            left: rect.left - parentRect.left,
            width: rect.width,
          },
        });
      }
    }
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleSaveNewTask = () => {
    if (addingTask && (newTaskTitle.trim() || newTaskDescription.trim())) {
      addTask(addingTask.day, newTaskTitle, newTaskDescription);
    }
    setAddingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleCancelAddTask = () => {
    setAddingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleStartEditTask = (task: Task, day: number) => {
    const taskElement = taskRefs.current.get(task.id);
    if (taskElement) {
      const rect = taskElement.getBoundingClientRect();
      const parentRect = taskElement.offsetParent?.getBoundingClientRect();
      if (parentRect) {
        setEditingTask({
          task,
          day,
          position: {
            top: rect.top - parentRect.top,
            left: rect.left - parentRect.left,
            width: rect.width,
          },
        });
      }
    }
  };

  const handleSaveEditTask = () => {
    if (editingTask) {
      updateTask(editingTask.task.id, editingTask.task.title, editingTask.task.description);
      setEditingTask(null);
    }
  };

  const handleCancelEditTask = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (editingTask) {
      deleteTask(editingTask.task.id);
      setEditingTask(null);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  };

  const handleDragOverTask = (e: React.DragEvent, day: number, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverDay(day);
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDay(day);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, targetDay: number, targetIndex?: number) => {
    e.preventDefault();
    setDragOverDay(null);
    setDragOverIndex(null);
    
    if (draggedTask) {
      // If dropping on a specific task index, reorder within the same cell
      if (targetIndex !== undefined && draggedTask.day === targetDay) {
        const currentTasks = tasks.filter(t => t.day === targetDay);
        const currentIndex = currentTasks.findIndex(t => t.id === draggedTask.id);
        if (currentIndex !== -1 && currentIndex !== targetIndex) {
          reorderTasks(targetDay, currentIndex, targetIndex);
        }
      } else if (draggedTask.day !== targetDay) {
        // Moving to a different day
        moveTask(draggedTask.id, targetDay);
      }
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverDay(null);
    setDragOverIndex(null);
  };

  // Close overlays when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (editingTask && !target.closest('.task-edit-overlay')) {
        setEditingTask(null);
      }
      if (addingTask && !target.closest('.task-add-overlay')) {
        setAddingTask(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingTask, addingTask]);

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-white to-sky-100 p-3 sm:p-4">
      <main className="relative mx-auto flex h-[calc(100vh-1.5rem)] w-full flex-col rounded-3xl border border-zinc-200/80 bg-white/90 p-4 shadow-xl shadow-zinc-300/20 backdrop-blur sm:h-[calc(100vh-2rem)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {monthLabel}
            </h1>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter tasks..."
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 placeholder-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToPreviousMonth}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleGoToNextMonth}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:gap-3">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weekDays.map((weekDay) => (
              <div
                key={weekDay}
                className="rounded-xl bg-zinc-100 py-2 text-center text-xs font-semibold tracking-wide text-zinc-600 sm:text-sm"
              >
                {weekDay}
              </div>
            ))}
          </div>

          <div className="grid flex-1 auto-rows-fr grid-cols-7 gap-2 sm:gap-3">
            {cells.map((cell) =>
              cell.type === "empty" ? (
                <div
                  key={cell.key}
                  className="rounded-xl border border-transparent bg-transparent"
                  aria-hidden="true"
                />
              ) : (
                <div
                  key={cell.key}
                  onDragOver={(e) => handleDragOver(e, cell.day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cell.day)}
                  className={`relative flex flex-col rounded-xl border p-2 text-sm font-medium transition sm:p-3 sm:text-base ${
                    cell.isToday
                      ? "border-orange-400 bg-orange-100 text-orange-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  } ${
                    dragOverDay === cell.day
                      ? "border-sky-400 bg-sky-100 ring-2 ring-sky-300"
                      : ""
                  } ${
                    selectedDay === cell.day
                      ? "ring-2 ring-sky-300 ring-offset-1"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(cell.day)}
                    className="flex w-full items-start justify-end text-left"
                  >
                    {cell.day}
                  </button>
                  
                  {/* Tasks list */}
                  <div className="h-20 flex flex-col">
                    <div className="overflow-y-scroll min-h-0 flex-1 space-y-2">
                    {cell.tasks.map((task, index) => {
                      const isMutable = task.mutable ?? true;
                      return (
                      <div
                        key={task.id}
                        ref={(el) => {
                          if (el) taskRefs.current.set(task.id, el);
                          else taskRefs.current.delete(task.id);
                        }}
                        draggable={isMutable}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOverTask(e, cell.day, index)}
                        onDrop={(e) => handleDrop(e, cell.day, index)}
                        onClick={() => handleStartEditTask(task, cell.day)}
                        className={`rounded px-1.5 py-0.5 text-xs truncate ${
                          !isMutable 
                            ? "bg-orange-200 cursor-default hover:bg-orange-300" 
                            : "bg-zinc-100 cursor-grab hover:bg-zinc-200 active:cursor-grabbing"
                        } ${
                          draggedTask?.id === task.id ? "opacity-50" : ""
                        } ${editingTask?.task.id === task.id ? "invisible" : ""}`}
                        title={`${task.title}${task.description ? `\n${task.description}` : ""}`}
                      >
                        {task.title}
                      </div>
                      );
                    })}
                    </div>
                  </div>

                  {/* Edit overlay - positioned at task location */}
                  {editingTask?.day === cell.day && (
                    <div
                      className="task-edit-overlay absolute z-30"
                      style={{
                        top: editingTask.position.top,
                        left: editingTask.position.left,
                        width: editingTask.position.width,
                      }}
                    >
                      <div className="rounded-lg border border-sky-300 bg-sky-50 p-2 shadow-lg">
                        <input
                          type="text"
                          value={editingTask.task.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              task: { ...editingTask.task, title: e.target.value },
                            })
                          }
                          className="mb-1 w-full rounded border border-sky-300 px-1 py-0.5 text-xs"
                          placeholder="Task title"
                          autoFocus
                        />
                        <textarea
                          value={editingTask.task.description}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              task: { ...editingTask.task, description: e.target.value },
                            })
                          }
                          className="mb-1 w-full resize-none rounded border border-sky-300 px-1 py-0.5 text-xs"
                          placeholder="Description (optional)"
                          rows={2}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={handleSaveEditTask}
                            className="rounded bg-sky-500 px-1 py-0.5 text-xs text-white hover:bg-sky-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditTask}
                            className="rounded bg-zinc-300 px-1 py-0.5 text-xs text-zinc-700 hover:bg-zinc-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteTask}
                            className="ml-auto rounded bg-red-400 px-1 py-0.5 text-xs text-white hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add task button */}
                  <div className="mt-auto pt-1">
                    <button
                      ref={(el) => {
                        if (el) addButtonRefs.current.set(cell.day, el);
                        else addButtonRefs.current.delete(cell.day);
                      }}
                      type="button"
                      onClick={() => handleStartAddTask(cell.day)}
                      className="w-full rounded border border-solid border-zinc-300 py-0.5 text-xs text-zinc-400 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                    >
                      + Add task
                    </button>
                  </div>

                  {/* Add task overlay */}
                  {addingTask?.day === cell.day && (
                    <div
                      className="task-add-overlay absolute z-30"
                      style={{
                        top: addingTask.position.top,
                        left: addingTask.position.left,
                        width: addingTask.position.width,
                      }}
                    >
                      <div className="rounded-lg border border-sky-300 bg-sky-50 p-2 shadow-lg">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          className="mb-1 w-full rounded border border-sky-300 px-1 py-0.5 text-xs"
                          placeholder="Task title"
                          autoFocus
                        />
                        <textarea
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          className="mb-1 w-full resize-none rounded border border-sky-300 px-1 py-0.5 text-xs"
                          placeholder="Description (optional)"
                          rows={2}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={handleSaveNewTask}
                            className="rounded bg-sky-500 px-1 py-0.5 text-xs text-white hover:bg-sky-600"
                          >
                            Add
                          </button>
                          <button
                            onClick={handleCancelAddTask}
                            className="rounded bg-zinc-300 px-1 py-0.5 text-xs text-zinc-700 hover:bg-zinc-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {selectedDay !== null ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-zinc-900/35 p-4 sm:p-6">
            <section className="w-full max-w-xl rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-lg sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                    {selectedDay} {monthLabel}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="rounded-lg border border-sky-300 bg-white px-3 py-1.5 text-sm font-medium text-sky-800 transition hover:border-sky-400 hover:bg-sky-100"
                >
                  Close
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
