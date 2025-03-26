# 증거 관리 API 설계

## 1. 증거자료 기본 API

### 1.1 증거자료 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/evidence`
- **요청 파라미터**:
  ```json
  {
    "folder_id": "uuid",
    "type": ["pdf", "docx", "image"],
    "tags": ["중요", "계약서"],
    "search": "검색어",
    "page": 1,
    "limit": 20,
    "sort_by": "uploaded_at",
    "sort_order": "desc"
  }
  ```
- **응답**:
  ```json
  {
    "evidence": [
      {
        "id": "uuid",
        "title": "임대차계약서.pdf",
        "original_filename": "contract.pdf",
        "type": "pdf",
        "mime_type": "application/pdf",
        "file_path": "https://...",
        "file_size": 1024576,
        "page_count": 5,
        "uploaded_at": "2024-03-23T00:00:00Z",
        "uploaded_by": {
          "id": "uuid",
          "title": "홍길동"
        },
        "ocr_status": "completed",
        "tags": ["계약서", "중요"]
      }
    ],
    "total": 50
  }
  ```

### 1.2 증거자료 업로드
- **엔드포인트**: `POST /api/projects/{project_id}/evidence`
- **요청** (multipart/form-data):
  ```json
  {
    "file": "파일 데이터",
    "title": "임대차계약서",
    "folder_id": "uuid",
    "tags": ["계약서", "중요"]
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "임대차계약서.pdf",
    "file_path": "https://...",
    "upload_status": "completed",
    "ocr_status": "processing"
  }
  ```

### 1.3 증거자료 정보 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/evidence/{evidence_id}`
- **요청**:
  ```json
  {
    "title": "수정된 제목",
    "folder_id": "uuid",
    "tags": ["수정된 태그"]
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "title": "수정된 제목",
    "updated_at": "2024-03-23T00:00:00Z"
  }
  ```

