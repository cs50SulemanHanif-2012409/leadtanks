const fs = require('fs')
const Browser = require('./utils/scrapper/Browser')



async function main() {
    const bw = new Browser();
    await bw.init(false)

    await bw.setCookies(JSON.parse(fs.readFileSync('./cookie.json', 'utf8')))
    
    await bw.open(`https://www.linkedin.com/`)
}






main()