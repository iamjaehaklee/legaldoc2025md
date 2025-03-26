특정한 프로젝트를 선택하면 아래와 같은 레이아웃의 페이지가 보입니다. 

## 1. 전체 레이아웃

- **상단 : 프로젝트 네비게이션 바**(`ProjectNavigationBarComponent.tsx`).
- **하단 :**
  - **좌측 Sidebar**(`ProjectLeftSidebarComponent.tsx`).
  - **중앙 메인 영역**(`ProjectMainAreaComponent.tsx`)
  - **우측 Sidebar**(`ProjectRightSidebarComponent.tsx`).


## 2. 컴포넌트별 세부 구조

### 2.1 **프로젝트 네비게이션 바** (`ProjectNavigationBarComponent.tsx`)

- **프로젝트 선택 드롭다운** (`ProjectSelectionDropdownComponent.tsx`):
  - 현재 선택된 프로젝트 이름 표시 (예: "보니타가 상가분양 손해배상 소송").
  - 드롭다운으로 사용자가 접근 가능한 프로젝트 목록 표시 (`ProjectListDropdownMenuComponent.tsx`).
  - 프로젝트 선택 시 해당 프로젝트의 각종 자료 및 정보 로드.

- **메인 내비게이션 탭** (`MainNavigationTabsComponent.tsx`):
  - **워크스페이스탭 => 중앙 메인 영역:워크스페이스스크린**: 문서 편집 에디터(EditingDocument 를 연 경우) 또는 프로젝트참고자료(ProjectReference에 해당하는 파일, 법령/판례들을 연 경우)뷰어를 각각 열려있는 항목마다 작은 탭으로 표시(마치 IDE에서 여러 열린 파일들을 탭으로 보여주는 것처럼). (`WorkspaceScreen.tsx`)
  - **프로젝트분석탭 => 중앙 메인 영역:프로젝트분석스크린**: 프로젝트 목표 설정, 주장 설정, 근거자료 추천, 상대방 입장 분석 및 경고 표시. (`ProjectAnalysisScreen.tsx`)
  - **채팅탭 => 중앙 메인 영역:채팅스크린**: 프로젝트 멤버 간 실시간 채팅 내역 표시, 증거자료 인용 가능. (`ChatScreen.tsx`)

- **참여자 관리** (`MemberManagementPanelComponent.tsx`):
  - "멤버 관리" 버튼 (아이콘: `👥`) (`MemberManagementTriggerButtonComponent.tsx`).
    - 클릭 시 드롭다운으로 참여자 목록 표시 (이름, 역할: 관리자/편집권한/뷰어권한 멤버) (`MemberListDropdownComponent.tsx`).
    - 관리자 멤버만 표시: "멤버 초대" 버튼 (아이콘: `+`) (`InviteMemberActionButtonComponent.tsx`).
    - 관리자 멤버만 표시: "멤버 삭제" 버튼 (아이콘: `🗑️`, 각 멤버 옆에 표시) (`RemoveMemberActionButtonComponent.tsx`).

- **기타**:
  - 사용자 프로필 아이콘 (우측 끝, 드롭다운으로 로그아웃/설정 제공) (`UserProfileMenuComponent.tsx`).
  - 검색 아이콘 (전체 검색 기능, 모든 "메인 내비게이션 탭"에서 사용 가능) (`GlobalSearchFieldComponent.tsx`).

### 2.2 **좌측 Sidebar** (`ProjectLeftSidebarComponent.tsx`)
좌측 Sidebar는 프로젝트 내 자료 탐색 및 관리를 위한 영역으로, 모든 "메인 내비게이션 탭"에서 유지됩니다.
구체적인 내용은 [DataNavigatorUIDesign.md](../features/data_navigator/DataNavigatorUIDesign.md) 을 참조. 

### 2.3 **중앙 메인 영역**(`ProjectMainAreaComponent.tsx`)
중앙 메인 영역은 프로젝트의 주요 업무를 하는 공간으로, **메인 내비게이션 탭**에 따라 **워크스페이스스크린**, **프로젝트분석스크린**, **채팅스크린**을 보입니다. 
- **워크스페이스스크린**의 구체적인 내용은 [WorkspaceScreenUIDesign.md](../features/workspace/WorkspaceScreenUIDesign.md)를 참조
- **프로젝트분석스크린**의 구체적인 내용은 [ProjectAnalysisScreenUIDesign.md](../features/project_analysis/ProjectAnalysisScreenUIDesign.md)를 참조 
- **채팅스크린**의 구체적인 내용은 [ChatScreenUIDesign.md](../features/chat/ChatScreenUIDesign.md)를 참조 

### 2.4 **우측 Sidebar** (`ProjectRightSidebarComponent.tsx`)
- 우측 Sidebar는 AI Agent에 대한 지시를 통해, **중앙 메인 영역**(`ProjectMainAreaComponent.tsx`)의 상태/문맥에 맞는 작업을 수행. 모든 **메인 내비게이션 탭**에서 유지됨. 
- AI Agent의 구체적인 내용은 [AIAgentUIDesign.md](../features/ai_agent/AIAgentUIDesign.md)를 참조.

### 2.5 **각종 모달**
모달은 즉각적이고 빨리 보여져야 합니다. 캐싱 정책을 고려합니다. 아래 모달은 해당 항목에 마우스를 hover 하는 경우에 즉각 보여지는 모달입니다. 
- **파일미리보기모달** (`FilePreviewModalComponent.tsx`)
  - 파일 : 증거자료(Evidence), 주장서류(ClaimingDocument), 참고자료(ConsiderableDocument), 프로젝트최종결정문(ProjectFinalJudgement). 
  - 상세 UI 디자인은 [FilePreviewModalUIDesign.md](../features/preview_modal/FilePreviewModalUIDesign.md) 파일을 참조.
- **법령미리보기모달** (`LawPreviewModalComponent.tsx`)
  - 상세 UI 디자인은 [LawPreviewModalUIDesign.md](../features/preview_modal/LawPreviewModalUIDesign.md) 파일을 참조.
- **판례미리보기모달** (`PrecedentPreviewModalComponent.tsx`)
  - 상세 UI 디자인은 [PrecedentPreviewModalUIDesign.md](../features/preview_modal/PrecedentPreviewModalUIDesign.md) 파일을 참조.
- **목표주장사실미리보기모달** (`GoalClaimFactPreviewModalComponent.tsx`)
  - 상세 UI 디자인은 [GoalClaimFactPreviewModalUIDesign.md](../features/preview_modal/GoalClaimFactPreviewModalUIDesign.md) 파일을 참조.
- **초대 관리 모달** (`InviteManagementModalComponent.tsx`):
  - **초대 보내기 (관리자 멤버 전용)**:
    - 이메일 입력창 (placeholder: "초대할 이메일 입력...") (`InviteEmailInputFieldComponent.tsx`).
    - "초대 링크 생성" 버튼 (링크 복사 기능 제공) (`GenerateInviteLinkActionButtonComponent.tsx`).
    - "초대 보내기" 버튼 (아이콘: `➡️`) (`SendInviteActionButtonComponent.tsx`).
