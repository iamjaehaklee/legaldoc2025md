# LegalEditor 프로젝트 협업 UI 화면 구조

## UI 트리구조
```
ProjectCooperationComponent
├── ProjectMemberManagementComponent
│   ├── MemberListSectionComponent
│   │   ├── MemberListHeaderComponent
│   │   │   ├── InviteMemberButtonComponent
│   │   │   └── MemberFilterComponent
│   │   └── MemberListComponent
│   │       ├── MemberItemComponent
│   │       │   ├── MemberProfileComponent
│   │       │   │   ├── MemberAvatarComponent
│   │       │   │   ├── MemberNameComponent
│   │       │   │   └── MemberRoleBadgeComponent
│   │       │   ├── MemberStatusComponent
│   │       │   │   ├── OnlineStatusIndicatorComponent
│   │       │   │   └── LastActiveTimeComponent
│   │       │   ├── MemberPlanStatusComponent
│   │       │   │   ├── PlanTypeBadgeComponent
│   │       │   │   └── PlanExpiryComponent
│   │       │   └── MemberActionsComponent
│   │       │       ├── ChangeRoleButtonComponent
│   │       │       ├── RemoveMemberButtonComponent
│   │       │       └── TransferOwnershipButtonComponent
│   │       └── MemberInvitationListComponent
│   │           └── InvitationItemComponent
│   │               ├── InvitationStatusComponent
│   │               └── InvitationActionsComponent
│   ├── RoleManagementSectionComponent
│   │   ├── RoleListComponent
│   │   │   └── RoleItemComponent
│   │   │       ├── RolePermissionsComponent
│   │   │       └── RoleMembersComponent
│   │   └── RoleActionsComponent
│   │       ├── EditRolePermissionsComponent
│   │       └── AssignRoleComponent
│   └── PlanManagementSectionComponent
│       ├── TeamPlanStatusComponent
│       ├── MemberPlanListComponent
│       └── PlanUpgradePromptComponent
├── ProjectChatComponent
│   ├── ChatHeaderComponent
│   │   ├── ChatTitleComponent
│   │   └── ChatSettingsComponent
│   ├── ChatMessagesComponent
│   │   ├── MessageListComponent
│   │   │   └── MessageItemComponent
│   │   │       ├── MessageContentComponent
│   │   │       │   ├── TextContentComponent
│   │   │       │   └── EvidenceCitationComponent
│   │   │       ├── MessageMetaComponent
│   │   │       └── MessageActionsComponent
│   │   └── MessageInputComponent
│   │       ├── TextEditorComponent
│   │       ├── EvidenceAttachComponent
│   │       └── SendMessageComponent
│   └── ChatSidebarComponent
│       ├── ParticipantListComponent
│       └── SharedEvidenceListComponent
└── NotificationCenterComponent
    ├── NotificationListComponent
    │   └── NotificationItemComponent
    │       ├── NotificationContentComponent
    │       └── NotificationActionsComponent
    └── NotificationSettingsComponent
```

## 1. 프로젝트 협업 개요
프로젝트 협업 기능은 프로젝트 참여자들 간의 효율적인 협업을 지원하기 위한 UI를 제공합니다. 주요 기능으로는 참여자 관리, 실시간 채팅, 알림 센터가 있으며, 각 기능은 사용자의 역할과 권한에 따라 차등적으로 제공됩니다.

## 2. 컴포넌트별 세부 구조

### 2.1 참여자 관리 (`ProjectMemberManagementComponent`)
프로젝트 참여자들의 역할과 권한을 관리하는 섹션입니다.

#### 2.1.1 참여자 목록 (`MemberListSectionComponent`)
- 현재 프로젝트 참여자 목록 표시
- 참여자 초대 기능
- 참여자 역할 변경 및 제거 기능
- 참여자 상태 (온라인/오프라인) 표시
- 플랜 상태 표시 및 관리

#### 2.1.2 역할 관리 (`RoleManagementSectionComponent`)
- 역할별 권한 설정
- 역할 할당 및 변경
- 역할별 참여자 목록

#### 2.1.3 플랜 관리 (`PlanManagementSectionComponent`)
- 팀 전체 플랜 상태 확인
- 개별 참여자 플랜 상태 관리
- 플랜 업그레이드 안내

### 2.2 프로젝트 채팅 (`ProjectChatComponent`)
실시간 채팅을 통한 프로젝트 참여자 간 커뮤니케이션을 지원합니다.

#### 2.2.1 채팅 메시지 (`ChatMessagesComponent`)
- 실시간 메시지 송수신
- 증거자료 인용 및 공유
- 메시지 검색 및 필터링

#### 2.2.2 채팅 사이드바 (`ChatSidebarComponent`)
- 현재 참여자 목록
- 공유된 증거자료 목록

### 2.3 알림 센터 (`NotificationCenterComponent`)
프로젝트 내 주요 이벤트와 업데이트에 대한 알림을 관리합니다.

#### 2.3.1 알림 목록 (`NotificationListComponent`)
- 역할 변경 알림
- 플랜 상태 변경 알림
- 초대 및 참여 관련 알림

#### 2.3.2 알림 설정 (`NotificationSettingsComponent`)
- 알림 유형별 설정
- 알림 수신 방식 설정

## 3. UI 디자인 가이드

### 3.1 색상
- 역할 뱃지: Owner(#FF6B6B), Admin(#4DABF7), Editor(#51CF66), Commentator(#FAB005), Viewer(#868E96)
- 온라인 상태: 온라인(#40C057), 오프라인(#868E96)
- 플랜 상태: 유료(#4C6EF5), 무료(#868E96), 만료 임박(#FD7E14)
- 알림: 읽지 않음(#FA5252), 읽음(#868E96)

### 3.2 타이포그래피
- 섹션 제목: Noto Sans KR, 20px, Bold
- 목록 항목: Noto Sans KR, 16px, Regular
- 상태 텍스트: Noto Sans KR, 14px, Medium
- 알림 텍스트: Noto Sans KR, 14px, Regular

### 3.3 아이콘
- 역할 변경: ⚙️
- 멤버 제거: 🗑️
- 초대: ✉️
- 알림: 🔔
- 온라인 상태: 🟢
- 오프라인 상태: ⚫
- 메시지 전송: ➡️
- 증거자료 첨부: 📎

### 3.4 애니메이션
- 목록 항목 변경: 0.2초 fade 효과
- 알림 표시: 0.3초 slide-in 효과
- 상태 변경: 0.2초 transition 효과
- 메시지 전송: 0.2초 slide-up 효과
