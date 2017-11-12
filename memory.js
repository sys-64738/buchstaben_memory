// Programmcode Buchstabenmemory

(function () {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var anzahlPaare;
  var $spielfeld;
  var $status;
  var $aufgedeckteKarten = [];

  // Nach dem Laden der Seite die Ereignisse binden:
  $(document).ready(function() {
    $spielfeld  = $("#spielfeld");
    $status = $("#status");
    $('#los_gehts').on('click', spielStarten);
    $(document).on('click', '.karte',karteGeklickt);
  });

  function spielStarten() {
    anzahlPaare = parseInt( $("#anzahl-paare").val() );    
    if(anzahlPaare < 3 || anzahlPaare > alphabet.length) {
      $status.html("Nicht weniger als 3, nicht mehr als " + alphabet.length + "!");     
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
  
  // Karte aufdecken oder wieder zuklappen
  function karteGeklickt(e) {
    var buchstabe = $(this).attr('data-buchstabe');
    var $kartenInhalt = $(this).find('.karten-inhalt');
    if($kartenInhalt.hasClass('verdeckt')) {
      if($aufgedeckteKarten.length == 2) {
        $status.html("Nicht mehr als zwei Karten auf einmal aufdecken!");        
      }
      else {
        $kartenInhalt.removeClass('verdeckt');
        $kartenInhalt.find('p').removeClass('unsichtbar');
        $aufgedeckteKarten.push(buchstabe);
        if($aufgedeckteKarten.length == 2) {
          if($aufgedeckteKarten[0].toUpperCase() == $aufgedeckteKarten[1].toUpperCase()) {
            $status.html("Super!");
            $aufgedeckteKarten = [];
            if($spielfeld.find('.verdeckt').length == 0) {
              $status.html("Gewonnen!!! Nochmal?");
            }
          } 
          else {
            $status.html("Passt nicht, wieder verdecken!");
          }
        }
        
      }
    }
    else {
      $aufgedeckteKarten.splice($aufgedeckteKarten.indexOf(buchstabe), 1);
      $kartenInhalt.addClass('verdeckt');
      $kartenInhalt.find('p').addClass('unsichtbar');
    }    
  };

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
    $status.html("Es geht los mit " + karten.length + " Karten!");

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
      $neueKarte.attr('data-buchstabe', karten[i]);
      $neueKarte.find("p").html(karten[i]);      
      $neueKarte.removeClass("unsichtbar");
      $spielfeld.append($neueKarte);
    }
  }
})();


