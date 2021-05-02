import React, { useRef } from 'react'
import { AudioFile } from '../../utils';
import './track-list.css';

interface TrackListProps {
  files: AudioFile[];
  currentTrack: AudioFile;
  onSetCurrentTrack: Function;
}

export const TrackList: React.FC<TrackListProps> = ({
  files,
  currentTrack,
  onSetCurrentTrack
}) => {
  const currentTrackEl = useRef(null);
  
  React.useEffect(() => {
    currentTrackEl.current?.scrollIntoViewIfNeeded();
  }, [currentTrack]);

  return (
    <div className="track-list">
      <table className="track-list__table">
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
              onClick={() => onSetCurrentTrack(file)}
              className={ isActive ? 'active' : ''}>
                <td>{file.title}</td>
                <td>{file.album ? file.album : '–'}</td>
                <td>{file.artist}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  );
}