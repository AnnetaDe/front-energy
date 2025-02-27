import axios from "axios";

// const API = import.meta.env.API_URL
const API = "https://energy-production-3537.up.railway.app"

export const _api = axios.create({
    baseURL: API,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

_api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Something went wrong:", error);
        return Promise.reject(error);
    }
);


