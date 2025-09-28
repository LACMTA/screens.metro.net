const DateTime = luxon.DateTime;
const datetimeFormat = 'yyyy-MM-dd HH:mm:ss';
const datetimeZone = 'America/Los_Angeles';

function updateScreenContent() {
    const now = DateTime.now();
    let activeEntry = null;
    let shortestTimeSpan = Infinity;

    contentArray.forEach(contentItem => {
        let startTime = DateTime.fromFormat(contentItem.start_time, datetimeFormat, { zone: datetimeZone });
        let endTime = DateTime.fromFormat(contentItem.end_time, datetimeFormat, { zone: datetimeZone });

        // Ensure startTime and endTime are valid dates
        if (!startTime.isValid || !endTime.isValid) {
            console.error('Invalid date in content item:', contentItem);
            return;
        }

        // Check if the current time is within the start and end times
        if (now >= startTime && now <= endTime) {
            let itemTimeSpan = endTime - startTime;

            // If this is the first active entry or if this entry has a shorter time span
            if (itemTimeSpan < shortestTimeSpan) {
                shortestTimeSpan = itemTimeSpan;
                activeEntry = contentItem;
            }
        }
    });

    let body = document.querySelector('body');

    // If no active entry is found, display a message
    if (!activeEntry) {
        console.log('No active content found for the current time.');
        return;
    }

    // Default to black if no color is specified
    body.style.backgroundColor = activeEntry.backgroundColor || '#000000';

    if (screen.layout == 'full') {
        let img = document.createElement('img');
        img.src = '/images/' + activeEntry.image + '?now=' + now.toUnixInteger();
        
        body.innerHTML = ''; // Clear existing content
        body.appendChild(img);
    } else if (screen.layout == 'partial') {
        let imgTop = document.createElement('img');
        let imgBottom = document.createElement('img');

        imgTop.src = '/images/' + activeEntry.imageTop + '?now=' + now.toUnixInteger();
        imgBottom.src = '/images/' + activeEntry.imageBottom + '?now=' + now.toUnixInteger();

        body.innerHTML = ''; // Clear existing content
        body.appendChild(imgTop);
        body.appendChild(imgBottom);
    } else {
        body.innerHTML = ''; // Clear existing content
        // Display default content - nothing defined yet
    }
}

updateScreenContent();

// Check for content changes every minute
setInterval(updateScreenContent, 60000);