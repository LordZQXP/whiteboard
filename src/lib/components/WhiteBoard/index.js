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
import Brush from "./images/brush@3x.png";
import Pencil from "./images/pencil-create@3x.png";
import RotateLeft from "./images/rotate-ccw@3x.png";
import RotateRight from "./images/rotate-cw@3x.png";
import submit from "./images/Group 6949.png"
import sendTostudent from "./images/Group 6948.png"
import thickness from "./images/thickness.png"
import preview from "./images/Group 6946.png"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import './eraserBrush';
import styles from './index.module.scss';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import {saveAs} from 'file-saver';


import InputSlider from './components/Slider';
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

let backUpCanvas = "";

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
    backUpCanvas = canvas.toJSON();
    if (options.currentMode === modes.ERASER) {
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

const Whiteboard = ({ aspectRatio = 4 / 3, setFiles, color, setJSON, src = null }) => {
  const [currColor, setCurrColor] = useState(color[0]?.color);
  const [canvas, setCanvas] = useState(null);
  const [brushWidth, setBrushWidth] = useState(5);
  const [pages, setPages] = useState({});
  const [canvasPage, setCanvasPage] = useState([]);
  const [index, setIndex] = useState(0);

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

  useEffect(()=>{
      const fetchImg = async()=>{
      // canvas.loadFromJSON(src);
      // let source = "https://i.postimg.cc/x83xVfnY/page.png";
      clearCanvas(canvas);
        fetch(src)
          .then(response => response.blob())
          .then(imageBlob => {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            fabric.Image.fromURL(imageObjectURL, (img) => {
              img.scaleToHeight(canvas.height);
              canvas.add(img);
              canvas.centerObject(img);
            });
          });
      }
    if (src && canvas) fetchImg();
  },[src, canvas])

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

  function onSaveCanvasAsImage() {
    if(src){
      var imageURI = canvas.toDataURL("image/jpg");
      saveAs(imageURI,'pic.jpg');
    }
    canvasRef.current.toBlob(function (blob) {
      setPages({...pages, [index] : blob});
      setFiles({ ...pages, [index]: blob });
    });
    setJSON({...canvasPage, [index] : canvas.toJSON()});
    setPages({});
    clearCanvas(canvas);
    updateFileReaderInfo({ file: "", currentPageNumber: 1 });
  }

  function nextPage(canvas) {
    backUpCanvas="";
    setCanvasPage({...canvasPage, [index] : canvas.toJSON()});
    console.log(canvas.toJSON());
    canvasRef.current.toBlob(function (blob) {
        setPages({...pages, [index] : blob});
      });
    if(canvasPage[index+1] !== undefined)
    canvas.loadFromJSON(canvasPage[index+1]);
    else
    clearCanvas(canvas);
    setIndex(index+1);
  }

  function previousPage(canvas){
    backUpCanvas = "";
    if(index - 1 <0){
      return;
    }
    setCanvasPage({ ...canvasPage, [index]: canvas.toJSON() });
    canvasRef.current.toBlob(function (blob) {
      setPages({ ...pages, [index]: blob });
    });
    canvas.loadFromJSON(canvasPage[index-1]);
    setIndex(index - 1);
  }

  function redoAll() {
    canvas.loadFromJSON(backUpCanvas);
  }

  function undoCanvas(canvas) {
    let length = canvas.getObjects().length - 1;
    backUpCanvas = (canvas.toJSON());
    if (canvas.getObjects()[length] !== canvas.backgroundImage) {
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
        break;

        case modes.RECTANGLE:
        createRect(canvas);
        break;

      case modes.ELLIPSE:
        createEllipse(canvas);
        break;

      case modes.TRIANGLE:
        createTriangle(canvas,options);
        break;

      case modes.PENCIL:
        draw(canvas);
        break;
      
      case "TEXT":
        createText(canvas);
        break;

      case "SELECT":
        onSelectMode(canvas);
        break;

      case modes.ERASER:
        changeToErasingMode(canvas);
        break;

      case "CLEAR":
        clearCanvas(canvas);
        break;
    }
  }

  const [openDraw, setOpenDraw] = useState(false);
  const [openThickness, setOpenThickness] = useState(false);
  const [openColor, setOpenColor] = useState(false);


  return (
    <div ref={whiteboardRef} className={styles.whiteboard}>
      <canvas ref={canvasRef} id="canvas" />
      <div>
      <div>
          {!pdfViewer && <div className={styles.nextFixedButton}> <Button className={styles.floatingButtonsNextPrev} onClick={() => previousPage(canvas)}><ArrowBackIosNewIcon className={styles.blackIcon} /></Button> <Button className={styles.floatingButtonsNextPrev} onClick={() => nextPage(canvas)}><ArrowForwardIosIcon className={styles.blackIcon} /></Button> </div>}
      </div>
        {pdfViewer && <PdfReader savePage={() => nextPage(canvas)} fileReaderInfo={fileReaderInfo} updateFileReaderInfo={updateFileReaderInfo} />}
      </div>
      <div className={styles.toolbarWithColor} style={{ backgroundColor: (openDraw || openColor) ? 'transparent' : 'white'}}>
        <div className={styles.toolbar}>
          <Box className={openThickness ? styles.speeddialDivOpen : styles.speeddialDivClose}>
          <SpeedDial
              open={false}
              direction='up'
              ariaLabel="SpeedDial openIcon example"
            onClick={() => setOpenThickness(!openThickness)}
              icon={<SpeedDialIcon icon={<Box className={styles.flexDiv}>
                <img src={thickness} />
              </Box>}/>}
         />   
            <InputSlider changeHandler={(v)=>changeCurrentWidth(v)} open={openThickness && !openDraw && !openColor}  value={options.currentWidth}/>
          </Box>
          <Box className={openDraw ? styles.speeddialDivOpen : styles.speeddialDivClose}>
          <SpeedDial
          open={openDraw}
          onClick={()=>{setOpenDraw(!openDraw); setOpenColor(false); setOpenThickness(false);}}
          direction='up'
          ariaLabel="SpeedDial openIcon example"
          icon={<SpeedDialIcon icon={<Box className={styles.flexDiv}>
              <img src={Pencil} />
            </Box>} />}
          >
            <SpeedDialAction
              FabProps={{
                style: {
                  boxShadow : 'none'
                }
              }}
                icon={<HorizontalRuleIcon className={styles.blackSlantedIcon} /> }
                tooltipTitle="Line"
                onClick={() => toolbarCommander(modes.LINE, canvas)}
            />
            <SpeedDialAction
              FabProps={{
                style: {
                  boxShadow : 'none'
                }
              }}
              icon={<Crop169Icon className={styles.blackIcon} />}
              tooltipTitle="Rectangle"
              onClick={() => toolbarCommander(modes.RECTANGLE, canvas)}
            />
            <SpeedDialAction
              FabProps={{
                style: {
                  boxShadow : 'none'
                }
              }}
              icon={<RadioButtonUncheckedIcon className={styles.blackIcon} />}
              tooltipTitle="Ellipse"
              onClick={() => toolbarCommander(modes.ELLIPSE, canvas)}
            />
            <SpeedDialAction
              FabProps={{
                style: {
                  boxShadow : 'none'
                }
              }}
              icon={<ChangeHistoryIcon className={styles.blackIcon} />}
              tooltipTitle="Triangle"
              onClick={() => toolbarCommander(modes.TRIANGLE, canvas,options)}
            />
            <SpeedDialAction
              FabProps={{
                style: {
                  boxShadow : 'none'
                }
              }}
              icon={<CreateIcon className={styles.blackIcon} />}
              tooltipTitle="Pencil"
              onClick={() => toolbarCommander(modes.PENCIL, canvas)}
            />
            <SpeedDialAction
              FabProps={{
                style: {
                  boxShadow : 'none'
                }
              }}
              icon={<TitleRoundedIcon className={styles.blackIcon} />}
              tooltipTitle="Text"
              onClick={() => toolbarCommander("TEXT", canvas)}
            />
            
          </SpeedDial>
          </Box>
          <Box className={openColor ? styles.speeddialColorDivOpen : styles.speeddialColorDivClose}>
          <SpeedDial
            open={openColor}
              onClick={() => { setOpenColor(!openColor); setOpenDraw(false); setOpenThickness(false); }}
            direction='up'
            ariaLabel="SpeedDial openIcon example"
            icon={  <SpeedDialIcon icon={<Box className={styles.flexDiv}>
                <img src={Brush} />
                 </Box>} />}
          >
            {color.map(col => 
            <SpeedDialAction
              key={col.color}
                FabProps={{
                  style: {
                    background: col.color,
                    boxShadow: currColor === col.color && "0 0 10px black",
                  }
                }}
                className='floating_buttons'
                tooltipTitle={col.title}
                onClick={() => { changeCurrentColor(col.color); setOpenColor(!openColor) }}
            >
            </SpeedDialAction>
            )}
          </SpeedDial>
          </Box>
          <SpeedDial
            open={false}
            onClick={() => toolbarCommander(modes.ERASER, canvas)}
            direction='up'
            icon={<SpeedDialIcon icon={<Box className={styles.flexDiv}>
              <img src={EraserIcon} />
            </Box>} />}
            ariaLabel="SpeedDial openIcon example"
          />
          <SpeedDial
            open={false}
            onClick={() => undoCanvas(canvas)}
            direction='up'
            ariaLabel="SpeedDial openIcon example"
            icon={<SpeedDialIcon icon={<Box className={styles.flexDiv}>
              <img src={RotateLeft} />
            </Box>} />}
          />
          <SpeedDial
            open={false}
            onClick={() => redoAll(canvas)}
            direction='up'
            icon={<SpeedDialIcon icon={<Box className={styles.flexDiv}>
              <img src={RotateRight} />
            </Box>} />}
            ariaLabel="SpeedDial openIcon example"
          />
       <div className={styles.upperToolBar}>
       <div className={styles.uploadDropdown}>
          <input ref={uploadPdfRef} accept=".pdf" type="file" onChange={onFileChange} />
              <Button onClick={() => { uploadPdfRef.current.click(); setPdfViewer(true) }}><PictureAsPdf /></Button>
        </div>
            <div className={styles.upperToolBarFlex}>
            <Button><Box className={styles.flexDiv}>
              <img src={preview} />
            </Box></Button>
            <Button><Box className={styles.flexDiv}>
              <img src={sendTostudent} />
            </Box></Button>
            <Button onClick={onSaveCanvasAsImage}><Box className={styles.flexDiv}>
              <img src={submit} />
            </Box></Button>
        </div>
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
  setJSON : PropTypes.any,
  src : PropTypes.any
};

export default Whiteboard;
