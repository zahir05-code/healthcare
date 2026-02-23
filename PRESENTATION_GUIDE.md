# 🎤 내일 발표를 위한 실행 가이드 (CareConnect)

발표 장소나 다른 노트북에서 프로젝트를 완벽하게 실행하기 위한 단계별 매뉴얼입니다.

## 1. 프로젝트 파일 준비
두 가지 방법 중 선택하세요:
- **Git 사용 시**: 
  ```bash
  git clone https://github.com/zahir05-code/healthcare.git
  ```
- **직접 복사 시**: 
  `c:\Users\User\Desktop\healthcare` 폴더 전체를 USB 등에 담아 옮깁니다. (이때 `.git`, `node_modules` 폴더는 제외해도 무방합니다.)

## 2. 필수 프로그램 설치
- **Node.js**: [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치해야 합니다.

## 3. 환경 설정 (매우 중요)
보안상 `.env.local` 파일은 Git에 포함되지 않았으므로, 새 위치에서 직접 만들어주어야 합니다.
1. 프로젝트 루트 폴더에 `.env.local` 파일을 생성합니다.
2. 기존에 제가 만들어 둔 [템플릿](file:///c:/Users/User/Desktop/healthcare/.env.local)의 내용을 복사하여 붙여넣습니다.
3. 실제 사용할 **카카오 JavaScript 키**와 **Firebase URL**을 입력합니다.

## 4. 실행 방법
터미널(또는 CMD)을 열고 프로젝트 폴더로 이동한 뒤 다음 명령어를 입력합니다:

### [1단계: 라이브러리 설치]
```bash
npm install
```

### [2단계: 백엔드 서버 실행]
새 터미널 창에서:
```bash
node server.js
```
- 성공 시: `🚀 Firebase 연동 To-Do 서버 시작! (http://localhost:3000)` 메시지가 뜹니다.

### [3단계: 프론트엔드(Next.js) 실행]
또 다른 터미널 창에서:
```bash
npm run dev
```
- 기본적으로 [http://localhost:9002](http://localhost:9002) (또는 3000번대 포트)에서 실행됩니다. 터미널의 안내를 확인하세요.

## 5. 발표 시 팁
- **브라우저**: 크롬(Chrome) 브라우저 사용을 권장합니다.
- **테마 강조**: "지브리 테마의 아늑한 UI와 보안 강화(환경변수 관리)가 핵심"이라고 설명하시면 좋습니다.

내일 발표 성공적으로 잘 마치시길 응원하겠습니다! 화이팅! 💪
