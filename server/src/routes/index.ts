import express from 'express';
import * as userController from '../controllers/user.controller';
import * as contractController from '../controllers/contract.controller';
import * as eventController from '../controllers/event.controller';
import * as teamMemberController from '../controllers/teamMember.controller';
import * as appSettingsController from '../controllers/appSettings.controller';
import * as userSettingsController from '../controllers/userSettings.controller';
import * as tenantController from '../controllers/tenant.controller';

const router = express.Router();

// user routes
// router.get('/users/:userId', userController.getOneUser);
router.get('/users', userController.getAllUsers);
router.post('/users', userController.addUser);
// router.delete('/users/:userId', userController.deleteOneUser);

router.get('/teammembers', teamMemberController.getAllTeamMembers);
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

export default router;
