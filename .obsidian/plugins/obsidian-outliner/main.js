'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    styleLists: false,
    debug: false,
    stickCursor: true,
    betterEnter: true,
};
class Settings {
    constructor(storage) {
        this.storage = storage;
        this.handlers = new Map();
    }
    get styleLists() {
        return this.values.styleLists;
    }
    set styleLists(value) {
        this.set("styleLists", value);
    }
    get debug() {
        return this.values.debug;
    }
    set debug(value) {
        this.set("debug", value);
    }
    get stickCursor() {
        return this.values.stickCursor;
    }
    set stickCursor(value) {
        this.set("stickCursor", value);
    }
    get betterEnter() {
        return this.values.betterEnter;
    }
    set betterEnter(value) {
        this.set("betterEnter", value);
    }
    onChange(key, cb) {
        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }
        this.handlers.get(key).add(cb);
    }
    removeCallback(key, cb) {
        const handlers = this.handlers.get(key);
        if (handlers) {
            handlers.delete(cb);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.values = Object.assign({}, DEFAULT_SETTINGS, yield this.storage.loadData());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.saveData(this.values);
        });
    }
    set(key, value) {
        this.values[key] = value;
        const callbacks = this.handlers.get(key);
        if (!callbacks) {
            return;
        }
        for (const cb of callbacks.values()) {
            cb(value);
        }
    }
}
class ObsidianOutlinerPluginSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Improve the style of your lists")
            .setDesc("Styles are only compatible with built-in Obsidian themes and may not be compatible with other themes. Styles only work well with spaces or four-space tabs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.styleLists).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.styleLists = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Stick the cursor to the content")
            .setDesc("Don't let the cursor move to the bullet position.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.stickCursor).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.stickCursor = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Enter key")
            .setDesc("Make the Enter key behave the same as other outliners.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.betterEnter).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.betterEnter = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Debug mode")
            .setDesc("Open DevTools (Command+Option+I or Control+Shift+I) to copy the debug logs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.debug).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.debug = value;
                yield this.settings.save();
            }));
        });
    }
}

class ObsidianUtils {
    constructor(app) {
        this.app = app;
    }
    getObsidianTabsSettigns() {
        return Object.assign({ useTab: true, tabSize: 4 }, this.app.vault.config);
    }
    getActiveLeafDisplayText() {
        return this.app.workspace.activeLeaf.getDisplayText();
    }
    createCommandCallback(cb) {
        return () => {
            const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!view) {
                return;
            }
            const editor = view.sourceMode.cmEditor;
            const worked = cb(editor);
            if (!worked && window.event && window.event.type === "keydown") {
                editor.triggerOnKeyDown(window.event);
            }
        };
    }
}

class EditorUtils {
    containsSingleCursor(editor) {
        const selections = editor.listSelections();
        return selections.length === 1 && this.rangeIsCursor(selections[0]);
    }
    rangeIsCursor(selection) {
        return (selection.anchor.line === selection.head.line &&
            selection.anchor.ch === selection.head.ch);
    }
}

function Diff() {}
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.options = options;
    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    } // Allow subclasses to massage the input prior to running


    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{
      newPos: -1,
      components: []
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    } // Main worker method. checks all permutations of a given edit length for acceptance.


    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath = void 0;

        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph


        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list

          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done

        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    } // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.


    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.

          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();

        if (ret) {
          return ret;
        }
      }
    }
  },
  pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];

    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        count: last.count + 1,
        added: added,
        removed: removed
      };
    } else {
      components.push({
        count: 1,
        added: added,
        removed: removed
      });
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }

    basePath.newPos = newPos;
    return oldPos;
  },
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }

    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return value.split('');
  },
  join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }

      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.

      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  } // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.


  var lastComponent = components[componentLen - 1];

  if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path) {
  return {
    newPos: path.newPos,
    components: path.components.slice(0)
  };
}

//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF

var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new Diff();

wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }

  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};

wordDiff.tokenize = function (value) {
  // All whitespace symbols except newline group into one token, each newline - in separate token
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

var lineDiff = new Diff();

lineDiff.tokenize = function (value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  } // Merge the content and line separators into single tokens


  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }

      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}

var sentenceDiff = new Diff();

sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

var cssDiff = new Diff();

cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;

jsonDiff.castInput = function (value) {
  var _this$options = this.options,
      undefinedReplacement = _this$options.undefinedReplacement,
      _this$options$stringi = _this$options.stringifyReplacer,
      stringifyReplacer = _this$options$stringi === void 0 ? function (k, v) {
    return typeof v === 'undefined' ? undefinedReplacement : v;
  } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};

jsonDiff.equals = function (left, right) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
};
// object that is already on the "stack" of items being processed. Accepts an optional replacer

function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  if (replacer) {
    obj = replacer(key, obj);
  }

  var i;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);

    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }

    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if (_typeof(obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);

    var sortedKeys = [],
        _key;

    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }

    sortedKeys.sort();

    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }

    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }

  return canonicalizedObj;
}

var arrayDiff = new Diff();

arrayDiff.tokenize = function (value) {
  return value.slice();
};

arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};

class List {
    constructor(indentSign, bullet, content, folded) {
        this.indentSign = indentSign;
        this.bullet = bullet;
        this.content = content;
        this.folded = folded;
        this.children = [];
        this.parent = null;
    }
    isFolded() {
        return this.folded;
    }
    isFoldRoot() {
        let parent = this.getParent();
        while (parent) {
            if (parent.isFolded()) {
                return false;
            }
            parent = parent.getParent();
        }
        return this.isFolded();
    }
    getChildren() {
        return this.children.concat();
    }
    appendContent(content) {
        this.content += content;
    }
    getContent() {
        return this.content;
    }
    isEmpty() {
        return this.children.length === 0;
    }
    getContentStartCh() {
        const indentLength = (this.getLevel() - 1) * this.indentSign.length;
        return indentLength + 2;
    }
    getContentEndCh() {
        return this.getContentStartCh() + this.content.length;
    }
    getParent() {
        return this.parent;
    }
    getPrevSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i > 0 ? this.children[i - 1] : null;
    }
    getNextSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i >= 0 && i < this.children.length ? this.children[i + 1] : null;
    }
    getLevel() {
        let level = 0;
        let ref = this;
        while (ref.parent) {
            ref = ref.parent;
            level++;
        }
        return level;
    }
    addAfterAll(list) {
        this.children.push(list);
        list.parent = this;
    }
    addBeforeAll(list) {
        this.children.unshift(list);
        list.parent = this;
    }
    addBefore(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i, 0, list);
        list.parent = this;
    }
    addAfter(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i + 1, 0, list);
        list.parent = this;
    }
    removeChild(list) {
        const i = this.children.indexOf(list);
        this.children.splice(i, 1);
        list.parent = null;
    }
    print() {
        let res = this.getFullContent() + "\n";
        for (const child of this.children) {
            res += child.print();
        }
        return res;
    }
    getFullContent() {
        return (new Array(this.getLevel() - 1).fill(this.indentSign).join("") +
            this.bullet +
            " " +
            this.content);
    }
}
class Root {
    constructor(indentSign, start, end, cursor) {
        this.indentSign = indentSign;
        this.start = start;
        this.end = end;
        this.cursor = cursor;
        this.rootList = new List("", "", "", false);
    }
    replaceCursor(cursor) {
        this.cursor = cursor;
    }
    getTotalLines() {
        return this.end.line - this.start.line + 1;
    }
    getChildren() {
        return this.rootList.getChildren();
    }
    getIndentSign() {
        return this.indentSign;
    }
    getLevel() {
        return 0;
    }
    getParent() {
        return null;
    }
    addAfterAll(list) {
        this.rootList.addAfterAll(list);
    }
    getListStartPosition() {
        return this.start;
    }
    getListEndPosition() {
        return this.end;
    }
    getCursor() {
        return this.cursor;
    }
    getListUnderCursor() {
        return this.getListUnderLine(this.cursor.line);
    }
    print() {
        let res = "";
        for (const child of this.rootList.getChildren()) {
            res += child.print();
        }
        return res.replace(/\n$/, "");
    }
    getLineNumberOf(list) {
        let result = null;
        let line = 0;
        const visitArr = (ll) => {
            for (const l of ll) {
                if (l === list) {
                    result = line;
                }
                else {
                    line++;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result + this.start.line;
    }
    getListUnderLine(line) {
        if (line < this.start.line) {
            return;
        }
        let result = null;
        let index = 0;
        const visitArr = (ll) => {
            for (const l of ll) {
                if (index + this.start.line === line) {
                    result = l;
                }
                else {
                    index++;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result;
    }
    moveUp() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev && grandParent) {
            const newParent = grandParent.getPrevSiblingOf(parent);
            if (newParent) {
                parent.removeChild(list);
                newParent.addAfterAll(list);
                this.cursor.line = this.getLineNumberOf(list);
            }
        }
        else if (prev) {
            parent.removeChild(list);
            parent.addBefore(prev, list);
            this.cursor.line = this.getLineNumberOf(list);
        }
        return true;
    }
    moveDown() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const next = parent.getNextSiblingOf(list);
        if (!next && grandParent) {
            const newParent = grandParent.getNextSiblingOf(parent);
            if (newParent) {
                parent.removeChild(list);
                newParent.addBeforeAll(list);
                this.cursor.line = this.getLineNumberOf(list);
            }
        }
        else if (next) {
            parent.removeChild(list);
            parent.addAfter(next, list);
            this.cursor.line = this.getLineNumberOf(list);
        }
        return true;
    }
    moveLeft() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        if (!grandParent) {
            return true;
        }
        parent.removeChild(list);
        grandParent.addAfter(parent, list);
        this.cursor.line = this.getLineNumberOf(list);
        this.cursor.ch--;
        return true;
    }
    moveRight() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev) {
            return true;
        }
        parent.removeChild(list);
        prev.addAfterAll(list);
        this.cursor.line = this.getLineNumberOf(list);
        this.cursor.ch++;
        return true;
    }
    deleteAndMergeWithPrevious() {
        const list = this.getListUnderCursor();
        if (this.cursor.ch !== list.getContentStartCh()) {
            return false;
        }
        const prev = this.getListUnderLine(this.cursor.line - 1);
        if (!prev) {
            return true;
        }
        const bothAreEmpty = prev.isEmpty() && list.isEmpty();
        const prevIsEmptyAndSameLevel = prev.isEmpty() && !list.isEmpty() && prev.getLevel() == list.getLevel();
        const listIsEmptyAndPrevIsParent = list.isEmpty() && prev.getLevel() == list.getLevel() - 1;
        if (bothAreEmpty || prevIsEmptyAndSameLevel || listIsEmptyAndPrevIsParent) {
            const parent = list.getParent();
            const prevEndCh = prev.getContentEndCh();
            prev.appendContent(list.getContent());
            parent.removeChild(list);
            for (const c of list.getChildren()) {
                list.removeChild(c);
                prev.addAfterAll(c);
            }
            this.cursor.line = this.getLineNumberOf(prev);
            this.cursor.ch = prevEndCh;
        }
        return true;
    }
}

class ListUtils {
    constructor(logger, obsidianUtils) {
        this.logger = logger;
        this.obsidianUtils = obsidianUtils;
    }
    getListLineInfo(line, indentSign) {
        const prefixRe = new RegExp(`^(?:${indentSign})*([-*]) `);
        const matches = prefixRe.exec(line);
        if (!matches) {
            return null;
        }
        const prefixLength = matches[0].length;
        const bullet = matches[1];
        const content = line.slice(prefixLength);
        const indentLevel = (prefixLength - 2) / indentSign.length;
        return {
            bullet,
            content,
            prefixLength,
            indentLevel,
        };
    }
    parseList(editor, cursor = editor.getCursor()) {
        const cursorLine = cursor.line;
        const cursorCh = cursor.ch;
        const line = editor.getLine(cursorLine);
        const indentSign = this.detectListIndentSign(editor, cursor);
        if (indentSign === null) {
            return null;
        }
        let listStartLine = cursorLine;
        const listStartCh = 0;
        while (listStartLine >= 1) {
            const line = editor.getLine(listStartLine - 1);
            if (!this.getListLineInfo(line, indentSign)) {
                break;
            }
            listStartLine--;
        }
        let listEndLine = cursorLine;
        let listEndCh = line.length;
        while (listEndLine < editor.lineCount()) {
            const line = editor.getLine(listEndLine + 1);
            if (!this.getListLineInfo(line, indentSign)) {
                break;
            }
            listEndCh = line.length;
            listEndLine++;
        }
        const root = new Root(indentSign, { line: listStartLine, ch: listStartCh }, { line: listEndLine, ch: listEndCh }, { line: cursorLine, ch: cursorCh });
        let currentLevel = root;
        let lastList = root;
        for (let l = listStartLine; l <= listEndLine; l++) {
            const line = editor.getLine(l);
            const { bullet, content, indentLevel } = this.getListLineInfo(line, indentSign);
            const folded = editor.isFolded({
                line: l,
                ch: 0,
            });
            if (indentLevel === currentLevel.getLevel() + 1) {
                currentLevel = lastList;
            }
            else if (indentLevel < currentLevel.getLevel()) {
                while (indentLevel < currentLevel.getLevel()) {
                    currentLevel = currentLevel.getParent();
                }
            }
            else if (indentLevel != currentLevel.getLevel()) {
                console.error(`Unable to parse list`);
                return null;
            }
            const list = new List(indentSign, bullet, content, folded);
            currentLevel.addAfterAll(list);
            lastList = list;
        }
        return root;
    }
    applyChanges(editor, root) {
        const oldString = editor.getRange(root.getListStartPosition(), root.getListEndPosition());
        const newString = root.print();
        const fromLine = root.getListStartPosition().line;
        const toLine = root.getListEndPosition().line;
        for (let l = fromLine; l <= toLine; l++) {
            editor.foldCode(l, null, "unfold");
        }
        const diff = diffLines(oldString, newString);
        let l = root.getListStartPosition().line;
        for (const change of diff) {
            if (change.added) {
                editor.replaceRange(change.value, { line: l, ch: 0 });
                l += change.count;
            }
            else if (change.removed) {
                const withNewline = /\n$/.test(change.value);
                const tillLine = withNewline ? l + change.count : l + change.count - 1;
                const tillCh = withNewline ? 0 : editor.getLine(tillLine).length;
                editor.replaceRange("", { line: l, ch: 0 }, { line: tillLine, ch: tillCh });
            }
            else {
                l += change.count;
            }
        }
        const oldCursor = editor.getCursor();
        const newCursor = root.getCursor();
        if (oldCursor.line != newCursor.line || oldCursor.ch != newCursor.ch) {
            editor.setCursor(newCursor);
        }
        for (let l = fromLine; l <= toLine; l++) {
            const line = root.getListUnderLine(l);
            if (line && line.isFoldRoot()) {
                // TODO: why working only with -1?
                editor.foldCode(l - 1);
            }
        }
    }
    detectListIndentSign(editor, cursor) {
        const d = this.logger.bind("ObsidianOutlinerPlugin::detectListIndentSign");
        const { useTab, tabSize } = this.obsidianUtils.getObsidianTabsSettigns();
        const defaultIndentSign = useTab
            ? "\t"
            : new Array(tabSize).fill(" ").join("");
        const line = editor.getLine(cursor.line);
        const withTabsRe = /^\t+[-*] /;
        const withSpacesRe = /^[ ]+[-*] /;
        const mayBeWithSpacesRe = /^[ ]*[-*] /;
        if (withTabsRe.test(line)) {
            d("detected tab on current line");
            return "\t";
        }
        if (withSpacesRe.test(line)) {
            d("detected whitespaces on current line, trying to count");
            const spacesA = line.length - line.trimLeft().length;
            let lineNo = cursor.line - 1;
            while (lineNo >= editor.firstLine()) {
                const line = editor.getLine(lineNo);
                if (!mayBeWithSpacesRe.test(line)) {
                    break;
                }
                const spacesB = line.length - line.trimLeft().length;
                if (spacesB < spacesA) {
                    const l = spacesA - spacesB;
                    d(`detected ${l} whitespaces`);
                    return new Array(l).fill(" ").join("");
                }
                lineNo--;
            }
            d("unable to detect");
            return null;
        }
        if (mayBeWithSpacesRe.test(line)) {
            d("detected nothing on current line, looking forward");
            const spacesA = line.length - line.trimLeft().length;
            let lineNo = cursor.line + 1;
            while (lineNo <= editor.lastLine()) {
                const line = editor.getLine(lineNo);
                if (withTabsRe.test(line)) {
                    d("detected tab");
                    return "\t";
                }
                if (!mayBeWithSpacesRe.test(line)) {
                    break;
                }
                const spacesB = line.length - line.trimLeft().length;
                if (spacesB > spacesA) {
                    const l = spacesB - spacesA;
                    d(`detected ${l} whitespaces`);
                    return new Array(l).fill(" ").join("");
                }
                lineNo++;
            }
            d(`detected nothing, using default useTab=${useTab} tabSize=${tabSize}`);
            return defaultIndentSign;
        }
        d("unable to detect");
        return null;
    }
    isCursorInList(editor) {
        return this.detectListIndentSign(editor, editor.getCursor()) !== null;
    }
}

class Logger {
    constructor(settings) {
        this.settings = settings;
    }
    log(method, ...args) {
        if (!this.settings.debug) {
            return;
        }
        console.info(method, ...args);
    }
    bind(method) {
        return (...args) => this.log(method, ...args);
    }
}

const text = (size) => `Outliner styles doesn't work with ${size}-spaces-tabs. Please check your Obsidian settings.`;
class ListsStylesFeature {
    constructor(plugin, settings, obsidianUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.obsidianUtils = obsidianUtils;
        this.onSettingsChange = (styleLists) => {
            if (styleLists) {
                this.addListsStyles();
            }
            else {
                this.removeListsStyles();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings.styleLists) {
                this.addListsStyles();
            }
            this.settings.onChange("styleLists", this.onSettingsChange);
            this.addStatusBarText();
            this.startStatusBarInterval();
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.interval);
            this.statusBarText.parentElement.removeChild(this.statusBarText);
            this.settings.removeCallback("styleLists", this.onSettingsChange);
            this.removeListsStyles();
        });
    }
    startStatusBarInterval() {
        let visible = null;
        this.interval = window.setInterval(() => {
            const { useTab, tabSize } = this.obsidianUtils.getObsidianTabsSettigns();
            const shouldBeVisible = this.settings.styleLists && useTab && tabSize !== 4;
            if (shouldBeVisible && visible !== tabSize) {
                this.statusBarText.style.display = "block";
                this.statusBarText.setText(text(tabSize));
                visible = tabSize;
            }
            else if (!shouldBeVisible && visible !== null) {
                this.statusBarText.style.display = "none";
                visible = null;
            }
        }, 1000);
    }
    addStatusBarText() {
        this.statusBarText = this.plugin.addStatusBarItem();
        this.statusBarText.style.color = "red";
        this.statusBarText.style.display = "none";
    }
    addListsStyles() {
        document.body.classList.add("outliner-plugin-bls");
    }
    removeListsStyles() {
        document.body.classList.remove("outliner-plugin-bls");
    }
}

