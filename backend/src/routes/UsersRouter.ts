import { Router, Request, Response } from "express";
import { User } from "../middleware";

const router = Router();

router.get("/@me", User, async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: req.user,
    });
});

export default router;
