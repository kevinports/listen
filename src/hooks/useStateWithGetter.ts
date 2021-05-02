import React, { useCallback, useEffect, useRef } from 'react';

export function useStateWithGetter(initial: any) {
  const ref = useRef(initial);
  const [state, setState] = React.useState(initial);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  const getState = useCallback(() => {
    return ref.current;
  }, []);

  return [state, setState, getState];
}
