# LegalEditor 파일뷰어탭 UI 화면 구조

## UI 트리구조
```
FileViewerTabViewComponent
├── FileLeftSidebarComponent
│   ├── FileSidebarHeaderComponent
│   │   ├── FileSidebarCollapseButtonComponent
│   │   └── FileSidebarViewModeSelectorComponent
│   │       ├── FileTreeViewModeComponent
│   │       └── FileListViewModeComponent
│   ├── FileSidebarToolbarComponent
│   │   ├── FileCreateFolderButtonComponent
│   │   ├── FileUploadFileButtonComponent
│   │   │   └── FileMultiFileUploadDropzoneComponent
│   │   ├── FileSortOptionsComponent
│   │   │   ├── FileSortByNameComponent
│   │   │   ├── FileSortByDateComponent
│   │   │   ├── FileSortByTypeComponent
│   │   │   └── FileSortBySizeComponent
│   │   └── FileViewOptionsComponent
│   │       ├── FileShowHiddenFilesToggleComponent
│   │       └── FileCompactViewToggleComponent
│   ├── FileExplorerComponent
│   │   ├── FileTreeComponent
│   │   │   ├── FileFolderNodeComponent
│   │   │   │   ├── FileFolderExpandButtonComponent
│   │   │   │   ├── FileFolderIconComponent
│   │   │   │   ├── FileFolderNameComponent
│   │   │   │   └── FileFolderContextMenuComponent
│   │   │   │       ├── FileCreateSubfolderOptionComponent
│   │   │   │       ├── FileRenameFolderOptionComponent
│   │   │   │       ├── FileMoveFolderOptionComponent
│   │   │   │       ├── FileCopyFolderOptionComponent
│   │   │   │       └── FileDeleteFolderOptionComponent
│   │   │   └── FileNodeComponent
│   │   │       ├── FileIconComponent
│   │   │       ├── FileNameComponent
│   │   │       ├── FileMetaInfoComponent
│   │   │       │   ├── FileSizeComponent
│   │   │       │   └── FileLastModifiedComponent
│   │   │       └── FileContextMenuComponent
│   │   │           ├── FileOpenFileOptionComponent
│   │   │           ├── FileRenameFileOptionComponent
│   │   │           ├── FileMoveFileOptionComponent
│   │   │           ├── FileCopyFileOptionComponent
│   │   │           ├── FileDeleteFileOptionComponent
│   │   │           └── FilePropertiesOptionComponent
│   │   └── FileListComponent
│   │       ├── FileGridComponent
│   │       └── FileTableComponent
│   ├── FileQuickAccessComponent
│   │   ├── FileRecentFilesComponent
│   │   ├── FileFavoriteFilesComponent
│   │   └── FileTaggedFilesComponent
│   ├── FileFilterComponent
│   │   ├── FileTypeFilterComponent
│   │   │   ├── FileDocumentTypeFilterComponent
│   │   │   ├── FileImageTypeFilterComponent
│   │   │   ├── FileAudioTypeFilterComponent
│   │   │   └── FileVideoTypeFilterComponent
│   │   ├── FileDateFilterComponent
│   │   └── FileTagFilterComponent
│   └── FileSearchComponent
│       ├── FileSearchInputComponent
│       ├── FileSearchResultsComponent
│       │   └── FileSearchResultItemComponent
│       └── FileAdvancedSearchComponent
│           ├── FileContentSearchComponent
│           ├── FileMetadataSearchComponent
├── FileViewerContentComponent
│   └── FileContentViewerComponent
│       ├── FilePDFViewerComponent
│       ├── FileDocxViewerComponent
│       ├── FilePptxViewerComponent
│       ├── FileXlsxViewerComponent
│       ├── FileAudioPlayerComponent
│       ├── FileVideoPlayerComponent
│       ├── FileHwpViewerComponent
│       └── FileImageViewerComponent
├── FileContentInteractionHandlerComponent
│   ├── FileTextSelectionComponent
│   ├── FileContentContextMenuComponent
│   │   ├── FileHighlightOnlyButtonComponent
│   │   ├── FileLinkToGoalOrClaimButtonComponent
│   │   ├── FileCreateFactFromSelectionButtonComponent
│   │   ├── FileSendSelectedFileToAIAgentButtonComponent
│   │   ├── FileAddCommentToSelectedFileButtonComponent
│   │   └── FilePasteToDocumentButtonComponent
├── FileCommentsDisplayComponent
│   ├── FileCommentIndicatorIconComponent
│   ├── FileCommentListDisplayComponent
│   └── FileSendCommentToAIAgentButtonComponent
├── FileBasedGoalClaimRecommendationComponent
│   ├── FileSuggestGoalOrClaimFromFileButtonComponent
│   └── FileGoalClaimRecommendationModalComponent
├── FileHighlightManagementComponent
│   ├── FileViewHighlightListButtonComponent
│   └── FileExportHighlightsButtonComponent
└── FileTagManagementComponent
    ├── FileCurrentTagsDisplayComponent
    ├── FileAddTagButtonComponent
    ├── FileAITagRecommendationButtonComponent
    └── FileManageTagsButtonComponent
```

