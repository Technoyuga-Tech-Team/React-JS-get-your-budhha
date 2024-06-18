import axios from "axios";

export const api_services = axios.create({
  // baseURL: "http://192.168.29.134:3001/api",
  baseURL: "http://192.168.29.136:5001/api",

});

const getToken = () => {
  const token = localStorage.getItem("PIE_ADMIN_TOKEN");
  return `Bearer ${token}`;
};

api_services.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = getToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api_services.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
