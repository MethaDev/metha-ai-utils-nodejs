import { Request, Response, Router } from 'express';

const router = Router();

router.get('/info', async (req: Request, res: Response) => {
  try {
    const reqX: any = req;
    console.log("user info reqX: path" + JSON.stringify(reqX.path));
    console.log("user info reqX: headers" + JSON.stringify(reqX.headers));
    console.log("user info reqX requestContext: " + JSON.stringify(reqX.requestContext));
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
