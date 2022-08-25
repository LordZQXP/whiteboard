import React from 'react';
import { Whiteboard } from './lib';
import {saveAs} from 'file-saver';
import styles from './app.module.scss';

const App = () => {
  const [files, setFiles] = React.useState([]);


  React.useEffect(()=>{
    if(files.length >0){
    for(let i=0; i<files.length; i++)
    saveAs(files[i], `page${i+1}.png`);
    }
  },[files])

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
  
  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={4/8} setFiles={setFiles} color={color} />
      </main>
    </div>
  );
};

export default App;
