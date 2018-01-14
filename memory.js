// Programmcode Buchstabenmemory

// Eine Pseudo-Funktion (IIFE) als Gültigkeitsbereich für unsere Variablen
(function () { 
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var anzahlPaare;
  var $spielfeld;

  // Nach dem Laden der Seite die Ereignisse binden:
  $(document).ready(function() {
    $spielfeld  = $("#spielfeld");
	 
    startDialogAnzeigen();

    $('#neues-spiel').button().on('click', startDialogAnzeigen);
    
    $(document).on('click', '.karten-inhalt.verdeckt', karteGeklickt);

    $('#karten-minus').button().on('click', function() {
      anzahlKarten = parseInt( $("#anzahl-karten").text() );
      if(anzahlKarten > 6) {
        anzahlKarten -= 2;
        $('#anzahl-karten').html(anzahlKarten);
      }
    } );

    $('#karten-plus').button().on('click', function() {
      anzahlKarten = parseInt( $("#anzahl-karten").text() );
      if(anzahlKarten < 52) {
        anzahlKarten += 2;
        $('#anzahl-karten').html(anzahlKarten);
      }
    } );

    $('#anzahl-karten').button().on('click', function() {
      anzahlKarten = parseInt( $("#anzahl-karten").text() );
      if(anzahlKarten < 52) {
        anzahlKarten += 2;
      }
      else {
        anzahlKarten = 6;
      }  
      $('#anzahl-karten').html(anzahlKarten);     
    } );

  });

  // Dialog anzeigen zur Auswahl der Kartenanzahl
  function startDialogAnzeigen() {
    dialog = $( "#start-dialog" ).dialog({
      modal: true,
      width: 'auto',
      height: 'auto',
      position: { my: "top", at: "top", of: window },
      title: "Buchstaben-Memory - Neues Spiel",
      buttons: {
        "Start!": function() {
          $(this).dialog("close");
        }
      },
      close : function() {
        spielStarten();
      }
    });     
  }
  
  function spielStarten() {
    anzahlPaare = parseInt( $("#anzahl-karten").text() ) / 2;    
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
  
  // Karte aufdecken oder wieder zuklappen
  function karteGeklickt(e) {
    e.preventDefault();
    
    var $karte = $(this);

    var $aufgedeckteKarten = $spielfeld.find('.aufgedeckt');
    if($aufgedeckteKarten.length >= 2) {
      // Erst warten, aufgedeckte Karten wieder verdeckt wurden!
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
        // passendes Paar    
        $aufgedeckteKarten.removeClass('aufgedeckt')
                          .addClass('paar-passt', 500, function() {
          $(this).removeClass('paar-passt', 4000);
        } );
        
        if($spielfeld.find('.verdeckt').length == 0) {
          // Alle aufgedeckt
          $spielfeld.addClass('paar-passt', 4000, function() {
            $(this).removeClass('paar-passt', 4000, startDialogAnzeigen);
          } );
        }
      } 
      else {
        // passt nicht
        $aufgedeckteKarten.addClass('paar-passt-nicht', 1000, function() {
          setTimeout(function() {
            $aufgedeckteKarten.find('.karten-text').addClass('unsichtbar', 500);
            $aufgedeckteKarten.switchClass('aufgedeckt paar-passt-nicht', 'verdeckt', 500);
          }, 3000 );
        } );
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
    var spielfeldBreite = Math.min($spielfeld.width(), $spielfeld.height() );
    $spielfeld.attr('style', 'width: ' + spielfeldBreite + 'px');

    // Die Karten sollen soweit möglich in einem Quadrat ausgelegt werden
    var anzahlSpalten = Math.sqrt(karten.length);
    if(Math.floor(anzahlSpalten * 100) == Math.floor(anzahlSpalten) * 100) {
      anzahlSpalten = Math.floor(anzahlSpalten); // passt genau, z.B. 4x4 Karten
    }
    else {
      anzahlSpalten = Math.floor(anzahlSpalten) + 1; // eine weitere Spalte benötigt
    }  

    
    // Kartengröße an Spielfeldgröße anpassen:
    var kartenbreite = Math.floor( spielfeldBreite / anzahlSpalten );   
    
    var $musterKarte = $("#musterkarte");
    $musterKarte.attr('style', 'width: ' + kartenbreite + "px; height:" + kartenbreite + 'px;');      
    
    // Karten verdeckt auslegen:
    $spielfeld.empty();
    
    
    kartenAnimieren = function(kartenNr) {
      $neueKarte = $musterKarte.clone();
      
      // Text-Markierung deaktivieren (der Buchstabe wurde beim Anklicken sonst markiert)
      $neueKarte.attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart dragstart', false);
        
      $neueKarte.attr('id', "karte" + kartenNr);
      $neueKarte.find('.karten-inhalt').attr('data-buchstabe', karten[kartenNr]);
      $neueKarte.find(".karten-text").html(karten[kartenNr]);      
      $spielfeld.append($neueKarte.fadeIn('fast').removeClass('unsichtbar'));
      
      kartenNr++;
      if(kartenNr < karten.length) {    
        setTimeout(function() { 
          kartenAnimieren(kartenNr);                                    
        }, 250);
      }
    };
    
    kartenAnimieren(0);
  }
})();


