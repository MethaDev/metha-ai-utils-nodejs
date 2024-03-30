import { Router } from 'express';

import books from './books.route';
import pdf from './pdf.route';

const router = Router();

router.use('/books', books);
router.use('/pdf', pdf);

export default router;
