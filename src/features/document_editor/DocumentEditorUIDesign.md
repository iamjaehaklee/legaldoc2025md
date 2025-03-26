# 문서 에디터 UI 디자인

본 컴포넌트의 UI/UX는 [GlobalUIDesign.md](../../ui_structure/GlobalUIDesign.md)에서 정의된 공통 디자인 시스템을 따릅니다.

## 1. 특화 디자인 요소

### 1.1 편집 상태 표시
- 저장됨: 초록색 계열 (#43A047)
- 저장 중: 주황색 계열 (#FB8C00)
- 미저장: 빨간색 계열 (#E53935)
- 충돌: 보라색 계열 (#7B1FA2)

### 1.2 문서 유형별 아이콘
- 주장서면: ⚖️ 또는 적절한 SVG 아이콘
- 답변서: 📝 또는 적절한 SVG 아이콘
- 준비서면: 📋 또는 적절한 SVG 아이콘
- 의견서: 💭 또는 적절한 SVG 아이콘
- 보고서: 📊 또는 적절한 SVG 아이콘

## 2. 레이아웃 구조

### 2.1 에디터 화면
- 상단 도구 모음
  - 파일 작업 메뉴
  - 서식 도구
  - 삽입 도구
  - 검토 도구
- 중앙 편집 영역
  - 페이지 뷰
  - 줄 번호
  - 변경 사항 표시
- 우측 사이드바
  - 개요
  - 댓글
  - 변경 이력

### 2.2 협업 인터페이스
- 실시간 편집 표시
- 변경 사항 추적
- 댓글 스레드
- 승인 워크플로우

## 3. 반응형 동작
- 데스크톱 (1200px 이상): 3단 레이아웃
- 태블릿 (768px ~ 1199px): 2단 레이아웃
- 모바일 (767px 이하): 1단 레이아웃

## 4. 특수 기능

### 4.1 문서 구조화
- 자동 목차 생성
- 섹션 관리
- 상호 참조
- 각주/미주

### 4.2 인용 및 참조
- 법령 인용
- 판례 인용
- 증거 인용
- 참고자료 인용

### 4.3 검토 기능
- 변경 사항 추적
- 승인/거부
- 버전 관리
- 비교 보기

```mermaid
graph TD
    A[문서 에디터 메인<br/>EditorDocumentEditorComponent] --> B[에디터 툴바<br/>EditorDocumentEditorToolbarComponent]
    A --> C[에디터 본문<br/>EditorDocumentEditorMainComponent]
    
    B --> B1[텍스트 스타일 버튼<br/>EditorTextStyleFormatButtonsComponent]
    B --> B2[제목 레벨 선택<br/>EditorHeadingLevelDropdownComponent]
    B --> B3[글꼴/크기 설정<br/>EditorFontSizeStyleDropdownComponent]
    B --> B4[텍스트 정렬 버튼<br/>EditorTextAlignmentButtonsComponent]
    B --> B5[목차 번호 삽입<br/>EditorInsertClauseNumberButtonComponent]
    B --> B6[목록 형식 버튼<br/>EditorListFormatButtonsComponent]
    B --> B7[AI 문서 생성<br/>EditorGenerateDocumentFromTemplateButtonComponent]
    B --> B8[AI 명령어 입력<br/>EditorAICommandInputSectionComponent]
    B --> B9[문서 버전 관리<br/>EditorDocumentVersionManagementDropdownComponent]
    
    C --> C1[실시간 협업 처리<br/>EditorRealTimeCollaborationHandlerComponent]
    C --> C2[AI 추천 팝업<br/>EditorDocumentAIRecommendationPopupComponent]
    C --> C3[우클릭 메뉴<br/>EditorContextMenuOnSelectionComponent]
    C --> C4[동적 필드 관리<br/>EditorDynamicFieldRenderingManagerComponent]
    C --> C5[@ 단축키 처리<br/>EditorAtKeyContextMenuComponent]
    
    C5 --> C5A[컨텍스트 분석<br/>EditorContextAnalysisHandlerComponent]
    C5 --> C5B[자료 인용 모달<br/>DataPickerModal]
    C5 --> C5C[자동 생성 모달<br/>AnalysisItemPickerModal]
    
    B8 --> B8A[명령어 입력창<br/>EditorAICommandInputTextareaComponent]
    B8 --> B8B[명령어 추천 목록<br/>EditorAICommandSuggestionsDropdownComponent]
    B8 --> B8C[명령어 실행 버튼<br/>EditorApplyAICommandButtonComponent]
    
    B9 --> B9A[현재 버전 표시<br/>EditorCurrentVersionDisplayComponent]
    B9 --> B9B[버전 이력 모달<br/>EditorVersionHistoryModalComponent]
    B9 --> B9C[버전 선택 드롭다운<br/>EditorVersionSelectorDropdownComponent]
    
    C3 --> C3A[AI 편집 옵션<br/>EditorAIEditSelectionOptionComponent]
    C3 --> C3B[증거자료 지원<br/>EditorEvidenceSupportSelectionModalComponent]
    C3 --> C3C[댓글 처리<br/>EditorCommentInsertionHandlerComponent]
    
    C4 --> C4A[필드 타입 매핑<br/>EditorFieldTypeUIMapperComponent]
    C4 --> C4B[필드 의존성 관리<br/>EditorFieldDependencyHandlerComponent]
    C4 --> C4C[자동완성 데이터<br/>EditorAutocompletionDataManagerComponent]
```

---

# LegalEditor 문서작성탭 UI 화면 구조

## 1. 문서작성탭 개요
문서작성탭은 법률문서 작성에 특화된 에디터를 제공하며, 증거자료, 법령, 판례를 쉽게 인용할 수 있도록 설계됩니다. 최초 실행 시 기본 탭으로 표시됩니다。

## 2. 컴포넌트별 세부 구조

### 2.1 에디터 툴바 (`EditorDocumentEditorToolbarComponent.tsx`)
에디터 툴바는 전문적인 워드 프로세서 기능과 AI 기반 기능을 제공하며, 문서 편집 중 증거자료, 법령, 판례를 쉽게 확인하고 인용할 수 있도록 설계됩니다。
- **텍스트 스타일링 (워드 프로세서 기능)**:
  - 볼드, 이탤릭, 밑줄, 취소선 버튼 (아이콘: `B`, `I`, `U`, `S`) (`EditorTextStyleFormatButtonsComponent.tsx`).
  - 헤딩 (H1, H2, H3) 드롭다운 (`EditorHeadingLevelDropdownComponent.tsx`).
  - 글꼴 크기 및 스타일 선택 (드롭다운: 10px~24px, Noto Sans KR 등) (`EditorFontSizeStyleDropdownComponent.tsx`).
  - 정렬 (왼쪽, 가운데, 오른쪽, 양쪽 정렬) 버튼 (`EditorTextAlignmentButtonsComponent.tsx`).
  - 목차 번호 삽입 버튼 (아이콘: `1.`) (`EditorInsertClauseNumberButtonComponent.tsx`).
  - 목록 (번호, 글머리 기호) 버튼 (`EditorListFormatButtonsComponent.tsx`).
- **AI 기능**: 
  - AI 관련 기능은 우측 사이드바의 AI Agent를 통해 제공됩니다.
  - 상세 내용은 [AIAgentUIDesign.md](../ai_agent/AIAgentUIDesign.md)의 "6.1 문서작성탭 특화 기능" 섹션을 참조하세요.
- **인용 및 참고**:
  - "증거자료 인용" 버튼 (아이콘: `📎`, 선택된 증거자료를 본문에 삽입) (`EditorInsertEvidenceCitationActionButtonComponent.tsx`).
  - "법령/판례 참고" 버튼 (아이콘: `📜`) - 상세 UI 구조는 `LawPrecedentModalUIDesign.md` 참조 (`EditorInsertLawPrecedentReferenceActionButtonComponent.tsx`).
  - "참고자료 인용" 버튼 (아이콘: `📚`, 선택된 참고자료를 본문에 삽입) (`EditorInsertReferenceActionButtonComponent.tsx`).
  - "판결문 인용" 버튼 (아이콘: `⚖️`, 선택된 판결문을 본문에 삽입) (`EditorInsertJudgementActionButtonComponent.tsx`).
  - "주장서류 인용" 버튼 (아이콘: `📄`, 선택된 주장서류를 본문에 삽입) (`EditorInsertClaimingDocumentActionButtonComponent.tsx`).
- **기타**:
  - "PDF 내보내기" 버튼 (아이콘: `📄`) (`EditorExportDocumentToPDFButtonComponent.tsx`).
  - "저장" 버튼 (아이콘: `💾`, 자동 저장 기능과 함께 수동 저장 옵션 제공) (`EditorSaveDocumentButtonComponent.tsx`).
- **문서 버전 관리**:
  - "버전 관리" 드롭다운 메뉴 (아이콘: `📝`) (`EditorDocumentVersionManagementDropdownComponent.tsx`):
    - **현재 버전 표시** (`EditorCurrentVersionDisplayComponent.tsx`):
      - 문서의 현재 버전 번호 표시 (예: "버전: 1.0")
    - **새 버전 생성** (`EditorCreateNewVersionButtonComponent.tsx`):
      - 클릭 시 새 버전 생성 모달 표시 (`EditorCreateVersionModalComponent.tsx`):
        - 버전 유형 선택 라디오 버튼 (`EditorVersionTypeRadioButtonComponent.tsx`):
          - "마이너 버전" (예: 1.0 → 1.1, 작은 변경 사항)
          - "메이저 버전" (예: 1.0 → 2.0, 큰 변경 사항)
        - 버전 설명 입력 필드 (`EditorVersionDescriptionInputComponent.tsx`, placeholder: "이 버전의 주요 변경 사항을 입력하세요")
        - "생성" 버튼 (아이콘: `✔️`) (`EditorConfirmVersionCreationButtonComponent.tsx`)
        - "취소" 버튼 (아이콘: `❌`) (`EditorCancelVersionCreationButtonComponent.tsx`)
    - **버전 기록 보기** (`EditorViewVersionHistoryButtonComponent.tsx`):
      - 클릭 시 버전 기록 모달 표시 (`EditorVersionHistoryModalComponent.tsx`):
        - 버전 목록 (`EditorVersionListComponent.tsx`):
          - 각 버전 정보 (버전 번호, 생성 날짜/시간, 작성자, 설명)
          - 선택 라디오 버튼 (두 버전 비교용)
        - "선택 버전 보기" 버튼 (`EditorViewSelectedVersionButtonComponent.tsx`): 선택한 단일 버전 보기
        - "버전 비교" 버튼 (`EditorCompareVersionsButtonComponent.tsx`): 선택한 두 버전 비교
        - "닫기" 버튼 (`EditorCloseVersionHistoryModalButtonComponent.tsx`)
    - **버전 비교 뷰** (`EditorVersionComparisonViewComponent.tsx`):
      - 분할 화면으로 두 버전 비교 표시
      - 왼쪽: 이전 버전, 오른쪽: 새 버전
      - 삭제된 내용은 빨간색 삭선으로 표시
      - 추가된 내용은 파란색 밑줄로 표시
      - 변경되지 않은 내용은 일반 텍스트로 표시
      - "이전 버전으로 복원" 버튼 (`EditorRestoreToPreviousVersionButtonComponent.tsx`)
    - **버전 선택 드롭다운** (`EditorVersionSelectorDropdownComponent.tsx`):
      - 모든 버전 목록
      - 선택 시 해당 버전으로 문서 내용 변경 (읽기 전용 모드)
      - "최신 버전으로 돌아가기" 버튼 (`EditorReturnToLatestVersionButtonComponent.tsx`)

### 2.2 에디터 본문 (`EditorDocumentEditorComponent.tsx`)
에디터 본문은 문서 작성의 핵심 영역으로, Plate.js를 기반으로 전문적인 워드 프로세서 기능을 제공하며, 증거자료, 법령, 판례를 쉽게 확인하고 인용할 수 있도록 설계됩니다。
- **문서 편집**:
  - Plate.js 기반 리치 텍스트 에디터.
  - 실시간 자동 저장 (Supabase에 저장).
  - A4 문서를 작성하는 UI 스타일, 본문 글꼴은 MS Word 기준 12포인트, 줄간격 180%로 설정, 한글 바탕체 글꼴.
  - '@' 단축키 기능:
    - '@' 키 입력 시 컨텍스트 메뉴 표시 (`EditorAtKeyContextMenuComponent.tsx`):
      - 현재 커서 위치의 컨텍스트 또는 선택된 블록과 그 컨텍스트를 분석
      - 메뉴 항목:
        - "자료 인용" - 클릭 시 `DataPickerModal` 호출
        - "자동 생성" - 클릭 시 `AnalysisItemPickerModal` (자동 생성 모드) 호출
      - 메뉴 위치: 커서 또는 선택 영역 근처에 표시
    - 컨텍스트 분석 처리 (`EditorContextAnalysisHandlerComponent.tsx`):
      - 커서 위치 기준 앞뒤 100자 추출
      - 선택된 블록이 있는 경우 해당 블록과 앞뒤 100자 추출
      - 추출된 컨텍스트를 각 모달에 전달하여 관련 자료 검색에 활용
  - 문서 텍스트를 블록 지정 완료하거나, 블록 지정한 상태에서 마우스 우클릭 시 팝업 메뉴 표시 (`EditorContextMenuOnSelectionComponent.tsx`):
    - "선택부분 AI 수정 지시하기" (`EditorOpenAIEditInstructionModalButtonComponent.tsx`).
    - "선택부분 AI Agent에게 보내기" (`EditorSendToAIAgentButtonComponent.tsx`).
    - "선택부분에 대한 전거 삽입하기" (`EditorInsertEvidenceSupportButtonComponent.tsx`).
    - "선택부분 댓글 작성하기" (`EditorInsertCommentButtonComponent.tsx`).

- **AI 문서 생성 처리**:
  - 생성 진행 상태 표시 (`EditorAIGenerationProgressIndicatorComponent.tsx`):
    - "데이터 분석 중..." → "관련 자료 검색 중..." → "문서 생성 중..." 단계별 진행 표시
  - 생성 완료 후 하이라이트된 주요 포인트 표시 (`EditorAIGeneratedHighlightsComponent.tsx`):
    - 문서 유형 기반 주요 조항 하이라이트 (예: 비밀정보 정의, 손해배상 조항 등)
    - 토스트 메시지로 "AI가 생성한 문서를 검토하고 필요한 부분을 수정하세요" 안내 (`EditorAIGenerationCompletionToastComponent.tsx`)

- **실시간 협업**:
    - 동시 편집 지원 (Operational Transformation 기반, Supabase Realtime 활용) (`EditorRealTimeCollaborationHandlerComponent.tsx`).
    - 다른 사용자의 커서 표시 (색상으로 구분, 예: 사용자1: 파란색, 사용자2: 초록색) (`EditorUserCursorDisplayComponent.tsx`).
    - 변경 사항 실시간 반영 (변경된 텍스트 하이라이트 표시, 0.1초 fade-in 효과) (`EditorRealTimeChangeHighlightComponent.tsx`).
    - 충돌 발생 시 알림 표시 및 해결 UI 제공 (예: "충돌 발생: 사용자1의 변경 사항과 충돌. 수락/거절 선택") (`EditorConflictResolutionModalComponent.tsx`).
      - "수락" 버튼 (아이콘: `✔️`) (`EditorAcceptConflictResolutionButtonComponent.tsx`).
      - "거절" 버튼 (아이콘: `❌`) (`EditorRejectConflictResolutionButtonComponent.tsx`).

- **법률문서 특화 기능**:
    - 계약서 조건 검토: 계약서 작성 시 조항별 조건(예: 계약 기간, 손해배상 조항)을 AI가 검토하여 경고 표시 (예: "계약 기간이 불명확합니다") (`EditorContractConditionReviewComponent.tsx`).
    

- **인용 및 참고 표시**:
  - 증거자료 인용: `@ [증거] 파일제목 해당페이지` 형식으로 삽입, 회색 배경 스타일링, 마우스 호버 시 모달로 원본 표시 (`EditorEvidenceCitationInlineDisplayComponent.tsx`).
  - 법령 참고: `@ [법령] 법령제목 및 법령조항번호` 형식으로 삽입, 파란색 링크 스타일링 (`EditorLawReferenceInlineDisplayComponent.tsx`).
  - 판례 참고: `@ [판례] 판례제목` 형식으로 삽입, 파란색 링크 스타일링 (`EditorPrecedentReferenceInlineDisplayComponent.tsx`).
  - 참고자료 인용: `@ [참고] 자료제목 해당페이지` 형식으로 삽입, 초록색 링크 스타일링 (`EditorReferenceInlineDisplayComponent.tsx`).
  - 판결문 인용: `@ [판결] 판결문제목` 형식으로 삽입, 보라색 링크 스타일링 (`EditorJudgementInlineDisplayComponent.tsx`).
  - 주장서류 인용: `@ [주장] 서류제목` 형식으로 삽입, 주황색 링크 스타일링 (`EditorClaimingDocumentInlineDisplayComponent.tsx`).
- **AI 추천 표시**:
  - 문서 작성 중 AI 추천 증거자료/법령/판례가 팝업으로 표시 (`EditorDocumentAIRecommendationPopupComponent.tsx`).
  - 팝업에서 "삽입" 버튼 클릭 시 본문에 자동 삽입 (`EditorInsertDocumentAIRecommendationButtonComponent.tsx`).
- **선택부분 AI 수정 지시하기**:
  - 선택부분에 대해 AI에게 수정 지시하는 옵션을 사이드바에 제공 (`EditorAIEditSelectionOptionComponent.tsx`). 
  - 선택 시 우측 사이드바의 AI Agent로 선택된 텍스트가 자동으로 전송되고, 사용자는 수정 지시사항을 직접 입력할 수 있음 (`EditorSendSelectionToAIAgentComponent.tsx`).
  - AI Agent가 선택부분에 국한하여 사용자의 수정 지시사항을 반영한 새로운 텍스트를 생성함.
  - 생성된 내용이 본문에 노란색 하이라이트된 텍스트와 승인/취소 위젯이 함께 보여져서 사용자로 하여금 수정된 사항을 본문으로 수용할 것인지 선택할 수 있도록 함 (`EditorAIEditedTextPreviewComponent.tsx`):
    - "승인" 버튼 (아이콘: `✔️`) (`EditorAcceptAIEditedTextButtonComponent.tsx`)
    - "취소" 버튼 (아이콘: `❌`) (`EditorCancelAIEditedTextButtonComponent.tsx`)
  - 수정된 내용이 승인되지 않은 상태에서 새로운 수정 지시를 하는 경우:
    - 기존 수정 내용을 기준으로 새로운 수정 적용
    - 이전 수정 이력을 컨텍스트로 포함하여 전달
    - 수정 요청 횟수 자동 증가 (예: "수정 #2")
  - 수정 이력 관리 (`EditorAIEditHistoryManagerComponent.tsx`):
    - 각 수정 단계별 변경 내용 저장
    - 수정 요청 시 입력한 지시사항 함께 저장
    - 수정 이력 타임라인 UI (`EditorAIEditHistoryTimelineComponent.tsx`):
      - 각 수정 단계를 타임라인으로 표시
      - 단계별 지시사항과 변경 내용 미리보기
      - 특정 버전으로 되돌리기 기능
    - 수정 진행 상태 표시 (`EditorAIEditProgressComponent.tsx`):
      - 현재 수정 중인 상태 표시 (예: "수정 진행 중...")
      - 이전 수정 이력 개수 표시
      - 수정 요청 시간 정보
- **선택부분 AI Agent에게 보내기**:
  - 선택부분을 AI Agent에게 보내고, 유저의 지시사항을 대기 (`EditorSendSelectionToAIAgentHandlerComponent.tsx`).
    - **Write 모드**: 프로젝트 데이터 및 선택한 텍스트를 참고하여 문서 수정 제안을 제공.
    - **Ask 모드**: 프로젝트 데이터 및 선택한 텍스트를 참고하여 사람의 질문에 답변을 하지만, 수정을 직접 하지는 않음.
- **선택부분에 대한 전거 삽입하기**:
  - 선택한 텍스트 내용을 뒷받침하는 각종 자료를 모달로 표시 (`EditorEvidenceSupportSelectionModalComponent.tsx`):
    - **증거자료 목록**:
      - 프로젝트 내 증거자료 중 선택 텍스트와 관련된 항목 표시 (예: "계약서.pdf", "통화 기록.mp3") (`EditorEvidenceSupportListComponent.tsx`).
      - 각 증거자료 항목 옆에 체크박스 제공 (`EditorEvidenceSupportCheckboxComponent.tsx`).
      - 마우스 호버 시 해당 증거자료 내용 미리보기 표시 (`EditorEvidenceSupportPreviewComponent.tsx`).
      - AI가 추천한 증거자료 항목 별도 표시 (아이콘: `🤖`) (`EditorAIRecommendedEvidenceSupportListComponent.tsx`).
    - **법령/판례 목록**: 상세 UI 구조는 `LawPrecedentModalUIDesign.md` 참조
    - **참고자료 목록**:
      - 프로젝트 내 참고자료 중 선택 텍스트와 관련된 항목 표시 (`EditorReferenceSupportListComponent.tsx`).
      - 각 참고자료 항목 옆에 체크박스 제공 (`EditorReferenceSupportCheckboxComponent.tsx`).
    - **판결문 목록**:
      - 프로젝트 내 판결문 중 선택 텍스트와 관련된 항목 표시 (`EditorJudgementSupportListComponent.tsx`).
      - 각 판결문 항목 옆에 체크박스 제공 (`EditorJudgementSupportCheckboxComponent.tsx`).
    - **주장서류 목록**:
      - 프로젝트 내 주장서류 중 선택 텍스트와 관련된 항목 표시 (`EditorClaimingDocumentSupportListComponent.tsx`).
      - 각 주장서류 항목 옆에 체크박스 제공 (`EditorClaimingDocumentSupportCheckboxComponent.tsx`).
    - **선택 및 삽입**:
      - 여러 항목 선택 가능 (모든 자료 유형 동시 선택 가능).
      - "삽입" 버튼 클릭 시 선택한 전거를 본문에 추가 (`EditorInsertSelectedSupportButtonComponent.tsx`).
- **선택부분에 대한 댓글 삽입하기**:
  - 선택한 텍스트 블록에 댓글을 삽입하기 위한 UI 추가 (`EditorCommentInsertionHandlerComponent.tsx`):
    - **댓글 입력 모달** (`EditorCommentInputModalComponent.tsx`):
      - 선택한 텍스트 표시 (`EditorSelectedTextDisplayComponent.tsx`).
      - 댓글 입력창 (placeholder: "댓글을 입력하세요...") (`EditorCommentInputFieldComponent.tsx`).
      - "댓글 추가" 버튼 (아이콘: `➡️`) (`EditorAddCommentActionButtonComponent.tsx`).
      - "취소" 버튼 (아이콘: `❌`) (`EditorCancelCommentActionButtonComponent.tsx`).
    - **댓글 표시**:
      - 선택한 텍스트 블록 옆에 말풍선 아이콘 표시 (아이콘: `💬`) (`EditorCommentIndicatorIconComponent.tsx`).
      - 말풍선 아이콘 클릭 시 댓글 목록 표시 (작성자, 작성 시간, 내용 포함) (`EditorCommentListDisplayComponent.tsx`).
      - 댓글 목록에서 각 댓글에 답글 추가 가능 (`EditorAddReplyToCommentButtonComponent.tsx`).
      - 댓글 삭제 기능 (작성자 또는 관리자만 가능) (`EditorDeleteCommentButtonComponent.tsx`).

- **동적 AI 필드 처리 로직**:
  - 문서 유형별 필드 메타데이터 관리 (`EditorDocumentFieldMetadataManagerComponent.tsx`):
    - AI API를 통해 문서 유형에 필요한 필드 정보 요청 및 수신 (`EditorDocumentFieldAIAnalysisAPIComponent.tsx`)
    - 필드 메타데이터 캐싱 및 업데이트 관리 (`EditorFieldMetadataCacheManagerComponent.tsx`)
    - 법률 분야별 특화 필드 추가 요청 처리 (`EditorLegalSpecificFieldRequestHandlerComponent.tsx`)
  - 동적 필드 렌더링 관리 (`EditorDynamicFieldRenderingManagerComponent.tsx`):
    - 필드 유형에 따른 적절한 UI 컴포넌트 선택 및 렌더링 (`EditorFieldTypeUIMapperComponent.tsx`)
    - 필드 간 종속성 관리 (예: 선택한 계약 유형에 따라 추가 필드 표시) (`EditorFieldDependencyHandlerComponent.tsx`)
    - 필드 값 변경 시 연관 필드 자동 업데이트 (`EditorRelatedFieldsUpdateHandlerComponent.tsx`)
  - 자동완성 데이터 관리 (`EditorAutocompletionDataManagerComponent.tsx`):
    - 사용자 이전 입력 데이터 기반 자동완성 제안 (`EditorUserHistoryBasedSuggestionComponent.tsx`)
    - AI 기반 컨텍스트 인식 자동완성 제안 (`EditorAIContextAwareSuggestionComponent.tsx`)
    - 법률 문서 유형별 특화 자동완성 데이터 제공 (`EditorLegalDocumentAutocompletionDataProviderComponent.tsx`)
  - 필드 입력 유효성 검증 (`EditorDynamicFieldValidationManagerComponent.tsx`):
    - 입력값 형식 검증 (날짜, 통화, 이메일 등) (`EditorFieldFormatValidatorComponent.tsx`)
    - 법률적 유효성 검증 (필수 조항, 법적 요건 충족 등) (`EditorLegalRequirementsValidatorComponent.tsx`)
    - 오류 및 경고 메시지 표시 (`EditorValidationFeedbackDisplayComponent.tsx`)

## 3. UI 디자인 가이드
- **색상 및 스타일**:
  - 에디터 배경: #FFFFFF (흰색).
  - 에디터 테두리: 1px solid #E0E0E0 (연한 회색).
  - 툴바 배경: #F8F9FA (밝은 회색).
  - 툴바 버튼 호버 효과: #E8EDF2 (연한 파란 회색).
  - 현재 선택된 텍스트 하이라이트: #E1F5FE (연한 파란색).
  - 에디터 내 링크 색상: #1976D2 (파란색).
  - 주석 하이라이트 배경: #FFF9C4 (연한 노란색).
  - 제목(H1): #2E3440 (진한 회색), 24px, 볼드.
  - 제목(H2): #2E3440 (진한 회색), 20px, 볼드.
  - 제목(H3): #2E3440 (진한 회색), 18px, 볼드.
  - 본문 텍스트: #2E3440 (진한 회색), 16px, 일반.
  - 인용문: #546E7A (회색), 16px, 이탤릭, 왼쪽 테두리 3px solid #E0E0E0.
  - 목록 형식: 16px, 좌측 여백 20px.
  - AI 문서 생성 진행 상태 바: #4CAF50 (녹색 그라데이션).
  - AI 생성 텍스트 임시 하이라이트: #E8F5E9 (연한 녹색), 5초 후 페이드 아웃.
  - 에러 메시지: #F44336 (빨간색), 14px.
  - 성공 메시지: #4CAF50 (녹색), 14px.
  - 안내 메시지: #2196F3 (파란색), 14px.

- **글꼴**:
  - 본문: Noto Sans KR, 16px.
  - 제목: Noto Sans KR, 18px-24px (헤딩 레벨에 따라 다름).
  - 인용문: Noto Sans KR, 16px, 이탤릭.
  - 코드 블록: Consolas, Monaco, 14px.
  - 법령/판례 인용: Noto Sans KR, 15px, 들여쓰기 10px.
  - 버튼 텍스트: Noto Sans KR, 14px.
  - 툴팁: Noto Sans KR, 12px.
  - AI 생성 알림: Noto Sans KR, 14px.

- **애니메이션 효과**:
  - 툴바 버튼 호버: 0.2초, ease-in-out.
  - 팝업/드롭다운 표시: 0.3초, fade-in.
  - 실시간 협업 커서 이동: 0.1초, ease.
  - 문서 저장 아이콘 회전: 0.5초, 360도 회전.
  - 에러/성공 메시지: 0.3초 fade-in, 5초 후 fade-out.
  - AI 문서 생성 진행 상태 애니메이션: 단계별 fade 전환 0.5초.
  - 변경 내용 하이라이트: 0.3초 노란색 배경, 2초 후 페이드 아웃.

- **레이아웃 및 간격**:
  - 에디터 본문: 패딩 20px, 최대 너비 800px (반응형), 마진 자동.
  - 툴바: 높이 40px, 아이콘 간 간격 5px, 그룹 간 간격 15px.
  - 제목 아래 여백: 15px.
  - 단락 간 여백: 10px.
  - 목록 항목 간 여백: 5px.
  - 에디터와 사이드바 사이 간격: 15px.
  - 문서 내 섹션 간 여백: 25px.
  - 법령/판례 인용 블록: 좌우 패딩 15px, 상하 패딩 10px, 테두리 1px solid #E0E0E0.
  - AI 명령어 입력 섹션: 높이 자동 조절, 최소 높이 60px, 최대 높이 150px.

테스트 라인입니다. 