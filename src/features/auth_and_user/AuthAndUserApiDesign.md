# 인증 및 사용자 관리 API 설계

## 1. 인증 API

### 1.1 회원가입
- **엔드포인트**: `POST /api/auth/signup`
- **요청**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "title": "홍길동",
    "terms_of_service_agreed": true,
    "privacy_policy_agreed": true,
    "personal_info_consent_agreed": true,
    "marketing_consent": false
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "title": "홍길동",
    "created_at": "2024-03-23T00:00:00Z"
  }
  ```

### 1.2 로그인
- **엔드포인트**: `POST /api/auth/login`
- **요청**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답**:
  ```json
  {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "title": "홍길동",
      "role": "user"
    }
  }
  ```

### 1.3 소셜 로그인
- **엔드포인트**: `POST /api/auth/{provider}/login`
- **지원 provider**: google, kakao
- **응답**: 로그인 API와 동일

### 1.4 토큰 갱신
- **엔드포인트**: `POST /api/auth/refresh`
- **요청**:
  ```json
  {
    "refresh_token": "refresh_token"
  }
  ```
- **응답**:
  ```json
  {
    "access_token": "new_jwt_token",
    "refresh_token": "new_refresh_token"
  }
  ```

### 1.5 로그아웃
- **엔드포인트**: `POST /api/auth/logout`
- **요청**: 없음 (토큰으로 인증)
- **응답**: 
  ```json
  {
    "status": "success"
  }
  ```

## 2. 사용자 관리 API

### 2.1 사용자 프로필 조회
- **엔드포인트**: `GET /api/users/me`
- **응답**:
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "title": "홍길동",
    "avatar_url": "https://...",
    "role": "user",
    "created_at": "2024-03-23T00:00:00Z",
    "last_login_at": "2024-03-23T00:00:00Z",
    "tutorial_completed": false,
    "tutorial_progress": null
  }
  ```

### 2.2 사용자 프로필 수정
- **엔드포인트**: `PUT /api/users/me`
- **요청**:
  ```json
  {
    "title": "홍길동",
    "avatar_url": "https://..."
  }
  ```
- **응답**: 프로필 조회 API와 동일

### 2.3 비밀번호 변경
- **엔드포인트**: `PUT /api/users/me/password`
- **요청**:
  ```json
  {
    "current_password": "old_password",
    "new_password": "new_password"
  }
  ```
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

### 2.4 이메일 인증
- **엔드포인트**: `POST /api/users/verify-email`
- **요청**:
  ```json
  {
    "token": "verification_token"
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "email_verified": true
  }
  ```

### 2.5 비밀번호 재설정 요청
- **엔드포인트**: `POST /api/users/reset-password-request`
- **요청**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "message": "비밀번호 재설정 이메일이 발송되었습니다."
  }
  ```

### 2.6 비밀번호 재설정
- **엔드포인트**: `POST /api/users/reset-password`
- **요청**:
  ```json
  {
    "token": "reset_token",
    "new_password": "new_password"
  }
  ```
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

### 2.7 튜토리얼 진행 상태 업데이트
- **엔드포인트**: `PUT /api/users/me/tutorial`
- **요청**:
  ```json
  {
    "tutorial_completed": true,
    "tutorial_progress": {
      "current_step": "document_creation",
      "completed_steps": ["welcome", "project_creation"]
    },
    "do_not_show_tutorial": false
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "tutorial_completed": true,
    "tutorial_completed_at": "2024-03-23T00:00:00Z"
  }
  ```

### 2.8 마케팅 수신 동의 설정
- **엔드포인트**: `PUT /api/users/me/marketing-consent`
- **요청**:
  ```json
  {
    "marketing_consent": true
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "marketing_consent": true,
    "marketing_consent_at": "2024-03-23T00:00:00Z"
  }
  ``` 