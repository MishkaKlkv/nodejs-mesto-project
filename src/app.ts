import express, { json, NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/error-handler';
import {AuthContext} from './types/auth-context';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: '665b846bdfef08d9f07197ca',
  };
  next();
});

app.use(json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorHandler);

app.listen(PORT);
