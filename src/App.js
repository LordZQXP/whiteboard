import React from 'react';
import { Whiteboard } from './lib';
// import { saveAs } from 'file-saver';
import styles from './app.module.scss';
import { object } from './object';

const App = () => {
  const [files, setFiles] = React.useState({});
  const [resendFiles, setResendFiles] = React.useState(false);

  const [screenWidth, setScreenWidth] = React.useState(1424);


  const [canvasJSON, setCanvasJSON] = React.useState(object);
  // React.useEffect(() => {
  //   if (Object.values(files).length > 0) {
  //     if (resendFiles) {

  //     }
  //     // for (let i = 0; i < Object.values(files).length; i++) {
  //     //   saveAs(Object.values(files)[i], `page${i + 1}.png`);
  //     // }
  //   }

  //   // if (Object.values(files).length > 0)
  //   //   window.location.reload();
  // }, [files, resendFiles]);

  React.useEffect(() => {
    console.log(JSON.stringify(canvasJSON));
  }, [canvasJSON]);


  React.useEffect(() => {
    console.log(screenWidth);
  }, [screenWidth]);

  const color = [
    {
      title: 'red',
      color: '#ff0019'
    },
    {
      title: 'yellow',
      color: '#ffc400'
    },
    {
      title: 'black',
      color: '#000000'
    },
    {
      title: 'green',
      color: '#59ff0d'
    },
    {
      title: 'pink',
      color: '#f700ff'
    },
    {
      title: 'purple',
      color: '#8000ff'
    },
    {
      title: 'cyan',
      color: '#00c9c3'
    },
    {
      title: 'blue',
      color: '#021ff7'
    },
  ];

  const pdfUrl = "https://stemboard-stagging.s3.amazonaws.com/545148257444/1662064901130.pdf";

  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={4 / 6} pdf={"https://stemboard-stagging.s3.amazonaws.com/549621296791/1665415370579.pdf"} setFiles={setFiles} setResendFiles={setResendFiles} color={color} json={canvasJSON} setJSON={setCanvasJSON} pdfUrl={pdfUrl} resend={true} revision={false} buttonFlag={true} jsonScreenWidth={898} setJSONScreenWidth={setScreenWidth} />
      </main>
    </div>
  );
};

export default App;
