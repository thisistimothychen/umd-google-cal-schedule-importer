class classContainer {
  constructor(Name,Sec){

  }
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    //split the class up according to their containers
    var returnedData = request.source;
    var validPage = returnedData[1];
    var containers = returnedData[0].split("END");
    var schedule_output = "";
    for(i = 0 ; i < containers.length ; i++){
      schedule_output += containers[i] + "\n";
    }

    pagecodediv.innerText = schedule_output;
    if (validPage) {    // If page has needed elements
      document.querySelector('#import-button').removeAttribute("hidden");
      
      // Add event listener for import schedule button
      var checkPageButton = document.getElementById('import-button');
      checkPageButton.addEventListener('click', function() {
    
        chrome.tabs.getSelected(null, function(tab) {
          d = document;
          
          console.log(tab.url);
        });
        
      }, false);
    }
  }
});

function onWindowLoad() {
  // TODO onWindowLoad stuff -- do we need it?
}

document.addEventListener('DOMContentLoaded', function() {
  // get page HTML
  var pagecodediv = document.querySelector('#pagecodediv');
  chrome.tabs.executeScript(null, {
    file: "getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      pagecodediv.innerText = 'Oops! We ran into an error: ' + chrome.runtime.lastError.message;
    }
  });
}, false);