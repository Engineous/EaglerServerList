import { NextFunction, Request, Response, Router } from "express";
import OAuthRouter from "./OAuthRouter";
import ServersRouter from "./ServersRouter";

const router = Router();

router.use("/oauth", OAuthRouter);
router.use("/servers", ServersRouter);

router.use((_req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: "Unknown endpoint.",
    });
    return next();
});

export default router;
