import React from 'react';
import { Whiteboard } from './lib';
import styles from './app.module.scss';

const App = () => {
  const [files, setFiles] = React.useState([]);
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
        <Whiteboard aspectRatio={4 / 3} setFiles={setFiles} color={color} />
      </main>
    </div>
  );
};

export default App;
