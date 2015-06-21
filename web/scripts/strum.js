/*globals KIP,ACHORD*/
ACHORD.Objects.Strum = function (id) {
  this.id = id;
  KIP.Objects.Drawable.call(this, this.id, "strum_container");
  
  this.CreateElements();
};

ACHORD.Objects.Strum.prototype = Object.create(KIP.Objects.Drawable.prototype);

ACHORD.Objects.Strum.prototype.CreateElements = function () {
  this.strum = KIP.Functions.CreateSimpleElement(this.id + "|strum", "strum");
  this.div.appendChild(this.strum);
  
  this.lyricDiv = new KIP.Objects.Editable(this.id + "|lyric", "text", "-");
  this.AppendChild(this.lyricDiv);
};

ACHORD.Objects.Strum.prototype.AddListeners = function () {
  
};

ACHORD.Objects.Strum.prototype.NextStrum = function () {
  
};

ACHORD.Objects.Strum.prototype.AddChord = function (chord, first_strum) {
  this.chord = chord;
  
  if (first_strum) {
    //TODO: Create a chord element and display it above the strum
  }
};