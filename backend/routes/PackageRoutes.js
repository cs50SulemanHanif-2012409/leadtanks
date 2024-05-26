const PackageController = require('../controller/PackageController');
const router = require('express').Router();

router.get('/all', PackageController.getPackages)
router.get('/info/:id' , PackageController.getPackage)
router.get('/:id/:page?' , PackageController.getPackageData)


module.exports = router
