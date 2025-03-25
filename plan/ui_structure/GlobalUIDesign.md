# LegalEditor 글로벌 UI 화면 구조


## 1. 전체 레이아웃
LegalEditor는 Notion과 유사한 직관적인 UI를 제공하며, 법률문서 작성, 증거자료 관리, 참여자 협업, 프로젝트 분석에 최적화된 레이아웃을 구성합니다. 전체 레이아웃은 다음과 같이 설계됩니다:
- **사용자 온보딩**:
  - 최초 접속 시 온보딩 모달 표시 (예: "LegalEditor에 오신 것을 환영합니다!") (`OnboardingModalComponent.tsx`).
  - 온보딩 단계: 1) 첫 프로젝트 생성 가이드, 2) 문서 작성 시작 방법, 3) 증거자료 업로드 방법 (`OnboardingStepsComponent.tsx`).
  - "건너뛰기" 버튼 (아이콘: `➡️`) (`SkipOnboardingButtonComponent.tsx`).
  - "다음" 버튼 (아이콘: `➡️`) (`NextOnboardingStepButtonComponent.tsx`).
  - "완료" 버튼 (아이콘: `✔️`) (`CompleteOnboardingButtonComponent.tsx`).
- **프로젝트 네비게이션 바**: 프로젝트 선택 드롭다운, 주요 탭(문서작성탭, 프로젝트분석탭, 증거뷰어탭, 채팅탭), 참여자 관리 버튼 표시 (`ProjectNavigationBarComponent.tsx`).
- **좌측 Sidebar**: 프로젝트 내 폴더 구조, 증거자료 목록, 법령/판례 검색 결과 표시 (`ProjectLeftSidebarComponent.tsx`).
- **중앙 메인 영역**: 최초 실행 시 문서작성탭이 선택되어 표시되며, 탭에 따라 동적으로 콘텐츠 변경.
- **우측 Sidebar**: AI Agent를 통해 현재 탭 상태에 맞는 작업 수행(`ProjectRightSidebarComponent.tsx`).


## 2. 컴포넌트별 세부 구조

### 2.1 프로젝트 네비게이션 바 (`ProjectNavigationBarComponent.tsx`)
프로젝트 네비게이션 바는 프로젝트 선택, 주요 기능 탭, 참여자 관리 기능을 제공하여 사용자가 원하는 작업 모드로 전환하고 협업을 관리할 수 있도록 설계됩니다.
- **프로젝트 선택 드롭다운** (`ProjectSelectionDropdownComponent.tsx`):
  - 현재 선택된 프로젝트 이름 표시 (예: "보니타가 상가분양 손해배상 소송").
  - 드롭다운으로 사용자가 접근 가능한 프로젝트 목록 표시 (`ProjectListDropdownMenuComponent.tsx`).
  - 프로젝트 선택 시 해당 프로젝트의 폴더 구조, 문서, 증거자료, 프로젝트분석 내역, 채팅 내역, 멤버 정보 로드.
- **주요 탭** (`MainNavigationTabsComponent.tsx`):
  - **워크스페이스탭**: 문서 편집 에디터(EditingDocument 를 연 경우) 또는 프로젝트참고자료(ProjectReference에 해당하는 자료들을 연 경우)뷰어를 각각 열려있는 항목마다 작은 탭으로 표시(마치 IDE에서 여러 열린 파일들을 탭으로 보여주는 것처럼). 
  - **프로젝트분석탭**: 프로젝트 목표 설정, 주장 설정, 근거자료 추천, 상대방 입장 분석 및 경고 표시.
  - **채팅탭**: 프로젝트 멤버 간 실시간 채팅방 표시, 증거자료 인용 가능.
- **참여자 관리** (`MemberManagementPanelComponent.tsx`):
  - "멤버 관리" 버튼 (아이콘: `👥`) (`MemberManagementTriggerButtonComponent.tsx`).
    - 클릭 시 드롭다운으로 참여자 목록 표시 (이름, 역할: 관리자/편집권한/뷰어권한 멤버) (`MemberListDropdownComponent.tsx`).
    - 관리자 멤버만 표시: "멤버 초대" 버튼 (아이콘: `+`) (`InviteMemberActionButtonComponent.tsx`).
    - 관리자 멤버만 표시: "멤버 삭제" 버튼 (아이콘: `🗑️`, 각 멤버 옆에 표시) (`RemoveMemberActionButtonComponent.tsx`).
- **기타**:
  - 사용자 프로필 아이콘 (우측 끝, 드롭다운으로 로그아웃/설정 제공) (`UserProfileMenuComponent.tsx`).
  - 검색 아이콘 (전체 검색 기능, 모든 탭에서 사용 가능) (`GlobalSearchFieldComponent.tsx`).

