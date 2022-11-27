const randomString = (length: number, chars: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") => {
    let result = "";
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const daysFromNow = (d: number) => new Date(Date.now() + 86400000 * d);

export { randomString, daysFromNow };