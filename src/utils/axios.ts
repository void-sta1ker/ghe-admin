import axios from "axios";
import type { AxiosError } from "axios";
import settings from "@/config/settings";
import { refreshToken } from "@/features/auth";
import { notifications } from "@mantine/notifications";
import queryClient from "./query-client";

const request = axios.create({
  baseURL: settings.baseURL,
  timeout: settings.requestTimeout,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token !== null) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }

  // config.validateStatus = (status) => status < 500;

  return config;
}, errorHandler);

request.interceptors.response.use((response) => response.data, errorHandler);

export async function errorHandler(error: AxiosError): Promise<void> {
  if (error.response !== null && typeof error.response !== "undefined") {
    // server responded with a status code that falls out of the range of 2xx
    if (error.response?.status === 403) {
      // const rToken = localStorage.getItem("refresh_token");
      // if (rToken !== null) {
      //   try {
      //     const res = await refreshToken({ refresh: rToken });
      //     const { refresh, access } = res.data;
      //     localStorage.setItem("refresh_token", refresh);
      //     localStorage.setItem("access_token", access);
      //   } catch (err) {
      //     localStorage.setItem("refresh_token_error", JSON.stringify(err));
      //     localStorage.removeItem("refresh_token");
      //     localStorage.removeItem("access_token");
      //   } finally {
      //     window.location.reload();
      //   }
      // } else {
      //   localStorage.clear();
      //   queryClient.clear();
      //   window.location.reload();
      // }
    }

    if (error.response?.status === 401) {
      localStorage.clear();
      queryClient.clear();
      window.location.reload();
    }

    await Promise.reject(error.response);
  }

  if (error.request !== null && typeof error.request !== "undefined") {
    notifications.show({
      title: "Error",
      message: error.message,
      color: "red",
    });

    // no response received from server
    await Promise.reject(error.request);
  }

  // something happened in setting up the request
  console.error(error.message);

  console.log("Error config object:", error.config);

  // Using toJSON you get an object with more information about the HTTP error
  console.log("\nError object as json:", error.toJSON());

  notifications.show({
    title: "Error",
    message: error.message,
    color: "red",
  });

  await Promise.reject(error);
}

export default request;
