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

router.get("/:uuid", async (req: Request, res: Response) => {
    const server = await prisma.server.findUnique({
        where: {
            uuid: req.params.uuid,
        },
    });

    if (!server)
        return res.status(404).json({
            success: false,
            message: "A server with that UUID could not be found.",
        });

    return res.json({
        success: true,
        message: "Successfully fetched data for server " + server.uuid,
        data: server,
    });
});

export default router;
