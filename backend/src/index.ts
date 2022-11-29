import { config } from "dotenv";
import prisma from "./db";
import listen from "./app";
config();

const verifyConnection = () =>
    new Promise<void>(async (resolve, reject) => {
        await prisma.user.findMany().catch(reject);
        resolve();
    });

verifyConnection().then(() => {
    console.log("Verified connection to database");
    listen(parseInt(process.env.PORT!)).then(() =>
        console.log(
            `Backend is successfully running on port ${process.env.PORT!}`
        )
    );
    setInterval(async () => {
        const cooldowns = await prisma.voteCooldown.findMany();
        await Promise.all(
            cooldowns.map(async (cooldown) => {
                if (cooldown.expiresAt < new Date())
                    await prisma.voteCooldown.delete({
                        where: {
                            uuid: cooldown.uuid,
                        },
                    });
            })
        );
    }, 60000);
});
