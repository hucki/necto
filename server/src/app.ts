import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import morgan from 'morgan';
import cors from 'cors';
import { router } from './routes';
import './middleware/passport';
dotenv.config();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

// setup redis session store
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT as unknown as number || 6379;
const redisClient = new Redis(redisPort, redisHost);
const RedisStore = connectRedis(session);
redisClient.on('connect', function() {
  console.log('🚀 Redis connected!');
});
redisClient.on('error', (err) => {
  console.log('❌ new Redis error: ', err);
});

const app: express.Application = express();
app.set('trust proxy', true);

// setup middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(
  session({
    store: new RedisStore({
      client: redisClient
    }),
    name: 'necto.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 12 * 60 * 60 * 1000 }, // Set to secure:false for demo purposes
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);
app.listen(port, () => {
  console.log(`🚀 Server running at http://${host}:${port}`);
});
