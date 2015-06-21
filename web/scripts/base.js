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
ACHORD.Options.FretNum = 24;
ACHORD.Options.Strings = [64, 69, 74, 79, 83, 88];
ACHORD.Options.Sharps = true;
ACHORD.Options.BeatsPerBar = 4;
ACHORD.Options.MaxStretch = 4;
ACHORD.Options.MaxFingers = 4;

ACHORD.Constants.FlatTones = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
ACHORD.Constants.SharpTones = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
ACHORD.Constants.MidiTones = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
ACHORD.Constants.ChordTypes = ["Major", "Minor", "Diminished", "Augmented", "7", "Maj 7", "Min 7", "7 Aug 5", "7 Flat 5", "Maj 7 Flat 3", "Min 7 Flat 5", "Sus 4", "7 Sus 4", "Sus 2", "6", "Min 6", "9", "Maj 9", "Min 9", "9 Aug 5", "9 Flat 5", "7 Aug 9", "7 Flat 9", "6 Add 9", "11", "Aug 11", "13", "13 Flat 9", "13 Flat 9 Flat 5"];

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