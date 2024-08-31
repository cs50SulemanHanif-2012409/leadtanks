const AdminController = require('../controller/AdminController')
const OrderController = require('../controller/OrderController')
const router = require('express').Router();
const adminMiddleWare = require('../middleware/adminMiddleWare')


router.post('/login' , AdminController.login)

// dashboard statistics
router.get('/stats', adminMiddleWare, AdminController.getDashboardStatistic)

//FaceBook Database
router.get('/fb/users', adminMiddleWare ,  AdminController.getFbUsers)
router.get('/fb/countries', adminMiddleWare ,  AdminController.getFbCountries)

// Jamal Database
router.get('/jamal/companies', adminMiddleWare ,  AdminController.getJamalcompanies)

// LeadTanks Database

// LeadTanks Users
router.get('/users' , adminMiddleWare , AdminController.getUser)
router.put('/user/:id', adminMiddleWare , AdminController.putUser)
router.delete('/user/:id', adminMiddleWare , AdminController.removeUser)


// LeadTanks Packages
router.get('/packages' , adminMiddleWare , AdminController.getPackages)
router.post('/create/package' , adminMiddleWare , AdminController.createPackage)
router.delete('/package/:id', adminMiddleWare , AdminController.removePackage)
router.patch('/package/:id', adminMiddleWare , AdminController.updatePackage)


// Orders
router.get('/orders' , adminMiddleWare , AdminController.getOrders)
router.put('/order/:id', adminMiddleWare, OrderController.updateOrder)
router.delete('/order/:id', adminMiddleWare, OrderController.deleteOrder)

module.exports = router;