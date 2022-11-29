import { Request, Response, NextFunction } from "express";
import prisma from "../db";

const User = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.session)
        return res.status(401).json({
            success: false,
            message: "An invalid session was provided.",
        });

    const sessionString = req.cookies.session;
    const session = await prisma.session.findUnique({
        where: {
            sessionString,
        },
    });

    if (!session)
        return res.status(401).json({
            success: false,
            message: "An invalid session was provided.",
        });

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({
            where: {
                sessionString,
            },
        });
        return res.status(401).json({
            success: false,
            message: "This session has expired. Please re-authenticate.",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            uuid: session.userId,
        },
    });

    if (!user) {
        await prisma.session.delete({
            where: {
                sessionString,
            },
        });
        return res.status(401).json({
            success: false,
            message: "An invalid session was provided.",
        });
    }

    if (user.banned) {
        await prisma.session.delete({
            where: {
                sessionString,
            },
        });

        return res.status(403).json({
            success: false,
            message:
                "Your account is banned from the server list. Reason: " +
                user.banReason,
        });
    }

    req.user = user;
    return next();
};

const Admin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.session)
        return res.status(401).json({
            success: false,
            message: "An invalid session was provided.",
        });

    const sessionString = req.cookies.session;
    const session = await prisma.session.findUnique({
        where: {
            sessionString,
        },
    });

    if (!session)
        return res.status(401).json({
            success: false,
            message: "An invalid session was provided.",
        });

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({
            where: {
                sessionString,
            },
        });
        return res.status(401).json({
            success: false,
            message: "This session has expired. Please re-authenticate.",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            uuid: session.userId,
        },
    });

    if (!user) {
        await prisma.session.delete({
            where: {
                sessionString,
            },
        });
        return res.status(401).json({
            success: false,
            message: "An invalid session was provided.",
        });
    }

    if (!user.admin)
        return res.status(403).json({
            success: false,
            message: "You do not have permission to access this endpoint.",
        });

    req.user = user;
    return next();
};

const StringsOnly = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return next();

    for (const index in req.body) {
        const field = req.body[index];
        if (typeof field !== "string") delete req.body[index];
    }

    return next();
};

export { User, Admin, StringsOnly };
