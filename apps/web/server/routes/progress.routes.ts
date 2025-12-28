import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getOrInitProgress } from "../controllers/progress.controller";

const router = Router();

router.get("/me", protectRoute, getOrInitProgress);

export default router;
