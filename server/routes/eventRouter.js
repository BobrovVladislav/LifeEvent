const Router = require('express')
const router = new Router()
const { createEvent, readAllEvents, getEvent, deleteEvent, updateEvent } = require('../controllers/eventController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, createEvent)
router.get('/all', authMiddleware, readAllEvents)
router.get('/:eventID', authMiddleware, getEvent);
router.delete('/:eventID', authMiddleware, deleteEvent);
router.patch('/:eventID', authMiddleware, updateEvent);

module.exports = router