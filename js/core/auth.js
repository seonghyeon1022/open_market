import { ENDPOINT } from '../api/config.js';
import { getAuthData, saveAuthData, clearAuthData } from './storage.js';

/**
 * 로그인 상태 체크
 * accessToken 존재 여부만 체크 (간단하게)
 */
export function isLoggedIn() {
    const { accessToken } = getAuthData();
    return !!accessToken;
}

/**
 * accessToken 갱신
 * refreshToken 으로 새로운 accessToken 요청
 * 성공 시 저장, 실패 시 클리어
 */
export async function refreshAccessToken() {
    const { refreshToken, userType } = getAuthData();

    if (!refreshToken) {
        clearAuthData();
        return false;
    }

    try {
        const res = await fetch(ENDPOINT.REFRESH_TOKEN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

    if (!res.ok) {
        clearAuthData();
        return false;
    }

    const data = await res.json();

    saveAuthData({
        accessToken: data.access,
        refreshToken, 
        userType,
    });

    return true;
    } catch (error) {
        clearAuthData();
        return false;
    }
}

/**
 * 로그아웃 처리
 * 클라이언트에서 저장된 인증 정보 삭제
 */
export function logout() {
    clearAuthData();
}
