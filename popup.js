chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    var pagecode = request.source;
    pagecodediv.innerText = pagecode;
  }
});

function onWindowLoad() {
  // validate current url
  var checkPageButton = document.getElementById('generate');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      d = document;
      
      console.log(tab.url);
    });
    
  }, false);
}

document.addEventListener('DOMContentLoaded', function() {
  // get page HTML
  var pagecodediv = document.querySelector('#pagecodediv');
  chrome.tabs.executeScript(null, {
    file: "getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      pagecodediv.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
}, false);