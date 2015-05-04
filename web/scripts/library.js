/*globals ACHORD,document*/
ACHORD.Objects.Library = function () {
  "use strict";
  this.CreateElements();
  this.AddEventListeners();
};

ACHORD.Objects.Library.prototype.CreateElements = function () {
  "use strict";
  var opt;
  
  // ======= Create the main elements ========
  this.div = ACHORD.Functions.CreateSimpleElement("library", "libraryWrapper");
  this.newChordBtn = ACHORD.Functions.CreateSimpleElement("newChord", "btn", "+New");
  this.chordsContainer = ACHORD.Functions.CreateSimpleElement("libraryChordContainer", "chordsContainer");
  this.chords = ACHORD.Functions.CreateSimpleElement("libraryChords", "chords");
  
  
  this.chordsContainer.appendChild(this.newChordBtn);
  this.chordsContainer.appendChild(this.chords);
  this.div.appendChild(this.chordsContainer);
  
  // ====== Create the elements to display at the top of the form ====== 
  this.topBar = ACHORD.Functions.CreateSimpleElement("libraryBar", "menuBar");
  this.minimize = ACHORD.Functions.CreateSimpleElement("minLibrary", "minLibrary");
  
  this.topBar.appendChild(this.minimize);
  this.div.appendChild(this.topBar);
  
  // ======== Create the elements that appear at the bottom of the form =======
  this.bottomSec = ACHORD.Functions.CreateSimpleElement("", "libraryBottom");
  this.chordSelectLbl = ACHORD.Functions.CreateSimpleElement("", "chordSelectLbl", "Create diagram for: ");
  
  opt = this.CreateToneOptions();
  this.toneSelector = ACHORD.Functions.CreateElement({type: "select", id : "toneSelect", children : opt});
  
  opt = this.CreateTypeOptions();
  this.typeSelector = ACHORD.Functions.CreateElement({type: "select", id: "typeSelect", children : opt});
  
  opt = this.CreateBaseOptions();
  this.baseLabel = ACHORD.Functions.CreateSimpleElement("", "chordSelectLbl", "Root");
  this.baseSelector = ACHORD.Functions.CreateElement({type: "select", id : "baseSelect", children : opt});
  
  this.oldChordBtn = ACHORD.Functions.CreateSimpleElement("oldChord", "btn", "Add");
  
  this.bottomSec.appendChild(this.chordSelectLbl);
  this.bottomSec.appendChild(this.toneSelector);
  this.bottomSec.appendChild(this.typeSelector);
  this.bottomSec.appendChild(this.baseLabel);
  this.bottomSec.appendChild(this.baseSelector);
  this.bottomSec.appendChild(this.oldChordBtn);
  this.div.appendChild(this.bottomSec);
  
  // Create the overlay that allows the chords to be edited
  this.chordOverlay = ACHORD.Functions.CreateSimpleElement("overlay", "fullOverlay");
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
  
  var c = new ACHORD.Objects.Chord("A", "G# Maj");
  c.Draw(this.chords);
  c.AddNote(0, 2, 1);
  c.AddNote(1, 4, 3);
  c.AddNote(2, 4, 4);
  c.AddNote(3, 3, 2);
  c.AddNote(4, 2, 1);
  c.AddNote(5, 2, 1);
};

/***********************************************************
 *@name Draw
 *@description Draws the elements for the library sidebar.
 *@param HTMLElement parent The element to add the library div to
 ***********************************************************/
ACHORD.Objects.Library.prototype.Draw = function (parent) {
  "use strict";
  
  this.parent = parent || this.parent;
  
  if (this.div.parentNode) {
    this.div.parentNode.removeChild(this.div);
  }
  
  this.parent.appendChild(this.div);
  
};

ACHORD.Objects.Library.prototype.CreateToneOptions = function () {
  var tones;
  
  if (ACHORD.Options.Sharps) {
    tones = ACHORD.Constants.SharpTones;
  } else {
    tones = ACHORD.Constants.FlatTones;
  }
  
  return this.CreateOptions(tones);
};

ACHORD.Objects.Library.prototype.CreateBaseOptions = function () {
  return ACHORD.Objects.Library.prototype.CreateToneOptions();
}

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