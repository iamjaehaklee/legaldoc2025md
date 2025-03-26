# 법령 및 판례 검색 모달 UI 구조

## 1. 컴포넌트 구조

```typescript
interface LawPrecedentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedItem: LawOrPrecedentItem) => void;
  initialTab?: 'law' | 'precedent';
  projectId?: string;
}

interface LawOrPrecedentItem {
  id: string;
  type: 'law' | 'precedent';
  title: string;
  content: string;
  date: string;
  source: string;
  bookmarked: boolean;
  category: string;
  // 법령 전용 필드
  lawType?: '헌법' | '법률' | '시행령' | '시행규칙' | '조례' | '규칙';
  effectiveDate?: string;
  // 판례 전용 필드
  court?: string;
  caseNumber?: string;
  judgementDate?: string;
  importance?: '매우 중요' | '중요' | '일반';
}

interface TabPanelProps {
  type: 'law' | 'precedent';
  searchResults: LawOrPrecedentItem[];
  selectedItem?: LawOrPrecedentItem;
  onItemSelect: (item: LawOrPrecedentItem) => void;
}
```

## 2. 레이아웃 구조

```
LawPrecedentModal/
├── Header/
│   ├── Title (법령/판례 검색)
│   ├── Close Button
│   └── Search Bar
│       ├── Search Input
│       ├── Search Type Selector (기본/고급)
│       └── Search Button
├── Tab Navigation/
│   ├── 법령 탭
│   └── 판례 탭
├── Content/
│   ├── TabPanel (법령)/
│   │   ├── Left Panel/
│   │   │   ├── Filter Section
│   │   │   │   ├── 법령 종류 (헌법/법률/시행령/시행규칙/조례/규칙)
│   │   │   │   ├── 시행일자 범위
│   │   │   │   └── 분야 (민사/형사/행정/특허/etc)
│   │   │   └── Result List
│   │   │       ├── Law Item Card
│   │   │       │   ├── Title
│   │   │       │   ├── 법령 종류
│   │   │       │   ├── 시행일자
│   │   │       │   └── Bookmark Button
│   │   │       └── Pagination
│   │   └── Right Panel/
│   │       ├── Law Detail View
│   │       │   ├── Title
│   │       │   ├── Meta Information
│   │       │   │   ├── 법령 종류
│   │       │   │   ├── 공포일자
│   │       │   │   ├── 시행일자
│   │       │   │   └── 법령 연혁
│   │       │   ├── Content Sections
│   │       │   └── Related Items
│   │       └── Action Buttons
│   │           ├── Save to Project
│   │           ├── Copy Citation
│   │           └── Add to Document
│   └── TabPanel (판례)/
│       ├── Left Panel/
│       │   ├── Filter Section
│       │   │   ├── 법원 (대법원/고등법원/etc)
│       │   │   ├── 선고일자 범위
│       │   │   ├── 중요도 (매우 중요/중요/일반)
│       │   │   └── 분야 (민사/형사/행정/특허/etc)
│       │   └── Result List
│       │       ├── Precedent Item Card
│       │       │   ├── Title
│       │       │   ├── 법원명
│       │       │   ├── 사건번호
│       │       │   ├── 선고일자
│       │       │   └── Bookmark Button
│       │       └── Pagination
│       └── Right Panel/
│           ├── Precedent Detail View
│           │   ├── Title
│           │   ├── Meta Information
│           │   │   ├── 법원명
│           │   │   ├── 사건번호
│           │   │   ├── 선고일자
│           │   │   └── 중요도
│           │   ├── Content Sections
│           │   │   ├── 판시사항
│           │   │   ├── 판결요지
│           │   │   └── 판결이유
│           │   └── Related Items
│           └── Action Buttons
│               ├── Save to Project
│               ├── Copy Citation
│               └── Add to Document
└── Footer/
    ├── Selected Items Counter
    └── Action Buttons
        ├── Cancel
        └── Confirm
```

## 3. API 연동 구조

### 3.1 국가법령정보 Open API 연동

