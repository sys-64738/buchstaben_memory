// Programmcode Buchstabenmemory

(function () {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var anzahlPaare;

  // Nach dem Laden der Seite die Ereignisse binden:
  $(document).ready(function() {
    $('#los_gehts').on('click', spielStarten);
  });

  function spielStarten() {
    anzahlPaare = parseInt( $("#anzahl-paare").val() );    
    if(anzahlPaare < 3 || anzahlPaare > alphabet.length) {
      $("#status").html("Nicht weniger als 3, nicht mehr als " + alphabet.length + "!");     
    }
    else {
      // Ganzes Alphabet mischen
      var gemischteBuchstaben = alphabet.split("");
      mischen(gemischteBuchstaben);
      
      // So viele Buchstaben wie benötigt auswählen:
      gemischteBuchstaben = gemischteBuchstaben.slice(0, anzahlPaare);
      
      // Großbuchstaben dazu:
      for(var i=0; i < anzahlPaare; i++) {
        gemischteBuchstaben.push(gemischteBuchstaben[i].toUpperCase());
      }
      
      // Jetzt haben wir alle Karten zusammen, wieder mischen:
      mischen(gemischteBuchstaben);

      // Schließlich die verdeckten Karten auslegen:
      kartenAuslegen(gemischteBuchstaben);
    }
  }  

    // Ein Array mischen
  function mischen(elemente) {
    for(var i=0; i < elemente.length; i++) {
      var zufallsIndex = Math.floor(Math.random()*(i+1)); 
      var element = elemente[zufallsIndex]; 
      elemente[zufallsIndex] = elemente[i];
      elemente[i] = element;
    }
  }

  // Karten auslegen
  function kartenAuslegen(karten) {
    $("#status").html("Ausgewählt: " + anzahlPaare + " Paare " + karten.join('') );

    var $spielfeld  = $("#spielfeld");
    console.log("Breite: " + $spielfeld.width() );
    console.log("Höhe: " + $spielfeld.height() );
    var anzahlSpalten = Math.sqrt(karten.length);
    if(Math.floor(anzahlSpalten * 100) == Math.floor(anzahlSpalten) * 100) {
      anzahlSpalten = Math.floor(anzahlSpalten)
    }
    else {
      anzahlSpalten = Math.floor(anzahlSpalten) + 1;
    }  

    var spielfeldBreite = Math.min($spielfeld.width(), $spielfeld.height() );
    $spielfeld.attr('style', 'width: ' + spielfeldBreite + 'px');
    var kartenbreite = Math.floor( spielfeldBreite / anzahlSpalten );   
    var $musterKarte = $("#musterkarte");
    $musterKarte.attr('style', 'width: ' + kartenbreite + "px; height:" + kartenbreite + 'px;');
    
    
    
    $spielfeld.empty();
    for(var i=0; i < karten.length; i++) {
      $neueKarte = $musterKarte.clone();
      $neueKarte.attr('id', "karte" + i);
      $neueKarte.find("p").html(karten[i]);      
      $neueKarte.removeClass("unsichtbar");
      $spielfeld.append($neueKarte);
    }
  }
})();


