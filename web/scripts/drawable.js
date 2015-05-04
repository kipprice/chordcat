/*globals ACHORD*/

/*******************************************************
 *@class Drawable
 *@description This is an interface-esque object that abstracts the draw function
 *@param id The ID that should be used for the div for this object
 *@param cls The class that should be used for the main div for this object
 *@param content The content that should be applied to this div
 *@returns An instance of a Drawable object
 *******************************************************/
ACHORD.Objects.Drawable = function (id, cls, content) {
  this.div = ACHORD.Functions.CreateSimpleElement(id, cls, content);
  this.children = [];
};

ACHORD.Objects.Drawable.prototype.AppendChild = function (child) {
  "use strict";
  var idx;
  
  if (!this.children) {
    this.children = [];
  }
  
  // Only allow the child to be added if it is also a drawable
  if (!child.Draw) return;
  
  idx = this.children.length;
  this.children[idx] = child;
};

/***********************************************************
 *@name Draw
 *@description Draws the elements for this drawable
 *@param HTMLElement parent The element to add the library div to
 ***********************************************************/
ACHORD.Objects.Drawable.prototype.Draw = function (parent) {
  "use strict";
  var that = this;
  
  // Quit if something went wrong and there is no longer a div element
  if (!this.div) return;
  
  // Set our current parent equal to the new thing passed in
  this.parent = parent || this.parent;
  
  // Call the refresh function, if it's something that we'd need to do
  this.Refresh();
  
  // Remove the div that exists, if it does
  if (this.div.parentNode) {
    this.div.parentNode.removeChild(this.div);
  }
  
  // Redraw the div onto the new parent
  this.parent.appendChild(this.div);
  
  this.BeforeDrawChildren();
  
  // If we have any children, loop through them too
  if (!this.children) return;
  this.children.map(function (elem, idx, arr) {
    if (elem) {
      elem.Draw(that.div);
    }
  });
  
  this.AfterDrawChildren();
};

/*********************************************************
 *@name Refresh
 *@description Basic function for refreshing the elements of the Drawable. If not needed, this will do nothing.
 *********************************************************/
ACHORD.Objects.Drawable.prototype.Refresh = function () {
  
};

ACHORD.Objects.Drawable.prototype.BeforeDrawChildren = function () {
  
};

ACHORD.Objects.Drawable.prototype.AfterDrawChildren = function () {
  
};