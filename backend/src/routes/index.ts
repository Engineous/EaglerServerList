import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.use((_req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: "Unknown endpoint."
    });
    return next();
});

export default router;
