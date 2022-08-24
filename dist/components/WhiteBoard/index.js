"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _fabric = require("fabric");

var _PdfReader = _interopRequireDefault(require("../PdfReader"));

var _fileSaver = require("file-saver");

var _cursors = _interopRequireDefault(require("./cursors"));

var _select = _interopRequireDefault(require("./images/select.svg"));

var _eraser = _interopRequireDefault(require("./images/eraser.svg"));

var _text = _interopRequireDefault(require("./images/text.svg"));

var _rectangle = _interopRequireDefault(require("./images/rectangle.svg"));

var _line = _interopRequireDefault(require("./images/line.svg"));

var _ellipse = _interopRequireDefault(require("./images/ellipse.svg"));

var _triangle = _interopRequireDefault(require("./images/triangle.svg"));

var _pencil = _interopRequireDefault(require("./images/pencil.svg"));

var _delete = _interopRequireDefault(require("./images/delete.svg"));

require("./eraserBrush");

var _indexModule = _interopRequireDefault(require("./index.module.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var drawInstance = null;
var origX;
var origY;
var mouseDown = false;
var options = {
  currentMode: '',
  currentColor: "#000000",
  currentWidth: 5,
  fill: false,
  group: {}
};
var modes = {
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  ERASER: 'ERASER'
};

var initCanvas = function initCanvas(width, height) {
  var canvas = new _fabric.fabric.Canvas('canvas', {
    height: height,
    width: width
  });
  _fabric.fabric.Object.prototype.transparentCorners = false;
  _fabric.fabric.Object.prototype.cornerStyle = 'circle';
  _fabric.fabric.Object.prototype.borderColor = '#4447A9';
  _fabric.fabric.Object.prototype.cornerColor = '#4447A9';
  _fabric.fabric.Object.prototype.cornerSize = 6;
  _fabric.fabric.Object.prototype.padding = 10;
  _fabric.fabric.Object.prototype.borderDashArray = [5, 5];
  canvas.on('object:added', function (e) {
    e.target.on('mousedown', removeObject(canvas));
  });
  canvas.on('path:created', function (e) {
    e.path.on('mousedown', removeObject(canvas));
  });
  return canvas;
};

function removeObject(canvas) {
  return function (e) {
    if (options.currentMode === modes.ERASER) {
      console.log("removed");
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
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddLine(canvas) {
  return function (_ref) {
    var e = _ref.e;
    mouseDown = true;
    var pointer = canvas.getPointer(e);
    drawInstance = new _fabric.fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.currentWidth,
      stroke: options.currentColor,
      selectable: false
    });
    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas) {
  return function (_ref2) {
    var e = _ref2.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);
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
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddRect(canvas) {
  return function (_ref3) {
    var e = _ref3.e;
    mouseDown = true;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Rect({
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
      var pointer = canvas.getPointer(e);

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
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddEllipse(canvas) {
  return function (_ref5) {
    var e = _ref5.e;
    mouseDown = true;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Ellipse({
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
  };
}

function startDrawingEllipse(canvas) {
  return function (_ref6) {
    var e = _ref6.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);

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
  canvas.discardActiveObject().requestRenderAll();
}

function startAddTriangle(canvas) {
  return function (_ref7) {
    var e = _ref7.e;
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;
    var pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Triangle({
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
  };
}

function startDrawingTriangle(canvas) {
  return function (_ref8) {
    var e = _ref8.e;

    if (mouseDown) {
      var pointer = canvas.getPointer(e);

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

function createText(canvas) {
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  var text = new _fabric.fabric.Textbox('text', {
    left: 100,
    top: 100,
    fill: options.currentColor,
    editable: true
  });
  canvas.add(text);
  canvas.renderAll();
}

function changeToErasingMode(canvas) {
  if (options.currentMode !== modes.ERASER) {
    removeCanvasListener(canvas);
    canvas.isDrawingMode = false;
    options.currentMode = modes.ERASER;
    canvas.hoverCursor = "url(" + (0, _cursors.default)({
      type: 'eraser'
    }) + "), default";
  }
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

function draw(canvas) {
  if (options.currentMode !== modes.PENCIL) {
    removeCanvasListener(canvas);
    options.currentMode = modes.PENCIL; // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    canvas.freeDrawingBrush.width = parseInt(options.currentWidth, 10) || 1;
    canvas.freeDrawingBrush.color = options.currentColor;
    canvas.isDrawingMode = true;
  }
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
  var _color$, _color$2;

  var _ref9$aspectRatio = _ref9.aspectRatio,
      aspectRatio = _ref9$aspectRatio === void 0 ? 4 / 3 : _ref9$aspectRatio,
      setFiles = _ref9.setFiles,
      color = _ref9.color;

  var _useState = (0, _react.useState)((_color$ = color[0]) == null ? void 0 : _color$.color),
      currColor = _useState[0],
      setCurrColor = _useState[1];

  var _useState2 = (0, _react.useState)((_color$2 = color[0]) == null ? void 0 : _color$2.color),
      currTool = _useState2[0],
      setCurrTool = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      canvas = _useState3[0],
      setCanvas = _useState3[1];

  var _useState4 = (0, _react.useState)(5),
      brushWidth = _useState4[0],
      setBrushWidth = _useState4[1];

  var _useState5 = (0, _react.useState)({
    file: '',
    totalPages: null,
    currentPageNumber: 1,
    currentPage: ''
  }),
      fileReaderInfo = _useState5[0],
      setFileReaderInfo = _useState5[1];

  (0, _react.useEffect)(function () {
    options.currentColor = currColor;
  }, [color]);
  var canvasRef = (0, _react.useRef)(null);
  var whiteboardRef = (0, _react.useRef)(null);
  var uploadPdfRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (!canvas && canvasRef.current) {
      var _canvas = initCanvas(whiteboardRef.current.clientWidth, whiteboardRef.current.clientWidth / aspectRatio);

      setCanvas(function () {
        return _canvas;
      });
      handleResize(resizeCanvas(_canvas, whiteboardRef.current)).observe(whiteboardRef.current);
    }
  }, [canvasRef]);
  (0, _react.useEffect)(function () {
    if (canvas) {
      var center = canvas.getCenter();

      _fabric.fabric.Image.fromURL(fileReaderInfo.currentPage, function (img) {
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: 'center',
          originY: 'center'
        });
        canvas.renderAll();
      });
    }
  }, [fileReaderInfo.currentPage]);

  function changeCurrentWidth(e) {
    var intValue = parseInt(e.target.value);
    options.currentWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
    setBrushWidth(function () {
      return intValue;
    });
  }

  function changeCurrentColor(e) {
    options.currentColor = e;
    canvas.freeDrawingBrush.color = e;
    setCurrColor(e);
  }

  var _useState6 = (0, _react.useState)([]),
      pages = _useState6[0],
      setPages = _useState6[1];

  var _useState7 = (0, _react.useState)([]),
      backUpCanvas = _useState7[0],
      setBackUpCanvas = _useState7[1];

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      setFiles([].concat(pages, [blob]));
      setPages([].concat(pages, [blob]));
    });
    canvas.getObjects().forEach(function (item) {
      if (item !== canvas.backgroundImage) {
        canvas.remove(item);
      }
    });
    setPages([]);
    updateFileReaderInfo({
      file: "",
      currentPageNumber: 1
    });
  }

  function savePages(canvas) {
    setBackUpCanvas([].concat(backUpCanvas, [canvasRef]));
    canvasRef.current.toBlob(function (blob) {
      setPages([].concat(pages, [blob]));
      canvas.getObjects().forEach(function (item) {
        if (item !== canvas.backgroundImage) {
          canvas.remove(item);
        }
      });
    });
  }

  function onFileChange(event) {
    updateFileReaderInfo({
      file: event.target.files[0],
      currentPageNumber: 1
    });
  }

  var _React$useState = _react.default.useState(false),
      pdfViewer = _React$useState[0],
      setPdfViewer = _React$useState[1];

  function updateFileReaderInfo(data) {
    setFileReaderInfo(_extends({}, fileReaderInfo, data));
  }

  var toolbarCommander = function toolbarCommander(props, canvas, options) {
    switch (props) {
      case modes.LINE:
        createLine(canvas);
        setCurrTool(modes.LINE);
        break;

      case modes.RECTANGLE:
        createRect(canvas);
        setCurrTool(modes.RECTANGLE);
        break;

      case modes.ELLIPSE:
        createEllipse(canvas);
        setCurrTool(modes.ELLIPSE);
        break;

      case modes.TRIANGLE:
        createTriangle(canvas, options);
        setCurrTool(modes.TRIANGLE);
        break;

      case modes.PENCIL:
        draw(canvas);
        setCurrTool(modes.PENCIL);
        break;

      case "TEXT":
        createText(canvas);
        setCurrTool("TEXT");
        break;

      case "SELECT":
        onSelectMode(canvas);
        setCurrTool("SELECT");
        break;

      case modes.ERASER:
        changeToErasingMode(canvas);
        setCurrTool(modes.ERASER);
        break;

      case "CLEAR":
        clearCanvas(canvas);
        setCurrTool("CLEAR");
        break;
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    ref: whiteboardRef,
    className: _indexModule.default.whiteboard
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.toolbar
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === modes.LINE && "white",
      border: currTool === modes.LINE && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander(modes.LINE, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _line.default,
    alt: "line"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === modes.RECTANGLE && "white",
      border: currTool === modes.RECTANGLE && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander(modes.RECTANGLE, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _rectangle.default,
    alt: "Rectangle"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === modes.ELLIPSE && "white",
      border: currTool === modes.ELLIPSE && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander(modes.ELLIPSE, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _ellipse.default,
    alt: "Ellipse"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === modes.TRIANGLE && "white",
      border: currTool === modes.TRIANGLE && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander(modes.TRIANGLE, canvas, options);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _triangle.default,
    alt: "Triangle"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === modes.PENCIL && "white",
      border: currTool === modes.PENCIL && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander(modes.PENCIL, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _pencil.default,
    alt: "Pencil"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === "TEXT" && "white",
      border: currTool === "TEXT" && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander("TEXT", canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _text.default,
    alt: "Text"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === "SELECT" && "white",
      border: currTool === "SELECT" && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander("SELECT", canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _select.default,
    alt: "Selection mode"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === modes.ERASER && "white",
      border: currTool === modes.ERASER && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander(modes.ERASER, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _eraser.default,
    alt: "Eraser"
  })), /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    style: {
      backgroundColor: currTool === "CLEAR" && "white",
      border: currTool === "CLEAR" && "1px solid " + currColor
    },
    onClick: function onClick() {
      return toolbarCommander("CLEAR", canvas);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _delete.default,
    alt: "Delete"
  })), /*#__PURE__*/_react.default.createElement("input", {
    type: "range",
    min: 1,
    max: 20,
    step: 1,
    value: brushWidth,
    onChange: changeCurrentWidth
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.uploadDropdown
  }, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadPdfRef,
    accept: ".pdf",
    type: "file",
    onChange: onFileChange
  }), /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.dropdownButton
  }, "+Upload"), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.dropdownContent
  }, /*#__PURE__*/_react.default.createElement("span", {
    onClick: function onClick() {
      uploadPdfRef.current.click();
      setPdfViewer(true);
    }
  }, "PDF"))), /*#__PURE__*/_react.default.createElement("button", {
    onClick: onSaveCanvasAsImage
  }, "Submit")), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.colorToolbarDiv
  }, color.map(function (col) {
    return /*#__PURE__*/_react.default.createElement("div", {
      onClick: function onClick() {
        return changeCurrentColor(col.color);
      },
      key: col.color,
      style: {
        backgroundColor: "" + col.color,
        boxShadow: currColor === col.color && '0 0 10px black'
      },
      title: col.title,
      className: _indexModule.default.colorDiv
    });
  })), /*#__PURE__*/_react.default.createElement("canvas", {
    ref: canvasRef,
    id: "canvas"
  }), /*#__PURE__*/_react.default.createElement("div", null, !pdfViewer && /*#__PURE__*/_react.default.createElement("button", {
    onClick: function onClick() {
      return savePages(canvas);
    }
  }, "Next")), /*#__PURE__*/_react.default.createElement("div", null, pdfViewer && /*#__PURE__*/_react.default.createElement(_PdfReader.default, {
    savePage: function savePage() {
      return savePages(canvas);
    },
    fileReaderInfo: fileReaderInfo,
    updateFileReaderInfo: updateFileReaderInfo
  })));
};

Whiteboard.propTypes = {
  aspectRatio: _propTypes.default.number,
  setFiles: _propTypes.default.any,
  color: _propTypes.default.any
};
var _default = Whiteboard;
exports.default = _default;