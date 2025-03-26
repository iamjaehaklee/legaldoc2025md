# LegalEditor 문서작성탭 API 설계

## 1. API 엔드포인트 개요

### 1.1 Supabase API 엔드포인트

#### 문서 관리
- **문서 저장**
  ```typescript
  POST /rest/v1/documents
  {
    "id": string,
    "title": string,
    "content": string,
    "project_id": string,
    "folder_id": string,
    "created_by": string,
    "updated_at": timestamp,
    "version": number,
    "status": "draft" | "published",
    "tags": string[]
  }
  ```

- **문서 조회**
  ```typescript
  GET /rest/v1/documents?id=eq.{document_id}
  ```

- **문서 실시간 업데이트**
  ```typescript
  REALTIME /documents
  {
    "event": "UPDATE",
    "new": {
      "id": string,
      "content": string,
      "updated_at": timestamp
    }
  }
  ```

#### 버전 관리
- **버전 생성**
  ```typescript
  POST /rest/v1/document_versions
  {
    "id": string,
    "document_id": string,
    "version_number": string,
    "content": string,
    "description": string,
    "created_by": string,
    "created_at": timestamp
  }
  ```

- **버전 목록 조회**
  ```typescript
  GET /rest/v1/document_versions?document_id=eq.{document_id}
  ```

#### 협업
- **실시간 커서 위치**
  ```typescript
  REALTIME /document_cursors
  {
    "event": "UPDATE",
    "new": {
      "document_id": string,
      "user_id": string,
      "position": number,
      "updated_at": timestamp
    }
  }
  ```

- **댓글 관리**
  ```typescript
  POST /rest/v1/document_comments
  {
    "id": string,
    "document_id": string,
    "content": string,
    "selection_start": number,
    "selection_end": number,
    "created_by": string,
    "created_at": timestamp
  }
  ```

#### 문서 태그 관리
- **태그 추가**
  ```typescript
  POST /rest/v1/documents/{document_id}/tags
  {
    "tags": string[]
  }
  ```

- **태그 삭제**
  ```typescript
  DELETE /rest/v1/documents/{document_id}/tags
  {
    "tags": string[]
  }
  ```

#### 폴더 관리
- **폴더 생성**
  ```typescript
  POST /rest/v1/folders
  {
    "project_id": string,
    "parent_id": string | null,
    "title": string,
    "type": "document" | "evidence"
  }
  ```

- **폴더 조회**
  ```typescript
  GET /rest/v1/folders?project_id=eq.{project_id}
  ```

#### 인용 관리
- **인용 생성**
  ```typescript
  POST /rest/v1/document_citations
  {
    "document_id": string,
    "evidence_id": string | null,
    "law_clause_id": string | null,
    "precedent_paragraph_id": string | null,
    "citation_type": "evidence" | "law" | "precedent",
    "position_path": object,
    "created_by": string
  }
  ```

- **인용 조회**
  ```typescript
  GET /rest/v1/document_citations?document_id=eq.{document_id}
  ```

- **인용 삭제**
  ```typescript
  DELETE /rest/v1/document_citations?id=eq.{citation_id}
  ```

#### AI 상호작용 기록
- **상호작용 기록 생성**
  ```typescript
  POST /rest/v1/ai_agent_interactions
  {
    "user_id": string,
    "project_id": string,
    "mode": "write" | "ask",
    "query": string,
    "response": string,
    "context_data": object,
    "source_tab": "document_editor" | "project_analysis" | "evidence_viewer" | "chat"
  }
  ```

- **상호작용 기록 조회**
  ```typescript
  GET /rest/v1/ai_agent_interactions?project_id=eq.{project_id}
  ```

### 1.2 Python 서버 API 엔드포인트

#### AI 문서 생성
- **템플릿 기반 문서 생성**
  ```typescript
  POST /api/v1/ai/generate-document
  {
    "template_type": string,
    "project_data": object,
    "user_preferences": object
  }
  ```

- **AI 명령어 기반 문서 수정**
  ```typescript
  POST /api/v1/ai/modify-document
  {
    "document_content": string,
    "command": string,
    "context": object
  }
  ```

- **다음 내용 생성**
  ```typescript
  POST /api/v1/ai/generate-next-content
  {
    "current_content": string,
    "project_data": object,
    "evidence_data": object
  }
  ```

#### 문서 분석
- **문서 필드 분석**
  ```typescript
  POST /api/v1/ai/analyze-document-fields
  {
    "document_type": string,
    "content": string
  }
  ```

