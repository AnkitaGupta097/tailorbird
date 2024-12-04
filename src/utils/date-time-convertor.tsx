// Please note that dateString should be in format YYYY-MM-DD and will be converted to 01 Jan 2023
export const formatDate = (dateString: string, withDay?: boolean) => {
    // Create a new Date object from the date string
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Extract the day, month, and year from the Date object
    const numberDay = date.getDate();
    const month = date.toLocaleString("default", { month: "short" }); // Returns the abbreviated month name (e.g. "Jan")
    const year = date.getFullYear();
    const day = days[date.getDay()]; // Returns the abbreviated day name (e.g. "Tue", "Wed")

    // Concatenate the day, month, and year into the desired format
    let formattedDate = `${numberDay} ${month} ${year}`;
    if (withDay) {
        formattedDate = `${day} ${formattedDate}`;
    }

    return formattedDate;
};

export const TimeStampTo12HourFormat = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    let period = "am";
    let adjustedHours = hours;

    if (hours >= 12) {
        period = "pm";
        adjustedHours = hours % 12;
    }

    if (adjustedHours === 0) {
        adjustedHours = 12;
    }

    const formattedTime = `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    return formattedTime;
};
