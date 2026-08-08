import { Router, type IRouter } from "express";

import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";
import { validateBody, validateQuery } from "../middleware/validateZod";

import { authController } from "../controllers/auth.controller";
import { loadController } from "../controllers/load.controller";
import { bidController } from "../controllers/bid.controller";
import { agentController } from "../controllers/agent.controller";
import { reviewController } from "../controllers/review.controller";
import { podController } from "../controllers/pod.controller";

import {
  LoginSchema,
  RegisterSchema,
  CreateLoadSchema,
  UpdateLoadSchema,
  LoadFiltersSchema,
  CreateBidSchema,
  AcceptBidSchema,
  CreateReviewSchema,
} from "../schemas";

const router: IRouter = Router();

// ─── Auth routes (public) ──────────────────────────────────────────────────
const authRouter = Router();
authRouter.post("/login", validateBody(LoginSchema), authController.login);
authRouter.post("/register", validateBody(RegisterSchema), authController.register);
authRouter.get("/me", authenticate, authController.me);
router.use("/auth", authRouter);

// ─── Load routes ───────────────────────────────────────────────────────────
const loadRouter = Router();
// Anyone authenticated can list and view loads
loadRouter.get("/", authenticate, validateQuery(LoadFiltersSchema), loadController.list);
loadRouter.get("/:id", authenticate, loadController.get);

// Shipper creates/updates/deletes loads
loadRouter.post(
  "/",
  authenticate,
  requireRole("SHIPPER"),
  validateBody(CreateLoadSchema),
  loadController.create,
);
loadRouter.patch(
  "/:id",
  authenticate,
  requireRole("SHIPPER"),
  validateBody(UpdateLoadSchema),
  loadController.update,
);
loadRouter.delete("/:id", authenticate, requireRole("SHIPPER"), loadController.delete);

// Shipper views bids on their load + accepts a bid
loadRouter.get("/:loadId/bids", authenticate, requireRole("SHIPPER", "AGENT_ADMIN"), bidController.getBidsForLoad);
loadRouter.post(
  "/:id/accept-bid",
  authenticate,
  requireRole("SHIPPER"),
  validateBody(AcceptBidSchema),
  loadController.acceptBid,
);

// Carriers bid on loads
loadRouter.post(
  "/:loadId/bids",
  authenticate,
  requireRole("CARRIER"),
  validateBody(CreateBidSchema),
  bidController.create,
);

// POD upload (carrier, assigned carrier only — enforced in controller)
loadRouter.post("/:id/pod", authenticate, requireRole("CARRIER"), podController.upload);

router.use("/loads", loadRouter);

// ─── Bid routes ────────────────────────────────────────────────────────────
const bidRouter = Router();
// Carriers withdraw bids
bidRouter.delete("/:bidId", authenticate, requireRole("CARRIER"), bidController.withdraw);
// Carriers view their own bids
bidRouter.get("/my", authenticate, requireRole("CARRIER"), bidController.getMyBids);
router.use("/bids", bidRouter);

// ─── Carrier public profile + reviews ─────────────────────────────────────
const carrierRouter = Router();
carrierRouter.get("/:carrierId/reviews", authenticate, reviewController.list);
carrierRouter.post(
  "/:carrierId/reviews",
  authenticate,
  requireRole("SHIPPER"),
  validateBody(CreateReviewSchema),
  reviewController.create,
);
router.use("/carriers", carrierRouter);

// ─── Agent/Admin routes ─────────────────────────────────────────────────────
const agentRouter = Router();
agentRouter.use(authenticate, requireRole("AGENT_ADMIN"));

agentRouter.get("/dashboard", agentController.getDashboard);
agentRouter.get("/loads", agentController.getAgentLoads);
agentRouter.get("/carriers/flagged", agentController.getFlaggedCarriers);
agentRouter.get("/ledger", agentController.getLedger);
agentRouter.get("/ledger/export", agentController.exportLedger);

router.use("/agent", agentRouter);

export default router;
