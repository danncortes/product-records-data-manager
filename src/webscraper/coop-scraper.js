import axios from 'axios';
import cheerio from 'cheerio';

// URL of the website to scrape
const pages = 1;
const pageSize = 30;
const url = `https://www.coop.ch/de/search?page=${pages}&pageSize=${pageSize}&q=milch%3Arelevance&text=milch&sort=relevance`;
const keywords = ['vollmich', 'milchdrink','reisdrink', 'mandeln', 'schafmilch', 'milch drink', 'sojadrink', 'haferdrink'];
console.log("🚀 ~ url:", url)

// Function to scrape the website
const scrapeCoop = async () => {
  try {
    // Send a GET request to the website
    const { data } = await axios.get(url,{
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    });

    // Load the HTML content into cheerio
    const $ = cheerio.load(data);

    // Find all the article titles (assuming they are within <h2> tags with a class "post-title")
    const productListContainer = $("div").attr('data-producttile-wrapper');

    // Print the titles
    productListContainer.each((index, element) => {
      console.log($(element).find('p.productTile-details__name-value').text());
    });
  } catch (error) {
    console.error(`Failed to retrieve the webpage: ${error}`);
  }
};

// Execute the function
export {scrapeCoop}
