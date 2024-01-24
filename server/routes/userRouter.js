const Router = require('express')
const router = new Router()
const { registration, login, check, getAllUsers, deleteUser } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', registration)
router.post('/login', login)
router.get('/me', authMiddleware(), check)
router.get('/all', authMiddleware('admin'), getAllUsers);
router.delete('/:id', authMiddleware('admin'), deleteUser);

module.exports = router