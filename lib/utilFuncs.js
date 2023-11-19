import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

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
    return quotes[0];
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

export async function getImageUrl(file) {
  const formData = new FormData();
  formData.append('key', '1259c55310b3ea430f300c4feb18d539');
  formData.append('action', 'upload');
  formData.append('source', file);

  try {
    const response = await axios.post(
      'https://api.imgbb.com/1/upload',
      formData,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.status === 200) {
      // Image uploaded successfully
      console.log(response.data);
      return response.data.url;
    } else {
      // Handle error
      console.error('Image upload failed:', response.data.error);
      return 'https://bookoftheday.org/wp-content/uploads/2023/11/600x900bb-19.png';
      return null;
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Image upload error:', error.message);
    return 'https://bookoftheday.org/wp-content/uploads/2023/11/600x900bb-19.png';
    return null;
  }
}
