// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document_root) {
    var html = '',
        ccontainers = document_root.getElementsByClassName("course-card-container--info"),
        courseEventInfo = new Array();
    if (ccontainers.length == 0) {
        html = "Please navigate to the Testudo Show Schedule page";
        validPage = false;
    } else {
        validPage = true;
    }

    for(i = 0 ; i < ccontainers.length; i++) {
      // append to output (html) with "END" as separator
      var courseInfo = ccontainers[i].innerText.substring(1);
      html += courseInfo + "END";

      /*4 letters, space, 3 numbers + letter (optional), space, (4 characters)
      each 3 lines is group:
      // Lec or Dis (the entire line)
      // M/T/W/Th/F (each optional), ##:##(a/p)m - ##:##(a/p)m
      // Location: capital letters, space, numbers OR "ONLINE"
      Final
      TBA/something else
      */

      /*BMGT 350 (BL06)
      Lec
      W 11:00am - 12:15pm
      VMH 1330
      Lec
      TBA
      ONLINE
      Final
      TBA*/

      /*BMGT 350 (BL06)
      Lec
      W 11:00am - 12:15pm
      VMH 1330
      Lec
      TBA
      ONLINE
      Final
      TBA

      CMSC 389K (0101)
      Lec
      F 3:00pm - 3:50pm
      CSI 1122
      Final
      TBA

      CMSC 420 (0101)
      Lec
      MW 2:00pm - 3:15pm
      CSI 2117
      Final
      TBA

      ECON 201 (0201)
      Lec
      TTh 3:30pm - 4:45pm
      TYD 0130
      Final
      TBA

      HEIP 241 (0101)
      Lec
      MW 5:00pm - 5:50pm
      LPA 1125
      Final
      TBA

      HONR 248J (0101)
      Lec
      TTh 11:00am - 12:15pm
      KNI 1105
      Final
      TBA
      */

      // TODO parse each course into json or array format here
      courseLines = courseInfo.split("\n")

      timeLines = new Array();
      roomLocations = new Array();
      for (j = 0; j < courseLines.length; j++) {
        line = courseLines[j];

        if (j == 0) {  // Course Title
          firstLine = line.split(" ");
          courseTitle = firstLine[0] + " " + firstLine[1];
          sectionCode = firstLine[2].substring(1,firstLine[2].length-1);
        } else if (line == "Lec" || line == "Dis") {
          if (courseLines[j+1] == "TBA") {  /* time is TBA */
            // do nothing.
          } else {
            timeLines.push(courseLines[j+1]);
            roomLocations.push(courseLines[j+2]);
          }
        } else if (line == "Final") {
          break;
        }
      }

      // courseEventInfo.push({
      //
      // });


      console.log("Course name: " + courseTitle);
      console.log("Section: " + sectionCode);
      console.log("Location: " + roomLocations.toString());
      console.log("Time: " + timeLines.toString());
    }

    // console.log(html);

    // TODO also return the json or array holding courses
    return [html, validPage];
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
