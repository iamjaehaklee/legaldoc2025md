# LegalEditor 대시보드탭 UI 화면 구조

본 컴포넌트의 UI/UX는 [GlobalUIDesign.md](../../ui_structure/GlobalUIDesign.md)에서 정의된 공통 디자인 시스템을 따릅니다.

## 1. 대시보드탭 개요
대시보드탭은 사용자가 참여 중인 프로젝트의 개요를 한눈에 확인할 수 있는 메인 화면입니다. 프로젝트 진행 상황, 최근 활동, 알림 등을 표시하며, 빠른 접근을 위한 링크를 제공합니다. 신규 사용자는 첫 로그인 시 온보딩 튜토리얼을 통해 주요 기능을 안내받습니다.

## 2. 위젯트리 구조
```
app/
├── components/
│   └── dashboard/
│       ├── DashboardTabViewComponent.tsx
│       ├── onboarding/
│       │   └── DashboardOnboardingTutorialComponent.tsx  // 세부사항: DashboardTutorialUIDesign.md
│       ├── settings/
│       │   └── UserSettingsTabViewComponent.tsx  // 세부사항: DashboardUserSettingsUIDesign.md
│       ├── project_overview/
│       │   ├── ProjectOverviewSectionComponent.tsx
│       │   ├── ProjectListDisplayComponent.tsx
│       │   ├── GoToProjectButtonComponent.tsx  // 재사용: GlobalUIDesign.md의 NavigationButton.tsx
│       │   └── project_creation/
│       │       ├── CreateNewProjectButtonComponent.tsx
│       │       └── modal/
│       │           ├── CreateProjectModalComponent.tsx
│       │           ├── ProjectNameInputFieldComponent.tsx
│       │           └── description/
│       │               ├── ProjectDescriptionSectionComponent.tsx
│       │               ├── ProjectAIGeneratedDescriptionComponent.tsx
│       │               └── GenerateMoreDescriptionsButtonComponent.tsx
│       ├── activity/
│       │   ├── RecentActivitySectionComponent.tsx
│       │   ├── ActivityListDisplayComponent.tsx
│       │   ├── GoToActivityLinkComponent.tsx  // 재사용: GlobalUIDesign.md의 NavigationLink.tsx
│       │   └── LoadMoreActivitiesButtonComponent.tsx
│       ├── notifications/
│       │   └── NotificationsSectionComponent.tsx  // 세부사항: DashboardNotificationUIDesign.md
│       ├── invitations/
│       │   └── ProjectInvitationManagementComponent.tsx  // 세부사항: DashboardInvitationUIDesign.md
│       └── feedback/
│           ├── DashboardFeedbackTriggerButtonComponent.tsx
│           └── modal/
│               ├── DashboardFeedbackInputModalComponent.tsx
│               ├── DashboardFeedbackInputFieldComponent.tsx
│               ├── DashboardSubmitFeedbackButtonComponent.tsx
│               └── DashboardCancelFeedbackButtonComponent.tsx
```

## 3. 특화 요소
- 프로젝트 진행 상태 표시:
  - 진행 중: 파란색 표시
  - 지연: 빨간색 표시

## 4. 반응형 디자인
### 4.1 데스크톱 (>= 1200px)
- 전체 기능 표시
- 3개 섹션 모두 표시
- 여유 있는 여백 사용

### 4.2 태블릿 (768px - 1199px)
- 섹션 간격 축소
- 태그 관리 섹션 축소
- 활동 목록 컴팩트 뷰

### 4.3 모바일 (<= 767px)
- 한 번에 하나의 섹션만 표시
- 섹션 전환 버튼 제공
- 간소화된 태그 관리