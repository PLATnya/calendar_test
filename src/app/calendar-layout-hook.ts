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
    
    // Map tasks to cells
    const cells = baseLayout.cells.map((cell) => {
      if (cell.type === "day") {
        return {
          ...cell,
          tasks: tasks.filter((task) => task.day === cell.day),
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
    goToPreviousMonth,
    goToNextMonth,
  };
};
