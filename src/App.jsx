import "./App.css";
import CalendarInput from "./components/CalendarInput.jsx";
import { useState } from "react";

function App() {
    const [date, setDate] = useState(null);
    // date - returns as a string, so you can split it by T to omit a timezone
    // raw date value - 2025-09-30T00:00:00
    // splitted date value - 2025-09-30

    return (
        <div>
            <CalendarInput
                minDate="2025-01-01"
                maxDate="2025-12-31"
                selectedDate={date}
                setSelectedDate={setDate}
                lang="uz"
            />

            <p className="text-white font-semibold text-3xl my-5">
                Picked:{" "}
                {date ? date.toISOString().split("T")[0] : "No date selected"} (
                {Intl.DateTimeFormat().resolvedOptions().timeZone})
            </p>
        </div>
    );
}

export default App;
