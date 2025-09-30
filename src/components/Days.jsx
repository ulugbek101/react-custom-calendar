function Days({internalDate, handleDayClick, year, month, minDate, maxDate}) {
    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Create array of days
    const days = [];
    let startIndex = (firstDay.getDay() + 6) % 7; // Monday start
    for (let i = 0; i < startIndex; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }

    // Split into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    // Helper: format date as YYYY-MM-DD
    const fmt = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            {/* Days of week */}
            <div className="grid grid-cols-7 text-center font-semibold">
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className={day === "Sa" || day === "Su" ? "text-red-500" : ""}
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
                        {week.map((day, dIdx) => {
                            if (!day) return <div key={dIdx}></div>;

                            const dayStr = fmt(day);
                            const isDisabled =
                                (minDate && dayStr < minDate) ||
                                (maxDate && dayStr >= maxDate);

                            const isSelected =
                                internalDate &&
                                new Date(internalDate).toDateString() ===
                                day.toDateString();

                            return (
                                <div
                                    key={dIdx}
                                    onClick={() => !isDisabled && handleDayClick(day)}
                                    className={`py-1 rounded
                                        ${isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-600"}
                                        ${dIdx === 5 || dIdx === 6 ? "text-red-500" : ""}
                                        ${
                                        isDisabled
                                            ? "opacity-40 cursor-not-allowed hover:bg-transparent"
                                            : "cursor-pointer"
                                    }
                                    `}
                                >
                                    {day.getDate()}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Days;
