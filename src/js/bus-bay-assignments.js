window.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("bba-content");
    
    const rowsPerScroll = 4;  // Number of rows to scroll at a time
    const pauseDuration = 4000; // Speed for scrolling in milliseconds (duration for the 4 rows to scroll)

    function scrollRows() {
        const rows = Array.from(content.querySelectorAll(".assignment-row"));

        // Move the top 4 rows off-screen by changing their order in the DOM
        for (let i = 0; i < rowsPerScroll; i++) {
            // Move the first 4 rows to the bottom
            const row = rows.shift();  // Get the first row in the list
            rows.push(row);  // Add it to the bottom of the list
        }

        // Re-append the rows in the new order to the container (they will be reordered automatically)
        rows.forEach(row => {
            content.appendChild(row);  // Re-append each row to the container
        });

        // Pause after the rows have been moved, simulating scrolling
        setTimeout(() => {
            // After the pause, scroll the rows again
            scrollRows();
        }, pauseDuration); // Set your pause time between scrolling
    }

    // Initial call to scroll rows
    scrollRows();

});

window.addEventListener("DOMContentLoaded", () => {
    const dateTimeElement = document.getElementById("date-time");

    function formatDateTime() {
        const now = new Date();
        
        // Format: MM/DD/YYYY  hh:mm AM/PM
        const month = String(now.getMonth() + 1);
        const day = String(now.getDate());
        const year = now.getFullYear(); // Get full year (YYYY)
        
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes and pad to 2 digits
        const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
        
        hours = hours % 12; // Convert hours to 12-hour format
        hours = hours ? String(hours) : '12'; // Convert 0 hour to 12 (for 12 AM)
        
        const formattedTime = `${month}/${day}/${year}  ${hours}:${minutes} ${ampm}`;
        dateTimeElement.textContent = formattedTime;
    }

    // Initial call to format and display date and time
    formatDateTime();

    // Update the time every minute
    setInterval(formatDateTime, 60000);
});