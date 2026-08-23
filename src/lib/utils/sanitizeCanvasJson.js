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
const ALLOWED_TYPES = [
  'rect',
  'ellipse',
  'triangle',
  'line',
  'textbox',
  'path',
  'group',
  'image',
  'activeselection',
];

/**
 * `__proto__` at canvas level swaps the `StaticCanvas` instance's own
 * prototype, after which every method call throws for the rest of the session
 * — and the resize observer re-renders outside the load site's try/catch, so
 * it throws repeatedly (Finding 29.2).
 */
const FORBIDDEN_KEYS = ['__proto__', 'constructor', 'prototype'];

/** ~3000 nested groups exhausts the stack inside fabric's enliven step. */
const MAX_DEPTH = 20;

/** Returned in place of a node that must not reach fabric. */
const DROP = Symbol('drop');

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
    const out = [];
    for (const item of node) {
      const value = clean(item, depth + 1);
      if (value !== DROP) out.push(value);
    }
    return out;
  }

  if (typeof node.type === 'string') {
    const type = node.type.toLowerCase();
    if (!ALLOWED_TYPES.includes(type)) return DROP;
    if (type === 'image' && !isAllowedImageSrc(node.src)) return DROP;
  }

  const out = {};
  // `getOwnPropertyNames`, not a `for...in`: a `__proto__` produced by
  // `JSON.parse` is an own, enumerable property, but reading it back with dot
  // access would give the prototype instead of the payload.
  for (const key of Object.getOwnPropertyNames(node)) {
    if (FORBIDDEN_KEYS.includes(key)) continue;
    const value = clean(node[key], depth + 1);
    if (value !== DROP) out[key] = value;
  }
  return out;
}

/**
 * @param {unknown} json a stored canvas page, straight off the API.
 * @returns {unknown} a copy safe to hand to `loadFromJSON`. Never throws.
 */
export default function sanitizeCanvasJson(json) {
  const result = clean(json, 0);
  return result === DROP ? {} : result;
}
