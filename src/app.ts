import express from 'express';
import serverless from 'serverless-http';
////////////////////
import { engine } from 'express-handlebars';
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
///////////////////

import routes from './routes';

const app = express();

app.use(express.json());

///////////////////////
app.use(cors());
  // view engine setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//////////////////////

app.use('/api', routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).send();
});

export const handler = serverless(app);
export default app;
