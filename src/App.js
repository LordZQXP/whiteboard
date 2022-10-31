import React from 'react';
import { Whiteboard } from './lib';
import { saveAs } from 'file-saver';
import styles from './app.module.scss';
import { object } from './object';
import { object2 } from './obejct2';
import { object3 } from './object3';
import { object4 } from './object4';
import { object5 } from './object5';
import { object1_1 } from './object1_1';
import { object1_2 } from './object1_2';
import { object1_4 } from './object3_2';
import { object7 } from './object7';
import { object77 } from './object77';

const App = () => {
  const [files, setFiles] = React.useState({});
  const [resendFiles, setResendFiles] = React.useState(false);

  const [screenWidth, setScreenWidth] = React.useState(898);


  // const [canvasJSON, setCanvasJSON] = React.useState([{ screen: 898, object: object }, { screen: 1424, object: object2 }, { screen: 1424, object: object3 }, { screen: 1424, object: object4 }, {screen: 1424, object : object5}]);

  const [canvasJSON, setCanvasJSON] = React.useState([
    {
      screen : 1424,
      object : object1_4
    },
    {
      screen: 1424,
      object: object7
    },
    {
      screen: 1314,
      object: object77
    }
  ]);


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
        <Whiteboard aspectRatio={4 / 6} pdf={"https://stemboard-stagging.s3.amazonaws.com/549621296791/1665415370579.pdf"} setFiles={setFiles} setResendFiles={setResendFiles} color={color} json={canvasJSON} setJSON={setCanvasJSON} pdfUrl={pdfUrl} resend={true} revision={false} buttonFlag={true} jsonScreenWidth={screenWidth} setJSONScreenWidth={setScreenWidth} />
      </main>
    </div>
  );
};

export default App;
