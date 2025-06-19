import { getAuthData, saveAuthData, clearAuthData } from './core/storage.js';
import { refreshAccessToken, logout } from './core/auth.js';

/**
 * API 요청을 처리하는 기본 클라이언트 함수
 * JWT accessToken을 Authorization 헤더에 자동 추가하고,
 * 토큰 만료 시 refreshToken으로 자동 갱신 후 재요청 시도함.
 *
 * @param {string} url - 요청할 API URL
 * @param {object} [options={}] - fetch 함수에 넘길 옵션 객체 (method, headers, body 등)
 * @returns {Promise<Response>} fetch 응답 객체 반환
 * @throws {Error} 인증 실패 또는 네트워크 오류 발생 시 에러 throw
 */
async function apiClient(url, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const { accessToken } = getAuthData();

    if (accessToken) {
        defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    options.headers = {
        ...defaultHeaders,
        ...(options.headers || {}),
    };

    try {
        let response = await fetch(url, options);

        if (response.status === 401) {
            const data = await response.json();

            const isTokenExpired =
                data.code === 'token_not_valid' &&
                data.messages?.some((msg) => msg.token_class === 'AccessToken');

            if (isTokenExpired) {
                const refreshed = await refreshAccessToken();

                if (refreshed) {
                    const newTokens = getAuthData();
                    options.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
                    response = await fetch(url, options);
                    return response;
                } else {
                    logout();
                    throw new Error('로그인이 만료되어 재로그인이 필요합니다.');
                }
            } else {
                throw new Error(data.detail || '인증 오류가 발생했습니다.');
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
}


/**
 * GET 요청용 래퍼 함수
 *
 * @param {string} url - 요청할 API URL
 * @returns {Promise<Response>} fetch 응답 객체 반환
 */
export async function get(url) {
    const res = await apiClient(url, { method: 'GET' });
    return parseJSON(res);
}


/**
 * POST 요청용 래퍼 함수
 *
 * @param {string} url - 요청할 API URL
 * @param {object} data - 요청할 JSON 데이터
 * @returns {Promise<Response>} fetch 응답 객체 반환
 */
export async function post(url, data) {
    const res = await apiClient(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return parseJSON(res);
}

export default apiClient;
