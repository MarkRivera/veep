import { Router } from "express";

import { validateParams } from "../../middleware/validateParams";
import { checkParams } from "../../middleware/checkParams";
import { uploadHandler } from "../../controllers/v1/videos";

const router = Router();

router.post("/",
  checkParams,
  validateParams,
  uploadHandler
)

export default router;