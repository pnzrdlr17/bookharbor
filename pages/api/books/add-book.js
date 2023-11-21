import { connectToDatabase } from '../../../lib/db';
import axios from 'axios';
import FormData from 'form-data';
import { Formidable } from 'formidable';
import fs from 'fs';

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getImageUrl(file) {
  try {
    const readStream = fs.createReadStream(file[0].filepath);
    const apiKey = process.env.FREEIMAGE_API_KEY;
    const apiUrl = 'https://freeimage.host/api/1/upload';

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('action', 'upload');
    formData.append('source', readStream);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check the response data for the uploaded image details

    return response.data.image.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return 'https://bookoftheday.org/wp-content/uploads/2023/11/600x900bb-19.png';
  }
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = await new Promise((resolve, reject) => {
    const form = new Formidable();

    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  const { title, author, isbn, description, city, owner } = data.fields;

  const coverFile = data.files.cover;

  const coverUrl = await getImageUrl(coverFile);
  console.log(coverUrl, 'fjjf');

  //check data...

  const client = await connectToDatabase();
  const booksCollection = client.db().collection('books');

  const result = await booksCollection.insertOne({
    title: title[0],
    author: author[0],
    coverUrl: coverUrl,
    isbn: isbn[0],
    description: description[0],
    city: city[0],
    owner: owner[0],
    userRequests: [],
  });

  console.log(result);

  res.status(201).json({ message: 'Book added successfully!' });
  client.close();
}

export default handler;
