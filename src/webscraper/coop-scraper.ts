import axios from "axios";
import cheerio from "cheerio";

// URL of the website to scrape
const pages = 1;
const pageSize = 30;
const url = `https://www.coop.ch/de/search?page=${pages}&pageSize=${pageSize}&q=milch%3Arelevance&text=milch&sort=relevance`;
//const url = `https://www.aldi-now.ch/de/search?q=milch`;
const keywords = [
    "vollmich",
    "milchdrink",
    "reisdrink",
    "mandeln",
    "schafmilch",
    "milch drink",
    "sojadrink",
    "haferdrink",
];
console.log("🚀 ~ url:", url);

// Function to scrape the website
// const scrapeCoop = async () => {
//   try {
//     // Send a GET request to the website
//     const { data } = await axios.get(url,{
//         headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
//         }
//     });

//     // Load the HTML content into cheerio
//     const $ = cheerio.load(data);

//     // Find all the article titles (assuming they are within <h2> tags with a class "post-title")
//     const productListContainer = $("div").attr('data-producttile-wrapper');

//     // Print the titles
//     productListContainer.each((index, element) => {
//       console.log($(element).find('p.productTile-details__name-value').text());
//     });
//   } catch (error) {
//     console.error(`Failed to retrieve the webpage: ${error}`);
//   }
// };

import puppeteer from "puppeteer";

const scrapeCoop = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    );


    const pg = await page.goto(url);
    console.log("🚀 ~ scrapeCoop ~ pg:", pg?.status())

    const titles = await page.evaluate(() => {
        console.log("🚀 ~ titles ~ document:", document)
        return Array.from(document.querySelectorAll('a.product-item__name')).map(element => element.textContent);
    });

  

    console.log(titles);

    await browser.close();

    // Or import puppeteer from 'puppeteer-core';

    // // Launch the browser and open a new blank page
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // // Navigate the page to a URL.
    // await page.goto('https://developer.chrome.com/');

    // // Set screen size.
    // await page.setViewport({width: 1080, height: 1024});

    // // Type into search box.
    // await page.locator('.devsite-search-field').fill('automate beyond recorder');

    // // Wait and click on first result.
    // await page.locator('.devsite-result-item-link').click();

    // // Locate the full title with a unique string.
    // const textSelector = await page
    // .locator('text/Customize and automate')
    // .waitHandle();
    // const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // // Print the full title.
    // console.log('The title of this blog post is "%s".', fullTitle);

// await browser.close();
};

// Execute the function
export { scrapeCoop };
