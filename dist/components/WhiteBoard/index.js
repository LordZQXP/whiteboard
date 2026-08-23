"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var fabric = _interopRequireWildcard(require("fabric"));

var _cursors = _interopRequireDefault(require("./cursors"));

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let drawInstance = null;
let origX;
let origY;
let mouseDown = false;
let isPanning = false;
let lastPosX, lastPosY;
const options = {
  currentMode: '',
  currentColor: '#000000',
  currentWidth: 5,
  fill: false,
  group: {}
};
let backUpCanvas = [];
let backupIndex = 0;
const modes = {
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  ERASER: 'ERASER',
  PANNING: 'PANNING'
};

const initCanvas = (width, height) => {
  const canvas = new fabric.Canvas('canvas', {
    height,
    width
  });
  Object.assign(fabric.InteractiveFabricObject.ownDefaults, {
    transparentCorners: false,
    cornerStyle: 'circle',
    borderColor: '#4447A9',
    cornerColor: '#4447A9',
    cornerSize: 6,
    padding: 10,
    borderDashArray: [5, 5]
  }); // fabric 6+ no longer creates a default freeDrawingBrush.

  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.on('object:added', e => {
    e.target.on('mousedown', removeObject(canvas));
  });
  canvas.on('path:created', e => {
    backUpCanvas = [];
    e.path.on('mousedown', removeObject(canvas));
  });
  return canvas;
};

