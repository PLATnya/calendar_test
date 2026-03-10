'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useCalendarLayout } from './calendar-layout-hook';
import { useTasks } from './tasks-hook';
import type { Task } from '@/core/calendar-layout';
import {
  PageWrapper,
  MainContainer,
  LoadingOverlay,
  LoadingContainer,
  Spinner,
  LoadingText,
  Header,
  HeaderLeft,
  Title,
  FilterInput,
  HeaderRight,
  NavButton,
  CalendarSection,
  WeekDaysGrid,
  WeekDayHeader,
  DaysGrid,
  EmptyCell,
  DayCell,
  DayButton,
  TasksContainer,
  TasksList,
  TaskItem,
  TaskOverlay,
  TaskForm,
  TaskInput,
  TaskTextArea,
  TaskButtonGroup,
  TaskButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
} from '@/styles/CalendarStyles';

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
  const {
    tasks,
    isLoading,
    lastVisitedYear,
    changeYear,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
  } = useTasks();
  const [filterText, setFilterText] = useState('');
  const filteredTasks = useMemo(
    () =>
      filterText
        ? tasks.filter((task) => task.title.toLowerCase().includes(filterText.toLowerCase()))
        : tasks,
    [tasks, filterText]
  );
  const {
    weekDays,
    monthLabel,
    cells,
    currentMonth,
    currentYear,
    goToPreviousMonth,
    goToNextMonth,
  } = useCalendarLayout(filteredTasks);

  // Fetch holidays when year changes
  useEffect(() => {
    if (currentYear !== lastVisitedYear) {
      changeYear(currentYear);
    }
  }, [currentYear, lastVisitedYear, changeYear]);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<EditingTask>(null);
  const [addingTask, setAddingTask] = useState<AddingTask>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const closeAll = () => {
    taskRefs.current.clear();
    setSelectedDay(null);
    setEditingTask(null);
    setAddingTask(null);
  };
  const handleGoToPreviousMonth = () => {
    closeAll();
    goToPreviousMonth();
  };

  const handleGoToNextMonth = () => {
    closeAll();
    goToNextMonth();
  };

  const handleStartAddTask = (day: number, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const parentRect = target.offsetParent?.getBoundingClientRect();
    if (parentRect) {
      setAddingTask({
        day,
        position: {
          top: e.clientY - parentRect.top,
          left: rect.left - parentRect.left,
          width: rect.width,
        },
      });
    }
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleSaveNewTask = () => {
    if (addingTask && (newTaskTitle.trim() || newTaskDescription.trim())) {
      addTask(addingTask.day, currentMonth, currentYear, newTaskTitle, newTaskDescription);
    }
    setAddingTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleCancelAddTask = () => {
    setAddingTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleStartEditTask = (task: Task, day: number) => {
    // Don't allow editing immutable tasks
    if (task.mutable === false) return;

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
      // Don't allow saving edits to immutable tasks
      if (editingTask.task.mutable === false) {
        setEditingTask(null);
        return;
      }

      // Only update if there are actual changes
      const originalTask = tasks.find((t) => t.id === editingTask.task.id);
      const hasChanges =
        !originalTask ||
        originalTask.title !== editingTask.task.title ||
        originalTask.description !== editingTask.task.description;

      if (hasChanges) {
        updateTask(editingTask.task.id, editingTask.task.title, editingTask.task.description);
      }
      setEditingTask(null);
    }
  };

  const handleCancelEditTask = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (editingTask) {
      // Don't allow deleting immutable tasks
      if (editingTask.task.mutable === false) {
        setEditingTask(null);
        return;
      }
      deleteTask(editingTask.task.id);
      setEditingTask(null);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOverTask = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(day);
  };

  const handleDragOver = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(day);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent, targetDay: number, targetIndex?: number) => {
    e.preventDefault();
    setDragOverDay(null);

    if (!draggedTask) return;

    // Determine if this is a reorder (same day) or move (different day)
    if (draggedTask.day === targetDay && targetIndex !== undefined) {
      const currentTasks = tasks.filter(
        (t) => t.day === targetDay && t.month === currentMonth && t.year === currentYear
      );
      const currentIndex = currentTasks.findIndex((t) => t.id === draggedTask.id);
      if (currentIndex !== -1 && currentIndex !== targetIndex) {
        reorderTasks(targetDay, currentMonth, currentYear, currentIndex, targetIndex);
      }
    } else if (draggedTask.day !== targetDay) {
      // Moving to a different day
      moveTask(draggedTask.id, targetDay, currentMonth, currentYear);
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverDay(null);
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
    <PageWrapper>
      <MainContainer>
        {isLoading && (
          <LoadingOverlay>
            <LoadingContainer>
              <Spinner />
              <LoadingText>Loading tasks...</LoadingText>
            </LoadingContainer>
          </LoadingOverlay>
        )}

        <Header>
          <HeaderLeft>
            <Title>{monthLabel}</Title>
            <FilterInput
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter tasks..."
            />
          </HeaderLeft>

          <HeaderRight>
            <NavButton type="button" onClick={handleGoToPreviousMonth}>
              Previous
            </NavButton>
            <NavButton type="button" onClick={handleGoToNextMonth}>
              Next
            </NavButton>
          </HeaderRight>
        </Header>

        <CalendarSection>
          <WeekDaysGrid>
            {weekDays.map((weekDay) => (
              <WeekDayHeader key={weekDay}>{weekDay}</WeekDayHeader>
            ))}
          </WeekDaysGrid>

          <DaysGrid>
            {cells.map((cell) =>
              cell.type === 'empty' ? (
                <EmptyCell key={cell.key} />
              ) : (
                <DayCell
                  key={cell.key}
                  $isToday={cell.isToday}
                  $isDragOver={dragOverDay === cell.day}
                  $isSelected={selectedDay === cell.day}
                  onDragOver={(e) => handleDragOver(e, cell.day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cell.day)}
                >
                  <DayButton
                    type="button"
                    onClick={(e) => {
                      if (e.target !== e.currentTarget) return;
                      handleStartAddTask(cell.day, e);
                    }}
                  >
                    {cell.day}
                  </DayButton>

                  {/* Tasks list */}
                  <TasksContainer>
                    <TasksList
                      onClick={(e) => {
                        if (e.target !== e.currentTarget) return;
                        handleStartAddTask(cell.day, e);
                      }}
                    >
                      {cell.tasks.map((task, index) => {
                        const isMutable = task.mutable ?? true;
                        return (
                          <TaskItem
                            key={task.id}
                            ref={(el) => {
                              if (el) taskRefs.current.set(task.id, el);
                              else taskRefs.current.delete(task.id);
                            }}
                            draggable={isMutable}
                            onDragStart={(e) => handleDragStart(e, task)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOverTask(e, cell.day)}
                            onDrop={(e) => handleDrop(e, cell.day, index)}
                            onClick={() => handleStartEditTask(task, cell.day)}
                            $isMutable={isMutable}
                            $isDragging={draggedTask?.id === task.id}
                            title={`${task.title}${task.description ? `\n${task.description}` : ''}`}
                          >
                            {task.title}
                          </TaskItem>
                        );
                      })}
                    </TasksList>
                  </TasksContainer>

                  {/* Edit overlay - positioned at task location */}
                  {editingTask?.day === cell.day && (
                    <TaskOverlay
                      className="task-edit-overlay"
                      style={{
                        top: editingTask.position.top,
                        left: editingTask.position.left,
                        width: editingTask.position.width,
                      }}
                    >
                      <TaskForm
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEditTask();
                          }
                        }}
                      >
                        <TaskInput
                          type="text"
                          value={editingTask.task.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              task: { ...editingTask.task, title: e.target.value },
                            })
                          }
                          placeholder="Task title"
                          autoFocus
                        />
                        <TaskTextArea
                          value={editingTask.task.description}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              task: { ...editingTask.task, description: e.target.value },
                            })
                          }
                          placeholder="Description (optional)"
                          rows={2}
                        />
                        <TaskButtonGroup>
                          <TaskButton onClick={handleSaveEditTask} $variant="primary">
                            Save
                          </TaskButton>
                          <TaskButton onClick={handleDeleteTask} $variant="danger">
                            Delete
                          </TaskButton>
                        </TaskButtonGroup>
                      </TaskForm>
                    </TaskOverlay>
                  )}

                  {/* Add task overlay */}
                  {!editingTask && addingTask?.day === cell.day && (
                    <TaskOverlay
                      className="task-add-overlay"
                      style={{
                        top: addingTask.position.top,
                        left: addingTask.position.left,
                        width: addingTask.position.width,
                      }}
                    >
                      <TaskForm
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveNewTask();
                          }
                        }}
                      >
                        <TaskInput
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Task title"
                          autoFocus
                        />
                        <TaskTextArea
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          placeholder="Description (optional)"
                          rows={2}
                        />
                        <TaskButtonGroup>
                          <TaskButton onClick={handleSaveNewTask} $variant="primary">
                            Add
                          </TaskButton>
                        </TaskButtonGroup>
                      </TaskForm>
                    </TaskOverlay>
                  )}
                </DayCell>
              )
            )}
          </DaysGrid>
        </CalendarSection>

        {selectedDay !== null && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>
                  {selectedDay} {monthLabel}
                </ModalTitle>
                <CloseButton type="button" onClick={() => setSelectedDay(null)}>
                  Close
                </CloseButton>
              </ModalHeader>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContainer>
    </PageWrapper>
  );
}