function isEnter(e) {
    return (e.code === "Enter" &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class EnterOutdentIfLineIsEmptyFeature {
    constructor(plugin, settings, editorUtils, listUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listUtils = listUtils;
        this.onKeyDown = (cm, e) => {
            if (!this.settings.betterEnter || !isEnter(e)) {
                return;
            }
            const worked = this.outdentIfLineIsEmpty(cm);
            if (worked) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
    outdentIfLineIsEmpty(editor) {
        if (!this.editorUtils.containsSingleCursor(editor)) {
            return false;
        }
        const root = this.listUtils.parseList(editor);
        if (!root) {
            return false;
        }
        const list = root.getListUnderCursor();
        if (list.getContent().length > 0 || list.getLevel() === 1) {
            return false;
        }
        root.moveLeft();
        this.listUtils.applyChanges(editor, root);
        return true;
    }
}

class EnterShouldCreateNewlineOnChildLevelFeature {
    constructor(plugin, settings, listUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listUtils = listUtils;
        this.onBeforeChange = (cm, changeObj) => {
            if (!this.settings.betterEnter) {
                return;
            }
            const { listUtils } = this;
            const currentLine = cm.getLine(changeObj.from.line);
            const nextLine = cm.getLine(changeObj.from.line + 1);
            if (!currentLine || !nextLine) {
                return;
            }
            const indentSign = listUtils.detectListIndentSign(cm, changeObj.from);
            if (indentSign === null) {
                return;
            }
            const currentLineInfo = listUtils.getListLineInfo(currentLine, indentSign);
            const nextLineInfo = listUtils.getListLineInfo(nextLine, indentSign);
            if (!currentLineInfo || !nextLineInfo) {
                return;
            }
            const changeIsNewline = changeObj.text.length === 2 &&
                changeObj.text[0] === "" &&
                !!listUtils.getListLineInfo(changeObj.text[1], indentSign);
            const nexlineLevelIsBigger = currentLineInfo.indentLevel + 1 == nextLineInfo.indentLevel;
            const nextLineIsEmpty = cm.getRange(changeObj.from, {
                line: changeObj.from.line,
                ch: changeObj.from.ch + 1,
            }).length === 0;
            if (changeIsNewline && nexlineLevelIsBigger && nextLineIsEmpty) {
                changeObj.text[1] = indentSign + changeObj.text[1];
                changeObj.update(changeObj.from, changeObj.to, changeObj.text);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.onBeforeChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeChange", this.onBeforeChange);
            });
        });
    }
}

class MoveCursorToPreviousUnfoldedLineFeature {
    constructor(plugin, settings, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listsUtils = listsUtils;
        this.handleBeforeSelectionChange = (cm, changeObj) => {
            if (!this.settings.stickCursor ||
                changeObj.origin !== "+move" ||
                changeObj.ranges.length > 1) {
                return;
            }
            const range = changeObj.ranges[0];
            const cursor = cm.getCursor();
            if (range.anchor.line !== range.head.line ||
                range.anchor.ch !== range.head.ch) {
                return;
            }
            if (cursor.line <= 0 || cursor.line !== range.anchor.line) {
                return;
            }
            const root = this.listsUtils.parseList(cm);
            if (!root) {
                return;
            }
            const list = root.getListUnderCursor();
            const listContentStartCh = list.getContentStartCh();
            if (cursor.ch === listContentStartCh &&
                range.anchor.ch === listContentStartCh - 1) {
                const newCursor = this.iterateWhileFolded(cm, {
                    line: cursor.line,
                    ch: 0,
                }, (pos) => {
                    pos.line--;
                    pos.ch = cm.getLine(pos.line).length - 1;
                });
                newCursor.ch++;
                range.anchor.line = newCursor.line;
                range.anchor.ch = newCursor.ch;
                range.head.line = newCursor.line;
                range.head.ch = newCursor.ch;
                changeObj.update([range]);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
    iterateWhileFolded(editor, pos, inc) {
        let folded = false;
        do {
            inc(pos);
            folded = editor.isFolded(pos);
        } while (folded);
        return pos;
    }
}

class EnsureCursorInListContentFeature {
    constructor(plugin, settings, editorUtils, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listsUtils = listsUtils;
        this.handleCursorActivity = (cm) => {
            if (this.settings.stickCursor &&
                this.editorUtils.containsSingleCursor(cm) &&
                this.listsUtils.isCursorInList(cm)) {
                this.ensureCursorInListContent(cm);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("cursorActivity", this.handleCursorActivity);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("cursorActivity", this.handleCursorActivity);
            });
        });
    }
    ensureCursorInListContent(editor) {
        const cursor = editor.getCursor();
        const indentSign = this.listsUtils.detectListIndentSign(editor, cursor);
        if (indentSign === null) {
            return;
        }
        process.nextTick(() => {
            const cursor = editor.getCursor();
            const lineStartCursor = editor.coordsChar(Object.assign(Object.assign({}, editor.cursorCoords()), { left: 0 }));
            if (lineStartCursor.line !== cursor.line) {
                editor.setCursor({
                    line: lineStartCursor.line,
                    ch: editor.getLine(lineStartCursor.line).length,
                });
            }
        });
        const line = editor.getLine(cursor.line);
        const linePrefix = this.listsUtils.getListLineInfo(line, indentSign)
            .prefixLength;
        if (cursor.ch < linePrefix) {
            cursor.ch = linePrefix;
            editor.setCursor(cursor);
        }
    }
}

class DeleteShouldIgnoreBulletsFeature {
    constructor(plugin, settings, editorUtils, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listsUtils = listsUtils;
        this.handleBeforeChange = (cm, changeObj) => {
            if (changeObj.origin !== "+delete" || !this.settings.stickCursor) {
                return;
            }
            const root = this.listsUtils.parseList(cm);
            if (!root) {
                return;
            }
            const list = root.getListUnderCursor();
            const listContentStartCh = list.getContentStartCh();
            const listContentEndCh = list.getContentEndCh();
            const sameLine = changeObj.from.line === changeObj.to.line;
            const nextLine = changeObj.from.line + 1 === changeObj.to.line;
            if (sameLine &&
                changeObj.from.ch === listContentStartCh - 1 &&
                changeObj.to.ch === listContentStartCh) {
                changeObj.cancel();
                this.backspace(cm);
            }
            else if (sameLine && changeObj.from.ch < listContentStartCh) {
                const from = {
                    line: changeObj.from.line,
                    ch: listContentStartCh,
                };
                changeObj.update(from, changeObj.to, changeObj.text);
            }
            else if (nextLine &&
                changeObj.from.ch === listContentEndCh &&
                changeObj.to.ch === 0) {
                changeObj.cancel();
                this.delete(cm);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.handleBeforeChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeChange", this.handleBeforeChange);
            });
        });
    }
    backspace(editor) {
        if (!this.editorUtils.containsSingleCursor(editor)) {
            return false;
        }
        const root = this.listsUtils.parseList(editor);
        if (!root) {
            return false;
        }
        if (root.getTotalLines() === 1 &&
            root.getChildren()[0].getContent().length === 0) {
            editor.replaceRange("", root.getListStartPosition(), root.getListEndPosition());
            return true;
        }
        const res = root.deleteAndMergeWithPrevious();
        if (res) {
            this.listsUtils.applyChanges(editor, root);
        }
        return res;
    }
    delete(editor) {
        if (!this.editorUtils.containsSingleCursor(editor)) {
            return false;
        }
        const root = this.listsUtils.parseList(editor);
        if (!root) {
            return false;
        }
        const list = root.getListUnderCursor();
        const nextLineNo = root.getCursor().line + 1;
        const nextList = root.getListUnderLine(nextLineNo);
        if (!nextList || root.getCursor().ch !== list.getContentEndCh()) {
            return false;
        }
        root.replaceCursor({
            line: nextLineNo,
            ch: nextList.getContentStartCh(),
        });
        const res = root.deleteAndMergeWithPrevious();
        const reallyChanged = root.getCursor().line !== nextLineNo;
        if (reallyChanged) {
            this.listsUtils.applyChanges(editor, root);
        }
        return res;
    }
}

class SelectionShouldIgnoreBulletsFeature {
    constructor(plugin, settings, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listsUtils = listsUtils;
        this.handleBeforeSelectionChange = (cm, changeObj) => {
            if (!this.settings.stickCursor ||
                changeObj.origin !== "+move" ||
                changeObj.ranges.length > 1) {
                return;
            }
            const range = changeObj.ranges[0];
            if (range.anchor.line !== range.head.line ||
                range.anchor.ch === range.head.ch) {
                return;
            }
            const root = this.listsUtils.parseList(cm);
            if (!root) {
                return;
            }
            const list = root.getListUnderCursor();
            const listContentStartCh = list.getContentStartCh();
            if (range.from().ch < listContentStartCh) {
                range.from().ch = listContentStartCh;
                changeObj.update([range]);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
}

class ZoomState {
    constructor(line, header) {
        this.line = line;
        this.header = header;
    }
}
class ZoomFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
        this.zoomStates = new WeakMap();
        this.handleBeforeChange = (cm, changeObj) => {
            const zoomState = this.zoomStates.get(cm);
            if (!zoomState ||
                changeObj.origin !== "setValue" ||
                changeObj.from.line !== 0 ||
                changeObj.from.ch !== 0) {
                return;
            }
            const tillLine = cm.lastLine();
            const tillCh = cm.getLine(tillLine).length;
            if (changeObj.to.line !== tillLine || changeObj.to.ch !== tillCh) {
                return;
            }
            this.zoomOut(cm);
        };
        this.handleChange = (cm, changeObj) => {
            const zoomState = this.zoomStates.get(cm);
            if (!zoomState || changeObj.origin !== "setValue") {
                return;
            }
            this.zoomIn(cm, {
                line: cm.getLineNumber(zoomState.line),
                ch: 0,
            });
        };
        this.handleBeforeSelectionChange = (cm, changeObj) => {
            if (!this.zoomStates.has(cm)) {
                return;
            }
            let visibleFrom = null;
            let visibleTill = null;
            for (let i = cm.firstLine(); i <= cm.lastLine(); i++) {
                const wrapClass = cm.lineInfo(i).wrapClass || "";
                const isHidden = wrapClass.includes("outliner-plugin-hidden-row");
                if (visibleFrom === null && !isHidden) {
                    visibleFrom = { line: i, ch: 0 };
                }
                if (visibleFrom !== null && visibleTill !== null && isHidden) {
                    break;
                }
                if (visibleFrom !== null) {
                    visibleTill = { line: i, ch: cm.getLine(i).length };
                }
            }
            let changed = false;
            for (const range of changeObj.ranges) {
                if (range.anchor.line < visibleFrom.line) {
                    changed = true;
                    range.anchor.line = visibleFrom.line;
                    range.anchor.ch = visibleFrom.ch;
                }
                if (range.anchor.line > visibleTill.line) {
                    changed = true;
                    range.anchor.line = visibleTill.line;
                    range.anchor.ch = visibleTill.ch;
                }
                if (range.head.line < visibleFrom.line) {
                    changed = true;
                    range.head.line = visibleFrom.line;
                    range.head.ch = visibleFrom.ch;
                }
                if (range.head.line > visibleTill.line) {
                    changed = true;
                    range.head.line = visibleTill.line;
                    range.head.ch = visibleTill.ch;
                }
            }
            if (changed) {
                changeObj.update(changeObj.ranges);
            }
        };
        this.zoomStates = new WeakMap();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.handleBeforeChange);
                cm.on("change", this.handleChange);
                cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
            this.plugin.addCommand({
                id: "zoom-in",
                name: "Zoom in to the current list item",
                callback: this.obsidianUtils.createCommandCallback(this.zoomIn.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: ".",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "zoom-out",
                name: "Zoom out the entire document",
                callback: this.obsidianUtils.createCommandCallback(this.zoomOut.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: ".",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
                cm.off("change", this.handleChange);
                cm.off("beforeChange", this.handleBeforeChange);
            });
        });
    }
    zoomOut(editor) {
        const zoomState = this.zoomStates.get(editor);
        if (!zoomState) {
            return false;
        }
        for (let i = editor.firstLine(), l = editor.lastLine(); i <= l; i++) {
            editor.removeLineClass(i, "wrap", "outliner-plugin-hidden-row");
        }
        zoomState.header.parentElement.removeChild(zoomState.header);
        this.zoomStates.delete(editor);
        return true;
    }
    zoomIn(editor, cursor = editor.getCursor()) {
        const lineNo = cursor.line;
        const root = this.listsUtils.parseList(editor, cursor);
        if (!root) {
            return false;
        }
        this.zoomOut(editor);
        const { indentLevel } = this.listsUtils.getListLineInfo(editor.getLine(lineNo), root.getIndentSign());
        let after = false;
        for (let i = editor.firstLine(), l = editor.lastLine(); i <= l; i++) {
            if (i < lineNo) {
                editor.addLineClass(i, "wrap", "outliner-plugin-hidden-row");
            }
            else if (i > lineNo && !after) {
                const afterLineInfo = this.listsUtils.getListLineInfo(editor.getLine(i), root.getIndentSign());
                after = !afterLineInfo || afterLineInfo.indentLevel <= indentLevel;
            }
            if (after) {
                editor.addLineClass(i, "wrap", "outliner-plugin-hidden-row");
            }
        }
        const createSeparator = () => {
            const span = document.createElement("span");
            span.textContent = " > ";
            return span;
        };
        const createTitle = (content, cb) => {
            const a = document.createElement("a");
            a.className = "outliner-plugin-zoom-title";
            if (content) {
                a.textContent = content;
            }
            else {
                a.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            a.onclick = (e) => {
                e.preventDefault();
                cb();
            };
            return a;
        };
        const createHeader = () => {
            const div = document.createElement("div");
            div.className = "outliner-plugin-zoom-header";
            let list = root.getListUnderLine(lineNo).getParent();
            while (list && list.getParent()) {
                const lineNo = root.getLineNumberOf(list);
                div.prepend(createTitle(list.getContent(), () => this.zoomIn(editor, { line: lineNo, ch: 0 })));
                div.prepend(createSeparator());
                list = list.getParent();
            }
            div.prepend(createTitle(this.obsidianUtils.getActiveLeafDisplayText(), () => this.zoomOut(editor)));
            return div;
        };
        const zoomHeader = createHeader();
        editor.getWrapperElement().prepend(zoomHeader);
        this.zoomStates.set(editor, new ZoomState(editor.getLineHandle(lineNo), zoomHeader));
        return true;
    }
}

class FoldFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "fold",
                name: "Fold the list",
                callback: this.obsidianUtils.createCommandCallback(this.fold.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "unfold",
                name: "Unfold the list",
                callback: this.obsidianUtils.createCommandCallback(this.unfold.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowDown",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    setFold(editor, type) {
        if (!this.listsUtils.isCursorInList(editor)) {
            return false;
        }
        editor.foldCode(editor.getCursor(), null, type);
        return true;
    }
    fold(editor) {
        return this.setFold(editor, "fold");
    }
    unfold(editor) {
        return this.setFold(editor, "unfold");
    }
}

class SelectAllFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "select-all",
                name: "Select a list item or the entire list",
                callback: this.obsidianUtils.createCommandCallback(this.selectAll.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "a",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    selectAll(editor) {
        const selections = editor.listSelections();
        if (selections.length !== 1) {
            return false;
        }
        const selection = selections[0];
        if (selection.anchor.line !== selection.head.line) {
            return false;
        }
        const root = this.listsUtils.parseList(editor, selection.anchor);
        if (!root) {
            return false;
        }
        const list = root.getListUnderCursor();
        const startCh = list.getContentStartCh();
        const endCh = list.getContentEndCh();
        if (selection.from().ch === startCh && selection.to().ch === endCh) {
            // select all list
            editor.setSelection(root.getListStartPosition(), root.getListEndPosition());
        }
        else {
            // select all line
            editor.setSelection({
                line: selection.anchor.line,
                ch: startCh,
            }, {
                line: selection.anchor.line,
                ch: endCh,
            });
        }
        return true;
    }
}

class MoveItemsFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "move-list-item-up",
                name: "Move list and sublists up",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementUp.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "move-list-item-down",
                name: "Move list and sublists down",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementDown.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowDown",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "indent-list",
                name: "Indent the list and sublists",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementRight.bind(this)),
                hotkeys: [
                    {
                        modifiers: [],
                        key: "Tab",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "outdent-list",
                name: "Outdent the list and sublists",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementLeft.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Shift"],
                        key: "Tab",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    execute(editor, cb) {
        const root = this.listsUtils.parseList(editor, editor.getCursor());
        if (!root) {
            return false;
        }
        const result = cb(root);
        if (result) {
            this.listsUtils.applyChanges(editor, root);
        }
        return result;
    }
    moveListElementDown(editor) {
        return this.execute(editor, (root) => root.moveDown());
    }
    moveListElementUp(editor) {
        return this.execute(editor, (root) => root.moveUp());
    }
    moveListElementRight(editor) {
        return this.execute(editor, (root) => root.moveRight());
    }
    moveListElementLeft(editor) {
        return this.execute(editor, (root) => root.moveLeft());
    }
}

class ObsidianOutlinerPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Loading obsidian-outliner`);
            this.settings = new Settings(this);
            yield this.settings.load();
            this.logger = new Logger(this.settings);
            this.obsidianUtils = new ObsidianUtils(this.app);
            this.editorUtils = new EditorUtils();
            this.listsUtils = new ListUtils(this.logger, this.obsidianUtils);
            this.addSettingTab(new ObsidianOutlinerPluginSettingTab(this.app, this, this.settings));
            this.features = [
                new ListsStylesFeature(this, this.settings, this.obsidianUtils),
                new EnterOutdentIfLineIsEmptyFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new EnterShouldCreateNewlineOnChildLevelFeature(this, this.settings, this.listsUtils),
                new EnsureCursorInListContentFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new MoveCursorToPreviousUnfoldedLineFeature(this, this.settings, this.listsUtils),
                new DeleteShouldIgnoreBulletsFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new SelectionShouldIgnoreBulletsFeature(this, this.settings, this.listsUtils),
                new ZoomFeature(this, this.obsidianUtils, this.listsUtils),
                new FoldFeature(this, this.obsidianUtils, this.listsUtils),
                new SelectAllFeature(this, this.obsidianUtils, this.listsUtils),
                new MoveItemsFeature(this, this.obsidianUtils, this.listsUtils),
            ];
            for (const feature of this.features) {
                yield feature.load();
            }
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Unloading obsidian-outliner`);
            for (const feature of this.features) {
                yield feature.unload();
            }
        });
    }
}

