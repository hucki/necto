import React, { DragEvent, useState } from 'react';

type DragProps = {
  dataItem: string
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
}

const Drag = (props: DragProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (event: DragEvent<HTMLDivElement>) => {
    // console.log('drag');
    setIsDragging(true);
    event.dataTransfer.setData('drag-item', props.dataItem);
  };

  const endDrag = (event: DragEvent<HTMLDivElement>) => {
    // console.log('stop drag');
    setIsDragging(false);
  };
  return <>
    <div
      className="drag"
      draggable={true}
      onDragStart={startDrag}
      onDragEnd={endDrag}
      style={{width: '100%', ...(isDragging ? {color: 'red'} : {})}}
    >
      {props.children}
    </div>
  </>;
};

export default Drag;