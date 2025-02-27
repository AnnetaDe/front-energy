import axios from "axios";

const API = import.meta.env.VITE_API_URL as string;

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


