function updateScreenContent() {
    const now = new Date();
    let activeEntry = null;
    let shortestTimeSpan = Infinity;

    contentArray.forEach(contentItem => {
        let startTime = new Date(contentItem.start_time);
        let endTime = new Date(contentItem.end_time);

        // Ensure startTime and endTime are valid dates
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
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

    if (screen.layout == 'full') {
        let img = document.createElement('img');
        img.src = '/images/' + activeEntry.image + '?now=' + now.getTime();
        
        body.innerHTML = ''; // Clear existing content
        body.appendChild(img);
    } else if (screen.layout == 'partial') {
        let imgTop = document.createElement('img');
        let imgBottom = document.createElement('img');

        imgTop.src = '/images/' + activeEntry.imageTop + '?now=' + now.getTime();
        imgBottom.src = '/images/' + activeEntry.imgBottom + '?now=' + now.getTime();

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