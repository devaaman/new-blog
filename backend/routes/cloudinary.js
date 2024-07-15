const cloudinary = require('cloudinary').v2;
const dotenv=require('dotenv')
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRETE,
});
module.exports = cloudinary;
