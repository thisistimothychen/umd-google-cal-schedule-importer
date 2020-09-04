// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.contentScriptQuery == 'queryProvostCalendar') {
    var url = 'https://www.provost.umd.edu/node/1920';
    console.log(url);
    fetch(url)
      .then((response) => response.text())
      .then((htmlText) => sendResponse(htmlText))
      .catch((error) => {
        alert('Something went wrong!');
      });
    return true;
  }
});
