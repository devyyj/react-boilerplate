import React from 'react';
import {Button, Container} from '@mui/material';

function App() {
    // 카카오 로그인 API 호출
    const handleKakaoLogin = async () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao"
    };

    return (
        <Container>
            <Button
                variant="contained"
                color="primary"
                onClick={handleKakaoLogin}
                size="large"
            >
                버튼
            </Button>
        </Container>
    );
}

export default App;
