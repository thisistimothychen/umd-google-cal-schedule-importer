// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '373135660634-coceei1hk8q56j42sisdvoqbfrue4qsc.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  console.log("checkAuth()");
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  console.log("handleAuthResult()");
  // var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    // authorizeDiv.style.display = 'none';

    // Authorized! Continue with GCal generation
    return true;
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    // authorizeDiv.style.display = 'inline';
    return false;
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 */
function handleAuthClick() {
  console.log("handleAuthClick()");
  return handleAuthResult(gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult));
  console.log("after handleAuthClick()");
  // return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function callListUpcomingEvents() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

function callCreateCalendar() {
  return gapi.client.load('calendar', 'v3', createCalendar);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    // appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        // appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      // appendPre('No upcoming events found.');
    }

  });
}


function createCalendar() {
  var request = gapi.client.calendar.calendars.insert({
    'summary': 'UMD Schedule',
    'timezone': 'America/New_York'
  });

  request.execute(function(resp) {
    newCalId = resp.id  // global scope to hack around nonaccessible return value
    return(newCalId);   // return newly created GCal ID
  });
}

function createEvents(calId, eventData) {
  var event = {
    'summary': 'Course Number',
    'location': 'Room Number',
    'description': 'Description',
    'start': {
      // get start date of semester programatically
      'dateTime': '2016-12-30T11:00:00',
      'timeZone': 'America/New_York'
    },
    'end': {
      'dateTime': '2016-12-30T12:15:00',
      'timeZone': 'America/New_York'
    }
    // , 'recurrence': [
    //   'RRULE:FREQ=WEEKLY;UNTIL=2017-01-20'
    // ]
    // , 'reminders': {
    //   'useDefault': false,
    //   'overrides': [
    //     {'method': 'email', 'minutes': 24 * 60},
    //     {'method': 'popup', 'minutes': 10}
    //   ]
    // }
  };

  var request = gapi.client.calendar.events.insert({
    'calendarId': calId,
    'resource': event
  });

  request.execute(function(event) {
    // appendPre('Event created: ' + event.htmlLink);
  });
}
