# necto

[![shields.io](https://img.shields.io/github/last-commit/hucki/necto?style=flat-square)](https://shields.io)
[![shields.io](https://img.shields.io/github/languages/top/hucki/necto?style=flat-square)](https://shields.io)
[![shields.io](https://img.shields.io/badge/made%20with-🍕-green?style=flat-square)](https://shields.io)

📅 Appointment scheduling for teams in a health care environment

![](./public/Necto.png)

necto provides teams with the ability to schedule appointments with patients/clients on a weekly basis. The number of weekly appointment a team member has to fulfill can be indivdually defined. Every Appointment can be defined as in House or as a home visit.

## Getting started

1. clone the repo

`git clone https://github.com/hucki/necto.git`

2. install the dependencies

`npm install`

3. setup a postgres Database

4. setup `/server/.env` file (see `/server/.env.example`)

to get started set `NODE_ENV=development` and use the .env Variables prefixed with `DEV_DB_[...]` for your DB

5. start necto

`npm start`

6. enjoy scheduling 📅!

## Project description

App to keep track of the appointments of a team of therapists, where each appointment has a defined frequency (i.e. weekly) and a number of recurrences (i.e. 10 times). The App provides an overview of appointments for the hole team, as well as personal views for each team member. Single appointments can be moved to different dates/times/therapists without necessarily affecting the rest of the recurring appointments.

Additional features could include:

- User role "team leader"
  - can add/remove team members
  - can setup schedules for other team members
- introduce clients / patients dataset + tie to appointments
  - waiting list for new clients / patients
- time tracking and statistics for team members

## Tech stack

### Front End:

- [React](https://reactjs.org)
- [React Redux](https://react-redux.js.org/)
- [React Query](https://github.com/tannerlinsley/react-query)
- (wip): [TypeScript](https://www.typescriptlang.org)
- [Day.js](https://day.js.org)
- [Ant Design](https://ant.design)

### Back End:

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Sequelize ORM](https://sequelize.org)
- [PostgreSQL](https://www.postgresql.org)

## Future Plans

- [ ] implement Authentication
- [ ] convert FrontEnd to Typescript
- [ ] embed local holidays: [date-holidays](https://www.npmjs.com/package/date-holidays)

## Contributors

[Stefan Huckschlag](https://github.com/hucki)

## License

MIT © [Stefan Huckschlag](https://github.com/hucki)
