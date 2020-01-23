var consultations_json = new XMLHttpRequest();
consultations_json.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    consultations = JSON.parse(this.responseText);
    var bill = consultations.OgdSearchResult.OgdDocumentResults.OgdDocumentReference;

    for (let i in bill) {
      var bill_element = document.createElement("li");// Create a <p> element
      bill_element.id = "consulationt_bill-1";// Insert text
      bill_element.className += "consulation_bill";

      var title = document.createElement("h2");
      title.innerHTML = bill[i].Data.Metadaten.Bundesgesetzblaetter.Titel;
      bill_element.appendChild(title);

      var short_title = document.createElement("h3");
      short_title.innerHTML = bill[i].Data.Metadaten.Bundesgesetzblaetter.Kurztitel;
      bill_element.appendChild(short_title);

      var bill_mover = document.createElement("p");
      bill_mover.innerHTML = bill[i].Data.Metadaten.Bundesgesetzblaetter.Begut.EinbringendeStelle;
      bill_element.appendChild(bill_mover);

      var consulation_dates = document.createElement("p");

      var consultation_start_date = document.createElement("div");
      var start_date = bill[i].Data.Metadaten.Bundesgesetzblaetter.Begut.BeginnBegutachtungsfrist
      consultation_start_date.className += "start_date";
      consultation_start_date.innerHTML = "Begutachtungsbeginn:<br /><time datetime='" + start_date + "'>" + start_date + "</time>";
      consulation_dates.appendChild(consultation_start_date);

      var consultation_end_date = document.createElement("div");
      var end_date = bill[i].Data.Metadaten.Bundesgesetzblaetter.Begut.EndeBegutachtungsfrist;
      consultation_end_date.className += "end_date";
      consultation_end_date.innerHTML = "Begutachtungsende:<br /><time datetime='" + end_date + "'>" + end_date + "</time>";
      consulation_dates.appendChild(consultation_end_date);

      bill_element.appendChild(consulation_dates);

      if (typeof bill[i].Data.Dokumentliste.ContentReference != "undefined") {
        var annexes_RIS = bill[i].Data.Dokumentliste.ContentReference;
        var annexes = document.createElement("ul");

        for (let ii in annexes_RIS) {
          if (typeof annexes_RIS[ii].Urls.ContentUrl[2] != "undefined") {
            if(annexes_RIS[ii].Urls.ContentUrl[2].DataType == "Pdf") {
              var annex = document.createElement("li");
              annex.className += "link";

              var url = document.createElement("a");
              url.innerHTML = annexes_RIS[ii].Name.replace(/_/g, " ") + " (PDF)";
              url.href = annexes_RIS[ii].Urls.ContentUrl[2].Url;

              annex.appendChild(url);
              annexes.appendChild(annex);
            } else {
              var annex = document.createElement("li");
              annex.innerHTML = annexes_RIS[ii].Name + " konnte nicht angezegt werden.";
              annexes.appendChild(annex);
            }
          } else if (annexes_RIS[ii].Urls.ContentUrl.DataType == "Pdf") {
            var annex = document.createElement("li");
            annex.className += "link";

            var url = document.createElement("a");
            url.innerHTML = annexes_RIS[ii].Name.replace(/_/g, " ") + " (PDF)";
            url.href = annexes_RIS[ii].Urls.ContentUrl.Url;

            annex.appendChild(url);
            annexes.appendChild(annex);
          } else {
            var annex = document.createElement("li");
            annex.innerHTML = annexes_RIS[ii].Name + " konnte nicht angezegt werden.";
            annexes.appendChild(annex);
          }
        }
        bill_element.appendChild(annexes);
      }

      var url = document.createElement("a");
      url.innerHTML = "Der Begutachtungsentwurf im RIS";
      url.href = bill[i].Data.Metadaten.Allgemein.DokumentUrl;
      bill_element.appendChild(url);

      document.getElementById("consultations-list").appendChild(bill_element);
    }
  }
};

var day = new Date();
day = day.toISOString();
day = day.split("T");

consultations_json.open("GET", "https://data.bka.gv.at/ris/api/v2.5/bundesgesetzblaetter?Applikation=Begut&InBegutachtungAm=" + day[0]);
consultations_json.send();
