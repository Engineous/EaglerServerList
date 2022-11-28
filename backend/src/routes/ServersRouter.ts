import prisma from "../db";
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    const servers = await prisma.server.findMany({
        where: {
            disabled: false,
        },
        select: {
            uuid: true,
            name: true,
            description: true,
            verified: true,
            address: true,
            votes: true,
        },
    });

    return res.json({
        success: true,
        message: `Successfully retrieved ${servers.length} servers.`,
        data: servers,
    });
});

export default router;
