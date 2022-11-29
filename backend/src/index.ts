import { config } from "dotenv";
import prisma from "./db";
import listen from "./app";
config();

const requiredEnvVariables = [
    "DATABASE_URL",
    "PORT",
    "FRONTEND_URI",
    "RECAPTCHA_SECRET_KEY",
];

const errors = [];
for (const env of requiredEnvVariables)
    if (!process.env.hasOwnProperty(env)) errors.push(env);

if (errors.length > 0) {
    console.log(`Missing environment variables: ${errors.join(", ")}`);
    console.log(`Aborting startup...`);
    process.exit(255);
}

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
