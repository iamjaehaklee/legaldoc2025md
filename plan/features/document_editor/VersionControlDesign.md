# LegalEditor 버전 관리 설계

## 1. 개요
LegalEditor의 버전 관리 설계는 문서 편집 시 변경 사항을 추적하고, 이전 버전으로 롤백할 수 있는 기능을 제공합니다. 이를 통해 사용자는 실수로 삭제된 내용을 복구하거나 이전 버전을 참고할 수 있습니다.

## 2. 버전 관리 기능
- **변경 사항 추적**:
  - 문서 편집 시 변경 사항을 실시간으로 저장 (Supabase에 저장) (`VersionTrackingHandlerComponent.tsx`).
  - 변경 사항은 사용자별, 타임스탬프별로 기록 (예: "사용자1, 2025-03-24 10:00:00, 텍스트 추가") (`VersionChangeLogComponent.tsx`).
- **버전 히스토리 UI**:
  - 문서작성탭 툴바에 "버전 히스토리" 버튼 추가 (아이콘: `🕒`) (`EditorVersionHistoryButtonComponent.tsx`).
  - 클릭 시 버전 히스토리 모달 표시 (`EditorVersionHistoryModalComponent.tsx`):
    - 버전 목록 표시 (예: "버전 1: 2025-03-24 10:00:00, 사용자1") (`EditorVersionListComponent.tsx`).
    - 각 버전 옆 "미리보기" 버튼 (아이콘: `👁️`) (`EditorVersionPreviewButtonComponent.tsx`).
    - "복원" 버튼 (아이콘: `🔄`) (`EditorRestoreVersionButtonComponent.tsx`).
- **롤백 기능**:
  - 복원 시 현재 문서와 비교 표시 (변경된 부분 하이라이트) (`EditorVersionComparisonComponent.tsx`).
  - "복원 확인" 버튼 (아이콘: `✔️`) (`EditorConfirmRestoreButtonComponent.tsx`).
  - "취소" 버튼 (아이콘: `❌`) (`EditorCancelRestoreButtonComponent.tsx`).

## 3. 데이터베이스 설계 (Supabase)
- **DocumentVersions 테이블**:
  - `id`: UUID (Primary Key).
  - `document_id`: UUID (Foreign Key, 문서 ID).
  - `version_number`: Integer (버전 번호).
  - `content`: JSON (문서 내용 스냅샷).
  - `user_id`: UUID (Foreign Key, Users.id).
  - `created_at`: Timestamp (버전 생성 시간).

## 4. 성능 최적화
- **스냅샷 저장 최적화**:
  - 변경 사항이 있을 때만 스냅샷 저장 (5분 간격) (`VersionSnapshotOptimizationComponent.tsx`).
  - 델타 저장: 변경된 부분만 저장하여 스토리지 사용량 최소화 (`DeltaStorageComponent.tsx`).
- **로딩 최적화**:
  - 버전 목록 지연 로드: 최대 10개씩 로드 (`VersionListLazyLoadComponent.tsx`).
  - 버전 미리보기 캐싱: 자주 접근하는 버전 캐싱 (`VersionPreviewCacheComponent.tsx`).