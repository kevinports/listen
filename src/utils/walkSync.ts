import fs from 'fs';

export const walkSync = (dir: string, filelist = []): string[] => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const extension = file.split('.').pop() + '';
    
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(`${dir + file}/`, filelist);
    } else if (['flac', 'mp3', 'wav', 'm4a'].includes(extension)) {
      filelist.push(dir + file);
    }
  });

  return filelist;
};
