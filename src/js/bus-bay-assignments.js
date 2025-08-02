window.addEventListener("DOMContentLoaded", () => {
    const dateTimeElement = document.getElementById("date-time");
    const content = document.getElementById("bba-content");
    
    const rowsPerScroll = 4;  // Number of rows to scroll at a time
    const pauseDuration = 6000; // 4 seconds

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

    function updateScreenDisplay() {
        const now = new Date();
        let activeOrder = null;
        let shortestOrderTimeSpan = Infinity;
        let rowCount = 0;

        let wrapper = document.querySelector('#bba-content');

        // Decide the bay order to use
        bus_bay_assignments.bay_order.forEach(orderItem => {
            let startTime = new Date(orderItem.start_time);
            let endTime = new Date(orderItem.end_time);

            // Ensure startTime and endTime are valid dates
            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                console.error('Invalid date in order item:', orderItem);
                return;
            }

            // Check if the current time is within the start and end times
            if (now >= startTime && now <= endTime) {
                let orderTimeSpan = endTime - startTime;

                // If this is the first active order or if this order has a shorter time span
                if (orderTimeSpan < shortestOrderTimeSpan) {
                    shortestOrderTimeSpan = orderTimeSpan;
                    activeOrder = orderItem;
                }
            }
        });

        // Clear existing content
        wrapper.innerHTML = '';

        // If no active order is found, display a message
        if (!activeOrder) {
            console.log('No active order found for the current time.');
            return;
        }

        // Loop through the active order's assignments
        activeOrder.order.forEach(bay => {
            let bay_routes = bus_bay_assignments.bay_assignments[bay].routes

            // Sort the bay routes by the order field
            bay_routes.sort((a, b) => {
                return a.order - b.order;
            });

            bay_routes.forEach(bay_route => {
                // Check start and end times for each bay route
                let startTime = new Date(bay_route.start_time);
                let endTime = new Date(bay_route.end_time);

                // Ensure startTime and endTime are valid dates
                if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                    console.error('Invalid date in bay route:', bay_route);
                    return;
                }

                // Check if the current time is within the start and end times
                if (now < startTime || now > endTime) {
                    // If the current time is outside the start and end times, skip this bay route
                    return;
                }

                // Create a new row for each bay assignment
                let row = document.createElement('div');
                row.className = 'assignment-row';
                
                let serviceAgencyInfo = document.createElement('div');
                serviceAgencyInfo.className = 'service-agency-info';

                // Set the background color based on the bay route's backgroundColor
                serviceAgencyInfo.style.backgroundColor = bay_route.backgroundColor;

                if (bay_route.route == "") {
                    // No route indicated
                    let agencyLogoFull = document.createElement('div');
                    agencyLogoFull.className = 'agency-logo-full';

                    let agencyLogoImg = document.createElement('img');
                    agencyLogoImg.src = '/images/' + bay_route.image + '?now=' + now.getTime();

                    agencyLogoFull.appendChild(agencyLogoImg);
                    serviceAgencyInfo.appendChild(agencyLogoFull);
                } else {
                    // Route indicated
                    let routeNumber = document.createElement('div');
                    routeNumber.className = 'route-number';
                    routeNumber.textContent = bay_route.route;
                    routeNumber.style.color = bay_route.textColor;

                    let agencyLogoPartial = document.createElement('div');
                    agencyLogoPartial.className = 'agency-logo';

                    // if agency value is a png
                    if(bay_route.image.endsWith('.png')) {
                        let agencyLogoImg = document.createElement('img');
                        agencyLogoImg.src = '/images/' + bay_route.image + '?now=' + now.getTime();
                        agencyLogoPartial.appendChild(agencyLogoImg);
                    } else {
                        agencyLogoPartial.textContent = bay_route.image;
                    }
                    serviceAgencyInfo.appendChild(routeNumber);
                    serviceAgencyInfo.appendChild(agencyLogoPartial);
                }

                let serviceBayInfo = document.createElement('div');
                serviceBayInfo.className = 'service-bay-info';

                let serviceDescription = document.createElement('div');
                serviceDescription.className = 'service-description';
                serviceDescription.textContent = bay_route.description;

                let bayNumber = document.createElement('div');
                bayNumber.className = 'bay-number';
                
                let bayNumberText = document.createElement('div');
                bayNumberText.className = 'bay-number-number';
                bayNumberText.textContent = bay;

                bayNumber.appendChild(bayNumberText);
                
                serviceBayInfo.appendChild(serviceDescription);
                serviceBayInfo.appendChild(bayNumber);

                row.appendChild(serviceAgencyInfo);
                row.appendChild(serviceBayInfo);
                
                wrapper.appendChild(row);
                rowCount++;
            });           
        });

        if (rowCount % 4 != 0) {
            // If the number of rows is not a multiple of 4, add empty rows to fill the screen
            let emptyRowsNeeded = 4 - (rowCount % 4);
            for (let i = 0; i < emptyRowsNeeded; i++) {
                let emptyRow = document.createElement('div');
                emptyRow.className = 'assignment-row';
                wrapper.appendChild(emptyRow);
            }
        }
    }
    
    function runEveryMinute() {
        formatDateTime();
        updateScreenDisplay();
    }

    // Initial call to format date and time and update the screen display
    formatDateTime();
    updateScreenDisplay();
    
    // Initial call to scroll rows, after which it will continuously run on its own
    scrollRows();

    // Update every minute
    setInterval(runEveryMinute, 60000);
    
});

