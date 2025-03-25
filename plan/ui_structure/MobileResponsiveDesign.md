# LegalEditor 모바일 반응형 설계

## 1. 개요
LegalEditor의 모바일 반응형 설계는 다양한 디바이스(스마트폰, 태블릿)에서 최적화된 UI/UX를 제공합니다. 데스크톱 환경의 기능을 유지하면서, 모바일 환경에 맞게 레이아웃과 인터랙션을 조정합니다.

## 2. 레이아웃 조정
- **프로젝트 네비게이션 바** (`ProjectNavigationBarComponent.tsx`):
  - 프로젝트 선택 드롭다운: 햄버거 메뉴로 통합 (아이콘: `☰`) (`ProjectSelectionHamburgerMenuComponent.tsx`).
  - 주요 탭: 아이콘만 표시 (예: 워크스페이스탭 → 📝, 프로젝트분석탭 → 📊, 채팅탭 → 💬) (`MainNavigationTabsMobileViewComponent.tsx`).
  - 참여자 관리: 하단 플로팅 버튼으로 표시 (아이콘: `👥`) (`MemberManagementMobileButtonComponent.tsx`).
  - 사용자 프로필: 햄버거 메뉴 내부로 이동 (`UserProfileMobileMenuComponent.tsx`).
  - 검색 필드: 상단 고정, 축소 가능한 형태로 표시 (`GlobalSearchMobileFieldComponent.tsx`).

## 3. 인터랙션 조정
- **터치 지원**:
  - 스와이프 제스처: 탭 간 전환 (예: 좌우 스와이프로 탭 이동) (`SwipeNavigationHandlerComponent.tsx`).
  - 롱 프레스: 컨텍스트 메뉴 표시 (예: 증거자료 롱 프레스 → "인용 추가") (`LongPressContextMenuHandlerComponent.tsx`).
- **입력 최적화**:
  - 모바일 키보드: 입력창 포커스 시 키보드 자동 표시, 화면 스크롤 조정 (`MobileKeyboardHandlerComponent.tsx`).
  - 버튼 크기: 터치 영역 확대 (최소 44x44px) (`TouchFriendlyButtonComponent.tsx`).

## 4. UI 디자인 가이드
- **색상**: 데스크톱과 동일.
- **폰트**:
  - 본문 (문서 작성): 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소: Noto Sans KR, 14px (모바일: 12px).
- **아이콘**:
  - 버튼 아이콘 크기: 20px (모바일: 16px).
- **애니메이션**:
  - 탭 전환 시 0.2초 slide-in 효과.
  - 모달 표시 시 0.3초 fade-in 효과.

## 5. 성능 최적화
- **지연 로딩**: 모바일 환경에서 비필수 데이터 지연 로드 (`MobileLazyLoadComponent.tsx`).
- **이미지 최적화**: 저해상도 이미지 먼저 표시 (`MobileImageOptimizationComponent.tsx`).
- **터치 이벤트 최적화**: 터치 이벤트 핸들링 지연 최소화 (`TouchEventOptimizationComponent.tsx`).