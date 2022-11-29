import prisma from "../db";
import { Router, Request, Response } from "express";
import { Admin, User } from "../middleware";

const router = Router();

router.get("/@me", User, async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: req.user,
    });
});

router.get("/:uuid", async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            uuid: req.params.uuid,
        },
        include: {
            servers: {
                select: {
                    uuid: true,
                    name: true,
                    address: true,
                    votes: true,
                    disabled: true,
                    verified: true,
                },
            },
        },
    });

    if (!user)
        return res.status(400).json({
            success: false,
            message: "A user with that UUID could not be found.",
        });

    return res.json({
        success: true,
        message: "Successfully grabbed data for that user.",
        data: user,
    });
});

router.get("/:uuid/full", Admin, async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            uuid: req.params.uuid,
        },
        include: {
            servers: {
                select: {
                    uuid: true,
                    name: true,
                    address: true,
                    verified: true,
                    approved: true,
                    disabled: true,
                    votes: true,
                },
            },
        },
    });

    if (!user)
        return res.status(400).json({
            success: false,
            message: "A user with that UUID could not be found.",
        });

    return res.json({
        success: true,
        message: "Successfully fetched data for that user.",
        data: user,
    });
});

export default router;
