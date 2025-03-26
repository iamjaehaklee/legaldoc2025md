# 대시보드 API 설계

## 1. 프로젝트 대시보드 API

### 1.1 프로젝트 요약 정보
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/summary`
- **응답**:
  ```json
  {
    "project": {
      "id": "uuid",
      "title": "프로젝트 제목",
      "description": "프로젝트 설명",
      "created_at": "2024-03-23T00:00:00Z",
      "status": "active"
    },
    "statistics": {
      "members_count": 5,
      "documents_count": 10,
      "evidence_count": 20,
      "goals_count": 3,
      "claims_count": 8,
      "law_references_count": 15,
      "precedent_references_count": 7
    },
    "recent_activities": [
      {
        "id": "uuid",
        "type": "document_edit",
        "user": {
          "id": "uuid",
          "title": "홍길동"
        },
        "target": {
          "id": "uuid",
          "title": "소장.docx"
        },
        "timestamp": "2024-03-23T00:00:00Z"
      }
    ]
  }
  ```

### 1.2 프로젝트 활동 로그
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/activities`
- **요청 파라미터**:
  ```json
  {
    "type": ["document_edit", "evidence_upload", "member_invite"],
    "start_date": "2024-03-01",
    "end_date": "2024-03-23",
    "page": 1,
    "limit": 20
  }
  ```
- **응답**:
  ```json
  {
    "activities": [
      {
        "id": "uuid",
        "type": "document_edit",
        "user": {
          "id": "uuid",
          "title": "홍길동"
        },
        "target": {
          "id": "uuid",
          "title": "소장.docx",
          "type": "document"
        },
        "action": "수정",
        "details": {
          "version": 2,
          "change_description": "청구취지 수정"
        },
        "timestamp": "2024-03-23T00:00:00Z"
      }
    ],
    "total": 100
  }
  ```

## 2. 문서 현황 API

### 2.1 문서 작업 현황
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/documents/status`
- **응답**:
  ```json
  {
    "documents": {
      "total": 10,
      "by_status": {
        "draft": 5,
        "review": 3,
        "completed": 2
      },
      "recent_updates": [
        {
          "id": "uuid",
          "title": "소장.docx",
          "updated_at": "2024-03-23T00:00:00Z",
          "updated_by": {
            "id": "uuid",
            "title": "홍길동"
          },
          "version": 2
        }
      ]
    },
    "folders": {
      "total": 5,
      "structure": [
        {
          "id": "uuid",
          "title": "소장",
          "documents_count": 3,
          "children": []
        }
      ]
    }
  }
  ```

### 2.2 문서 통계
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/documents/stats`
- **응답**:
  ```json
  {
    "total_documents": 10,
    "total_versions": 25,
    "by_type": {
      "소장": 2,
      "준비서면": 5,
      "답변서": 3
    },
    "activity_timeline": [
      {
        "date": "2024-03-23",
        "created": 2,
        "updated": 5
      }
    ],
    "contributors": [
      {
        "user": {
          "id": "uuid",
          "title": "홍길동"
        },
        "documents_count": 5,
        "edits_count": 20
      }
    ]
  }
  ```

## 3. 증거 현황 API

### 3.1 증거자료 현황
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/evidence/status`
- **응답**:
  ```json
  {
    "evidence": {
      "total": 20,
      "by_type": {
        "pdf": 10,
        "image": 5,
        "docx": 3,
        "others": 2
      },
      "recent_uploads": [
        {
          "id": "uuid",
          "title": "계약서.pdf",
          "uploaded_at": "2024-03-23T00:00:00Z",
          "uploaded_by": {
            "id": "uuid",
            "title": "홍길동"
          },
          "type": "pdf",
          "size": 1024576
        }
      ]
    },
    "folders": {
      "total": 3,
      "structure": [
        {
          "id": "uuid",
          "title": "계약서",
          "evidence_count": 5,
          "children": []
        }
      ]
    }
  }
  ```

### 3.2 증거 통계
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/evidence/stats`
- **응답**:
  ```json
  {
    "total_evidence": 20,
    "total_size": 52428800,
    "by_status": {
      "ocr_completed": 15,
      "ocr_processing": 3,
      "ocr_failed": 2
    },
    "upload_timeline": [
      {
        "date": "2024-03-23",
        "count": 5,
        "size": 5242880
      }
    ],
    "contributors": [
      {
        "user": {
          "id": "uuid",
          "title": "홍길동"
        },
        "uploads_count": 10,
        "total_size": 26214400
      }
    ]
  }
  ```

## 4. 분석 현황 API

### 4.1 목표 및 주장 현황
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/analysis/status`
- **응답**:
  ```json
  {
    "goals": {
      "total": 3,
      "by_status": {
        "in_progress": 2,
        "completed": 1
      },
      "recent_updates": [
        {
          "id": "uuid",
          "title": "임대차보증금 반환",
          "updated_at": "2024-03-23T00:00:00Z",
          "status": "in_progress"
        }
      ]
    },
    "claims": {
      "total": 8,
      "by_status": {
        "draft": 4,
        "finalized": 4
      },
      "by_confidence": {
        "high": 3,
        "medium": 4,
        "low": 1
      }
    }
  }
  ```

### 4.2 법률 참조 현황
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/references/status`
- **응답**:
  ```json
  {
    "law_references": {
      "total": 15,
      "by_type": {
        "법률": 10,
        "시행령": 5
      },
      "recent_additions": [
        {
          "id": "uuid",
          "title": "주택임대차보호법",
          "added_at": "2024-03-23T00:00:00Z",
          "clauses_count": 3
        }
      ]
    },
    "precedent_references": {
      "total": 7,
      "by_court": {
        "대법원": 4,
        "고등법원": 3
      },
      "recent_additions": [
        {
          "id": "uuid",
          "case_number": "2024다12345",
          "added_at": "2024-03-23T00:00:00Z"
        }
      ]
    }
  }
  ```

## 5. AI 활용 통계 API

### 5.1 AI 기능 사용 현황
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/ai/usage`
- **응답**:
  ```json
  {
    "total_interactions": 100,
    "by_mode": {
      "write": 60,
      "ask": 40
    },
    "by_source": {
      "document_editor": 40,
      "evidence_viewer": 30,
      "project_analysis": 20,
      "chat": 10
    },
    "timeline": [
      {
        "date": "2024-03-23",
        "interactions": 10,
        "tokens_used": 5000
      }
    ],
    "recommendations": {
      "evidence": {
        "total": 50,
        "accepted": 35
      },
      "laws": {
        "total": 30,
        "accepted": 20
      },
      "precedents": {
        "total": 20,
        "accepted": 15
      }
    }
  }
  ```

### 5.2 AI 추천 피드백 통계
- **엔드포인트**: `GET /api/projects/{project_id}/dashboard/ai/feedback`
- **응답**:
  ```json
  {
    "total_feedback": 100,
    "by_type": {
      "helpful": 70,
      "partially_helpful": 20,
      "not_helpful": 10
    },
    "by_feature": {
      "evidence_recommendations": {
        "total": 50,
        "helpful_rate": 0.8
      },
      "law_recommendations": {
        "total": 30,
        "helpful_rate": 0.7
      },
      "precedent_recommendations": {
        "total": 20,
        "helpful_rate": 0.6
      }
    },
    "recent_feedback": [
      {
        "id": "uuid",
        "type": "evidence_recommendation",
        "feedback_type": "helpful",
        "timestamp": "2024-03-23T00:00:00Z",
        "user": {
          "id": "uuid",
          "title": "홍길동"
        }
      }
    ]
  }
  ``` 