import axios from 'axios';
import cheerio from 'cheerio';

export async function getRandomQuote() {
  try {
    const response = await axios.get(
      'https://www.goodreads.com/quotes/tag/random'
    );
    const data = response.data;

    const $ = cheerio.load(data);

    const quotes = [];
    $('.quoteText').each((index, element) => {
      const quoteText = $(element).text().trim();
      quotes.push(quoteText);
    });

    return quotes[Math.floor(Math.random() * quotes.length)];
  } catch (error) {
    console.error(error);
  }
}

export async function getBookOfTheDay() {
  try {
    const response = await axios.get('https://bookoftheday.org/');
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('.featured-img a').attr('title').trim();
    const author = $('h2 a').text().trim();
    const imageUrl = $('.featured-img img').attr('src');
    const description = $('.entry-summary').text().trim();

    return { title, author, imageUrl, description };
  } catch (error) {
    console.error('Error fetching Book of the Day:', error);
    return null;
  }
}
