# screens.metro.net
This repository generates HTML pages used on some Metro displays

# LAX/Metro Transit Center (MTC) Station

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

# Pages

Each screen is currently generating pages at both these path formats:

* /{ id }/
* /mtc/{ mca.displayId }/{ mca.screen }/

# Data Files

Data is separated by Screen types:

* bus-bay-pylons.json
* concourse-info.json

# Data Format

Bus Bay Pylons - partial screens

```
  "layout": "partial",
  "content": {
      "imageTop": "AMC Bus Pylon Daktronics_Bay 3B.png",
      "imageBottom": "AMC Bus Pylon Daktronics_Bay 3B.png",
      "bgColor": "#ffd200"
  }
```

Bus Bay Pylons - full screens
```
  "layout": "full",
  "content": {
      "image": "AMC Bus Pylon Daktronics_Bay 03.png",
      "bgColor": "#58595B"
  }
```