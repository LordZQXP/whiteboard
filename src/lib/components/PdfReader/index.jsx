import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import styles from './index.module.scss';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import stylesW from '../WhiteBoard/index.module.scss';
import SimpleBackdrop from '../CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PageviewOutlinedIcon from '@mui/icons-material/PageviewOutlined';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFReader = ({ fileReaderInfo, open }) => {
  const [spinnerValue, setSpinnerValue] = React.useState(true);
  const [zoomToggle, setZoomToggle] = React.useState(false);
  const [scale, setScale] = React.useState(1.0);
  const intervalRef = React.useRef(null);

  const zoomIn=(value)=>{
    setScale(value += 0.01);
  }

  const zoomOut = (value) => {
    setScale(value -= 0.01);
  }

  const startCounter = (zoom) => {
    let value = scale;
    intervalRef.current = setInterval(() => {
      if (zoom === "in")
        zoomIn(value);
      else{
        if (value -= 0.01 < 1.0)
        return;
        zoomOut(value);
      }
    }, 10);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setSpinnerValue(false);
    setNumPages(numPages);
  }

  const [width, setWidth] = React.useState(500);

  React.useEffect(()=>{
    if (window.innerWidth > 900)
      setWidth(500);
    else if (window.innerWidth > 480 && window.innerWidth < 900)
      setWidth(window.innerWidth);
    else if(window.innerWidth > 350){
      setWidth(350);
    }
    else if(window.innerWidth < 330)
      setWidth(200);
  },[window.innerWidth])

  return (
    <div className={styles.pdfFixedDiv}>
      {spinnerValue && <SimpleBackdrop open={true} />}
      <Document file={fileReaderInfo} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={width} scale={scale} />
      </Document>
      {open && <div className={stylesW.nextFixedButton}> <Button className={stylesW.floatingButtonsZoom} onClick={() => setPageNumber(pageNumber - 1 >0 ? pageNumber - 1 : 1)}><ArrowBackIosNewIcon className={stylesW.blackIcon} /></Button> 
        <p>
          Page {pageNumber} of {numPages}
        </p>
      <Button className={stylesW.floatingButtonsZoom} onClick={() => setPageNumber(pageNumber + 1 <= numPages ? pageNumber+1 : pageNumber)}><ArrowForwardIosIcon /></Button> </div>}
      {
        (open) &&
        <div className={stylesW.zoomFixedButton}>
          <Button onClick={() => setZoomToggle(!zoomToggle)}>
            <PageviewOutlinedIcon />
          </Button>
          <div style={{ display: zoomToggle ? 'flex' : 'none', flexDirection: 'column-reverse', alignItems: 'center' }}>
            <Button className={stylesW.floatingButtonsZoom} onMouseDown={() => startCounter("out")} onMouseUp={stopCounter} onMouseLeave={stopCounter} onClick={() => zoomOut(scale)}><RemoveIcon /></Button>{(scale * 100).toFixed(0)}%<Button onMouseDown={() => startCounter("in")} onMouseUp={stopCounter} onClick={() => zoomIn(scale)} className={stylesW.floatingButtonsZoom} onMouseLeave={stopCounter}><AddIcon /></Button>
          </div>
        </div>}
    </div>
  );
};

export default PDFReader;
