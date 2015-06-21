/*globals KIP,ACHORD,window*/

ACHORD.Objects.Chord = function (id, name) {
  
  this.id = id;
  this.name = name;
  
  this.stringDivs = [];
  this.fretDivs = [];
  this.ghostNotes = [];
  this.notes = [];
  this.noteMIDI = [];
  this.stringLbls = [];
  this.stringLblsDiv = [];
  this.fingers = [];

  this.string_gap = 20;
  this.fret_gap = 22;

  this.font = {
    font : {
      family: "Segoe UI",
      size: "16px",
      style: "normal",
      weight: "normal",
      color: "#FFF"
    }
  }
  
  this.CreateElements();
  this.AddElements();
  this.AddListeners();
};

ACHORD.Objects.Chord.prototype = Object.create(KIP.Objects.Drawable.prototype);

/*********************************************************
 *@name Add Elements [Chord]
 *@description  Adds the elements of the chord to the main div.
 *********************************************************/
ACHORD.Objects.Chord.prototype.AddElements = function () {
  "use strict";
  
  // Append the chord diagram part
  this.div.appendChild(this.chordDiv);
  this.AppendChild(this.fretboard);
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
  
  this.div = KIP.Functions.CreateSimpleElement(this.id + "|chord", "chord_root");
  
  // This will eventually include things like note names and stuff
  this.chordDiv = KIP.Functions.CreateSimpleElement(this.id, "chord_base");
  
    // Draw the name and open/closed strings
  this.nameDiv = KIP.Functions.CreateSimpleElement(this.id + "|name", "chord_name", this.name);
  this.stringLblContDiv = KIP.Functions.CreateSimpleElement(this.id + "|status", "string_status");
  this.startFretDiv = KIP.Functions.CreateSimpleElement(this.id + "|start_fret", "start_fret");
  
  this.chordDiv.appendChild(this.nameDiv);
  this.chordDiv.appendChild(this.stringLblContDiv);
  
  this.CreateSVG();
  
}

ACHORD.Objects.Chord.prototype.CreateSVG = function () {
  "use strict";
  var f, s, w, h, stroke, fill, style, fret_h, fret_y, fret_max, string_max, n, addListeners, half_s_gap, half_f_gap;
  this.fretboard = new KIP.Objects.SVGDrawable(this.id + "|fretboard");
  
  fret_max = (ACHORD.Options.MaxStretch + 3);
  string_max = ACHORD.Options.StringNum;
  w = ((string_max - 1) * this.string_gap) + 1;
  h = ((fret_max - 1) * this.fret_gap) + 1;
  
  stroke = {type : "None"};
  fill = {type: "solid", color: "#333"}
  style = {stroke: stroke, fill : fill};
  
  // Add the frets, along with special handling for the top and bottom
  for (f = 0; f < fret_max; f += 1) {
    fret_h = 1;
    fret_y = f * this.fret_gap;
    
    if (f === 0) {
      fret_h = 8;
      fret_y = -8;
    } else if (f === (fret_max - 1)) {
      fret_h = 5;
    }
    
    this.fretDivs[f] = this.fretboard.AddRectangle(0, fret_y, w, fret_h, style, this.id + "|f" + f);
  }
  
  // Add the strings
  for (s = 0; s < string_max; s += 1) {
    this.stringDivs[s] = this.fretboard.AddRectangle((s * this.string_gap), 0, 1, h, style, this.id + "|s" + s);
  }
  
  addListeners = function (elem, s, f) {
    var that = this;
    elem.addEventListener("click", function () {
      if (KIP.Functions.HasCSSClass(elem, "note_ghost")) {
        that.AddNote(s, f);
      } else {
        KIP.Functions.AddCSSClass(elem, "note_ghost");
        KIP.Functions.RemoveCSSClass(elem, "note");
        that.fretboard.AdjustStyle("", elem, {stroke : {type: "solid", color: "#AAA"}});
      }
    });
  }

  // Add the listeners/notes
  fill = {type: "solid", color: "#AAA"};
  half_f_gap = (this.fret_gap / 2);
  half_s_gap = (this.string_gap / 2);

  for (s = 0; s < string_max; s += 1) {
    if (!this.ghostNotes[s]) this.ghostNotes[s] = [];
    for (f = 0; f < fret_max; f += 1) {
      n = this.fretboard.AddCircle((s * this.string_gap), ((f * this.fret_gap) + half_f_gap), Math.min(half_s_gap, half_f_gap), style, this.id + "|n|" + s + "|" + f, "note_ghost");
      addListeners(n, s, f);
      this.ghostNotes[s][f] = n;
    }
  }
  
  
  // Update the size so we can draw it
  this.fretboard.AdjustSize(47, 70, "-1 -8 102, 140");
  this.fretboard.div.style.fill = "#C30";
  
}

