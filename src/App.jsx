// src/App.jsx
import React, {useEffect, useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import store from './store';
import axios from './api/axios'; // Axios 기본 설정 파일
import {setAccessToken} from './slices/authSlice'; // 액세스 토큰 설정 액션
import Home from './pages/Home';
import Login from './pages/Login';
import User from "./pages/User.jsx";
import Admin from "./pages/Admin.jsx";

const AppContent = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.get('/auth/reissue-token');
        if (response.data && response.data.access_token) {
          dispatch(setAccessToken(response.data.access_token)); // Redux에 저장
        }
      } catch (error) {
        console.info('Browser refresh and failed to reissue access token:', error.response?.data || error.message);
      } finally {
        setIsInitialized(true); // 초기화 완료
      }
    };

    fetchAccessToken();
  }, [dispatch]);

  // 최상위 컴포넌트의 useEffect()가 실행을 마칠 때까지 대기
  if (!isInitialized) {
    return <div>Initializing...</div>; // 초기화 중 로딩 표시
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent/>
  </Provider>
);

export default App;