### 2.2 좌측 Sidebar (`ProjectLeftSidebarComponent.tsx`)
좌측 Sidebar는 프로젝트 내 자료 탐색 및 관리를 위한 영역으로, 모든 탭에서 유지됩니다.
구체적인 내용은 [DataNavigatorUIDesign.md](../features/data_navigator/DataNavigatorUIDesign.md) 을 참조. 

### 2.3 우측 Sidebar (`ProjectRightSidebarComponent.tsx`)
우측 Sidebar는 AI Agent에 대한 지시를 통해, `MainNavigationTabsComponent.tsx`의 상태에 맞는 작업을 수행합니다. 
AI Agent의 구체적인 내용은 [AIAgentUIDesign.md](../features/ai_agent/AIAgentUIDesign.md) 를 참조.
AI Agent는 모든 탭에서 동일한 컴포넌트를 사용하며, 문서(유저가 선택한 텍스트의 내용 및 위치 포함), 증거자료, 목표/주장 등 모든 데이터를 입력값으로 받아 처리할 수 있습니다. 
단, 출력 대상 (write 모드) 또는 거론 대상 (ask 모드)은 `MainNavigationTabsComponent.tsx`의 선택 상황에 따라 달라집니다. 

### 2.4 모달
모달은 증거자료 미리보기, 법령/판례 상세 보기, AI 추천 상세 정보, 초대 관리 등을 표시하는 데 사용됩니다.
모달은 즉각적이고 빨리 보여져야 합니다. 캐싱 정책을 고려합니다. 

#### 아래 모달들은, 좌측 Sidebar 나 중앙 메인 영역이나 우측 Sidebar 에서, 해당 항목에 마우스를 hover 하는 경우에 즉각 보여지는 간이한 모달입니다. 
- **파일미리보기모달(FilePreviewModal)** : 증거자료 (Evidence), 주장서류 (ClaimingDocument), 참고자료 (ConsiderableDocument), 프로젝트최종결정문 (ProjectFinalJudgement). 상세 UI 디자인은 [FilePreviewModalUIDesign.md](../features/preview_modal/FilePreviewModalUIDesign.md) 파일을 참조.
- **법령미리보기모달(LawPreviewModal)** : 법령 (Law). 상세 UI 디자인은 [LawPreviewModalUIDesign.md](../features/preview_modal/LawPreviewModalUIDesign.md) 파일을 참조.
- **판례미리보기모달(PrecedentPreviewModal)** : 판례 (Precedent). 상세 UI 디자인은 [PrecedentPreviewModalUIDesign.md](../features/preview_modal/PrecedentPreviewModalUIDesign.md) 파일을 참조.

#### **AI추천프로젝트자료모달(AIRecommendProjectDataModal)** 
상세 UI 디자인은 [AIRecommendProjectDataModalUIDesign.md](../features/ai_recommend/AIRecommendProjectDataModalUIDesign.md) 파일을 참조.
- 해당 맥락에 AI로 가장 연관성이 높은 증거자료 (Evidence), 주장서류 (ClaimingDocument), 참고자료 (ConsiderableDocument), 프로젝트최종결정문 (ProjectFinalJudgement), 법령 (Law),판례 (Precedent)들을 보여 주는(위 각 항목들은 모달 내의 탭뷰) 모달입니다. (아래 각 경우에 보여짐) 
- 유저가 문서편집기에서 문서를 작성하던 중에 특정 텍스트를 선택한 경우 컨텍스트 메뉴 버튼('연관성 높은 자료 보기')을 누르거나, @을 입력하여 나타난 컨텍스트 메뉴 중 컨텍스트 메뉴 버튼('연관성 높은 자료 보기')을 누르는 경우
- 문서미리보기모달, 법령미리보기모달, 판례미리보기모달을 보던 중에 현재 보고 있는 화면이나 유저가 명시적으로 선택한 영역 부분에 대해 컨텍스트 메뉴 버튼('연관성 높은 자료 보기')을 누르거나,@을 입력하여 나타난 컨텍스트 메뉴 중 컨텍스트 메뉴 버튼('연관성 높은 자료 보기')을 누르는 경우   
- 문서뷰어, 법령뷰어, 판례뷰어 화면에서 현재 보고 있는 화면이나 유저가 명시적으로 선택한 영역 부분에 대해 컨텍스트 메뉴 버튼('연관성 높은 자료 보기')을 누르거나 @을 입력하여 나타난 컨텍스트 메뉴 중 컨텍스트 메뉴 버튼('연관성 높은 자료 보기')을 누르는 경우

