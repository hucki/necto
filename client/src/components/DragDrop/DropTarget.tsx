import React, { DragEvent, useState } from 'react';

type DropTargetProps = {
  onItemDropped: (droppedItem: string) => void
  dropEffect: 'link' | 'none' | 'copy' | 'move'
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined
}

const insideStyle = {
  backgroundColor: '#cccccc',
  opacity: 0.5
};

const DropTarget = (props: DropTargetProps) => {
  const [isOver, setIsOver] = useState(false);
  const dragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = props.dropEffect;
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    const droppedItem = event.dataTransfer.getData('drag-item');
    if (droppedItem) {
      props.onItemDropped(droppedItem);
    }
    setIsOver(false);
  };

  const dragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.dropEffect = props.dropEffect;
    setIsOver(true);
  };

  const dragLeave = (event: DragEvent<HTMLDivElement>) => {
    setIsOver(false);
  };

  return <>
    <div
      className="drop-target"
      onDragOver={dragOver}
      onDrop={drop}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      style={{width: '100%', height: '100%'}}
    >
      {props.children}
    </div>
  </>;
};

export default DropTarget;