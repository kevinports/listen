import React, { useRef, useEffect } from 'react';
import './visualizer.css';

interface VisualizerProps {
  image: any;
  shouldAnimate: Boolean;
  frequency: Number;
}

const Visualizer: React.FC<VisualizerProps> = ({image, shouldAnimate, frequency}) => {
  const el = useRef<HTMLDivElement>();
  const rows = 4;
  const cols = 4;

  // useEffect(() => {
  //   // console.log(frequency);
  //   if (el.current) {
  //     el.current.style.setProperty('--audio-frequency', `${frequency}`);
  //   }
  // }, [frequency])

  const style = {
    "--play-state": shouldAnimate ? 'running' : 'paused',
    "--rows": rows,
    "--cols": cols
  } as React.CSSProperties

  return (
    <div ref={el} className="kaleidoscope" style={style}>
      {[...Array(rows)].map((o, i) => (
        <div className='kaleidoscope__row' key={i + 666}>
          {[...Array(cols)].map((o, j) => (
            <div className='kaleidoscope__cell' key={(i+j)}>
              <img src={image}/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Visualizer;
