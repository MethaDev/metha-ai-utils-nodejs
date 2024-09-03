import { Router } from 'express';

import user from './user.route';
import report from './report.route';

const router = Router();

router.use('/user', user);
router.use('/report', report);

export default router;
