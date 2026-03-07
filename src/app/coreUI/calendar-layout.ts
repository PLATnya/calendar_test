import { useMemo, useState } from "react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatMonthYear = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export type CalendarCell =
  | {
      type: "empty";
      key: string;
    }
  | {
      type: "day";
      key: string;
      day: number;
      isToday: boolean;
    };

export const useCalendarLayout = () => {
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const monthData = useMemo(() => {
    const now = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekDay = new Date(year, month, 1).getDay();

    const leadingEmptyCells = Array.from({ length: firstWeekDay }, (_, index) => ({
      type: "empty" as const,
      key: `leading-${index}`,
    }));

    const dayCells = Array.from({ length: totalDaysInMonth }, (_, index) => {
      const day = index + 1;
      const isToday =
        day === now.getDate() &&
        month === now.getMonth() &&
        year === now.getFullYear();

      return {
        type: "day" as const,
        key: `day-${day}`,
        day,
        isToday,
      };
    });

    const totalCells = leadingEmptyCells.length + dayCells.length;
    const trailingEmptyCellCount = (7 - (totalCells % 7)) % 7;

    const trailingEmptyCells = Array.from(
      { length: trailingEmptyCellCount },
      (_, index) => ({
        type: "empty" as const,
        key: `trailing-${index}`,
      }),
    );

    return {
      label: formatMonthYear(currentMonth),
      cells: [...leadingEmptyCells, ...dayCells, ...trailingEmptyCells] as CalendarCell[],
    };
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
    weekDays: WEEK_DAYS,
    monthLabel: monthData.label,
    cells: monthData.cells,
    goToPreviousMonth,
    goToNextMonth,
  };
};
