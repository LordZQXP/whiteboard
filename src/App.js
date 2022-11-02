import React from 'react';
import { Whiteboard } from './lib';
import { saveAs } from 'file-saver';
import styles from './app.module.scss';


const App = () => {
  const [files, setFiles] = React.useState({});
  const [resendFiles, setResendFiles] = React.useState(false);

  const [screenWidth, setScreenWidth] = React.useState(1424);

  const [canvasJSON, setCanvasJSON] = React.useState([]);


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

  const pdfUrl = "https://stemboard-stagging.s3.amazonaws.com/560698803371/1667381783118.pdf";

  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={4 / 6} pdf={"https://stemboard-stagging.s3.amazonaws.com/560698803371/1667381783118.pdf"} setFiles={setFiles} setResendFiles={setResendFiles} color={color} json={canvasJSON} setJSON={setCanvasJSON} jsonScreenWidth={screenWidth} setJSONScreenWidth={setScreenWidth} pdfUrl={pdfUrl} resend={true} revision={false} buttonFlag={true}  />
      </main>
    </div>
  );
};

export default App;
