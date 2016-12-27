document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('generate');
  checkPageButton.addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
      console.log(tab.url);
    });
  }, false);
}, false);