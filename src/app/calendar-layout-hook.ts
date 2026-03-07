import { useMemo, useState } from "react";
import { getCalendarLayout, type CalendarCell, type Task } from "@/core/calendar-layout";

export type { CalendarCell, Task };

export const useCalendarLayout = (tasks: Task[] = []) => {
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const baseLayout = getCalendarLayout(year, month);
    
    // Map tasks to cells - filter by month and year in addition to day
    const cells = baseLayout.cells.map((cell) => {
      if (cell.type === "day") {
        const dayTasks = tasks.filter((task) => 
          task.day === cell.day && 
          task.month === month && 
          task.year === year
        );
        // Sort: non-mutable tasks first, then mutable tasks
        dayTasks.sort((a, b) => {
          const aMutable = a.mutable ?? true;
          const bMutable = b.mutable ?? true;
          if (!aMutable && bMutable) return -1;
          if (aMutable && !bMutable) return 1;
          return 0;
        });
        return {
          ...cell,
          tasks: dayTasks,
        };
      }
      return cell;
    });
    
    return {
      ...baseLayout,
      cells,
    };
  }, [currentMonth, tasks]);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1),
    );
  };

  return {
    weekDays: monthData.weekDays,
    monthLabel: monthData.monthLabel,
    cells: monthData.cells as CalendarCell[],
    currentMonth: currentMonth.getMonth(),
    currentYear: currentMonth.getFullYear(),
    goToPreviousMonth,
    goToNextMonth,
  };
};
