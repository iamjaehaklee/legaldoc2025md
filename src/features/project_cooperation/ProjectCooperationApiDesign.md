# 프로젝트 협업 API 설계

## 1. 프로젝트 멤버 관리 API

### 1.1 프로젝트 멤버 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/members`
- **응답**:
  ```json
  {
    "members": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "email": "user@example.com",
          "title": "홍길동",
          "avatar_url": "https://..."
        },
        "role": "owner",
        "joined_at": "2024-03-23T00:00:00Z",
        "status": "accepted",
        "is_paid_user": true
      }
    ],
    "total": 10
  }
  ```

### 1.2 프로젝트 멤버 초대
- **엔드포인트**: `POST /api/projects/{project_id}/invitations`
- **요청**:
  ```json
  {
    "email": "user@example.com",
    "role": "editor"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "role": "editor",
    "status": "pending",
    "invited_at": "2024-03-23T00:00:00Z",
    "expires_at": "2024-03-30T00:00:00Z"
  }
  ```

### 1.3 초대 수락/거절
- **엔드포인트**: `PUT /api/projects/invitations/{invitation_id}`
- **요청**:
  ```json
  {
    "action": "accept" // or "reject"
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "project": {
      "id": "uuid",
      "title": "프로젝트 제목"
    }
  }
  ```

### 1.4 멤버 역할 변경
- **엔드포인트**: `PUT /api/projects/{project_id}/members/{member_id}/role`
- **요청**:
  ```json
  {
    "role": "editor"
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "role": "editor",
    "updated_at": "2024-03-23T00:00:00Z"
  }
  ```

### 1.5 멤버 제거
- **엔드포인트**: `DELETE /api/projects/{project_id}/members/{member_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

## 2. 실시간 협업 API

### 2.1 문서 편집 세션 생성
- **엔드포인트**: `POST /api/documents/{document_id}/sessions`
- **응답**:
  ```json
  {
    "session_id": "uuid",
    "document": {
      "id": "uuid",
      "version": 1,
      "content": "문서 내용"
    },
    "collaborators": []
  }
  ```

### 2.2 실시간 편집 이벤트
- **WebSocket 엔드포인트**: `ws://api/documents/{document_id}/collaboration`
- **이벤트 타입**:
  ```json
  {
    "type": "cursor_move",
    "data": {
      "user_id": "uuid",
      "position": {
        "path": [0, 0],
        "offset": 5
      }
    }
  }
  ```
  ```json
  {
    "type": "content_change",
    "data": {
      "user_id": "uuid",
      "operations": [
        {
          "type": "insert_text",
          "path": [0, 0],
          "offset": 5,
          "text": "새로운 텍스트"
        }
      ]
    }
  }
  ```

### 2.3 편집 충돌 해결
- **엔드포인트**: `POST /api/documents/{document_id}/resolve-conflict`
- **요청**:
  ```json
  {
    "base_version": 1,
    "changes": [
      {
        "type": "insert_text",
        "path": [0, 0],
        "offset": 5,
        "text": "새로운 텍스트"
      }
    ]
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "resolved_version": 2,
    "conflicts": []
  }
  ```

## 3. 알림 API

### 3.1 알림 목록 조회
- **엔드포인트**: `GET /api/notifications`
- **응답**:
  ```json
  {
    "notifications": [
      {
        "id": "uuid",
        "title": "프로젝트 초대",
        "content": "홍길동님이 '프로젝트 제목'에 초대하였습니다.",
        "type": "project_invite",
        "read": false,
        "created_at": "2024-03-23T00:00:00Z",
        "project_id": "uuid",
        "source_id": "uuid",
        "source_type": "project_invitation",
        "action_url": "/projects/uuid/invitations"
      }
    ],
    "unread_count": 5,
    "total": 20
  }
  ```

### 3.2 알림 읽음 표시
- **엔드포인트**: `PUT /api/notifications/{notification_id}/read`
- **응답**:
  ```json
  {
    "status": "success",
    "unread_count": 4
  }
  ```

### 3.3 모든 알림 읽음 표시
- **엔드포인트**: `PUT /api/notifications/read-all`
- **응답**:
  ```json
  {
    "status": "success",
    "unread_count": 0
  }
  ```

### 3.4 알림 설정 관리
- **엔드포인트**: `PUT /api/users/me/notification-settings`
- **요청**:
  ```json
  {
    "project_invite": true,
    "comment": true,
    "edit": true,
    "upload": true,
    "ai_recommendation": true
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "settings": {
      "project_invite": true,
      "comment": true,
      "edit": true,
      "upload": true,
      "ai_recommendation": true
    }
  }
  ``` 