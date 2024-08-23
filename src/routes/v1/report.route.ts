import { Request, Response, Router } from 'express';
import { summarizePDFDownload, summarizePDFEMail, generateView } from "../../controllers/report";

const router = Router();

router.get("/pdf/download", summarizePDFDownload);
router.get("/pdf/email", summarizePDFEMail);
router.get("/html/view", generateView);

router.post("/pdf/download", summarizePDFDownload);
router.post("/pdf/email", summarizePDFEMail);
router.post("/html/view", generateView);

export default router;