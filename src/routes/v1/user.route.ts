import { Request, Response, Router } from 'express';

const router = Router();

router.get('/info', async (req: any, res: Response) => {
  try {
    console.log("user info authorizer: " + req.authorizer?.email);
    const user = "user info: " + req.authorizer?.email;

    res.status(200).json(user);
  } catch (error) {
    console.error('An error ocurred:', error);
    res.status(500).json(error);
  }
});

router.get('/data', async (req: Request, res: Response) => {
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
