# LegalEditor 프로젝트설정탭 UI 화면 구조

## 1. 프로젝트설정탭 개요
프로젝트설정탭은 프로젝트의 기본 정보, 멤버 관리, 태그 설정, 권한 관리 등을 설정하고 관리하는 데 중점을 둡니다. 관리자 멤버는 이 탭에서 프로젝트 세부 사항을 수정하고, 팀원 권한을 관리할 수 있습니다.

## 2. 컴포넌트별 세부 구조

### 2.1 프로젝트설정 UI (`ProjectSettingsTabViewComponent.tsx`)
프로젝트설정탭 선택 시, 프로젝트 설정 관련 섹션이 표시됩니다. 각 섹션은 접기/펼치기 기능을 제공하며, 관리자 권한이 있는 사용자만 수정 가능합니다.

- **상단: 프로젝트 기본 정보** (`ProjectBasicInfoSectionComponent.tsx`):
  - 프로젝트 이름 표시 및 수정 (관리자만 가능) (`ProjectNameInputFieldComponent.tsx`).
  - 프로젝트 설명 표시 및 수정 (관리자만 가능) (`ProjectDescriptionInputFieldComponent.tsx`).
  - 프로젝트 생성 날짜 및 최근 수정 날짜 표시 (`ProjectDatesDisplayComponent.tsx`).
  - "변경 저장" 버튼 (아이콘: `💾`) (`SaveProjectBasicInfoButtonComponent.tsx`).

- **중앙: 멤버 관리** (`ProjectMemberManagementSectionComponent.tsx`):
  - 현재 멤버 목록 표시 (이름, 역할: 관리자/일반 멤버, 상태: 온라인/오프라인) (`ProjectMemberListComponent.tsx`).
  - "멤버 초대" 버튼 (아이콘: `➕`) (`InviteMemberButtonComponent.tsx`):
    - 클릭 시 초대 모달 표시 (`InviteMemberModalComponent.tsx`):
      - 이메일 입력창 (placeholder: "초대할 이메일 입력...") (`InviteEmailInputFieldComponent.tsx`).
      - "초대 링크 생성" 버튼 (링크 복사 기능 제공) (`GenerateInviteLinkActionButtonComponent.tsx`).
      - "초대 보내기" 버튼 (아이콘: `➡️`) (`SendInviteActionButtonComponent.tsx`).
  - 각 멤버 옆 "역할 변경" 버튼 (아이콘: `⚙️`, 관리자만 표시) (`ChangeMemberRoleButtonComponent.tsx`):
    - 클릭 시 역할 변경 드롭다운 표시 (`RoleChangeDropdownComponent.tsx`):
      - 프로젝트 소유자(Owner): 유료 플랜 사용자만 선택 가능 (비활성화 상태로 표시)
      - 관리자(Admin): 유료 플랜 사용자만 선택 가능 (비활성화 상태로 표시)
      - 편집자(Editor): 유료 플랜 사용자만 선택 가능 (비활성화 상태로 표시)
      - 주석자(Commentator): 모든 사용자 선택 가능
      - 조회자(Viewer): 모든 사용자 선택 가능
    - 유료 플랜 상태 표시 아이콘 (`UserPlanIndicatorComponent.tsx`):
      - 유료 플랜: 프리미엄 뱃지 (아이콘: `⭐`)
      - 무료 플랜: 기본 뱃지 (아이콘: `⚪`)
  - 각 멤버 옆 "삭제" 버튼 (아이콘: `🗑️`, 관리자만 표시) (`RemoveMemberButtonComponent.tsx`).