## 1. 파일뷰어탭 개요
파일뷰어탭은 프로젝트 내 파일의 내용을 중심으로 표시하며, 사용자가 파일을 효과적으로 확인하고 관리할 수 있도록 설계됩니다. 파일 뷰어(예: PDF, docx, pptx, xlsx, MP3, MP4, hwp, 각종 이미지 파일의 뷰어)가 화면의 대부분을 차지하며, 상단에 검색 창이 간단히 표시되고 필요 시 드롭다운으로 확장됩니다. 사용자는 문서 내용을 보면서 댓글을 달거나 AI Agent와 상호작용하여 추가 작업(목표/주장 연결, 추천, 문서로 붙여넣기 등)을 수행할 수 있습니다. 특히, PDF, docx, pptx, xlsx, MP3, MP4, hwp, 각종 이미지 형식 등 주요 파일 형식을 지원하며, 수백 페이지에 달하는 대용량 파일의 내용을 효율적으로 검색하고 표시하는 기능을 제공합니다.

## 2. 컴포넌트별 세부 구조

### 2.1 파일뷰어 UI (`FileViewerTabViewComponent.tsx`)
파일뷰어탭 선택 시, 파일자료 뷰어가 화면의 중심에 표시되며, 상단에 검색 창과 필터링 옵션이 위치합니다. 사용자는 파일자료 내용을 보면서 댓글을 달거나 AI Agent와 상호작용할 수 있습니다.

