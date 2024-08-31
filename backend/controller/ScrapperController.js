const fs = require('fs/promises')
const Scrapper = require('../utils/scrapper/Scrapper')



class ScrapperController {
    /**
    * takes two input 
    * ` { city : String , dev : String } 
    * 
    *  example 
    * {
    *  city : 'Karachi',
    *   dev : 'C++ Developer'
    * 
    * }
    * `
    */
    async google(req, res) {
        const cookies = await fs.readFile('cookie.json', 'utf-8');
        const sc = new Scrapper(JSON.parse(cookies));
        const result = await sc.getGoogleSearchResult(req.body.city, `${req.body.dev} #openToWork`)
        res.json(result);
    }
    async maps(req, res) {
        try {
            const sc = new Scrapper([]);
            const result = await sc.getMaps(req.body.search)
            res.json(result);
        } catch (error) {
            console.log({
                message : error.message
            })
            res.json(result);
        }
    }
    async jamal(req, res, io) {
        const sc = new Scrapper('');
        const data = await sc.getJamal(req.body.feild || 'IT' , req.body.city || 'karachi' , io);
        res.send(data)
    }
    async yelp(req, res ,io) {
        const cookies = await fs.readFile('cookie.json', 'utf-8');
        const sc = new Scrapper(JSON.parse(cookies));
        const result = await sc.getYelp(req.body.desc, req.body.loc, io)
        res.json(result);
    }
    /**
    * takes single input 
    * ` {  dev : String } 
    * 
    *  example 
    * {
    *  dev : 'C++ Developer'
    * 
    * }
    * `
    */
    async linkedin(req, res) {
        const cookies = await fs.readFile('cookie.json', 'utf-8');
        const sc = new Scrapper(JSON.parse(cookies));
        const result = await sc.getLinkedinSearch(`#openToWork ${req.body.dev}`)
        res.json(result);
    }
    async linkedinOpen(req, res) {
        const cookies = await fs.readFile('cookie.json', 'utf-8');
        const sc = new Scrapper(JSON.parse(cookies));
        const result = await sc.open(`#openToWork ${req.body.dev}`)
        res.json(result);
    }
    /**
    * takes two input 
    * ` { datePosted : String , dev : String } 
    * 
    *  example 
    * {
    *  datePosted : 'past-24h' || 'past-month' || 'past-week',
    *  dev : 'C++ Developer'
    * 
    * }
    * `
    */
    async LinkedFilter(req, res) {
        const cookies = await fs.readFile('cookie.json', 'utf-8');
        const sc = new Scrapper(JSON.parse(cookies));
        const result = await sc.getLinkedinSearchFilter(`#openToWork ${req.body.dev}`, req.body.datePosted ?? 'past-month')
        res.json(result);
    }
    /**
    * takes single input 
    * ` { profile : String } 
    * 
    *  example 
    * {
    * profile : 'https://linkedin.com/in/moiz-ali-63493a264'
    * 
    * }
    * `
    */
   async LinkedProfile(req, res) {
       const cookies = await fs.readFile('cookie.json', 'utf-8');
        const sc = new Scrapper(JSON.parse(cookies));
        const result = await sc.getLinkedinProfile(req.body.profile)
        res.json(result);
    }
}


module.exports = new ScrapperController();