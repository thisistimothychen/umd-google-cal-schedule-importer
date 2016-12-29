class classContainer {
  constructor(Name,Sec){

  }
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    //split the class up according to their containers
    var containers = request.source.split("END");
    var temp = "";
    for(i = 0 ; i < containers.length ; i++){
      temp += containers[i] + "\n";
    }

    pagecodediv.innerText = temp;
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
      pagecodediv.innerText = 'Oops! We ran into an error: ' + chrome.runtime.lastError.message;
    }
  });
}, false);