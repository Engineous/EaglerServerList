import { PrismaClient, AnalyticType, Server } from "@prisma/client";
import { WebSocket } from "ws";
import createLogger from "logging";
const prisma = new PrismaClient();
import { CronJob } from "cron";
const version = "v1.0.4";
const logger = createLogger("Jasper");
logger.info(`Started JASPER ${version}`);
type ServerResponse = {
    data: {
        motd: string[];
        cache: boolean;
        max: number;
        players: string[];
        icon: boolean;
        online: number;
    };
    vers: string;
    name: string;
    time: BigInt | number;
    type: string;
    secure: boolean;
    brand: string;
    uuid: string;
    cracked: boolean;
};

const verifyConnection = () =>
    new Promise<void>(async (resolve, reject) => {
        await prisma.user.findMany().catch(reject);
        resolve();
    });

const safelyParseJSON = (json: string): unknown => {
    let parsed: string;

    try {
        parsed = JSON.parse(json);
    } catch (e) {
        return null;
    }

    return parsed;
};

const runAnalyticPlayerCount = () => {
    logger.info("Running player count analytic...");
    verifyConnection().then(async () => {
        const servers = await prisma.server.findMany({
            where: {
                disabled: false,
                verified: true,
            },
        });
        for (const server of servers) {
            await new Promise<void>((resolve) => {
                let hasReceived = false;
                const ws = new WebSocket(server.address);
                logger.info(`Connecting to ${server.address}...`);
                ws.onopen = () => ws.send("Accept: MOTD.cache");
                try {
                    ws.on("message", async (msg) => {
                        if (hasReceived)
                            return;
                        ws.close();
                        hasReceived = true;
                        logger.info(`Connected to ${server.address}`);
                        const data = (safelyParseJSON(
                            msg.toString()
                        ) as ServerResponse)
                            ? (safelyParseJSON(msg.toString()) as ServerResponse)
                                .data
                            : null;
                        if (!data)
                            return logger.warn(`Server ${server.address} returned invalid JSON data, skipping collection.`);
                        await prisma.analytic.create({
                            data: {
                                serverId: server.uuid,
                                type: AnalyticType.PLAYER_COUNT,
                                data: data.online.toString(),
                            },
                        });
                        await prisma.analytic.create({
                            data: {
                                serverId: server.uuid,
                                type: AnalyticType.UPTIME,
                                data: "true",
                            },
                        });
                        logger.info(
                            `Successfully collected player count and uptime analytics for ${server.address}`,
                        );
                        resolve();
                    });
                } catch (_) {
                    logger.error(
                        `Unable to process data from ${server.address}`
                    );
                    resolve();
                }
                ws.onerror = async () => {
                    logger.warn(`Unable to connect to ${server.address}`);
                    await prisma.analytic.create({
                        data: {
                            serverId: server.uuid,
                            type: AnalyticType.UPTIME,
                            data: "false",
                        },
                    });
                    await prisma.analytic.create({
                        data: {
                            serverId: server.uuid,
                            type: AnalyticType.PLAYER_COUNT,
                            data: "0",
                        },
                    });
                    ws.terminate();
                    resolve();
                };
            });
        }
    });
    logger.info(`Last Run: ${Date.now()}`);
};

const runVoteCooldownCheck = () => {
    logger.info("Running vote cooldown check...");
    verifyConnection().then(async () => {
        const cooldowns = await prisma.voteCooldown.findMany().catch(() => {});
        if (!cooldowns) return;
        await Promise.all(
            cooldowns.map(async (cooldown) => {
                if (cooldown.expiresAt < new Date())
                    await prisma.voteCooldown
                        .delete({
                            where: {
                                uuid: cooldown.uuid,
                            },
                        })
                        .then(() =>
                            logger.info(
                                `Successfully removed vote cooldown for user ${cooldown.uuid} and server ${cooldown.serverId}`
                            )
                        )
                        .catch(() => {});
            })
        );
    });
};

const job = new CronJob("30 * * * *", runAnalyticPlayerCount);
const voteCooldownJob = new CronJob("* * * * *", runVoteCooldownCheck);
job.start();
voteCooldownJob.start();
