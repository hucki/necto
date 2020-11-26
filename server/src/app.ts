import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';
import { auth } from 'express-openid-connect';
dotenv.config();
import db from './db/models';
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:3000',
  secret: process.env.AUTH0_SECRET,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

db.sequelize.sync(); //{force: true}
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

const app: express.Application = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(auth(authConfig))
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port} 🚀`);
});
