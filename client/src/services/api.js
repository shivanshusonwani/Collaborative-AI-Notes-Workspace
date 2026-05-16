import axios from "axios";

const baseURL = "http://localhost:8080";

const API = axios.create({
	baseURL: `${baseURL}/api`,
	withCredentials: true,
});

export { baseURL };
export default API;
