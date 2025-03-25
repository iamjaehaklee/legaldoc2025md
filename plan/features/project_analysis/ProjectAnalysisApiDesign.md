# 프로젝트 분석 API 설계

## 1. 목표 관리 API

### 1.1 목표 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/goals`
- **응답**:
  ```json
  {
    "goals": [
      {
        "id": "uuid",
        "title": "임대차보증금 전액 반환",
        "description": "계약 해지에 따른 임대차보증금 전액 반환 청구",
        "status": "in_progress",
        "created_at": "2024-03-23T00:00:00Z",
        "created_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "priority": 1,
        "is_ai_recommended": false,
        "claims_count": 5
      }
    ],
    "total": 10
  }
  ```

### 1.2 목표 생성
- **엔드포인트**: `POST /api/projects/{project_id}/goals`
- **요청**:
  ```json
  {
    "title": "임대차보증금 전액 반환",
    "description": "계약 해지에 따른 임대차보증금 전액 반환 청구",
    "priority": 1
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "임대차보증금 전액 반환",
    "description": "계약 해지에 따른 임대차보증금 전액 반환 청구",
    "status": "in_progress",
    "created_at": "2024-03-23T00:00:00Z",
    "priority": 1
  }
  ```

### 1.3 목표 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/goals/{goal_id}`
- **요청**:
  ```json
  {
    "title": "수정된 목표 제목",
    "description": "수정된 설명",
    "status": "completed",
    "priority": 2
  }
  ```
- **응답**: 목표 생성 API와 동일

## 2. 주장 관리 API

### 2.1 주장 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/goals/{goal_id}/claims`
- **응답**:
  ```json
  {
    "claims": [
      {
        "id": "uuid",
        "title": "계약 해지 정당성",
        "description": "임대인의 계약 위반으로 인한 계약 해지는 정당하다",
        "created_at": "2024-03-23T00:00:00Z",
        "created_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "priority": 1,
        "status": "draft",
        "is_ai_recommended": true,
        "confidence_score": 0.85,
        "evidence_count": 3
      }
    ],
    "total": 5
  }
  ```

### 2.2 주장 생성
- **엔드포인트**: `POST /api/projects/{project_id}/goals/{goal_id}/claims`
- **요청**:
  ```json
  {
    "title": "계약 해지 정당성",
    "description": "임대인의 계약 위반으로 인한 계약 해지는 정당하다",
    "priority": 1
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "계약 해지 정당성",
    "description": "임대인의 계약 위반으로 인한 계약 해지는 정당하다",
    "created_at": "2024-03-23T00:00:00Z",
    "priority": 1,
    "status": "draft"
  }
  ```

### 2.3 주장 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/goals/{goal_id}/claims/{claim_id}`
- **요청**:
  ```json
  {
    "title": "수정된 주장 제목",
    "description": "수정된 설명",
    "status": "finalized",
    "priority": 2
  }
  ```
- **응답**: 주장 생성 API와 동일

## 3. 증거 연결 API

### 3.1 주장 증거 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/claims/{claim_id}/evidence`
- **응답**:
  ```json
  {
    "evidence": [
      {
        "id": "uuid",
        "evidence": {
          "id": "uuid",
          "title": "임대차계약서",
          "file_path": "https://..."
        },
        "description": "계약서 제5조에 따르면...",
        "added_at": "2024-03-23T00:00:00Z",
        "added_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "is_ai_recommended": true,
        "relevance_score": 0.95
      }
    ],
    "total": 3
  }
  ```

### 3.2 증거 연결
- **엔드포인트**: `POST /api/projects/{project_id}/claims/{claim_id}/evidence`
- **요청**:
  ```json
  {
    "evidence_id": "uuid",
    "description": "계약서 제5조에 따르면..."
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "evidence_id": "uuid",
    "description": "계약서 제5조에 따르면...",
    "added_at": "2024-03-23T00:00:00Z",
    "relevance_score": 0.95
  }
  ```

## 4. AI 추천 API

### 4.1 증거 추천 요청
- **엔드포인트**: `POST /api/projects/{project_id}/claims/{claim_id}/recommend-evidence`
- **응답**:
  ```json
  {
    "recommendations": [
      {
        "id": "uuid",
        "evidence_id": "uuid",
        "evidence_title": "임대차계약서",
        "relevance_score": 0.95,
        "relevance_reason": "계약서 제5조는 계약 해지 조건을 명시하고 있어 주장을 뒷받침합니다.",
        "relevant_parts": {
          "page": 2,
          "paragraphs": [
            {
              "text": "제5조(계약의 해지) ...",
              "position": {
                "x": 100,
                "y": 200,
                "width": 400,
                "height": 50
              }
            }
          ]
        }
      }
    ]
  }
  ```

### 4.2 법령/판례 추천 요청
- **엔드포인트**: `POST /api/projects/{project_id}/claims/{claim_id}/recommend-references`
- **응답**:
  ```json
  {
    "recommendations": [
      {
        "id": "uuid",
        "type": "law",
        "reference_id": "uuid",
        "title": "민법 제635조",
        "relevance_score": 0.9,
        "relevance_reason": "임대차계약 해지에 관한 일반 규정",
        "application_strategy": "임대인의 의무 위반을 들어 계약 해지의 정당성 주장",
        "relevant_parts": {
          "content": "임대인이 임대물의 사용, 수익에 필요한 수선을 하지 아니한 때에는..."
        }
      }
    ]
  }
  ```

### 4.3 추천 피드백 제공
- **엔드포인트**: `POST /api/recommendations/{recommendation_id}/feedback`
- **요청**:
  ```json
  {
    "feedback_type": "helpful",
    "feedback_comment": "매우 적절한 판례 추천입니다."
  }
  ```
- **응답**:
  ```json
  {
    "status": "success",
    "message": "피드백이 성공적으로 저장되었습니다."
  }
  ``` 

  [TODO]
  파이썬서버와 supabase edgefunction 의 분담. 