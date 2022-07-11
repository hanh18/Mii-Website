import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {} from 'dotenv/config';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import methodOverride from 'method-override';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

import mongoDataMethods from './data/query';

// Load schema & resolve
import typeDefs from './schema/schema';
import resolvers from './resolver/resolver';

// Router
import adminRouter from './routes/admin';
import authAdminRouter from './routes/auth.admin';

const app = express();
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// override using a query value
app.use(methodOverride('_method'));

let apolloServer = null;

// context: store function access by resolvers
// eslint-disable-next-line consistent-return
async function startServer() {
  try {
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: (request) => ({
        request,
        mongoDataMethods,
      }),
    });
    await apolloServer.start();

    apolloServer.applyMiddleware({ app });
  } catch (error) {
    throw new Error(error);
  }
}

startServer();

// Creating session
app.use(session({
  secret: 'key that will sign cookie',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24,
  },
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    },
  ),
}));

const isAuthAdmin = (req, res, next) => {
  if (req.session.isAuthAdmin) {
    next();
  } else {
    res.send('Login is require');
  }
};

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.use('/auth/admin', authAdminRouter);
app.use('/admin', isAuthAdmin, adminRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
