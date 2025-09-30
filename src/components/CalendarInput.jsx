import {useEffect, useRef, useState} from "react";
import Days from "./Days.jsx";
import {monthsTranslations, words} from "./constants.jsx";


// Local formatter -> always YYYY-MM-DD in local timezone
const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

function CalendarInput({
                           minDate,
                           maxDate,
                           defaultDate = null,
                           selectedDate: controlledDate,       // external Date
                           setSelectedDate: setControlledDate, // external setter
                           lang = "en",
                       }) {
    const inputRef = useRef(null);
    const calendarRef = useRef(null);

    // Internal state
    const [internalDate, setInternalDate] = useState(
        controlledDate
            ? new Date(controlledDate)
            : defaultDate
                ? new Date(defaultDate)
                : null
    );
    const [calendarIsOpen, setCalendarIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        internalDate ? new Date(internalDate) : new Date()
    );
    const [showMonthList, setShowMonthList] = useState(false);
    const [showYearList, setShowYearList] = useState(false);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const months = Array.from({length: 12}, (_, i) => new Date(0, i).toLocaleString("default", {month: "long"}) );
    const years = Array.from({length: 9}, (_, i) => year - 3 + i);

    const updateDate = (day) => {
        setInternalDate(day);
        if (setControlledDate) setControlledDate(day); // keep Date object, not string
        setCalendarIsOpen(false);
    };

    const handleDayClick = (day) => {
        const localDate = formatLocalDate(day);
        if (minDate && localDate < minDate) return;
        if (maxDate && localDate > maxDate) return;
        updateDate(day);
    };

    const handleMonthSelect = (m) => {
        setCurrentMonth(new Date(year, m, 1));
        setShowMonthList(false);
    };

    const handleYearSelect = (y) => {
        setCurrentMonth(new Date(y, month, 1));
        setShowYearList(false);
    };

    const goPrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const goNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

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
                        {!showMonthList && !showYearList && (
                            <span
                                className="material-icons hover:cursor-pointer select-none me-auto rounded hover:bg-gray-600 p-2"
                                onClick={goPrevMonth}
                            >
                chevron_left
              </span>
                        )}

                        {/* Month toggle */}
                        <span
                            className="py-2 px-4 hover:bg-gray-600 select-none hover:cursor-pointer transition-colors rounded"
                            onClick={() => {
                                setShowMonthList((prev) => !prev);
                                setShowYearList(false);
                            }}
                        >
              {showMonthList ? words[lang]["close"] : monthsTranslations[lang][currentMonth.toLocaleString("default", {month: "long"})]}
            </span>

                        {/* Year toggle */}
                        <span
                            className="py-2 px-4 hover:bg-gray-600 select-none hover:cursor-pointer transition-colors rounded"
                            onClick={() => {
                                setShowYearList((prev) => !prev);
                                setShowMonthList(false);
                            }}
                        >
              {showYearList ? words[lang]["close"] : year}
            </span>

                        {!showMonthList && !showYearList && (
                            <span
                                className="material-icons hover:cursor-pointer select-none ms-auto rounded hover:bg-gray-600 p-2"
                                onClick={goNextMonth}
                            >
                chevron_right
              </span>
                        )}
                    </div>

                    {/* Content */}
                    {showYearList ? (
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {years.map((y) => (
                                <div
                                    key={y}
                                    className={`py-2 hover:bg-gray-600 rounded-lg cursor-pointer ${
                                        y === year ? "bg-blue-500 text-white" : ""
                                    }`}
                                    onClick={() => handleYearSelect(y)}
                                >
                                    {y}
                                </div>
                            ))}
                        </div>
                    ) : showMonthList ? (
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {months.map((m, i) => (
                                <div
                                    key={m}
                                    className="py-2 hover:bg-gray-600 rounded-lg cursor-pointer"
                                    onClick={() => handleMonthSelect(i)}
                                >
                                    {monthsTranslations[lang][m]}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Days
                            internalDate={internalDate}
                            handleDayClick={handleDayClick}
                            year={year}
                            month={month}
                            minDate={minDate}
                            maxDate={maxDate}
                            lang={lang}
                        />
                    )}

                    {/* Footer buttons */}
                    <div className="flex flex-row items-center justify-center gap-5 mt-2">
                        <button
                            disabled={
                                internalDate &&
                                new Date(internalDate).toDateString() === new Date().toDateString()
                            }
                            onClick={() => {
                                const today = new Date();
                                const localToday = formatLocalDate(today);
                                if (minDate && localToday < minDate) return;
                                if (maxDate && localToday > maxDate) return;
                                updateDate(today);
                            }}
                            type="button"
                            className={`${
                                internalDate &&
                                new Date(internalDate).toDateString() === new Date().toDateString()
                                    ? "bg-gray-600"
                                    : ""
                            } disabled:hover:cursor-not-allowed border text-sm text-gray-400 border-gray-600 flex flex-row gap-1 items-center justify-center rounded px-2 py-1 transition hover:cursor-pointer hover:bg-gray-600`}
                        >
                            <span className="material-icons !text-lg">today</span>
                            {words[lang]["today"]}
                        </button>
                        <button
                            onClick={() => updateDate(null)}
                            disabled={!internalDate}
                            type="button"
                            className="disabled:bg-gray-600 disabled:hover:cursor-not-allowed border text-sm text-gray-400 border-gray-600 flex flex-row gap-1 items-center justify-center rounded px-2 py-1 transition hover:cursor-pointer hover:bg-gray-600"
                        >
                            <span className="material-icons !text-lg">delete</span>
                            {words[lang]["delete"]}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarInput;
