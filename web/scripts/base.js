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
ACHORD.Options.Strings = [64, 69, 74, 79, 83, 88];

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
ACHORD.Functions.CreateElement = function (obj) {
  var elem, a, c, child, type;
  
  type = obj.type || "div";
  elem = document.createElement(type);
  
  if (obj.id) {
    elem.setAttribute("id", obj.id);
  }
  
  if (obj.cls) {
    elem.setAttribute("class", obj.cls);
  }
  
  if (obj.before_content) {
    elem.innerHTML = obj.before_content;
  }
  
  // Loop through all other attributes that we should be setting
  for (a in obj.attr) {
    if (obj.attr.hasOwnProperty(a)) {
      try {
        elem.setAttribute(obj.attr[a].key, obj.attr[a].val);
      } catch (e) {
        continue;
      }
    }
  }
  
  // Loop through all of the children listed for this element
  for (c in obj.children) {
    if (obj.children.hasOwnProperty(c)) {
      try {
        if (obj.children[c].setAttribute) {
          elem.appendChild(obj.children[c]);
        } else {
          child = ACHORD.Functions.CreateElement(obj.children[c]);
          elem.appendChild(child);
        }
      } catch (e) {
        continue;
      }
    }
  }
  
  // Add any after html
  if (obj.after_content) {
    elem.innerHTML += obj.after_content;
  }
  
  return elem;
};


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