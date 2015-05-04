/*globals ACHORD*/
ACHORD.Objects.Phrase = function (id, name, bar_num, row_num) {
  this.id = id;
  this.name = name;
  this.length = bar_num || 16;
  this.row_num = row_num || 4;
  this.row_length = (this.length / this.row_num);
  this.rows = [];
  
  // Call the super constructor
  ACHORD.Objects.Drawable.call(this, this.name, "phrase");
  
  this.CreateElements();
};

ACHORD.Objects.Phrase.prototype = Object.create(ACHORD.Objects.Drawable.prototype);

ACHORD.Objects.Phrase.prototype.CreateElements = function () {
  var i, j, idx;
  
  this.nameDiv = new ACHORD.Objects.Editable(this.id + "|name_editable", "text", this.name);
  this.AppendChild(this.nameDiv);
  
  // Create all of the bars that should be contained in this phrase
  for (i = 0; i < this.row_num; i += 1) {
    this.rows[i] = new ACHORD.Objects.BarGroup(this.id + "|row|" + i);
    this.AppendChild(this.rows[i]);
    
    for (j = 0; j < this.row_length; j += 1) {
      idx = i * this.row_num + j;
      this.rows[i].AddBar(this.id + "|bar|" + idx);
    }
  }
  
  this.endBar = ACHORD.Functions.CreateSimpleElement(this.id + "|endBar", "endBar");
  
  this.hoverMenu = ACHORD.Functions.CreateSimpleElement(this.id + "|hover_menu", "hoverMenu");
  
};

ACHORD.Objects.Phrase.prototype.AfterDrawChildren = function () {
  if (this.endBar.parentNode) {
    this.endBar.parentNode.removeChild(this.endBar);
  }
  
  this.div.appendChild(this.endBar);
};

ACHORD.Objects.Phrase.prototype.AddHoverElements = function () {
  
};