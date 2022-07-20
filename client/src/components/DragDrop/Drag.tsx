import React, { DragEvent, useState } from 'react';

type DragProps = {
  dataItem: string
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
}

const Drag = (props: DragProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (event: DragEvent<HTMLDivElement>) => {
    // console.log('drag');
    setTimeout(() => setIsDragging(true),0);
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
      style={{width: '100%', ...(isDragging ? {display: 'none'} : {})}}
    >
      {props.children}
    </div>
  </>;
};

export default Drag;