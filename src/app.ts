import express, { NextFunction } from 'express';
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
app.use('/api', (req: any, res: any, next: NextFunction) => {
  let authorizer: any;
  const index: number = req.rawHeaders.lastIndexOf("x-apigateway-event");
  if (index != -1) {
    const xApigatewayEventRaw: any = decodeURIComponent(req.rawHeaders[index + 1]);
    const xApigatewayEvent:any = JSON.parse(xApigatewayEventRaw);
    authorizer = xApigatewayEvent.requestContext?.authorizer?.claims;
  }
  req.authorizer = process.env.AUTHORIZER || authorizer;
  next();
}, routes);

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

// --------------------------------------

// Import necessary modules
// const awsServerlessExpress = require('aws-serverless-express');
// const express = require('express');
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // /hello route
// app.get('/helloworld', (req: any, res: any) => {
//     console.log("=========================================================================")
//     console.log("Hello World Route Event payload: ", req); // Logs the full event payload
//     console.log("=========================================================================")
//     // console.log("xxx my raw event" + JSON.stringify(req.rawHeaders))
//     console.log("xxx my raw event" + decodeURIComponent(req.rawHeaders[25]));
    
//     res.json({ "Route": "Called from Hello World route" });
// });

// // /bye route
// app.get('/healthcheck', (req: any, res: any) => {
//     console.log("=========================================================================")
//     console.log("Health Check Route Event payload: ", req); // Logs the full event payload
//     console.log("=========================================================================")
//     res.json({ "Route": "Called from Health Check route" });
// });

// // /test route
// app.get('/test', (req: any, res: any) => {
//     console.log("=========================================================================")
//     console.log("Test Route Event payload: ", req); // Logs the full event payload
//     console.log("=========================================================================")
//     res.json({ "Route": "Called from Test route" });
// });

// // Create the server
// const server = awsServerlessExpress.createServer(app);

// // Lambda handler
// exports.handler = (event: any, context: any) => {
//     console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
//     console.log("Original Lambda event: ", JSON.stringify(event, null, 2)); // Log the full event from API Gateway
//     console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
//     awsServerlessExpress.proxy(server, event, context);
// };

