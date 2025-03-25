아래는 `ChatUIStructure.md` 문서로, 파일명에 `ChatMessage` 접두어를 추가하여 명확성을 높인 버전입니다. 복사/붙여넣기 하실 수 있도록 마크다운 형식으로 제공합니다.

---

# LegalEditor 채팅탭 UI 화면 구조

## 1. 채팅탭 개요
채팅탭은 프로젝트 멤버 간 실시간 채팅을 지원하며, 협업과 커뮤니케이션을 강화하는 데 중점을 둡니다. 사용자는 채팅 중 증거자료를 인용하고 공유할 수 있으며, AI Agent와 상호작용하여 채팅 내용을 기반으로 추가 분석이나 추천을 받을 수 있습니다. 채팅 인터페이스는 간단하고 직관적으로 설계되며, 메시지 입력과 보기 중심으로 구성됩니다.

## 2. 컴포넌트별 세부 구조

### 2.1 채팅탭 UI (`ProjectChatRoomComponent.tsx`)
채팅탭 선택 시, 프로젝트 멤버 간 실시간 채팅방이 표시됩니다. 사용자는 채팅 메시지를 주고받으며, 증거자료를 인용하거나 AI Agent와 상호작용할 수 있습니다.

- **상단: 채팅방 정보** (`ChatRoomHeaderDisplayComponent.tsx`):
  - 채팅방 제목 표시 (예: "프로젝트: 보니타가 상가분양 손해배상 소송") (`ChatRoomTitleComponent.tsx`).
  - 현재 참여 멤버 목록 표시 (이름, 상태: 온라인/오프라인) (`ChatRoomMembersListComponent.tsx`).
  - "멤버 초대" 버튼 (아이콘: `➕`, 관리자만 표시) (`InviteMemberToChatButtonComponent.tsx`):
    - 클릭 시 초대 모달 표시 (`InviteMemberToChatModalComponent.tsx`).

- **중앙: 채팅 메시지 목록** (`ChatMessagesListComponent.tsx`):
  - 채팅 메시지 목록 표시 (발신자 이름, 메시지, 타임스탬프) (`ChatMessageItemComponent.tsx`).
    - 메시지 발신자 이름 색상으로 구분 (본인: 파란색, 타인: 회색) (`MessageSenderNameComponent.tsx`).
    - 증거자료 인용 메시지: `[인용: 파일명]` 형식으로 표시, 클릭 시 우측 Sidebar 또는 모달로 원본 표시 (`EvidenceCitationInChatDisplayComponent.tsx`).
    - 메시지에 마우스 우클릭 시 팝업 메뉴 표시 (`MessageContextMenuComponent.tsx`):
      - "AI Agent로 보내기" 버튼 (`SendMessageToAIAgentButtonComponent.tsx`):
        - 메시지 내용을 AI Agent로 전송하여 추가 분석 요청.
      - "댓글 추가" 버튼 (`AddChatMessageCommentButtonComponent.tsx`):
        - 클릭 시 댓글 입력 모달 표시 (`ChatMessageCommentInputModalComponent.tsx`):
          - 메시지 내용 표시 (`MessageContentDisplayComponent.tsx`).
          - 댓글 입력창 (placeholder: "댓글을 입력하세요...") (`ChatMessageCommentInputFieldComponent.tsx`).
          - "댓글 추가" 버튼 (아이콘: `➡️`) (`AddChatMessageCommentActionButtonComponent.tsx`).
          - "취소" 버튼 (아이콘: `❌`) (`CancelChatMessageCommentActionButtonComponent.tsx`).
  - **댓글 표시** (`ChatMessageCommentsDisplayComponent.tsx`):
    - 메시지 옆에 말풍선 아이콘 표시 (아이콘: `💬`) (`ChatMessageCommentIndicatorIconComponent.tsx`).
    - 말풍선 아이콘 클릭 시 댓글 목록 표시 (작성자, 작성 시간, 내용 포함) (`ChatMessageCommentListDisplayComponent.tsx`).
    - 댓글 목록에서 각 댓글에 답글 추가 가능 (`AddChatMessageReplyToCommentButtonComponent.tsx`).
    - 댓글 삭제 기능 (작성자 또는 관리자만 가능) (`DeleteChatMessageCommentButtonComponent.tsx`).
    - "댓글 AI Agent로 보내기" 버튼 (아이콘: `➡️`) (`SendChatMessageCommentToAIAgentButtonComponent.tsx`):
      - 댓글 내용을 AI Agent로 전송하여 피드백 요청.
  - **메시지 로딩 및 페이지네이션**:
    - 초기 로드 시 최근 50개 메시지 표시, 스크롤 업 시 이전 메시지 로드 (`MessageLazyLoadComponent.tsx`).
    - "이전 메시지 로드" 버튼 (스크롤 상단에 표시) (`LoadPreviousMessagesButtonComponent.tsx`).
    - **성능 최적화**:
      - Supabase Realtime 채널 분리: 대규모 채팅 지원을 위해 프로젝트별 채널 분리 (`ChatChannelOptimizationComponent.tsx`).
      - 메시지 캐싱: 로컬 캐싱(TanStack Query)으로 메시지 로드 속도 향상 (`ChatMessageCacheComponent.tsx`).
      - 가상 스크롤링: 대량 메시지 표시 시 메모리 사용량 최소화 (`ChatVirtualScrollComponent.tsx`).

