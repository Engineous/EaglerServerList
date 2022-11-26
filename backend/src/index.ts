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
});