```typescript
interface LawAPIConfig {
  serviceKey: string;  // OC=factfinderceo
  baseUrl: 'https://open.law.go.kr/LSO/openApi';
}

// 법령 검색 API 엔드포인트
const LAW_ENDPOINTS = {
  SEARCH_LAW: '/law/search.do',
  GET_LAW_DETAIL: '/law/detail.do',
  SEARCH_PRECEDENT: '/prec/search.do',
  GET_PRECEDENT_DETAIL: '/prec/detail.do'
};

// 통합 검색 함수
async function searchLawAndPrecedent(params: SearchParams): Promise<SearchResults> {
  const [lawResults, precedentResults] = await Promise.all([
    searchLaws(params),
    searchPrecedents(params)
  ]);

  return {
    laws: lawResults,
    precedents: precedentResults,
    activeTab: params.activeTab || 'law'
  };
}

// API 호출 예시
async function searchLaws(params: SearchLawParams): Promise<LawSearchResult> {
  const queryString = new URLSearchParams({
    OC: 'factfinderceo',
    target: 'law',
    type: 'XML',
    search: params.keyword,
    display: '10',
    page: params.page || '1'
  }).toString();

  const response = await fetch(`${baseUrl}${LAW_ENDPOINTS.SEARCH_LAW}?${queryString}`);
  return await response.json();
}

async function searchPrecedents(params: SearchPrecedentParams): Promise<PrecedentSearchResult> {
  const queryString = new URLSearchParams({
    OC: 'factfinderceo',
    target: 'prec',
    type: 'XML',
    search: params.keyword,
    display: '10',
    page: params.page || '1'
  }).toString();

  const response = await fetch(`${baseUrl}${LAW_ENDPOINTS.SEARCH_PRECEDENT}?${queryString}`);
  return await response.json();
}
```

### 3.2 상태 관리

```typescript
interface SearchState {
  keyword: string;
  activeTab: 'law' | 'precedent';
  filters: SearchFilters;
  results: {
    laws: LawOrPrecedentItem[];
    precedents: LawOrPrecedentItem[];
  };
  selectedItems: {
    law?: LawOrPrecedentItem;
    precedent?: LawOrPrecedentItem;
  };
  loading: boolean;
  error?: string;
  pagination: {
    law: { page: number; totalPages: number };
    precedent: { page: number; totalPages: number };
  };
}

interface SearchFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  court?: string[];
  institution?: string[];
  category?: string[];
  sortBy: 'relevance' | 'date' | 'popularity';
}
```

## 4. 주요 기능

### 4.1 검색 기능
- 기본 검색: 키워드 기반 검색
- 고급 검색: 필터 및 상세 조건 적용
- AI 기반 유사 검색
- 실시간 검색어 추천

### 4.2 필터링 기능
- 날짜 범위 선택
- 법원/기관 선택
- 카테고리 필터
- 정렬 옵션

### 4.3 상세 보기 기능
- 법령/판례 전문 보기
- 목차 네비게이션
- 하이라이트 및 북마크
- 인용구 생성

### 4.4 프로젝트 연동 기능
- 프로젝트 저장
- 문서 인용
- 주장 연결
- 변경 사항 추적

## 5. 사용자 경험 개선

### 5.1 검색 최적화
- 검색어 자동 완성
- 최근 검색어 저장
- 검색 결과 하이라이트
- 연관 검색어 추천

### 5.2 성능 최적화
- 검색 결과 캐싱
- 무한 스크롤/페이지네이션
- 지연 로딩
- 데이터 압축

### 5.3 접근성
- 키보드 네비게이션
- 스크린 리더 지원
- 고대비 모드
- 반응형 디자인

## 6. 에러 처리

### 6.1 API 에러
- 네트워크 오류 처리
- 인증 오류 처리
- 데이터 유효성 검증
- 재시도 메커니즘

### 6.2 사용자 피드백
- 로딩 상태 표시
- 에러 메시지 표시
- 성공 알림
- 작업 진행률 표시 