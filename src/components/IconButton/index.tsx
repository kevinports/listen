import React from 'react'
import './icon-button.css';

interface IconButtonProps {
  size?: number;
  muted?: boolean; 
  onClick?: () => any;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ muted = false, size, children, className, ...rest }) => {
  const playerStyle = {
    "--size": `${size}rem`
  } as React.CSSProperties

  return (
    <button 
      {...rest}
      className={`icon-button${muted ? ' icon-button--muted' : ''}${className ? ` ${className}` : ''}`}
      style={size ? playerStyle : null}>
      { children }
    </button>
  );
}