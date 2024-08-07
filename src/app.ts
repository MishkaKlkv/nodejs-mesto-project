import dotenv from 'dotenv';
import express from 'express';
import * as mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler, { notFoundHandler } from './middlewares/error-handler';
import helmet from 'helmet';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import cors from 'cors';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errors } from 'celebrate';
import { limiter } from './utils/config';

dotenv.config();
const { PORT = 3000 } = process.env;
const app = express();
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('The server is about to crash');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errors());
app.use(errorLogger);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT);