- **중앙: 파일자료 뷰어** (`FileViewerContentComponent.tsx`):
- **파일자료 뷰어** (`FileContentViewerComponent.tsx`):
    - 화면의 대부분을 차지하며, 파일자료의 내용을 표시.
    - **PDF 뷰어**: react-pdf로 PDF 렌더링 (페이지 탐색, 확대/축소 지원) (`FilePDFViewerComponent.tsx`).
        - **성능 최적화**: 페이지별 지연 로드 (최대 5페이지씩 로드), 백그라운드에서 다음 페이지 미리 로드 (`FilePDFPagePreloadComponent.tsx`).
    - **docx 뷰어**: docx 파일을 HTML로 변환하여 표시 (예: `mammoth.js` 사용) (`FileDocxViewerComponent.tsx`):
        - 페이지별 렌더링으로 대용량 파일 지원 (`FileDocxPageLazyLoadComponent.tsx`).
        - 단락별 스크롤링 및 검색 결과 위치로 이동 (`FileDocxScrollToSearchResultComponent.tsx`).
        - **성능 최적화**: 대용량 docx 파일 분할 로드 (최대 50페이지씩), 캐싱으로 재로드 속도 향상 (`FileDocxChunkLoadComponent.tsx`).
    - **pptx 뷰어**: pptx 파일의 슬라이드를 이미지로 변환하여 표시 (예: `pptx2html` 사용) (`FilePptxViewerComponent.tsx`):
        - 슬라이드 썸네일 목록 표시 (`FilePptxSlideThumbnailListComponent.tsx`).
        - 슬라이드별 검색 결과 위치로 이동 (`FilePptxScrollToSearchResultComponent.tsx`).
        - **성능 최적화**: 슬라이드 이미지 지연 로드, 썸네일만 먼저 표시 (`FilePptxLazyImageLoadComponent.tsx`).
    - **xlsx 뷰어**: xlsx 파일의 시트를 테이블로 표시 (예: `SheetJS` 사용) (`FileXlsxViewerComponent.tsx`):
        - 시트별 탭 표시 (`FileXlsxSheetTabsComponent.tsx`).
        - 셀별 검색 결과 위치로 이동 (`FileXlsxScrollToSearchResultComponent.tsx`).
        - **성능 최적화**: 대용량 Excel 파일의 경우 시트별 지연 로드, 가상 스크롤링으로 메모리 사용량 최소화 (`FileXlsxVirtualScrollComponent.tsx`).
    - **MP3 파일**: 오디오 플레이어 표시 (`FileAudioPlayerComponent.tsx`).
        - **성능 최적화**: 스트리밍 재생 지원, 버퍼링 최소화 (`FileAudioStreamingComponent.tsx`).
    - **MP4 파일**: 비디오 플레이어 표시 (`FileVideoPlayerComponent.tsx`).
    - **hwp 파일**: hwp 파일을 HTML로 변환하여 표시 (예: `hwp2html` 사용) (`FileHwpViewerComponent.tsx`):
        - 페이지별 렌더링으로 대용량 파일 지원 (`FileHwpPageLazyLoadComponent.tsx`).
        - 단락별 스크롤링 및 검색 결과 위치로 이동 (`FileHwpScrollToSearchResultComponent.tsx`).
        - **성능 최적화**: 대용량 hwp 파일 분할 로드 (최대 50페이지씩), 캐싱으로 재로드 속도 향상 (`FileHwpChunkLoadComponent.tsx`).
    - **이미지 파일**: 이미지 뷰어 표시 (`FileImageViewerComponent.tsx`).
        - **성능 최적화**: 이미지 지연 로드, 저해상도 이미지 먼저 표시 후 고해상도 로드 (`FileImageLazyLoadComponent.tsx`).
    - **추천 근거 하이라이트** (`FileAIRecommendationHighlightComponent.tsx`):
      - 프로젝트 분석탭에서 AI가 추천한 근거자료의 관련 부분 자동 하이라이트 (라이트 그린 배경색) (`FileAIRecommendedPartHighlightComponent.tsx`).
      - 추천된 근거 부분 강조 표시를 위한 색상 관리 (별도의 하이라이트 색상 제공) (`FileAIRecommendationColorStyleComponent.tsx`).
      - 하이라이트된 부분에 마우스 오버 시 툴팁으로 관련 주장 정보 표시 (`FileRecommendationTooltipComponent.tsx`):
        - 툴팁 내 주장 제목, 관련도 점수, 추천 이유 표시 (`FileRecommendationTooltipContentComponent.tsx`).
        - "주장으로 이동" 버튼 (아이콘: `➡️`) (`FileNavigateToClaimButtonComponent.tsx`):
          - 클릭 시 프로젝트 분석탭의 해당 주장으로 이동.
      - 여러 주장에 관련된 동일 부분은 색상 농도를 더 진하게 표시 (`FileMultipleClaimHighlightComponent.tsx`).
      - 추천 근거 컨텍스트 사이드 패널 (`FileRecommendationContextPanelComponent.tsx`):
        - 현재 보고 있는 파일자료에 연결된 모든 주장 목록 표시 (`FileRelatedClaimsListComponent.tsx`).
        - 각 주장별 관련된 부분 통계 (예: "5개 관련 부분") (`FileClaimRelatedPartsCountComponent.tsx`).
        - 주장 선택 시 해당 주장과 관련된 부분만 하이라이트 필터링 (`FileFilterHighlightsByClaimComponent.tsx`).
        - 관련 부분 네비게이션 컨트롤 (예: "이전/다음 관련 부분") (`FileNavigateRelatedPartsControlComponent.tsx`).
      - "추천 근거 모두 보기" 버튼 (아이콘: `🔍`) (`FileViewAllRecommendedPartsButtonComponent.tsx`):
        - 클릭 시 모든 추천 근거 부분을 목록으로 표시 (`FileRecommendedPartsListComponent.tsx`):
          - 각 목록 항목에 페이지 번호, 관련 텍스트 일부, 관련 주장 표시 (`FileRecommendedPartListItemComponent.tsx`).
          - 항목 클릭 시 해당 위치로 자동 스크롤 및 하이라이트 포커스 (`FileScrollToRecommendedPartComponent.tsx`).
    - **텍스트 블록 선택 및 작업** (`FileContentInteractionHandlerComponent.tsx`):
      - 뷰어 내 텍스트 블록 선택 가능 (드래그로 선택) (`FileTextSelectionComponent.tsx`).
      - 선택한 텍스트 블록에 마우스 우클릭 시 팝업 메뉴 표시 (`FileContentContextMenuComponent.tsx`):
        - "하이라이트만 적용" 버튼 (`FileHighlightOnlyButtonComponent.tsx`):
          - 드롭다운 메뉴로 하이라이트 색상 선택 (노란색, 빨간색, 파란색, 초록색, 보라색) (`FileHighlightColorSelectorComponent.tsx`).
          - 선택 후 텍스트에 주석 없이 하이라이트만 적용 (`FileApplyHighlightOnlyComponent.tsx`).
        - "목표/주장에 연결" 버튼 (`FileLinkToGoalOrClaimButtonComponent.tsx`):
          - 클릭 시 목표/주장 연결 모달 표시 (`FileLinkFileToGoalOrClaimModalComponent.tsx`):
            - 목표 목록 표시 (드롭다운) (`FileGoalSelectionDropdownForLinkComponent.tsx`).
            - 주장 목록 표시 (드롭다운, 선택된 목표에 따라 필터링) (`FileClaimSelectionDropdownForLinkComponent.tsx`).
            - 선택한 텍스트 블록 표시 (`FileSelectedTextDisplayComponent.tsx`).
            - "연결" 버튼 (아이콘: `🔗`) (`FileLinkFileToGoalOrClaimButtonComponent.tsx`):
              - 선택한 목표/주장에 파일자료의 특정 부분 연결.
            - "취소" 버튼 (아이콘: `❌`) (`FileCancelLinkActionButtonComponent.tsx`).
        - "사실관계 생성" 버튼 (`FileCreateFactFromSelectionButtonComponent.tsx`):
          - 클릭 시 사실관계 생성 모달 표시 (`FileFactCreationModalComponent.tsx`):
            - 현재 선택된 파일자료 부분이 기본 선택됨 (`FileSelectedTextForFactComponent.tsx`)
            - 추가 파일자료 선택 옵션 (`FileSelectAdditionalFileComponent.tsx`)
            - 기존 개별사실관계 선택 옵션 (`FileSelectExistingIndividualFactsComponent.tsx`)
            - AI 생성 사실관계 미리보기 (요약/개별 사실관계) (`FileAIGeneratedFactPreviewComponent.tsx`)
            - 생성 유형 표시 (선택된 자료 개수에 따라 요약/개별 결정) (`FileFactTypeIndicatorComponent.tsx`)
            - 가치중립성 점수 표시 (`FileFactNeutralityScoreComponent.tsx`)
            - 사실관계 수동 편집 기능 (`FileFactManualEditComponent.tsx`)
            - 생성 확인 버튼 (`FileConfirmFactCreationButtonComponent.tsx`)
            - 취소 버튼 (`FileCancelFactCreationButtonComponent.tsx`)
        - "AI Agent로 보내기" 버튼 (`FileSendSelectedFileToAIAgentButtonComponent.tsx`):
          - 선택한 텍스트 블록을 AI Agent로 전송하여 추가 분석 요청.
        - "댓글 추가" 버튼 (`FileAddCommentToSelectedFileButtonComponent.tsx`):
          - 클릭 시 댓글 입력 모달 표시 (`FileCommentInputModalComponent.tsx`):
            - 선택한 텍스트 블록 표시 (`FileSelectedTextDisplayComponent.tsx`).
            - 댓글 입력창 (placeholder: "댓글을 입력하세요...") (`FileCommentInputFieldComponent.tsx`).
            - "댓글 추가" 버튼 (아이콘: `➡️`) (`FileAddCommentActionButtonComponent.tsx`).
            - "취소" 버튼 (아이콘: `❌`) (`FileCancelCommentActionButtonComponent.tsx`).
        - "작성 중인 문서로 붙여넣기" 버튼 (`FilePasteToDocumentButtonComponent.tsx`):
          - 클릭 시 작성 중인 문서 선택 모달 표시 (`FileSelectDocumentToPasteModalComponent.tsx`):
            - 현재 열린 문서 목록 표시 (드롭다운) (`FileOpenDocumentsDropdownComponent.tsx`).
            - 선택한 텍스트 블록 표시 (`FileSelectedTextDisplayComponent.tsx`).
            - "붙여넣기" 버튼 (아이콘: `📋`) (`FilePasteToDocumentActionButtonComponent.tsx`):
              - 선택한 문서의 현재 커서 위치에 텍스트 붙여넣기.
              - 붙여넣은 텍스트는 파일자료 출처 정보와 함께 삽입 (형식: `[인용: 파일제목, 페이지/위치]`) (`FilePasteWithCitationComponent.tsx`).
            - "취소" 버튼 (아이콘: `❌`) (`FileCancelPasteActionButtonComponent.tsx`).
  - **댓글 표시** (`FileCommentsDisplayComponent.tsx`):
    - 선택한 텍스트 블록 옆에 말풍선 아이콘 표시 (아이콘: `💬`) (`FileCommentIndicatorIconComponent.tsx`).
    - 말풍선 아이콘 클릭 시 댓글 목록 표시 (작성자, 작성 시간, 내용 포함) (`FileCommentListDisplayComponent.tsx`).
    - 댓글 목록에서 각 댓글에 답글 추가 가능 (`FileAddReplyToCommentButtonComponent.tsx`).
    - 댓글 삭제 기능 (작성자 또는 관리자만 가능) (`FileDeleteCommentButtonComponent.tsx`).
    - "댓글 AI Agent로 보내기" 버튼 (아이콘: `➡️`) (`FileSendCommentToAIAgentButtonComponent.tsx`):
      - 댓글 내용을 AI Agent로 전송하여 피드백 요청.
  - **파일자료 기반 목표/주장 추천** (`FileBasedGoalClaimRecommendationComponent.tsx`):
    - "AI로 목표/주장 추천" 버튼 (아이콘: `🤖`, 뷰어 하단에 표시) (`FileSuggestGoalOrClaimFromFileButtonComponent.tsx`):
      - 클릭 시 AI가 파일자료를 분석하여 새로운 목표/주장 추천 (`FileGoalClaimRecommendationModalComponent.tsx`):
        - 추천 목표 목록 (예: "손해배상금 5억원 추가 청구") (`FileRecommendedGoalsListComponent.tsx`).
        - 추천 주장 목록 (예: "피고의 계약 위반으로 인한 추가 손해 발생") (`FileRecommendedClaimsListComponent.tsx`).
        - 추천 근거 표시 (예: "파일자료: 계약서.pdf, 페이지 3") (`FileRecommendationReasonDisplayComponent.tsx`).
        - 추천 신뢰도 표시 (예: "신뢰도: 88%") (`FileRecommendationReliabilityScoreComponent.tsx`).
        - 각 항목 옆 "추가" 버튼 (아이콘: `✔️`) (`FileAddRecommendedGoalOrClaimButtonComponent.tsx`):
          - 클릭 시 선택한 목표/주장을 프로젝트 목표/주장 목록에 추가.
        - "AI Agent로 보내기" 버튼 (아이콘: `➡️`) (`FileSendRecommendationToAIAgentButtonComponent.tsx`):
          - 추천된 목표/주장을 AI Agent로 전송하여 추가 피드백 요청.

