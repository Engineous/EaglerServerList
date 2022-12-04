import Axios, { Method } from "axios";

class API {
    async request({ endpoint, method, body, headers }) {
        return new Promise((resolve, reject) => {
            Axios({
                url: `http://localhost:3001${endpoint}`,
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
}

export default new API();
