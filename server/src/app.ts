import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import {router, errorRouter } from './routes';
dotenv.config();
import db from './db/models';
let db_error = null;
db.sequelize
  .sync(/*{force: true}*/)
  .catch(error => {
    db_error = error.message;
    console.log(`⚠️ Error connecting to DB`, error.message);
  })
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

const app: express.Application = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use('/api', db_error
  ? errorRouter
  : router);

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port} 🚀`);
});
