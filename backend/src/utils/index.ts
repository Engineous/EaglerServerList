import axios from "axios";

const randomString = (
    length: number,
    chars: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
) => {
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

const daysFromNow = (d: number) => new Date(Date.now() + 86400000 * d);
const validateCaptcha = (captchaResponse: string) =>
    new Promise<void>((resolve, reject) =>
        axios
            .get(
                `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`
            )
            .then((res) => {
                if (res.data && res.data.success) return resolve();
                reject();
            })
            .catch(reject)
    );

export { randomString, daysFromNow, validateCaptcha };
