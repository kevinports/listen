import React, { useEffect, useState } from 'react';
import Player from '../Player';
import './main.css';
import { TrackList } from '../TrackList';
import { useStateWithGetter, useGetAudioFiles } from '../../hooks';
import { Loader } from '../Loader';

const FILES_DIR = '/Users/kevinports/Documents/mp3/';

export const Main = () => {
  const {loading, files, getFiles, setDirectory} = useGetAudioFiles();
  const [currentTrack, setCurrentTrack, getCurrentTrack] = useStateWithGetter(null);
  const [doShuffle, setDoShuffle, getDoShuffle] = useStateWithGetter(false);

  useEffect(() => {
    setDirectory(FILES_DIR);
  },[]);

  const handleShuffle = () => {
    setCurrentTrack(getFiles()[Math.floor(Math.random() * getFiles().length - 1)]);
  }

  const handleSkipAhead = () => {
    if (getDoShuffle()) {
      handleShuffle();
      return;
    }

    const currentIndex = getFiles().findIndex(file => file.id === getCurrentTrack().id);
    let newIndex = 0;
    if (currentIndex < getFiles().length - 1) {
      newIndex = currentIndex + 1;
    }
    setCurrentTrack(getFiles()[newIndex]);
  }

  const handleSkipBack = () => {
    if (getDoShuffle()) {
      handleShuffle();
      return;
    }

    const currentIndex = getFiles().findIndex(file => file.id === getCurrentTrack().id);
    let newIndex = getFiles().length - 1;
    if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    setCurrentTrack(getFiles()[newIndex]);
  }

  const handleToggleShuffle = () => {
    setDoShuffle(!doShuffle);
  }

  if (loading) return (
    <Loader />
  )

  return (
    <div className="main">
      <TrackList 
        files={files}
        currentTrack={currentTrack}
        onSetCurrentTrack={setCurrentTrack}/>

      <Player
        track={currentTrack}
        onEnd={handleSkipAhead}
        onSkipBack={handleSkipBack}
        onSkipAhead={handleSkipAhead}
        onToggleShuffle={handleToggleShuffle}
        shouldShuffle={doShuffle}
      />
    </div>
  );
};