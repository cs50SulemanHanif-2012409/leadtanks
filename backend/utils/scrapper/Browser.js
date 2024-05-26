const puppeteer = require('puppeteer');
const fetch = require('node-fetch')

class Browser {
    browser = null;
    page = null;
    url = ''
    async init(headless = false) {
        this.browser = await puppeteer.launch({ headless : false });
        this.page = await this.browser.newPage();
    }
    getPage() {
        return this.page;
    }
    async newPage(){
        return await this.browser.newPage();
    }
    getBrowser() {
        return this.browser;
    }
    async open(url = null) {
        if (!null) {
            this.url = url;
            await this.page.goto(url , {timeout: 0});
            // Set screen size
            await this.page.setViewport({ width: 1080, height: 1024 });
        }
    }
    async close() {
        await this.browser.close()
    }
    async setCookies(json = []) {
        if (json?.length > 0) {
            await this.page.setCookie(...json)
        }
    }
    async getCookies() {
        return await page.cookies(this.url)
    }
    async reload() {
        await this.page.reload();
    }
    async injectJS(exc = () => { }) {
        return await this.page.evaluate(exc, this.page);
    }
    async getHtml(url){
        let options = {
            method: 'GET',
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Content-Type': 'text/html',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36'
            }
        };
        const req = await fetch(url, options)
        const html = await req.text();
        return html;
    }

}


module.exports = Browser