var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/jsondiffpatch/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  DiffPatcher: () => diffpatcher_default,
  clone: () => clone2,
  create: () => create,
  dateReviver: () => dateReviver,
  diff: () => diff,
  patch: () => patch,
  reverse: () => reverse,
  unpatch: () => unpatch
});

// node_modules/jsondiffpatch/lib/date-reviver.js
function dateReviver(_key, value) {
  var _a, _b, _c, _d, _e, _f;
  if (typeof value !== "string") {
    return value;
  }
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?(Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
  if (!parts) {
    return value;
  }
  return new Date(Date.UTC(Number.parseInt((_a = parts[1]) !== null && _a !== void 0 ? _a : "0", 10), Number.parseInt((_b = parts[2]) !== null && _b !== void 0 ? _b : "0", 10) - 1, Number.parseInt((_c = parts[3]) !== null && _c !== void 0 ? _c : "0", 10), Number.parseInt((_d = parts[4]) !== null && _d !== void 0 ? _d : "0", 10), Number.parseInt((_e = parts[5]) !== null && _e !== void 0 ? _e : "0", 10), Number.parseInt((_f = parts[6]) !== null && _f !== void 0 ? _f : "0", 10), (parts[7] ? Number.parseInt(parts[7]) : 0) || 0));
}

// node_modules/jsondiffpatch/lib/clone.js
function cloneRegExp(re) {
  var _a;
  const regexMatch = /^\/(.*)\/([gimyu]*)$/.exec(re.toString());
  if (!regexMatch) {
    throw new Error("Invalid RegExp");
  }
  return new RegExp((_a = regexMatch[1]) !== null && _a !== void 0 ? _a : "", regexMatch[2]);
}
function clone(arg) {
  if (typeof arg !== "object") {
    return arg;
  }
  if (arg === null) {
    return null;
  }
  if (Array.isArray(arg)) {
    return arg.map(clone);
  }
  if (arg instanceof Date) {
    return new Date(arg.getTime());
  }
  if (arg instanceof RegExp) {
    return cloneRegExp(arg);
  }
  const cloned = {};
  for (const name in arg) {
    if (Object.prototype.hasOwnProperty.call(arg, name)) {
      cloned[name] = clone(arg[name]);
    }
  }
  return cloned;
}

// node_modules/jsondiffpatch/lib/assertions/arrays.js
function assertNonEmptyArray(arr, message) {
  if (arr.length === 0) {
    throw new Error(message || "Expected a non-empty array");
  }
}
function assertArrayHasAtLeast2(arr, message) {
  if (arr.length < 2) {
    throw new Error(message || "Expected an array with at least 2 items");
  }
}
var lastNonEmpty = (arr) => arr[arr.length - 1];

// node_modules/jsondiffpatch/lib/contexts/context.js
var Context = class {
  setResult(result) {
    this.result = result;
    this.hasResult = true;
    return this;
  }
  exit() {
    this.exiting = true;
    return this;
  }
  push(child, name) {
    child.parent = this;
    if (typeof name !== "undefined") {
      child.childName = name;
    }
    child.root = this.root || this;
    child.options = child.options || this.options;
    if (!this.children) {
      this.children = [child];
      this.nextAfterChildren = this.next || null;
      this.next = child;
    } else {
      assertNonEmptyArray(this.children);
      lastNonEmpty(this.children).next = child;
      this.children.push(child);
    }
    child.next = this;
    return this;
  }
};

// node_modules/jsondiffpatch/lib/contexts/diff.js
var DiffContext = class extends Context {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
    this.pipe = "diff";
  }
  prepareDeltaResult(result) {
    var _a, _b, _c, _d;
    if (typeof result === "object") {
      if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.omitRemovedValues) && Array.isArray(result) && result.length > 1 && (result.length === 2 || // modified
      result[2] === 0 || // deleted
      result[2] === 3)) {
        result[0] = 0;
      }
      if ((_b = this.options) === null || _b === void 0 ? void 0 : _b.cloneDiffValues) {
        const clone3 = typeof ((_c = this.options) === null || _c === void 0 ? void 0 : _c.cloneDiffValues) === "function" ? (_d = this.options) === null || _d === void 0 ? void 0 : _d.cloneDiffValues : clone;
        if (typeof result[0] === "object") {
          result[0] = clone3(result[0]);
        }
        if (typeof result[1] === "object") {
          result[1] = clone3(result[1]);
        }
      }
    }
    return result;
  }
  setResult(result) {
    this.prepareDeltaResult(result);
    return super.setResult(result);
  }
};
var diff_default = DiffContext;

// node_modules/jsondiffpatch/lib/contexts/patch.js
var PatchContext = class extends Context {
  constructor(left, delta) {
    super();
    this.left = left;
    this.delta = delta;
    this.pipe = "patch";
  }
};
var patch_default = PatchContext;

// node_modules/jsondiffpatch/lib/contexts/reverse.js
var ReverseContext = class extends Context {
  constructor(delta) {
    super();
    this.delta = delta;
    this.pipe = "reverse";
  }
};
var reverse_default = ReverseContext;

// node_modules/jsondiffpatch/lib/pipe.js
var Pipe = class {
  constructor(name) {
    this.name = name;
    this.filters = [];
  }
  process(input) {
    if (!this.processor) {
      throw new Error("add this pipe to a processor before using it");
    }
    const debug = this.debug;
    const length = this.filters.length;
    const context = input;
    for (let index = 0; index < length; index++) {
      const filter = this.filters[index];
      if (!filter)
        continue;
      if (debug) {
        this.log(`filter: ${filter.filterName}`);
      }
      filter(context);
      if (typeof context === "object" && context.exiting) {
        context.exiting = false;
        break;
      }
    }
    if (!context.next && this.resultCheck) {
      this.resultCheck(context);
    }
  }
  log(msg) {
    console.log(`[jsondiffpatch] ${this.name} pipe, ${msg}`);
  }
  append(...args) {
    this.filters.push(...args);
    return this;
  }
  prepend(...args) {
    this.filters.unshift(...args);
    return this;
  }
  indexOf(filterName) {
    if (!filterName) {
      throw new Error("a filter name is required");
    }
    for (let index = 0; index < this.filters.length; index++) {
      const filter = this.filters[index];
      if ((filter === null || filter === void 0 ? void 0 : filter.filterName) === filterName) {
        return index;
      }
    }
    throw new Error(`filter not found: ${filterName}`);
  }
  list() {
    return this.filters.map((f) => f.filterName);
  }
  after(filterName, ...params) {
    const index = this.indexOf(filterName);
    this.filters.splice(index + 1, 0, ...params);
    return this;
  }
  before(filterName, ...params) {
    const index = this.indexOf(filterName);
    this.filters.splice(index, 0, ...params);
    return this;
  }
  replace(filterName, ...params) {
    const index = this.indexOf(filterName);
    this.filters.splice(index, 1, ...params);
    return this;
  }
  remove(filterName) {
    const index = this.indexOf(filterName);
    this.filters.splice(index, 1);
    return this;
  }
  clear() {
    this.filters.length = 0;
    return this;
  }
  shouldHaveResult(should) {
    if (should === false) {
      this.resultCheck = null;
      return this;
    }
    if (this.resultCheck) {
      return this;
    }
    this.resultCheck = (context) => {
      if (!context.hasResult) {
        console.log(context);
        const error = new Error(`${this.name} failed`);
        error.noResult = true;
        throw error;
      }
    };
    return this;
  }
};
var pipe_default = Pipe;

