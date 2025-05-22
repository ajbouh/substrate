function dispatch(node2, type2, detail) {
  detail = detail || {};
  var document2 = node2.ownerDocument, event = document2.defaultView.CustomEvent;
  if (typeof event === "function") {
    event = new event(type2, { detail });
  } else {
    event = document2.createEvent("Event");
    event.initEvent(type2, false, false);
    event.detail = detail;
  }
  node2.dispatchEvent(event);
}
function isarray(value) {
  return Array.isArray(value) || value instanceof Int8Array || value instanceof Int16Array || value instanceof Int32Array || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Uint16Array || value instanceof Uint32Array || value instanceof Float32Array || value instanceof Float64Array;
}
function isindex(key) {
  return key === (key | 0) + "";
}
function inspectName(name2) {
  const n2 = document.createElement("span");
  n2.className = "observablehq--cellname";
  n2.textContent = `${name2} = `;
  return n2;
}
const symbolToString = Symbol.prototype.toString;
function formatSymbol(symbol) {
  return symbolToString.call(symbol);
}
const { getOwnPropertySymbols, prototype: { hasOwnProperty: hasOwnProperty$1 } } = Object;
const { toStringTag } = Symbol;
const FORBIDDEN = {};
const symbolsof = getOwnPropertySymbols;
function isown(object, key) {
  return hasOwnProperty$1.call(object, key);
}
function tagof(object) {
  return object[toStringTag] || object.constructor && object.constructor.name || "Object";
}
function valueof(object, key) {
  try {
    const value = object[key];
    if (value) value.constructor;
    return value;
  } catch (ignore2) {
    return FORBIDDEN;
  }
}
const SYMBOLS = [
  { symbol: "@@__IMMUTABLE_INDEXED__@@", name: "Indexed", modifier: true },
  { symbol: "@@__IMMUTABLE_KEYED__@@", name: "Keyed", modifier: true },
  { symbol: "@@__IMMUTABLE_LIST__@@", name: "List", arrayish: true },
  { symbol: "@@__IMMUTABLE_MAP__@@", name: "Map" },
  {
    symbol: "@@__IMMUTABLE_ORDERED__@@",
    name: "Ordered",
    modifier: true,
    prefix: true
  },
  { symbol: "@@__IMMUTABLE_RECORD__@@", name: "Record" },
  {
    symbol: "@@__IMMUTABLE_SET__@@",
    name: "Set",
    arrayish: true,
    setish: true
  },
  { symbol: "@@__IMMUTABLE_STACK__@@", name: "Stack", arrayish: true }
];
function immutableName(obj) {
  try {
    let symbols = SYMBOLS.filter(({ symbol }) => obj[symbol] === true);
    if (!symbols.length) return;
    const name2 = symbols.find((s2) => !s2.modifier);
    const prefix = name2.name === "Map" && symbols.find((s2) => s2.modifier && s2.prefix);
    const arrayish = symbols.some((s2) => s2.arrayish);
    const setish = symbols.some((s2) => s2.setish);
    return {
      name: `${prefix ? prefix.name : ""}${name2.name}`,
      symbols,
      arrayish: arrayish && !setish,
      setish
    };
  } catch (e2) {
    return null;
  }
}
const { getPrototypeOf, getOwnPropertyDescriptors: getOwnPropertyDescriptors$1 } = Object;
const objectPrototype = getPrototypeOf({});
function inspectExpanded(object, _, name2, proto) {
  let arrayish = isarray(object);
  let tag, fields, next, n2;
  if (object instanceof Map) {
    if (object instanceof object.constructor) {
      tag = `Map(${object.size})`;
      fields = iterateMap$1;
    } else {
      tag = "Map()";
      fields = iterateObject$1;
    }
  } else if (object instanceof Set) {
    if (object instanceof object.constructor) {
      tag = `Set(${object.size})`;
      fields = iterateSet$1;
    } else {
      tag = "Set()";
      fields = iterateObject$1;
    }
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray$1;
  } else if (n2 = immutableName(object)) {
    tag = `Immutable.${n2.name}${n2.name === "Record" ? "" : `(${object.size})`}`;
    arrayish = n2.arrayish;
    fields = n2.arrayish ? iterateImArray$1 : n2.setish ? iterateImSet$1 : iterateImObject$1;
  } else if (proto) {
    tag = tagof(object);
    fields = iterateProto;
  } else {
    tag = tagof(object);
    fields = iterateObject$1;
  }
  const span = document.createElement("span");
  span.className = "observablehq--expanded";
  if (name2) {
    span.appendChild(inspectName(name2));
  }
  const a2 = span.appendChild(document.createElement("a"));
  a2.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M4 7L0 1h8z' fill='currentColor' />
  </svg>`;
  a2.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  a2.addEventListener("mouseup", function(event) {
    event.stopPropagation();
    replace(span, inspectCollapsed(object, null, name2, proto));
  });
  fields = fields(object);
  for (let i2 = 0; !(next = fields.next()).done && i2 < 20; ++i2) {
    span.appendChild(next.value);
  }
  if (!next.done) {
    const a3 = span.appendChild(document.createElement("a"));
    a3.className = "observablehq--field";
    a3.style.display = "block";
    a3.appendChild(document.createTextNode(`  … more`));
    a3.addEventListener("mouseup", function(event) {
      event.stopPropagation();
      span.insertBefore(next.value, span.lastChild.previousSibling);
      for (let i2 = 0; !(next = fields.next()).done && i2 < 19; ++i2) {
        span.insertBefore(next.value, span.lastChild.previousSibling);
      }
      if (next.done) span.removeChild(span.lastChild.previousSibling);
      dispatch(span, "load");
    });
  }
  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));
  return span;
}
function* iterateMap$1(map) {
  for (const [key, value] of map) {
    yield formatMapField$1(key, value);
  }
  yield* iterateObject$1(map);
}
function* iterateSet$1(set) {
  for (const value of set) {
    yield formatSetField(value);
  }
  yield* iterateObject$1(set);
}
function* iterateImSet$1(set) {
  for (const value of set) {
    yield formatSetField(value);
  }
}
function* iterateArray$1(array) {
  for (let i2 = 0, n2 = array.length; i2 < n2; ++i2) {
    if (i2 in array) {
      yield formatField$1(i2, valueof(array, i2), "observablehq--index");
    }
  }
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField$1(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField$1(
      formatSymbol(symbol),
      valueof(array, symbol),
      "observablehq--symbol"
    );
  }
}
function* iterateImArray$1(array) {
  let i1 = 0;
  for (const n2 = array.size; i1 < n2; ++i1) {
    yield formatField$1(i1, array.get(i1), true);
  }
}
function* iterateProto(object) {
  for (const key in getOwnPropertyDescriptors$1(object)) {
    yield formatField$1(key, valueof(object, key), "observablehq--key");
  }
  for (const symbol of symbolsof(object)) {
    yield formatField$1(
      formatSymbol(symbol),
      valueof(object, symbol),
      "observablehq--symbol"
    );
  }
  const proto = getPrototypeOf(object);
  if (proto && proto !== objectPrototype) {
    yield formatPrototype(proto);
  }
}
function* iterateObject$1(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField$1(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField$1(
      formatSymbol(symbol),
      valueof(object, symbol),
      "observablehq--symbol"
    );
  }
  const proto = getPrototypeOf(object);
  if (proto && proto !== objectPrototype) {
    yield formatPrototype(proto);
  }
}
function* iterateImObject$1(object) {
  for (const [key, value] of object) {
    yield formatField$1(key, value, "observablehq--key");
  }
}
function formatPrototype(value) {
  const item = document.createElement("div");
  const span = item.appendChild(document.createElement("span"));
  item.className = "observablehq--field";
  span.className = "observablehq--prototype-key";
  span.textContent = `  <prototype>`;
  item.appendChild(document.createTextNode(": "));
  item.appendChild(inspect$1(value, void 0, void 0, void 0, true));
  return item;
}
function formatField$1(key, value, className) {
  const item = document.createElement("div");
  const span = item.appendChild(document.createElement("span"));
  item.className = "observablehq--field";
  span.className = className;
  span.textContent = `  ${key}`;
  item.appendChild(document.createTextNode(": "));
  item.appendChild(inspect$1(value));
  return item;
}
function formatMapField$1(key, value) {
  const item = document.createElement("div");
  item.className = "observablehq--field";
  item.appendChild(document.createTextNode("  "));
  item.appendChild(inspect$1(key));
  item.appendChild(document.createTextNode(" => "));
  item.appendChild(inspect$1(value));
  return item;
}
function formatSetField(value) {
  const item = document.createElement("div");
  item.className = "observablehq--field";
  item.appendChild(document.createTextNode("  "));
  item.appendChild(inspect$1(value));
  return item;
}
function hasSelection(elem) {
  const sel = window.getSelection();
  return sel.type === "Range" && (sel.containsNode(elem, true) || elem.contains(sel.anchorNode) || elem.contains(sel.focusNode));
}
function inspectCollapsed(object, shallow, name2, proto) {
  let arrayish = isarray(object);
  let tag, fields, next, n2;
  if (object instanceof Map) {
    if (object instanceof object.constructor) {
      tag = `Map(${object.size})`;
      fields = iterateMap;
    } else {
      tag = "Map()";
      fields = iterateObject;
    }
  } else if (object instanceof Set) {
    if (object instanceof object.constructor) {
      tag = `Set(${object.size})`;
      fields = iterateSet;
    } else {
      tag = "Set()";
      fields = iterateObject;
    }
  } else if (arrayish) {
    tag = `${object.constructor.name}(${object.length})`;
    fields = iterateArray;
  } else if (n2 = immutableName(object)) {
    tag = `Immutable.${n2.name}${n2.name === "Record" ? "" : `(${object.size})`}`;
    arrayish = n2.arrayish;
    fields = n2.arrayish ? iterateImArray : n2.setish ? iterateImSet : iterateImObject;
  } else {
    tag = tagof(object);
    fields = iterateObject;
  }
  if (shallow) {
    const span2 = document.createElement("span");
    span2.className = "observablehq--shallow";
    if (name2) {
      span2.appendChild(inspectName(name2));
    }
    span2.appendChild(document.createTextNode(tag));
    span2.addEventListener("mouseup", function(event) {
      if (hasSelection(span2)) return;
      event.stopPropagation();
      replace(span2, inspectCollapsed(object));
    });
    return span2;
  }
  const span = document.createElement("span");
  span.className = "observablehq--collapsed";
  if (name2) {
    span.appendChild(inspectName(name2));
  }
  const a2 = span.appendChild(document.createElement("a"));
  a2.innerHTML = `<svg width=8 height=8 class='observablehq--caret'>
    <path d='M7 4L1 8V0z' fill='currentColor' />
  </svg>`;
  a2.appendChild(document.createTextNode(`${tag}${arrayish ? " [" : " {"}`));
  span.addEventListener("mouseup", function(event) {
    if (hasSelection(span)) return;
    event.stopPropagation();
    replace(span, inspectExpanded(object, null, name2, proto));
  }, true);
  fields = fields(object);
  for (let i2 = 0; !(next = fields.next()).done && i2 < 20; ++i2) {
    if (i2 > 0) span.appendChild(document.createTextNode(", "));
    span.appendChild(next.value);
  }
  if (!next.done) span.appendChild(document.createTextNode(", …"));
  span.appendChild(document.createTextNode(arrayish ? "]" : "}"));
  return span;
}
function* iterateMap(map) {
  for (const [key, value] of map) {
    yield formatMapField(key, value);
  }
  yield* iterateObject(map);
}
function* iterateSet(set) {
  for (const value of set) {
    yield inspect$1(value, true);
  }
  yield* iterateObject(set);
}
function* iterateImSet(set) {
  for (const value of set) {
    yield inspect$1(value, true);
  }
}
function* iterateImArray(array) {
  let i0 = -1, i1 = 0;
  for (const n2 = array.size; i1 < n2; ++i1) {
    if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
    yield inspect$1(array.get(i1), true);
    i0 = i1;
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
}
function* iterateArray(array) {
  let i0 = -1, i1 = 0;
  for (const n2 = array.length; i1 < n2; ++i1) {
    if (i1 in array) {
      if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
      yield inspect$1(valueof(array, i1), true);
      i0 = i1;
    }
  }
  if (i1 > i0 + 1) yield formatEmpty(i1 - i0 - 1);
  for (const key in array) {
    if (!isindex(key) && isown(array, key)) {
      yield formatField(key, valueof(array, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(array)) {
    yield formatField(formatSymbol(symbol), valueof(array, symbol), "observablehq--symbol");
  }
}
function* iterateObject(object) {
  for (const key in object) {
    if (isown(object, key)) {
      yield formatField(key, valueof(object, key), "observablehq--key");
    }
  }
  for (const symbol of symbolsof(object)) {
    yield formatField(formatSymbol(symbol), valueof(object, symbol), "observablehq--symbol");
  }
}
function* iterateImObject(object) {
  for (const [key, value] of object) {
    yield formatField(key, value, "observablehq--key");
  }
}
function formatEmpty(e2) {
  const span = document.createElement("span");
  span.className = "observablehq--empty";
  span.textContent = e2 === 1 ? "empty" : `empty × ${e2}`;
  return span;
}
function formatField(key, value, className) {
  const fragment = document.createDocumentFragment();
  const span = fragment.appendChild(document.createElement("span"));
  span.className = className;
  span.textContent = key;
  fragment.appendChild(document.createTextNode(": "));
  fragment.appendChild(inspect$1(value, true));
  return fragment;
}
function formatMapField(key, value) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(inspect$1(key, true));
  fragment.appendChild(document.createTextNode(" => "));
  fragment.appendChild(inspect$1(value, true));
  return fragment;
}
function format$2(date, fallback) {
  if (!(date instanceof Date)) date = /* @__PURE__ */ new Date(+date);
  if (isNaN(date)) return false ? fallback(date) : fallback;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  return `${formatYear(date.getUTCFullYear())}-${pad$1(date.getUTCMonth() + 1, 2)}-${pad$1(date.getUTCDate(), 2)}${hours || minutes || seconds || milliseconds ? `T${pad$1(hours, 2)}:${pad$1(minutes, 2)}${seconds || milliseconds ? `:${pad$1(seconds, 2)}${milliseconds ? `.${pad$1(milliseconds, 3)}` : ``}` : ``}Z` : ``}`;
}
function formatYear(year) {
  return year < 0 ? `-${pad$1(-year, 6)}` : year > 9999 ? `+${pad$1(year, 6)}` : pad$1(year, 4);
}
function pad$1(value, width) {
  return `${value}`.padStart(width, "0");
}
function formatDate(date) {
  return format$2(date, "Invalid Date");
}
var errorToString = Error.prototype.toString;
function formatError$1(value) {
  return value.stack || errorToString.call(value);
}
var regExpToString = RegExp.prototype.toString;
function formatRegExp$1(value) {
  return regExpToString.call(value);
}
const NEWLINE_LIMIT = 20;
function formatString(string2, shallow, expanded, name2) {
  if (shallow === false) {
    if (count(string2, /["\n]/g) <= count(string2, /`|\${/g)) {
      const span3 = document.createElement("span");
      if (name2) span3.appendChild(inspectName(name2));
      const textValue3 = span3.appendChild(document.createElement("span"));
      textValue3.className = "observablehq--string";
      textValue3.textContent = JSON.stringify(string2);
      return span3;
    }
    const lines = string2.split("\n");
    if (lines.length > NEWLINE_LIMIT && !expanded) {
      const div = document.createElement("div");
      if (name2) div.appendChild(inspectName(name2));
      const textValue3 = div.appendChild(document.createElement("span"));
      textValue3.className = "observablehq--string";
      textValue3.textContent = "`" + templatify(lines.slice(0, NEWLINE_LIMIT).join("\n"));
      const splitter = div.appendChild(document.createElement("span"));
      const truncatedCount = lines.length - NEWLINE_LIMIT;
      splitter.textContent = `Show ${truncatedCount} truncated line${truncatedCount > 1 ? "s" : ""}`;
      splitter.className = "observablehq--string-expand";
      splitter.addEventListener("mouseup", function(event) {
        event.stopPropagation();
        replace(div, inspect$1(string2, shallow, true, name2));
      });
      return div;
    }
    const span2 = document.createElement("span");
    if (name2) span2.appendChild(inspectName(name2));
    const textValue2 = span2.appendChild(document.createElement("span"));
    textValue2.className = `observablehq--string${expanded ? " observablehq--expanded" : ""}`;
    textValue2.textContent = "`" + templatify(string2) + "`";
    return span2;
  }
  const span = document.createElement("span");
  if (name2) span.appendChild(inspectName(name2));
  const textValue = span.appendChild(document.createElement("span"));
  textValue.className = "observablehq--string";
  textValue.textContent = JSON.stringify(string2.length > 100 ? `${string2.slice(0, 50)}…${string2.slice(-49)}` : string2);
  return span;
}
function templatify(string2) {
  return string2.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, templatifyChar);
}
function templatifyChar(char) {
  var code2 = char.charCodeAt(0);
  switch (code2) {
    case 8:
      return "\\b";
    case 9:
      return "\\t";
    case 11:
      return "\\v";
    case 12:
      return "\\f";
    case 13:
      return "\\r";
  }
  return code2 < 16 ? "\\x0" + code2.toString(16) : code2 < 32 ? "\\x" + code2.toString(16) : "\\" + char;
}
function count(string2, re) {
  var n2 = 0;
  while (re.exec(string2)) ++n2;
  return n2;
}
var toString$2 = Function.prototype.toString, TYPE_ASYNC = { prefix: "async ƒ" }, TYPE_ASYNC_GENERATOR = { prefix: "async ƒ*" }, TYPE_CLASS = { prefix: "class" }, TYPE_FUNCTION = { prefix: "ƒ" }, TYPE_GENERATOR = { prefix: "ƒ*" };
function inspectFunction(f2, name2) {
  var type2, m2, t2 = toString$2.call(f2);
  switch (f2.constructor && f2.constructor.name) {
    case "AsyncFunction":
      type2 = TYPE_ASYNC;
      break;
    case "AsyncGeneratorFunction":
      type2 = TYPE_ASYNC_GENERATOR;
      break;
    case "GeneratorFunction":
      type2 = TYPE_GENERATOR;
      break;
    default:
      type2 = /^class\b/.test(t2) ? TYPE_CLASS : TYPE_FUNCTION;
      break;
  }
  if (type2 === TYPE_CLASS) {
    return formatFunction(type2, "", name2);
  }
  if (m2 = /^(?:async\s*)?(\w+)\s*=>/.exec(t2)) {
    return formatFunction(type2, "(" + m2[1] + ")", name2);
  }
  if (m2 = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(t2)) {
    return formatFunction(type2, m2[1] ? "(" + m2[1].replace(/\s*,\s*/g, ", ") + ")" : "()", name2);
  }
  if (m2 = /^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(t2)) {
    return formatFunction(type2, m2[1] ? "(" + m2[1].replace(/\s*,\s*/g, ", ") + ")" : "()", name2);
  }
  return formatFunction(type2, "(…)", name2);
}
function formatFunction(type2, args, cellname) {
  var span = document.createElement("span");
  span.className = "observablehq--function";
  if (cellname) {
    span.appendChild(inspectName(cellname));
  }
  var spanType = span.appendChild(document.createElement("span"));
  spanType.className = "observablehq--keyword";
  spanType.textContent = type2.prefix;
  span.appendChild(document.createTextNode(args));
  return span;
}
const { prototype: { toString: toString$1 } } = Object;
function inspect$1(value, shallow, expand, name2, proto) {
  let type2 = typeof value;
  switch (type2) {
    case "boolean":
    case "undefined": {
      value += "";
      break;
    }
    case "number": {
      value = value === 0 && 1 / value < 0 ? "-0" : value + "";
      break;
    }
    case "bigint": {
      value = value + "n";
      break;
    }
    case "symbol": {
      value = formatSymbol(value);
      break;
    }
    case "function": {
      return inspectFunction(value, name2);
    }
    case "string": {
      return formatString(value, shallow, expand, name2);
    }
    default: {
      if (value === null) {
        type2 = null, value = "null";
        break;
      }
      if (value instanceof Date) {
        type2 = "date", value = formatDate(value);
        break;
      }
      if (value === FORBIDDEN) {
        type2 = "forbidden", value = "[forbidden]";
        break;
      }
      switch (toString$1.call(value)) {
        case "[object RegExp]": {
          type2 = "regexp", value = formatRegExp$1(value);
          break;
        }
        case "[object Error]":
        case "[object DOMException]": {
          type2 = "error", value = formatError$1(value);
          break;
        }
        default:
          return (expand ? inspectExpanded : inspectCollapsed)(value, shallow, name2, proto);
      }
      break;
    }
  }
  const span = document.createElement("span");
  if (name2) span.appendChild(inspectName(name2));
  const n2 = span.appendChild(document.createElement("span"));
  n2.className = `observablehq--${type2}`;
  n2.textContent = value;
  return span;
}
function replace(spanOld, spanNew) {
  if (spanOld.classList.contains("observablehq--inspect")) spanNew.classList.add("observablehq--inspect");
  spanOld.parentNode.replaceChild(spanNew, spanOld);
  dispatch(spanNew, "load");
}
const LOCATION_MATCH = /\s+\(\d+:\d+\)$/m;
class Inspector {
  constructor(node2) {
    if (!node2) throw new Error("invalid node");
    this._node = node2;
    node2.classList.add("observablehq");
  }
  pending() {
    const { _node } = this;
    _node.classList.remove("observablehq--error");
    _node.classList.add("observablehq--running");
  }
  fulfilled(value, name2) {
    const { _node } = this;
    if (!isnode(value) || value.parentNode && value.parentNode !== _node) {
      value = inspect$1(value, false, _node.firstChild && _node.firstChild.classList && _node.firstChild.classList.contains("observablehq--expanded"), name2);
      value.classList.add("observablehq--inspect");
    }
    _node.classList.remove("observablehq--running", "observablehq--error");
    if (_node.firstChild !== value) {
      if (_node.firstChild) {
        while (_node.lastChild !== _node.firstChild) _node.removeChild(_node.lastChild);
        _node.replaceChild(value, _node.firstChild);
      } else {
        _node.appendChild(value);
      }
    }
    dispatch(_node, "update");
  }
  rejected(error, name2) {
    const { _node } = this;
    _node.classList.remove("observablehq--running");
    _node.classList.add("observablehq--error");
    while (_node.lastChild) _node.removeChild(_node.lastChild);
    var div = document.createElement("div");
    div.className = "observablehq--inspect";
    if (name2) div.appendChild(inspectName(name2));
    div.appendChild(document.createTextNode((error + "").replace(LOCATION_MATCH, "")));
    _node.appendChild(div);
    dispatch(_node, "error", { error });
  }
}
Inspector.into = function(container) {
  if (typeof container === "string") {
    container = document.querySelector(container);
    if (container == null) throw new Error("container not found");
  }
  return function() {
    return new Inspector(container.appendChild(document.createElement("div")));
  };
};
function isnode(value) {
  return (value instanceof Element || value instanceof Text) && value instanceof value.constructor;
}


