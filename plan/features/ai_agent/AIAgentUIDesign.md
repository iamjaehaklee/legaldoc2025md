# AI Agent UI 설계

본 문서는 AI Agent의 UI 설계에 대한 개요를 제공합니다. 세부 내용은 다음 문서들에서 정의됩니다:

- [요구사항 정의](AIAgentRequirement.md): AI Agent의 기능적 요구사항과 반응형 요구사항을 정의합니다.
- [스타일 가이드](AIAgentStyle.md): UI/UX 디자인 원칙과 스타일 가이드를 정의합니다.
- [컴포넌트 구조](AIAgentComponents.md): UI 컴포넌트의 구조와 상호작용을 정의합니다.

각 문서의 세부 내용은 해당 문서를 참조하시기 바랍니다.

# AI Agent UI 공통 사항

## 1. 위치 및 기본 구조
- 화면 우측 Sidebar에 위치 (`ProjectRightSidebarComponent.tsx`)
- 모바일 환경에서는 하단 플로팅 버튼(🤖)으로 표시되며, 클릭 시 전체 화면 모달로 표시

## 2. 컴포넌트 구조

```
AIAgent/
├── Header/
│   ├── Mode Switch (Write/Ask)
│   └── Close Button (모바일 전용)
├── Input Section/
│   ├── Input Processor/
│   │   ├── Document Editor Data
│   │   │   ├── Selected Text
│   │   │   ├── Context
│   │   │   └── PendingEdits (미승인 수정사항)
│   │   ├── 프로젝트데이터(ProjectData)
│   │   │   ├── Selected ProjectData
│   │   │   └── Annotations
│   │   └── Goals & Claims Data
│   │       ├── Project Goals
│   │       └── Legal Claims
│   ├── DocumentWritingActions/
│   │   ├── NewDocumentButton (📝)
│   │   ├── ModifyDocumentButton (✏️)
│   │   └── SuggestNextButton (🤖)
│   ├── EditHistory/
│   │   ├── EditHistoryManager
│   │   │   ├── EditVersions
│   │   │   ├── EditInstructions
│   │   │   └── EditTimestamps
│   │   ├── EditHistoryTimeline
│   │   │   ├── TimelineDisplay
│   │   │   ├── VersionComparison
│   │   │   └── VersionRestoration
│   │   └── EditProgressTracker
│   │       ├── CurrentEditStatus
│   │       ├── EditCountDisplay
│   │       └── TimingInformation
│   ├── MentionSystem/
│   │   ├── MentionDropdown
│   │   │   ├── ProjectReferenceSection
│   │   │   │   ├── EvidenceItem (증거자료)
│   │   │   │   ├── ClaimingDocumentItem (주장서류)
│   │   │   │   ├── LawItem (법령)
│   │   │   │   ├── PrecedentItem (판례)
│   │   │   │   ├── ConsiderableDocumentItem (참고자료)
│   │   │   │   ├── ProjectFinalJudgementItem (프로젝트최종결정문)
│   │   │   │   └── DataPickerTrigger
│   │   │   ├── Divider
│   │   │   └── ProjectAnalysisSection
│   │   │       ├── GoalItem (목표)
│   │   │       ├── ClaimItem (주장)
│   │   │       └── AnalysisPickerTrigger
│   │   └── InlineChip
│   │       ├── TypeIcon
│   │       ├── ContentLabel
│   │       └── RemoveButton
│   └── Context Display
│       └── Current Tab Info
├── Process Section/
│   ├── Data Summary/
│   │   ├── Input Overview
│   │   └── Context Overview
│   ├── Analysis Steps/
│   │   ├── Step Progress
│   │   └── Step Details
│   └── Processing Display/
│       ├── Current Action
│       └── Progress Indicator
├── Output Section/
│   ├── Results Display/
│   │   ├── Recommendations
│   │   ├── Answers
│   │   └── Suggestions
│   └── Action Buttons/
│       ├── Apply Changes
│       ├── Copy to Clipboard
│       └── Save to Project
└── Footer/
    ├── Error Display/
    │   ├── Error Message
    │   └── Retry Button
    └── Feedback Section/
        ├── Rating
        ├── Comment Input
        └── Submit Button
```