- **법적 유효성 검증**
  ```typescript
  POST /api/v1/ai/validate-legal-requirements
  {
    "document_type": string,
    "content": string,
    "jurisdiction": string
  }
  ```

#### 전거 추천
- **증거자료 추천**
  ```typescript
  POST /api/v1/ai/recommend-evidence
  {
    "selected_text": string,
    "project_id": string
  }
  ```

- **법령/판례 추천**
  ```typescript
  POST /api/v1/ai/recommend-law-precedent
  {
    "selected_text": string,
    "jurisdiction": string
  }
  ```

## 2. API 응답 구조

### 2.1 성공 응답
```typescript
{
  "status": "success",
  "data": object,
  "message": string
}
```

### 2.2 에러 응답
```typescript
{
  "status": "error",
  "error": {
    "code": string,
    "message": string,
    "details": object
  }
}
```

## 3. 실시간 이벤트 구조

### 3.1 문서 업데이트 이벤트
```typescript
{
  "type": "document_update",
  "data": {
    "document_id": string,
    "content": string,
    "updated_by": string,
    "updated_at": timestamp
  }
}
```

### 3.2 커서 위치 이벤트
```typescript
{
  "type": "cursor_update",
  "data": {
    "user_id": string,
    "position": number,
    "selection_start": number,
    "selection_end": number
  }
}
```

### 3.3 댓글 이벤트
```typescript
{
  "type": "comment_update",
  "data": {
    "comment_id": string,
    "action": "create" | "update" | "delete",
    "content": string,
    "created_by": string
  }
}
```

## 4. 보안 및 인증

### 4.1 인증 헤더
```typescript
{
  "Authorization": "Bearer {jwt_token}",
  "X-Client-Id": string
}
```

### 4.2 권한 레벨
- READ: 문서 조회
- WRITE: 문서 수정
- COMMENT: 댓글 작성
- ADMIN: 버전 관리 및 삭제 권한

## 5. 에러 코드
- `AUTH_ERROR`: 인증 관련 오류
- `PERMISSION_DENIED`: 권한 부족
- `INVALID_INPUT`: 잘못된 입력값
- `RESOURCE_NOT_FOUND`: 리소스를 찾을 수 없음
- `SERVER_ERROR`: 서버 내부 오류
- `AI_SERVICE_ERROR`: AI 서비스 관련 오류
- `RATE_LIMIT_EXCEEDED`: 요청 한도 초과

## 6. 성능 최적화

### 6.1 캐싱 전략
- 문서 내용: 5분
- 버전 정보: 1시간
- AI 분석 결과: 24시간
- 법령/판례 데이터: 1주일

### 6.2 요청 제한
- AI 문서 생성: 분당 5회
- 실시간 업데이트: 초당 10회
- 댓글 작성: 분당 30회

## 7. 데이터베이스 스키마 (Supabase)

### 7.1 documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  project_id UUID REFERENCES projects(id),
  folder_id UUID REFERENCES folders(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER NOT NULL,
  status TEXT CHECK (status IN ('draft', 'published')),
  tags TEXT[]
);
```

### 7.2 document_versions
```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  version_number TEXT NOT NULL,
  content JSONB NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7.3 document_comments
```sql
CREATE TABLE document_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  content TEXT NOT NULL,
  selection_start INTEGER NOT NULL,
  selection_end INTEGER NOT NULL,
  parent_id UUID REFERENCES document_comments(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7.4 document_cursors
```sql
CREATE TABLE document_cursors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  user_id UUID REFERENCES auth.users(id),
  position INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, user_id)
);
```

### 7.5 document_citations
```sql
CREATE TABLE document_citations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  evidence_id UUID REFERENCES evidence(id),
  law_clause_id UUID REFERENCES law_clauses(id),
  precedent_paragraph_id UUID REFERENCES precedent_paragraphs(id),
  citation_type TEXT CHECK (citation_type IN ('evidence', 'law', 'precedent')),
  position_path JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

### 7.6 ai_agent_interactions
```sql
CREATE TABLE ai_agent_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  mode TEXT CHECK (mode IN ('write', 'ask')),
  query TEXT NOT NULL,
  response TEXT,
  context_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  tokens_used INTEGER,
  source_tab TEXT CHECK (source_tab IN ('document_editor', 'project_analysis', 'evidence_viewer', 'chat'))
);
``` 