- **하단: 태그 및 권한 설정** (`ProjectTagsAndPermissionsSectionComponent.tsx`):
  - **태그 설정** (`ProjectTagSettingsComponent.tsx`):
    - 프로젝트 내 태그 목록 표시 (`ProjectTagListDisplayComponent.tsx`).
    - "태그 추가" 버튼 (아이콘: `➕`) (`ProjectAddTagButtonComponent.tsx`):
      - 클릭 시 태그 입력 모달 표시 (`ProjectAddTagModalComponent.tsx`):
        - 태그 이름 입력 (`ProjectTagNameInputFieldComponent.tsx`).
        - 태그 색상 선택 (`ProjectTagColorPickerComponent.tsx`).
        - "추가" 버튼 (아이콘: `✔️`) (`ProjectAddTagActionButtonComponent.tsx`).
    - 각 태그 옆 "수정" 버튼 (아이콘: `✏️`) (`ProjectEditTagButtonComponent.tsx`).
    - 각 태그 옆 "삭제" 버튼 (아이콘: `🗑️`) (`ProjectDeleteTagButtonComponent.tsx`).
  - **권한 설정** (`ProjectPermissionSettingsComponent.tsx`):
    - 멤버 역할별 권한 설정 (`ProjectRolePermissionSettingsComponent.tsx`):
      - 권한 항목 목록 (`ProjectPermissionItemsListComponent.tsx`):
        - "프로젝트 설정 변경": Owner, Admin만 가능
        - "멤버 관리": Owner, Admin만 가능
        - "문서 편집": Owner, Admin, Editor만 가능
        - "증거자료 업로드/삭제": Owner, Admin, Editor만 가능
        - "AI 기능 사용": Owner, Admin, Editor만 가능 (유료 플랜 전용)
        - "AI 생성 콘텐츠 조회": 모든 역할 가능
        - "주석/댓글 작성": Owner, Admin, Editor, Commentator 가능
        - "채팅 참여": 모든 역할 가능
      - 각 항목 옆 역할별 접근 권한 표시 (`RoleBasedPermissionIndicatorComponent.tsx`)
      - 역할별 플랜 요구사항 표시 (`RolePlanRequirementComponent.tsx`):
        - Owner/Admin/Editor: "유료 플랜 필요" 표시
        - Commentator/Viewer: "무료 플랜 가능" 표시
      - 권한 변경 시 경고 표시 (예: "이 권한 변경으로 인해 멤버가 문서를 편집할 수 없게 됩니다") (`ProjectPermissionChangeWarningComponent.tsx`).
    - "권한 저장" 버튼 (아이콘: `💾`) (`ProjectSavePermissionSettingsButtonComponent.tsx`).

- **결제 및 플랜 관리** (`ProjectSubscriptionManagementSectionComponent.tsx`):
  - **플랜 상태 표시** (`SubscriptionStatusComponent.tsx`):
    - 현재 플랜 유형 (무료/스타터/프로/엔터프라이즈) 표시
    - 남은 구독 기간 표시 (예: "23일 남음")
    - 자동 갱신 상태 표시 (On/Off)
  - **결제 중단 알림 설정** (`SubscriptionExpirationNotificationSettingsComponent.tsx`):
    - "이메일 알림 받기" 체크박스 (기본값: 활성화)
    - "앱 내 알림 받기" 체크박스 (기본값: 활성화)
    - "만료 7일 전 알림" 옵션 (기본값: 선택됨)
  - **데이터 보존 정책 안내** (`DataRetentionPolicyInfoComponent.tsx`):
    - "결제 중단 시 데이터 처리 방식" 섹션
    - 90일 원본 보존 및 이후 아카이브 처리 정보
    - "아카이브된 데이터 관리" 링크 (아이콘: `📦`)
  
- **AI 권한 관리** (`AIPermissionManagementSectionComponent.tsx`):
  - **팀 AI 사용 통계** (`TeamAIUsageStatisticsComponent.tsx`):
    - 팀 내 AI 기능 사용 빈도 차트 표시
    - 협업 효율성 증가 통계 표시
  - **무료 사용자 AI 미리보기 설정** (`FreeUserAIPreviewSettingsComponent.tsx`):
    - "AI 미리보기 제공" 토글 스위치 (활성화/비활성화)
    - "미리보기 기능 선택" 드롭다운 (예: "기본 문서 생성", "증거자료 요약")
    - "월 제공 횟수 제한" 설정 슬라이더 (기본값: 3회)
  - **팀 전체 업그레이드 혜택** (`TeamUpgradeBenefitsComponent.tsx`):
    - "팀 전원 유료 전환 시 AI 사용량 20% 추가 제공" 정보 배너
    - "팀 업그레이드 제안하기" 버튼 (아이콘: `⬆️`)
    - 예상 비용 절감액 계산기

## 3. UI 디자인 가이드
- **색상**:
  - 섹션 배경: #FFFFFF (흰색 배경).
  - 접기/펼치기 버튼: #1E90FF (파란색).
  - 멤버 상태 (온라인): #1E90FF (파란색), (오프라인): #666666 (회색).
  - 태그 색상: 사용자 정의 색상 (기본: #E6F0FA, 연한 파란색).
- **폰트**:
  - 본문 (문서 작성): 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소 (설정 탭, 입력창 등): Noto Sans KR, 16px.
  - 제목: Noto Sans KR, 20px (Bold).
- **아이콘**:
  - Material Icons 또는 FontAwesome 사용.
  - 버튼 아이콘 크기: 20px.
- **애니메이션**:
  - 섹션 접기/펼치기 시 0.2초 애니메이션 (예: slide-down).