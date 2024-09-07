import express from 'express';
// import serverless from "serverless-http";
import awsServerlessExpress from 'aws-serverless-express';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
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

// app.use(awsServerlessExpressMiddleware.eventContext());

// app.use('/api', routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).send();
});

///////////////

const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event: any, context: any) => {
  console.log("aws event stringify: " + JSON.stringify(event));
  console.log("aws context stringify: " + JSON.stringify(context));

  app.use('/api', routes);

  app.use((req: any, res: any, next: any) => {
    req.eventData = event;
    next();
  });

  const modifiedEvent = {
    xxx: "xxx temp data"
  };

  event.request = {
    lambdaEvent: modifiedEvent
  };

  awsServerlessExpress.proxy(server, event, context);
}

export default app;
