import React, { useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import fs from 'fs';
import * as mm from 'music-metadata';
import sha1File from 'sha1-file';
import Player from './components/Player';
import './App.css';

const filesDir = '/Users/kevinports/Documents/audio-collection/';

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    const extension:string = file.split('.').pop() + '';
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(`${dir + file}/`, filelist);
    } else if (['flac', 'mp3', 'wav', 'm4a'].includes(extension)) {
      filelist.push(dir + file);
    }
  });
  return filelist;
};

let filePaths:any = walkSync(filesDir, []);

async function parseFiles(paths) {
  const files = [];
  for (let path of paths) {
    const metadata = await mm.parseFile(path);
    const picture = metadata.common.picture ? metadata.common.picture[0] : null;
    const encodedImageUrl = picture ? `data:image/jpeg;charset=utf-8;base64, ${picture.data.toString('base64')}` : '';
    files.push({
      id: sha1File.sync(path),
      src: path,
      encodedImageUrl,
      ...metadata
    });
  }
  return files;
}

const Root = () => {
  const currentTrackEl = useRef(null);
  const [doShuffle, setDoShuffle] = React.useState(false);
  
  const [files, _setFiles] = React.useState([]);
  const filesRef = React.useRef(files);
  const setFiles = (list) => {
    filesRef.current = list;
    _setFiles(list);
  };

  const [currentTrack, _setCurrentTrack] = React.useState(null);
  const currentTrackRef = React.useRef(currentTrack);
  const setCurrentTrack = (track) => {
    currentTrackRef.current = track;
    _setCurrentTrack(track);
  };

  React.useEffect(() => {
    parseFiles(filePaths).then((_files) => {
      setFiles(_files);
    });
  }, []);

  React.useEffect(() => {
    currentTrackEl.current?.scrollIntoViewIfNeeded();
    console.log(currentTrackRef)
  }, [currentTrack]);

  const handleShuffle = () => {
    setCurrentTrack(filesRef.current[Math.floor(Math.random() * filesRef.current.length - 1)]);
  }

  const handleTrackEnd = () => {
    handleSkipAhead();
  };

  const handleSkipAhead = () => {
    if (doShuffle) {
      handleShuffle();
      return;
    }

    const currentIndex = filesRef.current.findIndex(file => file.id === currentTrackRef.current.id);
    let newIndex = 0;
    if (currentIndex < filesRef.current.length - 1) {
      newIndex = currentIndex + 1;
    }
    setCurrentTrack(filesRef.current[newIndex]);
  }

  const handleSkipBack = () => {
    if (doShuffle) {
      handleShuffle();
      return;
    }

    const currentIndex = filesRef.current.findIndex(file => file.id === currentTrackRef.current.id);
    let newIndex = filesRef.current.length - 1;
    if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    setCurrentTrack(filesRef.current[newIndex]);
  }

  const handleToggleShuffle = () => {
    setDoShuffle(!doShuffle);
  }

  return (
    <>
      <h1>Trackz</h1>
      <div className="Browser">

        <table>
          <thead>
            <tr>
              <td>Track</td>
              <td>Album</td>
              <td>Artist</td>
            </tr>
          </thead>
          <tbody>
          {files && files.map((file: any) => {
            const isActive = (currentTrack && currentTrack.id === file.id);
            return (
              <tr
                key={file.id}
                ref={isActive ? currentTrackEl : null}
                onClick={() => setCurrentTrack(file)}
                className={ isActive ? 'active' : ''}>
                  <td>{file.common.title}</td>
                  <td>{file.common.album ? file.common.album : '–'}</td>
                  <td>{file.common.artist}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>

      <Player
        track={currentTrack}
        onEnd={handleTrackEnd}
        onSkipBack={handleSkipBack}
        onSkipAhead={handleSkipAhead}
        onToggleShuffle={handleToggleShuffle}
        shouldShuffle={doShuffle}
      />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Root} />
      </Switch>
    </Router>
  );
}