#### **초대 관리 모달(InviteManagementModal)** (`InviteManagementModalComponent.tsx`):
  - **초대 보내기 (관리자 멤버 전용)**:
    - 이메일 입력창 (placeholder: "초대할 이메일 입력...") (`InviteEmailInputFieldComponent.tsx`).
    - "초대 링크 생성" 버튼 (링크 복사 기능 제공) (`GenerateInviteLinkActionButtonComponent.tsx`).
    - "초대 보내기" 버튼 (아이콘: `➡️`) (`SendInviteActionButtonComponent.tsx`).


## 3. 공통 디자인 시스템

### 3.1 색상 시스템
- **기본 색상**:
  - Primary: #1E90FF (주요 액션, 버튼, 링크)
  - Secondary: #6C757D (보조 액션, 취소 버튼)
  - Success: #4CAF50 (성공, 완료)
  - Warning: #FFC107 (경고, 주의)
  - Danger: #FF4D4F (오류, 삭제)
  - Info: #17A2B8 (정보)

- **배경 색상**:
  - 메인 배경: #FFFFFF
  - 서브 배경: #F8F9FA
  - 사이드바 배경: #F5F7FA
  - 모달 배경: rgba(0, 0, 0, 0.5)
  - 호버 배경: #E8EDF2

- **텍스트 색상**:
  - 기본 텍스트: #2E3440
  - 보조 텍스트: #6C757D
  - 비활성화 텍스트: #ADB5BD
  - 링크 텍스트: #1E90FF

- **기능별 색상**:
  - 인용 배경: #F0F0F0
  - 주석 하이라이트: #FFFF99
  - AI 추천: #E6F0FA
  - 선택 하이라이트: #E1F5FE
  - 에러 하이라이트: #FFE9E9

### 3.2 타이포그래피
- **글꼴 패밀리**:
  - 한글: "Noto Sans KR", sans-serif
  - 영문: "Inter", sans-serif
  - 고정폭: "JetBrains Mono", monospace
  - 법률문서: "바탕체", serif

- **글꼴 크기**:
  - H1: 24px (Bold)
  - H2: 20px (Bold)
  - H3: 18px (Bold)
  - 본문: 16px (Regular)
  - 작은 텍스트: 14px
  - 캡션: 12px

- **줄 간격**:
  - 제목: 1.4
  - 본문: 1.8
  - 리스트: 1.6

### 3.3 여백과 간격
- **기본 단위**: 4px
- **컴포넌트 간격**:
  - 섹션 간격: 24px
  - 컴포넌트 간격: 16px
  - 아이템 간격: 8px
  - 내부 여백: 12px

- **레이아웃 여백**:
  - 페이지 여백: 24px
  - 섹션 여백: 20px
  - 카드 여백: 16px
  - 버튼 여백: 8px 16px

### 3.4 애니메이션
- **지속 시간**:
  - 빠른 전환: 0.1s
  - 기본 전환: 0.2s
  - 느린 전환: 0.3s
  - 페이지 전환: 0.4s

- **타이밍 함수**:
  - 기본: ease-in-out
  - 진입: ease-out
  - 퇴장: ease-in
  - 강조: cubic-bezier(0.4, 0, 0.2, 1)

- **애니메이션 종류**:
  - 페이드: opacity
  - 슬라이드: transform
  - 확장: scale
  - 회전: rotate

### 3.5 그림자
- **레벨 1**: 0 2px 4px rgba(0, 0, 0, 0.1)
- **레벨 2**: 0 4px 8px rgba(0, 0, 0, 0.1)
- **레벨 3**: 0 8px 16px rgba(0, 0, 0, 0.1)
- **레벨 4**: 0 16px 24px rgba(0, 0, 0, 0.1)

### 3.6 반응형 브레이크포인트
- **모바일**: < 768px
- **태블릿**: 768px - 1023px
- **데스크톱**: 1024px - 1439px
- **와이드**: >= 1440px

### 3.7 아이콘
- **크기**:
  - 작은 아이콘: 16px
  - 기본 아이콘: 20px
  - 큰 아이콘: 24px
  - 특대 아이콘: 32px

- **스타일**:
  - 라이브러리: Material Icons, FontAwesome
  - 선 두께: 1.5px
  - 모서리 반경: 2px

### 3.8 모달 시스템
- **기본 구조**:
  - 배경: rgba(0, 0, 0, 0.5)
  - 컨테이너: #FFFFFF
  - 패딩: 24px
  - 모서리 반경: 8px
  - 최대 너비: 600px
  - 최소 너비: 320px

- **애니메이션**:
  - 진입: fade-in (0.2s) + scale-up (0.2s)
  - 퇴장: fade-out (0.2s) + scale-down (0.2s)

- **구성 요소**:
  - 헤더: 제목 + 닫기 버튼
  - 본문: 스크롤 가능
  - 푸터: 작업 버튼들

