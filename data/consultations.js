var consultations_json = new XMLHttpRequest();
consultations_json.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    consultations = JSON.parse(this.responseText);
    var bill = consultations.OgdSearchResult.OgdDocumentResults.OgdDocumentReference;

    for (let i in bill) {
      var top_element = document.createElement("li");// Create a <p> element
      top_element.id = "consulationt_bill-1";// Insert text
      top_element.className += "consulation_bill";

      var top_element_title = document.createElement("h2");
      top_element_title.innerHTML = bill[i].Data.Metadaten.Bundesgesetzblaetter.Titel;
      top_element.appendChild(top_element_title);

      var top_element_short_title = document.createElement("h3");
      top_element_short_title.innerHTML = bill[i].Data.Metadaten.Bundesgesetzblaetter.Kurztitel;
      top_element.appendChild(top_element_short_title);

      var top_element_mover = document.createElement("p");
      top_element_mover.innerHTML = bill[i].Data.Metadaten.Bundesgesetzblaetter.Begut.EinbringendeStelle;
      top_element.appendChild(top_element_mover);

      var top_element_dates = document.createElement("p");

      var top_element_start_date = document.createElement("div");
      var start_date = bill[i].Data.Metadaten.Bundesgesetzblaetter.Begut.BeginnBegutachtungsfrist
      top_element_start_date.className += "start_date";
      top_element_start_date.innerHTML = "Begutachtungsbeginn:<br /><time datetime='" + start_date + "'>" + start_date + "</time>";
      top_element_dates.appendChild(top_element_start_date);

      var top_element_end_date = document.createElement("div");
      var end_date = bill[i].Data.Metadaten.Bundesgesetzblaetter.Begut.EndeBegutachtungsfrist;
      top_element_end_date.className += "end_date";
      top_element_end_date.innerHTML = "Begutachtungsende:<br /><time datetime='" + end_date + "'>" + end_date + "</time>";
      top_element_dates.appendChild(top_element_end_date);

      top_element.appendChild(top_element_dates);

      if (typeof bill[i].Data.Dokumentliste.ContentReference != "undefined") {
        var annexes = bill[i].Data.Dokumentliste.ContentReference;
        var top_element_annexes = document.createElement("ul");

        for (let ii in annexes) {
          if (typeof annexes[ii].Urls.ContentUrl[2] != "undefined") {
            if(annexes[ii].Urls.ContentUrl[2].DataType == "Pdf") {
              var top_element_annex = document.createElement("li");
              top_element_annex.className = "link";

              var top_element_url = document.createElement("a");
              top_element_url.innerHTML = annexes[ii].Name.replace(/_/g, " ");
              top_element_url.href = annexes[ii].Urls.ContentUrl[2].Url;

              top_element_annex.appendChild(top_element_url);
              top_element_annexes.appendChild(top_element_annex);
            } else {
              var top_element_annex = document.createElement("li");
              top_element_annex.innerHTML = annexes[ii].Name + " konnte nicht angezegt werden.";
              top_element_annexes.appendChild(top_element_annex);
            }
            top_element.appendChild(top_element_annexes);
          }
        }
      }

      var top_element_url = document.createElement("a");
      top_element_url.innerHTML = "\uD83D\uDD17 Der Begutachtungsentwurf im RIS";
      top_element_url.href = bill[i].Data.Metadaten.Allgemein.DokumentUrl;
      top_element.appendChild(top_element_url);

      document.getElementById("consultations-list").appendChild(top_element);
    }
  }
};

var day = new Date();
day = day.toISOString();
day = day.split("T");

consultations_json.open("GET", "https://data.bka.gv.at/ris/api/v2.5/bundesgesetzblaetter?Applikation=Begut&InBegutachtungAm=" + day[0]);
consultations_json.send();
