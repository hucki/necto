import express from 'express';
import * as userController from '../controllers/user.controller';
import * as eventController from '../controllers/event.controller';
import * as teamMemberController from '../controllers/teamMember.controller';
import * as appSettingsController from '../controllers/appSettings.controller';
import * as tenantController from '../controllers/tenant.controller';

const router = express.Router();

// user routes
// router.get('/users/:userId', userController.getOneUser);
router.get('/users', userController.getAllUsers);
// router.post('/users', userController.addUser);
// router.delete('/users/:userId', userController.deleteOneUser);

router.get('/teammembers', teamMemberController.getAllTeamMembers);
// events routes
//router.get('/events/:eventId', eventController.getEvents);
// router.get('/events', eventController.getAllEvents);
router.get('/events/d/:year/:month/:day', eventController.getDaysEvents);
router.get('/events/w/:year/:week', eventController.getWeeksEvents);

router.post('/events', eventController.addEvent);
router.delete('/events/:eventId', eventController.deleteEvent);

// settings routes
router.post('/appsettings', appSettingsController.addAppSettings);
//router.get('/appsettings', settingsController.getAppSettings);
//router.put('/appsettings', settingsController.updateAppSettings);

// tenant routes
router.post('/tenant', tenantController.addTenant);

export default router;
