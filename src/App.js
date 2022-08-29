import React from 'react';
import { Whiteboard } from './lib';
import {saveAs} from 'file-saver';
import styles from './app.module.scss';

const App = () => {
  const [files, setFiles] = React.useState({});
  const [canvasJSON, setCanvasJSON] = React.useState({});

  let source = "https://i.postimg.cc/Dw97bv23/image-7.png";
  
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
    const json = async()=>{
    if (Object.values(canvasJSON).length > 0) {
      const response = await fetch("http://localhost:4000/api/v1/canvas",{
        method:'POST',
        headers:{
          'Content-type' : 'application/json'
        },
        body : JSON.stringify({
          body: Object.values(canvasJSON)[0]
        })
      })
    }
  }
  json();
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
  let number = Math.floor((Math.random() * 100) + 1);

  const pdfUrl = "https://thirdinrev.s3.ap-south-1.amazonaws.com/invoice/104/Invoice.pdf"
  
  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={width/(height-150)} setFiles={setFiles} color={color} setJSON={setCanvasJSON} src={number % 2 === 0 && source} pdfUrl={pdfUrl} />
      </main>
    </div>
  );
};

export default App;
