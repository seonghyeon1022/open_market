export function saveAuthData({ accessToken, refreshToken, userType }) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userType', userType);
}

export function getAuthData() {
    return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        userType: localStorage.getItem('userType'),
    };
}

export function clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    }