# 법률 참조 API 설계

## 1. 법령 검색 API

### 1.1 법령 검색
- **엔드포인트**: `GET /api/laws/search`
- **요청 파라미터**:
  ```json
  {
    "query": "임대차",
    "filters": {
      "law_type": ["법률", "시행령"],
      "ministry": "법무부",
      "effective_date": "2024-03-23"
    },
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "laws": [
      {
        "id": "uuid",
        "law_code": "법령코드",
        "title": "주택임대차보호법",
        "content": "법령 내용",
        "last_updated": "2024-03-23T00:00:00Z",
        "effective_date": "2024-03-23",
        "promulgation_date": "2024-02-23",
        "law_type": "법률",
        "ministry": "법무부",
        "highlight": {
          "content": ["<em>임대차</em>계약에 관하여..."]
        }
      }
    ],
    "total": 100
  }
  ```

### 1.2 법령 조항 검색
- **엔드포인트**: `GET /api/laws/{law_id}/clauses/search`
- **요청 파라미터**:
  ```json
  {
    "query": "계약해지",
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "clauses": [
      {
        "id": "uuid",
        "article_number": "제635조",
        "article_title": "임대차의 해지",
        "content": "임대인이 임대물의 사용, 수익에 필요한 수선을 하지 아니한 때에는...",
        "hierarchy_level": 3,
        "parent_id": "uuid",
        "highlight": {
          "content": ["임대차의 <em>해지</em>"]
        }
      }
    ],
    "total": 10
  }
  ```

## 2. 판례 검색 API

### 2.1 판례 검색
- **엔드포인트**: `GET /api/precedents/search`
- **요청 파라미터**:
  ```json
  {
    "query": "임대차보증금",
    "filters": {
      "court": ["대법원", "고등법원"],
      "case_type": "민사",
      "decision_type": "판결",
      "date_range": {
        "start": "2020-01-01",
        "end": "2024-03-23"
      }
    },
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "precedents": [
      {
        "id": "uuid",
        "case_number": "2024다12345",
        "court": "대법원",
        "title": "임대차보증금 반환 청구",
        "summary": "판례 요지",
        "decision_date": "2024-03-23",
        "case_type": "민사",
        "decision_type": "판결",
        "parties": {
          "plaintiff": "홍길동",
          "defendant": "임대인"
        },
        "highlight": {
          "summary": ["<em>임대차보증금</em> 반환 청구에 관하여..."]
        }
      }
    ],
    "total": 50
  }
  ```

### 2.2 판례 문단 검색
- **엔드포인트**: `GET /api/precedents/{precedent_id}/paragraphs/search`
- **요청 파라미터**:
  ```json
  {
    "query": "계약해지 정당성",
    "section_type": ["사실관계", "판단요지"],
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "paragraphs": [
      {
        "id": "uuid",
        "content": "임차인의 계약해지는 정당하다고 판단된다...",
        "section_type": "판단요지",
        "highlight": {
          "content": ["임차인의 <em>계약해지</em>는 <em>정당</em>하다고..."]
        }
      }
    ],
    "total": 5
  }
  ```

## 3. 프로젝트 법률 참조 API

### 3.1 프로젝트 법령 참조 목록
- **엔드포인트**: `GET /api/projects/{project_id}/law-references`
- **응답**:
  ```json
  {
    "references": [
      {
        "id": "uuid",
        "law": {
          "id": "uuid",
          "title": "주택임대차보호법",
          "law_type": "법률"
        },
        "added_at": "2024-03-23T00:00:00Z",
        "added_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "is_ai_recommended": true,
        "notes": "보증금 반환 청구 관련 법령",
        "clauses": [
          {
            "id": "uuid",
            "article_number": "제3조의2",
            "article_title": "보증금의 회수",
            "relevance_score": 0.95
          }
        ]
      }
    ]
  }
  ```

### 3.2 프로젝트 판례 참조 목록
- **엔드포인트**: `GET /api/projects/{project_id}/precedent-references`
- **응답**:
  ```json
  {
    "references": [
      {
        "id": "uuid",
        "precedent": {
          "id": "uuid",
          "case_number": "2024다12345",
          "title": "임대차보증금 반환 청구"
        },
        "added_at": "2024-03-23T00:00:00Z",
        "added_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "is_ai_recommended": true,
        "notes": "유사 사례 판례",
        "paragraphs": [
          {
            "id": "uuid",
            "content": "판례 내용",
            "section_type": "판단요지",
            "relevance_score": 0.9
          }
        ]
      }
    ]
  }
  ```

### 3.3 법령 참조 추가
- **엔드포인트**: `POST /api/projects/{project_id}/law-references`
- **요청**:
  ```json
  {
    "law_id": "uuid",
    "notes": "보증금 반환 청구 관련 법령",
    "clauses": [
      {
        "clause_id": "uuid",
        "relevance_score": 0.95
      }
    ]
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "status": "success",
    "added_at": "2024-03-23T00:00:00Z"
  }
  ```

### 3.4 판례 참조 추가
- **엔드포인트**: `POST /api/projects/{project_id}/precedent-references`
- **요청**:
  ```json
  {
    "precedent_id": "uuid",
    "notes": "유사 사례 판례",
    "paragraphs": [
      {
        "paragraph_id": "uuid",
        "relevance_score": 0.9
      }
    ]
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "status": "success",
    "added_at": "2024-03-23T00:00:00Z"
  }
  ```

## 4. AI 추천 API

### 4.1 관련 법령 추천
- **엔드포인트**: `POST /api/projects/{project_id}/recommend-laws`
- **요청**:
  ```json
  {
    "context": {
      "document_id": "uuid",
      "selection": "임대차보증금 반환을 청구하는 부분..."
    }
  }
  ```
- **응답**:
  ```json
  {
    "recommendations": [
      {
        "law": {
          "id": "uuid",
          "title": "주택임대차보호법"
        },
        "clauses": [
          {
            "id": "uuid",
            "article_number": "제3조의2",
            "content": "조문 내용",
            "relevance_score": 0.95,
            "relevance_reason": "보증금 반환 청구권의 근거 조항"
          }
        ]
      }
    ]
  }
  ```

### 4.2 관련 판례 추천
- **엔드포인트**: `POST /api/projects/{project_id}/recommend-precedents`
- **요청**:
  ```json
  {
    "context": {
      "document_id": "uuid",
      "selection": "임대차계약 해지의 정당성..."
    }
  }
  ```
- **응답**:
  ```json
  {
    "recommendations": [
      {
        "precedent": {
          "id": "uuid",
          "case_number": "2024다12345",
          "title": "임대차계약 해지 관련 판례"
        },
        "paragraphs": [
          {
            "id": "uuid",
            "content": "판례 내용",
            "relevance_score": 0.9,
            "relevance_reason": "유사한 계약 해지 사유에 대한 판단"
          }
        ]
      }
    ]
  }
  ``` 