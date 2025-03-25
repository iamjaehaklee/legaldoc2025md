# LegalEditor 컴포넌트 UI 설계

## 1. 프로젝트 네비게이션 바 (`ProjectNavigationBarComponent.tsx`)
프로젝트 네비게이션 바는 프로젝트 선택, 주요 기능 탭, 참여자 관리 기능을 제공하여 사용자가 원하는 작업 모드로 전환하고 협업을 관리할 수 있도록 설계됩니다.

### 1.1 프로젝트 선택 드롭다운 (`ProjectSelectionDropdownComponent.tsx`)
- 현재 선택된 프로젝트 이름 표시 (예: "보니타가 상가분양 손해배상 소송").
- 드롭다운으로 사용자가 접근 가능한 프로젝트 목록 표시 (`ProjectListDropdownMenuComponent.tsx`).
- 프로젝트 선택 시 해당 프로젝트의 폴더 구조, 문서, 증거자료, 프로젝트분석 내역, 채팅 내역, 멤버 정보 로드.

### 1.2 주요 탭 (`MainNavigationTabsComponent.tsx`)
- **워크스페이스탭**: 
  - 문서 편집 에디터 또는 프로젝트참고자료(ProjectReference)뷰어를 각각 열려있는 항목마다 작은 탭으로 표시.
  - IDE와 유사한 탭 인터페이스 제공.
- **프로젝트분석탭**: 
  - 프로젝트 목표 설정.
  - 주장 설정.
  - 근거자료 추천.
  - 상대방 입장 분석 및 경고 표시.
- **채팅탭**: 
  - 프로젝트 멤버 간 실시간 채팅방 표시.
  - 증거자료 인용 기능 제공.

### 1.3 참여자 관리 (`MemberManagementPanelComponent.tsx`)
- "멤버 관리" 버튼 (아이콘: `👥`) (`MemberManagementTriggerButtonComponent.tsx`).
- 드롭다운으로 참여자 목록 표시:
  - 이름.
  - 역할 표시 (관리자/편집권한/뷰어권한 멤버).
- 관리자 멤버 전용 기능:
  - "멤버 초대" 버튼 (아이콘: `+`) (`InviteMemberActionButtonComponent.tsx`).
  - "멤버 삭제" 버튼 (아이콘: `🗑️`, 각 멤버 옆에 표시) (`RemoveMemberActionButtonComponent.tsx`).

### 1.4 기타 기능
- **사용자 프로필** (`UserProfileMenuComponent.tsx`):
  - 우측 끝에 위치.
  - 드롭다운으로 로그아웃/설정 제공.
- **검색 필드** (`GlobalSearchFieldComponent.tsx`):
  - 전체 검색 기능.
  - 모든 탭에서 사용 가능.

## 2. 모바일 반응형 설계
모바일 환경에서는 다음과 같이 UI가 조정됩니다:

### 2.1 프로젝트 네비게이션 바 모바일 뷰
- 프로젝트 선택 드롭다운: 햄버거 메뉴로 통합 (`ProjectSelectionHamburgerMenuComponent.tsx`).
- 주요 탭: 아이콘만 표시:
  - 워크스페이스탭 → 📝
  - 프로젝트분석탭 → 📊
  - 채팅탭 → 💬
- 참여자 관리: 하단 플로팅 버튼 (아이콘: `👥`).
- 사용자 프로필: 햄버거 메뉴 내부로 이동.
- 검색 필드: 상단 고정, 축소 가능한 형태.

### 2.2 터치 인터랙션
- 스와이프로 탭 간 전환.
- 롱 프레스로 컨텍스트 메뉴 표시.
- 터치 영역 최적화 (최소 44x44px).

## 3. 디자인 시스템
- **폰트**:
  - 본문: 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소: Noto Sans KR.
    - 데스크톱: 14px.
    - 모바일: 12px.
- **아이콘**:
  - 데스크톱: 20px.
  - 모바일: 16px.
- **애니메이션**:
  - 탭 전환: 0.2초 slide-in.
  - 모달: 0.3초 fade-in. 