- **AI Agent 수정 반영**:
  - AI Agent가 파일자료 관련 수정 제안을 반환 시 (예: 태그 추천, 요약 수정), 기존 내용과 수정된 내용을 비교 표시 (`FileComparisonPreviewComponent.tsx`):
    - 기존 내용: 회색 텍스트로 표시 (`FileOriginalDataDisplayComponent.tsx`).
    - 수정된 내용: 노란색 하이라이트로 표시 (`FileRevisedDataDisplayComponent.tsx`).
    - "승인" 버튼 (아이콘: `✔️`) (`FileAcceptRevisionButtonComponent.tsx`).
    - "취소" 버튼 (아이콘: `❌`) (`FileCancelRevisionButtonComponent.tsx`).
  - AI Agent가 댓글 수정 제안을 반환 시, 기존 댓글과 수정된 댓글을 비교 표시 (`FileCommentComparisonPreviewComponent.tsx`):
    - 기존 댓글: 회색 텍스트로 표시 (`FileOriginalCommentDisplayComponent.tsx`).
    - 수정된 댓글: 노란색 하이라이트로 표시 (`FileRevisedCommentDisplayComponent.tsx`).
    - "승인" 버튼 (아이콘: `✔️`) (`FileAcceptCommentRevisionButtonComponent.tsx`).
    - "취소" 버튼 (아이콘: `❌`) (`FileCancelCommentRevisionButtonComponent.tsx`).