const inspectorCSS = `
:root{--syntax_normal:#1b1e23;--syntax_comment:#a9b0bc;--syntax_number:#20a5ba;--syntax_keyword:#c30771;--syntax_atom:#10a778;--syntax_string:#008ec4;--syntax_error:#ffbedc;--syntax_unknown_variable:#838383;--syntax_known_variable:#005f87;--syntax_matchbracket:#20bbfc;--syntax_key:#6636b4;--mono_fonts:82%/1.5 Menlo,Consolas,monospace}
.observablehq--collapsed,.observablehq--expanded,.observablehq--function,.observablehq--gray,.observablehq--import,.observablehq--string:after,.observablehq--string:before{color:var(--syntax_normal)}
.observablehq--collapsed,.observablehq--inspect a{cursor:pointer}
.observablehq--field{text-indent:-1em;margin-left:1em}.observablehq--empty{color:var(--syntax_comment)}
.observablehq--blue,.observablehq--keyword{color:#3182bd}.observablehq--forbidden,.observablehq--pink{color:#e377c2}
.observablehq--orange{color:#e6550d}.observablehq--boolean,.observablehq--null,.observablehq--undefined{color:var(--syntax_atom)}
.observablehq--bigint,.observablehq--date,.observablehq--green,.observablehq--number,.observablehq--regexp,.observablehq--symbol{color:var(--syntax_number)}
.observablehq--index,.observablehq--key{color:var(--syntax_key)}.observablehq--prototype-key{color:#aaa}
.observablehq--empty{font-style:oblique}.observablehq--purple,.observablehq--string{color:var(--syntax_string)}
.observablehq--error,.observablehq--red{color:#e7040f}
.observablehq--inspect{font:var(--mono_fonts);display:block;white-space:pre}
.observablehq--error .observablehq--inspect{word-break:break-all;white-space:pre-wrap}
.observablehq--caret{margin-right:4px;vertical-align:baseline;}
`;

export function newInspector(data2, dom) {
  if (!document.head.querySelector("#inspector-css")) {
    const style = document.createElement("style");
    style.textContent = inspectorCSS;
    style.id = "inspector-css";
    document.head.appendChild(style);
  }
  const inspector = new Inspector(dom);
  inspector.fulfilled(data2);
  return inspector;
}
