import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import styles from '../PdfReader/index.module.scss';
import styles2 from '../WhiteBoard/index.module.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button } from '@mui/material';
import SimpleBackdrop from '../CircularProgress';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFCanvas = ({ fileCanvasInfo, updateFileCanvasInfo, back, next, setSubmitPdf, extend, revision }) => {
    const [spinnerValue, setSpinnerValue] = React.useState(true);
    const [totalIndex, setTotalIndex] = React.useState(1);
    function onRenderSuccess() {
        const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
        const pdfAsImageSrc = importPDFCanvas.toDataURL();
        updateFileCanvasInfo({ currentPage: pdfAsImageSrc });
    }

    function onDocumentLoadSuccess({ numPages }) {
        setSpinnerValue(false);
        updateFileCanvasInfo({ totalPages: numPages });
        setTotalIndex(numPages);
        if(numPages === 1)
            setSubmitPdf(true);
    }

    function changePage(offset) {
        updateFileCanvasInfo({ currentPageNumber: fileCanvasInfo.currentPageNumber + offset });
    }
    
    function submitPdf() {
        setSubmitPdf(true);
    }

    const nextPage = () => {
        if (fileCanvasInfo.currentPageNumber + 1 <=  fileCanvasInfo.totalPages){
            changePage(1);
            next();
        }
        else if(fileCanvasInfo.currentPageNumber +1 > fileCanvasInfo.totalPages){
            console.log("NIceeee");
            updateFileCanvasInfo({ totalPages: fileCanvasInfo.currentPageNumber + 1 });
            extend();
            changePage(1);
            setTotalIndex(Math.max(totalIndex, fileCanvasInfo.currentPageNumber+1));
        }
        if(fileCanvasInfo.currentPageNumber+1 == fileCanvasInfo.totalPages)
        submitPdf(); 
    };
    const previousPage = () => {
        changePage(-1);
        back();
    };

    return (
        <div>
            <div className={styles.fileContainer}>
               { spinnerValue && <SimpleBackdrop open={true} />}
                <Document
                    className={styles.document}
                    file={fileCanvasInfo.file}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page
                        className="import-pdf-page"
                        onRenderSuccess={onRenderSuccess}
                        pageNumber={fileCanvasInfo.currentPageNumber}
                    />
                </Document>
            </div>
            <div className={styles2.nextFixedButton}>
                <Button
                    className={styles2.floatingButtonsZoom}
                    disabled={fileCanvasInfo.currentPageNumber <= 1}
                    onClick={previousPage}
                    >
                    <ArrowBackIosNewIcon className={styles2.blackIcon} />
                </Button>
                    <p>
                    Page {fileCanvasInfo.currentPageNumber} of {totalIndex || '--'}
                    </p>
                <Button
                    className={styles2.floatingButtonsZoom}
                    disabled={fileCanvasInfo.currentPageNumber >= fileCanvasInfo.totalPages && !revision}
                    onClick={nextPage}
                >
                    <ArrowForwardIosIcon />
                </Button>
            </div>
        </div>
    );
};

export default PDFCanvas;