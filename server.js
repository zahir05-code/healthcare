/**
 * To-Do List 백엔드 서버
 * Express + Firebase Realtime Database
 */

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// ===================================
// Firebase 초기화
// ===================================
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();
console.log('🔥 Firebase Realtime Database 연결 성공');

// ===================================
// 미들웨어 설정 및 보안 강화
// ===================================
app.use(cors());
app.use(express.json());

// 보안 강화: 특정 정적 파일만 허용하여 .env나 json 파일 보호
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/app.js', (req, res) => res.sendFile(path.join(__dirname, 'app.js')));
app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname, 'styles.css')));
app.get('/kakao-callback.html', (req, res) => res.sendFile(path.join(__dirname, 'kakao-callback.html')));
app.get('/kakao_login_medium_narrow.png', (req, res) => res.sendFile(path.join(__dirname, 'kakao_login_medium_narrow.png')));

// ===================================
// 카카오 OAuth 설정
// ===================================
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

/**
 * POST /api/auth/kakao - 카카오 로그인
 */
app.post('/api/auth/kakao', async (req, res) => {
    try {
        const { code, redirectUri } = req.body;
        if (!code) return res.status(400).json({ error: '인가 코드가 없습니다.' });

        // 1. 카카오 토큰 요청
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', KAKAO_REST_API_KEY);
        params.append('redirect_uri', redirectUri);
        params.append('code', code);

        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
            body: params
        });

        const tokenData = await tokenResponse.json();
        if (tokenData.error) return res.status(400).json({ error: tokenData.error_description });

        // 2. 카카오 사용자 정보 가져오기
        const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
        });

        const kakaoUser = await userResponse.json();
        const userId = kakaoUser.id.toString();
        const name = kakaoUser.properties?.nickname || '카카오 사용자';
        const email = kakaoUser.kakao_account?.email || '';

        // 3. Firebase에서 사용자 조회 또는 등록
        const userRef = db.ref(`users/${userId}`);
        const snapshot = await userRef.once('value');

        if (snapshot.exists()) {
            console.log('🔑 카카오 기존 회원 로그인:', name);
            return res.json({ isNew: false, user: snapshot.val() });
        }

        const newUser = { id: userId, provider: 'kakao', name, email, picture: '', createdAt: new Date().toISOString() };
        await userRef.set(newUser);
        console.log('🎉 카카오 신규 회원가입:', name);
        res.status(201).json({ isNew: true, user: newUser });
    } catch (error) {
        console.error('카카오 로그인 오류:', error);
        res.status(500).json({ error: '카카오 로그인 처리 실패' });
    }
});

// ===================================
// REST API 엔드포인트
// ===================================

app.get('/api/config', (req, res) => {
    res.json({ kakaoJsKey: process.env.KAKAO_JS_KEY });
});

/**
 * GET /api/todos - 전체 할 일 조회
 */
app.get('/api/todos', async (req, res) => {
    try {
        const snapshot = await db.ref('todos').once('value');
        const todosObj = snapshot.val() || {};
        const todosList = Object.keys(todosObj).map(key => todosObj[key])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(todosList);
    } catch (error) {
        res.status(500).json({ error: '조회 실패' });
    }
});

/**
 * GET /api/todos/range - 기간별 할 일 조회
 */
app.get('/api/todos/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = `${startDate}T00:00:00.000Z`;
        const end = `${endDate}T23:59:59.999Z`;

        const snapshot = await db.ref('todos').once('value');
        const todosObj = snapshot.val() || {};
        const filtered = Object.values(todosObj).filter(todo =>
            todo.createdAt >= start && todo.createdAt <= end
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: '기간 조회 실패' });
    }
});

/**
 * POST /api/todos - 새 할 일 추가
 */
app.post('/api/todos', async (req, res) => {
    try {
        const { text } = req.body;
        const id = Date.now();
        const newTodo = { id, text: text.trim(), completed: false, createdAt: new Date().toISOString() };

        await db.ref(`todos/${id}`).set(newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: '추가 실패' });
    }
});

/**
 * PATCH /api/todos/:id - 할 일 수정
 */
app.patch('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        await db.ref(`todos/${id}`).update({ completed });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: '수정 실패' });
    }
});

/**
 * DELETE /api/todos/:id - 할 일 삭제
 */
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.ref(`todos/${id}`).remove();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: '삭제 실패' });
    }
});

// ===================================
// User API (회원 관리)
// ===================================

app.post('/api/users/register', async (req, res) => {
    try {
        const { id, provider, name, email, picture } = req.body;
        const userRef = db.ref(`users/${id}`);
        const snapshot = await userRef.once('value');

        if (snapshot.exists()) {
            return res.json({ isNew: false, user: snapshot.val() });
        }

        const newUser = { id, provider, name, email, picture, createdAt: new Date().toISOString() };
        await userRef.set(newUser);
        res.status(201).json({ isNew: true, user: newUser });
    } catch (error) {
        res.status(500).json({ error: '회원가입 실패' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const snapshot = await db.ref(`users/${req.params.id}`).once('value');
        if (!snapshot.exists()) return res.status(404).json({ error: '사용자 없음' });
        res.json(snapshot.val());
    } catch (error) {
        res.status(500).json({ error: '조회 실패' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { name } = req.body;
        await db.ref(`users/${req.params.id}`).update({ name, updatedAt: new Date().toISOString() });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: '수정 실패' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await db.ref(`users/${req.params.id}`).remove();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: '탈퇴 실패' });
    }
});

// ===================================
// 서버 시작
// ===================================
app.listen(PORT, HOST, () => {
    console.log('');
    console.log('✨ ===================================');
    console.log(`🚀 Firebase 연동 To-Do 서버 시작!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log('✨ ===================================');
});

process.on('SIGINT', () => {
    console.log('\n👋 서버 종료');
    process.exit(0);
});
