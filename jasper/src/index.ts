import { PrismaClient, AnalyticType, Server } from "@prisma/client";
import { WebSocket } from "ws";
import createLogger from "logging"
const prisma = new PrismaClient();
import { CronJob } from "cron";

const logger = createLogger('Jasper')

enum types{
    PLAYER_COUNT,
}
const verifyConnection = () =>
    new Promise<void>(async (resolve, reject) => {
        await prisma.user.findMany().catch(reject);
        resolve();
    });
function runAnalyticPlayerCount() {
    verifyConnection().then(async () => {
        logger.info("Verified connection to database");
        const server = await prisma.server.findMany({
            where: {
                disabled: false,
                approved: true,
            },
        });
        server.forEach(async (serverInfo: Server) => {
            const ws = new WebSocket(`${serverInfo.address}`);
            logger.info(`Connecting to ${serverInfo.address}`)
            ws.onopen = () => {
                ws.send("Accept: MOTD");
            };
            ws.on("message", async (msg) => {
            logger.info(`Connected to ${serverInfo.address}`)
            const data = msg.data;
            const find = await prisma.analytic.findFirst({
                where:{
                    serverId: serverInfo.uuid,
                }
            })
            console.log(msg)
            if (!find){
                await prisma.analytic.create({
                    data:{
                        serverId: serverInfo.uuid,
                        type: AnalyticType.PLAYER_COUNT,
                        data: msg.online,
                    }
                });
                console.log("Created!")
            }
            ws.close();
        });
            ws.onerror = () => {
                logger.warn(`Unable to connect to ${serverInfo.address}`)
                ws.terminate();
            }
        });
    });
}

const job = new CronJob("59 * * * * *", runAnalyticPlayerCount);
job.start();