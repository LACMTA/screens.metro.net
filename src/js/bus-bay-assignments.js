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