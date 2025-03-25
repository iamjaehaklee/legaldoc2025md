# 판례 미리보기 모달 UI 디자인

[GlobalUIDesign.md](../../ui_structure/GlobalUIDesign.md) 파일이 이 파일을 인용함

## 1. 개요
판례 미리보기 모달은 판례(Precedent) 정보를 빠르게 확인할 수 있는 모달 컴포넌트입니다.

## 2. UI 컴포넌트 구조
```
PrecedentPreviewModal/
├── PrecedentPreviewModalContainer.tsx
├── components/
│   ├── PreviewHeader/
│   │   ├── PrecedentTitle.tsx
│   │   ├── CourtInfo.tsx
│   │   └── CloseButton.tsx
│   ├── PreviewContent/
│   │   ├── PrecedentContent/
│   │   │   ├── MainHolding.tsx
│   │   │   ├── ReasoningSection.tsx
│   │   │   └── RelatedLaws.tsx
│   │   ├── SearchBar.tsx
│   │   └── ContentOutline.tsx
│   └── PreviewFooter/
│       ├── CitationButton.tsx
│       └── PrecedentMetadata.tsx
```

## 3. 상세 컴포넌트 설명

### 3.1 PrecedentPreviewModalContainer
- 모달의 최상위 컨테이너
- 크기: 화면의 70% (최소 너비 800px)
- 배경색: #FFFFFF
- 그림자: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- z-index: 1000

### 3.2 PreviewHeader
- 높이: 60px
- 배경색: #F5F7FA
- 구성요소:
  - PrecedentTitle: 판례 제목 (왼쪽 정렬)
  - CourtInfo: 법원 정보 및 사건번호 (중앙)
  - CloseButton: 모달 닫기 버튼 (오른쪽 정렬)

### 3.3 PreviewContent
- 높이: calc(100% - 120px)
- 좌우 분할 레이아웃:
  - 왼쪽: ContentOutline (너비 30%)
  - 오른쪽: PrecedentContent (너비 70%)
- 구성요소:
  - SearchBar: 판례 내 검색
  - ContentOutline: 판시사항, 판결요지, 이유 등 목차
  - PrecedentContent:
    - MainHolding: 주요 판시사항
    - ReasoningSection: 판결 이유
    - RelatedLaws: 관련 법령

### 3.4 PreviewFooter
- 높이: 60px
- 배경색: #F5F7FA
- 구성요소:
  - CitationButton: 인용 추가 버튼
  - PrecedentMetadata: 판례 메타데이터 (선고일, 확정여부 등)

## 4. 인터랙션

### 4.1 모달 표시/숨김
- 표시 트리거: 판례 항목 hover 시 (지연시간 200ms)
- 숨김 트리거:
  - CloseButton 클릭
  - 모달 외부 영역 클릭
  - ESC 키 입력

### 4.2 판례 탐색
- 목차 네비게이션:
  - 클릭 시 해당 섹션으로 스크롤
  - 현재 보고 있는 섹션 하이라이트
- 검색:
  - 실시간 검색 결과 하이라이트
  - 검색 결과 간 이동 버튼

### 4.3 판례 내용 조작
- 텍스트 선택:
  - 드래그로 텍스트 부분 선택 가능
  - 섹션 단위 선택 가능
- 관련 법령:
  - 법령 참조 링크 제공
  - hover 시 법령 내용 툴팁 표시

### 4.4 인용
- CitationButton 클릭 시:
  - 선택된 섹션 전체 인용
  - 선택된 텍스트만 인용
  - 인용 형식 선택 가능 (판례 표준 인용 형식 지원)

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
- 판례 데이터 지연 로딩
- 섹션 가상 스크롤
- 검색 결과 캐싱
- 관련 법령 데이터 지연 로딩 