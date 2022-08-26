import React from 'react';
import { Whiteboard } from './lib';
import {saveAs} from 'file-saver';
import styles from './app.module.scss';

const App = () => {
  const [files, setFiles] = React.useState({});
  const [canvasJSON, setCanvasJSON] = React.useState({});

  React.useEffect(()=>{
    if(Object.values(files).length >0){
    for (let i = 0; i < Object.values(files).length; i++){
      saveAs(Object.values(files)[i], `page${i+1}.png`);
      }
    }
    if (Object.values(files).length >0)
    window.location.reload();
  },[files])

  React.useEffect(() => {
    if (Object.values(canvasJSON).length > 0) {
      for (let i = 0; i < Object.values(canvasJSON).length; i++) {
        console.log(Object.values(canvasJSON)[i]);
      }
    }
  }, [canvasJSON])

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
      color:'#f700ff'
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

  ]

  const width = window.innerWidth;
  const height = window.innerHeight;
  
  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={width/(height-100)} setFiles={setFiles} color={color} setJSON={setCanvasJSON} />
      </main>
    </div>
  );
};

export default App;
