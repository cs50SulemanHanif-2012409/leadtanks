const router = require('express').Router()
const AuthController = require('../controller/AuthController')
const authMiddleWare = require('../middleware/verifyToken')
const UserController = require('../controller/UserController')

router.post('/register', AuthController.register) 
router.post('/signin', AuthController.signin) 

router.get('/me', authMiddleWare , UserController.getMe)
router.put('/update' , authMiddleWare , UserController.putUser)

module.exports = router