- **하이라이트 관리** (`FileHighlightManagementComponent.tsx`):
  - "하이라이트 목록 보기" 버튼 (아이콘: `🎨`) (`FileViewHighlightListButtonComponent.tsx`):
    - 클릭 시 하이라이트 목록 사이드 패널 표시 (`FileHighlightListSidePanelComponent.tsx`):
      - 하이라이트별 색상, 페이지 번호, 선택한 텍스트 미리보기 표시 (`FileHighlightListItemComponent.tsx`).
      - 하이라이트 항목 클릭 시 해당 위치로 자동 스크롤 (`FileScrollToHighlightComponent.tsx`).
      - 하이라이트 삭제 버튼 (아이콘: `🗑️`) (`FileDeleteHighlightButtonComponent.tsx`).
      - 하이라이트 색상 변경 버튼 (아이콘: `🎨`) (`FileChangeHighlightColorButtonComponent.tsx`):
        - 클릭 시 색상 선택 드롭다운 표시 (`FileHighlightColorOptionsDropdownComponent.tsx`).
  - "하이라이트 내보내기" 버튼 (아이콘: `📤`) (`FileExportHighlightsButtonComponent.tsx`):
    - 클릭 시 내보내기 형식 선택 모달 표시 (`FileExportHighlightsModalComponent.tsx`):
      - PDF 형식 (하이라이트가 적용된 PDF 복사본) (`FileExportHighlightsToPDFOptionComponent.tsx`).
      - 텍스트 문서 형식 (하이라이트된 텍스트만 추출) (`FileExportHighlightsToTextOptionComponent.tsx`).
      - 내보내기 실행 버튼 (아이콘: `✔️`) (`FileExecuteHighlightsExportButtonComponent.tsx`).

- **태그 관리** (`FileTagManagementComponent.tsx`):
  - 현재 보고 있는 파일자료의 태그 표시 영역 (상단 위치) (`FileCurrentTagsDisplayComponent.tsx`):
    - 태그 항목 (태그 이름, 삭제 버튼 포함) (`FileTagItemComponent.tsx`).
    - 각 태그별 색상 코드 표시 (`FileTagColorIndicatorComponent.tsx`).
    - AI 추천 태그는 별도 아이콘 표시 (아이콘: `🤖`) (`FileAIRecommendedTagIndicatorComponent.tsx`).
  - "태그 추가" 버튼 (아이콘: `+`) (`FileAddTagButtonComponent.tsx`):
    - 클릭 시 태그 추가 드롭다운 메뉴 표시 (`FileAddTagDropdownComponent.tsx`):
      - 기존 태그 목록 (프로젝트 내 모든 태그) (`FileExistingTagsListComponent.tsx`).
      - "새 태그 생성" 입력 필드 (placeholder: "새 태그 입력...") (`FileCreateNewTagInputComponent.tsx`).
      - 태그 색상 선택 옵션 (`FileTagColorPickerComponent.tsx`).
      - "추가" 버튼 (아이콘: `✔️`) (`FileConfirmAddTagButtonComponent.tsx`).
  - "AI 태그 추천" 버튼 (아이콘: `🤖`) (`FileAITagRecommendationButtonComponent.tsx`):
    - 클릭 시 AI가 문서 내용 분석 후 태그 추천 (`FileAITagSuggestionProcessComponent.tsx`).
    - 추천 태그 목록 표시 (체크박스로 선택 가능) (`FileAIRecommendedTagsListComponent.tsx`).
    - "선택 태그 적용" 버튼 (아이콘: `✔️`) (`FileApplySelectedAITagsButtonComponent.tsx`).
  - "태그 관리" 버튼 (아이콘: `⚙️`) (`FileManageTagsButtonComponent.tsx`):
    - 클릭 시 태그 관리 모달 표시 (`FileTagManagementModalComponent.tsx`):
      - 프로젝트 내 모든 태그 목록 (`FileProjectTagsListComponent.tsx`).
      - 태그별 사용 횟수 표시 (`FileTagUsageCountComponent.tsx`).
      - 태그 편집 기능 (이름, 색상) (`FileEditTagOptionsComponent.tsx`).
      - 태그 삭제 버튼 (아이콘: `🗑️`) (`FileDeleteTagButtonComponent.tsx`).
      - 태그 병합 기능 (`FileMergeTagsToolComponent.tsx`).

## 3. UI 디자인 가이드
- **색상**:
  - 파일자료 뷰어 배경: #FFFFFF (흰색 배경).
  - 검색 입력창: #F5F7FA (연한 회색 배경).
  - 검색 결과 드롭다운: #FFFFFF (흰색 배경, 얇은 회색 테두리).
  - 선택된 텍스트 블록: #E6F0FA (연한 파란색 하이라이트).
  - 검색 결과 하이라이트: #FFFF99 (노란색 하이라이트).
  - 댓글 말풍선 아이콘: #1E90FF (파란색).
  - 댓글 목록 배경: #F5F5F5 (연한 회색).
  - AI 수정 하이라이트: #FFFF99 (노란색 하이라이트).
  - 추천 항목: #E6F0FA (연한 파란색 배경).
  - 신뢰도 점수 (높음): #1E90FF (파란색), (낮음): #FF4D4F (빨간색).
  - 붙여넣기된 인용 텍스트: #F0F0F0 (회색 배경).