function removeObject(canvas) {
  return e => {
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
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0; //const mouse = window.matchMedia('(pointer:fine)').matches;

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
    canvas.getObjects().map(item => item.set({
      selectable: false
    }));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function startAddLine(canvas) {
  return _ref => {
    let {
      e
    } = _ref;
    mouseDown = true;
    let pointer = canvas.getScenePoint(e);
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
  return _ref2 => {
    let {
      e
    } = _ref2;

    if (mouseDown) {
      const pointer = canvas.getScenePoint(e);
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
    canvas.getObjects().map(item => item.set({
      selectable: false
    }));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
}

function startAddRect(canvas) {
  return _ref3 => {
    let {
      e
    } = _ref3;
    mouseDown = true;
    const pointer = canvas.getScenePoint(e);
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
    drawInstance.on('mousedown', e => {
      if (options.currentMode === modes.ERASER) {
        canvas.remove(e.target);
      }
    });
  };
}

function startDrawingRect(canvas) {
  return _ref4 => {
    let {
      e
    } = _ref4;

    if (mouseDown) {
      const pointer = canvas.getScenePoint(e);

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
    canvas.getObjects().map(item => item.set({
      selectable: false
    }));
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
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0; //const mouse = window.matchMedia('(pointer:fine)').matches;

    if (!touch) {
      canvas.on('mouse:down', opt => {
        const evt = opt.e;

        if (evt.button === 0) {
          // Left mouse button
          isPanning = true;
          canvas.selection = false;
          lastPosX = evt.clientX;
          lastPosY = evt.clientY;
        }
      });
      canvas.on('mouse:move', opt => {
        if (isPanning) {
          const e = opt.e;
          const vpt = canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;
          canvas.requestRenderAll();
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        }
      });
      canvas.on('mouse:up', () => {
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

let startHandler = null;
let moveHandler = null;
let endHandler = null;

const createTouchStartHandler = canvas => e => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    isPanning = true;
    canvas.selection = false;
    lastPosX = touch.clientX;
    lastPosY = touch.clientY;
  }
};

const createTouchMoveHandler = canvas => e => {
  if (!isPanning || e.touches.length !== 1) return;
  const touch = e.touches[0];
  const vpt = canvas.viewportTransform;
  vpt[4] += touch.clientX - lastPosX;
  vpt[5] += touch.clientY - lastPosY;
  canvas.requestRenderAll();
  lastPosX = touch.clientX;
  lastPosY = touch.clientY;
};

const createTouchEndHandler = canvas => e => {
  isPanning = false;
  canvas.selection = true;
};

function startAddEllipse(canvas) {
  return _ref5 => {
    let {
      e
    } = _ref5;
    mouseDown = true;
    const pointer = canvas.getScenePoint(e);
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
  return _ref6 => {
    let {
      e
    } = _ref6;

    if (mouseDown) {
      const pointer = canvas.getScenePoint(e);

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
  canvas.getObjects().map(item => item.set({
    selectable: false
  }));
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function startAddTriangle(canvas) {
  return _ref7 => {
    let {
      e
    } = _ref7;
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;
    const pointer = canvas.getScenePoint(e);
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
  return _ref8 => {
    let {
      e
    } = _ref8;

    if (mouseDown) {
      const pointer = canvas.getScenePoint(e);

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
  canvas.hoverCursor = `url(${(0, _cursors.default)({
    type: 'eraser'
  })}), default`;
}

function canvasObjectsSize(canvas) {
  return canvas.getObjects().length;
}

function onSelectMode(canvas) {
  options.currentMode = '';
  canvas.isDrawingMode = false;
  removeCanvasListener(canvas);
  canvas.getObjects().map(item => item.set({
    selectable: true
  }));
  canvas.hoverCursor = 'all-scroll';
}

function clearCanvas(canvas) {
  canvas.getObjects().forEach(item => {
    if (item !== canvas.backgroundImage) {
      canvas.remove(item);
    }
  });
}

function clearCanvasNextPage(canvas) {
  canvas.getObjects().forEach(item => {
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
  canvas.getObjects().map(item => item.set({
    selectable: false
  }));
  canvas.hoverCursor = 'all-scroll';
}

function createText(canvas) {
  options.currentMode = 'TEXT';
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  canvas.selection = false;
  canvas.hoverCursor = 'text';
  canvas.defaultCursor = 'text';
  canvas.getObjects().map(item => item.set({
    selectable: false
  }));
  canvas.discardActiveObject();
  canvas.requestRenderAll();

  const placeText = opt => {
    if (opt.target) return;
    const pointer = canvas.getScenePoint(opt.e);
    const text = new fabric.Textbox('text', {
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
  const resize_ob = new ResizeObserver(callback);
  return resize_ob;
}

function resizeCanvas(canvas, whiteboard) {
  return () => {
    const ratio = canvas.getWidth() / canvas.getHeight();
    const whiteboardWidth = whiteboard.clientWidth;
    const scale = whiteboardWidth / canvas.getWidth();
    const zoom = canvas.getZoom() * scale;
    canvas.setDimensions({
      width: whiteboardWidth,
      height: whiteboardWidth / ratio
    });
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

const Whiteboard = _ref9 => {
  var _color$, _json$historyIndex, _json$historyIndex$ob;

  let {
    aspectRatio = 4 / 3,
    setFiles,
    color,
    setJSON,
    json,
    pdfUrl,
    revision,
    setJSONScreenWidth,
    resend,
    jsonScreenWidth,
    pdf = undefined,
    setResendFiles,
    buttonFlag,
    initialPdfViewer
  } = _ref9;
  const [currColor, setCurrColor] = (0, _react.useState)((_color$ = color[0]) == null ? void 0 : _color$.color);
  const [canvas, setCanvas] = (0, _react.useState)(null);
  const [submitPdf, setSubmitPdf] = (0, _react.useState)(false);
  const [pages, setPages] = (0, _react.useState)({});
  const [canvasPage, setCanvasPage] = (0, _react.useState)([]);
  const [index, setIndex] = (0, _react.useState)(0);
  const [disableButtons, setDisableButtons] = (0, _react.useState)(false);
  const [historyIndex, setHistoryIndex] = (0, _react.useState)(0);
  const [totalPages, setTotalPages] = (0, _react.useState)(((_json$historyIndex = json[historyIndex]) == null ? void 0 : (_json$historyIndex$ob = _json$historyIndex.object) == null ? void 0 : _json$historyIndex$ob.length) || 0);

  const [pdfViewer, setPdfViewer] = _react.default.useState(initialPdfViewer !== undefined ? initialPdfViewer : buttonFlag);

  const [canvasOriginalWidth, setCanvasOriginalWidth] = _react.default.useState(878);

  const [snackbarData, setSnackBarData] = (0, _react.useState)({
    xPos: 'center',
    yPos: 'bottom',
    title: '',
    status: 'success'
  });
  const [openSnack, setOpenSnack] = (0, _react.useState)(false);

  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const [fileCanvasInfo, setFileCanvasInfo] = (0, _react.useState)({
    file: pdf,
    totalPages: null,
    currentPageNumber: 1,
    currentPage: ''
  });
  var canvasRef = (0, _react.useRef)(null);
  const whiteboardRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (!canvas && canvasRef.current) {
      const canvas = initCanvas(whiteboardRef.current.clientWidth, whiteboardRef.current.clientWidth / aspectRatio);
      setCanvas(() => canvas);
      handleResize(resizeCanvas(canvas, whiteboardRef.current)).observe(whiteboardRef.current);
      setCanvasOriginalWidth(canvas.width);
    }
  }, [canvasRef]);
  (0, _react.useEffect)(() => {
    const fetchImg = async () => {
      try {
        clearCanvas(canvas);
        backUpCanvas = [];

        if (canvasPage[index] !== undefined) {
          await canvas.loadFromJSON(canvasPage[index]);
          canvas.setZoom(canvasOriginalWidth / json[historyIndex].screen);
          canvas.renderAll();
        } else {
          await canvas.loadFromJSON(json[historyIndex].object[index], (o, object) => {
            object.set('selectable', false);
            object.set('evented', false);
          });
          canvas.setZoom(canvasOriginalWidth / json[historyIndex].screen);
          canvas.renderAll();
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (json && canvas && !pdfViewer) {
      clearCanvas(canvas);
      setIndex(0);
      fetchImg();
    }
  }, [json, canvas, pdfViewer]);

  function changeCurrentWidth(value) {
    const intValue = parseInt(value);
    options.currentWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
  }

  function changeCurrentColor(e) {
    options.currentColor = e;
    canvas.freeDrawingBrush.color = e;
    setCurrColor(e);
  }

  function onSaveCanvasAsImage(resendText, canvas) {
    let textSwal = resendText ? 'You cannot undo the action once the assignment has been sent for revision.' : resend ? "Once graded, you can't reverse the changes." : "Once submitted, you can't reverse the changes.";
    (0, _sweetalert.default)({
      title: 'Are you sure?',
      text: textSwal,
      icon: 'warning',
      customClass: 'Custom_Cancel',
      buttons: true,
      dangerMode: true
    }).then(async willDelete => {
      if (willDelete) {
        canvasRef.current.toBlob(function (blob) {
          setPages({ ...pages,
            [index]: blob
          });
          setFiles({ ...pages,
            [index]: blob
          });
          setJSON({ ...canvasPage,
            [index]: canvas.toJSON()
          });
          setJSONScreenWidth(canvas.width);
        });
      } else {
        return;
      }
    });
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
        setCanvasPage({ ...canvasPage,
          [index]: canvas.toJSON()
        });
        canvasRef.current.toBlob(function (blob) {
          setPages({ ...pages,
            [index]: blob
          });
        });

        if (canvasPage[index + 1] !== undefined) {
          canvas.loadFromJSON(canvasPage[index + 1]).then(() => canvas.renderAll());
        } else {
          clearCanvasNextPage(canvas);
          setTotalPages(totalPages + 1);
        }
      }

      setIndex(index + 1);
    } else {
      if (index + 1 >= totalPages) return;

      if (!pdfViewer) {
        setCanvasPage({ ...canvasPage,
          [index]: canvas.toJSON()
        });
        canvasRef.current.toBlob(function (blob) {
          setPages({ ...pages,
            [index]: blob
          });
        });

        if (canvasPage[index + 1] !== undefined) {
          canvas.loadFromJSON(canvasPage[index + 1]).then(() => canvas.renderAll());
        } else {
          clearCanvasNextPage(canvas);
          clearCanvas(canvas);
          canvas.loadFromJSON(json[historyIndex].object[index + 1], (o, object) => {
            object.set('selectable', false);
            object.set('evented', false);
          }).then(() => {
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
      setCanvasPage({ ...canvasPage,
        [index]: canvas.toJSON()
      });
      canvasRef.current.toBlob(function (blob) {
        setPages({ ...pages,
          [index]: blob
        });
      });
      canvas.loadFromJSON(canvasPage[index - 1]).then(() => canvas.renderAll());
    }

    setIndex(index - 1);
  }

  function redoCanvas() {
    if (backupIndex - 1 < 0) return;
    canvas.loadFromJSON(popFromBackUp(canvas)).then(() => canvas.renderAll());
  }

  function undoCanvas(canvas) {
    let length = canvasObjectsSize(canvas) - 1;
    pushToBackUp(canvas);

    if (canvas.getObjects()[length] !== canvas.backgroundImage || canvas.getObjects()[length] !== canvas.Image) {
      canvas.remove(canvas.getObjects()[length]);
    }
  }

  function zoomInCanvas(canvas) {
    const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 4);
    canvas.zoomToPoint(center, canvas.getZoom() * 1.1);
  }

  function zoomOutCanvas(canvas) {
    const center = new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 4);
    canvas.zoomToPoint(center, canvas.getZoom() / 1.1);
  }

  const toolbarCommander = (props, canvas, options) => {
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

  const [openDraw, setOpenDraw] = (0, _react.useState)(false);
  const [openThickness, setOpenThickness] = (0, _react.useState)(false);
  const [openColor, setOpenColor] = (0, _react.useState)(false);
  const [selectedDrawIcon, setSelectedDrawIcon] = (0, _react.useState)( /*#__PURE__*/_react.default.createElement("img", {
    src: _pencil.default
  }));
  (0, _react.useEffect)(() => {
    if (canvas) {
      if (!pdfViewer && json.length !== 0) return;
      canvas.setZoom(1);
      const center = canvas.getCenterPoint();
      fabric.FabricImage.fromURL(fileCanvasInfo.currentPage).then(img => {
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
    setFileCanvasInfo({ ...fileCanvasInfo,
      ...data
    });
  }

  (0, _react.useEffect)(() => {
    options.currentColor = currColor;
    if (canvas && buttonFlag && !pdfViewer) draw(canvas);
  }, [canvas, color]);
  (0, _react.useEffect)(() => {
    options.currentColor = currColor;
    if (canvas && buttonFlag && !pdfViewer) draw(canvas);else if (canvas && buttonFlag && pdfViewer) {
      remove(canvas);
    }
  }, [pdfViewer]);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: whiteboardRef,
    className: _indexModule.default.whiteboard
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: canvasRef,
    id: "canvas"
  }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, json && !pdfViewer && totalPages > 1 && /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.nextFixedButton
  }, /*#__PURE__*/_react.default.createElement("p", null, "Page ", index + 1, " to ", totalPages), index > 0 && /*#__PURE__*/_react.default.createElement(_Button.default, {
    className: _indexModule.default.floatingButtonsZoom,
    onClick: () => previousPage(canvas)
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _left.default,
    style: {
      width: '20px',
      height: '20px'
    }
  })), index + 1 < totalPages && /*#__PURE__*/_react.default.createElement(_Button.default, {
    className: _indexModule.default.floatingButtonsZoom,
    onClick: () => nextPage(canvas)
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _right.default,
    style: {
      width: '20px',
      height: '20px'
    }
  })))), (json.length === 0 || pdfViewer) && /*#__PURE__*/_react.default.createElement(_PdfCanvas.default, {
    setSubmitPdf: setSubmitPdf,
    next: () => nextPage(canvas),
    back: () => previousPage(canvas),
    fileCanvasInfo: fileCanvasInfo,
    updateFileCanvasInfo: updateFileCanvasInfo,
    extend: () => extendPage(canvas),
    revision: revision
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.toolbarWithColor,
    style: {
      backgroundColor: 'transparent'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.toolbar
  }, !pdfViewer && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: openThickness ? _indexModule.default.speeddialDivOpen : _indexModule.default.speeddialDivClose,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      if (!buttonFlag) return;
      setOpenThickness(!openThickness);
    },
    disabled: disableButtons,
    direction: "up",
    FabProps: {
      title: 'Stroke Thickness'
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _stroke.default
      }))
    }),
    ariaLabel: "Stroke Thickness"
  }), /*#__PURE__*/_react.default.createElement(_Slider.default, {
    changeHandler: v => changeCurrentWidth(v),
    open: openThickness && !openDraw && !openColor,
    value: options.currentWidth
  })), /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: openDraw ? _indexModule.default.speeddialDivOpen : _indexModule.default.speeddialDivClose,
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: openDraw,
    onClick: () => {
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
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, selectedDrawIcon)
    })
  }, /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement(_OpenWith.default, null))
    }),
    tooltipTitle: "Select / Move",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement(_OpenWith.default, null));
      toolbarCommander('SELECT', canvas);
    }
  }), /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _line.default
      }))
    }),
    tooltipTitle: "Line",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement("img", {
        src: _line.default
      }));
      toolbarCommander(modes.LINE, canvas);
    }
  }), /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _rectangle.default
      }))
    }),
    tooltipTitle: "Rectangle",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement("img", {
        src: _rectangle.default
      }));
      toolbarCommander(modes.RECTANGLE, canvas);
    }
  }), /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _circle.default
      }))
    }),
    tooltipTitle: "Ellipse",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement("img", {
        src: _circle.default
      }));
      toolbarCommander(modes.ELLIPSE, canvas);
    }
  }), /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _triangle.default
      }))
    }),
    tooltipTitle: "Triangle",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement("img", {
        src: _triangle.default
      }));
      toolbarCommander(modes.TRIANGLE, canvas, options);
    }
  }), /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _pencil.default
      }))
    }),
    tooltipTitle: "Pencil",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement("img", {
        src: _pencil.default
      }));
      toolbarCommander(modes.PENCIL, canvas);
    }
  }), /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    FabProps: {
      style: {
        boxShadow: 'none'
      }
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _font.default
      }))
    }),
    tooltipTitle: "Text",
    onClick: () => {
      setSelectedDrawIcon( /*#__PURE__*/_react.default.createElement("img", {
        src: _font.default
      }));
      toolbarCommander('TEXT', canvas);
    }
  }))), /*#__PURE__*/_react.default.createElement(_Box.default, {
    style: {
      display: 'flex'
    },
    className: openColor ? _indexModule.default.speeddialColorDivOpen : _indexModule.default.speeddialColorDivClose
  }, /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: openColor,
    onClick: () => {
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
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement(_Box.default, {
        sx: {
          width: 24,
          height: 24,
          backgroundColor: currColor,
          WebkitMaskImage: `url(${_paintBucket.default})`,
          maskImage: `url(${_paintBucket.default})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain'
        }
      }))
    })
  }, color.map(col => /*#__PURE__*/_react.default.createElement(_SpeedDialAction.default, {
    key: col.color,
    FabProps: {
      style: {
        background: col.color,
        boxShadow: currColor === col.color && '0 0 10px black'
      }
    },
    className: "floating_buttons",
    tooltipTitle: col.title,
    onClick: () => {
      changeCurrentColor(col.color);
      setOpenColor(!openColor);
    }
  })))), /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      if (disableButtons) return;
      if (!buttonFlag) return;
      toolbarCommander(modes.ERASER, canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Eraser'
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _eraser.default
      }))
    }),
    ariaLabel: "Eraser"
  }), /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      if (disableButtons) return;
      undoCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Undo'
    },
    ariaLabel: "Undo",
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _undo.default
      }))
    })
  }), /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      if (disableButtons) return;
      redoCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Redo'
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _redo.default
      }))
    }),
    ariaLabel: "Redo"
  }), /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      zoomInCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Zoom In'
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _zoomIn.default
      }))
    }),
    ariaLabel: "Zoom In"
  }), /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      zoomOutCanvas(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Zoom Out'
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _zoomOut.default
      }))
    }),
    ariaLabel: "Zoom Out"
  }), /*#__PURE__*/_react.default.createElement(_SpeedDial.default, {
    open: false,
    style: {
      display: 'flex'
    },
    onClick: () => {
      togglePanning(canvas);
    },
    direction: "up",
    FabProps: {
      title: 'Pan / Move'
    },
    icon: /*#__PURE__*/_react.default.createElement(_SpeedDialIcon.default, {
      icon: /*#__PURE__*/_react.default.createElement(_Box.default, {
        className: _indexModule.default.flexDiv
      }, /*#__PURE__*/_react.default.createElement("img", {
        src: _pan.default
      }))
    }),
    ariaLabel: "Pan / Move"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.upperToolBar
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.upperToolBarFlex
  }, !pdfViewer ? /*#__PURE__*/_react.default.createElement(_Button.default, {
    title: "Preview PDF"
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: _indexModule.default.flexDiv,
    onClick: () => {
      setIndex(0);
      updateFileCanvasInfo({
        currentPageNumber: 1
      });
      setCanvasPage({ ...canvasPage,
        [index]: canvas.toJSON()
      });
      clearCanvas(canvas);
      setPdfViewer(true);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _assignment.default
  }))) : /*#__PURE__*/_react.default.createElement(_Button.default, {
    title: "Back to Drawing"
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: _indexModule.default.flexDiv,
    onClick: () => {
      setIndex(0);
      updateFileCanvasInfo({
        currentPageNumber: 1
      });
      setPdfViewer(false);
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _pencil.default
  }))), resend && /*#__PURE__*/_react.default.createElement(_Button.default, {
    title: "Return for Revision",
    className: !buttonFlag ? _indexModule.default.disabledButton : '',
    onClick: () => {
      if (!buttonFlag) return;
      setResendFiles(true);
      onSaveCanvasAsImage(true, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: _indexModule.default.flexDiv
  }, buttonFlag ? /*#__PURE__*/_react.default.createElement("img", {
    src: _revise.default
  }) : /*#__PURE__*/_react.default.createElement("img", {
    src: _reviseDisabled.default
  }))), /*#__PURE__*/_react.default.createElement(_Button.default, {
    title: resend ? "Grade & Submit" : "Submit Assignment",
    className: !buttonFlag ? _indexModule.default.disabledButton : '',
    onClick: () => {
      if (!buttonFlag) return;
      setResendFiles(false);
      onSaveCanvasAsImage(false, canvas);
    }
  }, /*#__PURE__*/_react.default.createElement(_Box.default, {
    className: _indexModule.default.flexDiv
  }, buttonFlag ? /*#__PURE__*/_react.default.createElement("img", {
    src: _check.default
  }) : /*#__PURE__*/_react.default.createElement("img", {
    src: _checkDisabled.default
  }))))), /*#__PURE__*/_react.default.createElement(_StyledSnackbar.default, {
    xPos: snackbarData.xPos,
    yPos: snackbarData.yPos,
    title: snackbarData.title,
    status: snackbarData.status,
    open: openSnack,
    onClose: handleCloseSnack
  }))));
};

Whiteboard.propTypes = {
  aspectRatio: _propTypes.default.number,
  setFiles: _propTypes.default.any,
  setResendFiles: _propTypes.default.any,
  color: _propTypes.default.any,
  setJSON: _propTypes.default.any,
  json: _propTypes.default.any,
  pdfUrl: _propTypes.default.any,
  revision: _propTypes.default.any,
  resend: _propTypes.default.any,
  pdf: _propTypes.default.any,
  buttonFlag: _propTypes.default.any,
  jsonScreenWidth: _propTypes.default.any,
  setJSONScreenWidth: _propTypes.default.any
};
var _default = Whiteboard;
exports.default = _default;