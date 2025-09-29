import "./App.css";
import CalendarInput from "./components/CalendarInput.jsx";
import { useState } from "react";

function App() {
    const [date, setDate] = useState(null);

    // helper: format date in local timezone like ISO (yyyy-mm-ddTHH:mm:ss)
    const toLocalISOString = (d) => {
        const offset = d.getTimezoneOffset();
        const localDate = new Date(d.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 19); // cut off milliseconds + Z
    };

    return (
        <div>
            <CalendarInput
                minDate="2025-01-01"
                maxDate="2025-12-31"
                selectedDate={date}
                setSelectedDate={setDate}
            />

            <p className="text-white font-semibold text-3xl my-5">
                Picked:{" "}
                {date ? toLocalISOString(date).split("T")[0] : "No date selected"} (
                {Intl.DateTimeFormat().resolvedOptions().timeZone})
            </p>
        </div>
    );
}

export default App;
