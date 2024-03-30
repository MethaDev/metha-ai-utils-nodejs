import { Request, Response, Router } from 'express';
import { generateTemplate, generateTemplateOld, generateView } from "../../controllers/pdf";

const router = Router();

router.get("/generate", generateTemplate);
router.get("/generateOld", generateTemplateOld);
router.get("/view", generateView);

router.post("/generate", generateTemplate);
router.post("/generateOld", generateTemplateOld);
router.post("/view", generateView);

export default router;