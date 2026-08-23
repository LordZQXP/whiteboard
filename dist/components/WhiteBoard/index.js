"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var fabric = _interopRequireWildcard(require("fabric"));
var _cursors = _interopRequireDefault(require("./cursors"));
var _sanitizeCanvasJson = _interopRequireDefault(require("../../utils/sanitizeCanvasJson"));
var _eraser = _interopRequireDefault(require("./images/eraser.svg"));
var _paintBucket = _interopRequireDefault(require("./images/paint-bucket.svg"));
var _pencil = _interopRequireDefault(require("./images/pencil.svg"));
var _undo = _interopRequireDefault(require("./images/undo.svg"));
var _redo = _interopRequireDefault(require("./images/redo.svg"));
var _check = _interopRequireDefault(require("./images/check.svg"));
var _checkDisabled = _interopRequireDefault(require("./images/check-disabled.svg"));
var _reviseDisabled = _interopRequireDefault(require("./images/revise-disabled.svg"));
var _revise = _interopRequireDefault(require("./images/revise.svg"));
var _assignment = _interopRequireDefault(require("./images/assignment.svg"));
var _left = _interopRequireDefault(require("./images/left.svg"));
var _right = _interopRequireDefault(require("./images/right.svg"));
var _indexModule = _interopRequireDefault(require("./index.module.scss"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _SpeedDial = _interopRequireDefault(require("@mui/material/SpeedDial"));
var _SpeedDialAction = _interopRequireDefault(require("@mui/material/SpeedDialAction"));
var _SpeedDialIcon = _interopRequireDefault(require("@mui/material/SpeedDialIcon"));
var _stroke = _interopRequireDefault(require("./images/stroke.svg"));
var _Slider = _interopRequireDefault(require("./components/Slider"));
var _PdfCanvas = _interopRequireDefault(require("../PdfCanvas"));
var _sweetalert = _interopRequireDefault(require("sweetalert"));
var _StyledSnackbar = _interopRequireDefault(require("./components/StyledSnackbar"));
var _zoomIn = _interopRequireDefault(require("./images/zoom-in.svg"));
var _zoomOut = _interopRequireDefault(require("./images/zoom-out.svg"));
var _pan = _interopRequireDefault(require("./images/pan.svg"));
var _line = _interopRequireDefault(require("./images/line.svg"));
var _rectangle = _interopRequireDefault(require("./images/rectangle.svg"));
var _circle = _interopRequireDefault(require("./images/circle.svg"));
var _triangle = _interopRequireDefault(require("./images/triangle.svg"));
var _font = _interopRequireDefault(require("./images/font.svg"));
var _OpenWith = _interopRequireDefault(require("@mui/icons-material/OpenWith"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) { "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); } return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) { ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } } return n; }, _extends.apply(null, arguments); }
function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { "throw": 1, "return": 2, "break": 3, "continue": 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, "catch": function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(typeof e + " is not iterable"); }
function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) { r.unshift(t); } return function e() { for (; r.length;) { if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; } return e.done = !0, e; }; }
function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var drawInstance = null;
var origX;
var origY;
var mouseDown = false;
var isPanning = false;
var lastPosX, lastPosY;
var options = {
  currentMode: '',
  currentColor: '#000000',
  currentWidth: 5,
  fill: false,
  group: {}
};
var backUpCanvas = [];
var backupIndex = 0;
var modes = {
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  ERASER: 'ERASER',
  PANNING: 'PANNING'
};
var initCanvas = function initCanvas(width, height) {
  var canvas = new fabric.Canvas('canvas', {
    height: height,
    width: width
  });
  Object.assign(fabric.InteractiveFabricObject.ownDefaults, {
    transparentCorners: false,
    cornerStyle: 'circle',
    borderColor: '#4447A9',
    cornerColor: '#4447A9',
    cornerSize: 6,
    padding: 10,
    borderDashArray: [5, 5]
  });
  // fabric 6+ no longer creates a default freeDrawingBrush.
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.on('object:added', function (e) {
    e.target.on('mousedown', removeObject(canvas));
  });
  canvas.on('path:created', function (e) {
    backUpCanvas = [];
    e.path.on('mousedown', removeObject(canvas));
  });
  return canvas;
};
function removeObject(canvas) {
  return function (e) {
    if (options.currentMode === modes.ERASER) {
      pushToBackUp(canvas);
      canvas.remove(e.target);
    }
  };
}
function stopDrawing() {
  mouseDown = false;
}
function removeCanvasListener(canvas) {
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  canvas.off('mouse:up');
  canvas.off('mouse:wheel');
  var touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  //const mouse = window.matchMedia('(pointer:fine)').matches;

  if (touch) {
    if (startHandler) {
      canvas.upperCanvasEl.removeEventListener('touchstart', startHandler);
      startHandler = null;
    }
    if (moveHandler) {
      canvas.upperCanvasEl.removeEventListener('touchmove', startHandler);
      moveHandler = null;
    }
    if (endHandler) {
      canvas.upperCanvasEl.removeEventListener('touchend', endHandler);
      endHandler = null;
    }
  }
}

/*  ==== line  ==== */
function createLine(canvas) {
  if (modes.currentMode !== modes.LINE) {
    options.currentMode = modes.LINE;
    removeCanvasListener(canvas);
    canvas.on('mouse:down', startAddLine(canvas));
    canvas.on('mouse:move', startDrawingLine(canvas));
    canvas.on('mouse:up', stopDrawing);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}
function startAddLine(canvas) {
  return function (_ref) {
    var e = _ref.e;
    mouseDown = true;
    var pointer = canvas.getScenePoint(e);
    drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.currentWidth,
      stroke: options.currentColor,
      selectable: false
    });
    canvas.add(drawInstance);
    backUpCanvas = [];
    canvas.requestRenderAll();
  };
}
function startDrawingLine(canvas) {
  return function (_ref2) {
    var e = _ref2.e;
    if (mouseDown) {
      var pointer = canvas.getScenePoint(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y
      });
      drawInstance.setCoords();
      canvas.requestRenderAll();
    }
  };
}

