# 채팅 API 설계

## 1. 채팅 메시지 API

### 1.1 채팅 메시지 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/chat/messages`
- **요청 파라미터**:
  ```json
  {
    "before_id": "uuid",
    "limit": 50
  }
  ```
- **응답**:
  ```json
  {
    "messages": [
      {
        "id": "uuid",
        "sender": {
          "id": "uuid",
          "title": "홍길동",
          "avatar_url": "https://..."
        },
        "message": "메시지 내용",
        "timestamp": "2024-03-23T00:00:00Z",
        "has_attachments": true,
        "edited": false,
        "is_ai_message": false,
        "attachments": [
          {
            "id": "uuid",
            "type": "evidence",
            "title": "계약서.pdf",
            "file_path": "https://..."
          }
        ]
      }
    ],
    "has_more": true
  }
  ```

### 1.2 채팅 메시지 전송
- **엔드포인트**: `POST /api/projects/{project_id}/chat/messages`
- **요청**:
  ```json
  {
    "message": "메시지 내용",
    "attachments": [
      {
        "type": "evidence",
        "evidence_id": "uuid"
      }
    ]
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "message": "메시지 내용",
    "timestamp": "2024-03-23T00:00:00Z",
    "status": "sent"
  }
  ```

### 1.3 채팅 메시지 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/chat/messages/{message_id}`
- **요청**:
  ```json
  {
    "message": "수정된 메시지 내용"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "message": "수정된 메시지 내용",
    "edited": true,
    "edited_at": "2024-03-23T00:00:00Z"
  }
  ```

### 1.4 채팅 메시지 삭제
- **엔드포인트**: `DELETE /api/projects/{project_id}/chat/messages/{message_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

## 2. 채팅 첨부 파일 API

### 2.1 첨부 파일 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/chat/attachments`
- **요청 파라미터**:
  ```json
  {
    "type": ["evidence", "document", "law", "precedent"],
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "attachments": [
      {
        "id": "uuid",
        "type": "evidence",
        "title": "계약서.pdf",
        "file_path": "https://...",
        "uploaded_at": "2024-03-23T00:00:00Z",
        "message_id": "uuid"
      }
    ],
    "total": 50
  }
  ```

### 2.2 첨부 파일 추가
- **엔드포인트**: `POST /api/projects/{project_id}/chat/messages/{message_id}/attachments`
- **요청**:
  ```json
  {
    "type": "evidence",
    "evidence_id": "uuid"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "type": "evidence",
    "title": "계약서.pdf",
    "file_path": "https://..."
  }
  ```

## 3. AI 채팅 API

### 3.1 AI 응답 요청
- **엔드포인트**: `POST /api/projects/{project_id}/chat/ai/ask`
- **요청**:
  ```json
  {
    "message": "질문 내용",
    "context": {
      "document_id": "uuid",
      "evidence_ids": ["uuid1", "uuid2"],
      "selection": "선택된 텍스트"
    }
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "message": "AI 응답 내용",
    "timestamp": "2024-03-23T00:00:00Z",
    "is_ai_message": true,
    "references": [
      {
        "type": "evidence",
        "id": "uuid",
        "title": "참조된 증거자료",
        "relevance_score": 0.95
      }
    ]
  }
  ```

### 3.2 AI 응답 피드백
- **엔드포인트**: `POST /api/projects/{project_id}/chat/ai/feedback`
- **요청**:
  ```json
  {
    "message_id": "uuid",
    "feedback_type": "helpful",
    "feedback_comment": "매우 도움이 되었습니다."
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "message": "피드백이 성공적으로 저장되었습니다."
  }
  ```

## 4. 실시간 채팅 이벤트

### 4.1 WebSocket 연결
- **엔드포인트**: `ws://api/projects/{project_id}/chat/ws`
- **연결 시 인증**:
  ```json
  {
    "token": "jwt_token"
  }
  ```

### 4.2 이벤트 타입
1. **메시지 수신**:
   ```json
   {
     "type": "message",
     "data": {
       "id": "uuid",
       "sender": {
         "id": "uuid",
         "title": "홍길동"
       },
       "message": "메시지 내용",
       "timestamp": "2024-03-23T00:00:00Z"
     }
   }
   ```

2. **메시지 수정**:
   ```json
   {
     "type": "message_edit",
     "data": {
       "message_id": "uuid",
       "new_content": "수정된 내용",
       "edited_at": "2024-03-23T00:00:00Z"
     }
   }
   ```

3. **메시지 삭제**:
   ```json
   {
     "type": "message_delete",
     "data": {
       "message_id": "uuid"
     }
   }
   ```

4. **타이핑 상태**:
   ```json
   {
     "type": "typing",
     "data": {
       "user_id": "uuid",
       "user_title": "홍길동",
       "status": "typing"
     }
   }
   ```

5. **AI 응답 진행 상태**:
   ```json
   {
     "type": "ai_response",
     "data": {
       "message_id": "uuid",
       "status": "processing",
       "progress": 0.5
     }
   }
   ```

## 5. 채팅 설정 API

### 5.1 채팅 설정 조회
- **엔드포인트**: `GET /api/projects/{project_id}/chat/settings`
- **응답**:
  ```json
  {
    "notifications": {
      "desktop": true,
      "email": false,
      "sound": true
    },
    "ai_features": {
      "auto_suggestions": true,
      "real_time_analysis": true
    },
    "display": {
      "show_timestamps": true,
      "compact_mode": false,
      "theme": "light"
    }
  }
  ```

### 5.2 채팅 설정 업데이트
- **엔드포인트**: `PUT /api/projects/{project_id}/chat/settings`
- **요청**:
  ```json
  {
    "notifications": {
      "desktop": false,
      "email": true,
      "sound": false
    },
    "ai_features": {
      "auto_suggestions": false,
      "real_time_analysis": true
    },
    "display": {
      "show_timestamps": true,
      "compact_mode": true,
      "theme": "dark"
    }
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "updated_at": "2024-03-23T00:00:00Z"
  }
  ``` 