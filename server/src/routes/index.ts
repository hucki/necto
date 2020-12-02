import express from 'express';
import * as userController from '../controllers/user.controller';
import * as contractController from '../controllers/contract.controller';
import * as eventController from '../controllers/event.controller';
import * as teamMemberController from '../controllers/teamMember.controller';
import * as appSettingsController from '../controllers/appSettings.controller';
import * as userSettingsController from '../controllers/userSettings.controller';
import * as tenantController from '../controllers/tenant.controller';
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
// router.delete('/users/:userId', userController.deleteOneUser);

// events routes
//router.get('/events/:eventId', eventController.getEvents);
router.get('/events/a', eventController.getAllEvents);
router.get('/events/d/:year/:month/:day', eventController.getDaysEvents);
router.get('/events/w/:year/:week', eventController.getWeeksEvents);

router.post('/events', eventController.addEvent);
router.delete('/events/:eventId', eventController.deleteEvent);

// contractss routes
router.post('/contracts', contractController.addContract);

// settings routes
router.post('/settings/app', appSettingsController.addAppSettings);
router.post('/settings/user', userSettingsController.addUserSettings);

//router.get('/appsettings', settingsController.getAppSettings);
//router.put('/appsettings', settingsController.updateAppSettings);

// tenant routes
router.post('/tenant', tenantController.addTenant);

export {router, errorRouter};
