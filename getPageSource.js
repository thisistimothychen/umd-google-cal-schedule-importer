// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '', classes = document_root.getElementsByClassName("calendarGrid-courseBlock-text-bold ng-binding");
    if (classes.length == 0){
        html = "NO CLASSES FOUND";
    }
    for(i = 0 ; i < classes.length; i++){
        html += classes[i].innerHTML + "\n";
    }

    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});

console.log("HERE");


