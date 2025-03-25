# AI Agent 시스템 설계

## 1. 시스템 아키텍처

### 1.1 기본 구조
```
AIAgentSystem/
├── Orchestrator/
│   ├── AgentManager
│   │   ├── AgentPool
│   │   └── AgentSelector
│   ├── ContextManager
│   │   ├── ProjectContext
│   │   ├── UserContext
│   │   └── SharedContext (에이전트 간 공유 컨텍스트 캐싱)
│   └── WorkflowManager
│       ├── TaskPlanner
│       ├── TaskExecutor
│       ├── PriorityEngine (작업 우선순위 동적 결정)
│       └── DependencyTracker (에이전트 간 의존성 관리)
├── Agents/
│   ├── DocumentWriter/
│   │   ├── DraftGenerator
│   │   └── RevisionProposer
│   ├── OpponentAnalyzer/ (상대방 입장 분석)
│   │   ├── RiskAssessor
│   │   └── CounterArgumentGenerator
│   ├── SelfAnalyzer/ (내 입장 분석)
│   │   ├── PositionStrengthener (내 주장 강화)
│   │   └── WeaknessIdentifier (내 입장의 약점 분석)
│   ├── EvidenceAnalyzer/
│   │   ├── EvidenceLinker
│   │   └── EvidenceRecommender
│   ├── LegalResearcher/
│   │   ├── LawMatcher
│   │   └── PrecedentFinder
│   └── ValidationAgent/ (결과 검증)
│       ├── ConsistencyChecker
│       └── LegalAccuracyVerifier
├── Knowledge/
│   ├── VectorStore (Qdrant)/
│   │   ├── LawEmbeddings
│   │   ├── PrecedentEmbeddings
│   │   ├── EvidenceEmbeddings
│   │   ├── HybridSearch (키워드+벡터 검색)
│   │   └── IncrementalUpdater (최신 데이터 반영)
│   └── RelationalDB (Supabase)/
│       ├── ProjectData
│       ├── UserData
│       ├── DocumentCommentData
│       └── EvidenceAnnotationData (태그 추가)
│       
```

### 1.2 Microsoft AI Auto Gen 통합
- Semantic Kernel 기반 에이전트 구현
- GroupChatManager를 통한 에이전트 간 협업 관리
- 플러그인 시스템을 통한 기능 확장
- 분산 실행을 통한 성능 최적화

## 2. 주요 컴포넌트

### 2.1 Orchestrator
- **AgentManager**: 
  - 에이전트 생성, 관리, 선택
  - AutoGen GroupChatManager 통합
  - 에이전트 동적 로드/언로드
- **ContextManager**: 
  - 프로젝트/사용자 컨텍스트 관리
  - SharedContext를 통한 중복 조회 방지
  - 민감 데이터 암호화 및 로컬 캐싱
- **WorkflowManager**: 
  - PriorityEngine을 통한 작업 우선순위 동적 결정
  - DependencyTracker로 에이전트 간 의존성 관리
  - 순차/병렬 실행 최적화

### 2.2 Agents
- **DocumentWriter**: 문서 작성 및 수정 제안
- **OpponentAnalyzer**: 상대방 주장의 약점 분석 및 반론 생성
- **SelfAnalyzer**: 내 입장 강화 및 약점 보완 전략 수립
- **EvidenceAnalyzer**: 증거의 사실적 연관성과 신뢰도 평가
- **LegalResearcher**: 법령/판례의 법적 해석과 적용
- **ValidationAgent**: 생성된 문서/분석 결과의 정확성 검증

### 2.3 Knowledge Base
- **Qdrant Vector Store**: 
  - 의미론적 검색을 위한 임베딩 저장
  - HybridSearch로 키워드+벡터 검색 결합
  - IncrementalUpdater로 최신 데이터 반영
- **Supabase DB**: 
  - 구조화된 데이터 저장 및 관리
  - MetadataEnrichment로 태그 기반 검색 지원
  - AuditTrail로 작업 이력 추적

## 3. 작동 방식

### 3.1 기본 워크플로우
1. 사용자 요청 접수 (UI 또는 자동 트리거)
2. Orchestrator의 PriorityEngine이 작업 우선순위 결정
3. DependencyTracker를 통한 에이전트 실행 순서 최적화
4. SharedContext를 통한 효율적인 데이터 공유
5. ValidationAgent의 검증을 거친 결과 제공
6. AuditTrail에 작업 이력 기록

