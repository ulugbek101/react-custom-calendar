import { useRef, useState } from "react";

function CalendarInput() {
    const inputRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendarIsOpen, setCalendarIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showMonthList, setShowMonthList] = useState(false);

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("default", { month: "long" })
    );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Create array of days for rendering
    const days = [];
    // Adjust so week starts on Monday (JS getDay() → 0=Sunday)
    let startIndex = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < startIndex; i++) {
        days.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }

    const handleDayClick = (day) => {
        setSelectedDate(day.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }));
        setCalendarIsOpen(false);
    };

    const goPrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const goNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handleMonthSelect = (m) => {
        setCurrentMonth(new Date(year, m, 1));
        setShowMonthList(false);
    };

    // Split days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <div className="flex flex-col gap-5 text-white">
            <div className="relative w-1/3 m-auto">
                <input
                    ref={inputRef}
                    className="w-full peer outline-none border border-gray-600 focus:border-gray-400 transition-colors hover:cursor-pointer rounded py-2 px-4"
                    type="text"
                    value={selectedDate || ""}
                    onClick={() => setCalendarIsOpen(!calendarIsOpen)}
                    readOnly
                />
                <span
                    onClick={() => {
                        inputRef.current.click();
                        inputRef.current.focus();
                    }}
                    className="material-icons hover:cursor-pointer select-none text-gray-600 peer-focus:text-gray-400 transition-colors absolute top-1/2 right-4 -translate-y-1/2"
                >
                    calendar_month
                </span>
            </div>

            {calendarIsOpen && (
                <div className="w-1/3 m-auto rounded border border-gray-400 px-4 py-2 flex flex-col gap-2 bg-gray-800">
                    {/* Header */}
                    <div className="flex flex-row items-center justify-center mb-2">
                        {!showMonthList && (
                            <span
                                className="material-icons hover:cursor-pointer select-none me-auto rounded hover:bg-gray-600 p-2"
                                onClick={goPrevMonth}
                            >
                                chevron_left
                            </span>
                        )}
                        <span
                            className="py-2 px-4 hover:bg-gray-600 select-none hover:cursor-pointer transition-colors rounded"
                            onClick={() => setShowMonthList((prev) => !prev)}
                        >
                            {!showMonthList &&
                                `${currentMonth.toLocaleString("default", {
                                    month: "long",
                                })} ${year}`}
                            {showMonthList && (
                                <span className="py-2 px-4 hover:bg-gray-600 select-none hover:cursor-pointer transition-colors rounded">
                                    Close
                                </span>
                            )}
                        </span>
                        {!showMonthList && (
                            <span
                                className="material-icons hover:cursor-pointer select-none ms-auto rounded hover:bg-gray-600 p-2"
                                onClick={goNextMonth}
                            >
                                chevron_right
                            </span>
                        )}
                    </div>

                    {/* Month list */}
                    {showMonthList ? (
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {months.map((m, i) => (
                                <div
                                    key={m}
                                    className="py-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                                    onClick={() => handleMonthSelect(i)}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Days of week */}
                            <div className="grid grid-cols-7 text-center font-semibold">
                                {daysOfWeek.map((day) => (
                                    <div
                                        key={day}
                                        className={`${
                                            day === "Sa" || day === "Su" ? "text-red-500" : ""
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days as weeks */}
                            <div className="flex flex-col divide-y divide-gray-600">
                                {weeks.map((week, wIdx) => (
                                    <div
                                        key={wIdx}
                                        className="grid grid-cols-7 gap-1 text-center py-1"
                                    >
                                        {week.map((day, dIdx) =>
                                            day ? (
                                                <div
                                                    key={dIdx}
                                                    className={`py-1 hover:bg-gray-600 rounded cursor-pointer ${
                                                        selectedDate ===
                                                        day.toLocaleDateString()
                                                            ? "bg-blue-500 text-white"
                                                            : ""
                                                    } ${dIdx === 5 || dIdx === 6 ? "text-red-500" : ""}`}
                                                    onClick={() => handleDayClick(day)}
                                                >
                                                    {day.getDate()}
                                                </div>
                                            ) : (
                                                <div key={dIdx}></div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default CalendarInput;
