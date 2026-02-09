/**
 * ✨ Healthcare Core Logic
 * 케어 커넥트 통합 로직 - @healthcare
 */

const USER_API = '/api/users';
let kakaoJsKey = '';
let currentUser = null;
let selectedMode = null; // 'senior' or 'guardian'

// ===================================
// 초기화 및 글로벌 설정
// ===================================

async function fetchConfig() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const data = await response.json();
            kakaoJsKey = data.kakaoJsKey;
            return true;
        }
    } catch (error) {
        console.error('설정 로드 실패:', error);
    }
    return false;
}

function initKakao() {
    if (typeof Kakao !== 'undefined' && !Kakao.isInitialized() && kakaoJsKey) {
        try {
            Kakao.init(kakaoJsKey);
            console.log('✅ Kakao SDK 초기화 완료');
            return true;
        } catch (e) {
            console.error('Kakao SDK 초기화 오류:', e);
        }
    }
    return typeof Kakao !== 'undefined' && Kakao.isInitialized();
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchConfig();
    setTimeout(() => {
        initKakao();
        handleKakaoRedirect();
    }, 500);
});

// ===================================
// 모드 선택 및 서비스 흐름
// ===================================

/**
 * 첫 화면에서 모드(어르신/보호자) 선택 핸들러
 */
function handleModeSelection(mode) {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    selectedMode = mode;
    navigateToMode(mode);
}

/**
 * 로그인 상태에 따른 UI 자물쇠(Lock) 처리
 */
function updateLockStatus(isLoggedIn) {
    const seniorLock = document.getElementById('seniorLock');
    const guardianLock = document.getElementById('guardianLock');
    const authCard = document.getElementById('authCard');

    if (isLoggedIn) {
        seniorLock.style.display = 'none';
        guardianLock.style.display = 'none';
        authCard.style.opacity = '0.5';
        authCard.style.pointerEvents = 'none';
        authCard.querySelector('h2').textContent = '연동됨 ✔';
    } else {
        seniorLock.style.display = 'flex';
        guardianLock.style.display = 'flex';
        authCard.style.opacity = '1';
        authCard.style.pointerEvents = 'auto';
        authCard.querySelector('h2').textContent = '계정 연동';
    }
}

/**
 * 상세 페이지로 화면 전환
 */
function navigateToMode(mode) {
    const mainDashboard = document.getElementById('mainDashboard');
    const mainHeader = document.getElementById('mainHeader');
    const seniorPage = document.getElementById('seniorPage');
    const guardianPage = document.getElementById('guardianPage');

    // 숨기기
    mainDashboard.style.display = 'none';
    mainHeader.style.display = 'none';

    if (mode === 'senior') {
        seniorPage.style.display = 'block';
        console.log('👵 어르신 모드 실행');
    } else if (mode === 'guardian') {
        guardianPage.style.display = 'block';
        console.log('🏠 보호자 모드 실행');
    }
}

function goBackToHome() {
    document.getElementById('mainDashboard').style.display = 'grid';
    document.getElementById('mainHeader').style.display = 'block';
    document.getElementById('seniorPage').style.display = 'none';
    document.getElementById('guardianPage').style.display = 'none';
    selectedMode = null;
}

// ===================================
// 모달 관리
// ===================================

function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

// ===================================
// Kakao 로그인
// ===================================

function loginWithKakao() {
    if (!initKakao()) return alert('카카오 SDK 초기화 실패');
    Kakao.Auth.authorize({
        redirectUri: window.location.origin + '/kakao-callback.html'
    });
}

function handleKakaoRedirect() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && window.location.pathname === '/') {
        processKakaoLogin(code);
        window.history.replaceState({}, document.title, '/');
    }
}

async function processKakaoLogin(code) {
    try {
        const response = await fetch('/api/auth/kakao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri: window.location.origin + '/kakao-callback.html' })
        });
        if (response.ok) {
            const result = await response.json();
            currentUser = result.user;
            onLoginSuccess();
        }
    } catch (e) {
        console.error(e);
    }
}

// ===================================
// Google 로그인
// ===================================

async function handleCredentialResponse(response) {
    const userInfo = decodeJwtPayload(response.credential);
    try {
        const regRes = await fetch(`${USER_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: userInfo.sub, provider: 'google', name: userInfo.name, email: userInfo.email, picture: userInfo.picture
            })
        });
        const result = await regRes.json();
        currentUser = result.user;
        currentUser.id = userInfo.sub;
        onLoginSuccess();
    } catch (e) {
        console.log(e);
    }
}

function decodeJwtPayload(token) {
    const base = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
}

// ===================================
// 공통 로그인 처리 및 UI 업데이트
// ===================================

function onLoginSuccess() {
    console.log(`✅ ${currentUser.name}님 로그인 성공`);

    // 화면 전환: 로그인 스크린 숨기고 모드 선택 대시보드 표시
    const loginScreen = document.getElementById('loginScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    if (loginScreen) loginScreen.style.display = 'none';
    if (mainDashboard) mainDashboard.style.display = 'grid';

    // 상태바 업데이트
    const userStatusBar = document.getElementById('userStatusBar');
    if (userStatusBar) {
        document.getElementById('userAvatar').src = currentUser.picture || 'https://via.placeholder.com/35';
        document.getElementById('userName').textContent = currentUser.name;
        userStatusBar.style.display = 'flex';
    }
}

function signOut() {
    if (typeof google !== 'undefined') google.accounts.id.disableAutoSelect();
    currentUser = null;

    // 화면 전환: 대시보드 숨기고 다시 로그인 스크린 표시
    const loginScreen = document.getElementById('loginScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    if (loginScreen) loginScreen.style.display = 'block';
    if (mainDashboard) mainDashboard.style.display = 'none';

    document.getElementById('userStatusBar').style.display = 'none';
    goBackToHome();
    alert('로그아웃 되었습니다.');
}

// ===================================
// 프로필 관리 및 유틸리티
// ===================================

function openProfileModal() {
    if (!currentUser) return;
    document.getElementById('profileAvatar').src = currentUser.picture || 'https://via.placeholder.com/80';
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email || '-';
    document.getElementById('profileModal').classList.add('show');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('show');
}

async function saveProfile() {
    const name = document.getElementById('profileName').value.trim();
    if (!name) return alert('이름을 입력하세요.');
    try {
        const res = await fetch(`${USER_API}/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            currentUser.name = name;
            document.getElementById('userName').textContent = name;
            closeProfileModal();
            alert('정보가 저장되었습니다.');
        }
    } catch (e) { console.log(e); }
}

async function deleteAccount() {
    if (!confirm('탈퇴하시겠습니까? 데이터가 모두 삭제됩니다.')) return;
    try {
        const res = await fetch(`${USER_API}/${currentUser.id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('탈퇴 처리되었습니다.');
            closeProfileModal();
            signOut();
        }
    } catch (e) { console.log(e); }
}

function triggerEmergency() {
    alert('🆘 비상 신호가 보호자와 관제 센터에 즉시 전송되었습니다!');
}
