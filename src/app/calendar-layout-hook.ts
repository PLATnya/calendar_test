import { useMemo, useState } from "react";
import { getCalendarLayout, type CalendarCell } from "@/core/calendar-layout";

export type { CalendarCell };

export const useCalendarLayout = () => {
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return getCalendarLayout(year, month);
  }, [currentMonth]);

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
