# 대시보드 프로젝트 초대장 UI 디자인

[DashboardUIDesign.md 파일이 이 파일을 인용함]

## 1. 초대장 관리 섹션 구조 (`ProjectInvitationManagementComponent`)

### 1.1 받은 초대장 목록
- **초대장 목록 표시** (`ReceivedInvitationsListComponent`):
  - **초대 메시지** (`InviteMessageDisplayComponent`):
    - 텍스트: "프로젝트: {프로젝트명}에 초대되었습니다"
  
  - **초대 상세 정보** (`InviteDetailsComponent`):
    - **프로젝트 정보** (`ProjectInviteInfoComponent`):
      - 프로젝트명
      - 프로젝트 설명
    - **초대자 정보** (`InviterInfoComponent`):
      - 초대자 프로필 이미지
      - 초대자 이름
    - **초대 만료 시간** (`InviteExpirationComponent`):
      - 만료 시간: YYYY-MM-DD HH:mm
  
  - **초대 응답 버튼** (`InviteResponseButtonGroupComponent`):
    - **수락 버튼** (`AcceptInviteActionButtonComponent`):
      - 아이콘: `✔️`
      - 텍스트: "수락"
    - **거절 버튼** (`DeclineInviteActionButtonComponent`):
      - 아이콘: `❌`
      - 텍스트: "거절"

### 1.2 초대장 필터 및 정렬
- **필터 및 정렬 옵션** (`InvitationFilterSortComponent`):
  - **상태별 필터** (`InviteStatusFilterComponent`):
    - 라디오 버튼: "전체"
    - 라디오 버튼: "대기 중"
    - 라디오 버튼: "만료됨"
  
  - **정렬 옵션** (`InviteSortOptionsComponent`):
    - 드롭다운 메뉴:
      - "최신순"
      - "만료임박순"
      - "프로젝트명순"

### 1.3 초대장 통계
- **통계 표시** (`InvitationStatisticsComponent`):
  - **대기 중인 초대** (`PendingInviteCountComponent`):
    - 아이콘: `⏳`
    - 텍스트: "대기 중인 초대: {count}건"
  - **만료 예정 초대** (`ExpiringTodayInviteCountComponent`):
    - 아이콘: `⚠️`
    - 텍스트: "오늘 만료되는 초대: {count}건"

## 2. UI 디자인 가이드

### 2.1 초대장 스타일
- 초대장 카드 배경: #FFFFFF (흰색)
- 카드 테두리: #E8E8E8 (연한 회색), 1px
- 카드 그림자: 0 2px 4px rgba(0, 0, 0, 0.1)
- 만료 임박 초대장: #FFF3F3 (연한 빨간색 배경)

### 2.2 버튼 스타일
- 수락 버튼: #1E90FF (파란색 배경), #FFFFFF (흰색 텍스트)
- 거절 버튼: #FF4D4F (빨간색 배경), #FFFFFF (흰색 텍스트)
- 버튼 크기: 높이 32px, 패딩 좌우 16px
- 버튼 모서리: 4px 라운드

### 2.3 애니메이션
- 초대장 카드 호버 효과: 그림자 확대 (0.2초)
- 버튼 호버 효과: 밝기 10% 증가 (0.2초)
- 응답 후 카드 제거: 0.3초 fade-out 효과 