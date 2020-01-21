var protocol_json = new XMLHttpRequest();
protocol_json.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var argument, i, ii, annexes_element;
    i = 0;
    protocol = JSON.parse(this.responseText);

    for (let i in protocol) {
      var top_element = document.createElement("li");// Create a <p> element
      top_element.id = "index-" + i;// Insert text
      top_element.className += "top";
      if (typeof protocol[i].top !== 'undefined') { //for TOPs with annexes
        for (let ii in protocol[i].annexes) {
          if (typeof protocol[i].annexes[ii].bka_url !== 'undefined' && protocol[i].annexes[ii].bka_url.length > 0) {
            annexes_element = "<li class='link'><a href='" + protocol[i].annexes[ii].bka_url + "'>" + protocol[i].annexes[ii].pdf_title + "</a></li>";
          }
        }
        if (typeof annexes_element !== 'undefined') {
          top_element.innerHTML = "<span id='top_" + protocol[i].top + "' class='top nr'>TOP: " + protocol[i].top + "</span> <span class='top title'>" + protocol[i].title + "</span><ul>" + annexes_element + "</ul>";
        } else {
          top_element.innerHTML = "<span id='top_" + protocol[i].top + "' class='top nr'>TOP: " + protocol[i].top + "</span> <span class='top title'>" + protocol[i].title + "</span>";
        }

      } else if (typeof protocol[i].undefined !== 'undefined') { //for text without TOP
        top_element.innerHTML = protocol[i].undefined;
      } else if (typeof protocol[i].bka_url !== 'undefined') { //for annexes without TOP
        top_element.innerHTML = "<a href='" + protocol[i].bka_url + "'>" + protocol[i].pdf_title + "</a>";
      } else {
        top_element.innerHTML = "ERROR: There is no known Element in the protokoll JSON";
      }
      document.getElementById("tops").appendChild(top_element);
    }
  }
};

var protocol_toc = new XMLHttpRequest();
protocol_toc.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var all_toc = this.responseText;
    all_toc = all_toc.trim();
    all_toc = all_toc.split("\n");
    dump = "protokolle/" + all_toc[all_toc.length-1] + "/text.json";
    protocol_json.open("GET", dump, true);
    protocol_json.send();
  }
};

protocol_toc.open("GET", "protokolle/toc.txt", true);
protocol_toc.send();
