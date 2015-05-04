/*globals ACHORD*/
ACHORD.Objects.Bar = function (id) {
  this.strums = [];
  this.id = id;
  
  ACHORD.Objects.Drawable.call(this, this.id, "bar");
  
  this.CreateElements();
  this.AddListeners();
};

ACHORD.Objects.Bar.prototype = Object.create(ACHORD.Objects.Drawable.prototype);

ACHORD.Objects.Bar.prototype.CreateElements = function () {
  var idx;
  
  for (idx = 0; idx < ACHORD.Options.BeatsPerBar; idx += 1) {
    this.strums[idx] = new ACHORD.Objects.Strum(this.id + "|strum|" + idx);
    this.AppendChild(this.strums[idx]);
  }
  
  this.endBar = ACHORD.Functions.CreateSimpleElement(this.id + "|end", "endBar");
};

ACHORD.Objects.Bar.prototype.AddListeners = function () {
  
};

ACHORD.Objects.Bar.prototype.AfterDrawChildren = function () {
  if (this.endBar.parentNode) {
    this.endBar.parentNode.removeChild(this.endBar);
  }
  
  this.div.appendChild(this.endBar);
};

// =========== BAR GROUP OBJECT ================ //
ACHORD.Objects.BarGroup = function (id) {
  this.bars = [];
  
  ACHORD.Objects.Drawable.call(this, id, "barGroup");
};

ACHORD.Objects.BarGroup.prototype = Object.create(ACHORD.Objects.Drawable.prototype);

ACHORD.Objects.BarGroup.prototype.AddBar = function (id) {
  var idx;
  idx = this.bars.length;
  this.bars[idx] = new ACHORD.Objects.Bar(id);
  this.AppendChild(this.bars[idx]);
};


