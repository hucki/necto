# necto

📅 Appointment Scheduling for Teams of Therapists

## TODO
andre's comment:
> I would suggest to focus on implementing the adding appointments with different frequencies to a calendar in a way that would be great for the users. Once you have that working well, then I would focus on implementing the team features. Overall I think you are in the right track and I'm looking forward to following your progress

https://github.com/atlassian/react-beautiful-dnd
https://www.chartjs.org

**general**
- [ ] setup OSS license (GPL / MIT)
- [ ] decide which calendar to use
  - [o] react-big-calendar -> no. even more deprecated ans unsafe methods used
  - [ ] react-calendar-timeline -> second try, although uses deprecated context API (https://reactjs.org/docs/context.html#legacy-api)
  - [o] semantic-ui-react -> i will not build the calendar by hand
  - [ ] Fullcalendar.io scheduler license: schedulerLicenseKey= 'GPL-My-Project-Is-Open-Source'
  - [ ] ToastUI Calendar

**frontend**
- [x] define Structure (components)
- [ ] create-react-app
- [ ] install libraries
  - [ ] redux for state manangement
- [ ] connect API
- [ ] color schema

**backend**
- [ ] define Models
- [ ] setup express/mongoose


**authentication**
- [ ]

## FrontEnd structure
```
|_APP
  |_Header
  | |_Logo
  | |_Menu
  |_Dashboard
  | |_Calendar
  |   |_AppointmentView
  |     |_AppointmentDefinition
  |_Teams
  | |_TeamsList
  |   |_TeamMemberList
  |     |_TeamMemberView
  |       |_TeamMemberDefinition
  |_Footer
      |_Imprint


```
## Project description

App to keep track of the appointments of a team of therapists, where each appointment has a defined frequency (i.e. weekly) and a number of recurrences (i.e. 10 times). The App provides an overview of appointments for the hole team, as well as personal views for each team member. Single appointments can be moved to different dates/times/therapists without necessarily affecting the rest of the recurring appointments.

Additional features could include:

- User role "team leader"
  - can add/remove team members
  - can setup schedules for other team members
- introduce clients / patients dataset + tie to appointments
  - waiting list for new clients / patients
- time tracking and statistics for team members

## MVP

Users should be able to create, read, update and delete their own appointments and view the appointments of their team.

## Tech stack
### Front End:

- React
- possible calendar components:
  - react calendar timeline
  - Fullcalenbdar.io scheduler license: schedulerLicenseKey= 'GPL-My-Project-Is-Open-Source'
  - ToastUI Calendar
- styles: AntD + Day.js (instead of moment.js)

### Back End:

- NodeJS
- Express
- MongoDB
- Mongoose

### Data sources
- local holidays: date-holidays
- additional mock Data: Mock Data
  i.e. Team Members / appointments