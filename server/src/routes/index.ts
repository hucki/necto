import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as userController from '../controllers/user.controller';
import * as employeeController from '../controllers/employee.controller';
import * as teamController from '../controllers/team.controller';
import * as employeeToTeamController from '../controllers/employeeToTeam.controller';
import * as roomController from '../controllers/room.controller';
import * as buildingController from '../controllers/building.controller';
import * as contractController from '../controllers/contract.controller';
import * as eventController from '../controllers/event.controller';
import * as patientController from '../controllers/patient.controller';
import * as doctorController from '../controllers/doctor.controller';
import * as teamMemberController from '../controllers/teamMember.controller';
import * as appSettingsController from '../controllers/appSettings.controller';
import * as userSettingsController from '../controllers/userSettings.controller';
import * as eventSettingsController from '../controllers/eventSettings.controller';
import * as tenantController from '../controllers/tenant.controller';
import * as companyController from '../controllers/company.controller';
import * as errorController from '../controllers/error.controller';
// import * as seedController from '../controllers/seed.controller';
// import expressjwt from 'express-jwt';
// import { jwtCheck } from '../middleware/authentication';
import passport from 'passport';
const router = express.Router();
const errorRouter = express.Router();
errorRouter.get('*', errorController.getError);
errorRouter.post('*', errorController.postError);
errorRouter.delete('*', errorController.deleteError);

// unauthenticated routes
router.post(
  '/login',
  authController.validateLogin,
  // authController.login,
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user && info) {
        return res.status(401).json({...info, status: 401});
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return next();
      });
    })(req, res, next);
  },
  authController.issueToken);

router.post('/register', authController.registerUser);
router.post('/pw/reset', authController.resetPassword);

// authenticated routes
router.use(authController.isAuthenticated)
// router.use(passport.authenticate('jwt' /*, {session: false}*/))
// router.get('/me', passport.authenticate('jwt'/*, {session: false}*/), authController.getMe);
router.patch('/pw/update', authController.updatePassword);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
// check Authentication
// router.use(jwtCheck);

router.get('/teammembers', teamMemberController.getAllTeamMembers);

// auth routes
//router.get('/auth/is', authController.isAuthenticated);

// user routes

router.get('/a0users/:a0Id', userController.getOneUserByAuth0Id);
// router.get('/users/:userId', userController.getOneUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:uuid', userController.getUser);
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
router.patch('/patients/:patientId', patientController.updatePatient);
router.get('/waiting', patientController.getWaitingPatients);
router.get('/patients/:patientId', patientController.getPatientsEvents);

router.post('/patients', patientController.addPatient);
router.patch('/patients/:patientId', patientController.updatePatient);
// router.delete('/patients/:patientId', patientController.deletePatient);

// doctor routes
//router.get('/patients/:eventId', eventController.getPatients);
router.post('/doctors', doctorController.addDoctor);
router.get('/doctors', doctorController.getAllDoctors);
router.patch('/doctors/:doctorId', doctorController.updateDoctor);

// settings routes
// app Settings
router.post('/settings/app', appSettingsController.addAppSettings);
// user settings
router.post('/settings/user', userSettingsController.addUserSettings);
router.patch('/settings/user', userSettingsController.updateUserSettings);
// event Settings
router.get('/settings/event/cr', eventSettingsController.getAllCancellationReasons);
router.post('/settings/event/cr', eventSettingsController.addCancellationReason);
router.patch('/settings/event/cr', eventSettingsController.updateCancellationReason);

//router.get('/appsettings', settingsController.getAppSettings);
//router.put('/appsettings', settingsController.updateAppSettings);

// tenant routes
router.get('/tenants', tenantController.getAllTenants);
router.post('/tenant', tenantController.addTenant);

// company routes
router.get('/companies', companyController.getAllCompanies);

// seed routes
// router.get('/seed/levels', seedController.permissionLevels);

export { router, errorRouter };