## 3. 핵심 컴포넌트
### 3.1 AI Agent 패널 (`AIAgentInteractionPanelComponent.tsx`)
- **입력 처리기** (`AIAgentInputProcessorComponent.tsx`)
  - 문서 데이터 처리:
    - 선택된 텍스트 처리
    - 미승인 수정사항 처리 (이전 수정 내용을 기준으로 새 수정 적용)
    - 컨텍스트 분석
  - 증거자료 데이터 처리
  - 목표/주장 데이터 처리
  - 수정 이력 처리:
    - 수정 단계 추적 (승인 여부와 무관하게 모든 수정 이력 저장)
    - 수정 지시사항 기록
    - 수정 버전 관리
    - 타임라인 기반 이력 표시

- **모드 전환기** (`AIAgentModeSwitchComponent.tsx`)
  - Write 모드: 
    - 프로젝트 데이터 기반 수정 제안
    - 미승인 상태의 수정 내용에 대한 추가 수정 지원
    - 수정 이력 관리 및 복원
  - Ask 모드: 프로젝트 데이터 기반 질의응답

- **분석/처리 과정 표시** (`AIAgentProcessDisplayComponent.tsx`)
  - 입력 데이터 요약 표시
  - 단계별 분석 과정 표시
  - 수정 진행 상태 표시:
    - 현재 수정 단계 표시
    - 이전 수정 이력 참조 상태
    - 수정 요청 횟수 표시
  - 최종 결과 표시 및 적용 옵션

### 3.2 오류 및 피드백 처리
- 오류 발생 시 알림 표시 및 재시도 옵션
- 사용자 피드백 수집 및 AI 모델 개선을 위한 인터페이스

## 4. UI/UX 디자인
본 컴포넌트의 UI/UX는 [GlobalUIDesign.md](../../ui_structure/GlobalUIDesign.md)에서 정의된 공통 디자인 시스템을 따릅니다.

### 4.1 특화 요소
- AI Agent 관련 특수 아이콘 및 애니메이션만 여기에 정의
- 기타 모든 디자인 요소는 공통 디자인 시스템을 따름

## 5. 반응형 디자인
### 5.1 데스크톱
- 우측 Sidebar 내 고정 위치
- 전체 높이 스크롤 가능

### 5.2 모바일
- 하단 플로팅 버튼으로 최소화
- 전체 화면 모달로 확장
- 터치 인터랙션 최적화

## 6. 탭별 특화 기능
각 탭(문서작성/프로젝트분석/증거뷰어/채팅)에서 동일한 AI Agent 컴포넌트를 사용하되, 탭의 컨텍스트에 맞는 기능 제공:

### 6.1 문서작성탭 특화 기능
DocumentWritingActions 컴포넌트를 통해 다음 기능들을 제공합니다:

- **새 문서 생성** (NewDocumentButton):
  - 버튼 UI: 📝 아이콘과 "새 문서 생성" 텍스트
  - 기능: 프로젝트 맥락 기반 문서 자동 생성
  - 클릭 시 입력 프로세서 동작:
    - 문서 유형 선택 프롬프트 표시 (AI 추천 목록 포함)
    - 문서 요지 입력 요청
    - 관련 주장/증거 선택 인터페이스 활성화
    - 문서 스타일 및 자동 인용 설정 옵션 제공
  - 처리 단계:
    - 프로젝트 데이터 분석
    - 문서 구조 설계
    - 내용 생성
    - 자동 인용 처리
  - 출력:
    - 생성된 문서 미리보기
    - 인용된 자료 목록
    - 수정 제안 사항

