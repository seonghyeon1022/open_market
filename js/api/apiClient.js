import { getAuthData, saveAuthData, clearAuthData } from './core/storage.js';
import { refreshAccessToken, logout } from './core/auth.js';

async function apiClient(url, options = {}) {
    // 기본 옵션 초기화
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // 저장된 accessToken 가져오기
    const { accessToken, refreshToken, userType } = getAuthData();

    // accessToken이 있다면 Authorization 헤더 추가
    if (accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    // options에 headers가 있으면 병합
    options.headers = {
        ...defaultHeaders,
        ...(options.headers || {}),
    };

    try {
        let response = await fetch(url, options);

        // 토큰 만료 등으로 401 Unauthorized 또는 토큰 에러일 경우
        if (response.status === 401) {
            const data = await response.json();

            // 토큰 만료 메시지 체크
            if (
                data.code === 'token_not_valid' &&
                data.messages?.some(msg => msg.token_class === 'AccessToken')
            ) {
                // accessToken 재발급 시도
                const refreshed = await refreshAccessToken();

                if (refreshed) {
                    // 재발급 성공 시, 새로운 accessToken을 넣고 요청 재시도
                    const newTokens = getAuthData();
                    options.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;

                    response = await fetch(url, options);
                    return response;
                } else {
                    // 재발급 실패 시 로그아웃 처리
                    logout();
                    throw new Error('로그인이 만료되어 재로그인이 필요합니다.');
                }
            } else {
                // 다른 401 에러
                throw new Error(data.detail || '인증 오류가 발생했습니다.');
            }
        }

        // 성공/실패 모두 response 반환
        return response;
    } catch (error) {
        // 네트워크 오류 등 예외 처리
        throw error;
    }
}

export default apiClient;
