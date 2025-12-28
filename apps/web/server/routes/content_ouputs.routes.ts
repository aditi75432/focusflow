import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  createContentOutput,
  markProcessing,
  markProcessingComplete,
  markProcessingFailed,
  getMyContentOutputs,
  getContentOutputById,
} from "../controllers/content_outputs.controller";

const router = Router();

/**
 * STEP 1 — Create content output after RAW upload
 * POST /api/content_outputs
 */
router.post("/", protectRoute, createContentOutput);

/**
 * STEP 2 — Mark processing started
 * PATCH /api/content_outputs/:contentId/processing
 */
router.patch(
  "/:contentId/processing",
  protectRoute,
  markProcessing
);

/**
 * STEP 3 — Mark processing complete (processed JSON ready)
 * PATCH /api/content_outputs/:contentId/complete
 */
router.patch(
  "/:contentId/complete",
  protectRoute,
  markProcessingComplete
);

/**
 * STEP 4 — Mark processing failed
 * PATCH /api/content_outputs/:contentId/failed
 */
router.patch(
  "/:contentId/failed",
  protectRoute,
  markProcessingFailed
);

/**
 * GET — All READY content outputs for dashboard
 * GET /api/content_outputs
 */
router.get("/", protectRoute, getMyContentOutputs);

/**
 * GET — Single READY content output
 * GET /api/content_outputs/:contentId
 */
router.get("/:contentId", protectRoute, getContentOutputById);

export default router;
