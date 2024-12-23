import axios from "axios";
import store from "../store"; // Redux 스토어
import {setAccessToken, logout} from "../slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    // 액세스 토큰이 필요 없는 URL, 오히려 설정하는 것이 문제
    const exceptUrl = ["/auth/refresh-token", "/auth/reissue-token"]

    if (accessToken && !exceptUrl.includes(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 쿠키를 포함해야 삭제도 할 수 있다
    if (exceptUrl.includes(config.url)) {
      config.withCredentials = true
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response
      && error.response.status === 401
      && error.response.data === 'JWT expired'
      && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.get("/auth/reissue-token");
        const newAccessToken = response.data.access_token;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (reissueError) {
        if (reissueError.response
          && reissueError.response.status === 401
          && error.response.data === 'JWT expired') {
          // 리프레시 토큰도 만료된 경우
          await axiosInstance.delete("/auth/refresh-token");
          store.dispatch(logout());
        }
        // 액세스 토큰 재발급에 실패하면 로그인 페이지로 이동
        window.location.href = "/login";
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
