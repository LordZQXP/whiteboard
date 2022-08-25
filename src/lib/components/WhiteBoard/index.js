import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import PdfReader from '../PdfReader';
import getCursor from './cursors';
import EraserIcon from './images/eraser.svg';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Crop169Icon from '@mui/icons-material/Crop169';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CreateIcon from '@mui/icons-material/Create';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import HighlightAltRoundedIcon from '@mui/icons-material/HighlightAltRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import Brush from "./images/brush@3x.png";
import Pencil from "./images/pencil-create@3x.png";


import './eraserBrush';

import styles from './index.module.scss';
import { Box, Button, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import InputSlider from './components/Slider';
import { bgcolor, style } from '@mui/system';
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
  const [colorToggle, setColorToggle] = useState(false);


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

  function changeCurrentWidth(value) {
    const intValue = parseInt(value);
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

  let backUpCanvas = [];

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      setFiles([...pages, blob]);
      setPages([...pages, blob]);
      setPages([]);
    });
    canvas.getObjects().forEach((item) => {
      if (item !== canvas.backgroundImage) {
        canvas.remove(item);
      }
    })
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

  function redoAll() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    for (let i = backUpCanvas.length-1; i>=0; i--){
    console.log(backUpCanvas)
    if(backUpCanvas.length===0){
      return;
    }
    if (backUpCanvas[i]?.path){
    const data = backUpCanvas[i]?.path;
    console.log(data);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.lineWidth = 5;
    var first = data[0];
    ctx.moveTo(first[1], first[2]);
    data.forEach((item, index) => {
      if (index !== 0) {
        ctx.lineTo(item[1], item[2]);
        ctx.stroke();
      }
    });
  }
  }
    ctx.closePath();
  }

  function undoCanvas(canvas, backUpCanvas) {
    let length = canvas.getObjects().length - 1;
    if (canvas.getObjects()[length] !== canvas.backgroundImage) {
      console.log(canvas.getObjects()[length]);
      backUpCanvas.push(canvas.getObjects()[length]);
      canvas.remove(canvas.getObjects()[length]);
    }
  }

  function onFileChange(event) {
    updateFileReaderInfo({ file: event.target.files[0], currentPageNumber: 1 });
  }

  const [pdfViewer, setPdfViewer] = React.useState(false);

  function updateFileReaderInfo(data) {
    setFileReaderInfo({ ...fileReaderInfo, ...data });
  }

  const toolbarCommander = (props, canvas, options) =>{
    setOpenDraw(false)
    switch(props){
      case modes.LINE :
        createLine(canvas);
        setCurrTool(modes.LINE);
        setColorToggle(true);
        break;

        case modes.RECTANGLE:
        createRect(canvas);
        setCurrTool(modes.RECTANGLE);
        setColorToggle(true);
        break;

      case modes.ELLIPSE:
        createEllipse(canvas);
        setCurrTool(modes.ELLIPSE);
        setColorToggle(true);
        break;

      case modes.TRIANGLE:
        createTriangle(canvas,options);
        setCurrTool(modes.TRIANGLE);
        setColorToggle(true);
        break;

      case modes.PENCIL:
        draw(canvas);
        setCurrTool(modes.PENCIL);
        setColorToggle(true);
        break;
      
      case "TEXT":
        createText(canvas);
        setCurrTool("TEXT");
        setColorToggle(true);
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

  const [openDraw, setOpenDraw] = useState(false);
  const [openColor, setOpenColor] = useState(false);


  return (
    <div ref={whiteboardRef} className={styles.whiteboard}>
      <canvas ref={canvasRef} id="canvas" />
      <div>
      <div>
        {!pdfViewer && <button onClick={() => savePages(canvas)}>Next</button>}
      </div>
        {pdfViewer && <PdfReader savePage={() => savePages(canvas)} fileReaderInfo={fileReaderInfo} updateFileReaderInfo={updateFileReaderInfo} />}
      </div>
      <div className={styles.toolbarWithColor}>
        <div className={styles.toolbar}>
          <Box style={{ display: 'flex', alignItems: 'flex-end', maxHeight: openDraw?'100%': '50px'}}>
          <SpeedDial
          open={openDraw}
          onClick={()=>setOpenDraw(!openDraw)}
          direction='up'
          ariaLabel="SpeedDial openIcon example"
          icon={<SpeedDialIcon icon={<Box sx={{ display: "flex" }}>
              <img src={Pencil} />
            </Box>} />}
          >
            <SpeedDialAction
              icon={<HorizontalRuleIcon style={{ rotate: '-45deg', color: 'black' }} /> }
                tooltipTitle="Line"
                onClick={() => toolbarCommander(modes.LINE, canvas)}
            />
            <SpeedDialAction
              icon={<Crop169Icon style={{ color: 'black' }} />}
              tooltipTitle="Rectangle"
              onClick={() => toolbarCommander(modes.RECTANGLE, canvas)}
            />
            <SpeedDialAction
              icon={<RadioButtonUncheckedIcon style={{ color: 'black' }} />}
              tooltipTitle="Ellipse"
              onClick={() => toolbarCommander(modes.ELLIPSE, canvas)}
            />
            <SpeedDialAction
              icon={<ChangeHistoryIcon style={{ color: 'black' }} />}
              tooltipTitle="Triangle"
              onClick={() => toolbarCommander(modes.TRIANGLE, canvas,options)}
            />
            <SpeedDialAction
              icon={<CreateIcon style={{ color: 'black' }} />}
              tooltipTitle="Pencil"
              onClick={() => toolbarCommander(modes.PENCIL, canvas)}
            />
            <SpeedDialAction
              icon={<TitleRoundedIcon style={{ color: 'black' }} />}
              tooltipTitle="Text"
              onClick={() => toolbarCommander("TEXT", canvas)}
            />
            
          </SpeedDial>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'flex-end', maxHeight: openColor ? '100%' : '50px' }}>
          <SpeedDial
            open={openColor}
            onClick={()=>setOpenColor(!openColor)}
            direction='up'
            ariaLabel="SpeedDial openIcon example"
            icon={  <SpeedDialIcon icon={<Box sx={{ display: "flex" }}>
                <img src={Brush} />
                 </Box>} />}
          >
            {color.map(col => 
            <SpeedDialAction
              key={col.color}
                FabProps={{
                  style: {
                    background: col.color,
                    boxShadow: currColor === col.color && "0 0 10px black"
                  }
                }}
              tooltipTitle={col.title}
                onClick={() => { changeCurrentColor(col.color); setOpenColor(!openColor) }}
            >
            </SpeedDialAction>
            )}
          </SpeedDial>
          </Box>

          {/* <Button type="button" title='Select' style={{ boxShadow: currTool === "SELECT" && `0 0 10px ${currColor}`}} onClick={() => toolbarCommander("SELECT", canvas)}>
          <HighlightAltRoundedIcon style={{ color: 'black' }} />
        </Button> */}
        {/* <Button type="button" title='Eraser' style={{ boxShadow : currTool === modes.ERASER && `0 0 10px ${currColor}` }} onClick={() => toolbarCommander(modes.ERASER, canvas)}>
          <img src={EraserIcon} alt="Eraser" />
        </Button> */}
        {/* <Button type="button" title='Clear'  onClick={() => toolbarCommander("CLEAR", canvas)}>
          <DeleteIcon style={{ color: 'black' }} />
        </Button> */}
          <SpeedDial
            open={false}
            onClick={() => undoCanvas(canvas, backUpCanvas)}
            direction='up'
            ariaLabel="SpeedDial openIcon example"
            icon={<SpeedDialIcon icon={<UndoIcon style={{ color: 'black' }} />} />}
          />
          {/* <SpeedDial
            open={false}
            onClick={() => redoAll(canvas)}
            direction='up'
            ariaLabel="SpeedDial openIcon example"
            icon={<SpeedDialIcon icon={<UndoIcon style={{ color: 'black' }} />} />}
          />
          <SpeedDial
            open={false}
            onClick={() => toolbarCommander(modes.ERASER,canvas)}
            direction='up'
            ariaLabel="SpeedDial openIcon example"
            icon={<SpeedDialIcon icon={<UndoIcon style={{ color: 'black' }} />} />}
          /> */}
       <div style={{position:'fixed', top:'0', right:'0'}}>
       <div className={styles.uploadDropdown}>
          <input ref={uploadPdfRef} accept=".pdf" type="file" onChange={onFileChange} />
          <Button onClick={() => { uploadPdfRef.current.click(); setPdfViewer(true) }}><PictureAsPdfIcon /></Button>
        </div>
        <Button onClick={onSaveCanvasAsImage}><DriveFolderUploadIcon /></Button>
        </div>
       </div>
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
