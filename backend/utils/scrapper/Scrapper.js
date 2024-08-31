const Browser = require('./Browser')
const log = require('../logger/index')
const cheerio = require('cheerio');
const fs = require('fs/promises')
const puppeteerExtra = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const jamalModel = require('../../model/JamalCompanies')


class Scrapper {
    cookies = null;
    constructor(cookie) {
        this.cookies = cookie
    }
    async open(query = "#opentowork React Native") {
        const bw = new Browser();
        await bw.init(false)
        log.print('---Browser initialized')
        log.print('---Setting Cookies')
        await bw.setCookies(this.cookies)
        log.print('---Cookies set')
        await bw.open(`https://www.linkedin.com`)

        log.print("-------------------------------")
        // await bw.close()


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
    async getYelp(desc = 'saloon', loc = 'london', io) {
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
                    const items = document.querySelectorAll('.y-css-way87j');
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        links.push({
                            link: item.querySelectorAll('a')?.[1]?.href,
                            name: item.querySelectorAll('a')?.[1]?.innerText,
                            image : item.querySelectorAll('img')[0].src,
                            about : item.children[0].children[1].children[1].innerText
                        })
                        console.log(item)
                    }
                    // const text = document.querySelectorAll('.pagination__09f24__VRjN4 .css-chan6m')?.[0].innerText;
                    const end = 10
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
                log.error(error.message, 197)
                break;
            }
        }
        const totalLinks = [].concat(...links.links)
        log.print(totalLinks.length)
        let index = 0;
        while (totalLinks.length > index) {
            try {
                const url = totalLinks[index]?.link || ''
                log.print(`Visiting Link :  ${url}`, 209)
                await bw.open(url)
                const temp = await bw.injectJS(function () {
                     const container = document.querySelectorAll('.y-css-1b4ss4q')
                     const bizwebsite = container?.[0].innerText
                     const phoneNumber = container?.[1].innerText
                     const address = container?.[2].innerText

                    return {
                         bizwebsite,
                         phoneNumber,
                         address
                    } 
                })
                log.print(temp, 217)
                totalLinks[index].phoneNumber = temp.phoneNumber
                totalLinks[index].website = temp.bizwebsite
                totalLinks[index].address = temp.address
                io.emit('yelp-response-chuck', totalLinks[index])
                index += 1;
            } catch (error) {
                log.error(error, 227)
                break;
            }
        }
        log.print('Scrapping Completed' , totalLinks.length)
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
            $('.col-lg-8').each(async (index, element) => {
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
    async getMaps(query = 'School Newyork') {
        const buisnesses = [];
        try {
            const start = Date.now();
        
            puppeteerExtra.use(stealthPlugin());
        
            const browser = await puppeteerExtra.launch({
              headless: false,
              // headless: "new",
              // devtools: true,
              executablePath: "", // your path here
            });
        
            // const browser = await puppeteerExtra.launch({
            //   args: chromium.args,
            //   defaultViewport: chromium.defaultViewport,
            //   executablePath: await chromium.executablePath(),
            //   headless: "new",
            //   ignoreHTTPSErrors: true,
            // });
            
            // const cookies = await fs.readFile('cookies.map.json', 'utf-8');

            
            const page = await browser.newPage();
            
            // await page.setCookie(...JSON.parse(cookies));

        
        
        
            try {
              await page.goto(
                `https://www.google.com/maps/search/${query.split(" ").join("+")}`
              );
            } catch (error) {
                console.log("error going to page");
                return []
            }
        
            async function autoScroll(page) {
              await page.evaluate(async () => {
                const wrapper = document.querySelector('div[role="feed"]');
        
                await new Promise((resolve, reject) => {
                  var totalHeight = 0;
                  var distance = 1000;
                  var scrollDelay = 5000;
        
                  var timer = setInterval(async () => {
                    var scrollHeightBefore = wrapper.scrollHeight;
                    wrapper.scrollBy(0, distance);
                    totalHeight += distance;
        
                    if (totalHeight >= scrollHeightBefore) {
                      totalHeight = 0;
                      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
        
                      // Calculate scrollHeight after waiting
                      var scrollHeightAfter = wrapper.scrollHeight;
        
                      if (scrollHeightAfter > scrollHeightBefore) {
                        // More content loaded, keep scrolling
                        return;
                      } else {
                        // No more content loaded, stop scrolling
                        clearInterval(timer);
                        resolve();
                      }
                    }
                  }, 200);
                });
              });
            }
        
            await autoScroll(page);
        
            const html = await page.content();
            // const pages = await browser.pages();
            // await Promise.all(pages.map((page) => page.close()));
        
            await browser.close();
            console.log("browser closed");
        
            // get all a tag parent where a tag href includes /maps/place/
            const $ = cheerio.load(html);
            const aTags = $("a");
            const parents = [];
            aTags.each((i, el) => {
              const href = $(el).attr("href");
              if (!href) {
                return;
              }
              if (href.includes("/maps/place/")) {
                parents.push($(el).parent());
              }
            });
        
            console.log("parents", parents.length);
        
           
        
            parents.forEach((parent) => {
              const url = parent.find("a").attr("href");
              // get a tag where data-value="Website"
              const website = parent.find('a[data-value="Website"]').attr("href");
              // find a div that includes the class fontHeadlineSmall
              const storeName = parent.find("div.fontHeadlineSmall").text();
              // find span that includes class fontBodyMedium
              const ratingText = parent
                .find("span.fontBodyMedium > span")
                .attr("aria-label");
        
              // get the first div that includes the class fontBodyMedium
              const bodyDiv = parent.find("div.fontBodyMedium").first();
              const children = bodyDiv.children();
              const lastChild = children.last();
              const firstOfLast = lastChild.children().first();
              const lastOfLast = lastChild.children().last();
        
              buisnesses.push({
                placeId: `ChI${url?.split("?")?.[0]?.split("ChI")?.[1]}`,
                address: firstOfLast?.text()?.split("·")?.[1]?.trim(),
                category: firstOfLast?.text()?.split("·")?.[0]?.trim(),
                phone: lastOfLast?.text()?.split("·")?.[1]?.trim(),
                googleUrl: url,
                bizWebsite: website,
                storeName,
                ratingText,
                stars: ratingText?.split("stars")?.[0]?.trim()
                  ? Number(ratingText?.split("stars")?.[0]?.trim())
                  : null,
                numberOfReviews: ratingText
                  ?.split("stars")?.[1]
                  ?.replace("Reviews", "")
                  ?.trim()
                  ? Number(
                      ratingText?.split("stars")?.[1]?.replace("Reviews", "")?.trim()
                    )
                  : null,
              });
            });
            const end = Date.now();
        
            console.log(`time in seconds ${Math.floor((end - start) / 1000)}`);
            console.log("buisnesses", buisnesses.length);
            if(buisnesses.length > 0) {
                fs.writeFile(
                    `./utils/json/maps/${query}_${new Date().toDateString()}.json`,
                    JSON.stringify(buisnesses, null, 2)
                  );
            }
            return buisnesses;
          } catch (error) {
              console.log("error at googleMaps", error.message);
              return buisnesses
          }
    }
}
module.exports = Scrapper