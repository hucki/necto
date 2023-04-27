import { useState, TouchEvent, useEffect } from 'react';

const directions = {
  vertical: ['up', 'down'] as const,
  horizontal: ['left', 'right'] as const,
};
const thresholdDirection = 20;
const thresholdVelocity = 0.1; // velocity in px/ms

type VerticalDirection = (typeof directions.vertical)[number];
type HorizontalDirection = (typeof directions.horizontal)[number];

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
      const timeSpent = touchEnd.timeStamp - touchStart.timeStamp;
      const changedX =
        touchEnd.changedTouches[0].clientX -
        touchStart.changedTouches[0].clientX;
      const changedY =
        touchEnd.changedTouches[0].clientY -
        touchStart.changedTouches[0].clientY;
      const velocityX = Math.abs(changedX / timeSpent);
      const velocityY = Math.abs(changedY / timeSpent);
      const unsignedChangedX = Math.sign(changedX) * changedX;
      const unsignedChangedY = Math.sign(changedY) * changedY;
      if (
        unsignedChangedX > thresholdDirection &&
        velocityX > thresholdVelocity
      ) {
        setHorizontalDirection(changedX < 0 ? 'left' : 'right');
        setTimeout(() => setHorizontalDirection(undefined), 300);
      }
      if (
        unsignedChangedY > thresholdDirection &&
        velocityY > thresholdVelocity
      ) {
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
