/*globals KIP,ACHORD,document*/
ACHORD.Objects.Library = function () {
  "use strict";
  this.CreateElements();
  this.AddEventListeners();
};

ACHORD.Objects.Library.prototype = Object.create(KIP.Objects.Drawable.prototype);

/***************************************************************
 *@name CreateElements
 *@description Creates all elements that are needed to display chords in the library
 ***************************************************************/
ACHORD.Objects.Library.prototype.CreateElements = function () {
  "use strict";
  var opt;
  
  // ======= Create the main elements ========
  this.div = KIP.Functions.CreateSimpleElement("library", "libraryWrapper");
  this.newChordBtn = KIP.Functions.CreateSimpleElement("newChord", "btn", "+New");
  this.chordsContainer = KIP.Functions.CreateSimpleElement("libraryChordContainer", "chordsContainer");
  this.chords = KIP.Functions.CreateSimpleElement("libraryChords", "chords");
  
  
  this.chordsContainer.appendChild(this.newChordBtn);
  this.chordsContainer.appendChild(this.chords);
  this.div.appendChild(this.chordsContainer);
  
  // ====== Create the elements to display at the top of the form ====== 
  this.topBar = KIP.Functions.CreateSimpleElement("libraryBar", "menuBar");
  this.minimize = KIP.Functions.CreateSimpleElement("minLibrary", "minLibrary");
  
  this.topBar.appendChild(this.minimize);
  this.div.appendChild(this.topBar);
  
  // ======== Create the elements that appear at the bottom of the form =======
  this.bottomSec = KIP.Functions.CreateSimpleElement("", "libraryBottom");
  this.chordSelectLbl = KIP.Functions.CreateSimpleElement("", "chordSelectLbl", "Create diagram for: ");
  
  // Create the selector that allows the user to select the tone of the chord
  opt = this.CreateToneOptions();
  this.toneSelector = KIP.Functions.CreateElement({type: "select", id : "toneSelect", children : opt});
  
  // Create the selector that allows the user to select the type of chord
  opt = this.CreateTypeOptions();
  this.typeSelector = KIP.Functions.CreateElement({type: "select", id: "typeSelect", children : opt});
  
  // Create the selector for the root of the chord
  opt = this.CreateToneOptions();
  this.baseLabel = KIP.Functions.CreateSimpleElement("", "chordSelectLbl", "Root");
  this.baseSelector = KIP.Functions.CreateElement({type: "select", id : "baseSelect", children : opt});
  
  // Add a button to click after the chord  details are selected
  this.oldChordBtn = KIP.Functions.CreateSimpleElement("oldChord", "btn", "Add");
  
  // Add all of the appropriate elements
  this.bottomSec.appendChild(this.chordSelectLbl);
  this.bottomSec.appendChild(this.toneSelector);
  this.bottomSec.appendChild(this.typeSelector);
  this.bottomSec.appendChild(this.baseLabel);
  this.bottomSec.appendChild(this.baseSelector);
  this.bottomSec.appendChild(this.oldChordBtn);
  this.div.appendChild(this.bottomSec);
  
  // Create the overlay that allows the chords to be edited
  this.chordOverlay = KIP.Functions.CreateSimpleElement("overlay", "fullOverlay");
  this.bigChord = new ACHORD.Objects.Chord("newChord", "New");
};

/******************************************************************
 *@name AddEventListeners
 *@description Adds event listeners to the library.
 ******************************************************************/
ACHORD.Objects.Library.prototype.AddEventListeners = function () {
  var that = this;
  this.newChordBtn.onclick = function () {
    that.AddChord();
  };
};

/*********************************************************
 *@name AddChord
 *@description Adds a chord to the library. Will eventually create a popup that allows the user to edit the diagram
 *********************************************************/
ACHORD.Objects.Library.prototype.AddChord = function () {
  "use strict";
  
  var c = new ACHORD.Objects.Chord("A", "A Maj");
  c.Draw(this.chords);
  c.AddNote(0, -1, "X");
  c.AddNote(1, 0, "O");
  c.AddNote(2, 2, 2);
  c.AddNote(3, 2, 3);
  c.AddNote(4, 2, 1);
  c.AddNote(5, 0, "O");
};

/******************************************************************
 *@name CreateToneOptions
 *@description Creates the list of options that should be available for the tones of a chord.
 *****************************************************************/
ACHORD.Objects.Library.prototype.CreateToneOptions = function () {
  var tones;
  
  if (ACHORD.Options.Sharps) {
    tones = ACHORD.Constants.SharpTones;
  } else {
    tones = ACHORD.Constants.FlatTones;
  }
  
  return this.CreateOptions(tones);
};

/******************************************************************
 *@name CreateTypeOptions
 *@description Creates the list of options that should be available for the types of chords.
 ******************************************************************/
ACHORD.Objects.Library.prototype.CreateTypeOptions = function () {
  return this.CreateOptions(ACHORD.Constants.ChordTypes);
}

ACHORD.Objects.Library.prototype.CreateOptions = function (src) {
  var arr, i;
  
  arr = [];
  
  for (i = 0; i < src.length; i += 1) {
    arr[i] = {type: "option"};
    arr[i].attr = [{key: "value", val: src[i]}];
    arr[i].before_content = arr[i].id = src[i];
  }
  
  return arr;
}


ACHORD.Globals.Library = new ACHORD.Objects.Library();
ACHORD.Globals.Library.Draw(document.body);