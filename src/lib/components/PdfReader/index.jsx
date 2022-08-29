import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import styles from './index.module.scss';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import stylesW from '../WhiteBoard/index.module.scss';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFReader = ({ fileReaderInfo, open }) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className={styles.pdfFixedDiv}>
      <Document file={fileReaderInfo} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={window.innerWidth > 500 ? 500 : window.innerWidth} />
      </Document>
      {open && <div className={stylesW.nextFixedButton}> <Button className={stylesW.floatingButtonsZoom} onClick={() => setPageNumber(pageNumber - 1 >0 ? pageNumber - 1 : 1)}><ArrowBackIosNewIcon className={stylesW.blackIcon} /></Button> 
        <p>
          Page {pageNumber} of {numPages}
        </p>
      <Button className={stylesW.floatingButtonsZoom} onClick={() => setPageNumber(pageNumber + 1 <= numPages ? pageNumber+1 : pageNumber)}><ArrowForwardIosIcon /></Button> </div>}
    </div>
  );
};

export default PDFReader;
