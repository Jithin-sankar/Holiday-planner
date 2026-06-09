import axios from "axios";

const BASE_URL = "https://api.holidayplanner.abrdns.com";

const API = axios.create({
    baseURL: `${BASE_URL}/api/`,
    withCredentials: true,
});

API.getMediaUrl = (path) => {
    if (!path) return "";
    return `${BASE_URL}${path}`;
};

export default API;