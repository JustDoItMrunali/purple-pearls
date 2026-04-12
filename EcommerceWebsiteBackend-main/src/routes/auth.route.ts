import { Router } from "express";
import { AuthController } from "../controllers/authenticate_controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";

const AuthRouter = Router();
AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/logout", requireAuth, AuthController.logout);
AuthRouter.post("/resetPassword", AuthController.resetPassword);
AuthRouter.post("/forgotPassword", AuthController.forgotPassword);
AuthRouter.patch(
  "/users/:userId/lock",
  requireAuth,
  requireRole(UserRole.ADMIN),
  AuthController.lockAccount,
);
AuthRouter.patch(
  "/users/:userId/unlock",
  requireAuth,
  requireRole(UserRole.ADMIN),
  AuthController.unlockAccount,
);

AuthRouter.get("/get-users", requireAuth, AuthController.getUser);
export default AuthRouter;
