import * as mm from 'music-metadata';
import sha1File from 'sha1-file';

export interface AudioFile {
  id: string;
  src: string;
  encodedImageUrl: string;
  duration: number;
  title: string;
  artist: string;
}

export const parseAudioFiles = async (paths): Promise<AudioFile[]> => {
  const files = [];
  for (let path of paths) {
    const metadata = await mm.parseFile(path);
    const picture = metadata.common.picture ? metadata.common.picture[0] : null;
    const encodedImageUrl = picture ? `data:image/jpeg;charset=utf-8;base64, ${picture.data.toString('base64')}` : '';
    files.push({
      id: sha1File.sync(path),
      src: path,
      encodedImageUrl,
      duration: metadata.format.duration,
      title: metadata.common.title,
      artist: metadata.common.artist,
      album: metadata.common.album
    });
  }
  return files;
}
