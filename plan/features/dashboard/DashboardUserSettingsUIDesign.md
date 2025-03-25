# LegalEditor 사용자설정탭 UI 화면 구조

> 이 파일은 [DashboardUIDesign.md](./DashboardUIDesign.md) 파일에서 인용됩니다.

## 1. 사용자설정탭 개요
사용자설정탭은 사용자의 개인 정보, 알림 설정, UI 테마 등을 관리하는 데 중점을 둡니다. 사용자는 이 탭에서 자신의 프로필을 수정하고, 앱 사용 환경을 개인화할 수 있습니다.

## 2. 컴포넌트별 세부 구조

### 2.1 사용자설정 UI (`UserSettingsTabViewComponent.tsx`)
사용자설정탭 선택 시, 사용자 설정 관련 섹션이 표시됩니다. 각 섹션은 접기/펼치기 기능을 제공하며, 사용자가 쉽게 설정을 변경할 수 있도록 설계됩니다.

- **상단: 프로필 정보** (`UserProfileSectionComponent.tsx`):
  - 사용자 이름 표시 및 수정 (`UserNameInputFieldComponent.tsx`).
  - 사용자 이메일 표시 (수정 불가) (`UserEmailDisplayComponent.tsx`).
  - 프로필 사진 업로드 및 변경 (`ProfilePhotoUploadComponent.tsx`).
  - "변경 저장" 버튼 (아이콘: `💾`) (`SaveProfileInfoButtonComponent.tsx`).

- **중앙: 알림 설정** (`NotificationSettingsSectionComponent.tsx`):
  - 알림 설정 목록 표시 (예: 새 메시지 알림, 증거자료 업로드 알림) (`NotificationSettingsListComponent.tsx`).
  - 각 설정 항목 옆 토글 스위치 (활성화/비활성화) (`NotificationToggleSwitchComponent.tsx`).
  - "설정 저장" 버튼 (아이콘: `💾`) (`SaveNotificationSettingsButtonComponent.tsx`).

- **하단: UI 테마 및 언어 설정** (`UserThemeAndLanguageSettingsSectionComponent.tsx`):
  - **테마 설정** (`UserThemeSettingsComponent.tsx`):
    - 테마 선택 드롭다운 (라이트/다크 모드) (`UserThemeSelectionDropdownComponent.tsx`).
    - "테마 적용" 버튼 (아이콘: `✔️`) (`UserApplyThemeButtonComponent.tsx`).
  - **언어 설정** (`UserLanguageSettingsComponent.tsx`):
    - 언어 선택 드롭다운 (예: 한국어, 영어) (`UserLanguageSelectionDropdownComponent.tsx`).
    - "언어 적용" 버튼 (아이콘: `✔️`) (`UserApplyLanguageButtonComponent.tsx`).
    - **다국어 지원**:
      - react-i18next를 사용하여 다국어 지원 구현 (`UserI18nHandlerComponent.tsx`).
      - 번역 파일 관리: JSON 형식으로 언어별 번역 파일 저장 (예: `ko.json`, `en.json`) (`UserTranslationFilesComponent.tsx`).
      - 동적 로드: 언어 변경 시 번역 파일 동적으로 로드, UI 즉시 반영 (`UserDynamicTranslationLoadComponent.tsx`).

## 3. UI 디자인 가이드
- **색상**:
  - 섹션 배경: #FFFFFF (흰색 배경).
  - 접기/펼치기 버튼: #1E90FF (파란색).
  - 토글 스위치 (활성화): #1E90FF (파란색), (비활성화): #666666 (회색).
- **폰트**:
  - 본문 (문서 작성): 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소 (설정 탭, 드롭다운 등): Noto Sans KR, 16px.
  - 제목: Noto Sans KR, 20px (Bold).
- **아이콘**:
  - Material Icons 또는 FontAwesome 사용.
  - 버튼 아이콘 크기: 20px.
- **애니메이션**:
  - 섹션 접기/펼치기 시 0.2초 애니메이션 (예: slide-down).
  - 테마 변경 시 0.3초 fade-in 효과.