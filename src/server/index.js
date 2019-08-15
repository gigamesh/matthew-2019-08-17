require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const formidableMiddleware = require('express-formidable');

const app = express();

const CLOUDINARY_DIR = 'coding-test/';
const SIZE_LIMIT = 1e7;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(express.static('dist'));
app.use(formidableMiddleware());


// GET FULL DOCUMENT LIST

function getDocList(req, res) {
  cloudinary.v2.api.resources({
    type: 'upload',
    prefix: CLOUDINARY_DIR
  }, (err, cloudResponse) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json(cloudResponse);
  });
}

app.get('/api/list', getDocList);

// UPLOAD FILE

app.post('/api/upload', (req, res) => {
  // gets first image from req.files array (assumes only one image exists)
  const image = Object.values(req.files)[0];

  if (!image) {
    res.status(403).json({ message: 'No file supplied' });
    return;
  }

  if (image.size > SIZE_LIMIT) {
    res.status(403).json({ message: 'File size may not exceed 10mb' });
    return;
  }

  if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
    res.status(403).json({ message: 'File must be a jpg or png' });
    return;
  }

  // saves image to cloudinary folder with original file name as public_id
  const promise = cloudinary.v2.uploader.upload(image.path, {
    folder: CLOUDINARY_DIR,
    public_id: image.name
  });

  promise
    .then(() => {
      // upload was successful => retrieve updated list of files and send to client
      getDocList(req, res);
    })
    .catch(err => res.status(400).json(err));
});

// SEARCH FOR FILE
app.get('/api/search', (req, res) => {
  const { searchString } = req.query;

  if (!searchString) {
    res.status(403).json({ message: 'No search text provided' });
    return;
  }

  cloudinary.v2.search.expression(searchString).max_results(10).execute()
    .then((result) => {
      if (!result.total_count) {
        res.status(404).json({ message: 'Not found' });
      } else {
        res.status(200).json(result);
      }
    })
    .catch(err => res.status(500).json(err));
});

// DELETE FILE
app.delete('/api/delete', (req, res) => {
  const { publicId } = req.query;
  cloudinary.v2.api.delete_resources([publicId], (err, cloudResult) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    if (cloudResult.deleted[publicId] === 'not_found') {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.status(200).json(cloudResult);
    }
  });
});


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
