/*globals document*/

var ACHORD = {
  Objects : {},
  Functions : {},
  Constants : {},
  Globals : {},
  Options : {}
};

/**
 *@name         Create Simple Element
 *@description  Creates a div element with the provided id, class, content, and attributes.
 *@param        id      The ID to assign the element. Optional.
 *@param        cls     The class to assign the element. Optional.
 *@param        content What to include as the contents of the div. Optional.
 *@param        attr    An array of key-value pairs that sets all other attributes for the element. Optional.
 *@returns      The created element, with all specified parameters included.
 **/
ACHORD.Functions.CreateSimpleElement = function (id, cls, content, attr) {
  var elem, a;
  
  elem = document.createElement("div");
  
  // Add the ID if we have it
  if (id) {
    elem.setAttribute("id", id);
  }
  
  // Add the class if we have it
  if (cls) {
    elem.setAttribute("class", cls);
  }
  
  // Add the innerHTML if we have it
  if (content) {
    elem.innerHTML = content;
  }
  
  // Loop through our list of attributes and set them too
  for (a in attr) {
    if (attr.hasOwnProperty(a)) {
      try {
        elem.setAttribute(attr[a].key, attr[a].val);
      } catch (e) {
        continue;
      }
    }
  }
  
  return elem;
};

// Currently unused
ACHORD.Functions.CreateElement = function () {
  
};