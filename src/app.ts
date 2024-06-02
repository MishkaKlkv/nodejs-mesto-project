import express, {
  json, NextFunction, Request, Response
} from 'express';
import * as mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler, { notFoundHandler } from './middlewares/error-handler';
import { AuthContext } from './types/auth-context';
import helmet from 'helmet';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(helmet());

app.use((req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  res.locals.user = {
    _id: '665b846bdfef08d9f07197ca',
  };
  next();
});

app.use(json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT);