- **하단: 메시지 입력 및 전송** (`ChatMessageInputComponent.tsx`):
  - 메시지 입력창 (placeholder: "메시지를 입력하세요...") (`MessageInputFieldComponent.tsx`).
  - "증거자료 인용" 버튼 (아이콘: `📎`) (`InsertEvidenceInChatButtonComponent.tsx`):
    - 클릭 시 증거자료 선택 모달 표시 (`SelectEvidenceForChatModalComponent.tsx`):
      - 증거자료 목록 표시 (`EvidenceSelectionListComponent.tsx`).
      - 선택 후 "삽입" 버튼 (아이콘: `✔️`) (`InsertEvidenceToChatButtonComponent.tsx`).
  - "전송" 버튼 (아이콘: `➡️`) (`SendMessageButtonComponent.tsx`).
  - "AI Agent로 보내기" 버튼 (아이콘: `🤖`, 입력창 우측에 표시) (`SendInputToAIAgentButtonComponent.tsx`):
    - 입력 중인 메시지 내용을 AI Agent로 전송하여 피드백 요청.

- **AI Agent 수정 반영**:
  - AI Agent가 메시지 또는 댓글 수정 제안을 반환 시, 기존 내용과 수정된 내용을 비교 표시 (`MessageComparisonPreviewComponent.tsx`, `ChatMessageCommentComparisonPreviewComponent.tsx`):
    - 기존 내용: 회색 텍스트로 표시 (`OriginalMessageDisplayComponent.tsx`, `OriginalChatMessageCommentDisplayComponent.tsx`).
    - 수정된 내용: 노란색 하이라이트로 표시 (`RevisedMessageDisplayComponent.tsx`, `RevisedChatMessageCommentDisplayComponent.tsx`).
    - "승인" 버튼 (아이콘: `✔️`) (`AcceptMessageRevisionButtonComponent.tsx`, `AcceptChatMessageCommentRevisionButtonComponent.tsx`).
    - "취소" 버튼 (아이콘: `❌`) (`CancelMessageRevisionButtonComponent.tsx`, `CancelChatMessageCommentRevisionButtonComponent.tsx`).

## 3. UI 디자인 가이드
- **색상**:
  - 채팅 메시지 (본인): #1E90FF (파란색 배경).
  - 채팅 메시지 (타인): #F0F0F0 (회색 배경).
  - 발신자 이름 (본인): #1E90FF (파란색).
  - 발신자 이름 (타인): #666666 (회색).
  - 댓글 말풍선 아이콘: #1E90FF (파란색).
  - 댓글 목록 배경: #F5F5F5 (연한 회색).
  - AI 수정 하이라이트: #FFFF99 (노란색 하이라이트).
  - 인용 텍스트: #F0F0F0 (회색 배경).
- **폰트**:
  - 본문 (문서 작성): 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소 (채팅 메시지, 댓글 등): Noto Sans KR, 14px.
  - 발신자 이름: Noto Sans KR, 12px (Bold).
  - 비교 텍스트 (기존): Noto Sans KR, 14px (Gray).
  - 비교 텍스트 (수정): Noto Sans KR, 14px (Bold, Yellow Highlight).
- **아이콘**:
  - Material Icons 또는 FontAwesome 사용.
  - 버튼 아이콘 크기: 20px.
- **애니메이션**:
  - 채팅 메시지 추가 시 0.1초 fade-in 효과.
  - 댓글 목록 표시/숨김 시 0.2초 애니메이션 (예: slide-in).
  - AI Agent 수정 비교 표시 시 0.2초 fade-in 효과.

  