import express, { NextFunction, Request, Response } from 'express';
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

app.use('/api', routes);
// app.use('/api', (req: any, res: Response, next: NextFunction) => {
//   let authorizer: any;
//   const index: number = req.rawHeaders.lastIndexOf("x-apigateway-event");
//   if (index != -1) {
//     const xApigatewayEventRaw: any = decodeURIComponent(req.rawHeaders[index + 1]);
//     const xApigatewayEvent:any = JSON.parse(xApigatewayEventRaw);
//     authorizer = xApigatewayEvent.requestContext?.authorizer?.claims;
//   }
//   req.authorizer = process.env.AUTHORIZER || authorizer;
//   next();
// }, routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).send();
});

///////////////

const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event: any, context: any) => {
  awsServerlessExpress.proxy(server, event, context);
}

export default app;
