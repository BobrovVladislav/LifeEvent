const Router = require('express')
const router = new Router()
const { createEvent, readAllEvents, getEvent, deleteEvent, updateEvent, updateEventProgram, updateEventBudget, updateEventGuests, inviteGuests } = require('../controllers/eventController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware(), createEvent)
router.get('/all', authMiddleware(), readAllEvents)
router.get('/:eventID', authMiddleware(), getEvent);
router.delete('/:eventID', authMiddleware(), deleteEvent);
router.patch('/:eventID', authMiddleware(), updateEvent);
router.put('/:eventID/guests', authMiddleware(), updateEventGuests);
router.post('/:eventID/guests', authMiddleware(), inviteGuests);
router.put('/:eventID/program', authMiddleware(), updateEventProgram);
router.put('/:eventID/budget', authMiddleware(), updateEventBudget);

module.exports = router