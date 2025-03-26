# 프로젝트 설정 API 설계

## 1. 프로젝트 기본 설정 API

### 1.1 프로젝트 정보 조회
- **엔드포인트**: `GET /api/projects/{project_id}/settings`
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "프로젝트 제목",
    "description": "프로젝트 설명",
    "created_at": "2024-03-23T00:00:00Z",
    "updated_at": "2024-03-23T00:00:00Z",
    "owner": {
      "id": "uuid",
      "title": "홍길동",
      "email": "owner@example.com"
    },
    "status": "active",
    "settings": {
      "default_document_template": "uuid",
      "auto_save_interval": 30,
      "notification_settings": {
        "email_notifications": true,
        "in_app_notifications": true
      },
      "ai_features": {
        "auto_tagging": true,
        "evidence_recommendations": true,
        "law_recommendations": true
      }
    }
  }
  ```

### 1.2 프로젝트 설정 업데이트
- **엔드포인트**: `PUT /api/projects/{project_id}/settings`
- **요청**:
  ```json
  {
    "title": "수정된 프로젝트 제목",
    "description": "수정된 프로젝트 설명",
    "settings": {
      "default_document_template": "uuid",
      "auto_save_interval": 60,
      "notification_settings": {
        "email_notifications": false,
        "in_app_notifications": true
      },
      "ai_features": {
        "auto_tagging": false,
        "evidence_recommendations": true,
        "law_recommendations": true
      }
    }
  }
  ```
- **응답**: 프로젝트 정보 조회 API와 동일

## 2. 폴더 관리 API

### 2.1 폴더 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/folders`
- **응답**:
  ```json
  {
    "folders": [
      {
        "id": "uuid",
        "title": "증거자료",
        "type": "evidence",
        "parent_id": null,
        "created_at": "2024-03-23T00:00:00Z",
        "created_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "item_count": 15,
        "children": [
          {
            "id": "uuid",
            "title": "계약서",
            "type": "evidence",
            "parent_id": "uuid",
            "item_count": 5
          }
        ]
      }
    ]
  }
  ```

### 2.2 폴더 생성
- **엔드포인트**: `POST /api/projects/{project_id}/folders`
- **요청**:
  ```json
  {
    "title": "새 폴더",
    "type": "document",
    "parent_id": "uuid"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "새 폴더",
    "type": "document",
    "parent_id": "uuid",
    "created_at": "2024-03-23T00:00:00Z"
  }
  ```

### 2.3 폴더 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/folders/{folder_id}`
- **요청**:
  ```json
  {
    "title": "수정된 폴더명",
    "parent_id": "uuid"
  }
  ```
- **응답**: 폴더 생성 API와 동일

### 2.4 폴더 삭제
- **엔드포인트**: `DELETE /api/projects/{project_id}/folders/{folder_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

## 3. 템플릿 관리 API

### 3.1 문서 템플릿 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/templates`
- **응답**:
  ```json
  {
    "templates": [
      {
        "id": "uuid",
        "title": "기본 소장 템플릿",
        "description": "민사 소송 기본 소장 양식",
        "created_at": "2024-03-23T00:00:00Z",
        "created_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "is_default": true,
        "usage_count": 10
      }
    ]
  }
  ```

### 3.2 문서 템플릿 생성
- **엔드포인트**: `POST /api/projects/{project_id}/templates`
- **요청**:
  ```json
  {
    "title": "새 템플릿",
    "description": "템플릿 설명",
    "content": {
      "blocks": []
    },
    "is_default": false
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "새 템플릿",
    "description": "템플릿 설명",
    "created_at": "2024-03-23T00:00:00Z",
    "is_default": false
  }
  ```

### 3.3 문서 템플릿 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/templates/{template_id}`
- **요청**:
  ```json
  {
    "title": "수정된 템플릿명",
    "description": "수정된 설명",
    "content": {
      "blocks": []
    },
    "is_default": true
  }
  ```
- **응답**: 템플릿 생성 API와 동일

### 3.4 문서 템플릿 삭제
- **엔드포인트**: `DELETE /api/projects/{project_id}/templates/{template_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

## 4. 태그 관리 API

### 4.1 태그 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/tags`
- **응답**:
  ```json
  {
    "tags": [
      {
        "id": "uuid",
        "name": "중요",
        "color": "#FF0000",
        "created_at": "2024-03-23T00:00:00Z",
        "usage_count": 25,
        "is_ai_generated": false
      }
    ]
  }
  ```

### 4.2 태그 생성
- **엔드포인트**: `POST /api/projects/{project_id}/tags`
- **요청**:
  ```json
  {
    "name": "새 태그",
    "color": "#00FF00"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "name": "새 태그",
    "color": "#00FF00",
    "created_at": "2024-03-23T00:00:00Z"
  }
  ```

### 4.3 태그 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/tags/{tag_id}`
- **요청**:
  ```json
  {
    "name": "수정된 태그명",
    "color": "#0000FF"
  }
  ```
- **응답**: 태그 생성 API와 동일

### 4.4 태그 삭제
- **엔드포인트**: `DELETE /api/projects/{project_id}/tags/{tag_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ``` 