import { Request, Response, Router } from 'express';
import { summarizePDFDownload, summarizePDFEMail, generateView } from "../../controllers/pdf";

const router = Router();

router.get("/summarize/download", summarizePDFDownload);
router.get("/summarize/email", summarizePDFEMail);
router.get("/summarize/view", generateView);

router.post("/summarize/download", summarizePDFDownload);
router.post("/summarize/email", summarizePDFEMail);
router.post("/summarize/view", generateView);

export default router;