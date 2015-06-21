/*globals ACHORD*/

ACHORD.Objects.Guitar = function () {
  var s, f;
  this.strings = [];
  
  // Build the midi note values for each of the frets
  for (s = 0; s < ACHORD.Options.StringNum; s += 1) {
    this.strings[s] = [];
    
    for (f = 0; f < ACHORD.Options.FretNum; f += 1) {
      this.strings[s][f] = (ACHORD.Options.Strings[s] + f) % 12;
    }
  }
}

ACHORD.Objects.Guitar.prototype.FindFretsForNotes = function (notes) {
  var out, that;
  out = [];
  that = this;
  
  notes.map(function (elem, key) {
    out[key] = that.FindFrets(elem);
  });
  
  return out;
};

ACHORD.Objects.Guitar.prototype.FindFrets = function (note) {
  "use strict";
  var n, out, that;
  
  that = this;
  out = [];
  
  n = note % 12;
  
  // Find all frets that correspond to this note
  this.strings.map(function (s_elem, s_key, s_arr) {
    s_elem.map(function (f_elem, f_key) {
      if (f_elem === n) {
        out[out.length] = {string: s_key, fret: f_key};
      }
    });
  });
  
  return out;
}

ACHORD.Objects.Guitar.prototype.FindFretsForMultipleNotes = function (notes) {
  var n, note, note_mod, out = [];
  
  for (n = 0; n < notes.length; n += 1) {
    note = notes[n];
    note_mod = (note % 12);
    
    this.strings.map(function (s_elem, s_key) {
      s_elem.map(function (f_elem, f_key) {
        if (f_elem === note_mod) {
          out[s_key] = out[s_key] || [];
          out[s_key][f_key] = n;
        }
       
      });
    });
    
  }
  
  return out;
};

ACHORD.Objects.Guitar.prototype.FindChords = function (notes, root, important) {
  var viable, fret, stretch, options, opts;
  
  // Get the array of viable notes per string
  viable = this.FindFretsForMultipleNotes(notes);
  
  options = [];
  
  stretch = ACHORD.Options.MaxStretch;
  
  for (fret = 1; fret < ACHORD.Options.FretNum; fret += 1) {
    opts = this.CombineViableOptionsInRange(viable, fret, stretch, notes);
    opts.map(function (elem) {
      options.push(elem);
    });
  }
  
  // Sort by difficulty then fret position
  options.sort(function (a, b) {
    if (a.difficulty < b.difficulty) {
      return -1;
    } else if (b.difficulty < a.difficulty) {
      return 1;
    }
    
    if (a.low_fret < b.low_fret) {
      return -1;
    } else if (b.low_fret < a.low_fret) {
      return 1;
    }
    
    return 0;
  })
  
  return options;
}

ACHORD.Objects.Guitar.prototype.CombineViableOptionsInRange = function (available, start_fret, stretch, notes, root) {
  "use strict";
  var options, reachable, viable;
  
  options = [];
  viable = [];
  
  // First count how many combinations we will eventually need
  available.map(function (s_elem, s_key) {
    s_elem.map(function (n_elem, n_key) {
      reachable = (n_key >= start_fret) && (n_key < (start_fret + stretch));
      reachable = reachable || (n_key === 0);
      if (reachable) {
        
        // Initialize the viable array if needed
        viable[s_key] = viable[s_key] || [];
        
        // Add this fret/note to the viable list
        viable[s_key][viable[s_key].length] = {fret: n_key, note: n_elem};
      }
      
    });
    
    // Add a dead string option to all strings
    viable[s_key] = viable[s_key] || [];
    viable[s_key][viable[s_key].length] = {fret: -1, note: ""};

  });
  
  // Now actually perform the combinatorics
  options = this.Combine(viable);
  
  return this.FilterOutChords(options, notes, root, start_fret);
  
};

ACHORD.Objects.Guitar.prototype.FindPlayableChords = function (notes, root) {
  var stretch, frets, f, s, viable, complete, opens, note, found_root, fingers_left, lowest_fret;
  
  fingers_left = 4;
  viable = [];
  complete = [];
  opens = [];
  stretch = ACHORD.Options.MaxStretch;
  frets = this.FindFretsForNotes(notes);
  
  for (f = 1; f < (ACHORD.Options.FretNum - stretch); f += 1) {
    
    frets.map(function (n_elem, note) {
      viable[note] = [];
      // Loop through all of the frets for this particular note
      n_elem.map(function (elem) {
        
        // There will only be one fret per string that is within the range for this particular note
        // Thus, we can build a simple array of six strings for this note
        if ((elem.fret >= f) && (elem.fret < (f + stretch))) {
          viable[note][elem.string] = elem.fret;
        
        // Track open notes too
        } else if (elem.fret === 0) {
          opens[elem.string] = note;
        }
        
      });
    });
    
    // Now that we have a full viable array of the format note -> string -> viable fret,
    
    // First, if we have a root, assign it
    if (root !== undefined) {
      
      // First check open notes for the resonance
      for (s = 0; s < 3; s += 1) {
          
        // If this matches our current root
        if (opens[s] === root) {
          // Loop through the other notes and remove them
          for (note in viable) {
            if (viable.hasOwnProperty[note]) {
              viable[note].splice(0,  s);
            }
          }
          
          // Make sure we don't keep looking for the root
          found_root = true;
          break;
        }
      }
      
      if (!found_root) {
        for (s in viable[root]) {
          if (viable[root].hasOwnProperty(s)) {
            
            // Remove this string (and lower) from all others
            for (note in viable) {
              if (viable.hasOwnProperty[note]) {
                viable[note].splice(0,  s);
              }
            }
            
            fingers_left -= 1;
            break;
          }
        }
      }
    }
    
    // Find any other opens available to us
    for (s in opens) {
      if (opens.hasOwnProperty(s)) {
        
      }
    }
    // Loop through the rest of the notes and give them positions, based on the fingers left
    while (fingers_left > 0) {
      for (note in viable) {
        if (viable.hasOwnProperty[note]) {
          
        }
      }
      fingers_left -= 1;
    }
  }
  
  
  
};