- **폰트**:
  - 본문 (문서 작성): 한글 바탕체, 12pt, 줄간격 180%.
  - UI 요소 (뷰어, 팝업, 댓글 등): Noto Sans KR, 16px.
  - 파일자료 요약: Noto Sans KR, 14px (Italic).
  - 댓글 텍스트: Noto Sans KR, 14px.
  - 비교 텍스트 (기존): Noto Sans KR, 14px (Gray).
  - 비교 텍스트 (수정): Noto Sans KR, 14px (Bold, Yellow Highlight).
  - 추천 근거 텍스트: Noto Sans KR, 14px (Italic).
  - 붙여넣기 인용 정보: Noto Sans KR, 12px (Gray).
- **아이콘**:
  - Material Icons 또는 FontAwesome 사용.
  - 버튼 아이콘 크기: 20px.
- **애니메이션**:
  - 검색 결과 드롭다운 표시/숨김 시 0.2초 애니메이션 (예: slide-down).
  - 댓글 목록 표시/숨김 시 0.2초 애니메이션 (예: slide-in).
  - AI Agent 수정 비교 표시 시 0.2초 fade-in 효과.
  - 목표/주장 추천 모달 표시 시 0.3초 fade-in 효과.

- **문서 내 검색 기능** (`FileInDocumentSearchComponent.tsx`):
  - 현재 열려있는 문서 내에서 특정 키워드 검색 가능 (`FileDocumentSearchInputComponent.tsx`):
    - 검색창 입력 시 실시간으로 문서 내 모든 일치 항목 하이라이트 (`FileSearchTermHighlighterComponent.tsx`).
    - 하이라이트된 검색 결과는 눈에 띄는 배경색으로 표시 (기본: 노란색) (`FileHighlightedSearchResultComponent.tsx`).
    - 현재 포커스된 검색 결과는 다른 색상(주황색)으로 강조 표시 (`FileCurrentSearchResultIndicatorComponent.tsx`).
  - 검색 결과 네비게이션 (`FileSearchResultNavigationComponent.tsx`):
    - 검색 결과 개수 표시 (예: "3/12 결과") (`FileSearchResultCounterComponent.tsx`).
    - "이전 결과" 버튼 (아이콘: `↑`) (`FilePreviousSearchResultButtonComponent.tsx`):
      - 클릭 시 이전 검색 결과로 자동 스크롤 및 포커스 이동.
    - "다음 결과" 버튼 (아이콘: `↓`) (`FileNextSearchResultButtonComponent.tsx`):
      - 클릭 시 다음 검색 결과로 자동 스크롤 및 포커스 이동.
  - 검색 옵션 설정 (`FileSearchOptionsComponent.tsx`):
    - "대소문자 구분" 체크박스 (`FileCaseSensitiveSearchOptionComponent.tsx`).
    - "전체 단어 일치" 체크박스 (`FileWholeWordSearchOptionComponent.tsx`).
    - "정규식 사용" 체크박스 (`FileRegexSearchOptionComponent.tsx`).
  - 검색 이력 관리 (`FileSearchHistoryComponent.tsx`):
    - 최근 검색어 드롭다운 표시 (`FileRecentSearchesDropdownComponent.tsx`).
    - 클릭 시 이전 검색어 자동 적용 (`FileApplyPreviousSearchTermComponent.tsx`).
  - 파일 간 검색 결과 연동 (`FileCrossFileSearchSyncComponent.tsx`):
    - 여러 탭에서 동일 검색어 적용 시, 각 파일별 검색 결과 통합 관리 (`FileMultiFileSearchResultsManagerComponent.tsx`).
    - 파일별 검색 결과 요약 표시 (예: "계약서.pdf: 12건, 이메일.pdf: 5건") (`FileSearchResultsByFileComponent.tsx`).
    - 파일 간 검색 결과 이동 버튼 (`FileNavigateToFileSearchResultsButtonComponent.tsx`).
  - 키보드 단축키 지원 (`FileSearchKeyboardShortcutsComponent.tsx`):
    - Ctrl+F: 검색창 포커스.
    - F3 / Enter: 다음 결과로 이동.
    - Shift+F3 / Shift+Enter: 이전 결과로 이동.
    - Esc: 검색 창 닫기.

