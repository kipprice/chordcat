/*globals document*/

var ACHORD = {
  Objects : {},
  Functions : {},
  Constants : {},
  Globals : {},
  Options : {},
  Test : {}
};

// Initialization of the option values
ACHORD.Options.Tempo = 120;
ACHORD.Options.StringNum = 6;
ACHORD.Options.Strings = [64, 69, 74, 79, 83, 88];
ACHORD.Options.Sharps = true;

ACHORD.Constants.FlatTones = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
ACHORD.Constants.SharpTones = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
ACHORD.Constants.ChordTypes = ["Major", "Minor", "Diminished", "Augmented", "7", "Maj 7", "Min 7", "7 Aug 5", "7 Flat 5", "Maj 7 Flat 3", "Min 7 Flat 5", "Sus 4", "7 Sus 4", "Sus 2", "6", "Min 6", "9", "Maj 9", "Min 9", "9 Aug 5", "9 Flat 5", "7 Aug 9", "7 Flat 9", "6 Add 9", "11", "Aug 11", "13", "13 Flat 9", "13 Flat 9 Flat 5"];

/*************************************************************************
 *@name         Create Simple Element
 *@description  Creates a div element with the provided id, class, content, and attributes.
 *@param        id      The ID to assign the element. Optional.
 *@param        cls     The class to assign the element. Optional.
 *@param        content What to include as the contents of the div. Optional.
 *@param        attr    An array of key-value pairs that sets all other attributes for the element. Optional.
 *@returns      The created element, with all specified parameters included.
 *************************************************************************/
ACHORD.Functions.CreateSimpleElement = function (id, cls, content, attr) {
  var elem, a;
  
  elem = document.createElement("div");
  
  // Add the ID if we have it
  if (id) {
    elem.setAttribute("id", id);
  }
  
  // Add the class if we have it
  if (cls) {
    elem.setAttribute("class", cls);
  }
  
  // Add the innerHTML if we have it
  if (content) {
    elem.innerHTML = content;
  }
  
  // Loop through our list of attributes and set them too
  for (a in attr) {
    if (attr.hasOwnProperty(a)) {
      try {
        elem.setAttribute(attr[a].key, attr[a].val);
      } catch (e) {
        continue;
      }
    }
  }
  
  return elem;
};

/*************************************************
 *@name         CreateElement
 *@description  Creates an HTML element with the attributes that are passed in through the object.
 *              The attributes accepted are "id", "cls", "attr", "children", "type", "before_content", and "after_content"
 *@param        obj   The object to base the element off of.
 *@returns      The HTML element with all attributes specified by the object
 *************************************************/
ACHORD.Functions.CreateElement = function (obj) {
  var elem, a, c, child, type;
  
  type = obj.type || "div";
  elem = document.createElement(type);
  
  if (obj.id) {
    elem.setAttribute("id", obj.id);
  }
  
  if (obj.cls) {
    elem.setAttribute("class", obj.cls);
  }
  
  if (obj.before_content) {
    elem.innerHTML = obj.before_content;
  }
  
  // Loop through all other attributes that we should be setting
  for (a in obj.attr) {
    if (obj.attr.hasOwnProperty(a)) {
      try {
        elem.setAttribute(obj.attr[a].key, obj.attr[a].val);
      } catch (e) {
        continue;
      }
    }
  }
  
  // Loop through all of the children listed for this element
  for (c in obj.children) {
    if (obj.children.hasOwnProperty(c)) {
      try {
        if (obj.children[c].setAttribute) {
          elem.appendChild(obj.children[c]);
        } else {
          child = ACHORD.Functions.CreateElement(obj.children[c]);
          elem.appendChild(child);
        }
      } catch (e) {
        continue;
      }
    }
  }
  
  // Add any after html
  if (obj.after_content) {
    elem.innerHTML += obj.after_content;
  }
  
  return elem;
};


ACHORD.Functions.CreateChord = function () {
  var c = new ACHORD.Objects.Chord("A", "G# Maj");
  c.Draw(document.body);
  c.AddNote(0, 2, 1);
  c.AddNote(1, 4, 3);
  c.AddNote(2, 4, 4);
  c.AddNote(3, 3, 2);
  c.AddNote(4, 2, 1);
  c.AddNote(5, 2, 1);
  
  c.PlayChord(1.5);
};

ACHORD.Functions.GetNoteName = function (midi_note) {
  var arr, idx;
  idx = ((midi_note + 3) % 12);
  arr = (ACHORD.Options.Sharps) ? ACHORD.Constants.SharpTones : ACHORD.Constants.FlatTones;
  
  return arr[idx];
  
};
//ACHORD.Constants.ChordTypes = ["Major", "Minor", "Diminished", "Augmented", "7", "Maj 7", "Min 7",
// "7 Aug 5", "7 Flat 5", "Maj 7 Flat 3", "Min 7 Flat 5", "Sus 4", "7 Sus 4", "Sus 2", "6", "Min 6",
// "9", "Min 9", "9 Aug 5", "9 Flat 5", "7 Aug 9", "7 Flat 9",, "6 Add 9", "11", "Aug 11", "13", "13 Flat 9", "13 Flat 9 Flat 5"];

/******************************************************
 *@name         GetInterval
 *@description  Finds the intervals that are appropriate to play for this type of chord.
 *@param        chord_type    The type of chord to get intervals for
 *@returns      An array containing the note intervals that are appropriate for this chord
 ******************************************************/
ACHORD.Functions.GetInterval = function (chord_type) {
  var name = ACHORD.Constants.ChordTypes[chord_type];
  
  switch (name) {
  
  case "Major":
    return [0, 4, 7];
  
  case "Minor":
    return [0, 3, 7];
    
  case "Diminished":
    return [0, 3, 6];
  
  case "Augmented":
    return [0, 4, 8];
  
  case "7":
    return [0, 4, 7, 10];
  
  case "Maj 7":
    return [0, 4, 7, 11]
    
  case "Min 7":
    return [0, 3, 7, 10];
    
  case "7 Aug 5":
    return [0, 4, 8, 10];
  
  case "7 Flat 5":
    return [0, 4, 6, 10];
  
  case "Maj 7 Flat 3":
    return [0, 3, 7, 11];
  
  case "Min 7 Flat 5":
    return [0, 3, 6, 10];
  
  case "Sus 4":
    return [0, 5, 7];
  
  case "7 Sus 4":
    return [0, 5, 7, 10];
  
  case "Sus 2":
    return [0, 2, 7];
  
  case "6":
    return [0, 4, 7, 9];
  
  case "Min 6":
    return [0, 3, 7, 9];
  
  case "9":
    return [0, 2, 4, 7, 10];
  
  case "Maj 9":
    return [0, 2, 4, 7, 11];
  
  case "Min 9":
    return [0, 2, 3, 7, 10];

  case "9 Aug 5":
    return [0, 2, 4, 8, 10];

  case "9 Flat 5":
    return [0, 2, 4, 6, 10];
  
  case "7 Aug 9":
    return [0, 3, 4, 7, 10];

  case "7 Flat 9":
    return [0, 1, 4, 7, 10];
  
  case "6 Add 9":
    return [0, 2, 4, 7, 9];
  
  case "11":
    return [0, 2, 4, 5, 7, 10];
  
  case "Aug 11":
    return [0, 2, 4, 6, 7, 10];

  case "13":
    return [0, 2, 4, 5, 7, 9, 10];
  
  case "13 Flat 9":
    return [0, 1, 4, 5, 7, 9, 10];

  case "13 Flat 9 Flat 5":
    return [0, 1, 4, 5, 6, 9, 10];
  }
  
  
};