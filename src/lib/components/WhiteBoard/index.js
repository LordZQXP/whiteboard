import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import getCursor from './cursors';
import EraserIcon from './images/eraser.svg';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Crop169Icon from '@mui/icons-material/Crop169';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CreateIcon from '@mui/icons-material/Create';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import Brush from './images/brush@3x.png';
import Pencil from './images/pencil-create@3x.png';
import RotateLeft from './images/rotate-ccw@3x.png';
import RotateRight from './images/rotate-cw@3x.png';
import submit from './images/Group 6949.png';
import disabledSubmit from './images/disalbedSubmit.png';
import disabledRevise from './images/disabledRevise.png';
import sendTostudent from './images/Group 6948.png';
import previousHistory from './images/back.png';
import nextHistory from './images/arrow-right.png';
import preview from './images/Group 6946.png';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import './eraserBrush';
import styles from './index.module.scss';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import InputSlider from './components/Slider';
import PDFCanvas from '../PdfCanvas';
import swal from 'sweetalert';
import StyledSnackbar from './components/StyledSnackbar';

let drawInstance = null;
let origX;
let origY;
let mouseDown = false;

const options = {
  currentMode: '',
  currentColor: '#000000',
  currentWidth: 5,
  fill: false,
  group: {},
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
  PANNING: 'PANNING',
};

const initCanvas = (width, height) => {
  const canvas = new fabric.Canvas('canvas', { height, width });
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.borderColor = '#4447A9';
  fabric.Object.prototype.cornerColor = '#4447A9';
  fabric.Object.prototype.cornerSize = 6;
  fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.borderDashArray = [5, 5];
  canvas.on('object:added', (e) => {
    e.target.on('mousedown', removeObject(canvas));
  });
  canvas.on('path:created', (e) => {
    e.path.on('mousedown', removeObject(canvas));
  });
  return canvas;
};

function removeObject(canvas) {
  return (e) => {
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
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddLine(canvas) {
  return ({ e }) => {
    mouseDown = true;
    let pointer = canvas.getPointer(e);
    drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.currentWidth,
      stroke: options.currentColor,
      selectable: false,
    });
    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y,
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
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddRect(canvas) {
  return ({ e }) => {
    mouseDown = true;
    const pointer = canvas.getPointer(e);
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
      selectable: false,
    });
    canvas.add(drawInstance);
    drawInstance.on('mousedown', (e) => {
      if (options.currentMode === modes.ERASER) {
        canvas.remove(e.target);
      }
    });
  };
}

function startDrawingRect(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
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
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function panningZoom(canvas) {
  if (options.currentMode !== modes.PANNING) {
    options.currentMode = modes.PANNING;
    removeCanvasListener(canvas);
    canvas.on('mouse:wheel', (opt) => {
      if (!canvas.viewportTransform) {
        return;
      }
      var evt = opt.e;
      var deltaY = evt.deltaY;
      var zoom = canvas.getZoom();
      zoom = zoom - deltaY / 100;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.1) zoom = 0.1;
      canvas.zoomToPoint(new fabric.Point(evt.offsetX, evt.offsetY), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  } else {
    removeCanvasListener(canvas);
    draw(canvas);
  }
}

function startAddEllipse(canvas) {
  return ({ e }) => {
    mouseDown = true;
    const pointer = canvas.getPointer(e);
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
      selectable: false,
    });
    canvas.add(drawInstance);
  };
}

function startDrawingEllipse(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        rx: Math.abs(pointer.x - origX) / 2,
        ry: Math.abs(pointer.y - origY) / 2,
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
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddTriangle(canvas) {
  return ({ e }) => {
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;
    const pointer = canvas.getPointer(e);
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
      selectable: false,
    });
    canvas.add(drawInstance);
  };
}

function startDrawingTriangle(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
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
  canvas.hoverCursor = `url(${getCursor({ type: 'eraser' })}), default`;
}

function canvasObjectsSize(canvas) {
  return canvas.getObjects().length;
}

function onSelectMode(canvas) {
  options.currentMode = '';
  canvas.isDrawingMode = false;
  removeCanvasListener(canvas);
  canvas.getObjects().map((item) => item.set({ selectable: true }));
  canvas.hoverCursor = 'all-scroll';
}

function clearCanvas(canvas) {
  canvas.getObjects().forEach((item) => {
    if (item !== canvas.backgroundImage) {
      canvas.remove(item);
    }
  });
}

