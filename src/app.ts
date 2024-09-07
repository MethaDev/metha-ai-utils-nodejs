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

/////////////////////
// Middleware to extract data from Lambda event if necessary
// app.use((req, res, next) => {
//   if (req.lambdaEvent) {
//     req.lambdaData = req.lambdaEvent; // Attach event data to req
//   }
//   next();
// });
/////////////////////

app.use(awsServerlessExpressMiddleware.eventContext());

app.use('/api', routes);

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

  const modifiedEvent = {
    xxx: "xxx temp data"
  };

  event.request = {
    lambdaEvent: modifiedEvent
  };

  console.log("aws event request stringify: " + JSON.stringify(event.request));

  awsServerlessExpress.proxy(server, event, context);
}

//////////////

// module.exports.handler = serverless(app);

// const handler = serverless(app);

// module.exports.handler = async (event: any, context: any) => {
//   const result = await handler(event, context);
//   console.log("event.headers.Authorization: " + event.headers.Authorization);
//   console.log("event stringify: " + JSON.stringify(event));
//   console.log("context stringify: " + JSON.stringify(context));
//   return result;
// }




// export const handler = serverless(app);

// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//   awsServerlessExpress.proxy(server, event, context);
// };

// export const handler = serverless(app);
// export async function handler(event: any) {
//   // Convert the event object to a JSON string
//   const eventString = JSON.stringify(event, null, 2);
  
//   // Log the event to CloudWatch
//   console.log("Received event:", eventString);

//   // Return the event in the response body
//   return {
//       statusCode: 200,
//       headers: {
//           "Content-Type": "application/json"
//       },
//       // Include the event in the response body
//       body: JSON.stringify({ message: "Event received", event: JSON.parse(eventString) })
//   };
// }
export default app;
