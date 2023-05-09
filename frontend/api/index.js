import Axios, { Method } from "axios";

class API {
    async request({ endpoint, method, body, headers }) {
        return new Promise((resolve, reject) => {
            Axios({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URI}${endpoint}`,
                method: method ?? "GET",
                data: body ?? null,
                headers,
                withCredentials: true,
            })
                .then(({ data }) => resolve(data))
                .catch(reject);
        });
    }

    async getUser() {
        return await this.request({
            endpoint: "/users/@me",
        });
    }

    async getSpecificUser(uuid) {
        return await this.request({
            endpoint: `/users/${uuid}`,
        });
    }

    async getServer(uuid) {
        return await this.request({
            endpoint: `/servers/${uuid}`,
        });
    }

    async getServers(page) {
        return await this.request({
            endpoint: `/servers?page=${page}`,
        });
    }

    async logout() {
        return await this.request({
            endpoint: "/oauth/logout",
        });
    }

    async createServer({ name, description, ip, tags }) {
        return await this.request({
            endpoint: "/servers/",
            method: "POST",
            body: {
                name,
                description,
                address: ip,
                tags,
            },
        });
    }

    async postComment({ uuid, content, captcha }) {
        return await this.request({
            endpoint: `/servers/${uuid}`,
            method: "POST",
            body: {
                content,
                captcha,
            },
        });
    }

    async vote({ id, captcha, value }) {
        return await this.request({
            endpoint: `/servers/${id}/vote`,
            method: "POST",
            body: {
                captcha,
                value,
            },
        });
    }
    async getAnalytics(id) {
        return await this.request({
            endpoint: `/servers/${id}/analytics`,
        });
    }
    async updateServer({ id, name, description }) {
        return await this.request({
            endpoint: `/servers/${id}`,
            method: "PUT",
            body: {
                name,
                description,
            },
        });
    }
    async adminUpdateServer({
        id,
        name,
        description,
        address,
        votes,
        discord,
        approved,
        disabled,
        verified,
        tags,
        owner,
    }) {
        return await this.request({
            endpoint: `/admin/servers/${id}`,
            method: "PUT",
            body: {
                name,
                description,
                address,
                votes: Number(votes),
                discord,
                approved,
                disabled,
                verified,
                tags,
                owner,
            },
        });
    }
    async getUserServers() {
        return await this.request({
            endpoint: `/servers/@me`,
        });
    }
}

export default new API();
