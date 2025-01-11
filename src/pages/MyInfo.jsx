import React, {useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import axios from "../api/axios.js";
import {useDispatch} from "react-redux";
import {setAccessToken} from "../slices/authSlice.js";
import {useNavigate} from "react-router-dom";

const MyInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmDeletion = async () => {
    await axios.delete("/users/me")
    // 서버에서 로그아웃 요청 (refreshToken 삭제)
    await axios.delete('/auth/refresh-token');
    dispatch(setAccessToken(null)); // Redux에서 액세스 토큰 초기화
    alert("회원 탈퇴가 완료되었습니다.");
    setIsDialogOpen(false); // 확인 후 다이얼로그 닫기
    navigate('/');
  };

  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h3" gutterBottom>
        내 정보
      </Typography>

      <Box sx={{display: "flex", justifyContent: "center", gap: 2, marginTop: 2}}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setIsDialogOpen(true)}
          sx={{width: "140px"}}
        >
          회원 탈퇴
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>회원 탈퇴</DialogTitle>
        <DialogContent>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setIsDialogOpen(false)} color="primary">
            취소
          </Button>
          <Button variant="contained" onClick={handleConfirmDeletion} color="error">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyInfo;
