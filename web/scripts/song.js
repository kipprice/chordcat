/*globals KIP,ACHORD,document*/
ACHORD.Objects.Song = function () {
  this.phrases = [];
  this.CreateElements();
  this.AddListeners();
};

ACHORD.Objects.Song.prototype = Object.create(KIP.Objects.Drawable.prototype);

ACHORD.Objects.Song.prototype.CreateElements = function () {
  this.div = KIP.Functions.CreateSimpleElement("song_container", "song_container");
  this.newPhraseBtn = KIP.Functions.CreateSimpleElement("phraseBtn", "btn", "+ Phrase");
  
  this.div.appendChild(this.newPhraseBtn);
};

ACHORD.Objects.Song.prototype.AddListeners = function () {
  var that = this;
  this.newPhraseBtn.onclick = function () {
    that.AddPhrase();
  };
};

ACHORD.Objects.Song.prototype.AddPhrase = function () {
  var idx;
  
  idx = this.phrases.length;
  this.phrases[idx] = new ACHORD.Objects.Phrase(idx, "[Phrase Name]");
  
  this.AppendChild(this.phrases[idx]);
  
  this.Draw();
};

ACHORD.Objects.Song.prototype.Draw = function (parent) {
  var that = this;
  
  // Set our current parent equal to the new thing passed in
  this.parent = parent || this.parent;
  
  // Remove the div that exists, if it does
  if (this.div.parentNode) {
    this.div.parentNode.removeChild(this.div);
  }
  
  this.div.removeChild(this.newPhraseBtn);
  
  // Redraw the div onto the new parent
  this.parent.appendChild(this.div);
  
  // If we have any children, loop through them too
  if (this.children) {
    this.children.map(function (elem, idx, arr) {
      if (elem) {
        elem.Draw(that.div);
      }
    });
  }
  
  this.div.appendChild(this.newPhraseBtn);
}

ACHORD.Globals.Song = new ACHORD.Objects.Song();
ACHORD.Globals.Song.Draw(document.body);