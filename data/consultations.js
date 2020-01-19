var consultations_json = new XMLHttpRequest();
consultations_json.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    consultations = JSON.parse(this.responseText);
    var top_element = document.createElement("P");// Create a <p> element
    top_element.id = "consulationt_bill-1";// Insert text
    top_element.className += "consulation_bill";
    //top_element.innerHTML = "test";
    console.log(consultations);
    top_element.innerHTML = consultations.OgdSearchResult.OgdDocumentResults.OgdDocumentReference[1].Data.Metadaten.Bundesgesetzblaetter.Titel;
    document.getElementById("consultations").appendChild(top_element);
  }
};

var day = new Date();
day = day.toISOString();
day = day.split("T");

consultations_json.open("GET", "https://data.bka.gv.at/ris/api/v2.5/bundesgesetzblaetter?Applikation=Begut&InBegutachtungAm=" + day[0]);
consultations_json.send();
