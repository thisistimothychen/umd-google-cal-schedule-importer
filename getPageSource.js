// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document_root) {
    var html = '', 
        ccontainers = document_root.getElementsByClassName("course-card-container--info"),
        temp = null;
    if (ccontainers.length == 0){
        html = "NO CLASSES FOUND";
    }
   
    for(i = 0 ; i < ccontainers.length; i++){
        html += ccontainers[i].innerText + "END";
    }
 

    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});



