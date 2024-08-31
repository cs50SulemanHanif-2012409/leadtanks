const router = require('express').Router()
const OrderController = require('../controller/OrderController')
const authMiddleWare = require('../middleware/verifyToken')
const packageController = require('../controller/PackageController')

router.get('/list', authMiddleWare, OrderController.getUserOrders)
router.get('/:id', authMiddleWare, OrderController.getOrder)
router.post('/', authMiddleWare, OrderController.createOrder)


router.get('/package/:id' , authMiddleWare , packageController.getPackageData)


module.exports = router