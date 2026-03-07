"use client";

import { useState } from "react";
import { useCalendarLayout } from "./calendar-layout-hook";

export default function Home() {
  const { weekDays, monthLabel, cells, goToPreviousMonth, goToNextMonth } =
    useCalendarLayout();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleGoToPreviousMonth = () => {
    setSelectedDay(null);
    goToPreviousMonth();
  };

  const handleGoToNextMonth = () => {
    setSelectedDay(null);
    goToNextMonth();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-white to-sky-100 p-3 sm:p-4">
      <main className="relative mx-auto flex h-[calc(100vh-1.5rem)] w-full flex-col rounded-3xl border border-zinc-200/80 bg-white/90 p-4 shadow-xl shadow-zinc-300/20 backdrop-blur sm:h-[calc(100vh-2rem)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {monthLabel}
          </h1>

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
                <button
                  type="button"
                  key={cell.key}
                  onClick={() => setSelectedDay(cell.day)}
                  className={`flex items-start justify-end rounded-xl border p-2 text-sm font-medium transition sm:p-3 sm:text-base ${
                    cell.isToday
                      ? "border-orange-400 bg-orange-100 text-orange-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  } ${
                    selectedDay === cell.day
                      ? "ring-2 ring-sky-300 ring-offset-1"
                      : ""
                  }`}
                >
                  {cell.day}
                </button>
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
