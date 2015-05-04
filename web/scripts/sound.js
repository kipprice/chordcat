/*globals ACHORD,window*/

ACHORD.Globals.AudioContext = new (window.AudioContext || window.webkitAudioContext)();
  
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