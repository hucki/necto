import React from 'react';
import Timetable from 'timetable.js';

const timetable = new Timetable()
timetable.addLocations(['Silent Disco', 'Nile', 'Len Room', 'Maas Room']);
timetable.addEvent('Frankadelic', 'Nile', new Date(2015,7,17,10,45), new Date(2015,7,17,12,30));
const renderer = new Timetable.Renderer(timetable);

//renderer.draw('.timetable')
const TimetableContainer = () => {
  return (
    <div className='timetable'>timetable</div>
  )
}

export default TimetableContainer