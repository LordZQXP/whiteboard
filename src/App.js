import React from 'react';
import { Whiteboard } from './lib';
import styles from './app.module.scss';

const App = () => {
  const [files, setFiles] = React.useState([]);
  
  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={4 / 3} setFiles={setFiles} color="#ff0019"/>
      </main>
    </div>
  );
};

export default App;
