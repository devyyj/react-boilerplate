import React from "react";
import {useSelector} from "react-redux";
import {Box, Typography, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import axios from "../api/axios"; // axios를 사용하여 HTTP 요청

const Home = () => {
  const accessToken = useSelector((state) => state.auth.accessToken); // Redux에서 accessToken 가져오기
  const navigate = useNavigate();

  const LOGOUT_URL = import.meta.env.VITE_API_URL + "/logout";

  // 회원 탈퇴 처리 함수
  const handleDeleteAccount = async () => {
    try {
      // accessToken이 있는지 확인 후 DELETE 요청 보내기
      if (accessToken) {
        const response = await axios.delete("/users/me");

        // 탈퇴가 성공적으로 처리되었을 때
        if (response.status === 200) {
          console.log("회원 탈퇴가 완료되었습니다.");
          // 성공 시 로그아웃 또는 리다이렉트
          navigate("/login"); // 예: 로그인 페이지로 이동
        }
      } else {
        console.error("사용자 인증이 필요합니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      // 실패 시 사용자에게 에러 메시지 등을 표시할 수 있음
    }
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h3" gutterBottom>
        메인 페이지
      </Typography>
      {accessToken ? (
        <>
          <Typography variant="body1" gutterBottom>
            로그인 완료!
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            href={LOGOUT_URL}
            sx={{mb: 2}} // 아래 버튼들과 간격 추가
          >
            로그아웃
          </Button>
          <Typography
            variant="body2"
            color="error"
            sx={{cursor: "pointer", mt: 2}}
            onClick={handleDeleteAccount} // 회원 탈퇴 버튼 클릭 시 함수 호출
          >
            회원 탈퇴
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1" gutterBottom>
            로그인하지 않았습니다.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{mb: 2}} // 아래 버튼들과 간격 추가
          >
            로그인 페이지로 이동
          </Button>
        </>
      )}

      {/* 버튼들을 세로로 배치 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          gap: 2, // 버튼 간 간격
        }}
      >
        {/* User 페이지로 이동 버튼 */}
        <Button
          variant="contained"
          color="info"
          size="large"
          onClick={() => navigate("/user")}
        >
          User 페이지로 이동
        </Button>

        {/* Admin 페이지로 이동 버튼 */}
        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={() => navigate("/admin")}
        >
          Admin 페이지로 이동
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
