import React from 'react';
import { Whiteboard } from './lib';
import styles from './app.module.scss';

const App = () => {
  const [files, setFiles] = React.useState([]);
  React.useEffect(()=>{
    console.log(files,"Nieee");
  },[files]);
  return (
    <div className={styles.app}>
      <main>
        <Whiteboard aspectRatio={4 / 3} setFiles={setFiles} />
      </main>
    </div>
  );
};

export default App;
