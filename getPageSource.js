// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document_root) {
    var html = '', 
        ccontainers = document_root.getElementsByClassName("course-card-container--info");
    if (ccontainers.length == 0) {
        html = "Please navigate to the Testudo Show Schedule page";
        validPage = false;
    } else {
        validPage = true;
    }
    
    for(i = 0 ; i < ccontainers.length; i++) {
      // append to output (html) with "END" as separator
      html += ccontainers[i].innerText.substring(1) + "END";
      
      // TODO parse each course into json or array format here
    }
    
    // TODO also return the json or array holding courses
    return [html, validPage];
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
