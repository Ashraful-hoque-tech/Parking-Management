import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/parking',
};

export default config;