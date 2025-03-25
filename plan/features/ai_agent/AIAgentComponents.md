# AI Agent 컴포넌트 구조

본 문서는 AI Agent의 컴포넌트 구조와 각 컴포넌트의 세부 기능을 정의합니다.

## 1. 컴포넌트 트리 구조

```
AIAgent/
├── Header/
│   ├── Mode Switch (Write/Ask)
│   └── Close Button (모바일 전용)
├── Input Section/
│   ├── Input Processor/
│   ├── DocumentWritingActions/
│   │   ├── NewDocumentButton
│   │   ├── ModifyDocumentButton
│   │   └── SuggestNextButton
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
│   │   │       ├── FactItem (사실)
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

## 2. 주요 컴포넌트 상세 설명

### 2.1 Header 컴포넌트
사용자 인터페이스의 최상단에 위치하며, AI Agent의 주요 모드 전환과 제어를 담당합니다.

#### Mode Switch
- **Write 모드**: 문서 작성 및 편집을 위한 AI 지원 인터페이스
- **Ask 모드**: 프로젝트 관련 질의응답을 위한 대화형 인터페이스
- **전환 애니메이션**: 부드러운 슬라이드 효과로 모드 전환을 시각화

#### Close Button (모바일 전용)
- 모바일 환경에서 전체 화면 모달을 닫기 위한 버튼
- 스와이프 제스처와 연동된 애니메이션 효과

### 2.2 Input Section 컴포넌트
사용자 입력을 처리하고 관리하는 핵심 섹션입니다.

#### Input Processor
문서 편집기와의 실시간 연동을 통해 다음 데이터를 처리합니다:

- **Document Editor Data**:
  - Selected Text: 현재 선택된 텍스트 영역 추적
  - Context: 선택 영역 주변의 문맥 정보 분석
  - PendingEdits: 승인 대기 중인 수정 사항 관리

- **프로젝트데이터(ProjectData)**:
  - 작성문서(EditingDocument): 유저가 이 앱에서 작성하였거나 작성 중인 문서
  - 프로젝트참고자료(ProjectReference):
    - 증거자료(Evidence): 사실관계를 뒷받침하는 자료들 (우리측/상대방)
    - 주장서류(ClaimingDocument): 우리측 및 상대측의 소장, 준비서면, 참고서면 등
    - 법령(Law): 현재 효력이 있는 강제규범으로서의 법률
    - 판례(Precedent): 법령의 해석 및 적용례로서의 선례
    - 참고자료(ConsiderableDocument): 법령이나 판례는 아니지만 참고할 만한 전거자료
    - 프로젝트최종결정문(ProjectFinalJudgement): 법원/검찰/행정기관 등의 종국적 판단

- **Goals & Claims Data**:
  - Project Goals: 프로젝트의 전략적 목표 정보 (금전/권리 획득, 방어, 협상, 유리한 결정 획득 등)
  - Legal Claims: 목표 달성을 위한 구체적인 법적 논점이나 입장
  - Facts: 증거자료와 주장서류에 의해 직접적으로 뒷받침되는 6하원칙 기반 사실관계

#### DocumentWritingActions
문서 작성을 위한 주요 액션 버튼들을 제공합니다:

- **NewDocumentButton (📝)**:
  - 새 문서 생성 마법사 실행
  - 템플릿 선택 인터페이스 제공
  - 자동 구조화 옵션 제공

- **ModifyDocumentButton (✏️)**:
  - 현재 문서의 수정 모드 활성화
  - 수정 이력 추적 시작
  - 실시간 변경 사항 하이라이트

- **SuggestNextButton (🤖)**:
  - AI 기반 다음 단계 제안
  - 컨텍스트 기반 추천
  - 관련 자료 자동 링크

#### EditHistory
문서 수정 이력을 관리하고 시각화하는 컴포넌트입니다:

- **EditHistoryManager**:
  - 버전 관리 및 복원 기능
  - 수정 지시사항 기록
  - 타임스탬프 기반 이력 관리

- **EditHistoryTimeline**:
  - 시각적 타임라인 표시
  - 버전 간 비교 기능
  - 특정 버전으로의 복원 기능

- **EditProgressTracker**:
  - 현재 진행 상태 표시
  - 수정 횟수 통계
  - 소요 시간 추적

#### MentionSystem
프로젝트 자료를 효율적으로 참조할 수 있는 멘션 시스템을 제공합니다:

- **MentionDropdown**:
  - ProjectReferenceSection (프로젝트참고자료):
    - EvidenceItem (증거자료): 사실관계를 뒷받침하는 자료들 (우리측/상대방 구분)
    - ClaimingDocumentItem (주장서류): 우리측 및 상대측의 소장, 준비서면, 참고서면 등
    - LawItem (법령): 현재 효력이 있는 강제규범으로서의 법률
    - PrecedentItem (판례): 법령의 해석 및 적용례로서의 선례
    - ConsiderableDocumentItem (참고자료): 법령이나 판례는 아니지만 참고할 만한 전거자료
    - ProjectFinalJudgementItem (프로젝트최종결정문): 법원/검찰/행정기관 등의 종국적 판단
    - DataPickerTrigger: 자료 직접 선택 인터페이스
  - Divider: 섹션 구분선
  - ProjectAnalysisSection (프로젝트분석):
    - GoalItem (목표): 금전/권리 획득, 방어, 협상, 유리한 결정 획득 등
    - ClaimItem (주장): 목표 달성을 위한 구체적인 법적 논점이나 입장
    - FactItem (사실): 증거자료와 주장서류에 의해 뒷받침되는 6하원칙 기반 사실관계
    - AnalysisPickerTrigger: 분석 항목 직접 선택 인터페이스

- **InlineChip**: 선택된 참조 항목의 시각적 표현
  - TypeIcon: 자료 유형별 구분 아이콘
  - ContentLabel: 참조 내용 레이블
  - RemoveButton: 참조 제거 버튼

### 2.3 Process Section 컴포넌트
AI의 처리 과정을 투명하게 보여주는 섹션입니다:

- **Data Summary**:
  - 입력 데이터 요약 표시
  - 관련 컨텍스트 정보 표시

- **Analysis Steps**:
  - 단계별 진행 상황 표시
  - 세부 분석 내용 확인

- **Processing Display**:
  - 현재 수행 중인 작업 표시
  - 진행률 시각화

### 2.4 Output Section 컴포넌트
AI의 처리 결과를 표시하고 관리하는 섹션입니다:

- **Results Display**:
  - 추천 사항 표시
  - 질의응답 결과
  - 제안된 수정사항

- **Action Buttons**:
  - 변경사항 적용
  - 클립보드로 복사
  - 프로젝트에 저장

### 2.5 Footer 컴포넌트
오류 처리와 피드백 수집을 담당하는 하단부 컴포넌트입니다:

- **Error Display**:
  - 오류 메시지 표시
  - 재시도 옵션 제공

- **Feedback Section**:
  - 사용자 평가 수집
  - 코멘트 입력
  - 제출 기능

## 3. 컴포넌트 간 상호작용

### 3.1 데이터 흐름
- Input Section → Process Section → Output Section으로의 단방향 데이터 흐름
- 각 섹션 간 상태 공유를 위한 중앙 상태 관리
- 실시간 업데이트를 위한 이벤트 시스템

### 3.2 상태 관리
- 전역 상태: 현재 모드, 처리 상태, 오류 상태
- 로컬 상태: 각 컴포넌트의 UI 상태
- 캐시 관리: 편집 이력, 멘션 데이터

### 3.3 이벤트 처리
- 사용자 입력 이벤트
- AI 처리 상태 변경 이벤트
- 오류 및 복구 이벤트
