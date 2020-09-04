var importButtonHTML = '<button id="import-button" class="btn red accent-4">Import Schedule</button>';
var authenticateButtonHTML = '<button id="authenticate-button" class="btn red accent-4" style="letter-spacing: 0px;">Allow Google Calendar Access</button>';
var disabledAuthenticateButtonHTML = '<button id="authenticate-button" class="btn red accent-4" style="margin: 5px 0; letter-spacing: 0px;" disabled>Allow Google Calendar Access</button>';
var testudoLinkButtonHTML = '<button id="testudo-link-button" class="btn red accent-4">Take me to Testudo!</button>';
var exportToIcsButtonHTML = '<button id="export-ics-button" class="btn red accent-4" style="margin: 5px 0;letter-spacing: 0px;">Export schedule to .ics format</button>';

function goToTestudo() {
  chrome.tabs.create({
    url: "https://ntst.umd.edu/testudo/main/schedule"
  });
}

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    //split the class up according to their containers
    var returnedData = request.source;
    var validPage = returnedData[1];
    var courseEventInfo = returnedData[2];
    var semEndDate = returnedData[3];
    var viewedSemester = returnedData[4];

    // Sort courses by date
    courseEventInfo.sort(function (a, b) {
      return (new Date(a["startDate"]).getDay()) - (new Date(b["startDate"]).getDay());
    });

    // Get output in terms of plain text from scraping
    var containers = returnedData[0].split("END");
    var scheduleTextFromPage = "";
    for (i = 0; i < containers.length; i++) {
      scheduleTextFromPage += containers[i] + "\n";
    }
    //pagecodediv.innerText = scheduleTextFromPage;

    /* Info in JSON object array "courseEventInfo"
      "courseTitle": courseTitle,
      "section": sectionCode,
      "classType": classType,
      "location": roomLocation,
      "startDate": classStartDate,
      "endDate": classEndDate */

    // Generate HTML code to append to chrome extension tab
    var prettyOutput = "";
    // Initial HTML
    prettyOutput += "<p>Here is what we found in your schedule. If it looks good to you, go ahead and click the Import button at the bottom of this tab!</p><br/>\n<hr/>";

    for (i = 0; i < courseEventInfo.length; i++) {
      var divHTML = "<div>\n"
      divHTML += courseEventInfo[i]["courseTitle"] + " (" + courseEventInfo[i]["section"] + ") - " + courseEventInfo[i]["classType"] + "<br/>\n";
      divHTML += courseEventInfo[i]["location"] + "<br/>\n";

      startDate = new Date(courseEventInfo[i]["startDate"]);
      endDate = new Date(courseEventInfo[i]["endDate"]);
      divHTML += courseEventInfo[i]["startDate"].split(" ")[0] + " " + startDate.getHours() + ":" + courseEventInfo[i]["startDate"].split(" ")[4].split(":")[1] + courseEventInfo[i]["startPmAm"] + " to ";
      divHTML += endDate.getHours() + ":" + courseEventInfo[i]["endDate"].split(" ")[4].split(":")[1] + courseEventInfo[i]["endPmAm"] + "<br/>\n";
      divHTML += "</div>";
      divHTML += "<hr/>";

      prettyOutput += divHTML;
    }


    if (validPage) { // If page has needed elements
      const authBtnEl = document.querySelector('#button-div');
      // Show the disabled auth button and show a informational message.
      pagecodediv.innerHTML = "You've come to the correct page! Unfortunately, our direct import feature is currently unavailable (<a href='https://www.reddit.com/r/UMD/comments/esil73/get_your_class_schedule_in_google_calendar/ffe9blo'>more information</a>).";
      pagecodediv.innerHTML += "<br/><br/>";
      pagecodediv.innerHTML += "In the meantime, you can export your schedule as a .ics file and <a href='https://calendar.google.com/calendar/r/settings/export'>upload it to Google Calendar yourself</a>! Make sure to create a new empty calendar to upload to if you prefer your course schedule in its own separate calendar.";
      authBtnEl.innerHTML = disabledAuthenticateButtonHTML + exportToIcsButtonHTML;

      document.getElementById('export-ics-button').addEventListener('click', function () {
        console.log("export to ics has been clicked.");
        _gaq.push(['_trackEvent', 'exportToIcsButton', 'clicked']);

        // Export schedule to .ics file.
        exportScheduleToIcs(courseEventInfo, viewedSemester, semEndDate);
      }, false);
    } else {
      // Commented code gets the URL of the current tab open.
      chrome.tabs.getSelected(null, function (tab) {
        if (tab.url.includes("ntst.umd.edu") && tab.url.includes("schedule")) {
          // In schedule system but not at schedule page yet
          pagecodediv.innerHTML = "You're almost there! Navigate to the show schedule page as shown below:";
          document.querySelector('#import-button').remove();

          pagecodediv.innerHTML += '<br/><br/><img src="show-schedule-page-example.png" style="max-width:100%">';
        } else {
          // Not at schedule system yet
          pagecodediv.innerHTML = 'Please navigate to the Testudo Show Schedule page as shown below:';
          pagecodediv.innerHTML += '<br/><br/><img src="show-schedule-page-example.png" style="max-width:100%">';

          document.querySelector('#import-button').remove();
          document.querySelector('#button-div').innerHTML = testudoLinkButtonHTML;

          document.getElementById('testudo-link-button').addEventListener('click', function () {
            goToTestudo();
          });
        }
      });
    }
  }
});

