# 법령 미리보기 모달 UI 디자인

본 컴포넌트의 UI/UX는 [GlobalUIDesign.md](../../ui_structure/GlobalUIDesign.md)에서 정의된 공통 디자인 시스템을 따릅니다.

## 1. 개요
법령 미리보기 모달은 법령(Law) 정보를 빠르게 확인할 수 있는 모달 컴포넌트입니다.

## 2. UI 컴포넌트 구조
```
app/
├── components/
│   └── law_preview/
│       ├── LawPreviewModalContainer.tsx  // 모달의 최상위 컨테이너, 크기: 화면의 70% (최소 너비 800px)
│       ├── header/
│       │   ├── PreviewHeader.tsx  // 재사용: FilePreviewModalUIDesign.md의 PreviewHeader.tsx, 높이: 60px
│       │   ├── LawTitle.tsx       // 법령 제목 표시 (왼쪽 정렬)
│       │   ├── LawStatus.tsx      // 법령 현행 여부 표시 (중앙)
│       │   └── CloseButton.tsx    // 재사용: GlobalUIDesign.md의 CloseButton.tsx, 모달 닫기
│       ├── content/               // 높이: calc(100% - 120px)
│       │   ├── PreviewContent.tsx  // 재사용: FilePreviewModalUIDesign.md의 PreviewContent.tsx
│       │   ├── law_content/       // 법령 내용 표시 영역
│       │   │   ├── ArticleList.tsx         // 조문 목록 표시
│       │   │   ├── ArticleContent.tsx      // 조문 내용 표시
│       │   │   └── ArticleAnnotation.tsx   // 조문 주석 표시
│       │   ├── search/           // 법령 내 검색 기능
│       │   │   └── SearchBar.tsx  // 재사용: GlobalUIDesign.md의 SearchBar.tsx
│       │   └── TableOfContents.tsx  // 법령 목차 (왼쪽 30% 영역)
│       └── footer/
│           ├── PreviewFooter.tsx  // 재사용: FilePreviewModalUIDesign.md의 PreviewFooter.tsx, 높이: 60px
│           ├── CitationButton.tsx  // 재사용: GlobalUIDesign.md의 CitationButton.tsx, 인용 추가
│           └── LawMetadata.tsx    // 법령 메타데이터 (제정일, 시행일 등)
```

## 3. 상세 컴포넌트 설명

### 3.1 LawPreviewModalContainer
- 모달의 최상위 컨테이너
- 크기: 화면의 70% (최소 너비 800px)

### 3.2 PreviewHeader
- 높이: 60px
- 구성요소:
  - LawTitle: 법령 제목 (왼쪽 정렬)
  - LawStatus: 법령 현행 여부 표시 (중앙)
  - CloseButton: 모달 닫기 버튼 (오른쪽 정렬)

### 3.3 PreviewContent
- 높이: calc(100% - 120px)
- 좌우 분할 레이아웃:
  - 왼쪽: TableOfContents (너비 30%)
  - 오른쪽: LawContent (너비 70%)
- 구성요소:
  - SearchBar: 법령 내 검색
  - TableOfContents: 법령 목차
  - LawContent: 법령 본문
    - ArticleList: 조문 목록
    - ArticleContent: 조문 내용
    - ArticleAnnotation: 조문 주석

### 3.4 PreviewFooter
- 높이: 60px
- 구성요소:
  - CitationButton: 인용 추가 버튼
  - LawMetadata: 법령 메타데이터 (제정일, 시행일 등)

## 4. 인터랙션

### 4.1 모달 표시/숨김
- 표시 트리거: 법령 항목 hover 시 (지연시간 200ms)

### 4.2 법령 탐색
- 목차 네비게이션:
  - 클릭 시 해당 조문으로 스크롤
  - 현재 보고 있는 조문 하이라이트
- 검색:
  - 실시간 검색 결과 하이라이트
  - 검색 결과 간 이동 버튼

### 4.3 조문 조작
- 조문 선택:
  - 체크박스로 다중 선택 가능
  - 드래그로 텍스트 부분 선택 가능
- 주석:
  - 조문별 주석 표시
  - 주석 토글 버튼

### 4.4 인용
- CitationButton 클릭 시:
  - 선택된 조문 전체 인용
  - 선택된 텍스트만 인용
  - 인용 형식 선택 가능

## 5. 반응형 디자인
- 모바일 화면 (<768px):
  - 전체 화면 모달로 전환
  - 목차를 드로어 메뉴로 변경
  - 터치 제스처 지원 (스와이프로 목차 열기/닫기)

## 6. 접근성
- ARIA 레이블 및 역할 적용
- 키보드 네비게이션 지원
- 고대비 모드 지원
- 스크린 리더 호환성 보장

## 7. 성능 최적화
- 법령 데이터 지연 로딩
- 조문 가상 스크롤
- 검색 결과 캐싱
- 주석 데이터 지연 로딩 