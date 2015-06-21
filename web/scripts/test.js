/*globals ACHORD,window,document*/

// Creates a simple element
ACHORD.Test.SimpleElement = function () {
  var elem = ACHORD.Functions.CreateSimpleElement("ID", "CLASS", "CONTENT", [{key: "attr", val: "val"}]);
  document.body.appendChild(elem);
  
};

// Creates a complicated elemen
ACHORD.Test.ComplicatedElement = function () {
  var elem = ACHORD.Functions.CreateElement({id: "ID", cls: "CLASS", type: "span", before_content: "before", after_content: "after", attr: [{key: "attr", val : "val"}]});
  document.body.appendChild(elem);
};

// Creates an element with children elements
ACHORD.Test.ElemWithKids = function () {
  var kid_1, kid_2, elem;
  
  kid_1 = ACHORD.Functions.CreateSimpleElement("KID1", "", "kid1");
  kid_2 = ACHORD.Functions.CreateSimpleElement("KID2", "", "kid2");
  elem = ACHORD.Functions.CreateElement({id: "KIDS", children: [kid_1, kid_2]});
  document.body.appendChild(elem);
}

// Creates an element with children objects
ACHORD.Test.ElemWithKids2 = function () {
  var elem = ACHORD.Functions.CreateElement({id: "parent", children: [{id: "kid_1", before_content: "kid1"}, {id: "kid_2", before_content: "kid2"}]});
  document.body.appendChild(elem);
};

ACHORD.Test.Editable = function () {
  var edit, container;
  edit = new ACHORD.Objects.Editable("test", "text", "content");
  container = ACHORD.Functions.CreateSimpleElement();
  container.style.position = "absolute";
  container.style.left = "45%";
  
  document.body.appendChild(container);
  edit.Draw(container);
}

ACHORD.Test.NoteName = function () {
  for (var i = 0; i <= 127; i += 1) {
    console.log(i + ": " + ACHORD.Functions.GetNoteName(i));
  }
};

// Plays an A major scale
ACHORD.Test.PlayScale = function () {
  var scl, idx;
  
  scl = [69, 71, 73, 74, 76, 78, 80, 81];
  
  for (idx = 0; idx < scl.length; idx += 1) {
    ACHORD.Test.auxPlayNote(scl[idx], 1, ACHORD.Functions.GetNoteLength(1) * idx);
  }
};


ACHORD.Test.PlayLengths = function () {
  var scl, lens, idx, sum;
  
  sum = 0;
  
  scl = [69, 71, 73, 74, 76, 78, 80, 81];
  lens = [0.125, 0.25, 0.5, 0.75, 1, 2, 3, 4];
  
  for (idx = 0; idx < scl.length; idx += 1) {
    
    //ACHORD.Test.auxPlayNote(scl[idx], lens[idx], ACHORD.Functions.GetNoteLength(sum));
    sum += lens[idx];
  }
};

ACHORD.Test.auxPlayNote = function (note, len, delay) {
  
  window.setTimeout(function () {
    ACHORD.Functions.PlayNote(note, len);
  }, (delay || len));
};

ACHORD.Test.auxPlayChord = function (n1, n2, n3, len, delay) {
  window.setTimeout(function () {
    ACHORD.Functions.PlayChord([n1, n2, n3], len);
  }, (delay || len));
}


ACHORD.Test.PlayAllMajorChords = function () {
  var n1, n2, n3, idx;
  
  // Set the initial values for the notes
  n1 = 69;
  n2 = 73;
  n3 = 76;
  
  for (idx = 0; idx < 12; idx += 1) {
    ACHORD.Test.auxPlayChord(n1 + idx, n2 + idx, n3 + idx, 4, ACHORD.Functions.GetNoteLength(4) * idx);
    
  }
}

ACHORD.Test.AChord = function () {
  var c = new ACHORD.Objects.Chord("A", "A Maj");
  
  c.Draw(document.body);
  c.AddNote(0, -1, "X");
  c.AddNote(1, 0, 0);
  c.AddNote(2, 2, 1);
  c.AddNote(3, 2, 2);
  c.AddNote(4, 2, 3);
  c.AddNote(5, 0, 0);
  
  c.PlayChord(1.5);
};

ACHORD.Test.FindFrets = function () {
  var n = 0; // C note
  
  return ACHORD.Globals.Guitar.FindFrets(n);
}

ACHORD.Test.FindFretsForNotes = function () {
  var notes = [0, 13, 26];
  return ACHORD.Globals.Guitar.FindFretsForMultipleNotes(notes);
}

ACHORD.Test.TestCombinatorics = function () {
  var viable_arr = [["A", "B"], ["c"], ["D", "E", "F"]];
  return ACHORD.Globals.Guitar.Combine(viable_arr);
};

ACHORD.Test.PossibleCChords = function () {
  var opt, notes = [0, 4, 7], out;
  out = [];
  opt = ACHORD.Globals.Guitar.FindChords(notes);
  opt.map(function (elem, key, arr) {
    elem.strings.map(function (s_elem) {
      out[key] = out[key] || (elem.difficulty + ": ");
      if (out[key].length > 0) {
        out[key] +=   "-";
      }
      if (s_elem.fret === -1) {
        out[key] += "X"
      } else {
        out[key] += s_elem.fret;
      }
    });
  });
  return out.join("\n");
};

ACHORD.Test.PossibleAChords = function () {
  var opt, notes = [9, 1, 4], out;
  out = [];
  opt = ACHORD.Globals.Guitar.FindChords(notes);
  opt.map(function (elem, key, arr) {
    elem.strings.map(function (s_elem) {
      out[key] = out[key] || (elem.difficulty + ": ");
      if (out[key].length > 0) {
        out[key] +=   "-";
      }
      if (s_elem.fret === -1) {
        out[key] += "X"
      } else {
        out[key] += s_elem.fret;
      }
    });
  });
  return out.join("\n");
}