ACHORD.Objects.Chord.prototype.AfterDrawChildren = function () {
  this.fretboard.AdjustSize((this.chordDiv.offsetWidth - 10), this.chordDiv.offsetTop);
};

/*****************************************************************************
 *@name AddNote
 *
 *@description Adds a note to our collection and draws a symbol on the chord
 *
 *@param int string The string of the chord diagram that this should be added to
 *@param int fret The fret gap that it should be added to
 *@param int fingering What finger to use in this chord diagram
 ****************************************************************************/
ACHORD.Objects.Chord.prototype.AddNote = function (string, fret, fingering) {
  "use strict";
  var idx, note_elem;
  
  if (fret === -1) {
    // TODO
    return;
  } else if (fret === 0) {
    // TODO
    return;
  }
  
  fret -= 1;

  // Apply the appropriate svg styles
  note_elem = this.fretboard.GetElement(this.id + "|n|" + string + "|" + fret);
  KIP.Functions.RemoveCSSClass(note_elem, "note_ghost");
  KIP.Functions.AddCSSClass(note_elem, "note");
  this.fretboard.AdjustStyle("", note_elem, {stroke : {type: "solid", color: "#000"}});

  // Calculate the fingering if we didn't get it passed in
  if (!fingering) fingering = this.CalculateOneFingering(string, fret);
  this.fretboard.AddText(note_elem, fingering, 5, 5, this.font, this.id + "|nt|" + string + "|" + fret, "fingering");

  // Actually save off the note and its frequency
  idx = this.notes.length;
  this.notes[idx] = {
    string : string, 
    fret: fret, 
    fingering: fingering,
    MIDI: ACHORD.Options.Strings[string] + (fret)
  };
  this.noteMIDI[idx] = ACHORD.Options.Strings[string] + (fret);

  return;
  
};

ACHORD.Objects.Chord.prototype.CalculateOneFingering = function (string, fret) {
  "use strict";
  var s, f, finger, new_f, idx;
  
  new_f = {fret: fret, string : string};

  // Loop through all fingers, starting with 1
  for (finger = 1; finger < this.fingers.length; finger += 1) {
    if (this.fingers[finger] && this.fingers[finger].fret) {
      
      // Grab the fret and the string of this fingering currently
      f = this.fingers[finger].fret;
      s = this.fingers[finger].string
      
      // If the fret is lower than the current fret for this finger, bump all others up
      if (fret < f) {
        this.fingers.splice(finger, 0, new_f);
        return finger;
      
      // If they are at the same fret, move to the appropriate string
      // TODO: Handle barre chords
      } else if (fret === f) {
        
        if (s) {
          
          // If it's a lower string, it deserves a lower finger
          if (string < s) {
            this.fingers.splice(finger, 0, new_f);
            return finger;
          
          // If it's higher, insert
          } else if (string > s) {
            this.fingers.splice(finger + 1, 0, new_f);
            return (finger + 1);
          }
        }
      }
    }
  }
  
  idx = this.fingers.length;
  this.fingers[idx] = new_f;
  return (idx);
};

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

};

ACHORD.Objects.Chord.prototype.FindPositions = function (tone, chord_type) {
  
};
