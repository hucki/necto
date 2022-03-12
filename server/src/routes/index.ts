import express from 'express';
import * as userController from '../controllers/user.controller';
import * as employeeController from '../controllers/employee.controller';
import * as teamController from '../controllers/team.controller';
import * as employeeToTeamController from '../controllers/employeeToTeam.controller';
import * as roomController from '../controllers/room.controller';
import * as buildingController from '../controllers/building.controller';
import * as contractController from '../controllers/contract.controller';
import * as eventController from '../controllers/event.controller';
import * as patientController from '../controllers/patient.controller';
import * as teamMemberController from '../controllers/teamMember.controller';
import * as appSettingsController from '../controllers/appSettings.controller';
import * as userSettingsController from '../controllers/userSettings.controller';
import * as tenantController from '../controllers/tenant.controller';
import * as companyController from '../controllers/company.controller';
import * as errorController from '../controllers/error.controller';
import { jwtCheck } from '../middleware/authentication';
const router = express.Router();
const errorRouter = express.Router();
errorRouter.get('*', errorController.getError);
errorRouter.post('*', errorController.postError);
errorRouter.delete('*', errorController.deleteError);

// unauthenticated routes
// NONE

// check Authentication
router.use(jwtCheck);

// authenticated routes

router.get('/teammembers', teamMemberController.getAllTeamMembers);

// auth routes
//router.get('/auth/is', authController.isAuthenticated);

// user routes
router.get('/a0users/:a0Id', userController.getOneUserByAuth0Id);
// router.get('/users/:userId', userController.getOneUser);
router.get('/users', userController.getAllUsers);
router.post('/users', userController.addUser);
router.patch('/users', userController.updateUser);
// router.delete('/users/:userId', userController.deleteOneUser);

// employee routes
router.get('/employees', employeeController.getAllEmployees);
router.post('/employees', employeeController.addEmployee);

// team routes
router.get('/teams', teamController.getAllTeams);
// router.post('/teams', teamController.addTeam);

// employeeToTeam routes
router.post('/employee2team', employeeToTeamController.addEmployeeToTeam);

// contract routes
router.get('/contracts', contractController.getAllContracts);
router.post('/contracts', contractController.addContract);
router.put('/contracts', contractController.updateContract);

// room routes
router.get('/rooms', roomController.getAllRooms);
router.post('/rooms', roomController.addRoom);

// building routes
router.get('/buildings', buildingController.getAllBuildings);
router.post('/buildings', buildingController.addBuilding);

// events routes
//router.get('/events/:eventId', eventController.getEvents);
router.get('/events/a', eventController.getAllEvents);
router.get('/events/d/:year/:month/:day', eventController.getDaysEvents);
router.get('/events/w/:year/:week', eventController.getWeeksEvents);

router.post('/events', eventController.addEvent);
router.patch('/events/:eventId', eventController.updateEvent);
router.delete('/events/:eventId', eventController.deleteEvent);

// patient routes
//router.get('/patients/:eventId', eventController.getPatients);
router.get('/patients', patientController.getAllPatients);
router.get('/waiting', patientController.getWaitingPatients);
router.get('/patients/:patientId', patientController.getPatientsEvents);

router.post('/patients', patientController.addPatient);
router.patch('/patients/:patientId', patientController.updatePatient);
// router.delete('/patients/:patientId', patientController.deletePatient);

// settings routes
// app Settings
router.post('/settings/app', appSettingsController.addAppSettings);
// user settings
router.post('/settings/user', userSettingsController.addUserSettings);
router.patch('/settings/user', userSettingsController.updateUserSettings);

//router.get('/appsettings', settingsController.getAppSettings);
//router.put('/appsettings', settingsController.updateAppSettings);

// tenant routes
router.get('/tenants', tenantController.getAllTenants);
router.post('/tenant', tenantController.addTenant);

// company routes
router.get('/companies', companyController.getAllCompanies);

export { router, errorRouter };
