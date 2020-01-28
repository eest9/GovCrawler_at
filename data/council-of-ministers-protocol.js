var protocol_json = new XMLHttpRequest();
protocol_json.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var argument, i, ii;
    i = 0;
    protocol = JSON.parse(this.responseText);

    for (let i in protocol) {
      var top = document.createElement("li");// Create a <p> element
      top.id = "index-" + i;// Insert text
      top.className += "top";
      if (typeof protocol[i].top !== 'undefined') { //for TOPs with annexes
        var annexes = document.createElement("ul");
        annexes.className = "linklist";
        for (let ii in protocol[i].annexes) {
          if (typeof protocol[i].annexes[ii].bka_url !== 'undefined' && protocol[i].annexes[ii].bka_url.length > 0) {
            var annex = document.createElement("li");
            annex.className = "link";
            //annex = "<li class='link'><a href='" + protocol[i].annexes[ii].bka_url + "'>" + protocol[i].annexes[ii].pdf_title + "</a></li>";

            var url = document.createElement("a");
            url.innerHTML = protocol[i].annexes[ii].pdf_title;
            url.href = protocol[i].annexes[ii].bka_url;

            annex.appendChild(url);
            annexes.appendChild(annex);
          }
        }

        var title = protocol[i].title.replace(/Zahl.+, betreffend/gmiu, "betreffend");
        var top_nr = "<span id='top_" + protocol[i].top + "' class='top nr'>TOP&#x00A0;" + protocol[i].top + ":</span>";
        title = "<span class='top title'>" + title + "</span>"
        top.innerHTML = top_nr + " " + title;

        if (typeof annexes !== 'undefined') {
          top.appendChild(annexes);
        }

      } else if (typeof protocol[i].undefined !== 'undefined') { //for text without TOP
        top.innerHTML = protocol[i].undefined;
      } else if (typeof protocol[i].bka_url !== 'undefined') { //for annexes without TOP
        top.innerHTML = "<a href='" + protocol[i].bka_url + "'>" + protocol[i].pdf_title + "</a>";
      } else {
        top.innerHTML = "ERROR: There is no known Element in the protokoll JSON";
      }
      document.getElementById("tops").appendChild(top);
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
