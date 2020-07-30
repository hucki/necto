import React from 'react';
import classes from './Day.module.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import styled from 'styled-components'
import {teamMembers, groups, items} from '../../../assets/data'
import Hour from '../Hour/Hour';
import { Droppable } from 'react-beautiful-dnd';
import Item from '../../Appointments/Item/Item';
dayjs.extend(weekday)

const currentWeek = {}

const hourRange = Array(24).fill(0).map((item, i) => <Hour key={i} />);

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const viewItems = items.map((item, index) => (<Item key={item.id} index={item.id} me={item.title} start={item.start_time.format('DD.MM.YYYY')} end={item.end_time.format('DD.MM.YYYY')} itemId={item.title}/>))
const Day = (props) => {
  return (
    <Container className={classes.Day}>
      <div className={classes.DayHeader}>{props.day}</div>
      <Droppable droppableId={props.columnId}>
        {(provided) => (
          <Container className={classes.Hours}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
          {hourRange}
          {viewItems}

          {provided.placeholder}
        </Container>
        )}
      </Droppable>
    </Container>
  );
}
export default Day;