/*globals ACHORD,window*/

ACHORD.Globals.AudioContext = (new window.AudioContext()) || (new window.webkitAudioContext());
  
/****************************************************
 *@name Play Note
 *@description Plays a given note for the provided length.
 *@param  note  The MIDI note number for the tone
 *@param  length  In number of beats, how long the note should be played
 ******************************************************/
ACHORD.Functions.PlayNote = function (note, length) {
  "use strict";
  var osc, gain, context;
  
  context = ACHORD.Globals.AudioContext;
  
  osc = context.createOscillator();
  gain = context.createGain();
  
  gain.gain.value = 1;
  osc.frequency.value = ACHORD.Functions.ConvertNoteToFreq(note);
  
  osc.connect(gain);
  gain.connect(context.destination);
  
  window.setTimeout(function () {
    osc.stop();
  }, ACHORD.Functions.GetNoteLength(length));
  
  osc.start();
};

/********************************************************
 *@name Play Chord
 *@description Plays the notes passed in for the appropriate amount of time.
 *@param notes An array of midi notes that should be played for this chord
 *@param length How long, in beats, the chord should be played
 *******************************************************/
ACHORD.Functions.PlayChord = function (notes, length) {
  "use strict";
  var idx, oscs, gains, context;
  
  oscs = [];
  gains = [];
  
  context = ACHORD.Globals.AudioContext;
  
  // Make our initial loop through and create the notes
  for (idx = 0; idx < notes.length; idx += 1) {
    oscs[idx] = context.createOscillator();
    gains[idx] = context.createGain();
  
    gains[idx].gain.value = 0.25;
    oscs[idx].frequency.value = ACHORD.Functions.ConvertNoteToFreq(notes[idx]);
  
    oscs[idx].connect(gains[idx]);
    gains[idx].connect(context.destination);
  }
  
  function stopOscillator(osc) {
    osc.stop();
  }
  
  function startOscillator(osc) {
    osc.start();
  }
  
  // Set up the end of the note
  window.setTimeout(function () {
    oscs.forEach(stopOscillator);
  }, ACHORD.Functions.GetNoteLength(length));
  
  // Start playing the chord
  oscs.forEach(startOscillator);
};

/******************************************************
 *@name ConvertNoteToFrequency
 *@description From a MIDI note number, converts that note to the appropriate frequency
 *@note The MIDI note to convert to a frequency
 *@returns The frequency value for this note
 ******************************************************/
ACHORD.Functions.ConvertNoteToFreq = function (note) {
  var result, diff;
  
  diff = note - 69; // A4 is MIDI note 69
  
  result = Math.pow(2, diff / 12);  // Calculate how different the frequency will be
  result *= 440; // 440 is the frequency of A4
  
  // Round it off to be a nice number
  result = (Math.round(result * 100) / 100);
  
  return result;
};
/****************************************************
 *@name GetNoteLength
 *@description Calculates the numbers of milliseconds a given number of beats will take.
 *@param int beats The number of beats that we want to calculate milliseconds for
 *@returns The milliseconds equivalent to the beats passed in
 ***************************************************/
ACHORD.Functions.GetNoteLength = function (beats) {
  var bpms;
  
  // Calculate how many milliseconds each beat gets
  bpms = (60 / ACHORD.Options.Tempo) * 1000;
 
  // Return that times the number of beats
  return bpms * beats;
};

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