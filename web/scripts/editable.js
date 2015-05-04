/*globals ACHORD,window*/
ACHORD.Objects.Editable = function (id, type, content, validate) {
  this.id = id;
  this.type = type || "text";
  this.content = content;
  this.validate = validate;
  
  ACHORD.Objects.Drawable.call(this, this.id, "editable", this.content);
  
  this.CreateElements();
  this.AddListeners();
};

ACHORD.Objects.Editable.prototype = Object.create(ACHORD.Objects.Drawable.prototype);

ACHORD.Objects.Editable.prototype.AddListeners = function () {
  var that = this;
  
  this.div.onclick = function (e) {
    if (!that.is_modifying) {
      that.Modify();
    }
    
    if (e.stopPropagation) e.stopPropagation();
    if (e.cancelBubble !== null) e.cancelBubble = true;
  };
  
  window.onclick = function (e) {
    if (e.target === that) return;
    if (that.is_modifying) {
      that.Save();
    }
  }
  
  this.inputDiv.onkeydown = function (e) {
    if (e.keyCode === 13 && that.is_modifying) {
      that.Save();
    }
  }
};

ACHORD.Objects.Editable.prototype.CreateElements = function () {
  this.inputDiv = ACHORD.Functions.CreateElement({type: "input", id: this.id + "|input", attr: [{key: "type", val: this.type}]});
};

ACHORD.Objects.Editable.prototype.Modify = function () {
  this.is_modifying = true;
  
  this.inputDiv.value = this.content;
  
  // Clear out the main div and add instead the input div
  this.div.innerHTML = "";
  this.div.appendChild(this.inputDiv);
  
  this.inputDiv.select();
  
};

ACHORD.Objects.Editable.prototype.Save = function () {
  var content;
  
  // Grab the user input
  content = this.inputDiv.value;
  
  this.div.removeChild(this.inputDiv);
  
  // If validation exists and it failed, revert the change
  if (this.validate && !this.validate(content)) {
    this.inputDiv.value = this.content;
    this.div.innerHTML = this.content;
  
  // If either we don't have a validation function, or it succeeded, then just replace the text
  } else {
    this.content = content;
    this.div.innerHTML = content;
  }
  
  if (this.div.innerHTML === "") {
    this.div.innerHTML = "    ";
  }
  
  // Revert our modifying status
  this.is_modifying = false;
};