import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const db = require('./db/models');

db.sequelize.sync(); //{force: true}
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port} 🚀`)
})