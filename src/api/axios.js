import axios from "axios";
import store from "../store"; // Redux store
import { setAccessToken, logout } from "../slices/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // API의 기본 URL
  withCredentials: true, // 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 대기열
let isRefreshing = false;
let failedQueue = [];

// 대기열 처리 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Axios 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // JWT 만료 에러 처리
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "JWT expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // /auth/reissue-token 호출하여 새로운 액세스 토큰 발급
          const response = await axiosInstance.post("/auth/reissue-token");

          if (response.data && response.data.accessToken) {
            store.dispatch(setAccessToken(response.data.accessToken)); // Redux에 저장
            axiosInstance.defaults.headers.common[
              "Authorization"
              ] = `Bearer ${response.data.accessToken}`;
            processQueue(null, response.data.accessToken);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);

          // /auth/reissue-token 실패 시 리프레시 토큰 삭제
          if (refreshError.response && refreshError.response.status === 401) {
            await axiosInstance.delete("/auth/refresh-token");
            store.dispatch(logout()); // Redux 상태 초기화
          }
        } finally {
          isRefreshing = false;
        }
      }

      // 기존 요청 대기
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    return Promise.reject(error); // 다른 에러는 그대로 전달
  }
);

export default axiosInstance;
