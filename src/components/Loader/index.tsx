import React, { useEffect, useState } from 'react'
import './loader.css';

export const Loader: React.FC<{}> = () => {
  const [doShow, setDoShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDoShow(true), 300);

    return () => {
      clearTimeout(timer);
    }
  }, []);

  return doShow
    ? (
      <div className="loader">
        Syncing your files...
      </div>
    )
    : null;
}