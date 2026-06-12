const DateTime = luxon.DateTime;
const datetimeFormat = 'yyyy-MM-dd HH:mm:ss';
const datetimeZone = 'America/Los_Angeles';

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
        const now = DateTime.now();
        const format = 'M/d/yyyy  h:mm a';
        
        dateTimeElement.textContent = now.toFormat(format);
    }

    function updateScreenDisplay() {
        const now = DateTime.now();
        let shortestOrderTimeSpan = Infinity;
        let rowCount = 0;
        let showSpecialLayout = false;
        let activeLayout = bus_bay_assignments.default_layout.rows;

        let wrapper = document.querySelector('#bba-content');

        // Decide the layout to use
        bus_bay_assignments.special_layouts.forEach(layout => {
            layout.schedule.forEach(timePeriod => {
                let startTime = DateTime.fromFormat(timePeriod.start_time, datetimeFormat, { zone: datetimeZone });
                let endTime = DateTime.fromFormat(timePeriod.end_time, datetimeFormat, { zone: datetimeZone });

                // Ensure startTime and endTime are valid dates
                if (!startTime.isValid || !endTime.isValid) {
                    console.error('Invalid date in special layout schedule:', timePeriod);
                    return;
                }

                // Check if the current time is within the start and end times
                if (now >= startTime && now <= endTime) {
                    showSpecialLayout = true;
                    return;
                }
            });

            if (showSpecialLayout) {
                activeLayout = layout.rows;
                return;
            }
        });

        // Clear existing content
        wrapper.innerHTML = '';

        // Create a new row for each bay assignment
        activeLayout.forEach(rowItem => {
            let row = document.createElement('div');
            row.className = 'assignment-row';
        
            let serviceAgencyInfo = document.createElement('div');
            serviceAgencyInfo.className = 'service-agency-info';

            // Set the background color based on the bay route's backgroundColor
            serviceAgencyInfo.style.backgroundColor = rowItem.backgroundColor;

            if (rowItem.routeText == "") {
                // No route indicated, use logo image
                let agencyLogoFull = document.createElement('div');
                agencyLogoFull.className = 'agency-logo-full';

                let agencyLogoImg = document.createElement('img');
                agencyLogoImg.src = '/images/' + rowItem.image + '?now=' + now.toUnixInteger();

                agencyLogoFull.appendChild(agencyLogoImg);
                serviceAgencyInfo.appendChild(agencyLogoFull);
            } else {
                // Route indicated, display text
                let routeNumber = document.createElement('div');
                routeNumber.className = 'route-number';
                routeNumber.textContent = rowItem.routeText;
                routeNumber.style.color = rowItem.textColor;

                let agencyLogoPartial = document.createElement('div');
                agencyLogoPartial.className = 'agency-logo';

                // display logo image if it exists
                if(rowItem.image.endsWith('.png')) {
                    let agencyLogoImg = document.createElement('img');
                    agencyLogoImg.src = '/images/' + rowItem.image + '?now=' + now.toUnixInteger();
                    agencyLogoPartial.appendChild(agencyLogoImg);
                } else {
                    agencyLogoPartial.textContent = rowItem.image;
                }
                serviceAgencyInfo.appendChild(routeNumber);
                serviceAgencyInfo.appendChild(agencyLogoPartial);
            }

            let serviceBayInfo = document.createElement('div');
            serviceBayInfo.className = 'service-bay-info';

            let serviceDescription = document.createElement('div');
            serviceDescription.className = 'service-description';
            serviceDescription.textContent = rowItem.description;

            let bayNumber = document.createElement('div');
            bayNumber.className = 'bay-number';
            
            let bayNumberText = document.createElement('div');
            bayNumberText.className = 'bay-number-number';
            bayNumberText.textContent = rowItem.bay;

            bayNumber.appendChild(bayNumberText);
            
            serviceBayInfo.appendChild(serviceDescription);
            serviceBayInfo.appendChild(bayNumber);

            row.appendChild(serviceAgencyInfo);
            row.appendChild(serviceBayInfo);
            
            wrapper.appendChild(row);
            rowCount++;
        });
       
        // If the number of rows is not a multiple of 4, add empty rows to fill the screen
        if (rowCount % 4 != 0) {
            
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

