export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export type CalendarLayout = {
  weekDays: string[];
  monthLabel: string;
  cells: CalendarCell[];
};

const formatMonthYear = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export const getCalendarLayout = (
  year: number,
  zeroBasedMonth: number,
  now: Date = new Date(),
): CalendarLayout => {
  const totalDaysInMonth = new Date(year, zeroBasedMonth + 1, 0).getDate();
  const firstWeekDay = new Date(year, zeroBasedMonth, 1).getDay();

  const leadingEmptyCells = Array.from({ length: firstWeekDay }, (_, index) => ({
    type: "empty" as const,
    key: `leading-${index}`,
  }));

  const dayCells = Array.from({ length: totalDaysInMonth }, (_, index) => {
    const day = index + 1;
    const isToday =
      day === now.getDate() &&
      zeroBasedMonth === now.getMonth() &&
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

  const trailingEmptyCells = Array.from({ length: trailingEmptyCellCount }, (_, index) => ({
    type: "empty" as const,
    key: `trailing-${index}`,
  }));

  return {
    weekDays: [...WEEK_DAYS],
    monthLabel: formatMonthYear(new Date(year, zeroBasedMonth, 1)),
    cells: [...leadingEmptyCells, ...dayCells, ...trailingEmptyCells],
  };
};