### 1.4 증거자료 삭제
- **엔드포인트**: `DELETE /api/projects/{project_id}/evidence/{evidence_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

## 2. OCR 처리 API

### 2.1 OCR 처리 상태 조회
- **엔드포인트**: `GET /api/projects/{project_id}/evidence/{evidence_id}/ocr/status`
- **응답**:
  ```json
  {
    "status": "completed",
    "progress": 1.0,
    "completed_at": "2024-03-23T00:00:00Z",
    "page_count": 5,
    "processing_time_ms": 12500
  }
  ```

### 2.2 OCR 결과 조회
- **엔드포인트**: `GET /api/projects/{project_id}/evidence/{evidence_id}/ocr/result`
- **요청 파라미터**:
  ```json
  {
    "page_number": 1
  }
  ```
- **응답**:
  ```json
  {
    "page_number": 1,
    "raw_text": "페이지 텍스트 내용",
    "confidence_score": 0.95,
    "bounding_boxes": [
      {
        "text": "텍스트 블록",
        "position": {
          "x": 100,
          "y": 200,
          "width": 300,
          "height": 50
        },
        "confidence": 0.98
      }
    ]
  }
  ```

### 2.3 OCR 재처리 요청
- **엔드포인트**: `POST /api/projects/{project_id}/evidence/{evidence_id}/ocr/reprocess`
- **응답**:
  ```json
  {
    "status": "processing",
    "message": "OCR 재처리가 시작되었습니다."
  }
  ```

## 3. 증거자료 분석 API

### 3.1 문단 분석 결과 조회
- **엔드포인트**: `GET /api/projects/{project_id}/evidence/{evidence_id}/paragraphs`
- **응답**:
  ```json
  {
    "paragraphs": [
      {
        "id": "uuid",
        "text": "문단 내용",
        "page_number": 1,
        "start_position": 0,
        "end_position": 500,
        "embedding_vector": [0.1, 0.2, 0.3]
      }
    ]
  }
  ```

### 3.2 목차 분석 결과 조회
- **엔드포인트**: `GET /api/projects/{project_id}/evidence/{evidence_id}/toc`
- **응답**:
  ```json
  {
    "toc": [
      {
        "id": "uuid",
        "title": "제1장 총칙",
        "level": 1,
        "page_number": 1,
        "children": [
          {
            "id": "uuid",
            "title": "제1조 목적",
            "level": 2,
            "page_number": 1
          }
        ]
      }
    ]
  }
  ```

## 4. 증거자료 주석 API

### 4.1 주석 목록 조회
- **엔드포인트**: `GET /api/projects/{project_id}/evidence/{evidence_id}/annotations`
- **요청 파라미터**:
  ```json
  {
    "page_number": 1,
    "type": ["highlight", "text", "drawing"]
  }
  ```
- **응답**:
  ```json
  {
    "annotations": [
      {
        "id": "uuid",
        "type": "highlight",
        "content": "주석 내용",
        "position_data": {
          "page": 1,
          "x": 100,
          "y": 200,
          "width": 300,
          "height": 50
        },
        "color": "#FFEB3B",
        "created_at": "2024-03-23T00:00:00Z",
        "created_by": {
          "id": "uuid",
          "title": "홍길동"
        }
      }
    ]
  }
  ```

### 4.2 주석 생성
- **엔드포인트**: `POST /api/projects/{project_id}/evidence/{evidence_id}/annotations`
- **요청**:
  ```json
  {
    "type": "highlight",
    "content": "주석 내용",
    "position_data": {
      "page": 1,
      "x": 100,
      "y": 200,
      "width": 300,
      "height": 50
    },
    "color": "#FFEB3B"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "created_at": "2024-03-23T00:00:00Z",
    "status": "success"
  }
  ```

### 4.3 주석 수정
- **엔드포인트**: `PUT /api/projects/{project_id}/evidence/{evidence_id}/annotations/{annotation_id}`
- **요청**:
  ```json
  {
    "content": "수정된 주석 내용",
    "color": "#4CAF50"
  }
  ```
- **응답**:
  ```json
  {
    "id": "uuid",
    "updated_at": "2024-03-23T00:00:00Z",
    "status": "success"
  }
  ```

### 4.4 주석 삭제
- **엔드포인트**: `DELETE /api/projects/{project_id}/evidence/{evidence_id}/annotations/{annotation_id}`
- **응답**:
  ```json
  {
    "status": "success"
  }
  ```

## 5. 증거자료 검색 API

### 5.1 전문 검색
- **엔드포인트**: `GET /api/projects/{project_id}/evidence/search`
- **요청 파라미터**:
  ```json
  {
    "query": "임대차계약",
    "filters": {
      "type": ["pdf", "docx"],
      "tags": ["계약서"],
      "date_range": {
        "start": "2024-01-01",
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
    "results": [
      {
        "evidence": {
          "id": "uuid",
          "title": "임대차계약서.pdf",
          "type": "pdf"
        },
        "highlights": [
          {
            "text": "...본 <em>임대차계약</em>은...",
            "page_number": 1,
            "position": {
              "x": 100,
              "y": 200
            }
          }
        ],
        "relevance_score": 0.95
      }
    ],
    "total": 50
  }
  ```

### 5.2 의미 검색
- **엔드포인트**: `POST /api/projects/{project_id}/evidence/semantic-search`
- **요청**:
  ```json
  {
    "query": "임대인의 의무 위반",
    "filters": {
      "type": ["pdf", "docx"],
      "min_relevance": 0.7
    },
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "results": [
      {
        "evidence": {
          "id": "uuid",
          "title": "임대차계약서.pdf"
        },
        "paragraphs": [
          {
            "text": "임대인이 수선 의무를 이행하지 않은 경우...",
            "page_number": 2,
            "relevance_score": 0.85
          }
        ]
      }
    ],
    "total": 30
  }
  ``` 