/**
 * Similar to #importEvents, but instead of POSTing to Google Calendar, writes to an .ics file
 * @param {*} courseEventInfo
 * @param {*} viewedSemeseter
 * @param {*} semEndDate
 */
function exportScheduleToIcs(courseEventInfo, viewedSemester, semEndDate) {
  // Initialize ics.js
  var cal = ics();

  var semEndDateParam = new Date(semEndDate);
  semEndDateParam.setDate(semEndDateParam.getDate() + 1);

  rrule = {
    freq: 'WEEKLY',
    until: semEndDateParam.toJSON(),
    // TODO: consider using byday property to only store each course as one event.
  };

  for (var i = 0; i < courseEventInfo.length; i++) {
    var course = courseEventInfo[i];

    // Set start/end dates taking into consideration am/pm
    var startDate = (new Date(course.startDate))
    if (course.startPmAm == "pm" && parseInt(startDate.getHours()) < 12) {
      startDate.setHours(startDate.getHours() + 12);
    }
    var endDate = (new Date(course.endDate))
    if (course.endPmAm == "pm" && parseInt(endDate.getHours()) < 12) {
      endDate.setHours(endDate.getHours() + 12);
    }

    const summary = course.courseTitle + " (" + course.classType + ")";
    const description = "Section " + course.section;
    const location = course.location;
    const begin = startDate.toJSON();
    const end = endDate.toJSON();
    cal.addEvent(summary, description, location, begin, end, rrule)
  }

  const filename = viewedSemester;
  cal.download(filename);
}

function onWindowLoad() {
  // TODO onWindowLoad stuff -- do we need it?
}

document.addEventListener('DOMContentLoaded', function () {
  // get page HTML
  var pagecodediv = document.querySelector('#pagecodediv');
  chrome.tabs.executeScript(null, {
    file: "getPageSource.js"
  }, function () {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message.includes("The extensions gallery cannot be scripted") || chrome.runtime.lastError.message.includes("Cannot access a chrome-extension:// URL of different extension" || chrome.runtime.lastError.message.includes("Cannot access a chrome:// URL")));

      if (chrome.runtime.lastError.message.includes("The extensions gallery cannot be scripted") || chrome.runtime.lastError.message.includes("Cannot access a chrome-extension:// URL of different extension") || chrome.runtime.lastError.message.includes("Cannot access a chrome:// URL")) {
        // The error isn't really an error - redirect to Testudo
      } else {
        // Real error. Add to output.
        pagecodediv.innerText = 'Uh Oh! We ran into an error (' + chrome.runtime.lastError.message + ')...Sorry about the inconvenience! Feel free to shoot tchen112@terpmail.umd.edu an email so that we can fix this issue!';
        pagecodediv.innerText += '<br/><br/>';
      }

      pagecodediv.innerHTML += "Please make sure you're on the Testudo Show Schedule page as shown below:";
      pagecodediv.innerHTML += '<br/><br/><img src="show-schedule-page-example.png" style="max-width:100%">';
      document.querySelector('#button-div').innerHTML = testudoLinkButtonHTML;
      document.getElementById('testudo-link-button').addEventListener('click', function () {
        goToTestudo();
      });
    }
  });
}, false);