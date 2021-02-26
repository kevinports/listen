import React, { useState } from 'react';
import './player.css';
import { PlayIcon, PauseIcon, SkipAheadIcon, SkipBackIcon, ShuffleIcon } from '../Icons';

interface PlayerProps {
  track: any;
  onEnd: Function;
  onSkipBack: Function;
  onSkipAhead: Function;
  onToggleShuffle: Function;
  shouldShuffle: boolean;
}

const audioEl = new Audio();
audioEl.crossOrigin = 'anonymous';

const Player: React.FC<PlayerProps> = ({track, onEnd, onSkipBack, onSkipAhead, onToggleShuffle, shouldShuffle}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);


  const handlePlay = () => {
    console.log('play')
    if (isPlaying) return;
    audioEl.play();
    // audioEl.playbackRate = 0.5;
    // audioEl.preservesPitch = false;
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!isPlaying) return;
    audioEl.pause();
    setIsPlaying(false);
  };

  React.useEffect(() => {
    
    audioEl.addEventListener('canplay', handlePlay);
    audioEl.addEventListener('ended', () => {
      onEnd();
    });

    const tickInterval = setInterval(() => {
      setProgress(audioEl.currentTime);
    }, 100);

    return () => {
      clearInterval(tickInterval);
    }
  }, []);

  React.useEffect(() => {
    setProgress(0);
    audioEl.src = track?.src;
  }, [track]);

  const formatTime = (time:any) => {
    // @ts-ignore
    const seconds = parseInt(time % 60).toString().padStart(2, '0');
    // @ts-ignore
    const minutes = parseInt((time / 60) % 60).toString().padStart(1, '0');
    return `${minutes}:${seconds}`;
  }

  return (
    <>
      {track &&
        <div className='player'>
          <div className='playerCoverContainer'>
            <img
              className='playerCover'
              src={track?.encodedImageUrl}
              alt=""
            />
          </div>
          <div>
            <img
              className='playerBG'
              src={track?.encodedImageUrl}
              alt=""
            />
            <div className='playerControlsLeft'>
              <button className='btnSmall' onClick={() => onSkipBack()}>
                <SkipBackIcon />
              </button>
              {!isPlaying
                ? <button onClick={handlePlay}>
                    <PlayIcon />
                  </button>
                : <button onClick={handlePause} >
                    <PauseIcon />
                  </button>
              }
              <button className='btnSmall' onClick={() => onSkipAhead()}>
                <SkipAheadIcon />
              </button>
            </div>
            <div className='playerControlsCenter'>
              <div>{track.common.title} - {track.common.artist}</div>
              {formatTime(progress)}
            </div>

            <div className='playerControlsRight'>
              <button className={shouldShuffle ? 'btnActive' : 'btnInActive'} onClick={() => onToggleShuffle()}>
                <ShuffleIcon />
              </button>
            </div>
          </div>
        </div>
      }

    </>
  );
};

export default Player;
