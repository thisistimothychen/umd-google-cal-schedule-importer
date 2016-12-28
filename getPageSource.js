// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document_root) {
    var html = '', 
        ccontainers = document_root.getElementsByClassName("course-card-container--info"),
        temp = null;
    if (ccontainers.length == 0) {
        html = "Please navigate to the Testudo Show Schedule page";
    }
   
    for(i = 0 ; i < ccontainers.length; i++) {
      if (i == 0) {
        html += ccontainers[i].innerText.substring(1) + "END";
      } else {
        html += ccontainers[i].innerText + "END";
      }
    }
 

    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});