function clearCanvasNextPage(canvas) {
  canvas.getObjects().forEach((item) => {
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
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.hoverCursor = 'all-scroll';
}


function createText(canvas) {
  canvas.hoverCursor = `default`;
  draw(canvas);
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  const text = new fabric.Textbox('text', {
    left: 100,
    top: 100,
    fill: options.currentColor,
    editable: true,
  });
  canvas.add(text);
  canvas.renderAll();
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
    canvas.setDimensions({ width: whiteboardWidth, height: whiteboardWidth / ratio });
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

const Whiteboard = ({
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
  buttonFlag
}) => {
  const [currColor, setCurrColor] = useState(color[0]?.color);
  const [canvas, setCanvas] = useState(null);
  const [submitPdf, setSubmitPdf] = useState(false);
  const [pages, setPages] = useState({});
  const [canvasPage, setCanvasPage] = useState([]);
  const [index, setIndex] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(json[historyIndex]?.object?.length || 0);
  
  const [snackbarData, setSnackBarData] = useState({
    xPos: 'center',
    yPos: 'bottom',
    title: '',
    status: 'success'
  });


  const [openSnack, setOpenSnack] = useState(false);
  const handleClick = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };


  const [fileCanvasInfo, setFileCanvasInfo] = useState({
    file: pdf,
    totalPages: null,
    currentPageNumber: 1,
    currentPage: '',
  });

  var canvasRef = useRef(null);
  const whiteboardRef = useRef(null);

  useEffect(() => {
    if (!canvas && canvasRef.current) {
      const canvas = initCanvas(
        whiteboardRef.current.clientWidth,
        whiteboardRef.current.clientWidth / aspectRatio,
      );
      setCanvas(() => canvas);
      handleResize(resizeCanvas(canvas, whiteboardRef.current)).observe(whiteboardRef.current);
    }
  }, [canvasRef]);

  useEffect(() => {
    const fetchImg = async () => {
      try {
        clearCanvas(canvas);
        canvas.loadFromJSON(json[historyIndex].object[index], canvas.renderAll.bind(canvas), function (o, object) {
          object.set('selectable', false);
          object.set('evented', false);
          canvas.setZoom(canvas.width / json[historyIndex].screen);
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (json && canvas) {
      fetchImg()
    };
  }, [json, canvas]);

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
    if (index + 1 === totalPages) {
      let textSwal = resendText ? "You cannot undo the action once the assignment has been sent for revision." : "Once submitted, you can't reverse the changes.";
      swal({
        title: 'Are you sure?',
        text: textSwal,
        icon: 'warning',
        customClass: 'Custom_Cancel',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          canvasRef.current.toBlob(function (blob) {
            setPages({ ...pages, [index]: blob });
            setFiles({ ...pages, [index]: blob });
            setJSON({ ...canvasPage, [index]: canvas.toJSON() });
            setJSONScreenWidth(canvas.width);
          });
        } else {
          return;
        }
      });
    } else if (index != totalPages) {
      swal('Info', 'Please review the entire assignment before submitting it.', 'info');
    } else {
      swal({
        title: 'Are you sure?',
        text: "Once submitted, you can't reverse the changes.",
        icon: 'warning',
        customClass: 'Custom_Cancel',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          canvasRef.current.toBlob(function (blob) {
            setPages({ ...pages, [index]: blob });
            setFiles({ ...pages, [index]: blob });
            setJSON({ ...canvasPage, [index]: canvas.toJSON() });
            setJSONScreenWidth(canvas.width);
          });
        } else {
          return;
        }
      });
    }
  }

  function extendPage(canvas) {
    nextPage(canvas);
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
  }

  function nextPage(canvas) {
    backUpCanvas = [];
    if (json.length === 0) {
      setCanvasPage({ ...canvasPage, [index]: canvas.toJSON() });
      canvasRef.current.toBlob(function (blob) {
        setPages({ ...pages, [index]: blob });
      });
      if (canvasPage[index + 1] !== undefined) {
        canvas.loadFromJSON(canvasPage[index + 1]);
      } else {
        clearCanvasNextPage(canvas);
        setTotalPages(totalPages + 1);
      }
      setIndex(index + 1);
    }
    else {
      if (index + 1 >= totalPages)
        return;
      setCanvasPage({ ...canvasPage, [index]: canvas.toJSON() });
      canvasRef.current.toBlob(function (blob) {
        setPages({ ...pages, [index]: blob });
      });
      if (canvasPage[index + 1] !== undefined) {
        canvas.loadFromJSON(canvasPage[index + 1]);
      } else {
        clearCanvasNextPage(canvas);
        clearCanvas(canvas);
        canvas.loadFromJSON(json[historyIndex].object[index + 1], canvas.renderAll.bind(canvas), function (o, object) {
          object.set('selectable', false);
          object.set('evented', false);
          canvas.setZoom(canvas.width / json[historyIndex].screen);
        });
      }
      setIndex(index + 1);
    }
    setSubmitPdf((index + 1) === totalPages);

  }

  function previousPage(canvas) {
    backUpCanvas = [];
    if (index - 1 < 0) {
      return;
    }
    setCanvasPage({ ...canvasPage, [index]: canvas.toJSON() });
    canvasRef.current.toBlob(function (blob) {
      setPages({ ...pages, [index]: blob });
    });
    canvas.loadFromJSON(canvasPage[index - 1]);
    setIndex(index - 1);
  }



  function nextHistoryPage(canvas) {
    setIndex(0);
    setCanvasPage([]);
    if (historyIndex + 1 > json.length)
      return;
    clearCanvasNextPage(canvas);
    clearCanvas(canvas);
    canvas.loadFromJSON(json[historyIndex + 1].object[0], canvas.renderAll.bind(canvas), function (o, object) {
      object.set('selectable', false);
      object.set('evented', false);
      canvas.setZoom(canvas.width / json[historyIndex + 1].screen);
    });
    setHistoryIndex(historyIndex + 1);
  }

  function previousHistoryPage(canvas) {
    setIndex(0);
    setCanvasPage([]);
    if (historyIndex - 1 < 0)
      return;
    clearCanvasNextPage(canvas);
    clearCanvas(canvas);
    canvas.loadFromJSON(json[historyIndex - 1].object[0], canvas.renderAll.bind(canvas), function (o, object) {
      object.set('selectable', false);
      object.set('evented', false);
      canvas.setZoom(canvas.width / json[historyIndex - 1].screen);
    });
    setHistoryIndex(historyIndex - 1);
  }

  function redoCanvas() {
    if (backupIndex - 1 < 0) return;
    canvas.loadFromJSON(popFromBackUp(canvas));
  }

  function undoCanvas(canvas) {
    let length = canvasObjectsSize(canvas) - 1;
    pushToBackUp(canvas);
    if (
      canvas.getObjects()[length] !== canvas.backgroundImage ||
      canvas.getObjects()[length] !== canvas.Image
    ) {
      canvas.remove(canvas.getObjects()[length]);
    }
  }

  const [pdfViewer, setPdfViewer] = React.useState(true);

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

  const [openDraw, setOpenDraw] = useState(false);
  const [openThickness, setOpenThickness] = useState(false);
  const [openColor, setOpenColor] = useState(false);

  useEffect(() => {
    if (canvas) {
      const center = canvas.getCenter();
      fabric.Image.fromURL(fileCanvasInfo.currentPage, (img) => {
        img.scaleToHeight(whiteboardRef.current.clientWidth);
        img.scaleToWidth(whiteboardRef.current.clientWidth);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: 'center',
          originY: 'center'
        });
        canvas.renderAll();
      });
    }
  }, [fileCanvasInfo.currentPage]);

  function updateFileCanvasInfo(data) {
    setFileCanvasInfo({ ...fileCanvasInfo, ...data });
  }

  useEffect(() => {
    options.currentColor = currColor;
    if (canvas && buttonFlag && !pdfViewer) draw(canvas);
  }, [canvas, color]);

  useEffect(() => {
    options.currentColor = currColor;
    if (canvas && buttonFlag && !pdfViewer) draw(canvas);
    else if (canvas && buttonFlag && pdfViewer) {
      remove(canvas);
    }
  }, [pdfViewer]);

  return (
    <div ref={whiteboardRef} className={styles.whiteboard}>
      <canvas ref={canvasRef} id="canvas" />
      <div>
        <div>
          {json && (
            <div className={styles.nextFixedButton}>
              {' '}
              <Button className={styles.floatingButtonsZoom} 
                disabled={index  === 0}
              onClick={() => previousPage(canvas)}>
                <ArrowBackIosNewIcon className={styles.blackIcon} />
              </Button>
              <p>
                Page {index + 1} to {totalPages}
              </p>
              <Button className={styles.floatingButtonsZoom}
                disabled={index+1 === totalPages}
              onClick={() => nextPage(canvas)}>
                <ArrowForwardIosIcon className={styles.blackIcon} />
              </Button>{' '}
            </div>
          )}
        </div>
        {json.length === 0 && <PDFCanvas
          setSubmitPdf={setSubmitPdf}
          next={() => nextPage(canvas)}
          back={() => previousPage(canvas)}
          fileCanvasInfo={fileCanvasInfo}
          updateFileCanvasInfo={updateFileCanvasInfo}
          extend={() => extendPage(canvas)}
          revision={revision}
        />}
      </div>
      <div className={styles.toolbarWithColor} style={{ backgroundColor: 'transparent' }}>
        <div className={styles.toolbar}>
          {!pdfViewer && (
            <>
              <Box className={openThickness ? styles.speeddialDivOpen : styles.speeddialDivClose} style={{ display: !buttonFlag ? "none" : "flex" }}>
                <Button
                  className={styles.buttonThick}
                  onClick={() => setOpenThickness(!openThickness)}
                  disabled={disableButtons}
                >
                  <LineWeightIcon />
                </Button>
                <InputSlider
                  changeHandler={(v) => changeCurrentWidth(v)}
                  open={openThickness && !openDraw && !openColor}
                  value={options.currentWidth}
                />
              </Box>
              <Box className={openDraw ? styles.speeddialDivOpen : styles.speeddialDivClose} style={{ display: !buttonFlag ? "none" : "flex" }}>
                <SpeedDial
                  open={openDraw}
                  onClick={() => {
                    if (disableButtons)
                      return;
                    setOpenDraw(!openDraw);
                    setOpenColor(false);
                    setOpenThickness(false);
                  }}
                  direction="up"
                  ariaLabel="SpeedDial openIcon example"
                  icon={
                    <SpeedDialIcon
                      icon={
                        <Box className={styles.flexDiv}>
                          <img src={Pencil} />
                        </Box>
                      }
                    />
                  }
                >
                  <SpeedDialAction
                    FabProps={{
                      style: {
                        boxShadow: 'none',
                      },
                    }}
                    icon={<HorizontalRuleIcon className={styles.blackSlantedIcon} />}
                    tooltipTitle="Line"
                    onClick={() => toolbarCommander(modes.LINE, canvas)}
                  />
                  <SpeedDialAction
                    FabProps={{
                      style: {
                        boxShadow: 'none',
                      },
                    }}
                    icon={<Crop169Icon className={styles.blackIcon} />}
                    tooltipTitle="Rectangle"
                    onClick={() => toolbarCommander(modes.RECTANGLE, canvas)}
                  />
                  <SpeedDialAction
                    FabProps={{
                      style: {
                        boxShadow: 'none',
                      },
                    }}
                    icon={<RadioButtonUncheckedIcon className={styles.blackIcon} />}
                    tooltipTitle="Ellipse"
                    onClick={() => toolbarCommander(modes.ELLIPSE, canvas)}
                  />
                  <SpeedDialAction
                    FabProps={{
                      style: {
                        boxShadow: 'none',
                      },
                    }}
                    icon={<ChangeHistoryIcon className={styles.blackIcon} />}
                    tooltipTitle="Triangle"
                    onClick={() => toolbarCommander(modes.TRIANGLE, canvas, options)}
                  />
                  <SpeedDialAction
                    FabProps={{
                      style: {
                        boxShadow: 'none',
                      },
                    }}
                    icon={<CreateIcon className={styles.blackIcon} />}
                    tooltipTitle="Pencil"
                    onClick={() => toolbarCommander(modes.PENCIL, canvas)}
                  />
                  <SpeedDialAction
                    FabProps={{
                      style: {
                        boxShadow: 'none',
                      },
                    }}
                    icon={<TitleRoundedIcon className={styles.blackIcon} />}
                    tooltipTitle="Text"
                    onClick={() => toolbarCommander('TEXT', canvas)}
                  />
                </SpeedDial>
              </Box>
              <Box
                style={{ display: !buttonFlag ? "none" : "flex" }}
                className={openColor ? styles.speeddialColorDivOpen : styles.speeddialColorDivClose}
              >
                <SpeedDial
                  open={openColor}
                  onClick={() => {
                    if (disableButtons)
                      return;
                    setOpenColor(!openColor);
                    setOpenDraw(false);
                    setOpenThickness(false);
                  }}
                  direction="up"
                  ariaLabel="SpeedDial openIcon example"
                  icon={
                    <SpeedDialIcon
                      icon={
                        <Box className={styles.flexDiv}>
                          <img src={Brush} />
                        </Box>
                      }
                    />
                  }
                >
                  {color.map((col) => (
                    <SpeedDialAction
                      key={col.color}
                      FabProps={{
                        style: {
                          background: col.color,
                          boxShadow: currColor === col.color && '0 0 10px black',
                        },
                      }}
                      className="floating_buttons"
                      tooltipTitle={col.title}
                      onClick={() => {
                        changeCurrentColor(col.color);
                        setOpenColor(!openColor);
                      }}
                    ></SpeedDialAction>
                  ))}
                </SpeedDial>
              </Box>
              <SpeedDial
                open={false}
                style={{ display: !buttonFlag ? "none" : "flex" }}
                onClick={() => {
                  if (disableButtons)
                    return;
                  toolbarCommander(modes.ERASER, canvas);
                }}
                direction="up"
                icon={
                  <SpeedDialIcon
                    icon={
                      <Box className={styles.flexDiv}>
                        <img src={EraserIcon} />
                      </Box>
                    }
                  />
                }
                ariaLabel="SpeedDial openIcon example"
              />
              <SpeedDial
                open={false}
                style={{ display: !buttonFlag ? "none" : "flex" }}
                onClick={() => {
                  if (disableButtons)
                    return;
                  undoCanvas(canvas);
                }}
                direction="up"
                ariaLabel="SpeedDial openIcon example"
                icon={
                  <SpeedDialIcon
                    icon={
                      <Box className={styles.flexDiv}>
                        <img src={RotateLeft} />
                      </Box>
                    }
                  />
                }
              />
              <SpeedDial
                open={false}
                style={{ display: !buttonFlag ? "none" : "flex" }}
                onClick={() => {
                  if (disableButtons)
                    return;
                  redoCanvas(canvas);
                }}
                direction="up"
                icon={
                  <SpeedDialIcon
                    icon={
                      <Box className={styles.flexDiv}>
                        <img src={RotateRight} />
                      </Box>
                    }
                  />
                }
                ariaLabel="SpeedDial openIcon example"
              />
            </>
          )}
          <div className={styles.upperToolBar}>
            <div className={styles.upperToolBarFlex}>
              {!pdfViewer ? (
                <Button
                  className={!buttonFlag ? styles.disabledButton : ''}
                  disabled={!buttonFlag}
                >
                  <Box className={styles.flexDiv} onClick={() => {
                    if(!buttonFlag)
                    return;
                    setPdfViewer(true)}}>
                    <img src={preview} />
                  </Box>
                </Button>
              ) : (
                <Button>
                    <Box className={styles.flexDiv} onClick={() => {
                      if (!buttonFlag)
                        return; setPdfViewer(false)}}>
                    <img src={Pencil} />
                  </Box>
                </Button>
              )}
              {resend && (
                <Button
                  className={!buttonFlag ? styles.disabledButton : ''}
                  onClick={() => {
                    if (!buttonFlag)
                      return;
                    setResendFiles(true);
                    onSaveCanvasAsImage(true, canvas);
                  }}
                >
                  <Box className={styles.flexDiv}>
                    {buttonFlag ? <img src={sendTostudent} /> : <img src={disabledRevise} />}
                  </Box>
                </Button>
              )}
              <Button
                className={!buttonFlag ? styles.disabledButton : ''}
                onClick={() => {
                  if (!buttonFlag)
                    return;
                  setResendFiles(false);
                  onSaveCanvasAsImage(false, canvas);
                }}>
                <Box className={styles.flexDiv}>
                  {buttonFlag ? <img src={submit} /> : <img src={disabledSubmit} />}
                </Box>
              </Button>
            </div>
          </div>
          <StyledSnackbar 
            xPos={snackbarData.xPos}
            yPos={snackbarData.yPos}
            title={snackbarData.title}
            status={snackbarData.status}
            open={openSnack}
            onClose={handleCloseSnack}
          />
        </div>
      </div>
    </div>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
  setFiles: PropTypes.any,
  setResendFiles: PropTypes.any,
  color: PropTypes.any,
  setJSON: PropTypes.any,
  json: PropTypes.any,
  pdfUrl: PropTypes.any,
  revision: PropTypes.any,
  resend: PropTypes.any,
  pdf: PropTypes.any,
  buttonFlag: PropTypes.any,
  jsonScreenWidth: PropTypes.any,
  setJSONScreenWidth: PropTypes.any
};

export default Whiteboard;