ACHORD.Objects.Guitar.prototype.Combine = function (viable) {
  var outs, curs, idx, cur, copy;
  
  // Initialize the array of outputs
  outs = [];
  
  viable.map(function (s_elem, s_key) {
    
    // Take a copy of the array as of the start of this loop
    curs = outs.slice();
    outs.length = 0;
    
    s_elem.map(function (n_elem, n_key) {
      
      // If we haven't started building the array, initialize it
      if (curs.length < 1) {
        idx = outs.length;
        outs[idx] = [];
        outs[idx][s_key] = n_elem;
        
      // Otherwise, add these combinations
      } else {
        copy = curs.slice();
        
        // For each element in the cur array, add the current note
        for (cur = 0; cur < curs.length; cur += 1) {
          copy[cur] = copy[cur] || [];
          copy[cur][s_key] = n_elem;
          outs.push(copy[cur].slice());
        }

      }
      
    });
    
  });
  
  return outs;
};

ACHORD.Objects.Guitar.prototype.FilterOutChords = function (options, notes, root, start_fret) {
  "use strict";
  var fingers_used, used_notes, all_used, difficulty, lowest_fret, highest_fret;
  var lowest_string, option, o, out, cur_root, has_opens, has_closed, barred, throwaway;
  
  // TODO: Handle chords with more notes than can fit
  out = [];
  used_notes = [];
  lowest_string = ACHORD.Options.StringNum;
  
  // Use the first note as the root
  if (root === undefined) {
    root = 0;
  }
  
  // There are several ways that we can filter out this set of notes:
  // 1. Not enough fingers on a hand
  // 2. Not all notes actually used
  // 3. Wrong root
  for (o = (options.length - 1); o >= 0; o -= 1) {
    option = options[o];
    
    // DEBUG:
    /*debug = "";
    option.map(function (elem) {
      if (debug.length > 0) {
        debug += "-";
      }
      if (elem.fret === -1) {
        debug += "X";
      } else {
      debug += elem.fret;
      }
    });*/
    
    // Reset these variables
    fingers_used = 0;
    barred = 0;
    difficulty = 0;
    lowest_fret = ACHORD.Options.FretNum;
    highest_fret = 0;
    used_notes.length = 0;
    all_used = 0;
    cur_root = undefined;
    has_opens = false;
    has_closed = false;
    throwaway = false;
    
    // Go through each of the elements on the string
    option.map(function (n_elem, n_key, n_val) {
      
      // If it's an actual fingering note
      if (n_elem.fret > 0) {
        if (lowest_fret !== n_elem.fret) {
          fingers_used += 1;
        }
        
        // Even if this is the same as the lowest fret, we should still bump it up if we would have to break the barre
        else if (has_opens && has_closed) {
          fingers_used += 1;
        }
        
        // Track how many barred notes we have
        else {
          barred += 1;
        }
        
        if (n_elem.fret < lowest_fret) {
          lowest_fret = n_elem.fret;
        }
        
        if (n_elem.fret > highest_fret) {
          highest_fret = n_elem.fret;
        }
        // Set the root if we are the first real note
        if (cur_root === undefined) {
          cur_root = n_elem.note;
        }
        
        has_closed = true;
        difficulty += 1;
        lowest_string = n_key;
        
      // If it's a dead string, jack up the difficulty, unless it's the lowest strings
      } else if (n_elem.fret === -1) {
        
        // Throw out the dead string if we've found the root and there are other options for this string
        // TODO: Actually check if there are other options for this string
        if (cur_root !== undefined) {
          throwaway = true;
        }
        
        // Otherwise, add a bunch of difficulty
        if (n_key > lowest_string) {
          difficulty += 3;
        } else {
          difficulty += 1;
        }
        
      } else {
        lowest_string = n_key;
        
        // Set the root if we are the first real note
        if (cur_root === undefined) {
          cur_root = n_elem.note;
        }
        
        // If we have had at least one note requiring a finger, track whether we can bar
        if (has_closed) {
          has_opens = true;
        }
        
        // If we've barred anything thus far, we can't bar with an open in front
        if (barred) {
          fingers_used += barred;
          barred = 0;
        }
      }
      
      // Add to the used array so we always get all notes
      if ((n_elem.note !== "") && (!used_notes[n_elem.note])) {
        used_notes[n_elem.note] = true;
        all_used += 1;
      }
      
    });
    
    // Throw away the appropriate chord combos
    if (throwaway) {
      continue;
    }
    // If we haven't used all of the notes, skip
    if (all_used !== notes.length) {
      continue;
    }
    
    //  If we have too many fingers, skip
    if (fingers_used > ACHORD.Options.MaxFingers) {
      continue;
    }
    
    // Don't allow repeats by only adding chords that have to start with this fret
    if (start_fret && (lowest_fret !== start_fret)) {
      continue;
    }
    
    // Only use properly rooted chords
    if (cur_root !== root) {
      continue;
    }
    
    difficulty += (lowest_fret * 5) / ACHORD.Options.FretNum;
    difficulty += (highest_fret - lowest_fret);
    out.push({difficulty: difficulty, strings: option, low_fret: lowest_fret});
    
  }
  
  return out;
}



ACHORD.Globals.Guitar = new ACHORD.Objects.Guitar();