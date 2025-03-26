# 대시보드 알림 UI 디자인

[DashboardUIDesign.md 파일이 이 파일을 인용함]

## 1. 알림 섹션 구조 (`NotificationsSectionComponent.tsx`)

### 1.1 알림 목록
- **알림 목록 표시** (`NotificationListDisplayComponent.tsx`):
  - 새 메시지 도착 알림
  - 초대 수락 알림
  - 프로젝트 업데이트 알림
  - 시스템 알림

### 1.2 알림 관리 버튼
- **개별 알림 확인** (`MarkAsReadButtonComponent.tsx`):
  - 아이콘: `✔️`
  - 각 알림 항목 우측에 위치
  - 클릭 시 해당 알림만 읽음 처리

- **전체 알림 확인** (`MarkAllAsReadButtonComponent.tsx`):
  - 아이콘: `✔️`
  - 알림 섹션 상단에 위치
  - 클릭 시 모든 알림 읽음 처리

## 2. UI 디자인 가이드

### 2.1 알림 스타일
- 읽지 않은 알림 배경색: #E6F0FA (연한 파란색)
- 읽은 알림 배경색: #FFFFFF (흰색)
- 알림 텍스트: Noto Sans KR, 16px
- 알림 시간 표시: 회색 (#666666), 14px

### 2.2 애니메이션
- 새 알림 도착 시: 0.2초 fade-in 효과
- 알림 읽음 처리 시: 0.2초 fade-out 효과 