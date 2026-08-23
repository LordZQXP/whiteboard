"use strict";

exports.__esModule = true;
exports["default"] = sanitizeCanvasJson;
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) { n[e] = r[e]; } return n; }
/**
 * Read-side defence for student-supplied canvas JSON.
 *
 * A student stores a fabric graph; the grading teacher's browser deserializes
 * it with `canvas.loadFromJSON`. The API refuses hostile graphs on write (see
 * `common/utils/canvas-json.util.ts` in stemboard-api), but rows written before
 * that shipped are already in the database and only this side can defend them.
 * The two carry the same rules deliberately — change them together.
 *
 * SECURITY_PENTEST_PREP.md Finding 29.
 *
 * This sanitizes rather than rejects: a teacher grading a submission is better
 * served by the legitimate remainder than by a blank canvas, and every rule
 * below drops something the whiteboard could not have produced anyway.
 */

/**
 * The only object types this whiteboard ever writes: `Line`, `Rect`,
 * `Ellipse`, `Triangle` and `Textbox` from the toolbar, `Path` from
 * `PencilBrush`, `Group` from grouping, and `Image` for the rendered PDF page
 * background. Anything else was injected.
 */
var ALLOWED_TYPES = ['rect', 'ellipse', 'triangle', 'line', 'textbox', 'path', 'group', 'image', 'activeselection'];

/**
 * `__proto__` at canvas level swaps the `StaticCanvas` instance's own
 * prototype, after which every method call throws for the rest of the session
 * — and the resize observer re-renders outside the load site's try/catch, so
 * it throws repeatedly (Finding 29.2).
 */
var FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

/** ~3000 nested groups exhausts the stack inside fabric's enliven step. */
var MAX_DEPTH = 20;

/** Returned in place of a node that must not reach fabric. */
var DROP = Symbol('drop');

/**
 * An `Image` `src` is the one field that makes the teacher's browser talk to a
 * host the student chose (Finding 29.1). The only image this whiteboard
 * creates is the PDF page background, set from a locally rendered `data:` URL,
 * so that plus same-origin relative paths is the whole legitimate surface.
 */
function isAllowedImageSrc(src) {
  if (typeof src !== 'string') return false;
  if (src.startsWith('data:image/')) return true;
  // `//evil.example` is protocol-relative, and therefore remote.
  return src.startsWith('/') && !src.startsWith('//');
}
function clean(node, depth) {
  if (node === null || typeof node !== 'object') return node;
  if (depth > MAX_DEPTH) return DROP;
  if (Array.isArray(node)) {
    var _out = [];
    for (var _iterator = _createForOfIteratorHelperLoose(node), _step; !(_step = _iterator()).done;) {
      var item = _step.value;
      var value = clean(item, depth + 1);
      if (value !== DROP) _out.push(value);
    }
    return _out;
  }
  if (typeof node.type === 'string') {
    var type = node.type.toLowerCase();
    if (!ALLOWED_TYPES.includes(type)) return DROP;
    if (type === 'image' && !isAllowedImageSrc(node.src)) return DROP;
  }
  var out = {};
  // `getOwnPropertyNames`, not a `for...in`: a `__proto__` produced by
  // `JSON.parse` is an own, enumerable property, but reading it back with dot
  // access would give the prototype instead of the payload.
  for (var _iterator2 = _createForOfIteratorHelperLoose(Object.getOwnPropertyNames(node)), _step2; !(_step2 = _iterator2()).done;) {
    var key = _step2.value;
    if (FORBIDDEN_KEYS.includes(key)) continue;
    var _value = clean(node[key], depth + 1);
    if (_value !== DROP) out[key] = _value;
  }
  return out;
}

/**
 * @param {unknown} json a stored canvas page, straight off the API.
 * @returns {unknown} a copy safe to hand to `loadFromJSON`. Never throws.
 */
function sanitizeCanvasJson(json) {
  var result = clean(json, 0);
  return result === DROP ? {} : result;
}