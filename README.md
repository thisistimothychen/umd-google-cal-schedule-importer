# UMD Google Calendar Schedule Importer
Imports your UMD class schedule right into a new Google Calendar!

[<img src="available-in-chrome-web-store-button.png" width="250">](https://chrome.google.com/webstore/detail/umd-gcal-schedule-importe/jegeklcfgfcjbcbcabblbhdakfaibckn)


Chrome extension parsing the page data:
![Screenshot1](screenshots/ext_screenshot1.png)

The final result:
![Screenshot2](screenshots/ext_screenshot2.png)

Notice to navigate to Testudo schedule page:
![Screenshot3](screenshots/ext_screenshot3.png)

## Steps to Deploy to Chrome Extension Store

- Update version number (should be done each push to GitHub anyways)
- Remove the key from manifest.json (only used for testing purposes)
- Package the following files into a zip:
  - gCalFunctions.js
  - getPageSource.js
  - googleAnalytics.js
  - googleApiClient.js
  - icons
  - manifest.json
  - popup.html
  - popup.js
  - show-schedule-page-example.png
  - style.css
  
