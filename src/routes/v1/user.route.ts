import { Request, Response, Router } from 'express';

const router = Router();

router.get('/helloworld', (req: any, res: any) => {
      console.log("=========================================================================")
      console.log("Hello World Route Event payload: ", req); // Logs the full event payload
      console.log("=========================================================================")
      // console.log("xxx my raw event" + JSON.stringify(req.rawHeaders))
      console.log("xxx my raw event" + decodeURIComponent(req.rawHeaders[25]));
      
      res.json({ "Route": "Called from Hello World route" });
  });

router.get('/info', async (req: any, res: Response) => {
  try {
    console.log("user info authorizer: " + req.authorizer?.email);
    const reqX: any = req;
    console.log("user info reqX.rawHeaders: " + reqX.rawHeaders);
    console.log("user info reqX xxx: " + req.xxx);

    const index: number = reqX.rawHeaders.lastIndexOf("x-apigateway-event");
    const xApigatewayEventRaw: any = decodeURIComponent(reqX.rawHeaders[index + 1]);
    const xApigatewayEvent:any = JSON.parse(xApigatewayEventRaw);

    console.log("user info reqX rawHeaders (25): " + xApigatewayEvent);
    console.log("user info reqX rawHeaders requestContext: " + xApigatewayEvent.requestContext);
    console.log("user info reqX rawHeaders requestContext authorizer: " + xApigatewayEvent.requestContext?.authorizer);
    console.log("user info reqX rawHeaders requestContext authorizer claims email: " + xApigatewayEvent.requestContext?.authorizer?.claims?.email);
    // x-apigateway-event

    const user = "user info:";

    res.status(200).json(user);
  } catch (error) {
    console.error('An error ocurred:', error);
    res.status(500).json(error);
  }
});

router.get('/data', async (req: Request, res: Response) => {
  // console.log("user req: " + JSON.stringify(req));
  // console.log("user res: " + JSON.stringify(res));
  try {
    const data = {
      id: 'ebb3d966-74e4-11ed-8db0-136d663b98e7',
      title: 'Some Title',
      author: 'Some Author',
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('An error ocurred:', error);
    res.status(500).json(error);
  }
});

export default router;
