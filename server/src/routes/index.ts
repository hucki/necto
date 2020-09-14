import express from 'express';
import * as userController from '../controllers/user.controller';
import * as eventController from '../controllers/event.controller';
//import * as settingsController from './controllers/settings.controller';

const router = express.Router();

// user routes
// router.get('/users/:userId', userController.getOneUser);
router.get('/users', userController.getAllUsers);
// router.post('/users', userController.addUser);
// router.delete('/users/:userId', userController.deleteOneUser);

// events routes
//router.get('/events/:eventId', eventController.getEvents);
// router.get('/events', eventController.getAllEvents);
router.get('/events/:year/:week', eventController.getWeeksEvents);
router.post('/events', eventController.addEvent);
//router.delete('/events/:eventId', eventController.deleteOneEvent);

// settings routes
//router.get('/settings', settingsController.getSettings);
//router.put('/settings', settingsController.updateSettings);

export default router;
