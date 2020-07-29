# necto

📅 Appointment Scheduling for Teams of Therapists

## TODO
andre's comment:
> Hey, Stefan! I think this is a great idea and certainly an original one. I would suggest to focus on implementing the adding appointments with different frequencies to a calendar in a way that would be great for the users. Once you have that working well, then I would focus on implementing the team features. Overall I think you are in the right track and I'm looking forward to following your progress

**frontend**
- [ ] define Structure
  - [ ] Components / libs
- [ ] create-react-app
- [ ]
- [ ]
- [ ]
**backend**

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