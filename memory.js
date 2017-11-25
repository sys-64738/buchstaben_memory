// Programmcode Buchstabenmemory

// Eine Pseudo-Funktion (IIFE) als Gültigkeitsbereich für unsere Variablen
(function () { 
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var anzahlPaare;
  var $spielfeld;
  var $status;

  // Nach dem Laden der Seite die Ereignisse binden:
  $(document).ready(function() {
    $spielfeld  = $("#spielfeld");
    $status = $("#status");
    $('#los_gehts').button().on('click', spielStarten);
    $('#anzahl-paare').spinner();
    $(document).on('click', '.karten-inhalt.verdeckt', karteGeklickt);
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
    e.preventDefault();
    
    var $karte = $(this);

    var $aufgedeckteKarten = $spielfeld.find('.aufgedeckt');

    if($aufgedeckteKarten.length >= 2) {
      $status.html("Moment!");
      return;
    }
    var buchstabe = $karte.attr('data-buchstabe');

    $karte.removeClass('verdeckt');
    $karte.addClass('aufgedeckt');
    $karte.find('.karten-text').removeClass('unsichtbar');

    $aufgedeckteKarten = $spielfeld.find('.aufgedeckt');
    if($aufgedeckteKarten.length == 2) {
      $k1 = $aufgedeckteKarten.eq(0);
      $k2 = $aufgedeckteKarten.eq(1);
      if($k1.attr('data-buchstabe').toUpperCase() 
          == $k2.attr('data-buchstabe').toUpperCase()) {
        $status.html("Super!");

        $aufgedeckteKarten.removeClass('aufgedeckt')
                          .addClass('paar-passt', 500, function() {
          $(this).removeClass('paar-passt', 4000);
        } );

        if($spielfeld.find('.verdeckt').length == 0) {
          $status.html("Gewonnen!!! Nochmal?");
          $spielfeld.addClass('paar-passt', 2000, function() {
            $(this).removeClass('paar-passt', 3000);
          } );
        }
      } 
      else {
        $aufgedeckteKarten.addClass('paar-passt-nicht', 3000, function() {
          $(this).find('.karten-text').addClass('unsichtbar', 1000);
          $(this).switchClass('aufgedeckt paar-passt-nicht', 'verdeckt', 1000);
        } );
        $status.html("Passt nicht!");
      }
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

    // Die Karten sollen soweit möglich in einem Quadrat ausgelegt werden
    var anzahlSpalten = Math.sqrt(karten.length);
    if(Math.floor(anzahlSpalten * 100) == Math.floor(anzahlSpalten) * 100) {
      anzahlSpalten = Math.floor(anzahlSpalten); // passt genau, z.B. 4x4 Karten
    }
    else {
      anzahlSpalten = Math.floor(anzahlSpalten) + 1; // eine weitere Spalte benötigt
    }  

    var spielfeldBreite = Math.min($spielfeld.width(), $spielfeld.height() );
    $spielfeld.attr('style', 'width: ' + spielfeldBreite + 'px');
    
    // Kartengröße an Spielfeldgröße anpassen:
    var kartenbreite = Math.floor( spielfeldBreite / anzahlSpalten );   
    
    var $musterKarte = $("#musterkarte");
    $musterKarte.attr('style', 'width: ' + kartenbreite + "px; height:" + kartenbreite + 'px;');      
    
    // Karten verdeckt auslegen:
    $spielfeld.empty();
    for(var i=0; i < karten.length; i++) {
      $neueKarte = $musterKarte.clone();
      
      // Text-Markierung deaktivieren (der Buchstabe wurde beim Anklicken sonst markiert)
      $neueKarte.attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart dragstart', false);
        
      $neueKarte.attr('id', "karte" + i);
      $neueKarte.find('.karten-inhalt').attr('data-buchstabe', karten[i]);
      $neueKarte.find(".karten-text").html(karten[i]);      
      $neueKarte.removeClass("unsichtbar");
      $spielfeld.append($neueKarte);
    }
  }
})();


