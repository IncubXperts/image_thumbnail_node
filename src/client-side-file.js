const express = require('express');
const app = express();
const PORT = 8000;
const fileUpload = require("express-fileupload");
const sharp = require("sharp");

app.use(fileUpload());

app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  //headers clients can use in their requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  //allow request to continue and be handled by routes
  next();
});

const thumbnailWidth = 200;
const thumbnailHeight = 200;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.post('/generateThumbnail', async (req, res) => {
  console.log(req.files);
  const fileBuffer = req.files.fileData.data;
  const thumbnail = await createThumbnail(fileBuffer, thumbnailWidth, thumbnailHeight);
  res.send({thumbnail});
});


async function createThumbnail(inputBuffer, width, height) {
  // create a thumbnail from the stream
  return await sharp(inputBuffer)
    .resize(width, height, { fit: "inside" })
    .toBuffer().then(res => res)
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});