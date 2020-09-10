import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: 'postgres',
  },
};
export default config;
