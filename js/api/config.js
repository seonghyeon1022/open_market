export const API_BASE = 'https://api.wenivops.co.kr/services/open-market';

export const ENDPOINT = {
    SIGNUP_BUYER: `${API_BASE}/accounts/buyer/signup/`,
    SIGNUP_SELLER: `${API_BASE}/accounts/seller/signup/`,
    VALIDATE_USERNAME: `${API_BASE}/accounts/validate-username/`,
    VALIDATE_REGISTRATION_NUMBER: `${API_BASE}/accounts/seller/validate-registration-number/`,
    LOGIN: `${API_BASE}/accounts/login/`,
    REFRESH_TOKEN: `${API_BASE}/accounts/token/refresh/`,
    GET_PRODUCTS: `${API_BASE}/products/`,
    // 필요한 만큼 추가
};