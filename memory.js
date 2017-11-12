// Programmcode Buchstabenmemory

$(document).ready(function() {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var buchstabenImSpiel = [];

  $('#los_gehts').on('click', spielStarten);

  function spielStarten() {
    anzahlPaare = parseInt( $("#anzahl-paare").val() );
    
    if(anzahlPaare < 3 || anzahlPaare > alphabet.length) {
      $("#spielfeld").html("<h2>Nicht weniger als 3, nicht mehr als " + alphabet.length + "!</h2>");     
    }
    else {
      // Ganzes Alphabet mischen
      var gemischteBuchstaben = alphabet.split("");
      mischen(gemischteBuchstaben);
      
      // So viele Buchstaben wie beötigt auswählen:
      gemischteBuchstaben = gemischteBuchstaben.slice(0, anzahlPaare);
      
      // Großbuchstaben dazu:
      for(var i=0; i < anzahlPaare; i++) {
        gemischteBuchstaben.push(gemischteBuchstaben[i].toUpperCase());
      }
      
      // Jetzt haben wir alle Karten zusammen, wieder mischen:
      mischen(gemischteBuchstaben);

      $("#spielfeld").html("<h2>Ausgewählt: " + anzahlPaare + " Paare " + gemischteBuchstaben.join('') + "<h2>");
    }
  }  
});

// Ein Array mischen
function mischen(elemente) {
  for(var i=0; i < elemente.length; i++) {
    var zufallsIndex = Math.floor(Math.random()*(i+1)); 
    var element = elemente[zufallsIndex]; 
    elemente[zufallsIndex] = elemente[i];
    elemente[i] = element;
  }
}


