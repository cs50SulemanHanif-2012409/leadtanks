const router = require('express').Router();
const ScrapperController = require('../controller/ScrapperController')


module.exports = (io) => {

    console.log(io)

    router.post('/google/', ScrapperController.google)
    router.post('/jamal/', (req, res )=> ScrapperController.jamal(req, res , io))
    router.post('/yelp/', ScrapperController.yelp)
    router.post('/linkedin/', ScrapperController.linkedin)
    router.post('/linkedin/filter', ScrapperController.LinkedFilter)
    router.post('/linkedin/profile', ScrapperController.LinkedProfile)

    return router
}