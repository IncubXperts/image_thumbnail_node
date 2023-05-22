const sharp = require('sharp');
const fs = require('fs');

// Width and height of the thumbnail
const thumbnailWidth = 200;
const thumbnailHeight = 200;


// Path to the original image
const imagePath = __dirname + "\\temp\\large-image.jpg";

// Path where you want to save the thumbnail
const thumbnailPath = __dirname + "\\temp\\thumb-image.jpg";


function generateThumbnailFromFile(inputImageFile, outputThumbnailImageFile) {
  try {
    console.log("This is a thumbnail generation sample code, It generates thumbnail from image");
    const readStream = fs.createReadStream(inputImageFile);
    const writeStream = fs.createWriteStream(outputThumbnailImageFile);
    const thumbnailStream = createThumbnail(readStream, thumbnailHeight, thumbnailWidth, (err, res) => {
      if (res) {
        console.log("Thumbnail Successfully generated at: ", writeStream.path);
      }
      else {
        console.log(err);
      }
    });

    //pipe the thumbnail stream into the write stream
    thumbnailStream.pipe(writeStream);
  }
  catch (error) {
    console.error(error);
  }
}


function createThumbnail (inputfileStream, width, height, callback) {

  console.log("Generating thumbnail for image file ", inputfileStream.path);

  // create a thumbnail from the stream
  const thumbnail = sharp()
    .resize(width, height, { fit: "inside" })
    .toFormat('jpeg')
    .on("error", (err) => {
      if (typeof callback === 'function') {
        console.log("Error occurred while generating thumbnail");
        callback(err);
      }
    });

  // pipe the read stream into the thumbnail stream
  inputfileStream.pipe(thumbnail);
  if (typeof callback === 'function') {
    callback("Thumbnail generated succesfully", thumbnail);
  }
  return thumbnail;

};


generateThumbnailFromFile(imagePath, thumbnailPath);

