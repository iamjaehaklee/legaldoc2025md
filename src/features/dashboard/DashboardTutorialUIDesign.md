# 대시보드 튜토리얼 UI 디자인

[DashboardUIDesign.md 파일이 이 파일을 인용함]

## 1. 신규 사용자 온보딩 튜토리얼 (`DashboardOnboardingTutorialComponent.tsx`)

신규 사용자가 처음 로그인하거나 계정 생성 후 대시보드에 진입했을 때 자동으로 표시되는 온보딩 튜토리얼입니다. 단계별로 LegalEditor의 주요 기능을 소개하고 사용 방법을 안내합니다.

### 1.1 튜토리얼 시작 모달
- **튜토리얼 시작 모달** (`OnboardingWelcomeModalComponent.tsx`):
  - LegalEditor 소개 문구 및 환영 메시지 표시 (`OnboardingWelcomeMessageComponent.tsx`).
  - "튜토리얼 시작하기" 버튼 (아이콘: `➡️`) (`StartOnboardingTutorialButtonComponent.tsx`).
  - "나중에 하기" 버튼 (아이콘: `⏱️`) (`SkipOnboardingTutorialButtonComponent.tsx`).
  - "다시 보지 않기" 체크박스 (`DoNotShowAgainCheckboxComponent.tsx`).

### 1.2 튜토리얼 단계 관리
- **튜토리얼 단계 관리** (`OnboardingTutorialStepManagerComponent.tsx`):
  - 현재 단계와 전체 단계 수 표시 (예: "2/5") (`OnboardingStepIndicatorComponent.tsx`).
  - "이전" 버튼 (아이콘: `◀️`) (`PreviousTutorialStepButtonComponent.tsx`).
  - "다음" 버튼 (아이콘: `▶️`) (`NextTutorialStepButtonComponent.tsx`).
  - "건너뛰기" 버튼 (아이콘: `⏩`) (`SkipToEndTutorialButtonComponent.tsx`).

### 1.3 튜토리얼 단계별 콘텐츠
- **1단계: 대시보드 소개** (`DashboardIntroTutorialStepComponent.tsx`):
  - 대시보드 레이아웃 및 주요 구성 요소 하이라이트 (`DashboardLayoutHighlightComponent.tsx`).
  - 프로젝트 목록, 최근 활동, 알림 섹션 설명 (`DashboardSectionsExplanationComponent.tsx`).

- **2단계: 새 프로젝트 생성** (`ProjectCreationTutorialStepComponent.tsx`):
  - "새 프로젝트 생성" 버튼 하이라이트 (`CreateProjectButtonHighlightComponent.tsx`).
  - 프로젝트 생성 절차 애니메이션 (`ProjectCreationAnimationComponent.tsx`).
  - 프로젝트 유형별 설명 (계약 검토, 소송 준비 등) (`ProjectTypeExplanationComponent.tsx`).

- **3단계: 문서 작성** (`DocumentEditorTutorialStepComponent.tsx`):
  - 문서 에디터로 이동 가이드 (`NavigateToEditorGuideComponent.tsx`).
  - 에디터 주요 기능 소개 (서식 옵션, AI 기능, 증거자료 인용) (`EditorFeaturesExplanationComponent.tsx`).
  - 템플릿 기반 문서 생성 방법 (`TemplateUsageGuideComponent.tsx`).

- **4단계: 증거자료 관리** (`EvidenceManagementTutorialStepComponent.tsx`):
  - 증거자료 업로드 방법 (`EvidenceUploadGuideComponent.tsx`).
  - PDF 뷰어 및 OCR 기능 소개 (`PDFViewerOCRExplanationComponent.tsx`).
  - 문서 내 증거자료 인용 방법 (`EvidenceCitationGuideComponent.tsx`).
  - 태그 시스템 활용 방법 (`EvidenceTaggingSystemGuideComponent.tsx`).

