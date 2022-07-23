import { useState, TouchEvent, useEffect } from 'react';

type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export const useSwipe = () => {
  const [direction, setDirection] = useState<SwipeDirection | undefined>();
  const [touchStart, setTouchStart] = useState<TouchEvent | undefined>();
  const [touchEnd, setTouchEnd] = useState<TouchEvent | undefined>();

  useEffect(() => {
    if (!touchStart || !touchEnd) {
      setDirection(undefined);
      return;
    }
    if (touchStart && touchEnd ) {
      if (touchStart?.timeStamp > touchEnd?.timeStamp) {
        setTouchEnd(undefined);
        return;
      }
      // TODO: implement up/down
      const changedX = touchEnd.changedTouches[0].clientX - touchStart.changedTouches[0].clientX;
      const changedY = touchEnd.changedTouches[0].clientY - touchStart.changedTouches[0].clientY;
      const unsignedChangedX = Math.sign(changedX)*changedX;
      if (unsignedChangedX > 10) setDirection(changedX < 0 ? 'left' : 'right');
    }
  }, [touchStart, touchEnd]);

  return {
    direction,
    setTouchEnd,
    setTouchStart
  };
};