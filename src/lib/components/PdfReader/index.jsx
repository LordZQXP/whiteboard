import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import styles from './index.module.scss';
import { Button } from '@mui/material';
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
    if (value > 1.0)
    setScale(value -= 0.01);
  }

  const startCounter = (zoom) => {
    let value = scale;
    intervalRef.current = setInterval(() => {
      if (zoom === "in")
        zoomIn(value);
      else{
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
    <div className={ numPages > 1 ? styles.pdfAbsoluteDiv : styles.pdfFixedDiv}>
      {spinnerValue && <SimpleBackdrop open={true} />}
      <Document file={fileReaderInfo} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(Array(numPages), (e,x) => <Page key={x} pageNumber={x+1} width={width} scale={scale} /> )}
      </Document>
    </div>
  );
};

export default PDFReader;
