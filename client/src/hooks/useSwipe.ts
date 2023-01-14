import { useState, TouchEvent, useEffect } from 'react';

const directions = {
  vertical: ['up', 'down'] as const,
  horizontal: ['left', 'right'] as const,
};
type VerticalDirection = typeof directions.vertical[number];
type HorizontalDirection = typeof directions.horizontal[number];

export const useSwipe = () => {
  const [verticalDirection, setVerticalDirection] = useState<
    VerticalDirection | undefined
  >();
  const [horizontalDirection, setHorizontalDirection] = useState<
    HorizontalDirection | undefined
  >();
  const [touchStart, setTouchStart] = useState<TouchEvent | undefined>();
  const [touchEnd, setTouchEnd] = useState<TouchEvent | undefined>();
  useEffect(() => {
    if (!touchStart || !touchEnd) {
      setVerticalDirection(undefined);
      setHorizontalDirection(undefined);
      return;
    }
    if (touchStart && touchEnd) {
      if (touchStart?.timeStamp > touchEnd?.timeStamp) {
        setTouchEnd(undefined);
        return;
      }
      const changedX =
        touchEnd.changedTouches[0].clientX -
        touchStart.changedTouches[0].clientX;
      const changedY =
        touchEnd.changedTouches[0].clientY -
        touchStart.changedTouches[0].clientY;
      const unsignedChangedX = Math.sign(changedX) * changedX;
      const unsignedChangedY = Math.sign(changedY) * changedY;
      if (unsignedChangedX > 10) {
        setHorizontalDirection(changedX < 0 ? 'left' : 'right');
        setTimeout(() => setHorizontalDirection(undefined), 300);
      }
      if (unsignedChangedY > 10) {
        setVerticalDirection(changedY < 0 ? 'up' : 'down');
        setTimeout(() => setVerticalDirection(undefined), 300);
      }
    }
  }, [touchStart, touchEnd]);

  return {
    horizontalDirection,
    verticalDirection,
    setTouchEnd,
    setTouchStart,
  };
};