### 3.2 RAG (Retrieval Augmented Generation) 프로세스
1. HybridSearch를 통한 관련 데이터 검색
   - 키워드 + 벡터 검색 결합
   - 법률 용어 동의어/유사어 처리
2. 구조화된 데이터 조회 및 메타데이터 활용
3. Iterative Refinement를 통한 점진적 개선
4. ValidationAgent를 통한 결과 검증

## 4. 확장된 활용 시나리오

### 4.1 자동 문서 개선
- 실시간 문법/맞춤법 검사
- 법률 용어 자동 교정
- 문체 일관성 유지
- 참조 법령/판례 자동 링크
- 윤리적 가이드라인 준수

### 4.2 능동적 추천
- 연관 증거자료 실시간 추천
- 관련 법령/판례 자동 제안
- 리스크 포인트 사전 경고
- 문서 구조 개선 제안
- Quick Reference 인라인 팝업

### 4.3 협업 지원
- 다중 사용자 편집 조율
- 변경 사항 자동 동기화
- 충돌 해결 지원
- 작업 진행 상황 추적
- Multi-Document 비교 기능

## 5. UI 통합 전략

### 5.1 우측 사이드바 AI Agent UI (`AIAgentInteractionPanelComponent.tsx`)
- **입력 처리** (`AIAgentInputProcessorComponent.tsx`):
  - 문서 데이터 (유저가 선택한 텍스트 포함) (`DocumentInputProcessorComponent.tsx`)
  - 증거자료 데이터 (`EvidenceInputProcessorComponent.tsx`)
  - 목표/주장 데이터 (`GoalsClaimsInputProcessorComponent.tsx`)
- **모드 전환** (`AIAgentModeSwitchComponent.tsx`):
  - Write 모드: 프로젝트 데이터 및 유저가 선택한 사항들을 참고하여 문서 수정 제안, 프로젝트분석내역 수정 제안, 증거자료에 대한 댓글 생성/수정 제안을 제공 (`AIAgentWriteModeComponent.tsx`)
  - Ask 모드: 프로젝트 데이터 및 유저가 선택한 사항들을 참고하여 사람의 질문에 답변을 하지만, 수정을 직접 하지는 않음 (`AIAgentAskModeComponent.tsx`)
- **분석 및 처리 과정 표시** (`AIAgentProcessDisplayComponent.tsx`):
  - 입력 데이터 요약 (`InputDataSummaryDisplayComponent.tsx`)
  - 분석 단계 시각화 (`AnalysisStepsDisplayComponent.tsx`)
  - 처리 과정 표시 (`ProcessingStepsDisplayComponent.tsx`)
  - 결과 출력 및 적용 (`ResultOutputDisplayComponent.tsx`)
- **오류 처리 및 피드백**:
  - 오류 알림 및 재시도 (`AIAgentErrorNotificationComponent.tsx`)
  - 피드백 수집 및 모델 개선 (`AIAgentFeedbackCollectionComponent.tsx`)
- **탭별 특화 동작**:
  - 문서작성탭: 문서 편집 관련 AI 지원 (`DocumentEditorAIAgentHandlerComponent.tsx`)
  - 프로젝트분석탭: 목표/주장 분석 및 경고 (`ProjectAnalysisAIAgentHandlerComponent.tsx`)
  - 증거뷰어탭: 증거자료 검색 및 주석 지원 (`EvidenceViewerAIAgentHandlerComponent.tsx`)
  - 채팅탭: 협업 컨텍스트 제공 (`ChatAIAgentHandlerComponent.tsx`)

### 5.2 인라인 통합
- 편집기 내 실시간 제안
- Quick Reference 팝업
- 컨텍스트 메뉴 통합
- 인라인 코멘트/제안
- 자동 완성 지원

### 5.3 모달/팝업 통합
- 상세 분석 결과 표시
- 대안 제시 및 선택
- 리스크 경고
- 작업 확인 및 승인
- 민감 정보 처리 확인

## 6. 결론 및 권장사항

### 6.1 장점
- **유연한 확장성**: AutoGen 플러그인 시스템 활용
- **일관된 사용자 경험**: 통합된 UI/UX
- **효율적인 리소스 관리**: SharedContext 활용
- **강력한 컨텍스트 관리**: 중앙화된 상태 관리
- **데이터 보안**: 민감 정보 보호 체계


### 6.2 구현 우선순위
1. 기본 에이전트 구조 및 AutoGen 통합
2. RAG 시스템 및 HybridSearch 구현
3. SharedContext 및 ValidationAgent 구현
4. UI 컴포넌트 및 피드백 시스템 구축
5. 고급 기능 및 최적화
