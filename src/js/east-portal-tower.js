const RAIL_ALERTS = 'https://fhmomos5iw74eyrisc6iyr7any0ctzlg.lambda-url.us-west-1.on.aws/';

const LINE_ICONS = {
    '801': 'https://lacmta.github.io/metro-iconography/Service_ALine.svg',
    '802': 'https://lacmta.github.io/metro-iconography/Service_BLine.svg',
    '803': 'https://lacmta.github.io/metro-iconography/Service_CLine.svg',
    '804': 'https://lacmta.github.io/metro-iconography/Service_ELine2.svg',
    '805': 'https://lacmta.github.io/metro-iconography/Service_DLine.svg',
    '807': 'https://lacmta.github.io/metro-iconography/Service_KLine.svg',
    '901': 'https://lacmta.github.io/metro-iconography/Service_GLine.svg',
    '910': 'https://lacmta.github.io/metro-iconography/Service_JLine.svg',
    '950': 'https://lacmta.github.io/metro-iconography/Service_JLine.svg',
    'systemwide': '/images/alert.svg'
};

const DATA_SOURCE = [RAIL_ALERTS];

let currentRailAlerts = [];

const fetchPromises = DATA_SOURCE.map(url => fetch(url, { method: "GET" })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
);

Promise.all(fetchPromises)
    .then(data => {
        console.log(data);
        processAlerts(data);
    })
    .catch( error => {
        console.error(`Request failed: `, error);
    });

function processAlerts(data) {
    data.forEach(alertFeed => {
        alertFeed.forEach(alert => {
            if (alert.headerText.toLowerCase().includes('elevator') || alert.headerText.toLowerCase().includes('escalator') || 
            alert.descriptionText.toLowerCase().includes('elevator') || alert.descriptionText.toLowerCase().includes('escalator')) {
                // this is an elevator or escalator alert, skip it
            } else if (isUpcoming(alert)) {
                // this is an upcoming alert, not an active alert, skip it

            } else {
                currentRailAlerts.push(alert);
            }
        });
    });

    // If DOM is loaded, updateView(). Otherwise, wait for DOM to load.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateView);
    } else {
        updateView();
    }

    startScrolling();
}

function isUpcoming(alert) {
    let today = new Date();
    let startTime = new Date(formatDate(alert.activePeriods[0].start));
    let status = today < startTime
    return status;
}

function formatDate(time) {
    const date = new Date(time);

    let result = date.toLocaleString('en-US', {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    });

    return result;
}

function updateView() {
    const alertContainer = document.getElementById('alert-container');
    
    alertContainer.innerHTML = ''; // Clear existing content

    currentRailAlerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = 'rail-alert';

        alert.informedEntities.forEach(entity => {
            let iconImg = document.createElement('img');

            // Check if this is a systemwide alert
            if (entity.routeId == undefined) {
                console.log('Systemwide alert detected');
                iconImg.src = LINE_ICONS['systemwide'];
            } else {
                iconImg.src = LINE_ICONS[entity.routeId];
            }

            iconImg.classList.add('line-icon');
                alertElement.appendChild(iconImg);
        });

        const alertContent = document.createElement('div');
        alertContent.className = 'alert-content';

        const alertHeader = document.createElement('h2');
        alertHeader.textContent = toTitleCase(alert.headerText);
        alertContent.appendChild(alertHeader);

        const alertDescription = document.createElement('p');
        alertDescription.innerHTML = alert.descriptionText.replaceAll('\n', '<br>');
        alertContent.appendChild(alertDescription);

        const hrLine = document.createElement('hr');
        hrLine.className = 'alert-divider';
        alertContent.appendChild(hrLine);
        
        alertElement.appendChild(alertContent);
        
        alertContainer.appendChild(alertElement);
    });   
}

function toTitleCase(text) {
    let result = '';
    let textArr = text.split(' ');
    
    textArr.forEach(word => {
        if (word.length > 0) {
            result += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
        }
    });

    return result;
}

const scrollSpeed = 1; // pixels per frame
const frameDelay = 16; // roughly 60fps
const pauseDuration = 2000;
let paused = false;

function startScrolling() {
    setInterval(scrollStep, frameDelay);
}

function shouldScroll() {
    const container = document.getElementById('alert-container');
    return container.scrollHeight > container.clientHeight;
  }

function scrollStep() {
    if (paused || !shouldScroll()) return;

    const container = document.getElementById('alert-container');
    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;

    // round up currentScroll

    if (Math.ceil(currentScroll) >= maxScroll) {
        paused = true;
        setTimeout(() => {
            container.scrollTo({ top: 0, behavior: 'auto'});
            
            // Pause again *after* scrolling to top
            setTimeout(() => {
                paused = false;
            }, pauseDuration);
        }, pauseDuration);
        return;
      }

    container.scrollBy(0, scrollSpeed);
}