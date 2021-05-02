import React, { useState } from 'react';
import './player.css';
import Visualizer from '../Visualizer';
import { PlayIcon, PauseIcon, SkipAheadIcon, SkipBackIcon, ShuffleIcon, CloseIcon, ChevronUpIcon, ChevronDownIcon } from '../Icons';
import { AudioFile, formatTime, remap } from '../../utils';
import { IconButton } from '../IconButton';

interface PlayerProps {
  track: AudioFile;
  onEnd: Function;
  onSkipBack: Function;
  onSkipAhead: Function;
  onToggleShuffle: Function;
  shouldShuffle: boolean;
}

const audioEl = new Audio();
audioEl.crossOrigin = 'anonymous';

const audioCtx = new AudioContext();

const analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = 0.5;

const source = audioCtx.createMediaElementSource(audioEl);
let frequencyData = new Uint8Array(analyser.frequencyBinCount);

source.connect(analyser);
source.connect(audioCtx.destination);

const Player: React.FC<PlayerProps> = ({track, onEnd, onSkipBack, onSkipAhead, onToggleShuffle, shouldShuffle}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioFrequency, setAudioFrequency] = useState(100);

  React.useEffect(() => {
    audioEl.addEventListener('canplay', handlePlay);
    audioEl.addEventListener('ended', () => {
      onEnd();
    });

    // processAudioFrequency();

    const tickInterval = setInterval(() => {
      setProgress(audioEl.currentTime);
    }, 500);

    return () => {
      clearInterval(tickInterval);
    }
  }, []);

  React.useEffect(() => {
    console.log(track)
    if (!track) return;
    setProgress(0);
    audioEl.src = track?.src;
  }, [track]);

  const handlePlay = () => {
    if (isPlaying) return;
    audioEl.play();
    audioEl.playbackRate = 1;
    // audioEl.preservesPitch = false;
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (!isPlaying) return;
    audioEl.pause();
    setIsPlaying(false);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  }

  const processAudioFrequency = () => {
    analyser.getByteFrequencyData(frequencyData);
    let total = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      total += frequencyData[i];
    }
    let avg = total / frequencyData.length;
    avg = Math.floor(remap(avg, 0, 255, 2, 20));
    setAudioFrequency(avg);
    requestAnimationFrame(processAudioFrequency);
  }

  const hasImage = track?.encodedImageUrl ? true : false;
  const showVisualizer = (hasImage && isExpanded);

  // console.log(hasImage, playerStyle);

  return (
    <>
      {track &&
        <div className={`player${showVisualizer ? ' player--with-visualizer' : ''}`}>

          {hasImage &&
            <img className="player__bg" src={track?.encodedImageUrl} />
          }
          
          {showVisualizer &&
            <>
              <div className='player__cover-container'>
                <img
                  className='player__cover'
                  src={track.encodedImageUrl}
                  alt=""
                />
              </div> 
              <Visualizer frequency={audioFrequency} image={track.encodedImageUrl} shouldAnimate={isPlaying} />
            </>
          }
        
          <div className='player__controls'>
            <div className='player__controls-left'>
              <IconButton onClick={() => onSkipBack()}>
                <SkipBackIcon />
              </IconButton>

              {!isPlaying
                ? <IconButton size={2} onClick={handlePlay}>
                    <PlayIcon />
                  </IconButton>
                : <IconButton size={2} onClick={handlePause} >
                    <PauseIcon />
                  </IconButton>
              }

              <IconButton onClick={() => onSkipAhead()}>
                <SkipAheadIcon />
              </IconButton>
            </div>

            <div className='player__controls-center'>
              <div className='player-controls__title'>{track.title} - {track.artist}</div>
              {`${formatTime(progress)} / ${formatTime(track.duration)}`}
            </div>

            <div className='player__controls-right'>
              <IconButton muted={!shouldShuffle} onClick={() => onToggleShuffle()}>
                <ShuffleIcon />
              </IconButton>

              <IconButton onClick={handleToggleExpand}>
                {!isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />} 
              </IconButton>
              
            </div>
          </div>
        </div>
      }

    </>
  );
};

export default Player;
