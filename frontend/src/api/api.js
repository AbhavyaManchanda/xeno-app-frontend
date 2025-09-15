import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});
const API = process.env.REACT_APP_API_URL;
fetch(`${API}/api/items`).then();

export default api;
