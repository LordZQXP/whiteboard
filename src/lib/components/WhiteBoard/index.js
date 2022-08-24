import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import PdfReader from '../PdfReader';
import { saveAs } from 'file-saver';
import getCursor from './cursors';
import SelectIcon from './images/select.svg';
import EraserIcon from './images/eraser.svg';
import TextIcon from './images/text.svg';
import RectangleIcon from './images/rectangle.svg';
import LineIcon from './images/line.svg';
import EllipseIcon from './images/ellipse.svg';
import TriangleIcon from './images/triangle.svg';
import PencilIcon from './images/pencil.svg';
import DeleteIcon from './images/delete.svg';

import './eraserBrush';

import styles from './index.module.scss';
let drawInstance = null;
let origX;
let origY;
let mouseDown = false;

const options = {
  currentMode: '',
  currentColor: "#000000",
  currentWidth: 5,
  fill: false,
  group: {},
};

const modes = {
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  ERASER: 'ERASER',
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
    options.currentMode = modes.RECTANGLE
    
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
    options.currentMode = modes.TRIANGLE

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

function createText(canvas) {
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

function changeToErasingMode(canvas) {

  if (options.currentMode !== modes.ERASER) {
    removeCanvasListener(canvas);

    canvas.isDrawingMode = false;

    options.currentMode = modes.ERASER;

    canvas.hoverCursor = `url(${getCursor({ type: 'eraser' })}), default`;
  }
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

function draw(canvas) {
  if (options.currentMode !== modes.PENCIL) {
    removeCanvasListener(canvas);

    options.currentMode = modes.PENCIL;
    // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = parseInt(options.currentWidth, 10) || 1;
    canvas.freeDrawingBrush.color = options.currentColor;
    canvas.isDrawingMode = true;
  }
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

const Whiteboard = ({ aspectRatio = 4 / 3, setFiles, color }) => {
  const [currColor, setCurrColor] = useState(color[0]?.color);
  const [currTool, setCurrTool] = useState(color[0]?.color);
  const [canvas, setCanvas] = useState(null);
  const [brushWidth, setBrushWidth] = useState(5);

  const [fileReaderInfo, setFileReaderInfo] = useState({
    file: '',
    totalPages: null,
    currentPageNumber: 1,
    currentPage: '',
  });

  useEffect(()=>{
    options.currentColor = currColor;
  },[color]);

  var canvasRef = useRef(null);
  const whiteboardRef = useRef(null);
  const uploadPdfRef = useRef(null);

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
    if (canvas) {
      const center = canvas.getCenter();
      fabric.Image.fromURL(fileReaderInfo.currentPage, (img) => {
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: 'center',
          originY: 'center',
        });

        canvas.renderAll();
      });
    }
  }, [fileReaderInfo.currentPage]);

  function changeCurrentWidth(e) {
    const intValue = parseInt(e.target.value);
    options.currentWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
    setBrushWidth(() => intValue);
  }

  function changeCurrentColor(e) {
    options.currentColor = e;
    canvas.freeDrawingBrush.color = e;
    setCurrColor(e);
  }

  const [pages, setPages] = useState([]);

  const [backUpCanvas, setBackUpCanvas] = useState([]);

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      setFiles([...pages, blob]);
      setPages([...pages, blob]);
    });
    canvas.getObjects().forEach((item) => {
      if (item !== canvas.backgroundImage) {
        canvas.remove(item);
      }
    })
    setPages([]);
    updateFileReaderInfo({ file: "", currentPageNumber: 1 });

  }

  function savePages(canvas) {
    setBackUpCanvas([...backUpCanvas, canvasRef]);
    canvasRef.current.toBlob(function (blob) {
      setPages([...pages, blob]);
      canvas.getObjects().forEach((item) => {
        if (item !== canvas.backgroundImage) {
          canvas.remove(item);
        }
      })
    });
  }

  function onFileChange(event) {
    updateFileReaderInfo({ file: event.target.files[0], currentPageNumber: 1 });
  }

  const [pdfViewer, setPdfViewer] = React.useState(false);

  function updateFileReaderInfo(data) {
    setFileReaderInfo({ ...fileReaderInfo, ...data });
  }

  const toolbarCommander = (props, canvas, options) =>{
    switch(props){
      case modes.LINE :
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
        createTriangle(canvas,options);
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

  }

  return (
    <div ref={whiteboardRef} className={styles.whiteboard}>
      <div className={styles.toolbar}>
        <button type="button" style={{ backgroundColor: currTool === modes.LINE && "white", border: currTool === modes.LINE && `1px solid ${currColor}`}} onClick={() => toolbarCommander(modes.LINE, canvas)}>
          <img src={LineIcon} alt="line" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === modes.RECTANGLE && "white" , border : currTool === modes.RECTANGLE && `1px solid ${currColor}` }} onClick={() => toolbarCommander(modes.RECTANGLE, canvas)}>
          <img src={RectangleIcon} alt="Rectangle" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === modes.ELLIPSE && "white" , border : currTool === modes.ELLIPSE && `1px solid ${currColor}` }} onClick={() => toolbarCommander(modes.ELLIPSE, canvas)}>
          <img src={EllipseIcon} alt="Ellipse" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === modes.TRIANGLE && "white" , border : currTool === modes.TRIANGLE && `1px solid ${currColor}` }} onClick={() => toolbarCommander(modes.TRIANGLE, canvas, options)}>
          <img src={TriangleIcon} alt="Triangle" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === modes.PENCIL && "white" , border : currTool === modes.PENCIL && `1px solid ${currColor}` }} onClick={() => toolbarCommander(modes.PENCIL, canvas)}>
          <img src={PencilIcon} alt="Pencil" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === "TEXT" && "white" , border : currTool === "TEXT" && `1px solid ${currColor}` }} onClick={() => toolbarCommander("TEXT", canvas)}>
          <img src={TextIcon} alt="Text" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === "SELECT" && "white" , border : currTool === "SELECT" && `1px solid ${currColor}` }} onClick={() => toolbarCommander("SELECT", canvas)}>
          <img src={SelectIcon} alt="Selection mode" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === modes.ERASER && "white" , border : currTool === modes.ERASER && `1px solid ${currColor}` }} onClick={() => toolbarCommander(modes.ERASER, canvas)}>
          <img src={EraserIcon} alt="Eraser" />
        </button>
        <button type="button" style={{ backgroundColor: currTool === "CLEAR" && "white" , border : currTool === "CLEAR" && `1px solid ${currColor}` }}  onClick={() => toolbarCommander("CLEAR", canvas)}>
          <img src={DeleteIcon} alt="Delete" />
        </button>

        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={brushWidth}
          onChange={changeCurrentWidth}
        />
        <div className={styles.uploadDropdown}>
          <input ref={uploadPdfRef} accept=".pdf" type="file" onChange={onFileChange} />
          <button className={styles.dropdownButton}>+Upload</button>
          <div className={styles.dropdownContent}>
            <span onClick={() => { uploadPdfRef.current.click(); setPdfViewer(true) }}>PDF</span>
          </div>
        </div>

        <button onClick={onSaveCanvasAsImage}>Submit</button>
      </div>
      <div className={styles.colorToolbarDiv}>
        {color.map(col => <div onClick={() => changeCurrentColor(col.color)} key={col.color} style={{ backgroundColor: `${col.color}`, boxShadow: currColor === col.color && '0 0 10px black' }} title={col.title} className={styles.colorDiv}></div>)}
      </div>
      <canvas ref={canvasRef} id="canvas" />
      <div>
        {/* <button>Previous</button> */}
        {!pdfViewer && <button onClick={() => savePages(canvas)}>Next</button>}
      </div>
      <div>
        {pdfViewer && <PdfReader savePage={() => savePages(canvas)} fileReaderInfo={fileReaderInfo} updateFileReaderInfo={updateFileReaderInfo} />}
      </div>
    </div>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
  setFiles: PropTypes.any,
  color: PropTypes.any,
};

export default Whiteboard;
