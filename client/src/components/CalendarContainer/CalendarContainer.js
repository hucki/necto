import React from 'react';
import classes from './CalendarContainer.module.css';
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment';

const teamMembers = [
  { id: 1, firstName: 'Mitchell', lastName: 'Bidmead', color: 'black'},
  { id: 2, firstName: 'Gigi', lastName: 'Blitzer', color: 'green'},
  { id: 3, firstName: 'Trisha', lastName: 'Bernollet', color: 'red'},
  { id: 4, firstName: 'Charlie', lastName: 'Horsburgh', color: 'yellow'},
  { id: 5, firstName: 'Forbes', lastName: 'Elgy', color: 'blue'},
  { id: 6, firstName: 'Alfie', lastName: 'Dainton', color: 'olive'},
  { id: 7, firstName: 'Andriette', lastName: 'Delagua', color: 'purple'},
  { id: 8, firstName: 'Jojo', lastName: 'Heigl', color: 'orange'},
  { id: 9, firstName: 'Pearce', lastName: 'Ungerecht', color: 'pink'},
  { id: 10, firstName: 'Alanah', lastName: 'Bentje', color: 'green'}
]
const keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};
const groups = [
  { id: 1, title: 'group 1' },
  { id: 2, title: 'group 2' }
]

const items = [
  { id: 1, group: 1, title: 'item 1', start_time: moment(), end_time: moment().add(1, 'hour')},
  { id: 2, group: 2, title: 'item 2', start_time: moment().add(-0.5, 'hour'), end_time: moment().add(0.5, 'hour')},
  { id: 3, group: 1, title: 'item 3', start_time: moment().add(2, 'hour'), end_time: moment().add(3, 'hour')}
]

const CalendarContainer = () => {

  return (
    <div className={classes.Week}>
      <Timeline
      groups={groups}
      items={items}
      keys={keys}
      sidebarContent={<div>Above The Left</div>}
      itemsSorted
      itemTouchSendsClick={false}
      stackItems
      itemHeightRatio={0.75}
      showCursorLine
      canMove={false}
      canResize={false}
      defaultTimeStart={moment().add(-12, 'hour')}
      defaultTimeEnd={moment().add(12, 'hour')}
      //visibleTimeEnd={moment().add(-12, 'hour')}
      //visibleTimeStart={moment().add(12, 'hour')}
    >
    <TimelineHeaders className="sticky">
          <SidebarHeader>
            {/* {({ getRootProps }) => {
              return <div {...getRootProps()}>Left</div>;
            }} */}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
      {/* <div className={classes.Weekdays}>

      </div>

      <div className={classes.Weekend}></div> */}
    </div>
  );
}
export default CalendarContainer;