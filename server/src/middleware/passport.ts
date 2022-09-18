import prisma from '../db/prisma';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import passportJwt from 'passport-jwt';
import { User } from '@prisma/client';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// passport config
// inspired by https://github.com/woodburydev/TypescriptPassportwReact
// and https://github.com/washedupdeveloper/prisma-express-passport
// and https://github.com/microsoft/TypeScript-Node-Starter
// and https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user: { sub: string }, done) => {
  done(null, user.sub);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return done(null, user);
  } catch (error) {
    return done('no user to deserialize');
  }
});

// passport login with local email / password
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
          done(null, false, { message: 'Incorrect username or password.' });
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return done(err);
          if (result === true) {
            return done(null, { sub: user.uuid });
          } else {
            return done(null, false, {
              message: 'Incorrect username or password.',
            });
          }
        });
      } catch (error) {
        return done(null, false, {
          message: 'Incorrect username or password.',
        });
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      prisma.user
        .findUnique({
          where: {
            uuid: jwtPayload.sub,
          },
        })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((error) => done(error, false));
    }
  )
);