- **문서 수정 지시** (ModifyDocumentButton):
  - 버튼 UI: ✏️ 아이콘과 "문서 수정 지시" 텍스트
  - 기능: 자연어로 문서 수정 명령 입력
  - 입력 프로세서 프롬프트 예시:
    - "최근 판례를 반영한 강력한 손해배상 조항 추가"
    - "개인정보보호법에 맞게 조항 보완"
    - "중재 조항 추가 및 강화"
    - "쉬운 용어로 재작성"
    - "법적 허점 최소화 및 보완"

- **다음 내용 제안** (SuggestNextButton):
  - 버튼 UI: 🤖 아이콘과 "다음 내용 제안" 텍스트
  - 기능: 현재 문서 내용과 프로젝트 맥락을 고려한 후속 내용 제안
  - 입력 프로세서 처리:
    - 현재까지의 문서 내용 분석
    - 프로젝트 분석 내용 참조
    - 관련 증거자료 검토
  - 출력:
    - 제안된 다음 내용
    - 관련 참고자료 추천

각 버튼은 Input Processor의 컨텍스트를 해당 기능에 맞게 설정하여, 기존 입력창을 통해 사용자와 상호작용합니다.

### 6.2 프로젝트분석탭 특화 기능
- 목표/주장 분석 AI 지원

## 7. 멘션 시스템 (@mention)
### 7.1 기본 구조
- 입력창에서 '@' 키 입력 시 활성화
- 드롭다운 메뉴로 프로젝트참고자료 및 프로젝트분석 항목 선택 가능
- 선택된 항목은 인라인 Chip으로 표시

### 7.2 드롭다운 메뉴 구성
#### 프로젝트참고자료(ProjectReference) 섹션
- 증거자료(Evidence): 사실관계를 뒷받침하는 자료
- 주장서류(ClaimingDocument): 우리측 및 상대측 주장 서면
- 법령(Law): 현재 효력이 있는 강제규범
- 판례(Precedent): 법령의 해석 및 적용례
- 참고자료(ConsiderableDocument): 사건 참고용 전거자료
- 프로젝트최종결정문(ProjectFinalJudgement): 종국적 판단
- 자료 직접 선택하기 (DataPickerModal 연동)

#### 프로젝트분석(ProjectAnalysis) 섹션
- 목표(Goal): 프로젝트의 궁극적 달성 목표
- 주장(Claim): 목표 달성을 위한 법적 입장
- 사실(Fact): 자료로부터 확인되는 사실
- 목표/주장/사실 직접 선택하기 (AnalysisItemPickerModal 연동)

### 7.3 인라인 Chip 디자인
- 배경색: #F3F4F6
- 테두리: 1px solid #E5E7EB
- 테두리 반경: 4px
- 패딩: 4px 8px
- 자료 타입별 아이콘 포함
- 호버 시 전체 정보 툴팁
- 클릭 시 원본 자료로 이동

### 7.4 상호작용
#### 키보드 네비게이션
- '@' 키로 드롭다운 활성화
- 위/아래 방향키로 항목 이동
- Enter로 항목 선택
- Tab/Shift+Tab으로 항목 간 이동
- ESC로 드롭다운 닫기

#### 자동완성
- '@' 이후 텍스트 입력 시 실시간 필터링
- 대소문자 구분 없는 검색
- 부분 일치 검색 지원
- 검색어 하이라이트 표시

#### 인용 관리
- 다중 인용 Chip 지원
- 드래그 앤 드롭으로 순서 변경
- Backspace로 Chip 삭제
- 최대 인용 개수 제한 설정

### 7.5 접근성
- ARIA 레이블 및 역할 정의
- 키보드 포커스 관리
- 스크린 리더 호환
- 고대비 모드 지원

### 7.6 모달 연동
- DataPickerModal과 통합
- AnalysisItemPickerModal과 통합
- 모달 선택 결과 자동 Chip 변환
