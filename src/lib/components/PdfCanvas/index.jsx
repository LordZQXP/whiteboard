import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import styles from '../PdfReader/index.module.scss';
import styles2 from '../WhiteBoard/index.module.scss';
import ArrowLeft from '../WhiteBoard/images/left.svg';
import ArrowRight from '../WhiteBoard/images/right.svg';
import { Button, CircularProgress } from '@mui/material';
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
            { !spinnerValue && fileCanvasInfo.totalPages > 1 && <div className={styles2.nextFixedButton}>
                    <p>
                    Page {fileCanvasInfo.currentPageNumber} of {totalIndex || '--'}
                    </p>
                {fileCanvasInfo.currentPageNumber > 1 && (
                    <Button
                        className={styles2.floatingButtonsZoom}
                        onClick={previousPage}
                        >
                        <img src={ArrowLeft} style={{ width: '20px', height: '20px' }} />
                    </Button>
                )}
                {fileCanvasInfo.currentPageNumber < fileCanvasInfo.totalPages && (
                    <Button
                        className={styles2.floatingButtonsZoom}
                        onClick={nextPage}
                    >
                        <img src={ArrowRight} style={{ width: '20px', height: '20px' }} />
                    </Button>
                )}
            </div>}
        </div>
    );
};

export default PDFCanvas;