- **파일자료 인용 시스템** (`FileCitationSystemComponent.tsx`):
  - **인용 방식**:
    - **직접 인용** (`FileDirectCitationMethodComponent.tsx`):
      - 파일자료 뷰어에서 "작성 중인 문서로 붙여넣기" 버튼 사용 시 (`FilePasteToDocumentButtonComponent.tsx`).
      - 텍스트 선택 후 문서에 직접 인용 (`FileDirectTextCitationComponent.tsx`).
    - **에디터 인용 단축키** (`FileEditorCitationShortcutComponent.tsx`):
      - 에디터에서 '@' 입력 시 팝업 메뉴 표시 (`FileAtMentionPopupMenuComponent.tsx`):
        - '파일자료 인용' 옵션 (`FileCitationOptionComponent.tsx`).
        - '법령 & 판례 인용' 옵션 (`FileLawCitationOptionComponent.tsx`).
        - '다음 내용 자동생성' 옵션 (`FileAIContentGenerationOptionComponent.tsx`).
      - '파일자료 인용' 선택 시 파일자료 검색/선택 모달 표시 (`FileSearchForCitationModalComponent.tsx`):
        - 파일자료 검색 필드 (`FileCitationSearchFieldComponent.tsx`).
        - 프로젝트 내 파일자료 목록 표시 (`FileListForCitationComponent.tsx`).
        - 최근 사용 파일자료 우선 표시 (`FileRecentlyUsedFileComponent.tsx`).
        - 파일자료 선택 시 상세 옵션 표시 (`FileSelectionOptionsComponent.tsx`):
          - '전체 인용' 옵션 (전체 파일 참조) (`FileFullCitationOptionComponent.tsx`).
          - '특정 부분 인용' 옵션 (페이지, 하이라이트, 주석 선택) (`FilePartialCitationOptionComponent.tsx`):
            - 해당 파일자료의 하이라이트 목록 표시 (`FileHighlightsForCitationListComponent.tsx`).
            - 해당 파일자료의 주석 목록 표시 (`FileCommentsForCitationListComponent.tsx`).
            - 페이지 번호 직접 입력 옵션 (`FilePageNumberInputComponent.tsx`).
          - '인용 삽입' 버튼 (아이콘: `✔️`) (`FileInsertCitationButtonComponent.tsx`):
            - 선택한 형식으로 인용 구문 생성 및 삽입 (`FileCitationFormatGeneratorComponent.tsx`).
            - 형식: `[인용: 파일명-p.페이지번호-하이라이트ID/주석ID]` (`FileCitationFormatComponent.tsx`).
  
  - **인용 표시 및 상호작용** (`FileCitationDisplayInteractionComponent.tsx`):
    - 인용된 텍스트는 특별한 스타일로 표시 (배경색, 아이콘 등) (`FileCitedTextStyleComponent.tsx`).
    - 인용 위에 마우스 hover 시 팝업 창으로 원본 내용 미리보기 표시 (`FileCitationHoverPreviewComponent.tsx`):
      - 원본 텍스트 컨텍스트 표시 (인용된 텍스트 주변 내용 포함) (`FileCitationContextPreviewComponent.tsx`).
      - 원본 파일명, 페이지 번호, 하이라이트/주석 ID 표시 (`FileCitationSourceInfoComponent.tsx`).
      - "원본으로 이동" 버튼 (아이콘: `🔍`) (`FileGoToOriginalSourceButtonComponent.tsx`):
        - 클릭 시 해당 파일자료의 인용된 부분으로 이동 (새 탭 또는 현재 탭) (`FileNavigateToSourceComponent.tsx`).
    - 인용 우클릭 시 컨텍스트 메뉴 표시 (`FileCitationContextMenuComponent.tsx`):
      - "인용 편집" 옵션 (`FileEditCitationOptionComponent.tsx`).
      - "인용 제거" 옵션 (`FileRemoveCitationOptionComponent.tsx`).
      - "원본으로 이동" 옵션 (`FileGoToSourceOptionComponent.tsx`).
  
  - **인용 관리** (`FileCitationManagementComponent.tsx`):
    - 문서 내 모든 인용 목록 표시 기능 (`FileListAllCitationsComponent.tsx`).
    - 인용 소스별 그룹화 및 필터링 (`FileCitationFilteringComponent.tsx`).
    - 인용 형식 일괄 변경 기능 (`FileBulkCitationFormatChangeComponent.tsx`).
    - 문서 내 인용-파일자료 연결 상태 확인 (`FileCitationLinkValidatorComponent.tsx`):
      - 깨진 인용 링크 감지 및 수정 제안 (`FileBrokenCitationLinkDetectorComponent.tsx`).