- **종류**:
  - 기본 모달: 일반적인 정보 표시
  - 미리보기 모달: hover 시 즉시 표시
  - 전체화면 모달: 모바일 환경
  - 사이드 모달: 부가 정보 표시

### 3.9 버튼 시스템
- **크기**:
  - 작은 버튼: height: 28px, padding: 0 12px
  - 기본 버튼: height: 36px, padding: 0 16px
  - 큰 버튼: height: 44px, padding: 0 20px

- **상태**:
  - 기본: Primary 색상
  - 호버: 10% 어둡게
  - 활성: 20% 어둡게
  - 비활성: 회색조 + 투명도

- **변형**:
  - Filled: 배경색 있음
  - Outlined: 테두리만
  - Text: 텍스트만
  - Icon: 아이콘만

### 3.10 입력 필드 시스템
- **크기**:
  - 높이: 36px (기본)
  - 패딩: 8px 12px
  - 글꼴 크기: 14px

- **상태**:
  - 기본: #E0E0E0 테두리
  - 포커스: Primary 색상 테두리
  - 오류: Danger 색상 테두리
  - 비활성화: 회색조 + 배경

- **변형**:
  - 기본 입력
  - 텍스트영역
  - 드롭다운
  - 검색 필드

## 4. UI 디자인 가이드
- **색상**:
  - 메인 배경: #FFFFFF (흰색).
  - 프로젝트 네비게이션 바: #F5F7FA (연한 회색).
  - 강조 색상: #1E90FF (파란색, 버튼 및 링크).
  - 인용: #F0F0F0 (회색 배경).
  - 주석: #FFFF99 (노란색 하이라이트).
  - AI 추천 팝업: #E6F0FA (연한 파란색 배경).
  - 경고 메시지: #FF4D4F (빨간색 배경, 수정 시 경고 지적).
  - 분석/처리 과정 배경: #F5F5F5 (연한 회색 배경).
- **폰트**:
  - 본문 (문서 작성): 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소 (네비게이션 바, 사이드바, 팝업 등): Noto Sans KR, 16px.
  - 제목: Noto Sans KR, 20px (Bold).
  - 조항 번호: Noto Sans KR, 16px (Bold).
  - 분석/처리 과정 텍스트: Noto Sans KR, 14px.
- **아이콘**:
  - Material Icons 또는 FontAwesome 사용.
  - 버튼 아이콘 크기: 20px (모바일: 16px).
- **애니메이션**:
  - Framer Motion으로 모달, 팝업, 버튼 클릭 시 부드러운 전환 효과 (예: fade-in, slide-in).
  - 탭 전환 시 0.2초 애니메이션 (예: slide-in).
  - AI 추천 팝업은 0.3초 애니메이션으로 표시.
  - 분석/처리 과정 표시 시 0.1초 fade-in 효과.
- **모바일 반응형 디자인**:
  - 좌측 Sidebar: 모바일 화면에서는 접기 버튼 표시, 기본적으로 숨김 상태 (`ProjectLeftSidebarCollapseButtonComponent.tsx`).
  - 프로젝트 네비게이션 바: 탭 내비게이션 축소 (아이콘만 표시, 예: 문서작성탭 → ✍️) (`MainNavigationTabsMobileViewComponent.tsx`).
  - 우측 Sidebar: 모바일 화면에서는 하단 플로팅 버튼으로 표시 (아이콘: `🤖`) (`ProjectRightSidebarMobileToggleButtonComponent.tsx`).
  - 버튼 및 입력창: 모바일 화면에서는 크기 축소 (예: 버튼 패딩 8px → 4px) (`ResponsiveButtonComponent.tsx`).

## 5. 화면 흐름
1. **프로젝트 네비게이션 바** (`ProjectNavigationBarComponent.tsx`):
   - 프로젝트 드롭다운에서 프로젝트 선택 (예: "보니타가 상가분양 손해배상 소송").
   - 탭 선택 (워크스페이스탭 → 프로젝트분석탭 → 채팅탭 순으로 배치).
   - "멤버 관리" 버튼 클릭 → 드롭다운으로 참여자 목록 표시 → "멤버 초대" 클릭 → 초대 모달 표시.
2. **초대 수락/거절**:
   - 초대 링크 또는 이메일로 초대 수신 → 초대 모달 표시 → "수락" 또는 "거절" 선택 (`InviteManagementModalComponent.tsx`).
3. **사용자 경험 흐름**:
   - **탭 전환 후 상태 유지**: 탭 전환 시 이전 탭의 상태(예: 스크롤 위치, 선택된 텍스트) 유지 (`TabStatePreservationComponent.tsx`).