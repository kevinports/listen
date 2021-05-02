export const formatTime = (time:any) => {
  // @ts-ignore
  const seconds = parseInt(time % 60).toString().padStart(2, '0');
  // @ts-ignore
  const minutes = parseInt((time / 60) % 60).toString().padStart(1, '0');
  return `${minutes}:${seconds}`;
}