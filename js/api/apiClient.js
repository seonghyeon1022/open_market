import { getAuthData, saveAuthData, clearAuthData } from './core/storage.js';
import { refreshAccessToken, logout } from './core/auth.js';

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

export async function get(url) {
    const res = await apiClient(url, { method: 'GET' });
    return parseJSON(res);
}

export async function post(url, data) {
    const res = await apiClient(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return parseJSON(res);
}

export default apiClient;
