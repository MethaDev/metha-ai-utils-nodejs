import { Router } from 'express';

import books from './books.route';
import report from './report.route';

const router = Router();

router.use('/books', books);
router.use('/report', report);

export default router;