/* ==== rectangle ==== */
function createRect(canvas) {
  if (options.currentMode !== modes.RECTANGLE) {
    options.currentMode = modes.RECTANGLE;
    removeCanvasListener(canvas);
    canvas.on('mouse:down', startAddRect(canvas));
    canvas.on('mouse:move', startDrawingRect(canvas));
    canvas.on('mouse:up', stopDrawing);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}
function startAddRect(canvas) {
  return function (_ref3) {
    var e = _ref3.e;
    mouseDown = true;
    var pointer = canvas.getScenePoint(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false
    });
    canvas.add(drawInstance);
    backUpCanvas = [];
    drawInstance.on('mousedown', function (e) {
      if (options.currentMode === modes.ERASER) {
        canvas.remove(e.target);
      }
    });
  };
}
function startDrawingRect(canvas) {
  return function (_ref4) {
    var e = _ref4.e;
    if (mouseDown) {
      var pointer = canvas.getScenePoint(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY)
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

/* ==== Ellipse ==== */
function createEllipse(canvas) {
  if (options.currentMode !== modes.ELLIPSE) {
    options.currentMode = modes.ELLIPSE;
    removeCanvasListener(canvas);
    canvas.on('mouse:down', startAddEllipse(canvas));
    canvas.on('mouse:move', startDrawingEllipse(canvas));
    canvas.on('mouse:up', stopDrawing);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(function (item) {
      return item.set({
        selectable: false
      });
    });
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}
function togglePanning(canvas) {
  if (options.currentMode !== modes.PANNING) {
    options.currentMode = modes.PANNING;
    removeCanvasListener(canvas);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    var touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    //const mouse = window.matchMedia('(pointer:fine)').matches;

    if (!touch) {
      canvas.on('mouse:down', function (opt) {
        var evt = opt.e;
        if (evt.button === 0) {
          // Left mouse button
          isPanning = true;
          canvas.selection = false;
          lastPosX = evt.clientX;
          lastPosY = evt.clientY;
        }
      });
      canvas.on('mouse:move', function (opt) {
        if (isPanning) {
          var e = opt.e;
          var vpt = canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;
          canvas.requestRenderAll();
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        }
      });
      canvas.on('mouse:up', function () {
        isPanning = false;
        canvas.selection = true;
      });
    } else {
      startHandler = createTouchStartHandler(canvas);
      canvas.upperCanvasEl.addEventListener('touchstart', startHandler);
      moveHandler = createTouchMoveHandler(canvas);
      canvas.upperCanvasEl.addEventListener('touchmove', moveHandler, {
        passive: false
      });
      endHandler = createTouchEndHandler(canvas);
      canvas.upperCanvasEl.addEventListener('touchend', endHandler);
    }
  } else {
    removeCanvasListener(canvas);
    draw(canvas);
  }
}
var startHandler = null;
var moveHandler = null;
var endHandler = null;
var createTouchStartHandler = function createTouchStartHandler(canvas) {
  return function (e) {
    if (e.touches.length === 1) {
      var touch = e.touches[0];
      isPanning = true;
      canvas.selection = false;
      lastPosX = touch.clientX;
      lastPosY = touch.clientY;
    }
  };
};
var createTouchMoveHandler = function createTouchMoveHandler(canvas) {
  return function (e) {
    if (!isPanning || e.touches.length !== 1) return;
    var touch = e.touches[0];
    var vpt = canvas.viewportTransform;
    vpt[4] += touch.clientX - lastPosX;
    vpt[5] += touch.clientY - lastPosY;
    canvas.requestRenderAll();
    lastPosX = touch.clientX;
    lastPosY = touch.clientY;
  };
};
var createTouchEndHandler = function createTouchEndHandler(canvas) {
  return function (e) {
    isPanning = false;
    canvas.selection = true;
  };
};
function startAddEllipse(canvas) {
  return function (_ref5) {
    var e = _ref5.e;
    mouseDown = true;
    var pointer = canvas.getScenePoint(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Ellipse({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      cornerSize: 7,
      objectCaching: false,
      selectable: false
    });
    canvas.add(drawInstance);
    backUpCanvas = [];
  };
}
function startDrawingEllipse(canvas) {
  return function (_ref6) {
    var e = _ref6.e;
    if (mouseDown) {
      var pointer = canvas.getScenePoint(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        rx: Math.abs(pointer.x - origX) / 2,
        ry: Math.abs(pointer.y - origY) / 2
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

/* === triangle === */
function createTriangle(canvas) {
  removeCanvasListener(canvas);
  canvas.on('mouse:down', startAddTriangle(canvas));
  canvas.on('mouse:move', startDrawingTriangle(canvas));
  canvas.on('mouse:up', stopDrawing);
  canvas.selection = false;
  canvas.hoverCursor = 'auto';
  canvas.isDrawingMode = false;
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}
function startAddTriangle(canvas) {
  return function (_ref7) {
    var e = _ref7.e;
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;
    var pointer = canvas.getScenePoint(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Triangle({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false
    });
    canvas.add(drawInstance);
    backUpCanvas = [];
  };
}
function startDrawingTriangle(canvas) {
  return function (_ref8) {
    var e = _ref8.e;
    if (mouseDown) {
      var pointer = canvas.getScenePoint(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY)
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}
function changeToErasingMode(canvas) {
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  options.currentMode = modes.ERASER;
  canvas.hoverCursor = "url(" + (0, _cursors["default"])({
    type: 'eraser'
  }) + "), default";
}
function canvasObjectsSize(canvas) {
  return canvas.getObjects().length;
}
function onSelectMode(canvas) {
  options.currentMode = '';
  canvas.isDrawingMode = false;
  removeCanvasListener(canvas);
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: true
    });
  });
  canvas.hoverCursor = 'all-scroll';
}
function clearCanvas(canvas) {
  canvas.getObjects().forEach(function (item) {
    if (item !== canvas.backgroundImage) {
      canvas.remove(item);
    }
  });
}
function clearCanvasNextPage(canvas) {
  canvas.getObjects().forEach(function (item) {
    canvas.remove(item);
  });
}
function pushToBackUp(canvas) {
  if (canvasObjectsSize(canvas) === 0) return;
  backUpCanvas[backupIndex] = canvas.toJSON();
  backupIndex++;
}
function popFromBackUp() {
  if (backupIndex - 1 >= 0) {
    backupIndex--;
    return backUpCanvas[backupIndex];
  }
}
function draw(canvas) {
  removeCanvasListener(canvas);
  options.currentMode = modes.PENCIL;
  canvas.freeDrawingBrush.width = parseInt(options.currentWidth, 10) || 1;
  canvas.freeDrawingBrush.color = options.currentColor;
  canvas.isDrawingMode = true;
}
function remove(canvas) {
  options.currentMode = '';
  canvas.isDrawingMode = false;
  removeCanvasListener(canvas);
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.hoverCursor = 'all-scroll';
}
function createText(canvas) {
  options.currentMode = 'TEXT';
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  canvas.selection = false;
  canvas.hoverCursor = 'text';
  canvas.defaultCursor = 'text';
  canvas.getObjects().map(function (item) {
    return item.set({
      selectable: false
    });
  });
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  var placeText = function placeText(opt) {
    if (opt.target) return;
    var pointer = canvas.getScenePoint(opt.e);
    var text = new fabric.Textbox('text', {
      left: pointer.x,
      top: pointer.y,
      fill: options.currentColor,
      editable: true
    });
    canvas.add(text);
    backUpCanvas = [];
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.renderAll();
  };
  canvas.on('mouse:down', placeText);
}
function handleResize(callback) {
  var resize_ob = new ResizeObserver(callback);
  return resize_ob;
}
function resizeCanvas(canvas, whiteboard) {
  return function () {
    var ratio = canvas.getWidth() / canvas.getHeight();
    var whiteboardWidth = whiteboard.clientWidth;
    var scale = whiteboardWidth / canvas.getWidth();
    var zoom = canvas.getZoom() * scale;
    canvas.setDimensions({
      width: whiteboardWidth,
      height: whiteboardWidth / ratio
    });
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}
var Whiteboard = function Whiteboard(_ref9) {
  var _color$, _json$historyIndex, _json$historyIndex$ob;
  var _ref9$aspectRatio = _ref9.aspectRatio,
    aspectRatio = _ref9$aspectRatio === void 0 ? 4 / 3 : _ref9$aspectRatio,
    setFiles = _ref9.setFiles,
    color = _ref9.color,
    setJSON = _ref9.setJSON,
    json = _ref9.json,
    pdfUrl = _ref9.pdfUrl,
    revision = _ref9.revision,
    setJSONScreenWidth = _ref9.setJSONScreenWidth,
    resend = _ref9.resend,
    jsonScreenWidth = _ref9.jsonScreenWidth,
    _ref9$pdf = _ref9.pdf,
    pdf = _ref9$pdf === void 0 ? undefined : _ref9$pdf,
    setResendFiles = _ref9.setResendFiles,
    buttonFlag = _ref9.buttonFlag,
    initialPdfViewer = _ref9.initialPdfViewer;
  var _useState = (0, _react.useState)((_color$ = color[0]) == null ? void 0 : _color$.color),
    currColor = _useState[0],
    setCurrColor = _useState[1];
  var _useState2 = (0, _react.useState)(null),
    canvas = _useState2[0],
    setCanvas = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    submitPdf = _useState3[0],
    setSubmitPdf = _useState3[1];
  var _useState4 = (0, _react.useState)({}),
    pages = _useState4[0],
    setPages = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    canvasPage = _useState5[0],
    setCanvasPage = _useState5[1];
  var _useState6 = (0, _react.useState)(0),
    index = _useState6[0],
    setIndex = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    disableButtons = _useState7[0],
    setDisableButtons = _useState7[1];
  var _useState8 = (0, _react.useState)(0),
    historyIndex = _useState8[0],
    setHistoryIndex = _useState8[1];
  var _useState9 = (0, _react.useState)(((_json$historyIndex = json[historyIndex]) == null ? void 0 : (_json$historyIndex$ob = _json$historyIndex.object) == null ? void 0 : _json$historyIndex$ob.length) || 0),
    totalPages = _useState9[0],
    setTotalPages = _useState9[1];
  var _React$useState = _react["default"].useState(initialPdfViewer !== undefined ? initialPdfViewer : buttonFlag),
    pdfViewer = _React$useState[0],
    setPdfViewer = _React$useState[1];
  var _React$useState2 = _react["default"].useState(878),
    canvasOriginalWidth = _React$useState2[0],
    setCanvasOriginalWidth = _React$useState2[1];
  var _useState0 = (0, _react.useState)({
      xPos: 'center',
      yPos: 'bottom',
      title: '',
      status: 'success'
    }),
    snackbarData = _useState0[0],
    setSnackBarData = _useState0[1];
  var _useState1 = (0, _react.useState)(false),
    openSnack = _useState1[0],
    setOpenSnack = _useState1[1];
  var handleClick = function handleClick() {
    setOpenSnack(true);
  };
  var handleCloseSnack = function handleCloseSnack(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  var _useState10 = (0, _react.useState)({
      file: pdf,
      totalPages: null,
      currentPageNumber: 1,
      currentPage: ''
    }),
    fileCanvasInfo = _useState10[0],
    setFileCanvasInfo = _useState10[1];
  var canvasRef = (0, _react.useRef)(null);
  var whiteboardRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (!canvas && canvasRef.current) {
      var _canvas = initCanvas(whiteboardRef.current.clientWidth, whiteboardRef.current.clientWidth / aspectRatio);
      setCanvas(function () {
        return _canvas;
      });
      handleResize(resizeCanvas(_canvas, whiteboardRef.current)).observe(whiteboardRef.current);
      setCanvasOriginalWidth(_canvas.width);
    }
  }, [canvasRef]);
  (0, _react.useEffect)(function () {
    var fetchImg = /*#__PURE__*/function () {
      var _ref0 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                clearCanvas(canvas);
                backUpCanvas = [];
                if (!(canvasPage[index] !== undefined)) {
                  _context.next = 10;
                  break;
                }
                _context.next = 6;
                return canvas.loadFromJSON(canvasPage[index]);
              case 6:
                canvas.setZoom(canvasOriginalWidth / json[historyIndex].screen);
                canvas.renderAll();
                _context.next = 14;
                break;
              case 10:
                _context.next = 12;
                return canvas.loadFromJSON((0, _sanitizeCanvasJson["default"])(json[historyIndex].object[index]), function (o, object) {
                  object.set('selectable', false);
                  object.set('evented', false);
                });
              case 12:
                canvas.setZoom(canvasOriginalWidth / json[historyIndex].screen);
                canvas.renderAll();
              case 14:
                _context.next = 19;
                break;
              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 16]]);
      }));
      return function fetchImg() {
        return _ref0.apply(this, arguments);
      };
    }();
    if (json && canvas && !pdfViewer) {
      clearCanvas(canvas);
      setIndex(0);
      fetchImg();
    }
  }, [json, canvas, pdfViewer]);
  function changeCurrentWidth(value) {
    var intValue = parseInt(value);
    options.currentWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
  }
  function changeCurrentColor(e) {
    options.currentColor = e;
    canvas.freeDrawingBrush.color = e;
    setCurrColor(e);
  }
  function onSaveCanvasAsImage(resendText, canvas) {
    var textSwal = resendText ? 'You cannot undo the action once the assignment has been sent for revision.' : resend ? "Once graded, you can't reverse the changes." : "Once submitted, you can't reverse the changes.";
    (0, _sweetalert["default"])({
      title: 'Are you sure?',
      text: textSwal,
      icon: 'warning',
      customClass: 'Custom_Cancel',
      buttons: true,
      dangerMode: true
    }).then(/*#__PURE__*/function () {
      var _ref1 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(willDelete) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!willDelete) {
                  _context2.next = 4;
                  break;
                }
                canvasRef.current.toBlob(function (blob) {
                  var _extends2, _extends3, _extends4;
                  setPages(_extends({}, pages, (_extends2 = {}, _extends2[index] = blob, _extends2)));
                  setFiles(_extends({}, pages, (_extends3 = {}, _extends3[index] = blob, _extends3)));
                  setJSON(_extends({}, canvasPage, (_extends4 = {}, _extends4[index] = canvas.toJSON(), _extends4)));
                  setJSONScreenWidth(canvas.width);
                });
                _context2.next = 5;
                break;
              case 4:
                return _context2.abrupt("return");
              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return function (_x) {
        return _ref1.apply(this, arguments);
      };
    }());
  }
  function extendPage(canvas) {
    nextPage(canvas);
    canvas.backgroundImage = null;
    canvas.renderAll();
  }
  function nextPage(canvas) {
    backUpCanvas = [];
    if (json.length === 0) {
      if (!pdfViewer) {
        var _extends5;
        setCanvasPage(_extends({}, canvasPage, (_extends5 = {}, _extends5[index] = canvas.toJSON(), _extends5)));
        canvasRef.current.toBlob(function (blob) {
          var _extends6;
          setPages(_extends({}, pages, (_extends6 = {}, _extends6[index] = blob, _extends6)));
        });
        if (canvasPage[index + 1] !== undefined) {
          canvas.loadFromJSON(canvasPage[index + 1]).then(function () {
            return canvas.renderAll();
          });
        } else {
          clearCanvasNextPage(canvas);
          setTotalPages(totalPages + 1);
        }
      }
      setIndex(index + 1);
    } else {
      if (index + 1 >= totalPages) return;
      if (!pdfViewer) {
        var _extends7;
        setCanvasPage(_extends({}, canvasPage, (_extends7 = {}, _extends7[index] = canvas.toJSON(), _extends7)));
        canvasRef.current.toBlob(function (blob) {
          var _extends8;
          setPages(_extends({}, pages, (_extends8 = {}, _extends8[index] = blob, _extends8)));
        });
        if (canvasPage[index + 1] !== undefined) {
          canvas.loadFromJSON(canvasPage[index + 1]).then(function () {
            return canvas.renderAll();
          });
        } else {
          clearCanvasNextPage(canvas);
          clearCanvas(canvas);
          canvas
          // Student-authored graph — see Finding 29.
          .loadFromJSON((0, _sanitizeCanvasJson["default"])(json[historyIndex].object[index + 1]), function (o, object) {
            object.set('selectable', false);
            object.set('evented', false);
          }).then(function () {
            canvas.setZoom(canvasOriginalWidth / json[historyIndex].screen);
            canvas.renderAll();
          });
        }
      }
      setIndex(index + 1);
    }
    setSubmitPdf(index + 1 === totalPages);
  }
  function previousPage(canvas) {
    backUpCanvas = [];
    if (index - 1 < 0) {
      return;
    }
    if (!pdfViewer) {
      var _extends9;
      setCanvasPage(_extends({}, canvasPage, (_extends9 = {}, _extends9[index] = canvas.toJSON(), _extends9)));
      canvasRef.current.toBlob(function (blob) {
        var _extends0;
        setPages(_extends({}, pages, (_extends0 = {}, _extends0[index] = blob, _extends0)));
      });
      canvas.loadFromJSON(canvasPage[index - 1]).then(function () {
        return canvas.renderAll();
      });
    }
    setIndex(index - 1);
  }
  function redoCanvas() {
    if (backupIndex - 1 < 0) return;
    canvas.loadFromJSON(popFromBackUp(canvas)).then(function () {
      return canvas.renderAll();
    });
  }
  function undoCanvas(canvas) {
    var length = canvasObjectsSize(canvas) - 1;
    pushToBackUp(canvas);
    if (canvas.getObjects()[length] !== canvas.backgroundImage || canvas.getObjects()[length] !== canvas.Image) {
      canvas.remove(canvas.getObjects()[length]);
    }
  }
  function zoomInCanvas(canvas) {
    var center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 4);
    canvas.zoomToPoint(center, canvas.getZoom() * 1.1);
  }
  function zoomOutCanvas(canvas) {
    var center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 4);
    canvas.zoomToPoint(center, canvas.getZoom() / 1.1);
  }
  var toolbarCommander = function toolbarCommander(props, canvas, options) {
    setOpenDraw(false);
    switch (props) {
      case modes.LINE:
        createLine(canvas);
        break;
      case modes.RECTANGLE:
        createRect(canvas);
        break;
      case modes.ELLIPSE:
        createEllipse(canvas);
        break;
      case modes.TRIANGLE:
        createTriangle(canvas, options);
        break;
      case modes.PENCIL:
        draw(canvas);
        break;
      case 'TEXT':
        createText(canvas);
        break;
      case 'SELECT':
        onSelectMode(canvas);
        break;
      case modes.ERASER:
        changeToErasingMode(canvas);
        break;
      case 'CLEAR':
        clearCanvas(canvas);
        break;
    }
  };
  var _useState11 = (0, _react.useState)(false),
    openDraw = _useState11[0],
    setOpenDraw = _useState11[1];
  var _useState12 = (0, _react.useState)(false),
    openThickness = _useState12[0],
    setOpenThickness = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    openColor = _useState13[0],
    setOpenColor = _useState13[1];
  var _useState14 = (0, _react.useState)(/*#__PURE__*/_react["default"].createElement("img", {
      src: _pencil["default"]
    })),
    selectedDrawIcon = _useState14[0],
    setSelectedDrawIcon = _useState14[1];
  (0, _react.useEffect)(function () {
    if (canvas) {
      if (!pdfViewer && json.length !== 0) return;
      canvas.setZoom(1);
      var center = canvas.getCenterPoint();
      fabric.FabricImage.fromURL(fileCanvasInfo.currentPage).then(function (img) {
        img.scaleToHeight(whiteboardRef.current.clientWidth);
        img.scaleToWidth(whiteboardRef.current.clientWidth);
        img.set({
          top: center.y,
          left: center.x,
          originX: 'center',
          originY: 'center'
        });
        canvas.backgroundImage = img;
        canvas.renderAll();
      });
    }
  }, [fileCanvasInfo.currentPage, pdfViewer]);
  function updateFileCanvasInfo(data) {
    setFileCanvasInfo(_extends({}, fileCanvasInfo, data));
  }
  (0, _react.useEffect)(function () {
    options.currentColor = currColor;
    if (canvas && buttonFlag && !pdfViewer) draw(canvas);
  }, [canvas, color]);
  (0, _react.useEffect)(function () {
    options.currentColor = currColor;
    if (canvas && buttonFlag && !pdfViewer) draw(canvas);else if (canvas && buttonFlag && pdfViewer) {
      remove(canvas);
    }
  }, [pdfViewer]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: whiteboardRef,
    className: _indexModule["default"].whiteboard
  }, /*#__PURE__*/_react["default"].createElement("canvas", {
    ref: canvasRef,
    id: "canvas"
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", null, json && !pdfViewer && totalPages > 1 && /*#__PURE__*/_react["default"].createElement("div", {
    className: _indexModule["default"].nextFixedButton
  }, /*#__PURE__*/_react["default"].createElement("p", null, "Page ", index + 1, " to ", totalPages), index > 0 && /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    className: _indexModule["default"].floatingButtonsZoom,
    onClick: function onClick() {
      return previousPage(canvas);
    }
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: _left["default"],
    style: {
      width: '20px',
      height: '20px'
    }
  })), index + 1 < totalPages && /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    className: _indexModule["default"].floatingButtonsZoom,
    onClick: function onClick() {
      return nextPage(canvas);
    }
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: _right["default"],
    style: {
      width: '20px',
      height: '20px'
    }
  })))), (json.length === 0 || pdfViewer) && /*#__PURE__*/_react["default"].createElement(_PdfCanvas["default"], {
    setSubmitPdf: setSubmitPdf,
    next: function next() {
      return nextPage(canvas);
    },
    back: function back() {
      return previousPage(canvas);
    },
    fileCanvasInfo: fileCanvasInfo,
    updateFileCanvasInfo: updateFileCanvasInfo,
    extend: function extend() {
      return extendPage(canvas);
    },
    revision: revision
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: _indexModule["default"].toolbarWithColor,
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _indexModule["default"].toolbar
  }, !pdfViewer && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    className: openThickness ? _indexModule["default"].speeddialDivOpen : _indexModule["default"].speeddialDivClose,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      if (!buttonFlag) return;
      setOpenThickness(!openThickness);
    },
    disabled: disableButtons,
    direction: "up",
    FabProps: {
      title: 'Stroke Thickness'
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _stroke["default"]
      }))
    }),
    ariaLabel: "Stroke Thickness"
  }), /*#__PURE__*/_react["default"].createElement(_Slider["default"], {
    changeHandler: function changeHandler(v) {
      return changeCurrentWidth(v);
    },
    open: openThickness && !openDraw && !openColor,
    value: options.currentWidth
  })), /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    className: openDraw ? _indexModule["default"].speeddialDivOpen : _indexModule["default"].speeddialDivClose,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: openDraw,
    onClick: function onClick() {
      if (disableButtons) return;
      if (!buttonFlag) return;
      setOpenDraw(!openDraw);
      setOpenColor(false);
      setOpenThickness(false);
    },
    direction: "up",
    FabProps: {
      title: 'Drawing Tools'
    },
    ariaLabel: "Drawing Tools",
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, selectedDrawIcon)
    })
  }, /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement(_OpenWith["default"], null))
    }),
    tooltipTitle: "Select / Move",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement(_OpenWith["default"], null));
      toolbarCommander('SELECT', canvas);
    }
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _line["default"]
      }))
    }),
    tooltipTitle: "Line",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement("img", {
        src: _line["default"]
      }));
      toolbarCommander(modes.LINE, canvas);
    }
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _rectangle["default"]
      }))
    }),
    tooltipTitle: "Rectangle",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement("img", {
        src: _rectangle["default"]
      }));
      toolbarCommander(modes.RECTANGLE, canvas);
    }
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _circle["default"]
      }))
    }),
    tooltipTitle: "Ellipse",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement("img", {
        src: _circle["default"]
      }));
      toolbarCommander(modes.ELLIPSE, canvas);
    }
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _triangle["default"]
      }))
    }),
    tooltipTitle: "Triangle",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement("img", {
        src: _triangle["default"]
      }));
      toolbarCommander(modes.TRIANGLE, canvas, options);
    }
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _pencil["default"]
      }))
    }),
    tooltipTitle: "Pencil",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement("img", {
        src: _pencil["default"]
      }));
      toolbarCommander(modes.PENCIL, canvas);
    }
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _font["default"]
      }))
    }),
    tooltipTitle: "Text",
    onClick: function onClick() {
      setSelectedDrawIcon(/*#__PURE__*/_react["default"].createElement("img", {
        src: _font["default"]
      }));
      toolbarCommander('TEXT', canvas);
    }
  }))), /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    style: {
      display: 'flex'
    },
    className: openColor ? _indexModule["default"].speeddialColorDivOpen : _indexModule["default"].speeddialColorDivClose
  }, /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: openColor,
    onClick: function onClick() {
      if (disableButtons) return;
      if (!buttonFlag) return;
      setOpenColor(!openColor);
      setOpenDraw(false);
      setOpenThickness(false);
    },
    direction: "up",
    FabProps: {
      title: 'Color Picker'
    },
    ariaLabel: "Color Picker",
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        sx: {
          width: 24,
          height: 24,
          backgroundColor: currColor,
          WebkitMaskImage: "url(" + _paintBucket["default"] + ")",
          maskImage: "url(" + _paintBucket["default"] + ")",
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain'
        }
      }))
    })
  }, color.map(function (col) {
    return /*#__PURE__*/_react["default"].createElement(_SpeedDialAction["default"], {
      key: col.color,
      FabProps: {
        style: {
          background: col.color,
          boxShadow: currColor === col.color && '0 0 10px black'
        }
      },
      className: "floating_buttons",
      tooltipTitle: col.title,
      onClick: function onClick() {
        changeCurrentColor(col.color);
        setOpenColor(!openColor);
      }
    });
  }))), /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      if (disableButtons) return;
      if (!buttonFlag) return;
      toolbarCommander(modes.ERASER, canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Eraser'
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _eraser["default"]
      }))
    }),
    ariaLabel: "Eraser"
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      if (disableButtons) return;
      undoCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Undo'
    },
    ariaLabel: "Undo",
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _undo["default"]
      }))
    })
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      if (disableButtons) return;
      redoCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Redo'
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _redo["default"]
      }))
    }),
    ariaLabel: "Redo"
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      zoomInCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Zoom In'
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _zoomIn["default"]
      }))
    }),
    ariaLabel: "Zoom In"
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      zoomOutCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Zoom Out'
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _zoomOut["default"]
      }))
    }),
    ariaLabel: "Zoom Out"
  }), /*#__PURE__*/_react["default"].createElement(_SpeedDial["default"], {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: function onClick() {
      togglePanning(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Pan / Move'
    },
    icon: /*#__PURE__*/_react["default"].createElement(_SpeedDialIcon["default"], {
      icon: /*#__PURE__*/_react["default"].createElement(_Box["default"], {
        className: _indexModule["default"].flexDiv
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: _pan["default"]
      }))
    }),
    ariaLabel: "Pan / Move"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: _indexModule["default"].upperToolBar
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _indexModule["default"].upperToolBarFlex
  }, !pdfViewer ? /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    title: "Preview PDF"
  }, /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    className: _indexModule["default"].flexDiv,
    onClick: function onClick() {
      var _extends1;
      setIndex(0);
      updateFileCanvasInfo({
        currentPageNumber: 1
      });
      setCanvasPage(_extends({}, canvasPage, (_extends1 = {}, _extends1[index] = canvas.toJSON(), _extends1)));
      clearCanvas(canvas);
      setPdfViewer(true);
    }
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: _assignment["default"]
  }))) : /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    title: "Back to Drawing"
  }, /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    className: _indexModule["default"].flexDiv,
    onClick: function onClick() {
      setIndex(0);
      updateFileCanvasInfo({
        currentPageNumber: 1
      });
      setPdfViewer(false);
    }
  }, /*#__PURE__*/_react["default"].createElement("img", {
    src: _pencil["default"]
  }))), resend && /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    title: "Return for Revision",
    className: !buttonFlag ? _indexModule["default"].disabledButton : '',
    onClick: function onClick() {
      if (!buttonFlag) return;
      setResendFiles(true);
      onSaveCanvasAsImage(true, canvas);
    }
  }, /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    className: _indexModule["default"].flexDiv
  }, buttonFlag ? /*#__PURE__*/_react["default"].createElement("img", {
    src: _revise["default"]
  }) : /*#__PURE__*/_react["default"].createElement("img", {
    src: _reviseDisabled["default"]
  }))), /*#__PURE__*/_react["default"].createElement(_Button["default"], {
    title: resend ? "Grade & Submit" : "Submit Assignment",
    className: !buttonFlag ? _indexModule["default"].disabledButton : '',
    onClick: function onClick() {
      if (!buttonFlag) return;
      setResendFiles(false);
      onSaveCanvasAsImage(false, canvas);
    }
  }, /*#__PURE__*/_react["default"].createElement(_Box["default"], {
    className: _indexModule["default"].flexDiv
  }, buttonFlag ? /*#__PURE__*/_react["default"].createElement("img", {
    src: _check["default"]
  }) : /*#__PURE__*/_react["default"].createElement("img", {
    src: _checkDisabled["default"]
  }))))), /*#__PURE__*/_react["default"].createElement(_StyledSnackbar["default"], {
    xPos: snackbarData.xPos,
    yPos: snackbarData.yPos,
    title: snackbarData.title,
    status: snackbarData.status,
    open: openSnack,
    onClose: handleCloseSnack
  }))));
};
Whiteboard.propTypes = {
  aspectRatio: _propTypes["default"].number,
  setFiles: _propTypes["default"].any,
  setResendFiles: _propTypes["default"].any,
  color: _propTypes["default"].any,
  setJSON: _propTypes["default"].any,
  json: _propTypes["default"].any,
  pdfUrl: _propTypes["default"].any,
  revision: _propTypes["default"].any,
  resend: _propTypes["default"].any,
  pdf: _propTypes["default"].any,
  buttonFlag: _propTypes["default"].any,
  jsonScreenWidth: _propTypes["default"].any,
  setJSONScreenWidth: _propTypes["default"].any
};
var _default = exports["default"] = Whiteboard;