module.exports = ObsidianOutlinerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy9vYnNpZGlhbl91dGlscy50cyIsInNyYy9lZGl0b3JfdXRpbHMudHMiLCJub2RlX21vZHVsZXMvZGlmZi9saWIvaW5kZXgubWpzIiwic3JjL3Jvb3QudHMiLCJzcmMvbGlzdF91dGlscy50cyIsInNyYy9sb2dnZXIudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0Vuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1pvb21GZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0ZvbGRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NlbGVjdEFsbEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZS50cyIsInNyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXHJcbiAgICAgICAgdG9bal0gPSBmcm9tW2ldO1xyXG4gICAgcmV0dXJuIHRvO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZU1hcC5zZXQocmVjZWl2ZXIsIHZhbHVlKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFBsdWdpbl8yLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgc3R5bGVMaXN0czogYm9vbGVhbjtcbiAgZGVidWc6IGJvb2xlYW47XG4gIHN0aWNrQ3Vyc29yOiBib29sZWFuO1xuICBiZXR0ZXJFbnRlcjogYm9vbGVhbjtcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzID0ge1xuICBzdHlsZUxpc3RzOiBmYWxzZSxcbiAgZGVidWc6IGZhbHNlLFxuICBzdGlja0N1cnNvcjogdHJ1ZSxcbiAgYmV0dGVyRW50ZXI6IHRydWUsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICBsb2FkRGF0YSgpOiBQcm9taXNlPE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncz47XG4gIHNhdmVEYXRhKHNldHRpZ25zOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG50eXBlIEsgPSBrZXlvZiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3M7XG50eXBlIFY8VCBleHRlbmRzIEs+ID0gT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzW1RdO1xudHlwZSBDYWxsYmFjazxUIGV4dGVuZHMgSz4gPSAoY2I6IFY8VD4pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyBpbXBsZW1lbnRzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZTtcbiAgcHJpdmF0ZSB2YWx1ZXM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbiAgcHJpdmF0ZSBoYW5kbGVyczogTWFwPEssIFNldDxDYWxsYmFjazxLPj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JhZ2U6IFN0b3JhZ2UpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXQgc3R5bGVMaXN0cygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuc3R5bGVMaXN0cztcbiAgfVxuICBzZXQgc3R5bGVMaXN0cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3R5bGVMaXN0c1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmRlYnVnO1xuICB9XG4gIHNldCBkZWJ1Zyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiZGVidWdcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHN0aWNrQ3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdGlja0N1cnNvcjtcbiAgfVxuICBzZXQgc3RpY2tDdXJzb3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcInN0aWNrQ3Vyc29yXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBiZXR0ZXJFbnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuYmV0dGVyRW50ZXI7XG4gIH1cbiAgc2V0IGJldHRlckVudGVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJiZXR0ZXJFbnRlclwiLCB2YWx1ZSk7XG4gIH1cblxuICBvbkNoYW5nZTxUIGV4dGVuZHMgSz4oa2V5OiBULCBjYjogQ2FsbGJhY2s8VD4pIHtcbiAgICBpZiAoIXRoaXMuaGFuZGxlcnMuaGFzKGtleSkpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KGtleSwgbmV3IFNldCgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZXJzLmdldChrZXkpLmFkZChjYik7XG4gIH1cblxuICByZW1vdmVDYWxsYmFjazxUIGV4dGVuZHMgSz4oa2V5OiBULCBjYjogQ2FsbGJhY2s8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnMuZ2V0KGtleSk7XG5cbiAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgIGhhbmRsZXJzLmRlbGV0ZShjYik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnZhbHVlcyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIERFRkFVTFRfU0VUVElOR1MsXG4gICAgICBhd2FpdCB0aGlzLnN0b3JhZ2UubG9hZERhdGEoKVxuICAgICk7XG4gIH1cblxuICBhc3luYyBzYXZlKCkge1xuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5zYXZlRGF0YSh0aGlzLnZhbHVlcyk7XG4gIH1cblxuICBwcml2YXRlIHNldDxUIGV4dGVuZHMgSz4oa2V5OiBULCB2YWx1ZTogVjxLPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLmhhbmRsZXJzLmdldChrZXkpO1xuXG4gICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNiIG9mIGNhbGxiYWNrcy52YWx1ZXMoKSkge1xuICAgICAgY2IodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUGx1Z2luXzIsIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbXByb3ZlIHRoZSBzdHlsZSBvZiB5b3VyIGxpc3RzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTdHlsZXMgYXJlIG9ubHkgY29tcGF0aWJsZSB3aXRoIGJ1aWx0LWluIE9ic2lkaWFuIHRoZW1lcyBhbmQgbWF5IG5vdCBiZSBjb21wYXRpYmxlIHdpdGggb3RoZXIgdGhlbWVzLiBTdHlsZXMgb25seSB3b3JrIHdlbGwgd2l0aCBzcGFjZXMgb3IgZm91ci1zcGFjZSB0YWJzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3RpY2sgdGhlIGN1cnNvciB0byB0aGUgY29udGVudFwiKVxuICAgICAgLnNldERlc2MoXCJEb24ndCBsZXQgdGhlIGN1cnNvciBtb3ZlIHRvIHRoZSBidWxsZXQgcG9zaXRpb24uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBFbnRlciBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiTWFrZSB0aGUgRW50ZXIga2V5IGJlaGF2ZSB0aGUgc2FtZSBhcyBvdGhlciBvdXRsaW5lcnMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEZWJ1ZyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIERldlRvb2xzIChDb21tYW5kK09wdGlvbitJIG9yIENvbnRyb2wrU2hpZnQrSSkgdG8gY29weSB0aGUgZGVidWcgbG9ncy5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmRlYnVnKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmRlYnVnID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9ic2lkaWFuVGFic1NldHRpZ25zIHtcbiAgdXNlVGFiOiBib29sZWFuO1xuICB0YWJTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNpZGlhblV0aWxzIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICBnZXRPYnNpZGlhblRhYnNTZXR0aWducygpOiBJT2JzaWRpYW5UYWJzU2V0dGlnbnMge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VUYWI6IHRydWUsXG4gICAgICB0YWJTaXplOiA0LFxuICAgICAgLi4uKHRoaXMuYXBwLnZhdWx0IGFzIGFueSkuY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBnZXRBY3RpdmVMZWFmRGlzcGxheVRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLmdldERpc3BsYXlUZXh0KCk7XG4gIH1cblxuICBjcmVhdGVDb21tYW5kQ2FsbGJhY2soY2I6IChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSA9PiBib29sZWFuKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuXG4gICAgICBpZiAoIXZpZXcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlZGl0b3IgPSB2aWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XG5cbiAgICAgIGNvbnN0IHdvcmtlZCA9IGNiKGVkaXRvcik7XG5cbiAgICAgIGlmICghd29ya2VkICYmIHdpbmRvdy5ldmVudCAmJiB3aW5kb3cuZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCIpIHtcbiAgICAgICAgKGVkaXRvciBhcyBhbnkpLnRyaWdnZXJPbktleURvd24od2luZG93LmV2ZW50KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRWRpdG9yVXRpbHMge1xuICBjb250YWluc1NpbmdsZUN1cnNvcihlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9ucyA9IGVkaXRvci5saXN0U2VsZWN0aW9ucygpO1xuXG4gICAgcmV0dXJuIHNlbGVjdGlvbnMubGVuZ3RoID09PSAxICYmIHRoaXMucmFuZ2VJc0N1cnNvcihzZWxlY3Rpb25zWzBdKTtcbiAgfVxuXG4gIHJhbmdlSXNDdXJzb3Ioc2VsZWN0aW9uOiBDb2RlTWlycm9yLlJhbmdlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHNlbGVjdGlvbi5hbmNob3IubGluZSA9PT0gc2VsZWN0aW9uLmhlYWQubGluZSAmJlxuICAgICAgc2VsZWN0aW9uLmFuY2hvci5jaCA9PT0gc2VsZWN0aW9uLmhlYWQuY2hcbiAgICApO1xuICB9XG59XG4iLCJmdW5jdGlvbiBEaWZmKCkge31cbkRpZmYucHJvdG90eXBlID0ge1xuICBkaWZmOiBmdW5jdGlvbiBkaWZmKG9sZFN0cmluZywgbmV3U3RyaW5nKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuICAgIHZhciBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIGRvbmUodmFsdWUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHZhbHVlKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH0gLy8gQWxsb3cgc3ViY2xhc3NlcyB0byBtYXNzYWdlIHRoZSBpbnB1dCBwcmlvciB0byBydW5uaW5nXG5cblxuICAgIG9sZFN0cmluZyA9IHRoaXMuY2FzdElucHV0KG9sZFN0cmluZyk7XG4gICAgbmV3U3RyaW5nID0gdGhpcy5jYXN0SW5wdXQobmV3U3RyaW5nKTtcbiAgICBvbGRTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUob2xkU3RyaW5nKSk7XG4gICAgbmV3U3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG5ld1N0cmluZykpO1xuICAgIHZhciBuZXdMZW4gPSBuZXdTdHJpbmcubGVuZ3RoLFxuICAgICAgICBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBlZGl0TGVuZ3RoID0gMTtcbiAgICB2YXIgbWF4RWRpdExlbmd0aCA9IG5ld0xlbiArIG9sZExlbjtcbiAgICB2YXIgYmVzdFBhdGggPSBbe1xuICAgICAgbmV3UG9zOiAtMSxcbiAgICAgIGNvbXBvbmVudHM6IFtdXG4gICAgfV07IC8vIFNlZWQgZWRpdExlbmd0aCA9IDAsIGkuZS4gdGhlIGNvbnRlbnQgc3RhcnRzIHdpdGggdGhlIHNhbWUgdmFsdWVzXG5cbiAgICB2YXIgb2xkUG9zID0gdGhpcy5leHRyYWN0Q29tbW9uKGJlc3RQYXRoWzBdLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgMCk7XG5cbiAgICBpZiAoYmVzdFBhdGhbMF0ubmV3UG9zICsgMSA+PSBuZXdMZW4gJiYgb2xkUG9zICsgMSA+PSBvbGRMZW4pIHtcbiAgICAgIC8vIElkZW50aXR5IHBlciB0aGUgZXF1YWxpdHkgYW5kIHRva2VuaXplclxuICAgICAgcmV0dXJuIGRvbmUoW3tcbiAgICAgICAgdmFsdWU6IHRoaXMuam9pbihuZXdTdHJpbmcpLFxuICAgICAgICBjb3VudDogbmV3U3RyaW5nLmxlbmd0aFxuICAgICAgfV0pO1xuICAgIH0gLy8gTWFpbiB3b3JrZXIgbWV0aG9kLiBjaGVja3MgYWxsIHBlcm11dGF0aW9ucyBvZiBhIGdpdmVuIGVkaXQgbGVuZ3RoIGZvciBhY2NlcHRhbmNlLlxuXG5cbiAgICBmdW5jdGlvbiBleGVjRWRpdExlbmd0aCgpIHtcbiAgICAgIGZvciAodmFyIGRpYWdvbmFsUGF0aCA9IC0xICogZWRpdExlbmd0aDsgZGlhZ29uYWxQYXRoIDw9IGVkaXRMZW5ndGg7IGRpYWdvbmFsUGF0aCArPSAyKSB7XG4gICAgICAgIHZhciBiYXNlUGF0aCA9IHZvaWQgMDtcblxuICAgICAgICB2YXIgYWRkUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdLFxuICAgICAgICAgICAgcmVtb3ZlUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCArIDFdLFxuICAgICAgICAgICAgX29sZFBvcyA9IChyZW1vdmVQYXRoID8gcmVtb3ZlUGF0aC5uZXdQb3MgOiAwKSAtIGRpYWdvbmFsUGF0aDtcblxuICAgICAgICBpZiAoYWRkUGF0aCkge1xuICAgICAgICAgIC8vIE5vIG9uZSBlbHNlIGlzIGdvaW5nIHRvIGF0dGVtcHQgdG8gdXNlIHRoaXMgdmFsdWUsIGNsZWFyIGl0XG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FuQWRkID0gYWRkUGF0aCAmJiBhZGRQYXRoLm5ld1BvcyArIDEgPCBuZXdMZW4sXG4gICAgICAgICAgICBjYW5SZW1vdmUgPSByZW1vdmVQYXRoICYmIDAgPD0gX29sZFBvcyAmJiBfb2xkUG9zIDwgb2xkTGVuO1xuXG4gICAgICAgIGlmICghY2FuQWRkICYmICFjYW5SZW1vdmUpIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIHBhdGggaXMgYSB0ZXJtaW5hbCB0aGVuIHBydW5lXG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBTZWxlY3QgdGhlIGRpYWdvbmFsIHRoYXQgd2Ugd2FudCB0byBicmFuY2ggZnJvbS4gV2Ugc2VsZWN0IHRoZSBwcmlvclxuICAgICAgICAvLyBwYXRoIHdob3NlIHBvc2l0aW9uIGluIHRoZSBuZXcgc3RyaW5nIGlzIHRoZSBmYXJ0aGVzdCBmcm9tIHRoZSBvcmlnaW5cbiAgICAgICAgLy8gYW5kIGRvZXMgbm90IHBhc3MgdGhlIGJvdW5kcyBvZiB0aGUgZGlmZiBncmFwaFxuXG5cbiAgICAgICAgaWYgKCFjYW5BZGQgfHwgY2FuUmVtb3ZlICYmIGFkZFBhdGgubmV3UG9zIDwgcmVtb3ZlUGF0aC5uZXdQb3MpIHtcbiAgICAgICAgICBiYXNlUGF0aCA9IGNsb25lUGF0aChyZW1vdmVQYXRoKTtcbiAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiYXNlUGF0aCA9IGFkZFBhdGg7IC8vIE5vIG5lZWQgdG8gY2xvbmUsIHdlJ3ZlIHB1bGxlZCBpdCBmcm9tIHRoZSBsaXN0XG5cbiAgICAgICAgICBiYXNlUGF0aC5uZXdQb3MrKztcbiAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdHJ1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9vbGRQb3MgPSBzZWxmLmV4dHJhY3RDb21tb24oYmFzZVBhdGgsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBkaWFnb25hbFBhdGgpOyAvLyBJZiB3ZSBoYXZlIGhpdCB0aGUgZW5kIG9mIGJvdGggc3RyaW5ncywgdGhlbiB3ZSBhcmUgZG9uZVxuXG4gICAgICAgIGlmIChiYXNlUGF0aC5uZXdQb3MgKyAxID49IG5ld0xlbiAmJiBfb2xkUG9zICsgMSA+PSBvbGRMZW4pIHtcbiAgICAgICAgICByZXR1cm4gZG9uZShidWlsZFZhbHVlcyhzZWxmLCBiYXNlUGF0aC5jb21wb25lbnRzLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgc2VsZi51c2VMb25nZXN0VG9rZW4pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgdHJhY2sgdGhpcyBwYXRoIGFzIGEgcG90ZW50aWFsIGNhbmRpZGF0ZSBhbmQgY29udGludWUuXG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IGJhc2VQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVkaXRMZW5ndGgrKztcbiAgICB9IC8vIFBlcmZvcm1zIHRoZSBsZW5ndGggb2YgZWRpdCBpdGVyYXRpb24uIElzIGEgYml0IGZ1Z2x5IGFzIHRoaXMgaGFzIHRvIHN1cHBvcnQgdGhlXG4gICAgLy8gc3luYyBhbmQgYXN5bmMgbW9kZSB3aGljaCBpcyBuZXZlciBmdW4uIExvb3BzIG92ZXIgZXhlY0VkaXRMZW5ndGggdW50aWwgYSB2YWx1ZVxuICAgIC8vIGlzIHByb2R1Y2VkLlxuXG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIChmdW5jdGlvbiBleGVjKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBiZSBzYWZlLlxuXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICBpZiAoZWRpdExlbmd0aCA+IG1heEVkaXRMZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZXhlY0VkaXRMZW5ndGgoKSkge1xuICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9KSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoZWRpdExlbmd0aCA8PSBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgIHZhciByZXQgPSBleGVjRWRpdExlbmd0aCgpO1xuXG4gICAgICAgIGlmIChyZXQpIHtcbiAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBwdXNoQ29tcG9uZW50OiBmdW5jdGlvbiBwdXNoQ29tcG9uZW50KGNvbXBvbmVudHMsIGFkZGVkLCByZW1vdmVkKSB7XG4gICAgdmFyIGxhc3QgPSBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAobGFzdCAmJiBsYXN0LmFkZGVkID09PSBhZGRlZCAmJiBsYXN0LnJlbW92ZWQgPT09IHJlbW92ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gY2xvbmUgaGVyZSBhcyB0aGUgY29tcG9uZW50IGNsb25lIG9wZXJhdGlvbiBpcyBqdXN0XG4gICAgICAvLyBhcyBzaGFsbG93IGFycmF5IGNsb25lXG4gICAgICBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV0gPSB7XG4gICAgICAgIGNvdW50OiBsYXN0LmNvdW50ICsgMSxcbiAgICAgICAgYWRkZWQ6IGFkZGVkLFxuICAgICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBjb3VudDogMSxcbiAgICAgICAgYWRkZWQ6IGFkZGVkLFxuICAgICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIGV4dHJhY3RDb21tb246IGZ1bmN0aW9uIGV4dHJhY3RDb21tb24oYmFzZVBhdGgsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBkaWFnb25hbFBhdGgpIHtcbiAgICB2YXIgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgb2xkTGVuID0gb2xkU3RyaW5nLmxlbmd0aCxcbiAgICAgICAgbmV3UG9zID0gYmFzZVBhdGgubmV3UG9zLFxuICAgICAgICBvbGRQb3MgPSBuZXdQb3MgLSBkaWFnb25hbFBhdGgsXG4gICAgICAgIGNvbW1vbkNvdW50ID0gMDtcblxuICAgIHdoaWxlIChuZXdQb3MgKyAxIDwgbmV3TGVuICYmIG9sZFBvcyArIDEgPCBvbGRMZW4gJiYgdGhpcy5lcXVhbHMobmV3U3RyaW5nW25ld1BvcyArIDFdLCBvbGRTdHJpbmdbb2xkUG9zICsgMV0pKSB7XG4gICAgICBuZXdQb3MrKztcbiAgICAgIG9sZFBvcysrO1xuICAgICAgY29tbW9uQ291bnQrKztcbiAgICB9XG5cbiAgICBpZiAoY29tbW9uQ291bnQpIHtcbiAgICAgIGJhc2VQYXRoLmNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGNvdW50OiBjb21tb25Db3VudFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmFzZVBhdGgubmV3UG9zID0gbmV3UG9zO1xuICAgIHJldHVybiBvbGRQb3M7XG4gIH0sXG4gIGVxdWFsczogZnVuY3Rpb24gZXF1YWxzKGxlZnQsIHJpZ2h0KSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbXBhcmF0b3IobGVmdCwgcmlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQgfHwgdGhpcy5vcHRpb25zLmlnbm9yZUNhc2UgJiYgbGVmdC50b0xvd2VyQ2FzZSgpID09PSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlRW1wdHk6IGZ1bmN0aW9uIHJlbW92ZUVtcHR5KGFycmF5KSB7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgIHJldC5wdXNoKGFycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuICBjYXN0SW5wdXQ6IGZ1bmN0aW9uIGNhc3RJbnB1dCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSxcbiAgdG9rZW5pemU6IGZ1bmN0aW9uIHRva2VuaXplKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnNwbGl0KCcnKTtcbiAgfSxcbiAgam9pbjogZnVuY3Rpb24gam9pbihjaGFycykge1xuICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYnVpbGRWYWx1ZXMoZGlmZiwgY29tcG9uZW50cywgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHVzZUxvbmdlc3RUb2tlbikge1xuICB2YXIgY29tcG9uZW50UG9zID0gMCxcbiAgICAgIGNvbXBvbmVudExlbiA9IGNvbXBvbmVudHMubGVuZ3RoLFxuICAgICAgbmV3UG9zID0gMCxcbiAgICAgIG9sZFBvcyA9IDA7XG5cbiAgZm9yICg7IGNvbXBvbmVudFBvcyA8IGNvbXBvbmVudExlbjsgY29tcG9uZW50UG9zKyspIHtcbiAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wb25lbnRQb3NdO1xuXG4gICAgaWYgKCFjb21wb25lbnQucmVtb3ZlZCkge1xuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQgJiYgdXNlTG9uZ2VzdFRva2VuKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG5ld1N0cmluZy5zbGljZShuZXdQb3MsIG5ld1BvcyArIGNvbXBvbmVudC5jb3VudCk7XG4gICAgICAgIHZhbHVlID0gdmFsdWUubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaSkge1xuICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IG9sZFN0cmluZ1tvbGRQb3MgKyBpXTtcbiAgICAgICAgICByZXR1cm4gb2xkVmFsdWUubGVuZ3RoID4gdmFsdWUubGVuZ3RoID8gb2xkVmFsdWUgOiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICB9XG5cbiAgICAgIG5ld1BvcyArPSBjb21wb25lbnQuY291bnQ7IC8vIENvbW1vbiBjYXNlXG5cbiAgICAgIGlmICghY29tcG9uZW50LmFkZGVkKSB7XG4gICAgICAgIG9sZFBvcyArPSBjb21wb25lbnQuY291bnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbihvbGRTdHJpbmcuc2xpY2Uob2xkUG9zLCBvbGRQb3MgKyBjb21wb25lbnQuY291bnQpKTtcbiAgICAgIG9sZFBvcyArPSBjb21wb25lbnQuY291bnQ7IC8vIFJldmVyc2UgYWRkIGFuZCByZW1vdmUgc28gcmVtb3ZlcyBhcmUgb3V0cHV0IGZpcnN0IHRvIG1hdGNoIGNvbW1vbiBjb252ZW50aW9uXG4gICAgICAvLyBUaGUgZGlmZmluZyBhbGdvcml0aG0gaXMgdGllZCB0byBhZGQgdGhlbiByZW1vdmUgb3V0cHV0IGFuZCB0aGlzIGlzIHRoZSBzaW1wbGVzdFxuICAgICAgLy8gcm91dGUgdG8gZ2V0IHRoZSBkZXNpcmVkIG91dHB1dCB3aXRoIG1pbmltYWwgb3ZlcmhlYWQuXG5cbiAgICAgIGlmIChjb21wb25lbnRQb3MgJiYgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXS5hZGRlZCkge1xuICAgICAgICB2YXIgdG1wID0gY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXSA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3NdID0gdG1wO1xuICAgICAgfVxuICAgIH1cbiAgfSAvLyBTcGVjaWFsIGNhc2UgaGFuZGxlIGZvciB3aGVuIG9uZSB0ZXJtaW5hbCBpcyBpZ25vcmVkIChpLmUuIHdoaXRlc3BhY2UpLlxuICAvLyBGb3IgdGhpcyBjYXNlIHdlIG1lcmdlIHRoZSB0ZXJtaW5hbCBpbnRvIHRoZSBwcmlvciBzdHJpbmcgYW5kIGRyb3AgdGhlIGNoYW5nZS5cbiAgLy8gVGhpcyBpcyBvbmx5IGF2YWlsYWJsZSBmb3Igc3RyaW5nIG1vZGUuXG5cblxuICB2YXIgbGFzdENvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50TGVuIC0gMV07XG5cbiAgaWYgKGNvbXBvbmVudExlbiA+IDEgJiYgdHlwZW9mIGxhc3RDb21wb25lbnQudmFsdWUgPT09ICdzdHJpbmcnICYmIChsYXN0Q29tcG9uZW50LmFkZGVkIHx8IGxhc3RDb21wb25lbnQucmVtb3ZlZCkgJiYgZGlmZi5lcXVhbHMoJycsIGxhc3RDb21wb25lbnQudmFsdWUpKSB7XG4gICAgY29tcG9uZW50c1tjb21wb25lbnRMZW4gLSAyXS52YWx1ZSArPSBsYXN0Q29tcG9uZW50LnZhbHVlO1xuICAgIGNvbXBvbmVudHMucG9wKCk7XG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50cztcbn1cblxuZnVuY3Rpb24gY2xvbmVQYXRoKHBhdGgpIHtcbiAgcmV0dXJuIHtcbiAgICBuZXdQb3M6IHBhdGgubmV3UG9zLFxuICAgIGNvbXBvbmVudHM6IHBhdGguY29tcG9uZW50cy5zbGljZSgwKVxuICB9O1xufVxuXG52YXIgY2hhcmFjdGVyRGlmZiA9IG5ldyBEaWZmKCk7XG5mdW5jdGlvbiBkaWZmQ2hhcnMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNoYXJhY3RlckRpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0cykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBkZWZhdWx0cy5jYWxsYmFjayA9IG9wdGlvbnM7XG4gIH0gZWxzZSBpZiAob3B0aW9ucykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGRlZmF1bHRzW25hbWVdID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdHM7XG59XG5cbi8vXG4vLyBSYW5nZXMgYW5kIGV4Y2VwdGlvbnM6XG4vLyBMYXRpbi0xIFN1cHBsZW1lbnQsIDAwODDigJMwMEZGXG4vLyAgLSBVKzAwRDcgIMOXIE11bHRpcGxpY2F0aW9uIHNpZ25cbi8vICAtIFUrMDBGNyAgw7cgRGl2aXNpb24gc2lnblxuLy8gTGF0aW4gRXh0ZW5kZWQtQSwgMDEwMOKAkzAxN0Zcbi8vIExhdGluIEV4dGVuZGVkLUIsIDAxODDigJMwMjRGXG4vLyBJUEEgRXh0ZW5zaW9ucywgMDI1MOKAkzAyQUZcbi8vIFNwYWNpbmcgTW9kaWZpZXIgTGV0dGVycywgMDJCMOKAkzAyRkZcbi8vICAtIFUrMDJDNyAgy4cgJiM3MTE7ICBDYXJvblxuLy8gIC0gVSswMkQ4ICDLmCAmIzcyODsgIEJyZXZlXG4vLyAgLSBVKzAyRDkgIMuZICYjNzI5OyAgRG90IEFib3ZlXG4vLyAgLSBVKzAyREEgIMuaICYjNzMwOyAgUmluZyBBYm92ZVxuLy8gIC0gVSswMkRCICDLmyAmIzczMTsgIE9nb25la1xuLy8gIC0gVSswMkRDICDLnCAmIzczMjsgIFNtYWxsIFRpbGRlXG4vLyAgLSBVKzAyREQgIMudICYjNzMzOyAgRG91YmxlIEFjdXRlIEFjY2VudFxuLy8gTGF0aW4gRXh0ZW5kZWQgQWRkaXRpb25hbCwgMUUwMOKAkzFFRkZcblxudmFyIGV4dGVuZGVkV29yZENoYXJzID0gL15bQS1aYS16XFx4QzAtXFx1MDJDNlxcdTAyQzgtXFx1MDJEN1xcdTAyREUtXFx1MDJGRlxcdTFFMDAtXFx1MUVGRl0rJC87XG52YXIgcmVXaGl0ZXNwYWNlID0gL1xcUy87XG52YXIgd29yZERpZmYgPSBuZXcgRGlmZigpO1xuXG53b3JkRGlmZi5lcXVhbHMgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVDYXNlKSB7XG4gICAgbGVmdCA9IGxlZnQudG9Mb3dlckNhc2UoKTtcbiAgICByaWdodCA9IHJpZ2h0LnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICByZXR1cm4gbGVmdCA9PT0gcmlnaHQgfHwgdGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCk7XG59O1xuXG53b3JkRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAvLyBBbGwgd2hpdGVzcGFjZSBzeW1ib2xzIGV4Y2VwdCBuZXdsaW5lIGdyb3VwIGludG8gb25lIHRva2VuLCBlYWNoIG5ld2xpbmUgLSBpbiBzZXBhcmF0ZSB0b2tlblxuICB2YXIgdG9rZW5zID0gdmFsdWUuc3BsaXQoLyhbXlxcU1xcclxcbl0rfFsoKVtcXF17fSdcIlxcclxcbl18XFxiKS8pOyAvLyBKb2luIHRoZSBib3VuZGFyeSBzcGxpdHMgdGhhdCB3ZSBkbyBub3QgY29uc2lkZXIgdG8gYmUgYm91bmRhcmllcy4gVGhpcyBpcyBwcmltYXJpbHkgdGhlIGV4dGVuZGVkIExhdGluIGNoYXJhY3RlciBzZXQuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBhbiBlbXB0eSBzdHJpbmcgaW4gdGhlIG5leHQgZmllbGQgYW5kIHdlIGhhdmUgb25seSB3b3JkIGNoYXJzIGJlZm9yZSBhbmQgYWZ0ZXIsIG1lcmdlXG4gICAgaWYgKCF0b2tlbnNbaSArIDFdICYmIHRva2Vuc1tpICsgMl0gJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaV0pICYmIGV4dGVuZGVkV29yZENoYXJzLnRlc3QodG9rZW5zW2kgKyAyXSkpIHtcbiAgICAgIHRva2Vuc1tpXSArPSB0b2tlbnNbaSArIDJdO1xuICAgICAgdG9rZW5zLnNwbGljZShpICsgMSwgMik7XG4gICAgICBpLS07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRva2Vucztcbn07XG5cbmZ1bmN0aW9uIGRpZmZXb3JkcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICBpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlXG4gIH0pO1xuICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBkaWZmV29yZHNXaXRoU3BhY2Uob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuXG52YXIgbGluZURpZmYgPSBuZXcgRGlmZigpO1xuXG5saW5lRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcmV0TGluZXMgPSBbXSxcbiAgICAgIGxpbmVzQW5kTmV3bGluZXMgPSB2YWx1ZS5zcGxpdCgvKFxcbnxcXHJcXG4pLyk7IC8vIElnbm9yZSB0aGUgZmluYWwgZW1wdHkgdG9rZW4gdGhhdCBvY2N1cnMgaWYgdGhlIHN0cmluZyBlbmRzIHdpdGggYSBuZXcgbGluZVxuXG4gIGlmICghbGluZXNBbmROZXdsaW5lc1tsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgbGluZXNBbmROZXdsaW5lcy5wb3AoKTtcbiAgfSAvLyBNZXJnZSB0aGUgY29udGVudCBhbmQgbGluZSBzZXBhcmF0b3JzIGludG8gc2luZ2xlIHRva2Vuc1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmUgPSBsaW5lc0FuZE5ld2xpbmVzW2ldO1xuXG4gICAgaWYgKGkgJSAyICYmICF0aGlzLm9wdGlvbnMubmV3bGluZUlzVG9rZW4pIHtcbiAgICAgIHJldExpbmVzW3JldExpbmVzLmxlbmd0aCAtIDFdICs9IGxpbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSkge1xuICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XG4gICAgICB9XG5cbiAgICAgIHJldExpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldExpbmVzO1xufTtcblxuZnVuY3Rpb24gZGlmZkxpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICByZXR1cm4gbGluZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gZGlmZlRyaW1tZWRMaW5lcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgdmFyIG9wdGlvbnMgPSBnZW5lcmF0ZU9wdGlvbnMoY2FsbGJhY2ssIHtcbiAgICBpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlXG4gIH0pO1xuICByZXR1cm4gbGluZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG5cbnZhciBzZW50ZW5jZURpZmYgPSBuZXcgRGlmZigpO1xuXG5zZW50ZW5jZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oXFxTLis/Wy4hP10pKD89XFxzK3wkKS8pO1xufTtcblxuZnVuY3Rpb24gZGlmZlNlbnRlbmNlcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHNlbnRlbmNlRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG59XG5cbnZhciBjc3NEaWZmID0gbmV3IERpZmYoKTtcblxuY3NzRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhbe306OyxdfFxccyspLyk7XG59O1xuXG5mdW5jdGlvbiBkaWZmQ3NzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICByZXR1cm4gY3NzRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTtcbn1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICByZXR1cm4gYXJyMjtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxudmFyIG9iamVjdFByb3RvdHlwZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBqc29uRGlmZiA9IG5ldyBEaWZmKCk7IC8vIERpc2NyaW1pbmF0ZSBiZXR3ZWVuIHR3byBsaW5lcyBvZiBwcmV0dHktcHJpbnRlZCwgc2VyaWFsaXplZCBKU09OIHdoZXJlIG9uZSBvZiB0aGVtIGhhcyBhXG4vLyBkYW5nbGluZyBjb21tYSBhbmQgdGhlIG90aGVyIGRvZXNuJ3QuIFR1cm5zIG91dCBpbmNsdWRpbmcgdGhlIGRhbmdsaW5nIGNvbW1hIHlpZWxkcyB0aGUgbmljZXN0IG91dHB1dDpcblxuanNvbkRpZmYudXNlTG9uZ2VzdFRva2VuID0gdHJ1ZTtcbmpzb25EaWZmLnRva2VuaXplID0gbGluZURpZmYudG9rZW5pemU7XG5cbmpzb25EaWZmLmNhc3RJbnB1dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgX3RoaXMkb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgIHVuZGVmaW5lZFJlcGxhY2VtZW50ID0gX3RoaXMkb3B0aW9ucy51bmRlZmluZWRSZXBsYWNlbWVudCxcbiAgICAgIF90aGlzJG9wdGlvbnMkc3RyaW5naSA9IF90aGlzJG9wdGlvbnMuc3RyaW5naWZ5UmVwbGFjZXIsXG4gICAgICBzdHJpbmdpZnlSZXBsYWNlciA9IF90aGlzJG9wdGlvbnMkc3RyaW5naSA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKGssIHYpIHtcbiAgICByZXR1cm4gdHlwZW9mIHYgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkUmVwbGFjZW1lbnQgOiB2O1xuICB9IDogX3RoaXMkb3B0aW9ucyRzdHJpbmdpO1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkoY2Fub25pY2FsaXplKHZhbHVlLCBudWxsLCBudWxsLCBzdHJpbmdpZnlSZXBsYWNlciksIHN0cmluZ2lmeVJlcGxhY2VyLCAnICAnKTtcbn07XG5cbmpzb25EaWZmLmVxdWFscyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkge1xuICByZXR1cm4gRGlmZi5wcm90b3R5cGUuZXF1YWxzLmNhbGwoanNvbkRpZmYsIGxlZnQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJyksIHJpZ2h0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpKTtcbn07XG5cbmZ1bmN0aW9uIGRpZmZKc29uKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKSB7XG4gIHJldHVybiBqc29uRGlmZi5kaWZmKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKTtcbn0gLy8gVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBwcmVzZW5jZSBvZiBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGJhaWxpbmcgb3V0IHdoZW4gZW5jb3VudGVyaW5nIGFuXG4vLyBvYmplY3QgdGhhdCBpcyBhbHJlYWR5IG9uIHRoZSBcInN0YWNrXCIgb2YgaXRlbXMgYmVpbmcgcHJvY2Vzc2VkLiBBY2NlcHRzIGFuIG9wdGlvbmFsIHJlcGxhY2VyXG5cbmZ1bmN0aW9uIGNhbm9uaWNhbGl6ZShvYmosIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KSB7XG4gIHN0YWNrID0gc3RhY2sgfHwgW107XG4gIHJlcGxhY2VtZW50U3RhY2sgPSByZXBsYWNlbWVudFN0YWNrIHx8IFtdO1xuXG4gIGlmIChyZXBsYWNlcikge1xuICAgIG9iaiA9IHJlcGxhY2VyKGtleSwgb2JqKTtcbiAgfVxuXG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChzdGFja1tpXSA9PT0gb2JqKSB7XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRTdGFja1tpXTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2Fub25pY2FsaXplZE9iajtcblxuICBpZiAoJ1tvYmplY3QgQXJyYXldJyA9PT0gb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgc3RhY2sucHVzaChvYmopO1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBuZXcgQXJyYXkob2JqLmxlbmd0aCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY2Fub25pY2FsaXplZE9ialtpXSA9IGNhbm9uaWNhbGl6ZShvYmpbaV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICB9XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuICB9XG5cbiAgaWYgKG9iaiAmJiBvYmoudG9KU09OKSB7XG4gICAgb2JqID0gb2JqLnRvSlNPTigpO1xuICB9XG5cbiAgaWYgKF90eXBlb2Yob2JqKSA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsKSB7XG4gICAgc3RhY2sucHVzaChvYmopO1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSB7fTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG5cbiAgICB2YXIgc29ydGVkS2V5cyA9IFtdLFxuICAgICAgICBfa2V5O1xuXG4gICAgZm9yIChfa2V5IGluIG9iaikge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoX2tleSkpIHtcbiAgICAgICAgc29ydGVkS2V5cy5wdXNoKF9rZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNvcnRlZEtleXMuc29ydCgpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHNvcnRlZEtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIF9rZXkgPSBzb3J0ZWRLZXlzW2ldO1xuICAgICAgY2Fub25pY2FsaXplZE9ialtfa2V5XSA9IGNhbm9uaWNhbGl6ZShvYmpbX2tleV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwgX2tleSk7XG4gICAgfVxuXG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gb2JqO1xuICB9XG5cbiAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG59XG5cbnZhciBhcnJheURpZmYgPSBuZXcgRGlmZigpO1xuXG5hcnJheURpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNsaWNlKCk7XG59O1xuXG5hcnJheURpZmYuam9pbiA9IGFycmF5RGlmZi5yZW1vdmVFbXB0eSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5mdW5jdGlvbiBkaWZmQXJyYXlzKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjaykge1xuICByZXR1cm4gYXJyYXlEaWZmLmRpZmYob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VQYXRjaCh1bmlEaWZmKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgdmFyIGRpZmZzdHIgPSB1bmlEaWZmLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgZGVsaW1pdGVycyA9IHVuaURpZmYubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgbGlzdCA9IFtdLFxuICAgICAgaSA9IDA7XG5cbiAgZnVuY3Rpb24gcGFyc2VJbmRleCgpIHtcbiAgICB2YXIgaW5kZXggPSB7fTtcbiAgICBsaXN0LnB1c2goaW5kZXgpOyAvLyBQYXJzZSBkaWZmIG1ldGFkYXRhXG5cbiAgICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgICB2YXIgbGluZSA9IGRpZmZzdHJbaV07IC8vIEZpbGUgaGVhZGVyIGZvdW5kLCBlbmQgcGFyc2luZyBkaWZmIG1ldGFkYXRhXG5cbiAgICAgIGlmICgvXihcXC1cXC1cXC18XFwrXFwrXFwrfEBAKVxccy8udGVzdChsaW5lKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gLy8gRGlmZiBpbmRleFxuXG5cbiAgICAgIHZhciBoZWFkZXIgPSAvXig/OkluZGV4OnxkaWZmKD86IC1yIFxcdyspKylcXHMrKC4rPylcXHMqJC8uZXhlYyhsaW5lKTtcblxuICAgICAgaWYgKGhlYWRlcikge1xuICAgICAgICBpbmRleC5pbmRleCA9IGhlYWRlclsxXTtcbiAgICAgIH1cblxuICAgICAgaSsrO1xuICAgIH0gLy8gUGFyc2UgZmlsZSBoZWFkZXJzIGlmIHRoZXkgYXJlIGRlZmluZWQuIFVuaWZpZWQgZGlmZiByZXF1aXJlcyB0aGVtLCBidXRcbiAgICAvLyB0aGVyZSdzIG5vIHRlY2huaWNhbCBpc3N1ZXMgdG8gaGF2ZSBhbiBpc29sYXRlZCBodW5rIHdpdGhvdXQgZmlsZSBoZWFkZXJcblxuXG4gICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTtcbiAgICBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpOyAvLyBQYXJzZSBodW5rc1xuXG4gICAgaW5kZXguaHVua3MgPSBbXTtcblxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIHZhciBfbGluZSA9IGRpZmZzdHJbaV07XG5cbiAgICAgIGlmICgvXihJbmRleDp8ZGlmZnxcXC1cXC1cXC18XFwrXFwrXFwrKVxccy8udGVzdChfbGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKC9eQEAvLnRlc3QoX2xpbmUpKSB7XG4gICAgICAgIGluZGV4Lmh1bmtzLnB1c2gocGFyc2VIdW5rKCkpO1xuICAgICAgfSBlbHNlIGlmIChfbGluZSAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAvLyBJZ25vcmUgdW5leHBlY3RlZCBjb250ZW50IHVubGVzcyBpbiBzdHJpY3QgbW9kZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGluZSAnICsgKGkgKyAxKSArICcgJyArIEpTT04uc3RyaW5naWZ5KF9saW5lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICB9IC8vIFBhcnNlcyB0aGUgLS0tIGFuZCArKysgaGVhZGVycywgaWYgbm9uZSBhcmUgZm91bmQsIG5vIGxpbmVzXG4gIC8vIGFyZSBjb25zdW1lZC5cblxuXG4gIGZ1bmN0aW9uIHBhcnNlRmlsZUhlYWRlcihpbmRleCkge1xuICAgIHZhciBmaWxlSGVhZGVyID0gL14oLS0tfFxcK1xcK1xcKylcXHMrKC4qKSQvLmV4ZWMoZGlmZnN0cltpXSk7XG5cbiAgICBpZiAoZmlsZUhlYWRlcikge1xuICAgICAgdmFyIGtleVByZWZpeCA9IGZpbGVIZWFkZXJbMV0gPT09ICctLS0nID8gJ29sZCcgOiAnbmV3JztcbiAgICAgIHZhciBkYXRhID0gZmlsZUhlYWRlclsyXS5zcGxpdCgnXFx0JywgMik7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhWzBdLnJlcGxhY2UoL1xcXFxcXFxcL2csICdcXFxcJyk7XG5cbiAgICAgIGlmICgvXlwiLipcIiQvLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyKDEsIGZpbGVOYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgfVxuXG4gICAgICBpbmRleFtrZXlQcmVmaXggKyAnRmlsZU5hbWUnXSA9IGZpbGVOYW1lO1xuICAgICAgaW5kZXhba2V5UHJlZml4ICsgJ0hlYWRlciddID0gKGRhdGFbMV0gfHwgJycpLnRyaW0oKTtcbiAgICAgIGkrKztcbiAgICB9XG4gIH0gLy8gUGFyc2VzIGEgaHVua1xuICAvLyBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBhcmUgYXQgdGhlIHN0YXJ0IG9mIGEgaHVuay5cblxuXG4gIGZ1bmN0aW9uIHBhcnNlSHVuaygpIHtcbiAgICB2YXIgY2h1bmtIZWFkZXJJbmRleCA9IGksXG4gICAgICAgIGNodW5rSGVhZGVyTGluZSA9IGRpZmZzdHJbaSsrXSxcbiAgICAgICAgY2h1bmtIZWFkZXIgPSBjaHVua0hlYWRlckxpbmUuc3BsaXQoL0BAIC0oXFxkKykoPzosKFxcZCspKT8gXFwrKFxcZCspKD86LChcXGQrKSk/IEBALyk7XG4gICAgdmFyIGh1bmsgPSB7XG4gICAgICBvbGRTdGFydDogK2NodW5rSGVhZGVyWzFdLFxuICAgICAgb2xkTGluZXM6IHR5cGVvZiBjaHVua0hlYWRlclsyXSA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK2NodW5rSGVhZGVyWzJdLFxuICAgICAgbmV3U3RhcnQ6ICtjaHVua0hlYWRlclszXSxcbiAgICAgIG5ld0xpbmVzOiB0eXBlb2YgY2h1bmtIZWFkZXJbNF0gPT09ICd1bmRlZmluZWQnID8gMSA6ICtjaHVua0hlYWRlcls0XSxcbiAgICAgIGxpbmVzOiBbXSxcbiAgICAgIGxpbmVkZWxpbWl0ZXJzOiBbXVxuICAgIH07IC8vIFVuaWZpZWQgRGlmZiBGb3JtYXQgcXVpcms6IElmIHRoZSBjaHVuayBzaXplIGlzIDAsXG4gICAgLy8gdGhlIGZpcnN0IG51bWJlciBpcyBvbmUgbG93ZXIgdGhhbiBvbmUgd291bGQgZXhwZWN0LlxuICAgIC8vIGh0dHBzOi8vd3d3LmFydGltYS5jb20vd2VibG9ncy92aWV3cG9zdC5qc3A/dGhyZWFkPTE2NDI5M1xuXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAoaHVuay5uZXdMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5uZXdTdGFydCArPSAxO1xuICAgIH1cblxuICAgIHZhciBhZGRDb3VudCA9IDAsXG4gICAgICAgIHJlbW92ZUNvdW50ID0gMDtcblxuICAgIGZvciAoOyBpIDwgZGlmZnN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gTGluZXMgc3RhcnRpbmcgd2l0aCAnLS0tJyBjb3VsZCBiZSBtaXN0YWtlbiBmb3IgdGhlIFwicmVtb3ZlIGxpbmVcIiBvcGVyYXRpb25cbiAgICAgIC8vIEJ1dCB0aGV5IGNvdWxkIGJlIHRoZSBoZWFkZXIgZm9yIHRoZSBuZXh0IGZpbGUuIFRoZXJlZm9yZSBwcnVuZSBzdWNoIGNhc2VzIG91dC5cbiAgICAgIGlmIChkaWZmc3RyW2ldLmluZGV4T2YoJy0tLSAnKSA9PT0gMCAmJiBpICsgMiA8IGRpZmZzdHIubGVuZ3RoICYmIGRpZmZzdHJbaSArIDFdLmluZGV4T2YoJysrKyAnKSA9PT0gMCAmJiBkaWZmc3RyW2kgKyAyXS5pbmRleE9mKCdAQCcpID09PSAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3BlcmF0aW9uID0gZGlmZnN0cltpXS5sZW5ndGggPT0gMCAmJiBpICE9IGRpZmZzdHIubGVuZ3RoIC0gMSA/ICcgJyA6IGRpZmZzdHJbaV1bMF07XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcrJyB8fCBvcGVyYXRpb24gPT09ICctJyB8fCBvcGVyYXRpb24gPT09ICcgJyB8fCBvcGVyYXRpb24gPT09ICdcXFxcJykge1xuICAgICAgICBodW5rLmxpbmVzLnB1c2goZGlmZnN0cltpXSk7XG4gICAgICAgIGh1bmsubGluZWRlbGltaXRlcnMucHVzaChkZWxpbWl0ZXJzW2ldIHx8ICdcXG4nKTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgICBhZGRDb3VudCsrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgcmVtb3ZlQ291bnQrKztcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICAgIGFkZENvdW50Kys7XG4gICAgICAgICAgcmVtb3ZlQ291bnQrKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSAvLyBIYW5kbGUgdGhlIGVtcHR5IGJsb2NrIGNvdW50IGNhc2VcblxuXG4gICAgaWYgKCFhZGRDb3VudCAmJiBodW5rLm5ld0xpbmVzID09PSAxKSB7XG4gICAgICBodW5rLm5ld0xpbmVzID0gMDtcbiAgICB9XG5cbiAgICBpZiAoIXJlbW92ZUNvdW50ICYmIGh1bmsub2xkTGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsub2xkTGluZXMgPSAwO1xuICAgIH0gLy8gUGVyZm9ybSBvcHRpb25hbCBzYW5pdHkgY2hlY2tpbmdcblxuXG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICBpZiAoYWRkQ291bnQgIT09IGh1bmsubmV3TGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGRlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW1vdmVDb3VudCAhPT0gaHVuay5vbGRMaW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlbW92ZWQgbGluZSBjb3VudCBkaWQgbm90IG1hdGNoIGZvciBodW5rIGF0IGxpbmUgJyArIChjaHVua0hlYWRlckluZGV4ICsgMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBodW5rO1xuICB9XG5cbiAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgIHBhcnNlSW5kZXgoKTtcbiAgfVxuXG4gIHJldHVybiBsaXN0O1xufVxuXG4vLyBJdGVyYXRvciB0aGF0IHRyYXZlcnNlcyBpbiB0aGUgcmFuZ2Ugb2YgW21pbiwgbWF4XSwgc3RlcHBpbmdcbi8vIGJ5IGRpc3RhbmNlIGZyb20gYSBnaXZlbiBzdGFydCBwb3NpdGlvbi4gSS5lLiBmb3IgWzAsIDRdLCB3aXRoXG4vLyBzdGFydCBvZiAyLCB0aGlzIHdpbGwgaXRlcmF0ZSAyLCAzLCAxLCA0LCAwLlxuZnVuY3Rpb24gZGlzdGFuY2VJdGVyYXRvciAoc3RhcnQsIG1pbkxpbmUsIG1heExpbmUpIHtcbiAgdmFyIHdhbnRGb3J3YXJkID0gdHJ1ZSxcbiAgICAgIGJhY2t3YXJkRXhoYXVzdGVkID0gZmFsc2UsXG4gICAgICBmb3J3YXJkRXhoYXVzdGVkID0gZmFsc2UsXG4gICAgICBsb2NhbE9mZnNldCA9IDE7XG4gIHJldHVybiBmdW5jdGlvbiBpdGVyYXRvcigpIHtcbiAgICBpZiAod2FudEZvcndhcmQgJiYgIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgIGlmIChiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICBsb2NhbE9mZnNldCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FudEZvcndhcmQgPSBmYWxzZTtcbiAgICAgIH0gLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZXlvbmQgdGV4dCBsZW5ndGgsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGFmdGVyIG9mZnNldCBsb2NhdGlvbiAob3IgZGVzaXJlZCBsb2NhdGlvbiBvbiBmaXJzdCBpdGVyYXRpb24pXG5cblxuICAgICAgaWYgKHN0YXJ0ICsgbG9jYWxPZmZzZXQgPD0gbWF4TGluZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxPZmZzZXQ7XG4gICAgICB9XG5cbiAgICAgIGZvcndhcmRFeGhhdXN0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghYmFja3dhcmRFeGhhdXN0ZWQpIHtcbiAgICAgIGlmICghZm9yd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICB3YW50Rm9yd2FyZCA9IHRydWU7XG4gICAgICB9IC8vIENoZWNrIGlmIHRyeWluZyB0byBmaXQgYmVmb3JlIHRleHQgYmVnaW5uaW5nLCBhbmQgaWYgbm90LCBjaGVjayBpdCBmaXRzXG4gICAgICAvLyBiZWZvcmUgb2Zmc2V0IGxvY2F0aW9uXG5cblxuICAgICAgaWYgKG1pbkxpbmUgPD0gc3RhcnQgLSBsb2NhbE9mZnNldCkge1xuICAgICAgICByZXR1cm4gLWxvY2FsT2Zmc2V0Kys7XG4gICAgICB9XG5cbiAgICAgIGJhY2t3YXJkRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBpdGVyYXRvcigpO1xuICAgIH0gLy8gV2UgdHJpZWQgdG8gZml0IGh1bmsgYmVmb3JlIHRleHQgYmVnaW5uaW5nIGFuZCBiZXlvbmQgdGV4dCBsZW5ndGgsIHRoZW5cbiAgICAvLyBodW5rIGNhbid0IGZpdCBvbiB0aGUgdGV4dC4gUmV0dXJuIHVuZGVmaW5lZFxuXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFwcGx5UGF0Y2goc291cmNlLCB1bmlEaWZmKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICBpZiAodHlwZW9mIHVuaURpZmYgPT09ICdzdHJpbmcnKSB7XG4gICAgdW5pRGlmZiA9IHBhcnNlUGF0Y2godW5pRGlmZik7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh1bmlEaWZmKSkge1xuICAgIGlmICh1bmlEaWZmLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYXBwbHlQYXRjaCBvbmx5IHdvcmtzIHdpdGggYSBzaW5nbGUgaW5wdXQuJyk7XG4gICAgfVxuXG4gICAgdW5pRGlmZiA9IHVuaURpZmZbMF07XG4gIH0gLy8gQXBwbHkgdGhlIGRpZmYgdG8gdGhlIGlucHV0XG5cblxuICB2YXIgbGluZXMgPSBzb3VyY2Uuc3BsaXQoL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdLyksXG4gICAgICBkZWxpbWl0ZXJzID0gc291cmNlLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgIGh1bmtzID0gdW5pRGlmZi5odW5rcyxcbiAgICAgIGNvbXBhcmVMaW5lID0gb3B0aW9ucy5jb21wYXJlTGluZSB8fCBmdW5jdGlvbiAobGluZU51bWJlciwgbGluZSwgb3BlcmF0aW9uLCBwYXRjaENvbnRlbnQpIHtcbiAgICByZXR1cm4gbGluZSA9PT0gcGF0Y2hDb250ZW50O1xuICB9LFxuICAgICAgZXJyb3JDb3VudCA9IDAsXG4gICAgICBmdXp6RmFjdG9yID0gb3B0aW9ucy5mdXp6RmFjdG9yIHx8IDAsXG4gICAgICBtaW5MaW5lID0gMCxcbiAgICAgIG9mZnNldCA9IDAsXG4gICAgICByZW1vdmVFT0ZOTCxcbiAgICAgIGFkZEVPRk5MO1xuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBodW5rIGV4YWN0bHkgZml0cyBvbiB0aGUgcHJvdmlkZWQgbG9jYXRpb25cbiAgICovXG5cblxuICBmdW5jdGlvbiBodW5rRml0cyhodW5rLCB0b1Bvcykge1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgaHVuay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGxpbmUgPSBodW5rLmxpbmVzW2pdLFxuICAgICAgICAgIG9wZXJhdGlvbiA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcsXG4gICAgICAgICAgY29udGVudCA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmUuc3Vic3RyKDEpIDogbGluZTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIC8vIENvbnRleHQgc2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghY29tcGFyZUxpbmUodG9Qb3MgKyAxLCBsaW5lc1t0b1Bvc10sIG9wZXJhdGlvbiwgY29udGVudCkpIHtcbiAgICAgICAgICBlcnJvckNvdW50Kys7XG5cbiAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IGZ1enpGYWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0b1BvcysrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIFNlYXJjaCBiZXN0IGZpdCBvZmZzZXRzIGZvciBlYWNoIGh1bmsgYmFzZWQgb24gdGhlIHByZXZpb3VzIG9uZXNcblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaHVuayA9IGh1bmtzW2ldLFxuICAgICAgICBtYXhMaW5lID0gbGluZXMubGVuZ3RoIC0gaHVuay5vbGRMaW5lcyxcbiAgICAgICAgbG9jYWxPZmZzZXQgPSAwLFxuICAgICAgICB0b1BvcyA9IG9mZnNldCArIGh1bmsub2xkU3RhcnQgLSAxO1xuICAgIHZhciBpdGVyYXRvciA9IGRpc3RhbmNlSXRlcmF0b3IodG9Qb3MsIG1pbkxpbmUsIG1heExpbmUpO1xuXG4gICAgZm9yICg7IGxvY2FsT2Zmc2V0ICE9PSB1bmRlZmluZWQ7IGxvY2FsT2Zmc2V0ID0gaXRlcmF0b3IoKSkge1xuICAgICAgaWYgKGh1bmtGaXRzKGh1bmssIHRvUG9zICsgbG9jYWxPZmZzZXQpKSB7XG4gICAgICAgIGh1bmsub2Zmc2V0ID0gb2Zmc2V0ICs9IGxvY2FsT2Zmc2V0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobG9jYWxPZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gU2V0IGxvd2VyIHRleHQgbGltaXQgdG8gZW5kIG9mIHRoZSBjdXJyZW50IGh1bmssIHNvIG5leHQgb25lcyBkb24ndCB0cnlcbiAgICAvLyB0byBmaXQgb3ZlciBhbHJlYWR5IHBhdGNoZWQgdGV4dFxuXG5cbiAgICBtaW5MaW5lID0gaHVuay5vZmZzZXQgKyBodW5rLm9sZFN0YXJ0ICsgaHVuay5vbGRMaW5lcztcbiAgfSAvLyBBcHBseSBwYXRjaCBodW5rc1xuXG5cbiAgdmFyIGRpZmZPZmZzZXQgPSAwO1xuXG4gIGZvciAodmFyIF9pID0gMDsgX2kgPCBodW5rcy5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgX2h1bmsgPSBodW5rc1tfaV0sXG4gICAgICAgIF90b1BvcyA9IF9odW5rLm9sZFN0YXJ0ICsgX2h1bmsub2Zmc2V0ICsgZGlmZk9mZnNldCAtIDE7XG5cbiAgICBkaWZmT2Zmc2V0ICs9IF9odW5rLm5ld0xpbmVzIC0gX2h1bmsub2xkTGluZXM7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IF9odW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbGluZSA9IF9odW5rLmxpbmVzW2pdLFxuICAgICAgICAgIG9wZXJhdGlvbiA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcsXG4gICAgICAgICAgY29udGVudCA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmUuc3Vic3RyKDEpIDogbGluZSxcbiAgICAgICAgICBkZWxpbWl0ZXIgPSBfaHVuay5saW5lZGVsaW1pdGVyc1tqXTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgIF90b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UoX3RvUG9zLCAxKTtcbiAgICAgICAgZGVsaW1pdGVycy5zcGxpY2UoX3RvUG9zLCAxKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgbGluZXMuc3BsaWNlKF90b1BvcywgMCwgY29udGVudCk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKF90b1BvcywgMCwgZGVsaW1pdGVyKTtcbiAgICAgICAgX3RvUG9zKys7XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIHZhciBwcmV2aW91c09wZXJhdGlvbiA9IF9odW5rLmxpbmVzW2ogLSAxXSA/IF9odW5rLmxpbmVzW2ogLSAxXVswXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgICByZW1vdmVFT0ZOTCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIGFkZEVPRk5MID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSAvLyBIYW5kbGUgRU9GTkwgaW5zZXJ0aW9uL3JlbW92YWxcblxuXG4gIGlmIChyZW1vdmVFT0ZOTCkge1xuICAgIHdoaWxlICghbGluZXNbbGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICAgIGxpbmVzLnBvcCgpO1xuICAgICAgZGVsaW1pdGVycy5wb3AoKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYWRkRU9GTkwpIHtcbiAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICBkZWxpbWl0ZXJzLnB1c2goJ1xcbicpO1xuICB9XG5cbiAgZm9yICh2YXIgX2sgPSAwOyBfayA8IGxpbmVzLmxlbmd0aCAtIDE7IF9rKyspIHtcbiAgICBsaW5lc1tfa10gPSBsaW5lc1tfa10gKyBkZWxpbWl0ZXJzW19rXTtcbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCcnKTtcbn0gLy8gV3JhcHBlciB0aGF0IHN1cHBvcnRzIG11bHRpcGxlIGZpbGUgcGF0Y2hlcyB2aWEgY2FsbGJhY2tzLlxuXG5mdW5jdGlvbiBhcHBseVBhdGNoZXModW5pRGlmZiwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHVuaURpZmYgPT09ICdzdHJpbmcnKSB7XG4gICAgdW5pRGlmZiA9IHBhcnNlUGF0Y2godW5pRGlmZik7XG4gIH1cblxuICB2YXIgY3VycmVudEluZGV4ID0gMDtcblxuICBmdW5jdGlvbiBwcm9jZXNzSW5kZXgoKSB7XG4gICAgdmFyIGluZGV4ID0gdW5pRGlmZltjdXJyZW50SW5kZXgrK107XG5cbiAgICBpZiAoIWluZGV4KSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIG9wdGlvbnMubG9hZEZpbGUoaW5kZXgsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVwZGF0ZWRDb250ZW50ID0gYXBwbHlQYXRjaChkYXRhLCBpbmRleCwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLnBhdGNoZWQoaW5kZXgsIHVwZGF0ZWRDb250ZW50LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5jb21wbGV0ZShlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzc0luZGV4KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb2Nlc3NJbmRleCgpO1xufVxuXG5mdW5jdGlvbiBzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmNvbnRleHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgb3B0aW9ucy5jb250ZXh0ID0gNDtcbiAgfVxuXG4gIHZhciBkaWZmID0gZGlmZkxpbmVzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbiAgZGlmZi5wdXNoKHtcbiAgICB2YWx1ZTogJycsXG4gICAgbGluZXM6IFtdXG4gIH0pOyAvLyBBcHBlbmQgYW4gZW1wdHkgdmFsdWUgdG8gbWFrZSBjbGVhbnVwIGVhc2llclxuXG4gIGZ1bmN0aW9uIGNvbnRleHRMaW5lcyhsaW5lcykge1xuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICByZXR1cm4gJyAnICsgZW50cnk7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgaHVua3MgPSBbXTtcbiAgdmFyIG9sZFJhbmdlU3RhcnQgPSAwLFxuICAgICAgbmV3UmFuZ2VTdGFydCA9IDAsXG4gICAgICBjdXJSYW5nZSA9IFtdLFxuICAgICAgb2xkTGluZSA9IDEsXG4gICAgICBuZXdMaW5lID0gMTtcblxuICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBkaWZmW2ldLFxuICAgICAgICBsaW5lcyA9IGN1cnJlbnQubGluZXMgfHwgY3VycmVudC52YWx1ZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgICBjdXJyZW50LmxpbmVzID0gbGluZXM7XG5cbiAgICBpZiAoY3VycmVudC5hZGRlZCB8fCBjdXJyZW50LnJlbW92ZWQpIHtcbiAgICAgIHZhciBfY3VyUmFuZ2U7XG5cbiAgICAgIC8vIElmIHdlIGhhdmUgcHJldmlvdXMgY29udGV4dCwgc3RhcnQgd2l0aCB0aGF0XG4gICAgICBpZiAoIW9sZFJhbmdlU3RhcnQpIHtcbiAgICAgICAgdmFyIHByZXYgPSBkaWZmW2kgLSAxXTtcbiAgICAgICAgb2xkUmFuZ2VTdGFydCA9IG9sZExpbmU7XG4gICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBvcHRpb25zLmNvbnRleHQgPiAwID8gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLW9wdGlvbnMuY29udGV4dCkpIDogW107XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gT3V0cHV0IG91ciBjaGFuZ2VzXG5cblxuICAgICAgKF9jdXJSYW5nZSA9IGN1clJhbmdlKS5wdXNoLmFwcGx5KF9jdXJSYW5nZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxpbmVzLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIChjdXJyZW50LmFkZGVkID8gJysnIDogJy0nKSArIGVudHJ5O1xuICAgICAgfSkpKTsgLy8gVHJhY2sgdGhlIHVwZGF0ZWQgZmlsZSBwb3NpdGlvblxuXG5cbiAgICAgIGlmIChjdXJyZW50LmFkZGVkKSB7XG4gICAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElkZW50aWNhbCBjb250ZXh0IGxpbmVzLiBUcmFjayBsaW5lIGNoYW5nZXNcbiAgICAgIGlmIChvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIC8vIENsb3NlIG91dCBhbnkgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBvdXRwdXQgKG9yIGpvaW4gb3ZlcmxhcHBpbmcpXG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0ICogMiAmJiBpIDwgZGlmZi5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgdmFyIF9jdXJSYW5nZTI7XG5cbiAgICAgICAgICAvLyBPdmVybGFwcGluZ1xuICAgICAgICAgIChfY3VyUmFuZ2UyID0gY3VyUmFuZ2UpLnB1c2guYXBwbHkoX2N1clJhbmdlMiwgX3RvQ29uc3VtYWJsZUFycmF5KGNvbnRleHRMaW5lcyhsaW5lcykpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgX2N1clJhbmdlMztcblxuICAgICAgICAgIC8vIGVuZCB0aGUgcmFuZ2UgYW5kIG91dHB1dFxuICAgICAgICAgIHZhciBjb250ZXh0U2l6ZSA9IE1hdGgubWluKGxpbmVzLmxlbmd0aCwgb3B0aW9ucy5jb250ZXh0KTtcblxuICAgICAgICAgIChfY3VyUmFuZ2UzID0gY3VyUmFuZ2UpLnB1c2guYXBwbHkoX2N1clJhbmdlMywgX3RvQ29uc3VtYWJsZUFycmF5KGNvbnRleHRMaW5lcyhsaW5lcy5zbGljZSgwLCBjb250ZXh0U2l6ZSkpKSk7XG5cbiAgICAgICAgICB2YXIgaHVuayA9IHtcbiAgICAgICAgICAgIG9sZFN0YXJ0OiBvbGRSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgb2xkTGluZXM6IG9sZExpbmUgLSBvbGRSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUsXG4gICAgICAgICAgICBuZXdTdGFydDogbmV3UmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG5ld0xpbmVzOiBuZXdMaW5lIC0gbmV3UmFuZ2VTdGFydCArIGNvbnRleHRTaXplLFxuICAgICAgICAgICAgbGluZXM6IGN1clJhbmdlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChpID49IGRpZmYubGVuZ3RoIC0gMiAmJiBsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBFT0YgaXMgaW5zaWRlIHRoaXMgaHVua1xuICAgICAgICAgICAgdmFyIG9sZEVPRk5ld2xpbmUgPSAvXFxuJC8udGVzdChvbGRTdHIpO1xuICAgICAgICAgICAgdmFyIG5ld0VPRk5ld2xpbmUgPSAvXFxuJC8udGVzdChuZXdTdHIpO1xuICAgICAgICAgICAgdmFyIG5vTmxCZWZvcmVBZGRzID0gbGluZXMubGVuZ3RoID09IDAgJiYgY3VyUmFuZ2UubGVuZ3RoID4gaHVuay5vbGRMaW5lcztcblxuICAgICAgICAgICAgaWYgKCFvbGRFT0ZOZXdsaW5lICYmIG5vTmxCZWZvcmVBZGRzICYmIG9sZFN0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogb2xkIGhhcyBubyBlb2wgYW5kIG5vIHRyYWlsaW5nIGNvbnRleHQ7IG5vLW5sIGNhbiBlbmQgdXAgYmVmb3JlIGFkZHNcbiAgICAgICAgICAgICAgLy8gaG93ZXZlciwgaWYgdGhlIG9sZCBmaWxlIGlzIGVtcHR5LCBkbyBub3Qgb3V0cHV0IHRoZSBuby1ubCBsaW5lXG4gICAgICAgICAgICAgIGN1clJhbmdlLnNwbGljZShodW5rLm9sZExpbmVzLCAwLCAnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiAhbm9ObEJlZm9yZUFkZHMgfHwgIW5ld0VPRk5ld2xpbmUpIHtcbiAgICAgICAgICAgICAgY3VyUmFuZ2UucHVzaCgnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaHVua3MucHVzaChodW5rKTtcbiAgICAgICAgICBvbGRSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICBuZXdSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICBjdXJSYW5nZSA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgbmV3TGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgfVxuICB9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZi5sZW5ndGg7IGkrKykge1xuICAgIF9sb29wKGkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvbGRGaWxlTmFtZTogb2xkRmlsZU5hbWUsXG4gICAgbmV3RmlsZU5hbWU6IG5ld0ZpbGVOYW1lLFxuICAgIG9sZEhlYWRlcjogb2xkSGVhZGVyLFxuICAgIG5ld0hlYWRlcjogbmV3SGVhZGVyLFxuICAgIGh1bmtzOiBodW5rc1xuICB9O1xufVxuZnVuY3Rpb24gZm9ybWF0UGF0Y2goZGlmZikge1xuICB2YXIgcmV0ID0gW107XG5cbiAgaWYgKGRpZmYub2xkRmlsZU5hbWUgPT0gZGlmZi5uZXdGaWxlTmFtZSkge1xuICAgIHJldC5wdXNoKCdJbmRleDogJyArIGRpZmYub2xkRmlsZU5hbWUpO1xuICB9XG5cbiAgcmV0LnB1c2goJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcbiAgcmV0LnB1c2goJy0tLSAnICsgZGlmZi5vbGRGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5vbGRIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYub2xkSGVhZGVyKSk7XG4gIHJldC5wdXNoKCcrKysgJyArIGRpZmYubmV3RmlsZU5hbWUgKyAodHlwZW9mIGRpZmYubmV3SGVhZGVyID09PSAndW5kZWZpbmVkJyA/ICcnIDogJ1xcdCcgKyBkaWZmLm5ld0hlYWRlcikpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZi5odW5rcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBodW5rID0gZGlmZi5odW5rc1tpXTsgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG5cbiAgICBpZiAoaHVuay5vbGRMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5vbGRTdGFydCAtPSAxO1xuICAgIH1cblxuICAgIGlmIChodW5rLm5ld0xpbmVzID09PSAwKSB7XG4gICAgICBodW5rLm5ld1N0YXJ0IC09IDE7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goJ0BAIC0nICsgaHVuay5vbGRTdGFydCArICcsJyArIGh1bmsub2xkTGluZXMgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXMgKyAnIEBAJyk7XG4gICAgcmV0LnB1c2guYXBwbHkocmV0LCBodW5rLmxpbmVzKTtcbiAgfVxuXG4gIHJldHVybiByZXQuam9pbignXFxuJykgKyAnXFxuJztcbn1cbmZ1bmN0aW9uIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZvcm1hdFBhdGNoKHN0cnVjdHVyZWRQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykpO1xufVxuZnVuY3Rpb24gY3JlYXRlUGF0Y2goZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICByZXR1cm4gY3JlYXRlVHdvRmlsZXNQYXRjaChmaWxlTmFtZSwgZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGFycmF5RXF1YWwoYSwgYikge1xuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5U3RhcnRzV2l0aChhLCBiKTtcbn1cbmZ1bmN0aW9uIGFycmF5U3RhcnRzV2l0aChhcnJheSwgc3RhcnQpIHtcbiAgaWYgKHN0YXJ0Lmxlbmd0aCA+IGFycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhcnQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnRbaV0gIT09IGFycmF5W2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNhbGNMaW5lQ291bnQoaHVuaykge1xuICB2YXIgX2NhbGNPbGROZXdMaW5lQ291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGh1bmsubGluZXMpLFxuICAgICAgb2xkTGluZXMgPSBfY2FsY09sZE5ld0xpbmVDb3VudC5vbGRMaW5lcyxcbiAgICAgIG5ld0xpbmVzID0gX2NhbGNPbGROZXdMaW5lQ291bnQubmV3TGluZXM7XG5cbiAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBodW5rLm9sZExpbmVzID0gb2xkTGluZXM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGh1bmsub2xkTGluZXM7XG4gIH1cblxuICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsubmV3TGluZXMgPSBuZXdMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5uZXdMaW5lcztcbiAgfVxufVxuZnVuY3Rpb24gbWVyZ2UobWluZSwgdGhlaXJzLCBiYXNlKSB7XG4gIG1pbmUgPSBsb2FkUGF0Y2gobWluZSwgYmFzZSk7XG4gIHRoZWlycyA9IGxvYWRQYXRjaCh0aGVpcnMsIGJhc2UpO1xuICB2YXIgcmV0ID0ge307IC8vIEZvciBpbmRleCB3ZSBqdXN0IGxldCBpdCBwYXNzIHRocm91Z2ggYXMgaXQgZG9lc24ndCBoYXZlIGFueSBuZWNlc3NhcnkgbWVhbmluZy5cbiAgLy8gTGVhdmluZyBzYW5pdHkgY2hlY2tzIG9uIHRoaXMgdG8gdGhlIEFQSSBjb25zdW1lciB0aGF0IG1heSBrbm93IG1vcmUgYWJvdXQgdGhlXG4gIC8vIG1lYW5pbmcgaW4gdGhlaXIgb3duIGNvbnRleHQuXG5cbiAgaWYgKG1pbmUuaW5kZXggfHwgdGhlaXJzLmluZGV4KSB7XG4gICAgcmV0LmluZGV4ID0gbWluZS5pbmRleCB8fCB0aGVpcnMuaW5kZXg7XG4gIH1cblxuICBpZiAobWluZS5uZXdGaWxlTmFtZSB8fCB0aGVpcnMubmV3RmlsZU5hbWUpIHtcbiAgICBpZiAoIWZpbGVOYW1lQ2hhbmdlZChtaW5lKSkge1xuICAgICAgLy8gTm8gaGVhZGVyIG9yIG5vIGNoYW5nZSBpbiBvdXJzLCB1c2UgdGhlaXJzIChhbmQgb3VycyBpZiB0aGVpcnMgZG9lcyBub3QgZXhpc3QpXG4gICAgICByZXQub2xkRmlsZU5hbWUgPSB0aGVpcnMub2xkRmlsZU5hbWUgfHwgbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgIHJldC5uZXdGaWxlTmFtZSA9IHRoZWlycy5uZXdGaWxlTmFtZSB8fCBtaW5lLm5ld0ZpbGVOYW1lO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IHRoZWlycy5vbGRIZWFkZXIgfHwgbWluZS5vbGRIZWFkZXI7XG4gICAgICByZXQubmV3SGVhZGVyID0gdGhlaXJzLm5ld0hlYWRlciB8fCBtaW5lLm5ld0hlYWRlcjtcbiAgICB9IGVsc2UgaWYgKCFmaWxlTmFtZUNoYW5nZWQodGhlaXJzKSkge1xuICAgICAgLy8gTm8gaGVhZGVyIG9yIG5vIGNoYW5nZSBpbiB0aGVpcnMsIHVzZSBvdXJzXG4gICAgICByZXQub2xkRmlsZU5hbWUgPSBtaW5lLm9sZEZpbGVOYW1lO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gbWluZS5uZXdGaWxlTmFtZTtcbiAgICAgIHJldC5vbGRIZWFkZXIgPSBtaW5lLm9sZEhlYWRlcjtcbiAgICAgIHJldC5uZXdIZWFkZXIgPSBtaW5lLm5ld0hlYWRlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQm90aCBjaGFuZ2VkLi4uIGZpZ3VyZSBpdCBvdXRcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5vbGRGaWxlTmFtZSwgdGhlaXJzLm9sZEZpbGVOYW1lKTtcbiAgICAgIHJldC5uZXdGaWxlTmFtZSA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5uZXdGaWxlTmFtZSwgdGhlaXJzLm5ld0ZpbGVOYW1lKTtcbiAgICAgIHJldC5vbGRIZWFkZXIgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUub2xkSGVhZGVyLCB0aGVpcnMub2xkSGVhZGVyKTtcbiAgICAgIHJldC5uZXdIZWFkZXIgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUubmV3SGVhZGVyLCB0aGVpcnMubmV3SGVhZGVyKTtcbiAgICB9XG4gIH1cblxuICByZXQuaHVua3MgPSBbXTtcbiAgdmFyIG1pbmVJbmRleCA9IDAsXG4gICAgICB0aGVpcnNJbmRleCA9IDAsXG4gICAgICBtaW5lT2Zmc2V0ID0gMCxcbiAgICAgIHRoZWlyc09mZnNldCA9IDA7XG5cbiAgd2hpbGUgKG1pbmVJbmRleCA8IG1pbmUuaHVua3MubGVuZ3RoIHx8IHRoZWlyc0luZGV4IDwgdGhlaXJzLmh1bmtzLmxlbmd0aCkge1xuICAgIHZhciBtaW5lQ3VycmVudCA9IG1pbmUuaHVua3NbbWluZUluZGV4XSB8fCB7XG4gICAgICBvbGRTdGFydDogSW5maW5pdHlcbiAgICB9LFxuICAgICAgICB0aGVpcnNDdXJyZW50ID0gdGhlaXJzLmh1bmtzW3RoZWlyc0luZGV4XSB8fCB7XG4gICAgICBvbGRTdGFydDogSW5maW5pdHlcbiAgICB9O1xuXG4gICAgaWYgKGh1bmtCZWZvcmUobWluZUN1cnJlbnQsIHRoZWlyc0N1cnJlbnQpKSB7XG4gICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgcmV0Lmh1bmtzLnB1c2goY2xvbmVIdW5rKG1pbmVDdXJyZW50LCBtaW5lT2Zmc2V0KSk7XG4gICAgICBtaW5lSW5kZXgrKztcbiAgICAgIHRoZWlyc09mZnNldCArPSBtaW5lQ3VycmVudC5uZXdMaW5lcyAtIG1pbmVDdXJyZW50Lm9sZExpbmVzO1xuICAgIH0gZWxzZSBpZiAoaHVua0JlZm9yZSh0aGVpcnNDdXJyZW50LCBtaW5lQ3VycmVudCkpIHtcbiAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsodGhlaXJzQ3VycmVudCwgdGhlaXJzT2Zmc2V0KSk7XG4gICAgICB0aGVpcnNJbmRleCsrO1xuICAgICAgbWluZU9mZnNldCArPSB0aGVpcnNDdXJyZW50Lm5ld0xpbmVzIC0gdGhlaXJzQ3VycmVudC5vbGRMaW5lcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3ZlcmxhcCwgbWVyZ2UgYXMgYmVzdCB3ZSBjYW5cbiAgICAgIHZhciBtZXJnZWRIdW5rID0ge1xuICAgICAgICBvbGRTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQub2xkU3RhcnQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQpLFxuICAgICAgICBvbGRMaW5lczogMCxcbiAgICAgICAgbmV3U3RhcnQ6IE1hdGgubWluKG1pbmVDdXJyZW50Lm5ld1N0YXJ0ICsgbWluZU9mZnNldCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCArIHRoZWlyc09mZnNldCksXG4gICAgICAgIG5ld0xpbmVzOiAwLFxuICAgICAgICBsaW5lczogW11cbiAgICAgIH07XG4gICAgICBtZXJnZUxpbmVzKG1lcmdlZEh1bmssIG1pbmVDdXJyZW50Lm9sZFN0YXJ0LCBtaW5lQ3VycmVudC5saW5lcywgdGhlaXJzQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5saW5lcyk7XG4gICAgICB0aGVpcnNJbmRleCsrO1xuICAgICAgbWluZUluZGV4Kys7XG4gICAgICByZXQuaHVua3MucHVzaChtZXJnZWRIdW5rKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBsb2FkUGF0Y2gocGFyYW0sIGJhc2UpIHtcbiAgaWYgKHR5cGVvZiBwYXJhbSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoL15AQC9tLnRlc3QocGFyYW0pIHx8IC9eSW5kZXg6L20udGVzdChwYXJhbSkpIHtcbiAgICAgIHJldHVybiBwYXJzZVBhdGNoKHBhcmFtKVswXTtcbiAgICB9XG5cbiAgICBpZiAoIWJhc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGEgYmFzZSByZWZlcmVuY2Ugb3IgcGFzcyBpbiBhIHBhdGNoJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cnVjdHVyZWRQYXRjaCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgYmFzZSwgcGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmFtO1xufVxuXG5mdW5jdGlvbiBmaWxlTmFtZUNoYW5nZWQocGF0Y2gpIHtcbiAgcmV0dXJuIHBhdGNoLm5ld0ZpbGVOYW1lICYmIHBhdGNoLm5ld0ZpbGVOYW1lICE9PSBwYXRjaC5vbGRGaWxlTmFtZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0RmllbGQoaW5kZXgsIG1pbmUsIHRoZWlycykge1xuICBpZiAobWluZSA9PT0gdGhlaXJzKSB7XG4gICAgcmV0dXJuIG1pbmU7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXguY29uZmxpY3QgPSB0cnVlO1xuICAgIHJldHVybiB7XG4gICAgICBtaW5lOiBtaW5lLFxuICAgICAgdGhlaXJzOiB0aGVpcnNcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGh1bmtCZWZvcmUodGVzdCwgY2hlY2spIHtcbiAgcmV0dXJuIHRlc3Qub2xkU3RhcnQgPCBjaGVjay5vbGRTdGFydCAmJiB0ZXN0Lm9sZFN0YXJ0ICsgdGVzdC5vbGRMaW5lcyA8IGNoZWNrLm9sZFN0YXJ0O1xufVxuXG5mdW5jdGlvbiBjbG9uZUh1bmsoaHVuaywgb2Zmc2V0KSB7XG4gIHJldHVybiB7XG4gICAgb2xkU3RhcnQ6IGh1bmsub2xkU3RhcnQsXG4gICAgb2xkTGluZXM6IGh1bmsub2xkTGluZXMsXG4gICAgbmV3U3RhcnQ6IGh1bmsubmV3U3RhcnQgKyBvZmZzZXQsXG4gICAgbmV3TGluZXM6IGh1bmsubmV3TGluZXMsXG4gICAgbGluZXM6IGh1bmsubGluZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VMaW5lcyhodW5rLCBtaW5lT2Zmc2V0LCBtaW5lTGluZXMsIHRoZWlyT2Zmc2V0LCB0aGVpckxpbmVzKSB7XG4gIC8vIFRoaXMgd2lsbCBnZW5lcmFsbHkgcmVzdWx0IGluIGEgY29uZmxpY3RlZCBodW5rLCBidXQgdGhlcmUgYXJlIGNhc2VzIHdoZXJlIHRoZSBjb250ZXh0XG4gIC8vIGlzIHRoZSBvbmx5IG92ZXJsYXAgd2hlcmUgd2UgY2FuIHN1Y2Nlc3NmdWxseSBtZXJnZSB0aGUgY29udGVudCBoZXJlLlxuICB2YXIgbWluZSA9IHtcbiAgICBvZmZzZXQ6IG1pbmVPZmZzZXQsXG4gICAgbGluZXM6IG1pbmVMaW5lcyxcbiAgICBpbmRleDogMFxuICB9LFxuICAgICAgdGhlaXIgPSB7XG4gICAgb2Zmc2V0OiB0aGVpck9mZnNldCxcbiAgICBsaW5lczogdGhlaXJMaW5lcyxcbiAgICBpbmRleDogMFxuICB9OyAvLyBIYW5kbGUgYW55IGxlYWRpbmcgY29udGVudFxuXG4gIGluc2VydExlYWRpbmcoaHVuaywgbWluZSwgdGhlaXIpO1xuICBpbnNlcnRMZWFkaW5nKGh1bmssIHRoZWlyLCBtaW5lKTsgLy8gTm93IGluIHRoZSBvdmVybGFwIGNvbnRlbnQuIFNjYW4gdGhyb3VnaCBhbmQgc2VsZWN0IHRoZSBiZXN0IGNoYW5nZXMgZnJvbSBlYWNoLlxuXG4gIHdoaWxlIChtaW5lLmluZGV4IDwgbWluZS5saW5lcy5sZW5ndGggJiYgdGhlaXIuaW5kZXggPCB0aGVpci5saW5lcy5sZW5ndGgpIHtcbiAgICB2YXIgbWluZUN1cnJlbnQgPSBtaW5lLmxpbmVzW21pbmUuaW5kZXhdLFxuICAgICAgICB0aGVpckN1cnJlbnQgPSB0aGVpci5saW5lc1t0aGVpci5pbmRleF07XG5cbiAgICBpZiAoKG1pbmVDdXJyZW50WzBdID09PSAnLScgfHwgbWluZUN1cnJlbnRbMF0gPT09ICcrJykgJiYgKHRoZWlyQ3VycmVudFswXSA9PT0gJy0nIHx8IHRoZWlyQ3VycmVudFswXSA9PT0gJysnKSkge1xuICAgICAgLy8gQm90aCBtb2RpZmllZCAuLi5cbiAgICAgIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudFswXSA9PT0gJysnICYmIHRoZWlyQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICB2YXIgX2h1bmskbGluZXM7XG5cbiAgICAgIC8vIE1pbmUgaW5zZXJ0ZWRcbiAgICAgIChfaHVuayRsaW5lcyA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXMsIF90b0NvbnN1bWFibGVBcnJheShjb2xsZWN0Q2hhbmdlKG1pbmUpKSk7XG4gICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICcrJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICB2YXIgX2h1bmskbGluZXMyO1xuXG4gICAgICAvLyBUaGVpcnMgaW5zZXJ0ZWRcbiAgICAgIChfaHVuayRsaW5lczIgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzMiwgX3RvQ29uc3VtYWJsZUFycmF5KGNvbGxlY3RDaGFuZ2UodGhlaXIpKSk7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudFswXSA9PT0gJy0nICYmIHRoZWlyQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBNaW5lIHJlbW92ZWQgb3IgZWRpdGVkXG4gICAgICByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICB9IGVsc2UgaWYgKHRoZWlyQ3VycmVudFswXSA9PT0gJy0nICYmIG1pbmVDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIFRoZWlyIHJlbW92ZWQgb3IgZWRpdGVkXG4gICAgICByZW1vdmFsKGh1bmssIHRoZWlyLCBtaW5lLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50ID09PSB0aGVpckN1cnJlbnQpIHtcbiAgICAgIC8vIENvbnRleHQgaWRlbnRpdHlcbiAgICAgIGh1bmsubGluZXMucHVzaChtaW5lQ3VycmVudCk7XG4gICAgICBtaW5lLmluZGV4Kys7XG4gICAgICB0aGVpci5pbmRleCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDb250ZXh0IG1pc21hdGNoXG4gICAgICBjb25mbGljdChodW5rLCBjb2xsZWN0Q2hhbmdlKG1pbmUpLCBjb2xsZWN0Q2hhbmdlKHRoZWlyKSk7XG4gICAgfVxuICB9IC8vIE5vdyBwdXNoIGFueXRoaW5nIHRoYXQgbWF5IGJlIHJlbWFpbmluZ1xuXG5cbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgbWluZSk7XG4gIGluc2VydFRyYWlsaW5nKGh1bmssIHRoZWlyKTtcbiAgY2FsY0xpbmVDb3VudChodW5rKTtcbn1cblxuZnVuY3Rpb24gbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKSB7XG4gIHZhciBteUNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKG1pbmUpLFxuICAgICAgdGhlaXJDaGFuZ2VzID0gY29sbGVjdENoYW5nZSh0aGVpcik7XG5cbiAgaWYgKGFsbFJlbW92ZXMobXlDaGFuZ2VzKSAmJiBhbGxSZW1vdmVzKHRoZWlyQ2hhbmdlcykpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHJlbW92ZSBjaGFuZ2VzIHRoYXQgYXJlIHN1cGVyc2V0cyBvZiBvbmUgYW5vdGhlclxuICAgIGlmIChhcnJheVN0YXJ0c1dpdGgobXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpICYmIHNraXBSZW1vdmVTdXBlcnNldCh0aGVpciwgbXlDaGFuZ2VzLCBteUNoYW5nZXMubGVuZ3RoIC0gdGhlaXJDaGFuZ2VzLmxlbmd0aCkpIHtcbiAgICAgIHZhciBfaHVuayRsaW5lczM7XG5cbiAgICAgIChfaHVuayRsaW5lczMgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzMywgX3RvQ29uc3VtYWJsZUFycmF5KG15Q2hhbmdlcykpO1xuXG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhcnJheVN0YXJ0c1dpdGgodGhlaXJDaGFuZ2VzLCBteUNoYW5nZXMpICYmIHNraXBSZW1vdmVTdXBlcnNldChtaW5lLCB0aGVpckNoYW5nZXMsIHRoZWlyQ2hhbmdlcy5sZW5ndGggLSBteUNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgdmFyIF9odW5rJGxpbmVzNDtcblxuICAgICAgKF9odW5rJGxpbmVzNCA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXM0LCBfdG9Db25zdW1hYmxlQXJyYXkodGhlaXJDaGFuZ2VzKSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYXJyYXlFcXVhbChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcykpIHtcbiAgICB2YXIgX2h1bmskbGluZXM1O1xuXG4gICAgKF9odW5rJGxpbmVzNSA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXM1LCBfdG9Db25zdW1hYmxlQXJyYXkobXlDaGFuZ2VzKSk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25mbGljdChodW5rLCBteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIsIHN3YXApIHtcbiAgdmFyIG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q29udGV4dCh0aGVpciwgbXlDaGFuZ2VzKTtcblxuICBpZiAodGhlaXJDaGFuZ2VzLm1lcmdlZCkge1xuICAgIHZhciBfaHVuayRsaW5lczY7XG5cbiAgICAoX2h1bmskbGluZXM2ID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczYsIF90b0NvbnN1bWFibGVBcnJheSh0aGVpckNoYW5nZXMubWVyZ2VkKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmxpY3QoaHVuaywgc3dhcCA/IHRoZWlyQ2hhbmdlcyA6IG15Q2hhbmdlcywgc3dhcCA/IG15Q2hhbmdlcyA6IHRoZWlyQ2hhbmdlcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uZmxpY3QoaHVuaywgbWluZSwgdGhlaXIpIHtcbiAgaHVuay5jb25mbGljdCA9IHRydWU7XG4gIGh1bmsubGluZXMucHVzaCh7XG4gICAgY29uZmxpY3Q6IHRydWUsXG4gICAgbWluZTogbWluZSxcbiAgICB0aGVpcnM6IHRoZWlyXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRMZWFkaW5nKGh1bmssIGluc2VydCwgdGhlaXIpIHtcbiAgd2hpbGUgKGluc2VydC5vZmZzZXQgPCB0aGVpci5vZmZzZXQgJiYgaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gICAgaW5zZXJ0Lm9mZnNldCsrO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluc2VydFRyYWlsaW5nKGh1bmssIGluc2VydCkge1xuICB3aGlsZSAoaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29sbGVjdENoYW5nZShzdGF0ZSkge1xuICB2YXIgcmV0ID0gW10sXG4gICAgICBvcGVyYXRpb24gPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF1bMF07XG5cbiAgd2hpbGUgKHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIGxpbmUgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF07IC8vIEdyb3VwIGFkZGl0aW9ucyB0aGF0IGFyZSBpbW1lZGlhdGVseSBhZnRlciBzdWJ0cmFjdGlvbnMgYW5kIHRyZWF0IHRoZW0gYXMgb25lIFwiYXRvbWljXCIgbW9kaWZ5IGNoYW5nZS5cblxuICAgIGlmIChvcGVyYXRpb24gPT09ICctJyAmJiBsaW5lWzBdID09PSAnKycpIHtcbiAgICAgIG9wZXJhdGlvbiA9ICcrJztcbiAgICB9XG5cbiAgICBpZiAob3BlcmF0aW9uID09PSBsaW5lWzBdKSB7XG4gICAgICByZXQucHVzaChsaW5lKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDb250ZXh0KHN0YXRlLCBtYXRjaENoYW5nZXMpIHtcbiAgdmFyIGNoYW5nZXMgPSBbXSxcbiAgICAgIG1lcmdlZCA9IFtdLFxuICAgICAgbWF0Y2hJbmRleCA9IDAsXG4gICAgICBjb250ZXh0Q2hhbmdlcyA9IGZhbHNlLFxuICAgICAgY29uZmxpY3RlZCA9IGZhbHNlO1xuXG4gIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCAmJiBzdGF0ZS5pbmRleCA8IHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBjaGFuZ2UgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF0sXG4gICAgICAgIG1hdGNoID0gbWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXhdOyAvLyBPbmNlIHdlJ3ZlIGhpdCBvdXIgYWRkLCB0aGVuIHdlIGFyZSBkb25lXG5cbiAgICBpZiAobWF0Y2hbMF0gPT09ICcrJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29udGV4dENoYW5nZXMgPSBjb250ZXh0Q2hhbmdlcyB8fCBjaGFuZ2VbMF0gIT09ICcgJztcbiAgICBtZXJnZWQucHVzaChtYXRjaCk7XG4gICAgbWF0Y2hJbmRleCsrOyAvLyBDb25zdW1lIGFueSBhZGRpdGlvbnMgaW4gdGhlIG90aGVyIGJsb2NrIGFzIGEgY29uZmxpY3QgdG8gYXR0ZW1wdFxuICAgIC8vIHRvIHB1bGwgaW4gdGhlIHJlbWFpbmluZyBjb250ZXh0IGFmdGVyIHRoaXNcblxuICAgIGlmIChjaGFuZ2VbMF0gPT09ICcrJykge1xuICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG5cbiAgICAgIHdoaWxlIChjaGFuZ2VbMF0gPT09ICcrJykge1xuICAgICAgICBjaGFuZ2VzLnB1c2goY2hhbmdlKTtcbiAgICAgICAgY2hhbmdlID0gc3RhdGUubGluZXNbKytzdGF0ZS5pbmRleF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoLnN1YnN0cigxKSA9PT0gY2hhbmdlLnN1YnN0cigxKSkge1xuICAgICAgY2hhbmdlcy5wdXNoKGNoYW5nZSk7XG4gICAgICBzdGF0ZS5pbmRleCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25mbGljdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XSB8fCAnJylbMF0gPT09ICcrJyAmJiBjb250ZXh0Q2hhbmdlcykge1xuICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbmZsaWN0ZWQpIHtcbiAgICByZXR1cm4gY2hhbmdlcztcbiAgfVxuXG4gIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCkge1xuICAgIG1lcmdlZC5wdXNoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4KytdKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbWVyZ2VkOiBtZXJnZWQsXG4gICAgY2hhbmdlczogY2hhbmdlc1xuICB9O1xufVxuXG5mdW5jdGlvbiBhbGxSZW1vdmVzKGNoYW5nZXMpIHtcbiAgcmV0dXJuIGNoYW5nZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjaGFuZ2UpIHtcbiAgICByZXR1cm4gcHJldiAmJiBjaGFuZ2VbMF0gPT09ICctJztcbiAgfSwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHNraXBSZW1vdmVTdXBlcnNldChzdGF0ZSwgcmVtb3ZlQ2hhbmdlcywgZGVsdGEpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWx0YTsgaSsrKSB7XG4gICAgdmFyIGNoYW5nZUNvbnRlbnQgPSByZW1vdmVDaGFuZ2VzW3JlbW92ZUNoYW5nZXMubGVuZ3RoIC0gZGVsdGEgKyBpXS5zdWJzdHIoMSk7XG5cbiAgICBpZiAoc3RhdGUubGluZXNbc3RhdGUuaW5kZXggKyBpXSAhPT0gJyAnICsgY2hhbmdlQ29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLmluZGV4ICs9IGRlbHRhO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lcykge1xuICB2YXIgb2xkTGluZXMgPSAwO1xuICB2YXIgbmV3TGluZXMgPSAwO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgaWYgKHR5cGVvZiBsaW5lICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFyIG15Q291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUubWluZSk7XG4gICAgICB2YXIgdGhlaXJDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS50aGVpcnMpO1xuXG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5vbGRMaW5lcyA9PT0gdGhlaXJDb3VudC5vbGRMaW5lcykge1xuICAgICAgICAgIG9sZExpbmVzICs9IG15Q291bnQub2xkTGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2xkTGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG15Q291bnQubmV3TGluZXMgPT09IHRoZWlyQ291bnQubmV3TGluZXMpIHtcbiAgICAgICAgICBuZXdMaW5lcyArPSBteUNvdW50Lm5ld0xpbmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0xpbmVzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkICYmIChsaW5lWzBdID09PSAnKycgfHwgbGluZVswXSA9PT0gJyAnKSkge1xuICAgICAgICBuZXdMaW5lcysrO1xuICAgICAgfVxuXG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJy0nIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgb2xkTGluZXMrKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIG9sZExpbmVzOiBvbGRMaW5lcyxcbiAgICBuZXdMaW5lczogbmV3TGluZXNcbiAgfTtcbn1cblxuLy8gU2VlOiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvZ29vZ2xlLWRpZmYtbWF0Y2gtcGF0Y2gvd2lraS9BUElcbmZ1bmN0aW9uIGNvbnZlcnRDaGFuZ2VzVG9ETVAoY2hhbmdlcykge1xuICB2YXIgcmV0ID0gW10sXG4gICAgICBjaGFuZ2UsXG4gICAgICBvcGVyYXRpb247XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhbmdlID0gY2hhbmdlc1tpXTtcblxuICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgIG9wZXJhdGlvbiA9IDE7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgb3BlcmF0aW9uID0gLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wZXJhdGlvbiA9IDA7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goW29wZXJhdGlvbiwgY2hhbmdlLnZhbHVlXSk7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0Q2hhbmdlc1RvWE1MKGNoYW5nZXMpIHtcbiAgdmFyIHJldCA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjaGFuZ2UgPSBjaGFuZ2VzW2ldO1xuXG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgcmV0LnB1c2goJzxpbnM+Jyk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgcmV0LnB1c2goJzxkZWw+Jyk7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goZXNjYXBlSFRNTChjaGFuZ2UudmFsdWUpKTtcblxuICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8L2lucz4nKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICByZXQucHVzaCgnPC9kZWw+Jyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlSFRNTChzKSB7XG4gIHZhciBuID0gcztcbiAgbiA9IG4ucmVwbGFjZSgvJi9nLCAnJmFtcDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvPC9nLCAnJmx0OycpO1xuICBuID0gbi5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgcmV0dXJuIG47XG59XG5cbmV4cG9ydCB7IERpZmYsIGFwcGx5UGF0Y2gsIGFwcGx5UGF0Y2hlcywgY2Fub25pY2FsaXplLCBjb252ZXJ0Q2hhbmdlc1RvRE1QLCBjb252ZXJ0Q2hhbmdlc1RvWE1MLCBjcmVhdGVQYXRjaCwgY3JlYXRlVHdvRmlsZXNQYXRjaCwgZGlmZkFycmF5cywgZGlmZkNoYXJzLCBkaWZmQ3NzLCBkaWZmSnNvbiwgZGlmZkxpbmVzLCBkaWZmU2VudGVuY2VzLCBkaWZmVHJpbW1lZExpbmVzLCBkaWZmV29yZHMsIGRpZmZXb3Jkc1dpdGhTcGFjZSwgbWVyZ2UsIHBhcnNlUGF0Y2gsIHN0cnVjdHVyZWRQYXRjaCB9O1xuIiwiZXhwb3J0IGludGVyZmFjZSBJTGlzdCB7XG4gIGdldExldmVsKCk6IG51bWJlcjtcbiAgZ2V0UGFyZW50KCk6IElMaXN0IHwgbnVsbDtcbiAgYWRkQWZ0ZXJBbGwobGlzdDogSUxpc3QpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGlzdCBpbXBsZW1lbnRzIElMaXN0IHtcbiAgcHJpdmF0ZSBpbmRlbnRTaWduOiBzdHJpbmc7XG4gIHByaXZhdGUgYnVsbGV0OiBzdHJpbmc7XG4gIHByaXZhdGUgY29udGVudDogc3RyaW5nO1xuICBwcml2YXRlIGZvbGRlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBjaGlsZHJlbjogTGlzdFtdO1xuICBwcml2YXRlIHBhcmVudDogTGlzdDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmRlbnRTaWduOiBzdHJpbmcsXG4gICAgYnVsbGV0OiBzdHJpbmcsXG4gICAgY29udGVudDogc3RyaW5nLFxuICAgIGZvbGRlZDogYm9vbGVhblxuICApIHtcbiAgICB0aGlzLmluZGVudFNpZ24gPSBpbmRlbnRTaWduO1xuICAgIHRoaXMuYnVsbGV0ID0gYnVsbGV0O1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG4gICAgdGhpcy5mb2xkZWQgPSBmb2xkZWQ7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgfVxuXG4gIGlzRm9sZGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZvbGRlZDtcbiAgfVxuXG4gIGlzRm9sZFJvb3QoKSB7XG4gICAgbGV0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KCk7XG4gICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgaWYgKHBhcmVudC5pc0ZvbGRlZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc0ZvbGRlZCgpO1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uY29uY2F0KCk7XG4gIH1cblxuICBhcHBlbmRDb250ZW50KGNvbnRlbnQ6IHN0cmluZykge1xuICAgIHRoaXMuY29udGVudCArPSBjb250ZW50O1xuICB9XG5cbiAgZ2V0Q29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50O1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gIH1cblxuICBnZXRDb250ZW50U3RhcnRDaCgpIHtcbiAgICBjb25zdCBpbmRlbnRMZW5ndGggPSAodGhpcy5nZXRMZXZlbCgpIC0gMSkgKiB0aGlzLmluZGVudFNpZ24ubGVuZ3RoO1xuICAgIHJldHVybiBpbmRlbnRMZW5ndGggKyAyO1xuICB9XG5cbiAgZ2V0Q29udGVudEVuZENoKCkge1xuICAgIHJldHVybiB0aGlzLmdldENvbnRlbnRTdGFydENoKCkgKyB0aGlzLmNvbnRlbnQubGVuZ3RoO1xuICB9XG5cbiAgZ2V0UGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgfVxuXG4gIGdldFByZXZTaWJsaW5nT2YobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgcmV0dXJuIGkgPiAwID8gdGhpcy5jaGlsZHJlbltpIC0gMV0gOiBudWxsO1xuICB9XG5cbiAgZ2V0TmV4dFNpYmxpbmdPZihsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICByZXR1cm4gaSA+PSAwICYmIGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aCA/IHRoaXMuY2hpbGRyZW5baSArIDFdIDogbnVsbDtcbiAgfVxuXG4gIGdldExldmVsKCkge1xuICAgIGxldCBsZXZlbCA9IDA7XG4gICAgbGV0IHJlZjogTGlzdCA9IHRoaXM7XG4gICAgd2hpbGUgKHJlZi5wYXJlbnQpIHtcbiAgICAgIHJlZiA9IHJlZi5wYXJlbnQ7XG4gICAgICBsZXZlbCsrO1xuICAgIH1cbiAgICByZXR1cm4gbGV2ZWw7XG4gIH1cblxuICBhZGRBZnRlckFsbChsaXN0OiBMaXN0KSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEJlZm9yZUFsbChsaXN0OiBMaXN0KSB7XG4gICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEJlZm9yZShiZWZvcmU6IExpc3QsIGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGJlZm9yZSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSwgMCwgbGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgYWRkQWZ0ZXIoYmVmb3JlOiBMaXN0LCBsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGkgKyAxLCAwLCBsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICByZW1vdmVDaGlsZChsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICBsaXN0LnBhcmVudCA9IG51bGw7XG4gIH1cblxuICBwcmludCgpIHtcbiAgICBsZXQgcmVzID0gdGhpcy5nZXRGdWxsQ29udGVudCgpICsgXCJcXG5cIjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgcmVzICs9IGNoaWxkLnByaW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnVsbENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG5ldyBBcnJheSh0aGlzLmdldExldmVsKCkgLSAxKS5maWxsKHRoaXMuaW5kZW50U2lnbikuam9pbihcIlwiKSArXG4gICAgICB0aGlzLmJ1bGxldCArXG4gICAgICBcIiBcIiArXG4gICAgICB0aGlzLmNvbnRlbnRcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290IGltcGxlbWVudHMgSUxpc3Qge1xuICBwcml2YXRlIGluZGVudFNpZ246IHN0cmluZztcbiAgcHJpdmF0ZSByb290TGlzdDogTGlzdDtcbiAgcHJpdmF0ZSBzdGFydDogQ29kZU1pcnJvci5Qb3NpdGlvbjtcbiAgcHJpdmF0ZSBlbmQ6IENvZGVNaXJyb3IuUG9zaXRpb247XG4gIHByaXZhdGUgY3Vyc29yOiBDb2RlTWlycm9yLlBvc2l0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluZGVudFNpZ246IHN0cmluZyxcbiAgICBzdGFydDogQ29kZU1pcnJvci5Qb3NpdGlvbixcbiAgICBlbmQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXG4gICAgY3Vyc29yOiBDb2RlTWlycm9yLlBvc2l0aW9uXG4gICkge1xuICAgIHRoaXMuaW5kZW50U2lnbiA9IGluZGVudFNpZ247XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICAgIHRoaXMucm9vdExpc3QgPSBuZXcgTGlzdChcIlwiLCBcIlwiLCBcIlwiLCBmYWxzZSk7XG4gIH1cblxuICByZXBsYWNlQ3Vyc29yKGN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvbikge1xuICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICB9XG5cbiAgZ2V0VG90YWxMaW5lcygpIHtcbiAgICByZXR1cm4gdGhpcy5lbmQubGluZSAtIHRoaXMuc3RhcnQubGluZSArIDE7XG4gIH1cblxuICBnZXRDaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpO1xuICB9XG5cbiAgZ2V0SW5kZW50U2lnbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRlbnRTaWduO1xuICB9XG5cbiAgZ2V0TGV2ZWwoKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBnZXRQYXJlbnQoKTogTGlzdCB8IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYWRkQWZ0ZXJBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMucm9vdExpc3QuYWRkQWZ0ZXJBbGwobGlzdCk7XG4gIH1cblxuICBnZXRMaXN0U3RhcnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydDtcbiAgfVxuXG4gIGdldExpc3RFbmRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH1cblxuICBnZXRDdXJzb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3Vyc29yO1xuICB9XG5cbiAgZ2V0TGlzdFVuZGVyQ3Vyc29yKCk6IExpc3Qge1xuICAgIHJldHVybiB0aGlzLmdldExpc3RVbmRlckxpbmUodGhpcy5jdXJzb3IubGluZSk7XG4gIH1cblxuICBwcmludCgpIHtcbiAgICBsZXQgcmVzID0gXCJcIjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpKSB7XG4gICAgICByZXMgKz0gY2hpbGQucHJpbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnJlcGxhY2UoL1xcbiQvLCBcIlwiKTtcbiAgfVxuXG4gIGdldExpbmVOdW1iZXJPZihsaXN0OiBMaXN0KSB7XG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gbnVsbDtcbiAgICBsZXQgbGluZTogbnVtYmVyID0gMDtcbiAgICBjb25zdCB2aXNpdEFyciA9IChsbDogTGlzdFtdKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGwpIHtcbiAgICAgICAgaWYgKGwgPT09IGxpc3QpIHtcbiAgICAgICAgICByZXN1bHQgPSBsaW5lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmUrKztcbiAgICAgICAgICB2aXNpdEFycihsLmdldENoaWxkcmVuKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmlzaXRBcnIodGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpKTtcblxuICAgIHJldHVybiByZXN1bHQgKyB0aGlzLnN0YXJ0LmxpbmU7XG4gIH1cblxuICBnZXRMaXN0VW5kZXJMaW5lKGxpbmU6IG51bWJlcikge1xuICAgIGlmIChsaW5lIDwgdGhpcy5zdGFydC5saW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogTGlzdCA9IG51bGw7XG4gICAgbGV0IGluZGV4OiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHZpc2l0QXJyID0gKGxsOiBMaXN0W10pID0+IHtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsbCkge1xuICAgICAgICBpZiAoaW5kZXggKyB0aGlzLnN0YXJ0LmxpbmUgPT09IGxpbmUpIHtcbiAgICAgICAgICByZXN1bHQgPSBsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgdmlzaXRBcnIobC5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZpc2l0QXJyKHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgbW92ZVVwKCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgcHJldiA9IHBhcmVudC5nZXRQcmV2U2libGluZ09mKGxpc3QpO1xuXG4gICAgaWYgKCFwcmV2ICYmIGdyYW5kUGFyZW50KSB7XG4gICAgICBjb25zdCBuZXdQYXJlbnQgPSBncmFuZFBhcmVudC5nZXRQcmV2U2libGluZ09mKHBhcmVudCk7XG5cbiAgICAgIGlmIChuZXdQYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgICAgICBuZXdQYXJlbnQuYWRkQWZ0ZXJBbGwobGlzdCk7XG4gICAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHByZXYpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIHBhcmVudC5hZGRCZWZvcmUocHJldiwgbGlzdCk7XG4gICAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtb3ZlRG93bigpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IGdyYW5kUGFyZW50ID0gcGFyZW50LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IG5leHQgPSBwYXJlbnQuZ2V0TmV4dFNpYmxpbmdPZihsaXN0KTtcblxuICAgIGlmICghbmV4dCAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0TmV4dFNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEJlZm9yZUFsbChsaXN0KTtcbiAgICAgICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobmV4dCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgICAgcGFyZW50LmFkZEFmdGVyKG5leHQsIGxpc3QpO1xuICAgICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZUxlZnQoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBncmFuZFBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcblxuICAgIGlmICghZ3JhbmRQYXJlbnQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBncmFuZFBhcmVudC5hZGRBZnRlcihwYXJlbnQsIGxpc3QpO1xuICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5jaC0tO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtb3ZlUmlnaHQoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBwcmV2ID0gcGFyZW50LmdldFByZXZTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBwcmV2LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5jaCsrO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cygpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcblxuICAgIGlmICh0aGlzLmN1cnNvci5jaCAhPT0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldiA9IHRoaXMuZ2V0TGlzdFVuZGVyTGluZSh0aGlzLmN1cnNvci5saW5lIC0gMSk7XG5cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGJvdGhBcmVFbXB0eSA9IHByZXYuaXNFbXB0eSgpICYmIGxpc3QuaXNFbXB0eSgpO1xuICAgIGNvbnN0IHByZXZJc0VtcHR5QW5kU2FtZUxldmVsID1cbiAgICAgIHByZXYuaXNFbXB0eSgpICYmICFsaXN0LmlzRW1wdHkoKSAmJiBwcmV2LmdldExldmVsKCkgPT0gbGlzdC5nZXRMZXZlbCgpO1xuICAgIGNvbnN0IGxpc3RJc0VtcHR5QW5kUHJldklzUGFyZW50ID1cbiAgICAgIGxpc3QuaXNFbXB0eSgpICYmIHByZXYuZ2V0TGV2ZWwoKSA9PSBsaXN0LmdldExldmVsKCkgLSAxO1xuXG4gICAgaWYgKGJvdGhBcmVFbXB0eSB8fCBwcmV2SXNFbXB0eUFuZFNhbWVMZXZlbCB8fCBsaXN0SXNFbXB0eUFuZFByZXZJc1BhcmVudCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICAgIGNvbnN0IHByZXZFbmRDaCA9IHByZXYuZ2V0Q29udGVudEVuZENoKCk7XG5cbiAgICAgIHByZXYuYXBwZW5kQ29udGVudChsaXN0LmdldENvbnRlbnQoKSk7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgbGlzdC5nZXRDaGlsZHJlbigpKSB7XG4gICAgICAgIGxpc3QucmVtb3ZlQ2hpbGQoYyk7XG4gICAgICAgIHByZXYuYWRkQWZ0ZXJBbGwoYyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihwcmV2KTtcbiAgICAgIHRoaXMuY3Vyc29yLmNoID0gcHJldkVuZENoO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBkaWZmTGluZXMgfSBmcm9tIFwiZGlmZlwiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4vb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IElMaXN0LCBMaXN0LCBSb290IH0gZnJvbSBcIi4vcm9vdFwiO1xuXG5leHBvcnQgY2xhc3MgTGlzdFV0aWxzIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dnZXI6IExvZ2dlciwgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzKSB7fVxuXG4gIGdldExpc3RMaW5lSW5mbyhsaW5lOiBzdHJpbmcsIGluZGVudFNpZ246IHN0cmluZykge1xuICAgIGNvbnN0IHByZWZpeFJlID0gbmV3IFJlZ0V4cChgXig/OiR7aW5kZW50U2lnbn0pKihbLSpdKSBgKTtcbiAgICBjb25zdCBtYXRjaGVzID0gcHJlZml4UmUuZXhlYyhsaW5lKTtcblxuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlZml4TGVuZ3RoID0gbWF0Y2hlc1swXS5sZW5ndGg7XG4gICAgY29uc3QgYnVsbGV0ID0gbWF0Y2hlc1sxXTtcbiAgICBjb25zdCBjb250ZW50ID0gbGluZS5zbGljZShwcmVmaXhMZW5ndGgpO1xuICAgIGNvbnN0IGluZGVudExldmVsID0gKHByZWZpeExlbmd0aCAtIDIpIC8gaW5kZW50U2lnbi5sZW5ndGg7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYnVsbGV0LFxuICAgICAgY29udGVudCxcbiAgICAgIHByZWZpeExlbmd0aCxcbiAgICAgIGluZGVudExldmVsLFxuICAgIH07XG4gIH1cblxuICBwYXJzZUxpc3QoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpKTogUm9vdCB7XG4gICAgY29uc3QgY3Vyc29yTGluZSA9IGN1cnNvci5saW5lO1xuICAgIGNvbnN0IGN1cnNvckNoID0gY3Vyc29yLmNoO1xuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3JMaW5lKTtcblxuICAgIGNvbnN0IGluZGVudFNpZ24gPSB0aGlzLmRldGVjdExpc3RJbmRlbnRTaWduKGVkaXRvciwgY3Vyc29yKTtcblxuICAgIGlmIChpbmRlbnRTaWduID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgbGlzdFN0YXJ0TGluZSA9IGN1cnNvckxpbmU7XG4gICAgY29uc3QgbGlzdFN0YXJ0Q2ggPSAwO1xuICAgIHdoaWxlIChsaXN0U3RhcnRMaW5lID49IDEpIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0U3RhcnRMaW5lIC0gMSk7XG4gICAgICBpZiAoIXRoaXMuZ2V0TGlzdExpbmVJbmZvKGxpbmUsIGluZGVudFNpZ24pKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGlzdFN0YXJ0TGluZS0tO1xuICAgIH1cblxuICAgIGxldCBsaXN0RW5kTGluZSA9IGN1cnNvckxpbmU7XG4gICAgbGV0IGxpc3RFbmRDaCA9IGxpbmUubGVuZ3RoO1xuICAgIHdoaWxlIChsaXN0RW5kTGluZSA8IGVkaXRvci5saW5lQ291bnQoKSkge1xuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGxpc3RFbmRMaW5lICsgMSk7XG4gICAgICBpZiAoIXRoaXMuZ2V0TGlzdExpbmVJbmZvKGxpbmUsIGluZGVudFNpZ24pKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGlzdEVuZENoID0gbGluZS5sZW5ndGg7XG4gICAgICBsaXN0RW5kTGluZSsrO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdChcbiAgICAgIGluZGVudFNpZ24sXG4gICAgICB7IGxpbmU6IGxpc3RTdGFydExpbmUsIGNoOiBsaXN0U3RhcnRDaCB9LFxuICAgICAgeyBsaW5lOiBsaXN0RW5kTGluZSwgY2g6IGxpc3RFbmRDaCB9LFxuICAgICAgeyBsaW5lOiBjdXJzb3JMaW5lLCBjaDogY3Vyc29yQ2ggfVxuICAgICk7XG5cbiAgICBsZXQgY3VycmVudExldmVsOiBJTGlzdCA9IHJvb3Q7XG4gICAgbGV0IGxhc3RMaXN0OiBJTGlzdCA9IHJvb3Q7XG5cbiAgICBmb3IgKGxldCBsID0gbGlzdFN0YXJ0TGluZTsgbCA8PSBsaXN0RW5kTGluZTsgbCsrKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobCk7XG4gICAgICBjb25zdCB7IGJ1bGxldCwgY29udGVudCwgaW5kZW50TGV2ZWwgfSA9IHRoaXMuZ2V0TGlzdExpbmVJbmZvKFxuICAgICAgICBsaW5lLFxuICAgICAgICBpbmRlbnRTaWduXG4gICAgICApO1xuICAgICAgY29uc3QgZm9sZGVkID0gKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHtcbiAgICAgICAgbGluZTogbCxcbiAgICAgICAgY2g6IDAsXG4gICAgICB9KTtcblxuICAgICAgaWYgKGluZGVudExldmVsID09PSBjdXJyZW50TGV2ZWwuZ2V0TGV2ZWwoKSArIDEpIHtcbiAgICAgICAgY3VycmVudExldmVsID0gbGFzdExpc3Q7XG4gICAgICB9IGVsc2UgaWYgKGluZGVudExldmVsIDwgY3VycmVudExldmVsLmdldExldmVsKCkpIHtcbiAgICAgICAgd2hpbGUgKGluZGVudExldmVsIDwgY3VycmVudExldmVsLmdldExldmVsKCkpIHtcbiAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBjdXJyZW50TGV2ZWwuZ2V0UGFyZW50KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW5kZW50TGV2ZWwgIT0gY3VycmVudExldmVsLmdldExldmVsKCkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIHBhcnNlIGxpc3RgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3QgPSBuZXcgTGlzdChpbmRlbnRTaWduLCBidWxsZXQsIGNvbnRlbnQsIGZvbGRlZCk7XG4gICAgICBjdXJyZW50TGV2ZWwuYWRkQWZ0ZXJBbGwobGlzdCk7XG4gICAgICBsYXN0TGlzdCA9IGxpc3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICBhcHBseUNoYW5nZXMoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgcm9vdDogUm9vdCkge1xuICAgIGNvbnN0IG9sZFN0cmluZyA9IGVkaXRvci5nZXRSYW5nZShcbiAgICAgIHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKSxcbiAgICAgIHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKClcbiAgICApO1xuICAgIGNvbnN0IG5ld1N0cmluZyA9IHJvb3QucHJpbnQoKTtcblxuICAgIGNvbnN0IGZyb21MaW5lID0gcm9vdC5nZXRMaXN0U3RhcnRQb3NpdGlvbigpLmxpbmU7XG4gICAgY29uc3QgdG9MaW5lID0gcm9vdC5nZXRMaXN0RW5kUG9zaXRpb24oKS5saW5lO1xuXG4gICAgZm9yIChsZXQgbCA9IGZyb21MaW5lOyBsIDw9IHRvTGluZTsgbCsrKSB7XG4gICAgICAoZWRpdG9yIGFzIGFueSkuZm9sZENvZGUobCwgbnVsbCwgXCJ1bmZvbGRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHJpbmcsIG5ld1N0cmluZyk7XG4gICAgbGV0IGwgPSByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCkubGluZTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBkaWZmKSB7XG4gICAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoY2hhbmdlLnZhbHVlLCB7IGxpbmU6IGwsIGNoOiAwIH0pO1xuICAgICAgICBsICs9IGNoYW5nZS5jb3VudDtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgICAgY29uc3Qgd2l0aE5ld2xpbmUgPSAvXFxuJC8udGVzdChjaGFuZ2UudmFsdWUpO1xuICAgICAgICBjb25zdCB0aWxsTGluZSA9IHdpdGhOZXdsaW5lID8gbCArIGNoYW5nZS5jb3VudCA6IGwgKyBjaGFuZ2UuY291bnQgLSAxO1xuICAgICAgICBjb25zdCB0aWxsQ2ggPSB3aXRoTmV3bGluZSA/IDAgOiBlZGl0b3IuZ2V0TGluZSh0aWxsTGluZSkubGVuZ3RoO1xuICAgICAgICBlZGl0b3IucmVwbGFjZVJhbmdlKFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgeyBsaW5lOiBsLCBjaDogMCB9LFxuICAgICAgICAgIHsgbGluZTogdGlsbExpbmUsIGNoOiB0aWxsQ2ggfVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbCArPSBjaGFuZ2UuY291bnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkQ3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgIGNvbnN0IG5ld0N1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG5cbiAgICBpZiAob2xkQ3Vyc29yLmxpbmUgIT0gbmV3Q3Vyc29yLmxpbmUgfHwgb2xkQ3Vyc29yLmNoICE9IG5ld0N1cnNvci5jaCkge1xuICAgICAgZWRpdG9yLnNldEN1cnNvcihuZXdDdXJzb3IpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgY29uc3QgbGluZSA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShsKTtcbiAgICAgIGlmIChsaW5lICYmIGxpbmUuaXNGb2xkUm9vdCgpKSB7XG4gICAgICAgIC8vIFRPRE86IHdoeSB3b3JraW5nIG9ubHkgd2l0aCAtMT9cbiAgICAgICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGwgLSAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLCBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24pIHtcbiAgICBjb25zdCBkID0gdGhpcy5sb2dnZXIuYmluZChcIk9ic2lkaWFuT3V0bGluZXJQbHVnaW46OmRldGVjdExpc3RJbmRlbnRTaWduXCIpO1xuXG4gICAgY29uc3QgeyB1c2VUYWIsIHRhYlNpemUgfSA9IHRoaXMub2JzaWRpYW5VdGlscy5nZXRPYnNpZGlhblRhYnNTZXR0aWducygpO1xuICAgIGNvbnN0IGRlZmF1bHRJbmRlbnRTaWduID0gdXNlVGFiXG4gICAgICA/IFwiXFx0XCJcbiAgICAgIDogbmV3IEFycmF5KHRhYlNpemUpLmZpbGwoXCIgXCIpLmpvaW4oXCJcIik7XG5cbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gICAgY29uc3Qgd2l0aFRhYnNSZSA9IC9eXFx0K1stKl0gLztcbiAgICBjb25zdCB3aXRoU3BhY2VzUmUgPSAvXlsgXStbLSpdIC87XG4gICAgY29uc3QgbWF5QmVXaXRoU3BhY2VzUmUgPSAvXlsgXSpbLSpdIC87XG5cbiAgICBpZiAod2l0aFRhYnNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBkKFwiZGV0ZWN0ZWQgdGFiIG9uIGN1cnJlbnQgbGluZVwiKTtcbiAgICAgIHJldHVybiBcIlxcdFwiO1xuICAgIH1cblxuICAgIGlmICh3aXRoU3BhY2VzUmUudGVzdChsaW5lKSkge1xuICAgICAgZChcImRldGVjdGVkIHdoaXRlc3BhY2VzIG9uIGN1cnJlbnQgbGluZSwgdHJ5aW5nIHRvIGNvdW50XCIpO1xuICAgICAgY29uc3Qgc3BhY2VzQSA9IGxpbmUubGVuZ3RoIC0gbGluZS50cmltTGVmdCgpLmxlbmd0aDtcblxuICAgICAgbGV0IGxpbmVObyA9IGN1cnNvci5saW5lIC0gMTtcbiAgICAgIHdoaWxlIChsaW5lTm8gPj0gZWRpdG9yLmZpcnN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaW5lTm8pO1xuICAgICAgICBpZiAoIW1heUJlV2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcGFjZXNCID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuICAgICAgICBpZiAoc3BhY2VzQiA8IHNwYWNlc0EpIHtcbiAgICAgICAgICBjb25zdCBsID0gc3BhY2VzQSAtIHNwYWNlc0I7XG4gICAgICAgICAgZChgZGV0ZWN0ZWQgJHtsfSB3aGl0ZXNwYWNlc2ApO1xuICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkobCkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVOby0tO1xuICAgICAgfVxuXG4gICAgICBkKFwidW5hYmxlIHRvIGRldGVjdFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChtYXlCZVdpdGhTcGFjZXNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBkKFwiZGV0ZWN0ZWQgbm90aGluZyBvbiBjdXJyZW50IGxpbmUsIGxvb2tpbmcgZm9yd2FyZFwiKTtcbiAgICAgIGNvbnN0IHNwYWNlc0EgPSBsaW5lLmxlbmd0aCAtIGxpbmUudHJpbUxlZnQoKS5sZW5ndGg7XG5cbiAgICAgIGxldCBsaW5lTm8gPSBjdXJzb3IubGluZSArIDE7XG4gICAgICB3aGlsZSAobGluZU5vIDw9IGVkaXRvci5sYXN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaW5lTm8pO1xuICAgICAgICBpZiAod2l0aFRhYnNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgZChcImRldGVjdGVkIHRhYlwiKTtcbiAgICAgICAgICByZXR1cm4gXCJcXHRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1heUJlV2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcGFjZXNCID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuICAgICAgICBpZiAoc3BhY2VzQiA+IHNwYWNlc0EpIHtcbiAgICAgICAgICBjb25zdCBsID0gc3BhY2VzQiAtIHNwYWNlc0E7XG4gICAgICAgICAgZChgZGV0ZWN0ZWQgJHtsfSB3aGl0ZXNwYWNlc2ApO1xuICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkobCkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVObysrO1xuICAgICAgfVxuXG4gICAgICBkKGBkZXRlY3RlZCBub3RoaW5nLCB1c2luZyBkZWZhdWx0IHVzZVRhYj0ke3VzZVRhYn0gdGFiU2l6ZT0ke3RhYlNpemV9YCk7XG4gICAgICByZXR1cm4gZGVmYXVsdEluZGVudFNpZ247XG4gICAgfVxuXG4gICAgZChcInVuYWJsZSB0byBkZXRlY3RcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpc0N1cnNvckluTGlzdChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0ZWN0TGlzdEluZGVudFNpZ24oZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yKCkpICE9PSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncykge31cblxuICBsb2cobWV0aG9kOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmRlYnVnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5pbmZvKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cblxuICBiaW5kKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gdGhpcy5sb2cobWV0aG9kLCAuLi5hcmdzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4uL29ic2lkaWFuX3V0aWxzXCI7XG5cbmNvbnN0IHRleHQgPSAoc2l6ZTogbnVtYmVyKSA9PlxuICBgT3V0bGluZXIgc3R5bGVzIGRvZXNuJ3Qgd29yayB3aXRoICR7c2l6ZX0tc3BhY2VzLXRhYnMuIFBsZWFzZSBjaGVjayB5b3VyIE9ic2lkaWFuIHNldHRpbmdzLmA7XG5cbmV4cG9ydCBjbGFzcyBMaXN0c1N0eWxlc0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIHByaXZhdGUgc3RhdHVzQmFyVGV4dDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgaW50ZXJ2YWw6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0eWxlTGlzdHMpIHtcbiAgICAgIHRoaXMuYWRkTGlzdHNTdHlsZXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldHRpbmdzLm9uQ2hhbmdlKFwic3R5bGVMaXN0c1wiLCB0aGlzLm9uU2V0dGluZ3NDaGFuZ2UpO1xuXG4gICAgdGhpcy5hZGRTdGF0dXNCYXJUZXh0KCk7XG4gICAgdGhpcy5zdGFydFN0YXR1c0JhckludGVydmFsKCk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnN0YXR1c0JhclRleHQpO1xuICAgIHRoaXMuc2V0dGluZ3MucmVtb3ZlQ2FsbGJhY2soXCJzdHlsZUxpc3RzXCIsIHRoaXMub25TZXR0aW5nc0NoYW5nZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0c1N0eWxlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFN0YXR1c0JhckludGVydmFsKCkge1xuICAgIGxldCB2aXNpYmxlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAgIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VUYWIsIHRhYlNpemUgfSA9IHRoaXMub2JzaWRpYW5VdGlscy5nZXRPYnNpZGlhblRhYnNTZXR0aWducygpO1xuXG4gICAgICBjb25zdCBzaG91bGRCZVZpc2libGUgPVxuICAgICAgICB0aGlzLnNldHRpbmdzLnN0eWxlTGlzdHMgJiYgdXNlVGFiICYmIHRhYlNpemUgIT09IDQ7XG5cbiAgICAgIGlmIChzaG91bGRCZVZpc2libGUgJiYgdmlzaWJsZSAhPT0gdGFiU2l6ZSkge1xuICAgICAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnNldFRleHQodGV4dCh0YWJTaXplKSk7XG4gICAgICAgIHZpc2libGUgPSB0YWJTaXplO1xuICAgICAgfSBlbHNlIGlmICghc2hvdWxkQmVWaXNpYmxlICYmIHZpc2libGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdmlzaWJsZSA9IG51bGw7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICBwcml2YXRlIG9uU2V0dGluZ3NDaGFuZ2UgPSAoc3R5bGVMaXN0czogYm9vbGVhbikgPT4ge1xuICAgIGlmIChzdHlsZUxpc3RzKSB7XG4gICAgICB0aGlzLmFkZExpc3RzU3R5bGVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlTGlzdHNTdHlsZXMoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBhZGRTdGF0dXNCYXJUZXh0KCkge1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dCA9IHRoaXMucGx1Z2luLmFkZFN0YXR1c0Jhckl0ZW0oKTtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICBwcml2YXRlIGFkZExpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUxpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCIuLi9lZGl0b3JfdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCIuLi9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi9zZXR0aW5nc1wiO1xuXG5mdW5jdGlvbiBpc0VudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICBlLmNvZGUgPT09IFwiRW50ZXJcIiAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0VXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG91dGRlbnRJZkxpbmVJc0VtcHR5KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RVdGlscy5wYXJzZUxpc3QoZWRpdG9yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuXG4gICAgaWYgKGxpc3QuZ2V0Q29udGVudCgpLmxlbmd0aCA+IDAgfHwgbGlzdC5nZXRMZXZlbCgpID09PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcm9vdC5tb3ZlTGVmdCgpO1xuXG4gICAgdGhpcy5saXN0VXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlciB8fCAhaXNFbnRlcihlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmtlZCA9IHRoaXMub3V0ZGVudElmTGluZUlzRW1wdHkoY20pO1xuXG4gICAgaWYgKHdvcmtlZCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4uL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnRlclNob3VsZENyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWxGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0VXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLm9uQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLm9uQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25CZWZvcmVDaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGxpc3RVdGlscyB9ID0gdGhpcztcblxuICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gY20uZ2V0TGluZShjaGFuZ2VPYmouZnJvbS5saW5lKTtcbiAgICBjb25zdCBuZXh0TGluZSA9IGNtLmdldExpbmUoY2hhbmdlT2JqLmZyb20ubGluZSArIDEpO1xuXG4gICAgaWYgKCFjdXJyZW50TGluZSB8fCAhbmV4dExpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRlbnRTaWduID0gbGlzdFV0aWxzLmRldGVjdExpc3RJbmRlbnRTaWduKGNtLCBjaGFuZ2VPYmouZnJvbSk7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRMaW5lSW5mbyA9IGxpc3RVdGlscy5nZXRMaXN0TGluZUluZm8oY3VycmVudExpbmUsIGluZGVudFNpZ24pO1xuICAgIGNvbnN0IG5leHRMaW5lSW5mbyA9IGxpc3RVdGlscy5nZXRMaXN0TGluZUluZm8obmV4dExpbmUsIGluZGVudFNpZ24pO1xuXG4gICAgaWYgKCFjdXJyZW50TGluZUluZm8gfHwgIW5leHRMaW5lSW5mbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZUlzTmV3bGluZSA9XG4gICAgICBjaGFuZ2VPYmoudGV4dC5sZW5ndGggPT09IDIgJiZcbiAgICAgIGNoYW5nZU9iai50ZXh0WzBdID09PSBcIlwiICYmXG4gICAgICAhIWxpc3RVdGlscy5nZXRMaXN0TGluZUluZm8oY2hhbmdlT2JqLnRleHRbMV0sIGluZGVudFNpZ24pO1xuXG4gICAgY29uc3QgbmV4bGluZUxldmVsSXNCaWdnZXIgPVxuICAgICAgY3VycmVudExpbmVJbmZvLmluZGVudExldmVsICsgMSA9PSBuZXh0TGluZUluZm8uaW5kZW50TGV2ZWw7XG5cbiAgICBjb25zdCBuZXh0TGluZUlzRW1wdHkgPVxuICAgICAgY20uZ2V0UmFuZ2UoY2hhbmdlT2JqLmZyb20sIHtcbiAgICAgICAgbGluZTogY2hhbmdlT2JqLmZyb20ubGluZSxcbiAgICAgICAgY2g6IGNoYW5nZU9iai5mcm9tLmNoICsgMSxcbiAgICAgIH0pLmxlbmd0aCA9PT0gMDtcblxuICAgIGlmIChjaGFuZ2VJc05ld2xpbmUgJiYgbmV4bGluZUxldmVsSXNCaWdnZXIgJiYgbmV4dExpbmVJc0VtcHR5KSB7XG4gICAgICBjaGFuZ2VPYmoudGV4dFsxXSA9IGluZGVudFNpZ24gKyBjaGFuZ2VPYmoudGV4dFsxXTtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoY2hhbmdlT2JqLmZyb20sIGNoYW5nZU9iai50bywgY2hhbmdlT2JqLnRleHQpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGl0ZXJhdGVXaGlsZUZvbGRlZChcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIHBvczogQ29kZU1pcnJvci5Qb3NpdGlvbixcbiAgICBpbmM6IChwb3M6IENvZGVNaXJyb3IuUG9zaXRpb24pID0+IHZvaWRcbiAgKSB7XG4gICAgbGV0IGZvbGRlZCA9IGZhbHNlO1xuICAgIGRvIHtcbiAgICAgIGluYyhwb3MpO1xuICAgICAgZm9sZGVkID0gKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHBvcyk7XG4gICAgfSB3aGlsZSAoZm9sZGVkKTtcbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JTZWxlY3Rpb25DaGFuZ2VcbiAgKSA9PiB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgfHxcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwiK21vdmVcIiB8fFxuICAgICAgY2hhbmdlT2JqLnJhbmdlcy5sZW5ndGggPiAxXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZ2UgPSBjaGFuZ2VPYmoucmFuZ2VzWzBdO1xuICAgIGNvbnN0IGN1cnNvciA9IGNtLmdldEN1cnNvcigpO1xuXG4gICAgaWYgKFxuICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgIT09IHJhbmdlLmhlYWQubGluZSB8fFxuICAgICAgcmFuZ2UuYW5jaG9yLmNoICE9PSByYW5nZS5oZWFkLmNoXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN1cnNvci5saW5lIDw9IDAgfHwgY3Vyc29yLmxpbmUgIT09IHJhbmdlLmFuY2hvci5saW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoY20pO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRTdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuXG4gICAgaWYgKFxuICAgICAgY3Vyc29yLmNoID09PSBsaXN0Q29udGVudFN0YXJ0Q2ggJiZcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9PT0gbGlzdENvbnRlbnRTdGFydENoIC0gMVxuICAgICkge1xuICAgICAgY29uc3QgbmV3Q3Vyc29yID0gdGhpcy5pdGVyYXRlV2hpbGVGb2xkZWQoXG4gICAgICAgIGNtLFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogY3Vyc29yLmxpbmUsXG4gICAgICAgICAgY2g6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICBwb3MubGluZS0tO1xuICAgICAgICAgIHBvcy5jaCA9IGNtLmdldExpbmUocG9zLmxpbmUpLmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBuZXdDdXJzb3IuY2grKztcbiAgICAgIHJhbmdlLmFuY2hvci5saW5lID0gbmV3Q3Vyc29yLmxpbmU7XG4gICAgICByYW5nZS5hbmNob3IuY2ggPSBuZXdDdXJzb3IuY2g7XG4gICAgICByYW5nZS5oZWFkLmxpbmUgPSBuZXdDdXJzb3IubGluZTtcbiAgICAgIHJhbmdlLmhlYWQuY2ggPSBuZXdDdXJzb3IuY2g7XG4gICAgICBjaGFuZ2VPYmoudXBkYXRlKFtyYW5nZV0pO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCJzcmMvZWRpdG9yX3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJjdXJzb3JBY3Rpdml0eVwiLCB0aGlzLmhhbmRsZUN1cnNvckFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImN1cnNvckFjdGl2aXR5XCIsIHRoaXMuaGFuZGxlQ3Vyc29yQWN0aXZpdHkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgaW5kZW50U2lnbiA9IHRoaXMubGlzdHNVdGlscy5kZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3IsIGN1cnNvcik7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgICAgY29uc3QgbGluZVN0YXJ0Q3Vyc29yID0gZWRpdG9yLmNvb3Jkc0NoYXIoe1xuICAgICAgICAuLi5lZGl0b3IuY3Vyc29yQ29vcmRzKCksXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICB9KTtcblxuICAgICAgaWYgKGxpbmVTdGFydEN1cnNvci5saW5lICE9PSBjdXJzb3IubGluZSkge1xuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHtcbiAgICAgICAgICBsaW5lOiBsaW5lU3RhcnRDdXJzb3IubGluZSxcbiAgICAgICAgICBjaDogZWRpdG9yLmdldExpbmUobGluZVN0YXJ0Q3Vyc29yLmxpbmUpLmxlbmd0aCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuICAgIGNvbnN0IGxpbmVQcmVmaXggPSB0aGlzLmxpc3RzVXRpbHMuZ2V0TGlzdExpbmVJbmZvKGxpbmUsIGluZGVudFNpZ24pXG4gICAgICAucHJlZml4TGVuZ3RoO1xuXG4gICAgaWYgKGN1cnNvci5jaCA8IGxpbmVQcmVmaXgpIHtcbiAgICAgIGN1cnNvci5jaCA9IGxpbmVQcmVmaXg7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDdXJzb3JBY3Rpdml0eSA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yICYmXG4gICAgICB0aGlzLmVkaXRvclV0aWxzLmNvbnRhaW5zU2luZ2xlQ3Vyc29yKGNtKSAmJlxuICAgICAgdGhpcy5saXN0c1V0aWxzLmlzQ3Vyc29ySW5MaXN0KGNtKVxuICAgICkge1xuICAgICAgdGhpcy5lbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50KGNtKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgRWRpdG9yVXRpbHMgfSBmcm9tIFwic3JjL2VkaXRvcl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwic3JjL2ZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgZWRpdG9yVXRpbHM6IEVkaXRvclV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZUNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUJlZm9yZUNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkgPT4ge1xuICAgIGlmIChjaGFuZ2VPYmoub3JpZ2luICE9PSBcIitkZWxldGVcIiB8fCAhdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGNtKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3RDb250ZW50U3RhcnRDaCA9IGxpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKTtcbiAgICBjb25zdCBsaXN0Q29udGVudEVuZENoID0gbGlzdC5nZXRDb250ZW50RW5kQ2goKTtcblxuICAgIGNvbnN0IHNhbWVMaW5lID0gY2hhbmdlT2JqLmZyb20ubGluZSA9PT0gY2hhbmdlT2JqLnRvLmxpbmU7XG4gICAgY29uc3QgbmV4dExpbmUgPSBjaGFuZ2VPYmouZnJvbS5saW5lICsgMSA9PT0gY2hhbmdlT2JqLnRvLmxpbmU7XG5cbiAgICBpZiAoXG4gICAgICBzYW1lTGluZSAmJlxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggPT09IGxpc3RDb250ZW50U3RhcnRDaCAtIDEgJiZcbiAgICAgIGNoYW5nZU9iai50by5jaCA9PT0gbGlzdENvbnRlbnRTdGFydENoXG4gICAgKSB7XG4gICAgICBjaGFuZ2VPYmouY2FuY2VsKCk7XG4gICAgICB0aGlzLmJhY2tzcGFjZShjbSk7XG4gICAgfSBlbHNlIGlmIChzYW1lTGluZSAmJiBjaGFuZ2VPYmouZnJvbS5jaCA8IGxpc3RDb250ZW50U3RhcnRDaCkge1xuICAgICAgY29uc3QgZnJvbSA9IHtcbiAgICAgICAgbGluZTogY2hhbmdlT2JqLmZyb20ubGluZSxcbiAgICAgICAgY2g6IGxpc3RDb250ZW50U3RhcnRDaCxcbiAgICAgIH07XG4gICAgICBjaGFuZ2VPYmoudXBkYXRlKGZyb20sIGNoYW5nZU9iai50bywgY2hhbmdlT2JqLnRleHQpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBuZXh0TGluZSAmJlxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggPT09IGxpc3RDb250ZW50RW5kQ2ggJiZcbiAgICAgIGNoYW5nZU9iai50by5jaCA9PT0gMFxuICAgICkge1xuICAgICAgY2hhbmdlT2JqLmNhbmNlbCgpO1xuICAgICAgdGhpcy5kZWxldGUoY20pO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGJhY2tzcGFjZShlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgaWYgKCF0aGlzLmVkaXRvclV0aWxzLmNvbnRhaW5zU2luZ2xlQ3Vyc29yKGVkaXRvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gdGhpcy5saXN0c1V0aWxzLnBhcnNlTGlzdChlZGl0b3IpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgcm9vdC5nZXRUb3RhbExpbmVzKCkgPT09IDEgJiZcbiAgICAgIHJvb3QuZ2V0Q2hpbGRyZW4oKVswXS5nZXRDb250ZW50KCkubGVuZ3RoID09PSAwXG4gICAgKSB7XG4gICAgICBlZGl0b3IucmVwbGFjZVJhbmdlKFxuICAgICAgICBcIlwiLFxuICAgICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCksXG4gICAgICAgIHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKClcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSByb290LmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCk7XG5cbiAgICBpZiAocmVzKSB7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByaXZhdGUgZGVsZXRlKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGVkaXRvcik7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBuZXh0TGluZU5vID0gcm9vdC5nZXRDdXJzb3IoKS5saW5lICsgMTtcbiAgICBjb25zdCBuZXh0TGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShuZXh0TGluZU5vKTtcblxuICAgIGlmICghbmV4dExpc3QgfHwgcm9vdC5nZXRDdXJzb3IoKS5jaCAhPT0gbGlzdC5nZXRDb250ZW50RW5kQ2goKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBuZXh0TGluZU5vLFxuICAgICAgY2g6IG5leHRMaXN0LmdldENvbnRlbnRTdGFydENoKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXMgPSByb290LmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCk7XG4gICAgY29uc3QgcmVhbGx5Q2hhbmdlZCA9IHJvb3QuZ2V0Q3Vyc29yKCkubGluZSAhPT0gbmV4dExpbmVObztcblxuICAgIGlmIChyZWFsbHlDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yU2VsZWN0aW9uQ2hhbmdlXG4gICkgPT4ge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yIHx8XG4gICAgICBjaGFuZ2VPYmoub3JpZ2luICE9PSBcIittb3ZlXCIgfHxcbiAgICAgIGNoYW5nZU9iai5yYW5nZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmdlID0gY2hhbmdlT2JqLnJhbmdlc1swXTtcblxuICAgIGlmIChcbiAgICAgIHJhbmdlLmFuY2hvci5saW5lICE9PSByYW5nZS5oZWFkLmxpbmUgfHxcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9PT0gcmFuZ2UuaGVhZC5jaFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGNtKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3RDb250ZW50U3RhcnRDaCA9IGxpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKTtcblxuICAgIGlmIChyYW5nZS5mcm9tKCkuY2ggPCBsaXN0Q29udGVudFN0YXJ0Q2gpIHtcbiAgICAgIHJhbmdlLmZyb20oKS5jaCA9IGxpc3RDb250ZW50U3RhcnRDaDtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoW3JhbmdlXSk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcblxuY2xhc3MgWm9vbVN0YXRlIHtcbiAgY29uc3RydWN0b3IocHVibGljIGxpbmU6IENvZGVNaXJyb3IuTGluZUhhbmRsZSwgcHVibGljIGhlYWRlcjogSFRNTEVsZW1lbnQpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBab29tRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgcHJpdmF0ZSB6b29tU3RhdGVzOiBXZWFrTWFwPENvZGVNaXJyb3IuRWRpdG9yLCBab29tU3RhdGU+ID0gbmV3IFdlYWtNYXAoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge1xuICAgIHRoaXMuem9vbVN0YXRlcyA9IG5ldyBXZWFrTWFwKCk7XG4gIH1cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICAgIGNtLm9uKFwiY2hhbmdlXCIsIHRoaXMuaGFuZGxlQ2hhbmdlKTtcbiAgICAgIGNtLm9uKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiem9vbS1pblwiLFxuICAgICAgbmFtZTogXCJab29tIGluIHRvIHRoZSBjdXJyZW50IGxpc3QgaXRlbVwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuem9vbUluLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiLlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiem9vbS1vdXRcIixcbiAgICAgIG5hbWU6IFwiWm9vbSBvdXQgdGhlIGVudGlyZSBkb2N1bWVudFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuem9vbU91dC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiLlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBjbS5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5oYW5kbGVDaGFuZ2UpO1xuICAgICAgY20ub2ZmKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGVcbiAgKSA9PiB7XG4gICAgY29uc3Qgem9vbVN0YXRlID0gdGhpcy56b29tU3RhdGVzLmdldChjbSk7XG5cbiAgICBpZiAoXG4gICAgICAhem9vbVN0YXRlIHx8XG4gICAgICBjaGFuZ2VPYmoub3JpZ2luICE9PSBcInNldFZhbHVlXCIgfHxcbiAgICAgIGNoYW5nZU9iai5mcm9tLmxpbmUgIT09IDAgfHxcbiAgICAgIGNoYW5nZU9iai5mcm9tLmNoICE9PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGlsbExpbmUgPSBjbS5sYXN0TGluZSgpO1xuICAgIGNvbnN0IHRpbGxDaCA9IGNtLmdldExpbmUodGlsbExpbmUpLmxlbmd0aDtcblxuICAgIGlmIChjaGFuZ2VPYmoudG8ubGluZSAhPT0gdGlsbExpbmUgfHwgY2hhbmdlT2JqLnRvLmNoICE9PSB0aWxsQ2gpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnpvb21PdXQoY20pO1xuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGVcbiAgKSA9PiB7XG4gICAgY29uc3Qgem9vbVN0YXRlID0gdGhpcy56b29tU3RhdGVzLmdldChjbSk7XG5cbiAgICBpZiAoIXpvb21TdGF0ZSB8fCBjaGFuZ2VPYmoub3JpZ2luICE9PSBcInNldFZhbHVlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnpvb21JbihjbSwge1xuICAgICAgbGluZTogY20uZ2V0TGluZU51bWJlcih6b29tU3RhdGUubGluZSksXG4gICAgICBjaDogMCxcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIGhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvclNlbGVjdGlvbkNoYW5nZVxuICApID0+IHtcbiAgICBpZiAoIXRoaXMuem9vbVN0YXRlcy5oYXMoY20pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHZpc2libGVGcm9tOiBDb2RlTWlycm9yLlBvc2l0aW9uIHwgbnVsbCA9IG51bGw7XG4gICAgbGV0IHZpc2libGVUaWxsOiBDb2RlTWlycm9yLlBvc2l0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gY20uZmlyc3RMaW5lKCk7IGkgPD0gY20ubGFzdExpbmUoKTsgaSsrKSB7XG4gICAgICBjb25zdCB3cmFwQ2xhc3MgPSBjbS5saW5lSW5mbyhpKS53cmFwQ2xhc3MgfHwgXCJcIjtcbiAgICAgIGNvbnN0IGlzSGlkZGVuID0gd3JhcENsYXNzLmluY2x1ZGVzKFwib3V0bGluZXItcGx1Z2luLWhpZGRlbi1yb3dcIik7XG4gICAgICBpZiAodmlzaWJsZUZyb20gPT09IG51bGwgJiYgIWlzSGlkZGVuKSB7XG4gICAgICAgIHZpc2libGVGcm9tID0geyBsaW5lOiBpLCBjaDogMCB9O1xuICAgICAgfVxuICAgICAgaWYgKHZpc2libGVGcm9tICE9PSBudWxsICYmIHZpc2libGVUaWxsICE9PSBudWxsICYmIGlzSGlkZGVuKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKHZpc2libGVGcm9tICE9PSBudWxsKSB7XG4gICAgICAgIHZpc2libGVUaWxsID0geyBsaW5lOiBpLCBjaDogY20uZ2V0TGluZShpKS5sZW5ndGggfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCByYW5nZSBvZiBjaGFuZ2VPYmoucmFuZ2VzKSB7XG4gICAgICBpZiAocmFuZ2UuYW5jaG9yLmxpbmUgPCB2aXNpYmxlRnJvbS5saW5lKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByYW5nZS5hbmNob3IubGluZSA9IHZpc2libGVGcm9tLmxpbmU7XG4gICAgICAgIHJhbmdlLmFuY2hvci5jaCA9IHZpc2libGVGcm9tLmNoO1xuICAgICAgfVxuICAgICAgaWYgKHJhbmdlLmFuY2hvci5saW5lID4gdmlzaWJsZVRpbGwubGluZSkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgPSB2aXNpYmxlVGlsbC5saW5lO1xuICAgICAgICByYW5nZS5hbmNob3IuY2ggPSB2aXNpYmxlVGlsbC5jaDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZS5oZWFkLmxpbmUgPCB2aXNpYmxlRnJvbS5saW5lKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByYW5nZS5oZWFkLmxpbmUgPSB2aXNpYmxlRnJvbS5saW5lO1xuICAgICAgICByYW5nZS5oZWFkLmNoID0gdmlzaWJsZUZyb20uY2g7XG4gICAgICB9XG4gICAgICBpZiAocmFuZ2UuaGVhZC5saW5lID4gdmlzaWJsZVRpbGwubGluZSkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmFuZ2UuaGVhZC5saW5lID0gdmlzaWJsZVRpbGwubGluZTtcbiAgICAgICAgcmFuZ2UuaGVhZC5jaCA9IHZpc2libGVUaWxsLmNoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICBjaGFuZ2VPYmoudXBkYXRlKGNoYW5nZU9iai5yYW5nZXMpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIHpvb21PdXQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHpvb21TdGF0ZSA9IHRoaXMuem9vbVN0YXRlcy5nZXQoZWRpdG9yKTtcblxuICAgIGlmICghem9vbVN0YXRlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGVkaXRvci5maXJzdExpbmUoKSwgbCA9IGVkaXRvci5sYXN0TGluZSgpOyBpIDw9IGw7IGkrKykge1xuICAgICAgZWRpdG9yLnJlbW92ZUxpbmVDbGFzcyhpLCBcIndyYXBcIiwgXCJvdXRsaW5lci1wbHVnaW4taGlkZGVuLXJvd1wiKTtcbiAgICB9XG5cbiAgICB6b29tU3RhdGUuaGVhZGVyLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoem9vbVN0YXRlLmhlYWRlcik7XG5cbiAgICB0aGlzLnpvb21TdGF0ZXMuZGVsZXRlKGVkaXRvcik7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgem9vbUluKFxuICAgIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY3Vyc29yOiBDb2RlTWlycm9yLlBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvcigpXG4gICkge1xuICAgIGNvbnN0IGxpbmVObyA9IGN1cnNvci5saW5lO1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGVkaXRvciwgY3Vyc29yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuem9vbU91dChlZGl0b3IpO1xuXG4gICAgY29uc3QgeyBpbmRlbnRMZXZlbCB9ID0gdGhpcy5saXN0c1V0aWxzLmdldExpc3RMaW5lSW5mbyhcbiAgICAgIGVkaXRvci5nZXRMaW5lKGxpbmVObyksXG4gICAgICByb290LmdldEluZGVudFNpZ24oKVxuICAgICk7XG5cbiAgICBsZXQgYWZ0ZXIgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gZWRpdG9yLmZpcnN0TGluZSgpLCBsID0gZWRpdG9yLmxhc3RMaW5lKCk7IGkgPD0gbDsgaSsrKSB7XG4gICAgICBpZiAoaSA8IGxpbmVObykge1xuICAgICAgICBlZGl0b3IuYWRkTGluZUNsYXNzKGksIFwid3JhcFwiLCBcIm91dGxpbmVyLXBsdWdpbi1oaWRkZW4tcm93XCIpO1xuICAgICAgfSBlbHNlIGlmIChpID4gbGluZU5vICYmICFhZnRlcikge1xuICAgICAgICBjb25zdCBhZnRlckxpbmVJbmZvID0gdGhpcy5saXN0c1V0aWxzLmdldExpc3RMaW5lSW5mbyhcbiAgICAgICAgICBlZGl0b3IuZ2V0TGluZShpKSxcbiAgICAgICAgICByb290LmdldEluZGVudFNpZ24oKVxuICAgICAgICApO1xuICAgICAgICBhZnRlciA9ICFhZnRlckxpbmVJbmZvIHx8IGFmdGVyTGluZUluZm8uaW5kZW50TGV2ZWwgPD0gaW5kZW50TGV2ZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChhZnRlcikge1xuICAgICAgICBlZGl0b3IuYWRkTGluZUNsYXNzKGksIFwid3JhcFwiLCBcIm91dGxpbmVyLXBsdWdpbi1oaWRkZW4tcm93XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZVNlcGFyYXRvciA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBcIiA+IFwiO1xuICAgICAgcmV0dXJuIHNwYW47XG4gICAgfTtcblxuICAgIGNvbnN0IGNyZWF0ZVRpdGxlID0gKGNvbnRlbnQ6IHN0cmluZywgY2I6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgIGEuY2xhc3NOYW1lID0gXCJvdXRsaW5lci1wbHVnaW4tem9vbS10aXRsZVwiO1xuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgYS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhLmlubmVySFRNTCA9IFwiJm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7XCI7XG4gICAgICB9XG4gICAgICBhLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNiKCk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIGNvbnN0IGNyZWF0ZUhlYWRlciA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBkaXYuY2xhc3NOYW1lID0gXCJvdXRsaW5lci1wbHVnaW4tem9vbS1oZWFkZXJcIjtcblxuICAgICAgbGV0IGxpc3QgPSByb290LmdldExpc3RVbmRlckxpbmUobGluZU5vKS5nZXRQYXJlbnQoKTtcbiAgICAgIHdoaWxlIChsaXN0ICYmIGxpc3QuZ2V0UGFyZW50KCkpIHtcbiAgICAgICAgY29uc3QgbGluZU5vID0gcm9vdC5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgICAgIGRpdi5wcmVwZW5kKFxuICAgICAgICAgIGNyZWF0ZVRpdGxlKGxpc3QuZ2V0Q29udGVudCgpLCAoKSA9PlxuICAgICAgICAgICAgdGhpcy56b29tSW4oZWRpdG9yLCB7IGxpbmU6IGxpbmVObywgY2g6IDAgfSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGRpdi5wcmVwZW5kKGNyZWF0ZVNlcGFyYXRvcigpKTtcbiAgICAgICAgbGlzdCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgICB9XG5cbiAgICAgIGRpdi5wcmVwZW5kKFxuICAgICAgICBjcmVhdGVUaXRsZSh0aGlzLm9ic2lkaWFuVXRpbHMuZ2V0QWN0aXZlTGVhZkRpc3BsYXlUZXh0KCksICgpID0+XG4gICAgICAgICAgdGhpcy56b29tT3V0KGVkaXRvcilcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGRpdjtcbiAgICB9O1xuXG4gICAgY29uc3Qgem9vbUhlYWRlciA9IGNyZWF0ZUhlYWRlcigpO1xuICAgIGVkaXRvci5nZXRXcmFwcGVyRWxlbWVudCgpLnByZXBlbmQoem9vbUhlYWRlcik7XG5cbiAgICB0aGlzLnpvb21TdGF0ZXMuc2V0KFxuICAgICAgZWRpdG9yLFxuICAgICAgbmV3IFpvb21TdGF0ZShlZGl0b3IuZ2V0TGluZUhhbmRsZShsaW5lTm8pLCB6b29tSGVhZGVyKVxuICAgICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcblxuZXhwb3J0IGNsYXNzIEZvbGRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiZm9sZFwiLFxuICAgICAgbmFtZTogXCJGb2xkIHRoZSBsaXN0XCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayh0aGlzLmZvbGQuYmluZCh0aGlzKSksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dVcFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwidW5mb2xkXCIsXG4gICAgICBuYW1lOiBcIlVuZm9sZCB0aGUgbGlzdFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMudW5mb2xkLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dEb3duXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIHNldEZvbGQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgdHlwZTogXCJmb2xkXCIgfCBcInVuZm9sZFwiKSB7XG4gICAgaWYgKCF0aGlzLmxpc3RzVXRpbHMuaXNDdXJzb3JJbkxpc3QoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIChlZGl0b3IgYXMgYW55KS5mb2xkQ29kZShlZGl0b3IuZ2V0Q3Vyc29yKCksIG51bGwsIHR5cGUpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIGZvbGQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLnNldEZvbGQoZWRpdG9yLCBcImZvbGRcIik7XG4gIH1cblxuICBwcml2YXRlIHVuZm9sZChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Rm9sZChlZGl0b3IsIFwidW5mb2xkXCIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcInNyYy9vYnNpZGlhbl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0QWxsRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInNlbGVjdC1hbGxcIixcbiAgICAgIG5hbWU6IFwiU2VsZWN0IGEgbGlzdCBpdGVtIG9yIHRoZSBlbnRpcmUgbGlzdFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuc2VsZWN0QWxsLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiYVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBzZWxlY3RBbGwoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHNlbGVjdGlvbnMgPSBlZGl0b3IubGlzdFNlbGVjdGlvbnMoKTtcblxuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHNlbGVjdGlvbnNbMF07XG5cbiAgICBpZiAoc2VsZWN0aW9uLmFuY2hvci5saW5lICE9PSBzZWxlY3Rpb24uaGVhZC5saW5lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoZWRpdG9yLCBzZWxlY3Rpb24uYW5jaG9yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHN0YXJ0Q2ggPSBsaXN0LmdldENvbnRlbnRTdGFydENoKCk7XG4gICAgY29uc3QgZW5kQ2ggPSBsaXN0LmdldENvbnRlbnRFbmRDaCgpO1xuXG4gICAgaWYgKHNlbGVjdGlvbi5mcm9tKCkuY2ggPT09IHN0YXJ0Q2ggJiYgc2VsZWN0aW9uLnRvKCkuY2ggPT09IGVuZENoKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGxpc3RcbiAgICAgIGVkaXRvci5zZXRTZWxlY3Rpb24oXG4gICAgICAgIHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKSxcbiAgICAgICAgcm9vdC5nZXRMaXN0RW5kUG9zaXRpb24oKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2VsZWN0IGFsbCBsaW5lXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogc2VsZWN0aW9uLmFuY2hvci5saW5lLFxuICAgICAgICAgIGNoOiBzdGFydENoLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogc2VsZWN0aW9uLmFuY2hvci5saW5lLFxuICAgICAgICAgIGNoOiBlbmRDaCxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwic3JjL3Jvb3RcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVJdGVtc0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIG9ic2lkaWFuVXRpbHM6IE9ic2lkaWFuVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJtb3ZlLWxpc3QtaXRlbS11cFwiLFxuICAgICAgbmFtZTogXCJNb3ZlIGxpc3QgYW5kIHN1Ymxpc3RzIHVwXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRVcC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dVcFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwibW92ZS1saXN0LWl0ZW0tZG93blwiLFxuICAgICAgbmFtZTogXCJNb3ZlIGxpc3QgYW5kIHN1Ymxpc3RzIGRvd25cIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudERvd24uYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiaW5kZW50LWxpc3RcIixcbiAgICAgIG5hbWU6IFwiSW5kZW50IHRoZSBsaXN0IGFuZCBzdWJsaXN0c1wiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50UmlnaHQuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW10sXG4gICAgICAgICAga2V5OiBcIlRhYlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwib3V0ZGVudC1saXN0XCIsXG4gICAgICBuYW1lOiBcIk91dGRlbnQgdGhlIGxpc3QgYW5kIHN1Ymxpc3RzXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRMZWZ0LmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIlNoaWZ0XCJdLFxuICAgICAgICAgIGtleTogXCJUYWJcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgZXhlY3V0ZShcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNiOiAocm9vdDogUm9vdCkgPT4gYm9vbGVhblxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5saXN0c1V0aWxzLnBhcnNlTGlzdChlZGl0b3IsIGVkaXRvci5nZXRDdXJzb3IoKSk7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBjYihyb290KTtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHRoaXMubGlzdHNVdGlscy5hcHBseUNoYW5nZXMoZWRpdG9yLCByb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnREb3duKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKGVkaXRvciwgKHJvb3QpID0+IHJvb3QubW92ZURvd24oKSk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudFVwKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKGVkaXRvciwgKHJvb3QpID0+IHJvb3QubW92ZVVwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnRSaWdodChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVSaWdodCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50TGVmdChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVMZWZ0KCkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IHsgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIsIFNldHRpbmdzIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlXCI7XHJcbmltcG9ydCB7IE9ic2lkaWFuVXRpbHMgfSBmcm9tIFwiLi9vYnNpZGlhbl91dGlsc1wiO1xyXG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCIuL2VkaXRvcl91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwiLi9saXN0X3V0aWxzXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2xvZ2dlclwiO1xyXG5pbXBvcnQgeyBMaXN0c1N0eWxlc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9MaXN0c1N0eWxlc0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBFbnRlclNob3VsZENyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWxGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBNb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgWm9vbUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9ab29tRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBGb2xkRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0ZvbGRGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNlbGVjdEFsbEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9TZWxlY3RBbGxGZWF0dXJlXCI7XHJcbmltcG9ydCB7IE1vdmVJdGVtc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Nb3ZlSXRlbXNGZWF0dXJlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICBwcml2YXRlIGZlYXR1cmVzOiBJRmVhdHVyZVtdO1xyXG4gIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzO1xyXG4gIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXI7XHJcbiAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzO1xyXG4gIHByaXZhdGUgZWRpdG9yVXRpbHM6IEVkaXRvclV0aWxzO1xyXG4gIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzO1xyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgTG9hZGluZyBvYnNpZGlhbi1vdXRsaW5lcmApO1xyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgU2V0dGluZ3ModGhpcyk7XHJcbiAgICBhd2FpdCB0aGlzLnNldHRpbmdzLmxvYWQoKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIodGhpcy5zZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5vYnNpZGlhblV0aWxzID0gbmV3IE9ic2lkaWFuVXRpbHModGhpcy5hcHApO1xyXG4gICAgdGhpcy5lZGl0b3JVdGlscyA9IG5ldyBFZGl0b3JVdGlscygpO1xyXG4gICAgdGhpcy5saXN0c1V0aWxzID0gbmV3IExpc3RVdGlscyh0aGlzLmxvZ2dlciwgdGhpcy5vYnNpZGlhblV0aWxzKTtcclxuXHJcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIoXHJcbiAgICAgIG5ldyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcywgdGhpcy5zZXR0aW5ncylcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5mZWF0dXJlcyA9IFtcclxuICAgICAgbmV3IExpc3RzU3R5bGVzRmVhdHVyZSh0aGlzLCB0aGlzLnNldHRpbmdzLCB0aGlzLm9ic2lkaWFuVXRpbHMpLFxyXG4gICAgICBuZXcgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzLFxyXG4gICAgICAgIHRoaXMuZWRpdG9yVXRpbHMsXHJcbiAgICAgICAgdGhpcy5saXN0c1V0aWxzXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBFbnRlclNob3VsZENyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWxGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgWm9vbUZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgRm9sZEZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgU2VsZWN0QWxsRmVhdHVyZSh0aGlzLCB0aGlzLm9ic2lkaWFuVXRpbHMsIHRoaXMubGlzdHNVdGlscyksXHJcbiAgICAgIG5ldyBNb3ZlSXRlbXNGZWF0dXJlKHRoaXMsIHRoaXMub2JzaWRpYW5VdGlscywgdGhpcy5saXN0c1V0aWxzKSxcclxuICAgIF07XHJcblxyXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcclxuICAgICAgYXdhaXQgZmVhdHVyZS5sb2FkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbnVubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKGBVbmxvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgdGhpcy5mZWF0dXJlcykge1xyXG4gICAgICBhd2FpdCBmZWF0dXJlLnVubG9hZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJNYXJrZG93blZpZXciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFD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
