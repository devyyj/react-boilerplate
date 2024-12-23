import React from "react";
import {useSelector} from "react-redux";
import {Box, Typography, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

const Home = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  const LOGOUT_URL = import.meta.env.VITE_API_URL + "/logout";

  const handleDeleteAccount = async () => {}

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
            onClick={handleDeleteAccount}
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
