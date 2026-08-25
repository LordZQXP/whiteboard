"use strict";

exports.__esModule = true;
exports["default"] = swal;
var _sweetalert = _interopRequireDefault(require("sweetalert2"));
var _excluded = ["placeholder", "value", "type"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) { ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } } return n; }, _extends.apply(null, arguments); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) { if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } } return t; }
// Drop-in replacement for the legacy `sweetalert` (v2) default export, backed
// by SweetAlert2.
//
// Why: `sweetalert` is unmaintained (last release 2018) and its webpack-built
// dist carries a `global` polyfill that calls `Function("return this")()` and
// `eval("this")`, which a strict `script-src` CSP blocks. The calls sit inside
// a try/catch so nothing actually breaks, but every page load logs a
// Content-Security-Policy violation. SweetAlert2 is eval-free.
//
// This shim keeps the existing `swal(...)` call sites unchanged. It covers the
// subset of the old API this codebase uses -- positional alerts, `buttons`,
// `dangerMode`, and `content` -- not the whole legacy surface.

var DANGER_COLOR = '#d33';
var CONFIRM_COLOR = '#3085d6';

/**
 * Translate the legacy `buttons` option into SweetAlert2 button params.
 *
 * - undefined / false : OK only (a plain alert)
 * - true              : Cancel + OK
 * - [cancel, confirm] : custom labels; a falsy first entry hides Cancel
 */
function resolveButtons(buttons) {
  if (buttons === undefined || buttons === false) {
    return {
      showCancelButton: false
    };
  }
  if (buttons === true) {
    return {
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'OK'
    };
  }
  if (Array.isArray(buttons)) {
    var cancel = buttons[0],
      confirm = buttons[1];
    return {
      showCancelButton: Boolean(cancel),
      cancelButtonText: cancel || 'Cancel',
      confirmButtonText: confirm || 'OK'
    };
  }
  return {
    showCancelButton: true
  };
}

/**
 * Translate the legacy `content` option.
 *
 * Two shapes are used here: a raw DOM element (rendered as the popup body) and
 * `{ element: 'input', attributes: {...} }` (a prompt). Returns the SweetAlert2
 * params plus whether the popup resolves to an input value.
 */
function resolveContent(content) {
  if (!content) return {
    params: {},
    isPrompt: false
  };
  if (content instanceof HTMLElement) {
    return {
      params: {
        html: content
      },
      isPrompt: false
    };
  }
  if (content.element === 'input') {
    var attributes = content.attributes || {};
    var placeholder = attributes.placeholder,
      value = attributes.value,
      type = attributes.type,
      rest = _objectWithoutPropertiesLoose(attributes, _excluded);
    return {
      params: {
        input: type || 'text',
        inputPlaceholder: placeholder || '',
        inputValue: value || '',
        inputAttributes: rest
      },
      isPrompt: true
    };
  }
  return {
    params: {},
    isPrompt: false
  };
}

/**
 * @param {string|object} titleOrOptions - alert title, or the options object
 * @param {string} [text]
 * @param {string} [icon] - success | error | warning | info
 * @returns {Promise<true|string|null>} `null` when dismissed or cancelled, the
 *   typed value for a prompt, otherwise `true` -- matching legacy `sweetalert`.
 */
function swal(titleOrOptions, text, icon) {
  var options = typeof titleOrOptions === 'string' || titleOrOptions === undefined ? {
    title: titleOrOptions,
    text: text,
    icon: icon
  } : titleOrOptions || {};

  // `customClass` and `className` carried legacy-only styling hooks that no
  // stylesheet in this app defines, so they are dropped rather than mapped.
  var title = options.title,
    bodyText = options.text,
    bodyIcon = options.icon,
    buttons = options.buttons,
    dangerMode = options.dangerMode,
    content = options.content,
    timer = options.timer;
  var _resolveContent = resolveContent(content),
    contentParams = _resolveContent.params,
    isPrompt = _resolveContent.isPrompt;
  return _sweetalert["default"].fire(_extends({
    title: title
  }, contentParams.html && bodyText ? {} : {
    text: bodyText
  }, {
    icon: bodyIcon || undefined,
    timer: timer
  }, resolveButtons(buttons), contentParams, {
    confirmButtonColor: dangerMode ? DANGER_COLOR : CONFIRM_COLOR,
    reverseButtons: true
  })).then(function (result) {
    if (!result.isConfirmed) return null;
    return isPrompt ? result.value : true;
  });
}