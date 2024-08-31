const router = require('express').Router();
const ScrapperController = require('../controller/ScrapperController')


module.exports = (io) => {

    console.log(io)

    router.post('/google/', ScrapperController.google)
    router.post('/jamal/', (req, res )=> ScrapperController.jamal(req, res , io))
    router.post('/yelp/', (req , res)=> ScrapperController.yelp(req, res,io))
    router.post('/linkedin/', ScrapperController.linkedin)
    router.get('/linkedin/', ScrapperController.linkedinOpen)
    router.post('/linkedin/filter', ScrapperController.LinkedFilter)
    router.post('/linkedin/profile', ScrapperController.LinkedProfile)
    router.post('/maps', ScrapperController.maps)

    return router
}