import { useRef, useState, useEffect } from "react";

function CalendarInput({
                           minDate,
                           maxDate,
                           defaultDate = null,
                           selectedDate: controlledDate,      // external Date
                           setSelectedDate: setControlledDate, // external setter
                       }) {
    const inputRef = useRef(null);
    const calendarRef = useRef(null);

    // 🔹 Convert Date → Local ISO string (without Z, respecting timezone)
    const toLocalISOString = (d) => {
        if (!d) return null;
        const offset = d.getTimezoneOffset();
        const localDate = new Date(d.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 19); // yyyy-mm-ddTHH:mm:ss
    };

    // 🔹 Internal state
    const [internalDate, setInternalDate] = useState(
        controlledDate ? new Date(controlledDate) : defaultDate ? new Date(defaultDate) : null
    );
    const [calendarIsOpen, setCalendarIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        internalDate ? new Date(internalDate) : new Date()
    );
    const [showMonthList, setShowMonthList] = useState(false);

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const months = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("default", { month: "long" })
    );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Create array of days
    const days = [];
    let startIndex = (firstDay.getDay() + 6) % 7; // Monday start
    for (let i = 0; i < startIndex; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }

    const updateDate = (day) => {
        setInternalDate(day);
        if (setControlledDate) setControlledDate(day ? toLocalISOString(day) : null);
        setCalendarIsOpen(false);
    };

    const handleDayClick = (day) => {
        const isoDate = day.toISOString().split("T")[0];
        if (minDate && isoDate < minDate) return;
        if (maxDate && isoDate > maxDate) return;
        updateDate(day);
    };

    const goPrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const goNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
    const handleMonthSelect = (m) => {
        setCurrentMonth(new Date(year, m, 1));
        setShowMonthList(false);
    };

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target) &&
                calendarRef.current &&
                !calendarRef.current.contains(event.target)
            ) {
                setCalendarIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync with controlledDate
    useEffect(() => {
        if (controlledDate) {
            setInternalDate(new Date(controlledDate));
            setCurrentMonth(new Date(controlledDate));
        }
    }, [controlledDate]);

    return (
        <div className="flex flex-col gap-5 text-white">
            <div className="relative w-full">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full peer outline-none border border-gray-600 focus:border-gray-400 transition-colors hover:cursor-pointer rounded py-2 px-4"
                    value={
                        internalDate
                            ? new Date(internalDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : ""
                    }
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
                <div
                    ref={calendarRef}
                    className="w-1/3 m-auto rounded border border-gray-400 px-4 py-2 flex flex-col gap-2 bg-gray-800"
                >
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
                                <span className="py-2 px-4">Close</span>
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

                            {/* Days */}
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
                                                    className={`py-1 rounded cursor-pointer
                                                        ${
                                                        internalDate &&
                                                        new Date(internalDate).toDateString() ===
                                                        day.toDateString()
                                                            ? "bg-blue-500 text-white"
                                                            : "hover:bg-gray-600"
                                                    }
                                                        ${dIdx === 5 || dIdx === 6 ? "text-red-500" : ""}
                                                        ${
                                                        (minDate &&
                                                            day.toISOString().split("T")[0] < minDate) ||
                                                        (maxDate &&
                                                            day.toISOString().split("T")[0] > maxDate)
                                                            ? "opacity-40 cursor-not-allowed hover:bg-transparent"
                                                            : ""
                                                    }`}
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

                    <div className="flex flex-row items-center justify-center gap-5">
                        <button
                            disabled={
                                internalDate &&
                                new Date(internalDate).toDateString() ===
                                new Date().toDateString()
                            }
                            onClick={() => {
                                const today = new Date();
                                const iso = today.toISOString().split("T")[0];
                                if (minDate && iso < minDate) return;
                                if (maxDate && iso > maxDate) return;
                                updateDate(today);
                            }}
                            type="button"
                            className={`${
                                internalDate &&
                                new Date(internalDate).toDateString() ===
                                new Date().toDateString()
                                    ? "bg-gray-600"
                                    : ""
                            } disabled:hover:cursor-not-allowed border text-sm text-gray-400 border-gray-600 flex flex-row gap-1 items-center justify-center rounded px-2 py-1 transition hover:cursor-pointer hover:bg-gray-600`}
                        >
                            <span className="material-icons !text-lg">today</span>
                            Today
                        </button>
                        <button
                            onClick={() => updateDate(null)}
                            disabled={!internalDate}
                            type="button"
                            className="disabled:bg-gray-600 disabled:hover:cursor-not-allowed border text-sm text-gray-400 border-gray-600 flex flex-row gap-1 items-center justify-center rounded px-2 py-1 transition hover:cursor-pointer hover:bg-gray-600"
                        >
                            <span className="material-icons !text-lg">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarInput;
