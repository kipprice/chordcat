/*globals ACHORD,window*/

ACHORD.Objects.Chord = function (id, name) {
  
  this.id = id;
  this.name = name;
  
  this.stringDivs = [];
  this.fretDivs = [];
  this.noteDivs = [];
  this.notes = [];
  this.stringLbls = [];
  this.stringLblsDiv = [];
  
  this.CreateElements();
  this.AddElements();
  this.AddListeners();
};

/*********************************************************
 *@name Draw [Chord]
 *@description  Draws the elements for the chord on the provided parent
 *@param  parent  The parent element to add the div to
 ********************************************************/
ACHORD.Objects.Chord.prototype.Draw = function (parent) {
  "use strict";
  var width;
  
  parent = parent || this.parent;
  
  if (this.div.parentNode) {
    this.div.parentNode.removeChild(this.div);
  }
  
  parent.appendChild(this.div);
  
  this.fretboardDiv.style.height = (this.fretboardDiv.offsetWidth * 1.2) + "px";
  
  this.parent = parent;
  
};

/*********************************************************
 *@name Add Elements [Chord]
 *@description  Adds the elements of the chord to the main div.
 *********************************************************/
ACHORD.Objects.Chord.prototype.AddElements = function () {
  "use strict";
  var root;
  root = this.fretboardDiv;
  
  // Append the chord diagram part
  this.div.appendChild(this.chordDiv);
  
  // Add all of the frets ...
  root.appendChild(this.fretContainer);
  
  // ... and all of the strings...
  root.appendChild(this.stringContainer);
  
  // ... and finally all of the notes
  root.appendChild(this.noteContainer);
  
  // Add the fretboard to the chord div
  this.chordDiv.appendChild(root);
};

/****************************************************
 *@name Resize
 *@description Resizes all elements based on how much space is actually available. Mostly used for fonts.
 ****************************************************/
ACHORD.Objects.Chord.prototype.Resize = function () {
  var height, fSize, resizeMap;
  
  resizeMap = function (elem, idx, arr) {
    var child;
    if (elem) {
      child = elem.children[0];
      if (child) {
        height = elem.offsetHeight;
        fSize = child.style.fontSize = child.style.height = Math.floor(height * 0.75) + "px";
      }
    }
  };
  
  // Resize the font to fit within the actual note display
  this.noteDivs = this.noteDivs.map(resizeMap);
  
  // Resize the top labels
  this.stringLblsDiv = this.stringLblsDiv.map(resizeMap);
  
  // Resize the label for the chord itself, and the top elements
  //this.nameDiv.style.fontSize = fSize;
};

/************************************************************
 *@name Create Elements [Chord]
 *@description  Creates all elements (that we currently know of) for the chord diagram.
 ************************************************************/
ACHORD.Objects.Chord.prototype.CreateElements = function () {
  "use strict";
  var idx;
  
  this.div = ACHORD.Functions.CreateSimpleElement(this.id + "|chord", "chord_root");
  
  // This will eventually include things like note names and stuff
  this.chordDiv = ACHORD.Functions.CreateSimpleElement(this.id, "chord_base");
  
    // Draw the name and open/closed strings
  this.nameDiv = ACHORD.Functions.CreateSimpleElement(this.id + "|name", "chord_name", this.name);
  this.stringLblContDiv = ACHORD.Functions.CreateSimpleElement(this.id + "|status", "string_status");
  this.startFretDiv = ACHORD.Functions.CreateSimpleElement(this.id + "|start_fret", "start_fret");
  
  this.chordDiv.appendChild(this.nameDiv);
  this.chordDiv.appendChild(this.stringLblContDiv);
  
  // Create the overarching container for the fretboard
  this.fretboardDiv = ACHORD.Functions.CreateSimpleElement(this.id + "|fretboard", "fretboard");
  
  // Create the container for the strings & frets
  this.fretContainer = ACHORD.Functions.CreateSimpleElement(this.id + "|frets", "fret_base");
  this.stringContainer = ACHORD.Functions.CreateSimpleElement(this.id + "|strings", "string_base");
  this.noteContainer = ACHORD.Functions.CreateSimpleElement(this.id + "|notes", "notes_base");
  
   // Create all of the fret elements
  for (idx = 0; idx < 5; idx += 1) {
    this.fretDivs[idx] = ACHORD.Functions.CreateSimpleElement(this.id + "|f" + idx, "fret");
    this.fretContainer.appendChild(this.fretDivs[idx]);
  }
  
  // Create all of the string elements
  for (idx = 0; idx < 6; idx += 1) {
    this.stringDivs[idx] = ACHORD.Functions.CreateSimpleElement(this.id + "|" + idx, "string");
    this.stringContainer.appendChild(this.stringDivs[idx]);
  }
  
}

