import React from 'react';
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: white;
`;

const Item = (props) => {
  return (
    <Draggable draggableId={props.itemId} index={props.index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <p>{props.me}: {props.start} - {props.end}</p>
        </Container>
      )}
    </Draggable>
  );
}
export default Item;