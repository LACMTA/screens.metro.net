# screens.metro.net
This repository generates HTML pages used on some Metro displays

## LAX/Metro Transit Center (MTC) Station

Screen Types:

* Bus Bay Pylons - Upper Screens (Daktronics)
  * Full Screen - 1080px X 1920px
  * Partial Screen - 1080px x 960px
* Bus Plaza - Bay Assignments
  * Content plus Header - 1920px x 1080px (Header = 90px)
  * Content only - 1920px x 990px
* Concourse - Multi-Service Info
  * Full Screen - 1080px x 1920px  
  * Partial Screen - 1080px x 804px

## Pages

Each screen is currently generating pages at both these path formats:

* /{ id }/
* /mtc/{ mca.displayId }/{ mca.screen }/

# Data Files

Data is separated by Screen types:

* bus-bay-pylons.json
* concourse-info.json

## Data Format

Bus Bay Pylons - partial screens

``` json
  "layout": "partial",
  "content": {
      "imageTop": "AMC Bus Pylon Daktronics_Bay 3B.png",
      "imageBottom": "AMC Bus Pylon Daktronics_Bay 3B.png",
      "bgColor": "#ffd200"
  }
```

Bus Bay Pylons - full screens
``` json
  "layout": "full",
  "content": {
      "image": "AMC Bus Pylon Daktronics_Bay 03.png",
      "bgColor": "#58595B"
  }
```

## Scheduled Content

Times are represented in UTC.  [This tool](https://dateful.com/convert/utc) can help with conversions to local time.

### Bus Bay Pylons

Each bus bay pylon has two screens, one on each side.  Each screen is represented separately in `bus-bay-pylons.json`. For each screen's `content` array, add an object indicating the `start_time`, `end_time`, `image` file, and `backgroundColor`.

For temporary changes to the bus bay due to special events (e.g. SoFi Stadium shuttle to NFL games), the default image object can stay untouched with a timespan extending far into the future.  The temporary image's timespan will be its active period.  After the temporary image's timespan expires, the screen will revert to the default image.

For shuttles to SoFi Stadium for NFL games, typically we will update Bay 8 to display the Shuttle image and Bay 9 to display Beach Cities Transit Line 109 with Metro Line 102.

### Bus Bay Assignments

Bus Bay Assignment screens are defined within `bus-bay-assignments.json` in two parts: `bay_order` and `bay_assignments`.  When we run special shuttles, we'll use a different bay order listing to prioritize the shuttle information.  The default order can have a long time span while the temporary order has a short timespan.

Bay assignments objects exist for each bay.  There can be multiple routes assigned to each bay.  Each `route` object inside a `bay` object contains its own schedule information.  Because each route object is handled separately, and multiple routes can be shown for a bay at a time, the timespans will need to be adjusted to remove a route from being displayed.  In this example below, Metro Line 102 is assigned to Bay 8 by default but is removed from the display for the time period that the SoFi Stadium shuttle is assigned to Bay 8.

``` json
"8": {
    "empty": false,
    "bay": "8",
    "routes": [
        {
            "route": "102",
            "description": "South Gate",
            "image": "metro-logo.png",
            "backgroundColor": "#f48120",
            "textColor": "#ffffff",
            "start_time": "2025-07-01T00:00:00Z",
            "end_time": "2025-09-06T17:25:00Z",
            "order": 1
        },{
            "route": "",
            "description": "SoFi Stadium",
            "image": "Shuttle_Bus Bay Directory_Logo Badge_484x176.png",
            "backgroundColor": "#ffffff",
            "textColor": "#ffffff",
            "start_time": "2025-09-06T17:25:00Z",
            "end_time": "2025-09-06T20:25:00Z",
            "order": 1
        },{
            "route": "102",
            "description": "South Gate",
            "image": "metro-logo.png",
            "backgroundColor": "#f48120",
            "textColor": "#ffffff",
            "start_time": "2025-09-06T17:25:00Z",
            "end_time": "2099-01-01T17:05:00Z",
            "order": 1
        }
    ]
}
```

## Content Updates

Update `version.txt` each time changes are made.

`reload.js` script on pages will check the version.txt file and reload the page if there is a new version number.

It also contains a timer to reload the page if it has been running continuously for 24 hours.