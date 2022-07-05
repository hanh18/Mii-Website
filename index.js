import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {} from 'dotenv/config';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import methodOverride from 'method-override';
import { ApolloServer } from 'apollo-server-express';

import mongoDataMethods from './data/query';
// Load schema & resolve
import typeDefs from './schema/schema';
import resolvers from './resolver/resolver';

const app = express();
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

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
    return console.log(error);
  }
}

startServer();

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
