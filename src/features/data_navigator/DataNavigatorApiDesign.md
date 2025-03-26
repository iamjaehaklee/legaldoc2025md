# 프로젝트참고자료 뷰어 API 설계

## 1. API 엔드포인트

### 1.1 자료 목록 조회
```typescript
GET /api/projects/:projectId/references
Query Parameters:
  type: 'evidence' | 'claiming_document' | 'law' | 'precedent' | 'considerable_document' | 'judgement_etc'
  page: number
  limit: number
  sort: 'date' | 'name' | 'size'
  order: 'asc' | 'desc'
  search?: string
  fileType?: string
  author?: string
  startDate?: string
  endDate?: string

Response:
{
  items: Array<{
    id: string
    type: 'evidence' | 'claiming_document' | 'law' | 'precedent' | 'considerable_document' | 'judgement_etc'
    name: string
    fileType: string
    size: number
    author: {
      id: string
      name: string
      avatar: string
    }
    createdAt: string
    updatedAt: string
    commentCount: number
  }>
  total: number
  hasMore: boolean
}
```

### 1.2 자료 상세 조회
```typescript
GET /api/projects/:projectId/references/:referenceId
Response:
{
  id: string
  type: 'evidence' | 'claiming_document' | 'law' | 'precedent' | 'considerable_document' | 'judgement_etc'
  name: string
  fileType: string
  size: number
  content: string | null
  fileUrl: string | null
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
  viewerState?: {
    zoom: number
    page: number
    scrollPosition: { x: number, y: number }
  }
}
```

### 1.3 자료 뷰어 상태 저장
```typescript
PUT /api/projects/:projectId/references/:referenceId/viewer-state
Request Body:
{
  zoom: number
  page: number
  scrollPosition: {
    x: number
    y: number
  }
}
Response: 204 No Content
```

### 1.4 댓글 목록 조회
```typescript
GET /api/projects/:projectId/references/:referenceId/comments
Query Parameters:
  page: number
  limit: number

Response:
{
  items: Array<{
    id: string
    content: string
    author: {
      id: string
      name: string
      avatar: string
    }
    createdAt: string
    updatedAt: string
    parentId: string | null
    replyCount: number
  }>
  total: number
  hasMore: boolean
}
```

### 1.5 댓글 작성
```typescript
POST /api/projects/:projectId/references/:referenceId/comments
Request Body:
{
  content: string
  parentId?: string
}
Response:
{
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
  parentId: string | null
}
```

### 1.6 댓글 수정
```typescript
PUT /api/projects/:projectId/references/:referenceId/comments/:commentId
Request Body:
{
  content: string
}
Response:
{
  id: string
  content: string
  updatedAt: string
}
```

### 1.7 댓글 삭제
```typescript
DELETE /api/projects/:projectId/references/:referenceId/comments/:commentId
Response: 204 No Content
```

## 2. WebSocket 이벤트

### 2.1 실시간 댓글 업데이트
```typescript
// 서버 -> 클라이언트
interface CommentUpdateEvent {
  type: 'comment_created' | 'comment_updated' | 'comment_deleted'
  projectId: string
  referenceId: string
  data: {
    id: string
    content?: string
    author?: {
      id: string
      name: string
      avatar: string
    }
    createdAt?: string
    updatedAt?: string
    parentId?: string | null
  }
}
```

### 2.2 실시간 뷰어 상태 동기화
```typescript
// 클라이언트 -> 서버
interface ViewerStateUpdateEvent {
  type: 'viewer_state_update'
  projectId: string
  referenceId: string
  data: {
    zoom: number
    page: number
    scrollPosition: {
      x: number
      y: number
    }
  }
}

// 서버 -> 클라이언트
interface ViewerStateChangedEvent {
  type: 'viewer_state_changed'
  projectId: string
  referenceId: string
  userId: string
  data: {
    zoom: number
    page: number
    scrollPosition: {
      x: number
      y: number
    }
  }
}
```

## 3. 데이터베이스 스키마

### 3.1 ProjectReference 테이블
```sql
CREATE TABLE project_references (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  type VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  size BIGINT,
  content TEXT,
  file_url TEXT,
  author_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_type CHECK (type IN ('evidence', 'claiming_document', 'law', 'precedent', 'considerable_document', 'judgement_etc'))
);

CREATE INDEX idx_project_references_project_type ON project_references(project_id, type);
```

### 3.2 ReferenceViewerState 테이블
```sql
CREATE TABLE reference_viewer_states (
  id UUID PRIMARY KEY,
  reference_id UUID NOT NULL REFERENCES project_references(id),
  user_id UUID NOT NULL REFERENCES users(id),
  zoom NUMERIC,
  page INTEGER,
  scroll_x INTEGER,
  scroll_y INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(reference_id, user_id)
);
```

### 3.3 ReferenceComment 테이블
```sql
CREATE TABLE reference_comments (
  id UUID PRIMARY KEY,
  reference_id UUID NOT NULL REFERENCES project_references(id),
  author_id UUID NOT NULL REFERENCES users(id),
  parent_id UUID REFERENCES reference_comments(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reference_comments_reference ON reference_comments(reference_id);
CREATE INDEX idx_reference_comments_parent ON reference_comments(parent_id);
```

## 4. 캐싱 전략

### 4.1 서버 사이드 캐싱
- Redis를 사용하여 다음 데이터 캐싱:
  - 자료 목록 (5분)
  - 자료 상세 정보 (10분)
  - 댓글 목록 (2분)
  - 뷰어 상태 (실시간)

### 4.2 클라이언트 사이드 캐싱
- React Query를 사용하여 다음 데이터 캐싱:
  - 자료 목록 (staleTime: 1분)
  - 자료 상세 정보 (staleTime: 2분)
  - 댓글 목록 (staleTime: 30초)
- localStorage에 저장:
  - 마지막 선택 탭
  - 마지막 본 자료 ID
  - 뷰어 설정

## 5. 에러 처리
```typescript
interface APIError {
  code: string
  message: string
  details?: Record<string, any>
}

// 공통 에러 코드
const ERROR_CODES = {
  REFERENCE_NOT_FOUND: 'reference_not_found',
  COMMENT_NOT_FOUND: 'comment_not_found',
  PERMISSION_DENIED: 'permission_denied',
  INVALID_REQUEST: 'invalid_request',
  INTERNAL_ERROR: 'internal_error'
} as const
```