// node_modules/jsondiffpatch/lib/processor.js
var Processor = class {
  constructor(options) {
    this.selfOptions = options || {};
    this.pipes = {};
  }
  options(options) {
    if (options) {
      this.selfOptions = options;
    }
    return this.selfOptions;
  }
  pipe(name, pipeArg) {
    let pipe = pipeArg;
    if (typeof name === "string") {
      if (typeof pipe === "undefined") {
        return this.pipes[name];
      }
      this.pipes[name] = pipe;
    }
    if (name && name.name) {
      pipe = name;
      if (pipe.processor === this) {
        return pipe;
      }
      this.pipes[pipe.name] = pipe;
    }
    if (!pipe) {
      throw new Error(`pipe is not defined: ${name}`);
    }
    pipe.processor = this;
    return pipe;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  process(input, pipe) {
    let context = input;
    context.options = this.options();
    let nextPipe = pipe || input.pipe || "default";
    let lastPipe = void 0;
    while (nextPipe) {
      if (typeof context.nextAfterChildren !== "undefined") {
        context.next = context.nextAfterChildren;
        context.nextAfterChildren = null;
      }
      if (typeof nextPipe === "string") {
        nextPipe = this.pipe(nextPipe);
      }
      nextPipe.process(context);
      lastPipe = nextPipe;
      nextPipe = null;
      if (context) {
        if (context.next) {
          context = context.next;
          nextPipe = context.pipe || lastPipe;
        }
      }
    }
    return context.hasResult ? context.result : void 0;
  }
};
var processor_default = Processor;

// node_modules/jsondiffpatch/lib/filters/lcs.js
var defaultMatch = (array1, array2, index1, index2) => array1[index1] === array2[index2];
var lengthMatrix = (array1, array2, match, context) => {
  var _a, _b, _c;
  const len1 = array1.length;
  const len2 = array2.length;
  let x;
  let y;
  const matrix = new Array(len1 + 1);
  for (x = 0; x < len1 + 1; x++) {
    const matrixNewRow = new Array(len2 + 1);
    for (y = 0; y < len2 + 1; y++) {
      matrixNewRow[y] = 0;
    }
    matrix[x] = matrixNewRow;
  }
  matrix.match = match;
  for (x = 1; x < len1 + 1; x++) {
    const matrixRowX = matrix[x];
    if (matrixRowX === void 0) {
      throw new Error("LCS matrix row is undefined");
    }
    const matrixRowBeforeX = matrix[x - 1];
    if (matrixRowBeforeX === void 0) {
      throw new Error("LCS matrix row is undefined");
    }
    for (y = 1; y < len2 + 1; y++) {
      if (match(array1, array2, x - 1, y - 1, context)) {
        matrixRowX[y] = ((_a = matrixRowBeforeX[y - 1]) !== null && _a !== void 0 ? _a : 0) + 1;
      } else {
        matrixRowX[y] = Math.max((_b = matrixRowBeforeX[y]) !== null && _b !== void 0 ? _b : 0, (_c = matrixRowX[y - 1]) !== null && _c !== void 0 ? _c : 0);
      }
    }
  }
  return matrix;
};
var backtrack = (matrix, array1, array2, context) => {
  let index1 = array1.length;
  let index2 = array2.length;
  const subsequence = {
    sequence: [],
    indices1: [],
    indices2: []
  };
  while (index1 !== 0 && index2 !== 0) {
    if (matrix.match === void 0) {
      throw new Error("LCS matrix match function is undefined");
    }
    const sameLetter = matrix.match(array1, array2, index1 - 1, index2 - 1, context);
    if (sameLetter) {
      subsequence.sequence.unshift(array1[index1 - 1]);
      subsequence.indices1.unshift(index1 - 1);
      subsequence.indices2.unshift(index2 - 1);
      --index1;
      --index2;
    } else {
      const matrixRowIndex1 = matrix[index1];
      if (matrixRowIndex1 === void 0) {
        throw new Error("LCS matrix row is undefined");
      }
      const valueAtMatrixAbove = matrixRowIndex1[index2 - 1];
      if (valueAtMatrixAbove === void 0) {
        throw new Error("LCS matrix value is undefined");
      }
      const matrixRowBeforeIndex1 = matrix[index1 - 1];
      if (matrixRowBeforeIndex1 === void 0) {
        throw new Error("LCS matrix row is undefined");
      }
      const valueAtMatrixLeft = matrixRowBeforeIndex1[index2];
      if (valueAtMatrixLeft === void 0) {
        throw new Error("LCS matrix value is undefined");
      }
      if (valueAtMatrixAbove > valueAtMatrixLeft) {
        --index2;
      } else {
        --index1;
      }
    }
  }
  return subsequence;
};
var get = (array1, array2, match, context) => {
  const innerContext = context || {};
  const matrix = lengthMatrix(array1, array2, match || defaultMatch, innerContext);
  return backtrack(matrix, array1, array2, innerContext);
};
var lcs_default = {
  get
};

// node_modules/jsondiffpatch/lib/filters/arrays.js
var ARRAY_MOVE = 3;
function arraysHaveMatchByRef(array1, array2, len1, len2) {
  for (let index1 = 0; index1 < len1; index1++) {
    const val1 = array1[index1];
    for (let index2 = 0; index2 < len2; index2++) {
      const val2 = array2[index2];
      if (index1 !== index2 && val1 === val2) {
        return true;
      }
    }
  }
  return false;
}
function matchItems(array1, array2, index1, index2, context) {
  const value1 = array1[index1];
  const value2 = array2[index2];
  if (value1 === value2) {
    return true;
  }
  if (typeof value1 !== "object" || typeof value2 !== "object") {
    return false;
  }
  const objectHash = context.objectHash;
  if (!objectHash) {
    return context.matchByPosition && index1 === index2;
  }
  context.hashCache1 = context.hashCache1 || [];
  let hash1 = context.hashCache1[index1];
  if (typeof hash1 === "undefined") {
    context.hashCache1[index1] = hash1 = objectHash(value1, index1);
  }
  if (typeof hash1 === "undefined") {
    return false;
  }
  context.hashCache2 = context.hashCache2 || [];
  let hash2 = context.hashCache2[index2];
  if (typeof hash2 === "undefined") {
    context.hashCache2[index2] = hash2 = objectHash(value2, index2);
  }
  if (typeof hash2 === "undefined") {
    return false;
  }
  return hash1 === hash2;
}
var diffFilter = function arraysDiffFilter(context) {
  var _a, _b, _c, _d, _e;
  if (!context.leftIsArray) {
    return;
  }
  const matchContext = {
    objectHash: (_a = context.options) === null || _a === void 0 ? void 0 : _a.objectHash,
    matchByPosition: (_b = context.options) === null || _b === void 0 ? void 0 : _b.matchByPosition
  };
  let commonHead = 0;
  let commonTail = 0;
  let index;
  let index1;
  let index2;
  const array1 = context.left;
  const array2 = context.right;
  const len1 = array1.length;
  const len2 = array2.length;
  let child;
  if (len1 > 0 && len2 > 0 && !matchContext.objectHash && typeof matchContext.matchByPosition !== "boolean") {
    matchContext.matchByPosition = !arraysHaveMatchByRef(array1, array2, len1, len2);
  }
  while (commonHead < len1 && commonHead < len2 && matchItems(array1, array2, commonHead, commonHead, matchContext)) {
    index = commonHead;
    child = new diff_default(array1[index], array2[index]);
    context.push(child, index);
    commonHead++;
  }
  while (commonTail + commonHead < len1 && commonTail + commonHead < len2 && matchItems(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
    index1 = len1 - 1 - commonTail;
    index2 = len2 - 1 - commonTail;
    child = new diff_default(array1[index1], array2[index2]);
    context.push(child, index2);
    commonTail++;
  }
  let result;
  if (commonHead + commonTail === len1) {
    if (len1 === len2) {
      context.setResult(void 0).exit();
      return;
    }
    result = result || {
      _t: "a"
    };
    for (index = commonHead; index < len2 - commonTail; index++) {
      result[index] = [array2[index]];
      context.prepareDeltaResult(result[index]);
    }
    context.setResult(result).exit();
    return;
  }
  if (commonHead + commonTail === len2) {
    result = result || {
      _t: "a"
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      const key = `_${index}`;
      result[key] = [array1[index], 0, 0];
      context.prepareDeltaResult(result[key]);
    }
    context.setResult(result).exit();
    return;
  }
  matchContext.hashCache1 = void 0;
  matchContext.hashCache2 = void 0;
  const trimmed1 = array1.slice(commonHead, len1 - commonTail);
  const trimmed2 = array2.slice(commonHead, len2 - commonTail);
  const seq = lcs_default.get(trimmed1, trimmed2, matchItems, matchContext);
  const removedItems = [];
  result = result || {
    _t: "a"
  };
  for (index = commonHead; index < len1 - commonTail; index++) {
    if (seq.indices1.indexOf(index - commonHead) < 0) {
      const key = `_${index}`;
      result[key] = [array1[index], 0, 0];
      context.prepareDeltaResult(result[key]);
      removedItems.push(index);
    }
  }
  let detectMove = true;
  if (((_c = context.options) === null || _c === void 0 ? void 0 : _c.arrays) && context.options.arrays.detectMove === false) {
    detectMove = false;
  }
  let includeValueOnMove = false;
  if ((_e = (_d = context.options) === null || _d === void 0 ? void 0 : _d.arrays) === null || _e === void 0 ? void 0 : _e.includeValueOnMove) {
    includeValueOnMove = true;
  }
  const removedItemsLength = removedItems.length;
  for (index = commonHead; index < len2 - commonTail; index++) {
    const indexOnArray2 = seq.indices2.indexOf(index - commonHead);
    if (indexOnArray2 < 0) {
      let isMove = false;
      if (detectMove && removedItemsLength > 0) {
        for (let removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
          index1 = removedItems[removeItemIndex1];
          const resultItem = index1 === void 0 ? void 0 : result[`_${index1}`];
          if (index1 !== void 0 && resultItem && matchItems(trimmed1, trimmed2, index1 - commonHead, index - commonHead, matchContext)) {
            resultItem.splice(1, 2, index, ARRAY_MOVE);
            resultItem.splice(1, 2, index, ARRAY_MOVE);
            if (!includeValueOnMove) {
              resultItem[0] = "";
            }
            index2 = index;
            child = new diff_default(array1[index1], array2[index2]);
            context.push(child, index2);
            removedItems.splice(removeItemIndex1, 1);
            isMove = true;
            break;
          }
        }
      }
      if (!isMove) {
        result[index] = [array2[index]];
        context.prepareDeltaResult(result[index]);
      }
    } else {
      if (seq.indices1[indexOnArray2] === void 0) {
        throw new Error(`Invalid indexOnArray2: ${indexOnArray2}, seq.indices1: ${seq.indices1}`);
      }
      index1 = seq.indices1[indexOnArray2] + commonHead;
      if (seq.indices2[indexOnArray2] === void 0) {
        throw new Error(`Invalid indexOnArray2: ${indexOnArray2}, seq.indices2: ${seq.indices2}`);
      }
      index2 = seq.indices2[indexOnArray2] + commonHead;
      child = new diff_default(array1[index1], array2[index2]);
      context.push(child, index2);
    }
  }
  context.setResult(result).exit();
};
diffFilter.filterName = "arrays";
var compare = {
  numerically(a, b) {
    return a - b;
  },
  numericallyBy(name) {
    return (a, b) => a[name] - b[name];
  }
};
var patchFilter = function nestedPatchFilter(context) {
  var _a;
  if (!context.nested) {
    return;
  }
  const nestedDelta = context.delta;
  if (nestedDelta._t !== "a") {
    return;
  }
  let index;
  let index1;
  const delta = nestedDelta;
  const array = context.left;
  let toRemove = [];
  let toInsert = [];
  const toModify = [];
  for (index in delta) {
    if (index !== "_t") {
      if (index[0] === "_") {
        const removedOrMovedIndex = index;
        if (delta[removedOrMovedIndex] !== void 0 && (delta[removedOrMovedIndex][2] === 0 || delta[removedOrMovedIndex][2] === ARRAY_MOVE)) {
          toRemove.push(Number.parseInt(index.slice(1), 10));
        } else {
          throw new Error(`only removal or move can be applied at original array indices, invalid diff type: ${(_a = delta[removedOrMovedIndex]) === null || _a === void 0 ? void 0 : _a[2]}`);
        }
      } else {
        const numberIndex = index;
        if (delta[numberIndex].length === 1) {
          toInsert.push({
            index: Number.parseInt(numberIndex, 10),
            value: delta[numberIndex][0]
          });
        } else {
          toModify.push({
            index: Number.parseInt(numberIndex, 10),
            delta: delta[numberIndex]
          });
        }
      }
    }
  }
  toRemove = toRemove.sort(compare.numerically);
  for (index = toRemove.length - 1; index >= 0; index--) {
    index1 = toRemove[index];
    if (index1 === void 0)
      continue;
    const indexDiff = delta[`_${index1}`];
    const removedValue = array.splice(index1, 1)[0];
    if ((indexDiff === null || indexDiff === void 0 ? void 0 : indexDiff[2]) === ARRAY_MOVE) {
      toInsert.push({
        index: indexDiff[1],
        value: removedValue
      });
    }
  }
  toInsert = toInsert.sort(compare.numericallyBy("index"));
  const toInsertLength = toInsert.length;
  for (index = 0; index < toInsertLength; index++) {
    const insertion = toInsert[index];
    if (insertion === void 0)
      continue;
    array.splice(insertion.index, 0, insertion.value);
  }
  const toModifyLength = toModify.length;
  if (toModifyLength > 0) {
    for (index = 0; index < toModifyLength; index++) {
      const modification = toModify[index];
      if (modification === void 0)
        continue;
      const child = new patch_default(array[modification.index], modification.delta);
      context.push(child, modification.index);
    }
  }
  if (!context.children) {
    context.setResult(array).exit();
    return;
  }
  context.exit();
};
patchFilter.filterName = "arrays";
var collectChildrenPatchFilter = function collectChildrenPatchFilter2(context) {
  if (!context || !context.children) {
    return;
  }
  const deltaWithChildren = context.delta;
  if (deltaWithChildren._t !== "a") {
    return;
  }
  const array = context.left;
  const length = context.children.length;
  for (let index = 0; index < length; index++) {
    const child = context.children[index];
    if (child === void 0)
      continue;
    const arrayIndex = child.childName;
    array[arrayIndex] = child.result;
  }
  context.setResult(array).exit();
};
collectChildrenPatchFilter.filterName = "arraysCollectChildren";
var reverseFilter = function arraysReverseFilter(context) {
  if (!context.nested) {
    const nonNestedDelta = context.delta;
    if (nonNestedDelta[2] === ARRAY_MOVE) {
      const arrayMoveDelta = nonNestedDelta;
      context.newName = `_${arrayMoveDelta[1]}`;
      context.setResult([
        arrayMoveDelta[0],
        Number.parseInt(context.childName.substring(1), 10),
        ARRAY_MOVE
      ]).exit();
    }
    return;
  }
  const nestedDelta = context.delta;
  if (nestedDelta._t !== "a") {
    return;
  }
  const arrayDelta = nestedDelta;
  for (const name in arrayDelta) {
    if (name === "_t") {
      continue;
    }
    const child = new reverse_default(arrayDelta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter.filterName = "arrays";
var reverseArrayDeltaIndex = (delta, index, itemDelta) => {
  if (typeof index === "string" && index[0] === "_") {
    return Number.parseInt(index.substring(1), 10);
  }
  if (Array.isArray(itemDelta) && itemDelta[2] === 0) {
    return `_${index}`;
  }
  let reverseIndex = +index;
  for (const deltaIndex in delta) {
    const deltaItem = delta[deltaIndex];
    if (Array.isArray(deltaItem)) {
      if (deltaItem[2] === ARRAY_MOVE) {
        const moveFromIndex = Number.parseInt(deltaIndex.substring(1), 10);
        const moveToIndex = deltaItem[1];
        if (moveToIndex === +index) {
          return moveFromIndex;
        }
        if (moveFromIndex <= reverseIndex && moveToIndex > reverseIndex) {
          reverseIndex++;
        } else if (moveFromIndex >= reverseIndex && moveToIndex < reverseIndex) {
          reverseIndex--;
        }
      } else if (deltaItem[2] === 0) {
        const deleteIndex = Number.parseInt(deltaIndex.substring(1), 10);
        if (deleteIndex <= reverseIndex) {
          reverseIndex++;
        }
      } else if (deltaItem.length === 1 && Number.parseInt(deltaIndex, 10) <= reverseIndex) {
        reverseIndex--;
      }
    }
  }
  return reverseIndex;
};
var collectChildrenReverseFilter = (context) => {
  if (!context || !context.children) {
    return;
  }
  const deltaWithChildren = context.delta;
  if (deltaWithChildren._t !== "a") {
    return;
  }
  const arrayDelta = deltaWithChildren;
  const length = context.children.length;
  const delta = {
    _t: "a"
  };
  for (let index = 0; index < length; index++) {
    const child = context.children[index];
    if (child === void 0)
      continue;
    let name = child.newName;
    if (typeof name === "undefined") {
      if (child.childName === void 0) {
        throw new Error("child.childName is undefined");
      }
      name = reverseArrayDeltaIndex(arrayDelta, child.childName, child.result);
    }
    if (delta[name] !== child.result) {
      delta[name] = child.result;
    }
  }
  context.setResult(delta).exit();
};
collectChildrenReverseFilter.filterName = "arraysCollectChildren";

// node_modules/jsondiffpatch/lib/filters/dates.js
var diffFilter2 = function datesDiffFilter(context) {
  if (context.left instanceof Date) {
    if (context.right instanceof Date) {
      if (context.left.getTime() !== context.right.getTime()) {
        context.setResult([context.left, context.right]);
      } else {
        context.setResult(void 0);
      }
    } else {
      context.setResult([context.left, context.right]);
    }
    context.exit();
  } else if (context.right instanceof Date) {
    context.setResult([context.left, context.right]).exit();
  }
};
diffFilter2.filterName = "dates";

// node_modules/jsondiffpatch/lib/filters/nested.js
var collectChildrenDiffFilter = (context) => {
  if (!context || !context.children) {
    return;
  }
  const length = context.children.length;
  let result = context.result;
  for (let index = 0; index < length; index++) {
    const child = context.children[index];
    if (child === void 0)
      continue;
    if (typeof child.result === "undefined") {
      continue;
    }
    result = result || {};
    if (child.childName === void 0) {
      throw new Error("diff child.childName is undefined");
    }
    result[child.childName] = child.result;
  }
  if (result && context.leftIsArray) {
    result._t = "a";
  }
  context.setResult(result).exit();
};
collectChildrenDiffFilter.filterName = "collectChildren";
var objectsDiffFilter = (context) => {
  var _a;
  if (context.leftIsArray || context.leftType !== "object") {
    return;
  }
  const left = context.left;
  const right = context.right;
  const propertyFilter = (_a = context.options) === null || _a === void 0 ? void 0 : _a.propertyFilter;
  for (const name in left) {
    if (!Object.prototype.hasOwnProperty.call(left, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    const child = new diff_default(left[name], right[name]);
    context.push(child, name);
  }
  for (const name in right) {
    if (!Object.prototype.hasOwnProperty.call(right, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    if (typeof left[name] === "undefined") {
      const child = new diff_default(void 0, right[name]);
      context.push(child, name);
    }
  }
  if (!context.children || context.children.length === 0) {
    context.setResult(void 0).exit();
    return;
  }
  context.exit();
};
objectsDiffFilter.filterName = "objects";
var patchFilter2 = function nestedPatchFilter2(context) {
  if (!context.nested) {
    return;
  }
  const nestedDelta = context.delta;
  if (nestedDelta._t) {
    return;
  }
  const objectDelta = nestedDelta;
  for (const name in objectDelta) {
    const child = new patch_default(context.left[name], objectDelta[name]);
    context.push(child, name);
  }
  context.exit();
};
patchFilter2.filterName = "objects";
var collectChildrenPatchFilter3 = function collectChildrenPatchFilter4(context) {
  if (!context || !context.children) {
    return;
  }
  const deltaWithChildren = context.delta;
  if (deltaWithChildren._t) {
    return;
  }
  const object = context.left;
  const length = context.children.length;
  for (let index = 0; index < length; index++) {
    const child = context.children[index];
    if (child === void 0)
      continue;
    const property = child.childName;
    if (Object.prototype.hasOwnProperty.call(context.left, property) && child.result === void 0) {
      delete object[property];
    } else if (object[property] !== child.result) {
      object[property] = child.result;
    }
  }
  context.setResult(object).exit();
};
collectChildrenPatchFilter3.filterName = "collectChildren";
var reverseFilter2 = function nestedReverseFilter(context) {
  if (!context.nested) {
    return;
  }
  const nestedDelta = context.delta;
  if (nestedDelta._t) {
    return;
  }
  const objectDelta = context.delta;
  for (const name in objectDelta) {
    const child = new reverse_default(objectDelta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter2.filterName = "objects";
var collectChildrenReverseFilter2 = (context) => {
  if (!context || !context.children) {
    return;
  }
  const deltaWithChildren = context.delta;
  if (deltaWithChildren._t) {
    return;
  }
  const length = context.children.length;
  const delta = {};
  for (let index = 0; index < length; index++) {
    const child = context.children[index];
    if (child === void 0)
      continue;
    const property = child.childName;
    if (delta[property] !== child.result) {
      delta[property] = child.result;
    }
  }
  context.setResult(delta).exit();
};
collectChildrenReverseFilter2.filterName = "collectChildren";

// node_modules/jsondiffpatch/lib/filters/texts.js
var TEXT_DIFF = 2;
var DEFAULT_MIN_LENGTH = 60;
var cachedDiffPatch = null;
function getDiffMatchPatch(options, required) {
  var _a;
  if (!cachedDiffPatch) {
    let instance;
    if ((_a = options === null || options === void 0 ? void 0 : options.textDiff) === null || _a === void 0 ? void 0 : _a.diffMatchPatch) {
      instance = new options.textDiff.diffMatchPatch();
    } else {
      if (!required) {
        return null;
      }
      const error = new Error("The diff-match-patch library was not provided. Pass the library in through the options or use the `jsondiffpatch/with-text-diffs` entry-point.");
      error.diff_match_patch_not_found = true;
      throw error;
    }
    cachedDiffPatch = {
      diff: (txt1, txt2) => instance.patch_toText(instance.patch_make(txt1, txt2)),
      patch: (txt1, patch2) => {
        const results = instance.patch_apply(instance.patch_fromText(patch2), txt1);
        for (const resultOk of results[1]) {
          if (!resultOk) {
            const error = new Error("text patch failed");
            error.textPatchFailed = true;
            throw error;
          }
        }
        return results[0];
      }
    };
  }
  return cachedDiffPatch;
}
var diffFilter3 = function textsDiffFilter(context) {
  var _a, _b;
  if (context.leftType !== "string") {
    return;
  }
  const left = context.left;
  const right = context.right;
  const minLength = ((_b = (_a = context.options) === null || _a === void 0 ? void 0 : _a.textDiff) === null || _b === void 0 ? void 0 : _b.minLength) || DEFAULT_MIN_LENGTH;
  if (left.length < minLength || right.length < minLength) {
    context.setResult([left, right]).exit();
    return;
  }
  const diffMatchPatch = getDiffMatchPatch(context.options);
  if (!diffMatchPatch) {
    context.setResult([left, right]).exit();
    return;
  }
  const diff2 = diffMatchPatch.diff;
  context.setResult([diff2(left, right), 0, TEXT_DIFF]).exit();
};
diffFilter3.filterName = "texts";
var patchFilter3 = function textsPatchFilter(context) {
  if (context.nested) {
    return;
  }
  const nonNestedDelta = context.delta;
  if (nonNestedDelta[2] !== TEXT_DIFF) {
    return;
  }
  const textDiffDelta = nonNestedDelta;
  const patch2 = getDiffMatchPatch(context.options, true).patch;
  context.setResult(patch2(context.left, textDiffDelta[0])).exit();
};
patchFilter3.filterName = "texts";
var textDeltaReverse = (delta) => {
  var _a, _b, _c;
  const headerRegex = /^@@ +-(\d+),(\d+) +\+(\d+),(\d+) +@@$/;
  const lines = delta.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === void 0)
      continue;
    const lineStart = line.slice(0, 1);
    if (lineStart === "@") {
      const header = headerRegex.exec(line);
      if (header !== null) {
        const lineHeader = i;
        lines[lineHeader] = `@@ -${header[3]},${header[4]} +${header[1]},${header[2]} @@`;
      }
    } else if (lineStart === "+") {
      lines[i] = `-${(_a = lines[i]) === null || _a === void 0 ? void 0 : _a.slice(1)}`;
      if (((_b = lines[i - 1]) === null || _b === void 0 ? void 0 : _b.slice(0, 1)) === "+") {
        const lineTmp = lines[i];
        lines[i] = lines[i - 1];
        lines[i - 1] = lineTmp;
      }
    } else if (lineStart === "-") {
      lines[i] = `+${(_c = lines[i]) === null || _c === void 0 ? void 0 : _c.slice(1)}`;
    }
  }
  return lines.join("\n");
};
var reverseFilter3 = function textsReverseFilter(context) {
  if (context.nested) {
    return;
  }
  const nonNestedDelta = context.delta;
  if (nonNestedDelta[2] !== TEXT_DIFF) {
    return;
  }
  const textDiffDelta = nonNestedDelta;
  context.setResult([textDeltaReverse(textDiffDelta[0]), 0, TEXT_DIFF]).exit();
};
reverseFilter3.filterName = "texts";

// node_modules/jsondiffpatch/lib/filters/trivial.js
var diffFilter4 = function trivialMatchesDiffFilter(context) {
  if (context.left === context.right) {
    context.setResult(void 0).exit();
    return;
  }
  if (typeof context.left === "undefined") {
    if (typeof context.right === "function") {
      throw new Error("functions are not supported");
    }
    context.setResult([context.right]).exit();
    return;
  }
  if (typeof context.right === "undefined") {
    context.setResult([context.left, 0, 0]).exit();
    return;
  }
  if (typeof context.left === "function" || typeof context.right === "function") {
    throw new Error("functions are not supported");
  }
  context.leftType = context.left === null ? "null" : typeof context.left;
  context.rightType = context.right === null ? "null" : typeof context.right;
  if (context.leftType !== context.rightType) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === "boolean" || context.leftType === "number") {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === "object") {
    context.leftIsArray = Array.isArray(context.left);
  }
  if (context.rightType === "object") {
    context.rightIsArray = Array.isArray(context.right);
  }
  if (context.leftIsArray !== context.rightIsArray) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.left instanceof RegExp) {
    if (context.right instanceof RegExp) {
      context.setResult([context.left.toString(), context.right.toString()]).exit();
    } else {
      context.setResult([context.left, context.right]).exit();
    }
  }
};
diffFilter4.filterName = "trivial";
var patchFilter4 = function trivialMatchesPatchFilter(context) {
  if (typeof context.delta === "undefined") {
    context.setResult(context.left).exit();
    return;
  }
  context.nested = !Array.isArray(context.delta);
  if (context.nested) {
    return;
  }
  const nonNestedDelta = context.delta;
  if (nonNestedDelta.length === 1) {
    context.setResult(nonNestedDelta[0]).exit();
    return;
  }
  if (nonNestedDelta.length === 2) {
    if (context.left instanceof RegExp) {
      const regexArgs = /^\/(.*)\/([gimyu]+)$/.exec(nonNestedDelta[1]);
      if (regexArgs === null || regexArgs === void 0 ? void 0 : regexArgs[1]) {
        context.setResult(new RegExp(regexArgs[1], regexArgs[2])).exit();
        return;
      }
    }
    context.setResult(nonNestedDelta[1]).exit();
    return;
  }
  if (nonNestedDelta.length === 3 && nonNestedDelta[2] === 0) {
    context.setResult(void 0).exit();
  }
};
patchFilter4.filterName = "trivial";
var reverseFilter4 = function trivialReferseFilter(context) {
  if (typeof context.delta === "undefined") {
    context.setResult(context.delta).exit();
    return;
  }
  context.nested = !Array.isArray(context.delta);
  if (context.nested) {
    return;
  }
  const nonNestedDelta = context.delta;
  if (nonNestedDelta.length === 1) {
    context.setResult([nonNestedDelta[0], 0, 0]).exit();
    return;
  }
  if (nonNestedDelta.length === 2) {
    context.setResult([nonNestedDelta[1], nonNestedDelta[0]]).exit();
    return;
  }
  if (nonNestedDelta.length === 3 && nonNestedDelta[2] === 0) {
    context.setResult([nonNestedDelta[0]]).exit();
  }
};
reverseFilter4.filterName = "trivial";

// node_modules/jsondiffpatch/lib/diffpatcher.js
var DiffPatcher = class {
  constructor(options) {
    this.processor = new processor_default(options);
    this.processor.pipe(new pipe_default("diff").append(collectChildrenDiffFilter, diffFilter4, diffFilter2, diffFilter3, objectsDiffFilter, diffFilter).shouldHaveResult());
    this.processor.pipe(new pipe_default("patch").append(collectChildrenPatchFilter3, collectChildrenPatchFilter, patchFilter4, patchFilter3, patchFilter2, patchFilter).shouldHaveResult());
    this.processor.pipe(new pipe_default("reverse").append(collectChildrenReverseFilter2, collectChildrenReverseFilter, reverseFilter4, reverseFilter3, reverseFilter2, reverseFilter).shouldHaveResult());
  }
  options(options) {
    return this.processor.options(options);
  }
  diff(left, right) {
    return this.processor.process(new diff_default(left, right));
  }
  patch(left, delta) {
    return this.processor.process(new patch_default(left, delta));
  }
  reverse(delta) {
    return this.processor.process(new reverse_default(delta));
  }
  unpatch(right, delta) {
    return this.patch(right, this.reverse(delta));
  }
  clone(value) {
    return clone(value);
  }
};
var diffpatcher_default = DiffPatcher;

// node_modules/jsondiffpatch/lib/index.js
function create(options) {
  return new diffpatcher_default(options);
}
var defaultInstance;
function diff(left, right) {
  if (!defaultInstance) {
    defaultInstance = new diffpatcher_default();
  }
  return defaultInstance.diff(left, right);
}
function patch(left, delta) {
  if (!defaultInstance) {
    defaultInstance = new diffpatcher_default();
  }
  return defaultInstance.patch(left, delta);
}
function unpatch(right, delta) {
  if (!defaultInstance) {
    defaultInstance = new diffpatcher_default();
  }
  return defaultInstance.unpatch(right, delta);
}
function reverse(delta) {
  if (!defaultInstance) {
    defaultInstance = new diffpatcher_default();
  }
  return defaultInstance.reverse(delta);
}
function clone2(value) {
  if (!defaultInstance) {
    defaultInstance = new diffpatcher_default();
  }
  return defaultInstance.clone(value);
}

// node_modules/jsondiffpatch/lib/formatters/html.js
var html_exports = {};
__export(html_exports, {
  default: () => html_default,
  format: () => format,
  hideUnchanged: () => hideUnchanged,
  showUnchanged: () => showUnchanged
});

// node_modules/jsondiffpatch/lib/formatters/base.js
var BaseFormatter = class {
  format(delta, left) {
    const context = {};
    this.prepareContext(context);
    const preparedContext = context;
    this.recurse(preparedContext, delta, left);
    return this.finalize(preparedContext);
  }
  prepareContext(context) {
    context.buffer = [];
    context.out = function(...args) {
      if (!this.buffer) {
        throw new Error("context buffer is not initialized");
      }
      this.buffer.push(...args);
    };
  }
  typeFormattterNotFound(_context, deltaType) {
    throw new Error(`cannot format delta type: ${deltaType}`);
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  typeFormattterErrorFormatter(_context, _err, _delta, _leftValue, _key, _leftKey, _movedFrom) {
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
  finalize({ buffer }) {
    if (Array.isArray(buffer)) {
      return buffer.join("");
    }
    return "";
  }
  recurse(context, delta, left, key, leftKey, movedFrom, isLast) {
    const useMoveOriginHere = delta && movedFrom;
    const leftValue = useMoveOriginHere ? movedFrom.value : left;
    if (typeof delta === "undefined" && typeof key === "undefined") {
      return void 0;
    }
    const type = this.getDeltaType(delta, movedFrom);
    const nodeType = type === "node" ? delta._t === "a" ? "array" : "object" : "";
    if (typeof key !== "undefined") {
      this.nodeBegin(context, key, leftKey, type, nodeType, isLast !== null && isLast !== void 0 ? isLast : false);
    } else {
      this.rootBegin(context, type, nodeType);
    }
    let typeFormattter;
    try {
      typeFormattter = type !== "unknown" ? this[`format_${type}`] : this.typeFormattterNotFound(context, type);
      typeFormattter.call(this, context, delta, leftValue, key, leftKey, movedFrom);
    } catch (err) {
      this.typeFormattterErrorFormatter(context, err, delta, leftValue, key, leftKey, movedFrom);
      if (typeof console !== "undefined" && console.error) {
        console.error(err.stack);
      }
    }
    if (typeof key !== "undefined") {
      this.nodeEnd(context, key, leftKey, type, nodeType, isLast !== null && isLast !== void 0 ? isLast : false);
    } else {
      this.rootEnd(context, type, nodeType);
    }
  }
  formatDeltaChildren(context, delta, left) {
    this.forEachDeltaKey(delta, left, (key, leftKey, movedFrom, isLast) => {
      this.recurse(context, delta[key], left ? left[leftKey] : void 0, key, leftKey, movedFrom, isLast);
    });
  }
  forEachDeltaKey(delta, left, fn) {
    const keys = [];
    const arrayKeys = delta._t === "a";
    if (!arrayKeys) {
      const deltaKeys = Object.keys(delta);
      if (typeof left === "object" && left !== null) {
        keys.push(...Object.keys(left));
      }
      for (const key of deltaKeys) {
        if (keys.indexOf(key) >= 0)
          continue;
        keys.push(key);
      }
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (key === void 0)
          continue;
        const isLast = index === keys.length - 1;
        fn(
          // for object diff, the delta key and left key are the same
          key,
          key,
          // there's no "move" in object diff
          void 0,
          isLast
        );
      }
      return;
    }
    const movedFrom = {};
    for (const key in delta) {
      if (Object.prototype.hasOwnProperty.call(delta, key)) {
        const value = delta[key];
        if (Array.isArray(value) && value[2] === 3) {
          const movedDelta = value;
          movedFrom[movedDelta[1]] = Number.parseInt(key.substring(1));
        }
      }
    }
    const arrayDelta = delta;
    let leftIndex = 0;
    let rightIndex = 0;
    const leftArray = Array.isArray(left) ? left : void 0;
    const leftLength = leftArray ? leftArray.length : (
      // if we don't have the original array,
      // use a length that ensures we'll go thru all delta keys
      Object.keys(arrayDelta).reduce((max, key) => {
        if (key === "_t")
          return max;
        const isLeftKey = key.substring(0, 1) === "_";
        if (isLeftKey) {
          const itemDelta = arrayDelta[key];
          const leftIndex3 = Number.parseInt(key.substring(1));
          const rightIndex3 = Array.isArray(itemDelta) && itemDelta.length >= 3 && itemDelta[2] === 3 ? itemDelta[1] : void 0;
          const maxIndex2 = Math.max(leftIndex3, rightIndex3 !== null && rightIndex3 !== void 0 ? rightIndex3 : 0);
          return maxIndex2 > max ? maxIndex2 : max;
        }
        const rightIndex2 = Number.parseInt(key);
        const leftIndex2 = movedFrom[rightIndex2];
        const maxIndex = Math.max(leftIndex2 !== null && leftIndex2 !== void 0 ? leftIndex2 : 0, rightIndex2 !== null && rightIndex2 !== void 0 ? rightIndex2 : 0);
        return maxIndex > max ? maxIndex : max;
      }, 0) + 1
    );
    let rightLength = leftLength;
    let previousFnArgs;
    const addKey = (...args) => {
      if (previousFnArgs) {
        fn(...previousFnArgs);
      }
      previousFnArgs = args;
    };
    const flushLastKey = () => {
      if (!previousFnArgs) {
        return;
      }
      fn(previousFnArgs[0], previousFnArgs[1], previousFnArgs[2], true);
    };
    while (leftIndex < leftLength || rightIndex < rightLength || `${rightIndex}` in arrayDelta) {
      let hasDelta = false;
      const leftIndexKey = `_${leftIndex}`;
      const rightIndexKey = `${rightIndex}`;
      const movedFromIndex = rightIndex in movedFrom ? movedFrom[rightIndex] : void 0;
      if (leftIndexKey in arrayDelta) {
        hasDelta = true;
        const itemDelta = arrayDelta[leftIndexKey];
        addKey(leftIndexKey, movedFromIndex !== null && movedFromIndex !== void 0 ? movedFromIndex : leftIndex, movedFromIndex ? {
          key: `_${movedFromIndex}`,
          value: leftArray ? leftArray[movedFromIndex] : void 0
        } : void 0, false);
        if (Array.isArray(itemDelta)) {
          if (itemDelta[2] === 0) {
            rightLength--;
            leftIndex++;
          } else if (itemDelta[2] === 3) {
            leftIndex++;
          } else {
            leftIndex++;
          }
        } else {
          leftIndex++;
        }
      }
      if (rightIndexKey in arrayDelta) {
        hasDelta = true;
        const itemDelta = arrayDelta[rightIndexKey];
        const isItemAdded = Array.isArray(itemDelta) && itemDelta.length === 1;
        addKey(rightIndexKey, movedFromIndex !== null && movedFromIndex !== void 0 ? movedFromIndex : leftIndex, movedFromIndex ? {
          key: `_${movedFromIndex}`,
          value: leftArray ? leftArray[movedFromIndex] : void 0
        } : void 0, false);
        if (isItemAdded) {
          rightLength++;
          rightIndex++;
        } else if (movedFromIndex === void 0) {
          leftIndex++;
          rightIndex++;
        } else {
          rightIndex++;
        }
      }
      if (!hasDelta) {
        if (leftArray && movedFromIndex === void 0 || this.includeMoveDestinations !== false) {
          addKey(rightIndexKey, movedFromIndex !== null && movedFromIndex !== void 0 ? movedFromIndex : leftIndex, movedFromIndex ? {
            key: `_${movedFromIndex}`,
            value: leftArray ? leftArray[movedFromIndex] : void 0
          } : void 0, false);
        }
        if (movedFromIndex !== void 0) {
          rightIndex++;
        } else {
          leftIndex++;
          rightIndex++;
        }
      }
    }
    flushLastKey();
  }
  getDeltaType(delta, movedFrom) {
    if (typeof delta === "undefined") {
      if (typeof movedFrom !== "undefined") {
        return "movedestination";
      }
      return "unchanged";
    }
    if (Array.isArray(delta)) {
      if (delta.length === 1) {
        return "added";
      }
      if (delta.length === 2) {
        return "modified";
      }
      if (delta.length === 3 && delta[2] === 0) {
        return "deleted";
      }
      if (delta.length === 3 && delta[2] === 2) {
        return "textdiff";
      }
      if (delta.length === 3 && delta[2] === 3) {
        return "moved";
      }
    } else if (typeof delta === "object") {
      return "node";
    }
    return "unknown";
  }
  parseTextDiff(value) {
    var _a;
    const output = [];
    const lines = value.split("\n@@ ");
    for (const line of lines) {
      const lineOutput = {
        pieces: []
      };
      const location = (_a = /^(?:@@ )?[-+]?(\d+),(\d+)/.exec(line)) === null || _a === void 0 ? void 0 : _a.slice(1);
      if (!location) {
        throw new Error("invalid text diff format");
      }
      assertArrayHasAtLeast2(location);
      lineOutput.location = {
        line: location[0],
        chr: location[1]
      };
      const pieces = line.split("\n").slice(1);
      for (let pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
        const piece = pieces[pieceIndex];
        if (piece === void 0 || !piece.length) {
          continue;
        }
        const pieceOutput = {
          type: "context"
        };
        if (piece.substring(0, 1) === "+") {
          pieceOutput.type = "added";
        } else if (piece.substring(0, 1) === "-") {
          pieceOutput.type = "deleted";
        }
        pieceOutput.text = piece.slice(1);
        lineOutput.pieces.push(pieceOutput);
      }
      output.push(lineOutput);
    }
    return output;
  }
};
var base_default = BaseFormatter;

// node_modules/jsondiffpatch/lib/formatters/html.js
var HtmlFormatter = class extends base_default {
  typeFormattterErrorFormatter(context, err) {
    const message = typeof err === "object" && err !== null && "message" in err && typeof err.message === "string" ? err.message : String(err);
    context.out(`<pre class="jsondiffpatch-error">${htmlEscape(message)}</pre>`);
  }
  formatValue(context, value) {
    const valueAsHtml = typeof value === "undefined" ? "undefined" : htmlEscape(JSON.stringify(value, null, 2));
    context.out(`<pre>${valueAsHtml}</pre>`);
  }
  formatTextDiffString(context, value) {
    const lines = this.parseTextDiff(value);
    context.out('<ul class="jsondiffpatch-textdiff">');
    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i];
      if (line === void 0)
        return;
      context.out(`<li><div class="jsondiffpatch-textdiff-location"><span class="jsondiffpatch-textdiff-line-number">${line.location.line}</span><span class="jsondiffpatch-textdiff-char">${line.location.chr}</span></div><div class="jsondiffpatch-textdiff-line">`);
      const pieces = line.pieces;
      for (let pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
        const piece = pieces[pieceIndex];
        if (piece === void 0)
          return;
        context.out(`<span class="jsondiffpatch-textdiff-${piece.type}">${htmlEscape(decodeURI(piece.text))}</span>`);
      }
      context.out("</div></li>");
    }
    context.out("</ul>");
  }
  rootBegin(context, type, nodeType) {
    const nodeClass = `jsondiffpatch-${type}${nodeType ? ` jsondiffpatch-child-node-type-${nodeType}` : ""}`;
    context.out(`<div class="jsondiffpatch-delta ${nodeClass}">`);
  }
  rootEnd(context) {
    context.out(`</div>${context.hasArrows ? `<script type="text/javascript">setTimeout(${adjustArrows.toString()},10);<\/script>` : ""}`);
  }
  nodeBegin(context, key, leftKey, type, nodeType) {
    const nodeClass = `jsondiffpatch-${type}${nodeType ? ` jsondiffpatch-child-node-type-${nodeType}` : ""}`;
    const label = typeof leftKey === "number" && key.substring(0, 1) === "_" ? key.substring(1) : key;
    context.out(`<li class="${nodeClass}" data-key="${htmlEscape(key)}"><div class="jsondiffpatch-property-name">${htmlEscape(label)}</div>`);
  }
  nodeEnd(context) {
    context.out("</li>");
  }
  format_unchanged(context, _delta, left) {
    if (typeof left === "undefined") {
      return;
    }
    context.out('<div class="jsondiffpatch-value">');
    this.formatValue(context, left);
    context.out("</div>");
  }
  format_movedestination(context, _delta, left) {
    if (typeof left === "undefined") {
      return;
    }
    context.out('<div class="jsondiffpatch-value">');
    this.formatValue(context, left);
    context.out("</div>");
  }
  format_node(context, delta, left) {
    const nodeType = delta._t === "a" ? "array" : "object";
    context.out(`<ul class="jsondiffpatch-node jsondiffpatch-node-type-${nodeType}">`);
    this.formatDeltaChildren(context, delta, left);
    context.out("</ul>");
  }
  format_added(context, delta) {
    context.out('<div class="jsondiffpatch-value">');
    this.formatValue(context, delta[0]);
    context.out("</div>");
  }
  format_modified(context, delta) {
    context.out('<div class="jsondiffpatch-value jsondiffpatch-left-value">');
    this.formatValue(context, delta[0]);
    context.out('</div><div class="jsondiffpatch-value jsondiffpatch-right-value">');
    this.formatValue(context, delta[1]);
    context.out("</div>");
  }
  format_deleted(context, delta) {
    context.out('<div class="jsondiffpatch-value">');
    this.formatValue(context, delta[0]);
    context.out("</div>");
  }
  format_moved(context, delta) {
    context.out('<div class="jsondiffpatch-value">');
    this.formatValue(context, delta[0]);
    context.out(`</div><div class="jsondiffpatch-moved-destination">${delta[1]}</div>`);
    context.out(
      /* jshint multistr: true */
      `<div class="jsondiffpatch-arrow" style="position: relative; left: -34px;">
          <svg width="30" height="60" style="position: absolute; display: none;">
          <defs>
              <marker id="markerArrow" markerWidth="8" markerHeight="8"
                 refx="2" refy="4" stroke="#88f"
                     orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M1,1 L1,7 L7,4 L1,1" style="fill: #339;" />
              </marker>
          </defs>
          <path d="M30,0 Q-10,25 26,50"
            style="stroke: #88f; stroke-width: 2px; fill: none; stroke-opacity: 0.5; marker-end: url(#markerArrow);"
          ></path>
          </svg>
      </div>`
    );
    context.hasArrows = true;
  }
  format_textdiff(context, delta) {
    context.out('<div class="jsondiffpatch-value">');
    this.formatTextDiffString(context, delta[0]);
    context.out("</div>");
  }
};
function htmlEscape(value) {
  if (typeof value === "number")
    return value;
  let html = String(value);
  const replacements = [
    [/&/g, "&amp;"],
    [/</g, "&lt;"],
    [/>/g, "&gt;"],
    [/'/g, "&apos;"],
    [/"/g, "&quot;"]
  ];
  for (const replacement of replacements) {
    html = html.replace(replacement[0], replacement[1]);
  }
  return html;
}
var adjustArrows = function jsondiffpatchHtmlFormatterAdjustArrows(nodeArg) {
  const node = nodeArg || document;
  const getElementText = ({ textContent, innerText }) => textContent || innerText;
  const eachByQuery = (el, query, fn) => {
    const elems = el.querySelectorAll(query);
    for (let i = 0, l = elems.length; i < l; i++) {
      fn(elems[i]);
    }
  };
  const eachChildren = ({ children }, fn) => {
    for (let i = 0, l = children.length; i < l; i++) {
      const element = children[i];
      if (!element)
        continue;
      fn(element, i);
    }
  };
  eachByQuery(node, ".jsondiffpatch-arrow", ({ parentNode, children, style }) => {
    const arrowParent = parentNode;
    const svg = children[0];
    const path = svg.children[1];
    svg.style.display = "none";
    const moveDestinationElem = arrowParent.querySelector(".jsondiffpatch-moved-destination");
    if (!(moveDestinationElem instanceof HTMLElement))
      return;
    const destination = getElementText(moveDestinationElem);
    const container = arrowParent.parentNode;
    if (!container)
      return;
    let destinationElem;
    eachChildren(container, (child) => {
      if (child.getAttribute("data-key") === destination) {
        destinationElem = child;
      }
    });
    if (!destinationElem) {
      return;
    }
    try {
      const distance = destinationElem.offsetTop - arrowParent.offsetTop;
      svg.setAttribute("height", `${Math.abs(distance) + 6}`);
      style.top = `${-8 + (distance > 0 ? 0 : distance)}px`;
      const curve = distance > 0 ? `M30,0 Q-10,${Math.round(distance / 2)} 26,${distance - 4}` : `M30,${-distance} Q-10,${Math.round(-distance / 2)} 26,4`;
      path.setAttribute("d", curve);
      svg.style.display = "";
    } catch (err) {
      console.debug(`[jsondiffpatch] error adjusting arrows: ${err}`);
    }
  });
};
var showUnchanged = (show, node, delay) => {
  const el = node || document.body;
  const prefix = "jsondiffpatch-unchanged-";
  const classes = {
    showing: `${prefix}showing`,
    hiding: `${prefix}hiding`,
    visible: `${prefix}visible`,
    hidden: `${prefix}hidden`
  };
  const list = el.classList;
  if (!list) {
    return;
  }
  if (!delay) {
    list.remove(classes.showing);
    list.remove(classes.hiding);
    list.remove(classes.visible);
    list.remove(classes.hidden);
    if (show === false) {
      list.add(classes.hidden);
    }
    return;
  }
  if (show === false) {
    list.remove(classes.showing);
    list.add(classes.visible);
    setTimeout(() => {
      list.add(classes.hiding);
    }, 10);
  } else {
    list.remove(classes.hiding);
    list.add(classes.showing);
    list.remove(classes.hidden);
  }
  const intervalId = setInterval(() => {
    adjustArrows(el);
  }, 100);
  setTimeout(() => {
    list.remove(classes.showing);
    list.remove(classes.hiding);
    if (show === false) {
      list.add(classes.hidden);
      list.remove(classes.visible);
    } else {
      list.add(classes.visible);
      list.remove(classes.hidden);
    }
    setTimeout(() => {
      list.remove(classes.visible);
      clearInterval(intervalId);
    }, delay + 400);
  }, delay);
};
var hideUnchanged = (node, delay) => showUnchanged(false, node, delay);
var html_default = HtmlFormatter;
var defaultInstance2;
function format(delta, left) {
  if (!defaultInstance2) {
    defaultInstance2 = new HtmlFormatter();
  }
  return defaultInstance2.format(delta, left);
}
export {
  html_exports as htmlFormatter,
  lib_exports as jsondiffpatch
};
//# sourceMappingURL=jsondiffpatch.js.map