- **5단계: 법령 검색** (`LawSearchTutorialStepComponent.tsx`):
  - 법령 검색 기능 접근 방법 (`LawSearchAccessGuideComponent.tsx`).
  - 검색 결과 활용 및 문서 내 인용 방법 (`LawCitationGuideComponent.tsx`).
  - 자주 사용하는 법령 저장 방법 (`FrequentlyUsedLawsSavingGuideComponent.tsx`).

### 1.4 튜토리얼 완료 모달
- **튜토리얼 완료 모달** (`OnboardingCompletionModalComponent.tsx`):
  - 튜토리얼 완료 축하 메시지 (`OnboardingCompletionMessageComponent.tsx`).
  - "시작하기" 버튼 (아이콘: `🚀`) (`StartUsingAppButtonComponent.tsx`).
  - 추가 도움말 리소스 링크 (`HelpResourcesLinksComponent.tsx`).

### 1.5 인터랙티브 가이드 요소
- 화면 요소 하이라이트 효과 (반투명 오버레이와 포커스 영역) (`TutorialHighlightOverlayComponent.tsx`).
- 툴팁 및 설명 말풍선 (`TutorialTooltipComponent.tsx`).
- 인터랙티브 체험 영역 (사용자 작업 유도) (`InteractiveDemoAreaComponent.tsx`).
- 진행 상태 인디케이터 (단계별 완료 표시) (`TutorialProgressIndicatorComponent.tsx`).

### 1.6 튜토리얼 접근성 및 제어
- 키보드 단축키 지원 (화살표 키로 이전/다음 단계) (`TutorialKeyboardNavigationComponent.tsx`).
- 튜토리얼 일시정지 버튼 (아이콘: `⏸️`) (`PauseTutorialButtonComponent.tsx`).
- 사용자 진행 속도 조절 (자동 진행 vs. 수동 진행) (`TutorialPaceControlComponent.tsx`).
- 튜토리얼 중단 후 나중에 다시 시작 옵션 (`ResumeTutorialLaterOptionComponent.tsx`).

### 1.7 튜토리얼 진행 상태 저장
- **튜토리얼 진행 상태 저장** (`TutorialProgressTrackerComponent.tsx`):
  - 각 튜토리얼 단계 완료 시 Users 테이블의 `tutorial_progress` 필드 업데이트 (`SaveTutorialProgressComponent.tsx`).
  - 튜토리얼 완료 시 `tutorial_completed` 필드를 true로 설정하고 `tutorial_completed_at` 타임스탬프 기록 (`CompleteTutorialStatusUpdaterComponent.tsx`).
  - "다시 보지 않기" 선택 시 `do_not_show_tutorial` 필드를 true로 설정 (`DisableTutorialOptionComponent.tsx`).
  - 튜토리얼 중단 시 현재 진행 단계 저장하여 나중에 이어서 볼 수 있도록 구현 (`SaveTutorialCheckpointComponent.tsx`).
  - 로그인 시 `tutorial_completed` 필드 확인하여 완료하지 않은 사용자에게 튜토리얼 표시 (`CheckTutorialStatusOnLoginComponent.tsx`).

## 2. UI 디자인 가이드
### 2.1 튜토리얼 스타일
- 튜토리얼 오버레이: 반투명 검은색 (#000000, 60% 투명도)
- 포커스 영역: 흰색 테두리 (#FFFFFF, 2px 두께)
- 튜토리얼 말풍선: #1E90FF (파란색 배경), #FFFFFF (흰색 텍스트)
- 진행 단계 인디케이터: 활성 단계 #1E90FF (파란색), 비활성 단계 #CCCCCC (회색)
- 튜토리얼 버튼: #1E90FF (파란색 배경), #FFFFFF (흰색 텍스트)

### 2.2 애니메이션
- 튜토리얼 단계 전환: 0.3초 fade 효과
- 하이라이트 효과: 0.5초 pulse 애니메이션
- 도움말 팁 표시/숨김: 0.2초 fade-in/out 효과 