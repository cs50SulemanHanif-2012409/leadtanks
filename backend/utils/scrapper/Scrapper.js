const Browser = require('./Browser')
const log = require('../logger/index')
const cheerio = require('cheerio');
const fs = require('fs/promises')
const jamalModel = require('../../model/JamalCompanies')



class Scrapper {
    cookies = null;
    constructor(cookie) {
        this.cookies = cookie
    }
    async getLinkedinSearch(query = "#opentowork React Native") {
        const bw = new Browser();
        await bw.init(false)
        log.print('---Browser initialized')
        log.print('---Setting Cookies')
        await bw.setCookies(this.cookies)
        log.print('---Cookies set')
        await bw.open(`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(query)}&origin=GLOBAL_SEARCH_HEADER`)
        const response = await bw.injectJS(async function (page) {
            return new Promise((resolve, reject) => {
                const data = document.querySelectorAll(".reusable-search__result-container");
                var result = [];
                data.forEach(item => {
                    const container = item.children[0].children?.[0];
                    const postAuthorContainer = container?.children?.[0];
                    const postTextConatiner = container?.children?.[1];
                    const postLikesContainer = container?.children?.[2];
                    const PostText = postTextConatiner?.children?.[0].children?.[0].innerText;
                    const postLink = postAuthorContainer.children?.[0]?.children?.[0]?.href;
                    const postAuthorImage = postAuthorContainer.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.src;
                    const postAuthorName = postAuthorContainer.children?.[1]?.children?.[0]?.children?.[0]?.children?.[0].innerText;
                    const postDate = postAuthorContainer.children?.[1]?.children?.[1]?.children?.[1]?.innerText?.split(" ")[0];
                    const postAuthorCaption = postAuthorContainer.children?.[1]?.children?.[1]?.children?.[0]?.innerText;
                    const postComments = postLikesContainer?.children?.[0]?.children?.[1]?.children?.[1]?.innerText;
                    const postLikes = postLikesContainer?.children?.[0]?.children?.[1]?.children?.[0]?.innerText;
                    result.push({
                        PostText,
                        postLink, postAuthorImage, postAuthorName, postDate, postAuthorCaption, postComments, postLikes
                    })
                })
                console.log(result)
                resolve(result)
            })

        })
        log.print("-------------------------------")
        await bw.close()
        return response

    }
    /**
     * 
     * @param {String} query 
     * @param {'past-24h' | 'past-week' | 'past-month'} datePosted 
     * @returns 
     */
    async getLinkedinSearchFilter(query = "#opentowork React Native", datePosted = 'past-24h') {
        const bw = new Browser(true);
        await bw.init()
        log.print('---Browser initialized')
        await bw.setCookies(this.cookies)
        log.print('---Cookies set')
        await bw.open(`https://www.linkedin.com/search/results/content/?datePosted=%22${datePosted}%22&keywords=${encodeURIComponent(query)}&sid=%40Q!`)
        const response = await bw.injectJS(async function (page) {
            return new Promise((resolve, reject) => {
                const data = document.querySelectorAll('.reusable-search__entity-result-list')[0]?.children;
                var result = [];
                for (let item of data) {
                    const container = item.children?.[0]?.children?.[0]?.children[0];
                    const postAuthorContainer = container?.children[0]?.children?.[2];
                    // log.print(container.children[0].children)
                    const AuthorLink = postAuthorContainer?.querySelector('.app-aware-link').href;
                    const AuthorProfileAvatar = postAuthorContainer?.querySelector('.lazy-image')?.src;
                    const AuthorName = postAuthorContainer?.querySelector('.visually-hidden')?.innerText;
                    result.push({
                        AuthorLink, AuthorProfileAvatar, AuthorName
                    })
                    // log.print(postAuthorContainer)
                }
                log.print(result)
                resolve(result)
            })

        })
        log.print("-------------------------------")
        await bw.close()
        return response

    }
    async getGoogleSearchResult(city = 'Moscow', position = 'golang developer') {
        var str = encodeURIComponent(`site:linkedin.com/in/ AND "${city}" AND "${position}"`);
        var googleurl = 'https://google.com/search?q=' + str;
        log.print(googleurl, 92)
        const bw = new Browser(false);
        await bw.init()
        await bw.open(googleurl);
        const result = await bw.injectJS(function () {
            var listGresult = document.querySelectorAll('.g');
            var linkresult = []
            for (var x = 0; x < listGresult.length; x++) {
                var aElem = listGresult[x].getElementsByTagName('a');
                for (var i = 0; i < aElem.length; i++) {
                    var href = aElem[i].getAttribute('href');
                    if (href != null && href.indexOf("linkedin.com") > 1 && href.indexOf("translate.google") < 0) {
                        linkresult.push(href)
                    }
                }
            }
            return linkresult;
        })
        await bw.close();
        return result;
    }
    async getLinkedinProfile(link) {

        log.print(' [Scrapping Profile] Link : ' + link)
        const bw = new Browser();
        await bw.init(true);
        await bw.setCookies(this.cookies);
        log.print(' [Visiting Profile] ')
        await bw.open(link)
        const result = await bw.injectJS(function () {
            const Username = document.querySelectorAll('.text-heading-xlarge')[0].innerText;
            const profile = document.querySelectorAll('.pv-top-card-profile-picture__image')[0].src;
            const Exp = document.querySelectorAll('.pvs-list')[0].children;
            const experience = [];
            for (let e of Exp) {
                log.print(e.innerText);
                experience.push(e.innerText);
            }
            var obj = {
                Username,
                experience,
                profile
            }
            return obj;

        })
        await bw.close()
        log.print(' [Basic] Detials Scrapped ')
        return result;
    }
    async getSkills(link) {
        const bw = new Browser(false);
        await bw.init();
        await bw.setCookies(this.cookies);
        await bw.open(getURL(link) + '/details/skills/')
        const skills = await bw.injectJS(function () {
            const listSkills = document.querySelectorAll('.pvs-list')[0].children;
            let skills = []
            for (let skill of listSkills) {
                skills.push(skill.innerText)
            }
            return skills;
        })
        await bw.close();
        return skills
    }
    async getYelp(desc = 'saloon', loc = 'london') {
        let skip = 0;
        let end = 10;
        let links = {
            links: [],
            end
        }
        const bw = new Browser(true);
        await bw.init();
        await bw.setCookies(this.cookies);
        log.print('Browser Initialized , Cookeies Set', 168)
        while (end > skip) {
            try {
                const url = `https://www.yelp.com/search?find_desc=${desc}&find_loc=${loc}&start=${skip}`
                await bw.open(url)
                const temp = await bw.injectJS(function () {
                        let links = []
                        const items = document.querySelectorAll('.css-ady4rt');
                        console.log(items)
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            links.push({
                                link: item.querySelectorAll('a')?.[1]?.href,
                                name: item.querySelectorAll('a')?.[1]?.innerText,
                            })
                            console.log(item)
                        }
                        const text = document.querySelectorAll('.pagination__09f24__VRjN4 .css-chan6m')[0].innerText;
                        const end = (Number(text.split(' ')[2]) * 10) - 200
                        return {
                            links,
                            end
                        };
                })
                skip += 10;
                links.links.push(temp.links)
                links.end = temp.end
                end = temp.end
                log.print(temp.links, 194)

            } catch (error) {
                log.error(error, 197)
                break;
            }
        }
        const totalLinks = [].concat(...links.links)
        log.print(JSON.stringify(totalLinks))
        let index = 0;
        while (totalLinks.length > index) {
            try {
                const url = totalLinks[index]?.link || ''
                log.print(`Visiting Link :  ${url}`, 209)
                await bw.open(url)
                const temp = await bw.injectJS(function () {
                    const box = document.querySelectorAll('.css-s81j3n')?.[0];
                    const phList = document.querySelectorAll('p[class=" css-1p9ibgf"]');
                    // const PhoneNumber = box.querySelectorAll('.css-1p9ibgf')?.[0]?.innerText;
                    let PhoneNumber = box.querySelectorAll('.css-1p9ibgf')?.[0]?.innerText;
                    for (let el of phList) {
                        const element = el.innerText;
                        const num = element.replace(/[^\d]/g, ''); 
                        const ph = Number(num);
                        if(ph){
                         console.log(element)   
                         PhoneNumber = element
                        }
                    }
                    const address = box.querySelectorAll('.css-qyp8bo')?.[0]?.innerText;
                    const about = document.querySelectorAll('.css-1evauet')?.[0]?.innerText;
                    return {
                        PhoneNumber,
                        address,
                        about
                    }
                })
                log.print(temp, 217)
                totalLinks[index].PhoneNumber = temp.PhoneNumber
                totalLinks[index].about = temp.about
                totalLinks[index].address = temp.address
                index += 1;
            } catch (error) {
                log.error(error, 227)
                continue;
            }
        }
        await bw.close()
        return totalLinks
    }
    async getJamal(query = 'IT', city = 'Karachi', io) {
        let page = 1;
        let endPage = 1;
        let listings = [];
        const bw = await new Browser(true)
        while (endPage >= page) {
            const url = `https://www.jamals.com/search?type=companies&query=${query}&location=${city}&page=${page}`
            log.print(url)
            let html = await bw.getHtml(url);
            const $ = cheerio.load(html)
            const pageLinks = $('.page-link');
            // Get the inner text of the second-to-last .page-link element
            endPage = Number($(pageLinks[pageLinks.length - 2]).text())
            log.warn(`page = ${page} , End Page : ${endPage}`)
            // Iterate over each listing
            $('.col-lg-8').each( async (index, element) => {
                const listing = {};

                // Extract the title
                listing.title = $(element).find('.listing-title h5.add-title a').text();

                // Extract the website link
                listing.websiteLink = $(element).find('.listing-info li.listing-url a').attr('href');

                // Extract the phone number
                listing.phoneNumber = $(element).find('.listing-info li.listing-phone').text().trim();

                // Extract the address
                listing.address = $(element).find('.listing-info li:first-child').text().trim();

                listing.country = 'Pakistan';

                listing.city = city;

                listing.query = query;
                
                io.emit('jamal-response-chuck', JSON.stringify(listing))

                await jamalModel.create(listing)

                listings.push(listing);
            });
           
            log.warn(listings.length);
            page += 1;
            fs.writeFile('./utils/json/jamal_loads.json', JSON.stringify(listings), 'utf-8')
        }
        return listings;
    }
}
module.exports = Scrapper