/*****************************************************************************
 *@name AddNote
 *@description Adds a note to our collection and draws a symbol on the chord
 *@param int string The string of the chord diagram that this should be added to
 *@param int fret The fret gap that it should be added to
 *@param int fingering What finger to use in this chord diagram
 ****************************************************************************/
ACHORD.Objects.Chord.prototype.AddNote = function (string, fret, fingering) {
  "use strict";
  var idx, fDiv, w, h;
  idx = this.notes.length;
  
  if (fret === -1) {
    
    this.stringLbls[idx] = "X";
    this.stringLblsDiv[idx] = ACHORD.Functions.CreateSimpleElement(this.id + "|sLbl|" + string, "string_lbl", "X");
    this.stringLblsDiv[idx].style.left = ((this.stringDivs[string].offsetLeft - (3)) + "px");
    this.stringLblContDiv.appendChild(this.stringLblsDiv[idx]);
    
    return;
  
  } else if (fret === 0) {
    
    this.stringLbls[idx] = "O";
    this.stringLblsDiv[idx] = ACHORD.Functions.CreateSimpleElement(this.id + "|sLbl|" + string, "string_lbl", "O");
    this.stringLblsDiv[idx].style.left = ((this.stringDivs[string].offsetLeft - (3)) + "px");
    this.stringLblContDiv.appendChild(this.stringLblsDiv[idx]);
    
    return;
  }
  
  // Calculate the MIDI number for the note
  this.notes[idx] = ACHORD.Options.Strings[string] + (fret);
  
  // Create a div to display the note
  this.noteDivs[idx] = ACHORD.Functions.CreateSimpleElement(this.id + "|n" + idx, "note");
  if (fingering) {
    fDiv = ACHORD.Functions.CreateSimpleElement(this.id + "|n|fingering" + idx, "note_finger", fingering);
    this.noteDivs[idx].appendChild(fDiv);
  }
  
  this.noteContainer.appendChild(this.noteDivs[idx]);
  w = this.noteDivs[idx].offsetWidth;
  h = this.noteDivs[idx].offsetHeight;
  
  // Move the note to the appropriate position
  this.noteDivs[idx].style.left = ((this.stringDivs[string].offsetLeft - (w / 2)) + "px");
  this.noteDivs[idx].style.top = ((this.fretDivs[fret - 1].offsetTop + (this.fretDivs[fret - 1].offsetHeight / 2) - (h / 2)) + "px");
  
  this.Resize();
  
}

/**********************************************************
 *@name         PlayChord
 *@description  Plays all of the notes associated with this chord
 *@param        len   The length that the chord should be played
 *********************************************************/
ACHORD.Objects.Chord.prototype.PlayChord = function (len) {
  "use strict";
  if (!this.notes) {
    return;
  }
  
  ACHORD.Functions.PlayChord(this.notes, len);
};

/**********************************************************
 *@name AddListeners
 *@description Adds listeners to the appropriate elements in the chord diagram.
 **********************************************************/
ACHORD.Objects.Chord.prototype.AddListeners = function () {
  "use strict";
  var auxStringListener, that, i;
  
  that = this;
  
  auxStringListener = function (elem, idx) {
    elem.onclick = function (e) {
      that.current_string = idx;
      
      
      that.CheckForNewNote();
    }
  }
  
  for (i = 0; i < this.stringDivs.length; i += 1) {
    auxStringListener(this.stringDivs[i], i);
  }
  
  this.current_fret = -1;
  this.current_string = -1;
  
  
  window.onresize = function (e) {
    that.Resize();
  }
};

ACHORD.Objects.Chord.prototype.FindPositions = function (tone, chord_type) {
  
};
