import { Request, Response, Router } from 'express';
import { reportPDFDownload, reportPDFEMail, reportView } from "../../controllers/report";

const router = Router();

router.get("/pdf/download", reportPDFDownload);
router.get("/pdf/email", reportPDFEMail);
router.get("/html/view", reportView);

router.post("/pdf/download", reportPDFDownload);
router.post("/pdf/email", reportPDFEMail);
router.post("/html/view", reportView);

export default router;