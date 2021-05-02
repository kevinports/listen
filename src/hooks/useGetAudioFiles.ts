import { useEffect, useState } from 'react';
import { walkSync, parseAudioFiles } from '../utils';
import { useStateWithGetter } from './useStateWithGetter';
import db from '../db';

export function useGetAudioFiles() {
  const [directory, setDirectory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles, getFiles] = useStateWithGetter([]);

  useEffect(() => {
    const cachedDir = db.get('directory').value();
    if (cachedDir) setDirectory(cachedDir);
  }, []);

  useEffect(() => {
    if (!directory) return;

    let hasNewDir = false;
    const cachedDir = db.get('directory').value();
    if (directory !== cachedDir) {
      hasNewDir = true;
      db.set('directory', directory).write();
    }

    const cachedFiles = db.get('audioFiles').value();
    if (cachedFiles && !hasNewDir) {
      setLoading(false);
      setFiles(cachedFiles);
    } else {
      (async () => {
        const filePaths = walkSync(directory, []);
        const files = await parseAudioFiles(filePaths);
        db.set('audioFiles', files).write();
        setLoading(false);
        setFiles(files);
      })();
    }

  }, [directory]);

  return { loading, files, getFiles, setDirectory };
}
