import { PrismaClient, AnalyticType, Server } from "@prisma/client";
import { WebSocket } from "ws";
import createLogger from "logging";
const prisma = new PrismaClient();
import { CronJob } from "cron";
const version = "v1.0.1"
const logger = createLogger("Jasper");
logger.info(`Started JASPER ${version}`)
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
                approved: true,
            },
        });
        servers.forEach(async (serverInfo: Server) => {
            const ws = new WebSocket(`${serverInfo.address}`);
            logger.info(`Connecting to ${serverInfo.address}...`);
            ws.onopen = () => ws.send("Accept: MOTD.cache");
            ws.on("message", async (msg) => {
                ws.close();
                logger.info(`Connected to ${serverInfo.address}`);
                const data = (safelyParseJSON(msg.toString()) as ServerResponse).data;
                if (!data)
                    return logger.warn(
                        `Server ${serverInfo.address} returned invalid JSON data, skipping collection.`
                    );
                await prisma.analytic.create({
                    data: {
                        serverId: serverInfo.uuid,
                        type: AnalyticType.PLAYER_COUNT,
                        data: data.online.toString(),
                    },
                });
                await prisma.analytic.create({
                    data: {
                        serverId: serverInfo.uuid,
                        type: AnalyticType.UPTIME,
                        data: "true",
                    },
                });
                logger.info(
                    `Successfully collected player count and uptime analytics for ${serverInfo.address}`
                );
            });
            ws.onerror = async () => {
                logger.warn(`Unable to connect to ${serverInfo.address}`);
                await prisma.analytic.create({
                    data: {
                        serverId: serverInfo.uuid,
                        type: AnalyticType.UPTIME,
                        data: "false",
                    },
                });
                await prisma.analytic.create({
                    data: {
                        serverId: serverInfo.uuid,
                        type: AnalyticType.PLAYER_COUNT,
                        data: "0",
                    },
                });
                ws.terminate();
            };
        });
    });
    logger.info(`Last Run: ${Date.now()}`)
};

const job = new CronJob("* 59 * * * *", runAnalyticPlayerCount);
job.start();
