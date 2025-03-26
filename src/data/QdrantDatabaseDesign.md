# Qdrant 데이터베이스 설계

## 공통 벡터 설정
- 차원: 1536 (OpenAI text-embedding-3-small 모델 기준)
- 거리 측정: Cosine similarity

## 컬렉션 구조

### 1. 법령 컬렉션 (laws)
```json
{
    "doc_id": "string",         // 법령 고유 식별자
    "law_name": "string",       // 법령명
    "article_num": "string",    // 조문 번호
    "content": "string",        // 조문 내용
    "metadata": {
        "law_type": "string",   // 법령 종류 (법률, 시행령 등)
        "enacted_date": "date", // 제정일자
        "revised_date": "date", // 개정일자
        "status": "string",     // 현행/구법 여부
        "category": "string"    // 법령 분야
    }
}
```

### 2. 판례 컬렉션 (precedents)
```json
{
    "doc_id": "string",           // 판례 고유 식별자
    "case_number": "string",      // 사건 번호
    "court": "string",            // 법원명
    "content": "string",          // 쟁점/판단 내용
    "section_type": "string",     // 섹션 유형 (사실관계, 쟁점, 판단요지 등)
    "metadata": {
        "decision_date": "date",  // 선고일자
        "case_type": "string",    // 사건 종류
        "keywords": ["string"],   // 판례 키워드
        "precedents": ["string"], // 참조 판례
        "statutes": ["string"]    // 참조 법령
    }
}
```

### 3. 참고자료 컬렉션 (considerable_documents)
```json
{
    "doc_id": "string",          // 문헌 고유 식별자
    "title": "string",           // 문헌명
    "content": "string",         // 문단 내용
    "page_num": "integer",       // 페이지 번호
    "paragraph_num": "integer",  // 문단 번호
    "metadata": {
        "author": "string",      // 저자
        "publisher": "string",   // 출판사/기관
        "published_date": "date",// 출판일자
        "category": "string",    // 분야
        "tags": ["string"],      // 태그
        "confidence": "float"    // OCR 신뢰도
    }
}
```

### 4. 판결문등 컬렉션 (judgement_etc_documents)
```json
{
    "doc_id": "string",          // 문서 고유 식별자
    "title": "string",           // 문서 제목
    "content": "string",         // 문단 내용
    "metadata": {
        "doc_type": "string",    // 문서 종류 (판결문, 결정문, 처분서 등)
        "issuing_authority": "string", // 발행 기관
        "issue_date": "date",    // 발행일
        "case_reference": "string", // 사건 참조 번호
        "tags": ["string"]       // 태그
    }
}
```

### 5. 증거자료 컬렉션 (evidences)
```json
{
    "doc_id": "string",          // 문서 고유 식별자
    "case_id": "string",         // 사건 번호
    "title": "string",           // 문서 제목
    "content": "string",         // 문단 내용
    "page_num": "integer",       // 페이지 번호
    "paragraph_num": "integer",  // 문단 번호
    "metadata": {
        "doc_type": "string",    // 증거자료 종류
        "created_at": "date",    // 생성 일시
        "submitted_at": "date",  // 제출 일시
        "tags": ["string"],      // 문서 태그
        "confidence": "float"    // OCR 신뢰도
    }
}
```

### 6. 주장서류 컬렉션 (claiming_documents)
```json
{
    "doc_id": "string",          // 문서 고유 식별자
    "title": "string",           // 문서 제목
    "content": "string",         // 문단 내용
    "metadata": {
        "doc_type": "string",    // 문서 종류 (소장, 답변서, 준비서면 등)
        "submission_date": "date", // 제출일
        "submitting_party": "string", // 제출 당사자
        "receiving_party": "string",  // 수신 당사자
        "tags": ["string"]       // 태그
    }
}
```

## 컬렉션 생성 예시
```python
# 증거자료 컬렉션 생성
client.create_collection(
    collection_name="evidences",
    vectors_config={
        "size": 1536,
        "distance": "Cosine"
    }
)

# 나머지 컬렉션들도 동일한 방식으로 생성
```

## 청크 생성 가이드라인

### 1. 증거자료
- 기본 단위: 문단
- 문단 크기: 200-500자 권장
- 중첩(overlap): 1-2문장
- 문맥 유지를 위해 너무 짧은 문단은 통합

### 2. 법령
- 기본 단위: 조문
- 항/호가 있는 경우: 조문 전체를 하나의 단위로 유지
- 관련 조문들은 메타데이터로 연결

### 3. 판례
- 기본 단위: 쟁점/논점
- 판시사항, 판결요지, 이유 등 섹션별로 구분
- 사실관계는 별도 청크로 관리

### 4. 문헌자료
- 기본 단위: 문단
- 문단 크기: 300-800자 권장
- 중첩(overlap): 1-2문장
- 표/그림 참조가 있는 경우 함께 포함

## 검색 최적화
- 각 컬렉션별 주요 필드 인덱싱
- 메타데이터 기반 필터링 지원
- 하이브리드 검색 (벡터 + 키워드) 지원