- **하단: 도구 모음** (`FileViewerToolbarComponent.tsx`):
  - **주요 도구 버튼** (`FileMainToolsComponent.tsx`):
    - "AI 분석 요청" 버튼 (아이콘: `🤖`) (`FileRequestAIAnalysisButtonComponent.tsx`):
      - 클릭 시 AI에게 현재 파일자료 분석 요청 모달 표시.
    - "하이라이트 관리" 버튼 (아이콘: `🎨`) (`FileManageHighlightsButtonComponent.tsx`):
      - 클릭 시 하이라이트 관리 패널 표시/숨김.
    - "태그 관리" 버튼 (아이콘: `🏷️`) (`FileManageTagsButtonComponent.tsx`):
      - 클릭 시 태그 관리 모달 표시.
    - "사실관계 생성" 버튼 (아이콘: `📝`) (`FileCreateFactButtonComponent.tsx`):
      - 클릭 시 사실관계 생성 모달 표시 (`FileGlobalFactCreationModalComponent.tsx`):
        - 파일자료 선택 섹션 (현재 보고 있는 파일자료 기본 선택) (`FileSelectMultipleFileComponent.tsx`)
        - 기존 개별사실관계 선택 섹션 (`FileSelectExistingFactsComponent.tsx`)
        - 선택된 파일자료의 특정 부분 지정 옵션 (`FileSpecificPartsSelectionComponent.tsx`)
        - AI 생성 사실관계 미리보기 (`FileAIFactPreviewComponent.tsx`)
        - 생성 유형 표시 및 편집 기능 (`FileFactTypeAndEditComponent.tsx`)
        - 생성 확인 버튼과 취소 버튼 (`FileFactCreationActionButtonsComponent.tsx`)
  - **화면 조정 도구** (`FileViewAdjustmentToolsComponent.tsx`):
    - 확대/축소 버튼 (아이콘: `+/-`) (`FileZoomControlsComponent.tsx`).
    - 페이지 맞춤 옵션 (아이콘: `↔️`) (`FilePageFitOptionComponent.tsx`).
    - 페이지 회전 버튼 (아이콘: `↻`) (`FileRotatePageButtonComponent.tsx`).
    - 전체 화면 토글 버튼 (아이콘: `⛶`) (`FileFullScreenToggleComponent.tsx`).
  - **내비게이션 도구** (`FileNavigationToolsComponent.tsx`):
    - 페이지 번호 입력 필드 (`FilePageNumberInputComponent.tsx`):
      - 직접 페이지 번호 입력 가능.
    - 이전/다음 페이지 버튼 (아이콘: `◀/▶`) (`FilePageNavigationButtonsComponent.tsx`).
    - 첫/마지막 페이지 버튼 (아이콘: `⏮/⏭`) (`FileFirstLastPageButtonsComponent.tsx`).
    - 페이지 섬네일 보기 토글 버튼 (아이콘: `◫`) (`FilePageThumbnailsToggleComponent.tsx`).

## 4. 성능 최적화 전략
- **대용량 파일 처리**:
  - 파일 분할 로드 (청크 단위로 로드).
  - 가상 스크롤링 적용 (메모리 사용량 최적화).
  - 이미지/미디어 파일 지연 로드.
  - 검색 결과 페이지네이션.

- **캐싱 전략**:
  - 파일 내용 캐싱 (최근 본 파일 우선).
  - 검색 결과 캐싱.
  - 하이라이트/주석 정보 캐싱.
  - 썸네일 이미지 캐싱.

- **UI 반응성**:
  - 비동기 작업 처리.
  - 작업 진행 상태 표시.
  - 백그라운드 데이터 프리로드.
  - 컴포넌트 지연 로딩.

## 5. 접근성 고려사항
- **키보드 내비게이션**:
  - 모든 기능 키보드로 접근 가능.
  - 단축키 지원.
  - 포커스 관리.

- **스크린 리더 지원**:
  - ARIA 레이블 적용.
  - 의미있는 HTML 구조.
  - 대체 텍스트 제공.

- **색상 대비**:
  - 고대비 모드 지원.
  - 색맹 사용자 고려.
  - 커스텀 테마 옵션.

## 6. 에러 처리
- **파일 로드 실패**:
  - 재시도 옵션 제공.
  - 오프라인 모드 지원.
  - 에러 메시지 표시.

- **검색 오류**:
  - 검색 결과 없음 안내.
  - 검색 제한 사항 안내.
  - 대체 검색 제안.

- **동기화 오류**:
  - 자동 복구 시도.
  - 수동 동기화 옵션.
  - 충돌 해결 UI.

## 7. 보안 고려사항
- **파일 접근 제어**:
  - 사용자 권한 확인.
  - 파일별 접근 권한.
  - 작업 로깅.

- **데이터 보호**:
  - 민감 정보 마스킹.
  - 암호화 적용.
  - 세션 관리.

## 8. 국제화/지역화
- **다국어 지원**:
  - UI 텍스트 번역.
  - 날짜/시간 형식.
  - 파일명 인코딩.

- **RTL 지원**:
  - 레이아웃 미러링.
  - 아이콘 방향 조정.
  - 텍스트 정렬.

## 9. 모바일 대응
- **반응형 레이아웃**:
  - 화면 크기 조정.
  - 터치 인터페이스.
  - 제스처 지원.

- **모바일 최적화**:
  - 데이터 사용량 최적화.
  - 오프라인 기능.
  - 배터리 효율성.

## 10. 테스트 계획
- **단위 테스트**:
  - 컴포넌트 테스트.
  - 유틸리티 함수 테스트.
  - 상태 관리 테스트.

- **통합 테스트**:
  - 파일 로드/저장.
  - 검색 기능.
  - 주석/하이라이트.

- **성능 테스트**:
  - 로드 시간 측정.
  - 메모리 사용량.
  - CPU 사용량.

- **사용성 테스트**:
  - 사용자 피드백.
  - A/B 테스트.
  - 접근성 검증.

## 11. 배포 전략
- **단계적 롤아웃**:
  - 베타 테스트.
  - 피드백 수집.
  - 점진적 기능 추가.

- **모니터링**:
  - 성능 메트릭.
  - 오류 추적.
  - 사용 통계.

- **유지보수**:
  - 버그 수정.
  - 성능 개선.
  - 기능 업데이트.

## 12. 문서화
- **개발자 문서**:
  - API 문서.
  - 컴포넌트 가이드.
  - 통합 가이드.

- **사용자 문서**:
  - 사용자 가이드.
  - FAQ.
  - 튜토리얼.

- **관리자 문서**:
  - 설정 가이드.
  - 문제 해결.
  - 백업/복구.

