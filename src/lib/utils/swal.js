import Swal from 'sweetalert2';

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

const DANGER_COLOR = '#d33';
const CONFIRM_COLOR = '#3085d6';

/**
 * Translate the legacy `buttons` option into SweetAlert2 button params.
 *
 * - undefined / false : OK only (a plain alert)
 * - true              : Cancel + OK
 * - [cancel, confirm] : custom labels; a falsy first entry hides Cancel
 */
function resolveButtons(buttons) {
  if (buttons === undefined || buttons === false) {
    return { showCancelButton: false };
  }
  if (buttons === true) {
    return { showCancelButton: true, cancelButtonText: 'Cancel', confirmButtonText: 'OK' };
  }
  if (Array.isArray(buttons)) {
    const [cancel, confirm] = buttons;
    return {
      showCancelButton: Boolean(cancel),
      cancelButtonText: cancel || 'Cancel',
      confirmButtonText: confirm || 'OK'
    };
  }
  return { showCancelButton: true };
}

/**
 * Translate the legacy `content` option.
 *
 * Two shapes are used here: a raw DOM element (rendered as the popup body) and
 * `{ element: 'input', attributes: {...} }` (a prompt). Returns the SweetAlert2
 * params plus whether the popup resolves to an input value.
 */
function resolveContent(content) {
  if (!content) return { params: {}, isPrompt: false };

  if (content instanceof HTMLElement) {
    return { params: { html: content }, isPrompt: false };
  }

  if (content.element === 'input') {
    const attributes = content.attributes || {};
    const { placeholder, value, type, ...rest } = attributes;
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

  return { params: {}, isPrompt: false };
}

/**
 * @param {string|object} titleOrOptions - alert title, or the options object
 * @param {string} [text]
 * @param {string} [icon] - success | error | warning | info
 * @returns {Promise<true|string|null>} `null` when dismissed or cancelled, the
 *   typed value for a prompt, otherwise `true` -- matching legacy `sweetalert`.
 */
export default function swal(titleOrOptions, text, icon) {
  const options =
    typeof titleOrOptions === 'string' || titleOrOptions === undefined
      ? { title: titleOrOptions, text, icon }
      : titleOrOptions || {};

  // `customClass` and `className` carried legacy-only styling hooks that no
  // stylesheet in this app defines, so they are dropped rather than mapped.
  const { title, text: bodyText, icon: bodyIcon, buttons, dangerMode, content, timer } = options;

  const { params: contentParams, isPrompt } = resolveContent(content);

  return Swal.fire({
    title,
    // A prompt renders its own input, so `text` stays as text; otherwise a DOM
    // `content` element takes over the body and `text` would fight with it.
    ...(contentParams.html && bodyText ? {} : { text: bodyText }),
    icon: bodyIcon || undefined,
    timer,
    ...resolveButtons(buttons),
    ...contentParams,
    confirmButtonColor: dangerMode ? DANGER_COLOR : CONFIRM_COLOR,
    reverseButtons: true
  }).then((result) => {
    if (!result.isConfirmed) return null;
    return isPrompt ? result.value : true;
  });
}
