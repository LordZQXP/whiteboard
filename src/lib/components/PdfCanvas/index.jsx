import React from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { pdfjs } from 'react-pdf';
import styles from '../PdfReader/index.module.scss';
import styles2 from '../WhiteBoard/index.module.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFCanvas = ({ fileCanvasInfo, updateFileCanvasInfo, back, next }) => {
    function onRenderSuccess() {
        const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
        const pdfAsImageSrc = importPDFCanvas.toDataURL();

        updateFileCanvasInfo({ currentPage: pdfAsImageSrc });
    }

    function onDocumentLoadSuccess({ numPages }) {
        updateFileCanvasInfo({ totalPages: numPages });
    }

    function changePage(offset) {
        updateFileCanvasInfo({ currentPageNumber: fileCanvasInfo.currentPageNumber + offset });
    }

    const nextPage = () => {
        changePage(1)
        next();
    };
    const previousPage = () => {
        changePage(-1);
        back();
    };

    return (
        <div>
            <div className={styles.fileContainer}>
                <Document
                    className={styles.document}
                    file={fileCanvasInfo.file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadProgress={({ loaded, total }) =>
                        console.log('Loading a document: ' + (loaded / total) * 100 + '%')
                    }
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
                    <span>
                        {fileCanvasInfo.currentPageNumber}-{fileCanvasInfo.totalPages || '--'}
                    </span>
                <Button
                    className={styles2.floatingButtonsZoom}
                    disabled={fileCanvasInfo.currentPageNumber >= fileCanvasInfo.totalPages}
                    onClick={nextPage}
                >
                    <ArrowForwardIosIcon />
                </Button>
            </div>
        </div>
    );
};

export default PDFCanvas;