// src/App.jsx
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './store';
import axios from './api/axios'; // Axios 기본 설정 파일
import { setAccessToken } from './slices/authSlice'; // 액세스 토큰 설정 액션
import Home from './pages/Home';
import Login from './pages/Login';
import User from "./pages/User.jsx";
import Admin from "./pages/Admin.jsx";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.get('/auth/reissue-token');
        if (response.data && response.data.access_token) {
          dispatch(setAccessToken(response.data.access_token)); // Redux에 저장
        }
      } catch (error) {
        console.info('Browser refresh and failed to reissue access token:', error.response?.data || error.message);
      }
    };

    fetchAccessToken();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
