import React from "react";
import {useSelector} from "react-redux";
import {Box, Button, Typography} from "@mui/material";
import axios from "../api/axios";
import store from "../store.js";
import {showAlert} from "../slices/alertSlice.js";

const Home = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h3" gutterBottom>
        메인 페이지
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // 세로 정렬
          alignItems: "center",
          gap: 2, // 요소 간의 간격
          mt: 4,
        }}
      >
        <Typography variant="body1">
          {accessToken ? '로그인 완료!' : '로그인 하지 않았습니다.'}
        </Typography>
      </Box>

      {/* 추가 버튼 세로 배치 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          color="info"
          size="large"
          onClick={async () => {
            const response = await axios.get("/user-role-test")
            store.dispatch(showAlert({message: response.data, severity: 'success'}));
          }}
        >
          USER 권한 테스트
        </Button>

        <Button
          variant="contained"
          color="warning"
          size="large"
          onClick={() => axios.get("/admin-role-test")}
        >
          ADMIN 권한 테스트
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
