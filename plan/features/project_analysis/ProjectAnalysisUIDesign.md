# LegalEditor 프로젝트분석탭 UI 화면 구조

## 1. 프로젝트분석탭 개요
프로젝트분석탭은 법률 프로젝트의 전략적 분석을 지원하며, '우리측 입장 분석', '상대방측 입장 분석', '중립적 분석'이라는 세 가지 서브탭으로 구성됩니다. 사용자는 이 탭에서 데이터 기반의 전략을 수립하고, 쟁점을 명확히 설정하며, 관련 자료로 이를 뒷받침할 수 있습니다. 각 섹션은 AI Agent와 상호작용하여 실시간 수정 및 피드백을 받을 수 있도록 설계됩니다.

### 1.1 목표와 주장의 정의
- **목표(Goal)**: 법률 업무에서 목표는 다음 중 하나를 의미합니다:
  1. 상대방으로부터 금전, 부동산 인도, 물건 명도, 권리 이전 등 구체적인 것을 얻어내는 것
  2. 상대방의 금전, 인도, 권리 이전 등 소송상의, 소송외의 청구에 대해 방어하는 것
  3. 상대방과 협상하여 유리한 조건의 계약/합의 체결을 달성하는 것
  4. 법원/검찰/경찰/행정청/과세당국/중재원 등 법적판단기관으로부터 유리한 결정을 받는 것
  5. 예상치 못한 과다한 조세 부과를 당하거나, 세무조사를 당하는 것을 예방하는 것
  6. 장래에 불특정인으로부터 소송, 고소, 청구, 언론폭로 등을 당하거나, 수사기관/행정청/과세당국 등으로부터 조사를 당할 리스크를 예방하는 것
  
  목표는 서로 중복되면 안 되며, 다른 목표들과 목적/수단 관계에 있어서도 안 됩니다. 목표는 궁극적으로 이루고자 하는 최종 결과물입니다.

- **주장(Claim)**: 주장은 목표를 달성하기 위한 구체적인 법적 논점이나 입장입니다. 각 주장은 하나 이상의 목표를 지원하며, 사실(Fact)과 프로젝트참고자료(ProjectReference) 중 법령, 판례, 프로젝트최종결정문, 참고자료에 의해 뒷받침되어야 합니다. 예를 들어, 손해배상금을 받는 것이 목표라면, "상대방의 계약 위반으로 손해가 발생했다"와 같은 내용이 주장이 됩니다.

- **사실(Fact)**: 사실은 프로젝트참고자료(ProjectReference) 중 증거자료, 주장서류에 의해 직접적으로 뒷받침되는, 6하원칙(가급적 달성하고자 하며, 주어, 일시, 목적어, 술어는 가급적 포함)에 따른 추출내용입니다. 사실은 계층적 구조를 가질 수 있으며, 포괄적/추상적/모호한 사실은 보다 구체적이고 세분화된 하위 사실들로 구성될 수 있습니다. 예를 들어, "을순이는 계약을 위반했다"라는 포괄적 사실은 "을순이는 2024. 4. 1. 16:23 부동산매매계약 잔금 100만원을 입금받았다", "을순이는 2024. 4. 1. 계약에서 정한 잔금지급기한을 준수하지 않았다" 등의 구체적인 하위 사실들로 세분화될 수 있습니다.


### 1.2 목표-주장-사실 관계 구조 및 시각화
- **계층적 관계**: 목표, 주장, 사실은 다음과 같은 계층적 관계를 가집니다:
  ```
  목표(Goal)
  └── 주장(Claim)
      ├── 사실(Fact, Level 1)
      │   ├── 하위사실(SubFact, Level 2)
      │   │   └── 상세사실(DetailedFact, Level 3)
      │   └── 프로젝트참고자료(ProjectReference)
      │       ├── 증거자료(Evidence)
      │       └── 주장서류(Document)
      └── 프로젝트참고자료(ProjectReference)
          ├── 법령(Law)
          ├── 판례(Precedent)
          ├── 프로젝트최종결정문(FinalJudgement)
          └── 참고자료(Reference)
  ```

- **관계 시각화 컴포넌트** (`AnalysisGoalClaimFactRelationshipVisualizationComponent.tsx`):
  - 목표-주장-사실-프로젝트참고자료 간의 관계를 트리 구조로 시각화합니다.
  - 사용자는 각 노드를 클릭하여 세부 정보를 확인하고 편집할 수 있습니다.
  - 다음과 같은 시각화 옵션이 제공됩니다:
    - 트리 뷰 (기본): 계층적 관계를 트리 형태로 표시 (`AnalysisGoalClaimFactTreeViewComponent.tsx`)
    - 마인드맵 뷰: 중앙에 프로젝트를 두고 목표와 주장을 방사형으로 표시 (`AnalysisGoalClaimFactMindMapViewComponent.tsx`)
    - 네트워크 뷰: 각 요소간의 상호 연결성을 그래프로 표시 (`AnalysisGoalClaimFactNetworkViewComponent.tsx`)
  - 시각화 내 필터링 옵션:
    - 목표별 필터링 (`AnalysisGoalFilterComponent.tsx`)
    - 주장별 필터링 (`AnalysisClaimFilterComponent.tsx`)
    - 사실별 필터링 (`AnalysisFactFilterComponent.tsx`)
    - 프로젝트참고자료별 필터링 (`AnalysisProjectReferenceFilterComponent.tsx`)
  - 연결 강도 표시: 
    - 연결선의 굵기로 각 요소 간의 지원 강도를 표현 (`AnalysisConnectionStrengthIndicatorComponent.tsx`)
    - 강도는 각 요소를 뒷받침하는 하위 요소들의 수와 관련성 점수를 기반으로 계산됩니다.

- **목표-주장 정합성 검증** (`AnalysisGoalClaimConsistencyValidationComponent.tsx`):
  - 목표와 주장 간의 논리적 정합성을 자동으로 검증합니다.
  - 다음과 같은 검증이 수행됩니다:
    - 모든 목표가 적어도 하나 이상의 주장으로 지원되는지 확인
    - 모든 주장이 적어도 하나 이상의 목표에 연결되는지 확인
    - 주장들 간의 논리적 모순이 없는지 확인
    - 목표들 간의 충돌이나 중복이 없는지 확인
  - 검증 결과는 다음과 같이 표시됩니다:
    - 정합성 점수 (예: "목표-주장 정합성: 85%") (`AnalysisGoalClaimConsistencyScoreComponent.tsx`)
    - 개선 제안 (예: "목표 '무죄 판결'에 대한 주장이 부족합니다") (`AnalysisGoalClaimConsistencyImprovementSuggestionComponent.tsx`)

### 1.3 사실관계 입력 및 분석
- **사실관계 입력 인터페이스** (`AnalysisFactInputInterfaceComponent.tsx`):
  - 자유 형식 텍스트 입력 필드 (플레이스홀더: "사실관계를 입력하세요...") (`AnalysisFactInputFieldComponent.tsx`)
  - 입력 중 AI 실시간 분석 (6하원칙 충족도 및 가치중립성 검증) (`AnalysisAIFactAnalysisComponent.tsx`)
  - AI 분석 결과 표시 패널 (`AnalysisFactAnalysisResultPanelComponent.tsx`):
    - "입력하신 내용의 6하원칙 충족도: [점수]" 메시지
    - "입력하신 내용은 [가치중립적/가치판단 포함]으로 판단됩니다" 메시지
    - 가치판단이 포함된 경우 중립적 표현 제안 (`AnalysisNeutralExpressionSuggestionComponent.tsx`)
    - 기존 사실관계와의 관계 분석 (중복, 포함, 모순 등) (`AnalysisFactRelationshipAnalysisComponent.tsx`)
    - 사실관계 추가 버튼 (`AnalysisAddFactButtonComponent.tsx`)
  - 입력 확인 버튼 (`AnalysisConfirmFactInputButtonComponent.tsx`)
  - "프로젝트참고자료에서 사실 추출" 버튼 (아이콘: `📝`) (`AnalysisExtractFactFromProjectReferenceButtonComponent.tsx`):
    - 클릭 시 사실 추출 모달 표시 (`AnalysisFactExtractionModalComponent.tsx`)

- **사실 추출 모달** (`AnalysisFactExtractionModalComponent.tsx`):
  - **선택 패널** (`AnalysisFactExtractionSelectionPanelComponent.tsx`):
    - 프로젝트참고자료 선택 섹션 (`AnalysisSelectProjectReferenceComponent.tsx`):
      - 프로젝트참고자료 목록 표시 (`AnalysisProjectReferenceListComponent.tsx`)
      - 검색 및 필터링 기능 (`AnalysisProjectReferenceSearchComponent.tsx`)
      - 다중 선택 지원 (체크박스) (`AnalysisMultiSelectProjectReferenceComponent.tsx`)
      - 선택된 프로젝트참고자료의 특정 부분 지정 옵션 (`AnalysisSpecificProjectReferencePartSelectionComponent.tsx`):
        - 페이지 선택 (페이지 미리보기 포함) (`AnalysisProjectReferencePageSelectionComponent.tsx`)
        - 문단/섹션 선택 (`AnalysisProjectReferenceParagraphSelectionComponent.tsx`)
        - 하이라이트된 부분 선택 (`AnalysisProjectReferenceHighlightSelectionComponent.tsx`)
  - **미리보기 및 생성 패널** (`AnalysisFactPreviewCreationPanelComponent.tsx`):
    - AI 추출 사실 미리보기 (`AnalysisAIExtractedFactPreviewComponent.tsx`)
    - 6하원칙 충족도 표시 (`AnalysisSixWElementsScoreComponent.tsx`)
    - 가치중립성 점수 표시 (`AnalysisFactNeutralityScoreComponent.tsx`)
    - 사실 수동 편집 기능 (`AnalysisFactManualEditComponent.tsx`)
    - 생성 확인 버튼 (`AnalysisConfirmFactCreationButtonComponent.tsx`)
    - 취소 버튼 (`AnalysisCancelFactCreationButtonComponent.tsx`)

- **사실관계 트리 뷰** (`AnalysisFactTreeViewComponent.tsx`):
  - **계층 구조 제한**:
    - 최대 3단계까지의 계층 구조 허용 (Level 1 ~ Level 3)
    - Level 1: 최상위 사실 (개요/요약 수준)
    - Level 2: 중간 수준 사실 (주요 구성요소)
    - Level 3: 상세 수준 사실 (구체적 세부사항)
  
  - **사실관계 노드 표시**:
    - Level 1 노드 (아이콘: `📋`) (`AnalysisFactLevel1NodeComponent.tsx`)
    - Level 2 노드 (아이콘: `📝`) (`AnalysisFactLevel2NodeComponent.tsx`)
    - Level 3 노드 (아이콘: `📎`) (`AnalysisFactLevel3NodeComponent.tsx`)
  
  - **접기/펼치기 기능**:
    - 전체 접기/펼치기 토글 버튼 (`AnalysisFactTreeCollapseExpandAllButtonComponent.tsx`)
    - 레벨별 접기/펼치기 토글 (`AnalysisFactTreeLevelCollapseExpandButtonComponent.tsx`)
    - 개별 노드 접기/펼치기 토글 (`AnalysisFactNodeCollapseExpandButtonComponent.tsx`)
    - 접기/펼치기 상태 저장 및 복원 (`AnalysisFactTreeCollapseStateService.ts`)
  
  - **뷰 모드 전환**:
    - 상세 모드: 모든 레벨의 사실 표시
    - 요약 모드: Level 1 사실만 표시
    - 중간 모드: Level 1, 2 사실 표시
    - 사용자 정의 모드: 선택적 레벨 표시

- **사실관계 검증 및 경고** (`AnalysisFactVerificationComponent.tsx`):
  - 모순/배치 경고 표시 (`AnalysisFactContradictionWarningComponent.tsx`)
  - 모순/배치 이유 설명 패널 (`AnalysisContradictionReasonPanelComponent.tsx`)
  - 프로젝트참고자료 부족 경고 표시 (`AnalysisInsufficientProjectReferenceWarningComponent.tsx`)
  - 추가 필요 프로젝트참고자료 제안 (`AnalysisAdditionalProjectReferenceSuggestionComponent.tsx`)
  - 사실과 프로젝트참고자료 간 관계 표시 (`AnalysisFactProjectReferenceRelationshipComponent.tsx`)

- **사실관계 필터링 및 정렬** (`AnalysisFactFilteringSortingComponent.tsx`):
  - 6하원칙 충족도별 정렬 (`AnalysisSortBySixWElementsScoreComponent.tsx`)
  - 가치중립성별 정렬 (`AnalysisSortByNeutralityScoreComponent.tsx`)
  - 검증 상태별 필터링 (`AnalysisFilterByVerificationStatusComponent.tsx`)
  - 모순/배치 여부별 필터링 (`AnalysisFilterByContradictionComponent.tsx`)
  - 관련 목표/주장별 필터링 (`AnalysisFilterByRelatedGoalClaimComponent.tsx`)

## 2. 컴포넌트별 세부 구조

### 2.1 프로젝트분석 UI (`AnalysisProjectAnalysisTabViewComponent.tsx`)
프로젝트분석탭 선택 시, 상단에 세 개의 서브탭('우리측 입장 분석', '상대방측 입장 분석', '중립적 분석')이 표시됩니다. 각 서브탭은 서로 다른 관점에서 프로젝트를 분석하며, 사용자는 필요에 따라 탭을 전환하여 여러 관점의 분석 정보를 확인할 수 있습니다.

#### 2.1.1 서브탭 네비게이션 (`AnalysisSubTabNavigationComponent.tsx`)
- 세 개의 서브탭 버튼 제공:
  - '우리측 입장 분석' 탭 (`AnalysisOurPerspectiveTabButtonComponent.tsx`)
  - '상대방측 입장 분석' 탭 (`AnalysisOpponentPerspectiveTabButtonComponent.tsx`)
  - '중립적 분석' 탭 (`AnalysisNeutralPerspectiveTabButtonComponent.tsx`)
- 현재 선택된 탭은 하단 경계선과 텍스트 색상으로 구분됩니다.

#### 2.1.2 우리측 입장 분석 서브탭 (`AnalysisOurPerspectiveTabViewComponent.tsx`)
이 서브탭에서는 우리측 관점에서의 목표, 주장, 근거자료를 트리 구조로 분석합니다.

- **통합 입력 인터페이스** (`AnalysisIntegratedInputInterfaceComponent.tsx`):
  - 자유 형식 텍스트 입력 필드 (플레이스홀더: "목표 또는 주장을 입력하세요...") (`AnalysisGoalClaimInputFieldComponent.tsx`)
  - 입력 중 AI 실시간 분석 (입력 내용이 목표인지 주장인지 자동 판별) (`AnalysisAIInputAnalysisComponent.tsx`)
  - AI 분석 결과 표시 패널 (`AnalysisAIAnalysisResultPanelComponent.tsx`):
    - "입력하신 내용은 [목표/주장]로 판단됩니다" 메시지
    - 기존 항목과의 관계 분석 (중복, 포함, 모순 등) (`AnalysisInputRelationshipAnalysisComponent.tsx`)
    - 제안된 분류로 추가 버튼 (`AnalysisAddAsRecommendedTypeButtonComponent.tsx`)
    - 다른 유형으로 추가 옵션 (`AnalysisAddAsDifferentTypeButtonComponent.tsx`)
  - 입력 확인 버튼 (`AnalysisConfirmInputButtonComponent.tsx`)

- **목표-주장 트리 뷰** (`AnalysisGoalClaimTreeViewComponent.tsx`):
  - 목표 노드 (아이콘: `🎯`) (`AnalysisGoalNodeComponent.tsx`)
  - 주장 노드 (아이콘: `⚖️`) (`AnalysisClaimNodeComponent.tsx`)
  - 프로젝트참고자료 노드 (아이콘: `📄`) (`AnalysisProjectReferenceNodeComponent.tsx`)
  - 노드 접기/펼치기 토글 (`AnalysisNodeToggleComponent.tsx`)
  - 노드 편집 버튼 (아이콘: `✏️`) (`AnalysisEditNodeButtonComponent.tsx`)
  - 노드 삭제 버튼 (아이콘: `🗑️`) (`AnalysisDeleteNodeButtonComponent.tsx`)
  - AI 제안 표시 (새로운 주장이나 프로젝트참고자료 추천) (`AnalysisAISuggestionBadgeComponent.tsx`)

- **근거자료 연결 인터페이스** (`AnalysisProjectReferenceLinkingInterfaceComponent.tsx`):
  - 주장 노드 선택 시 '프로젝트참고자료 연결' 버튼 표시 (`AnalysisLinkProjectReferenceButtonComponent.tsx`)
  - 프로젝트참고자료 연결 모달 (`AnalysisProjectReferenceLinkingModalComponent.tsx`):
    - 프로젝트참고자료 검색 및 필터링 (`AnalysisProjectReferenceSearchComponent.tsx`)
    - 프로젝트참고자료 미리보기 (`AnalysisProjectReferencePreviewComponent.tsx`)
    - 연결 강도 설정 슬라이더 (`AnalysisProjectReferenceLinkStrengthSliderComponent.tsx`)
    - 선택 확인 버튼 (`AnalysisConfirmProjectReferenceLinkButtonComponent.tsx`)
  - AI 추천 프로젝트참고자료 표시 (`AnalysisAIRecommendedProjectReferenceComponent.tsx`):
    - 추천 프로젝트참고자료 알림 배지 (아이콘: `⚡`) (`AnalysisAIProjectReferenceSuggestionBadgeComponent.tsx`)
    - 클릭 시 추천 프로젝트참고자료가 선택된 상태로 모달 오픈

#### 2.1.3 상대방측 입장 분석 서브탭 (`AnalysisOpponentPerspectiveTabViewComponent.tsx`)
이 서브탭은 상대방 관점에서의 목표, 주장, 근거자료를 분석하며, 구조적으로는 '우리측 입장 분석' 서브탭과 동일합니다.

- **통합 입력 인터페이스** (`AnalysisOpponentIntegratedInputInterfaceComponent.tsx`):
  - 자유 형식 텍스트 입력 필드 (플레이스홀더: "상대방의 목표 또는 주장을 입력하세요...") (`AnalysisOpponentGoalClaimInputFieldComponent.tsx`)
  - 입력 중 AI 실시간 분석 (`AnalysisOpponentAIInputAnalysisComponent.tsx`)
  - AI 분석 결과 표시 패널 (`AnalysisOpponentAIAnalysisResultPanelComponent.tsx`)
  - 입력 확인 버튼 (`AnalysisOpponentConfirmInputButtonComponent.tsx`)

- **목표-주장 트리 뷰** (`AnalysisOpponentGoalClaimTreeViewComponent.tsx`):
  - 목표 노드 (아이콘: `🎯`) (`AnalysisOpponentGoalNodeComponent.tsx`)
  - 주장 노드 (아이콘: `⚖️`) (`AnalysisOpponentClaimNodeComponent.tsx`)
  - 증거자료 노드 (아이콘: `📄`) (`AnalysisOpponentEvidenceNodeComponent.tsx`)
  - 노드 접기/펼치기 토글 및 편집 기능은 우리측 입장 분석과 동일

- **대응 전략 분석** (`AnalysisCounterStrategyAnalysisComponent.tsx`):
  - 상대방 주장에 대한 대응 전략 추천 (`AnalysisCounterArgumentSuggestionComponent.tsx`)
  - 상대방 증거에 대한 반박 근거 제시 (`AnalysisEvidenceRebuttalSuggestionComponent.tsx`)
  - 약점 분석 및 보완점 제시 (`AnalysisWeaknessAnalysisComponent.tsx`)

#### 2.1.4 중립적 분석 서브탭 (`AnalysisNeutralPerspectiveTabViewComponent.tsx`)
이 서브탭에서는 가치중립적 관점에서 증거자료를 기반으로 사실관계를 분석합니다.

- **통합 사실관계 입력 인터페이스** (`AnalysisIntegratedFactInputInterfaceComponent.tsx`):
  - 자유 형식 텍스트 입력 필드 (플레이스홀더: "사실관계를 입력하세요...") (`AnalysisFactInputFieldComponent.tsx`)
  - 입력 중 AI 실시간 분석 (요약/개별 사실관계 판별 및 가치중립성 검증) (`AnalysisAIFactAnalysisComponent.tsx`)
  - AI 분석 결과 표시 패널 (`AnalysisNeutralAnalysisResultPanelComponent.tsx`):
    - "입력하신 내용은 [요약 사실관계/개별 사실관계]로 판단됩니다" 메시지
    - "입력하신 내용은 [가치중립적/가치판단 포함]으로 판단됩니다" 메시지
    - 가치판단이 포함된 경우 중립적 표현 제안 (`AnalysisNeutralExpressionSuggestionComponent.tsx`)
    - 기존 요약/개별 사실관계와의 관계 분석 (중복, 포함, 모순 등) (`AnalysisFactRelationshipAnalysisComponent.tsx`)
    - 요약 사실관계로 추가 버튼 (`AnalysisAddAsSummaryFactButtonComponent.tsx`)
    - 개별 사실관계로 추가 버튼 (`AnalysisAddAsIndividualFactButtonComponent.tsx`)
  - 입력 확인 버튼 (`AnalysisConfirmFactInputButtonComponent.tsx`)
  - "기존 자료로 사실관계 생성" 버튼 (아이콘: `📝`) (`AnalysisCreateFactFromExistingDataButtonComponent.tsx`):
    - 클릭 시 사실관계 생성 모달 표시 (`AnalysisFactCreationModalComponent.tsx`)

- **사실관계 생성 모달** (`AnalysisFactCreationModalComponent.tsx`):
  - **선택 패널** (`AnalysisFactCreationSelectionPanelComponent.tsx`):
    - 개별사실관계 선택 섹션 (`AnalysisSelectIndividualFactsComponent.tsx`):
      - 기존 개별사실관계 목록 표시 (`AnalysisIndividualFactsListComponent.tsx`)
      - 검색 및 필터링 기능 (`AnalysisIndividualFactsSearchComponent.tsx`)
      - 다중 선택 지원 (체크박스) (`AnalysisMultiSelectIndividualFactsComponent.tsx`)
    - 증거자료 선택 섹션 (`AnalysisSelectEvidenceComponent.tsx`):
      - 증거자료 목록 표시 (`AnalysisEvidenceListForFactsComponent.tsx`)
      - 검색 및 필터링 기능 (`AnalysisEvidenceSearchComponent.tsx`)
      - 다중 선택 지원 (체크박스) (`AnalysisMultiSelectEvidenceComponent.tsx`)
      - 선택된 증거자료의 특정 부분 지정 옵션 (`AnalysisSpecificEvidencePartSelectionComponent.tsx`):
        - 페이지 선택 (페이지 미리보기 포함) (`AnalysisEvidencePageSelectionComponent.tsx`)
        - 문단/섹션 선택 (`AnalysisEvidenceParagraphSelectionComponent.tsx`)
        - 하이라이트된 부분 선택 (`AnalysisEvidenceHighlightSelectionComponent.tsx`)
  - **미리보기 및 생성 패널** (`AnalysisFactPreviewCreationPanelComponent.tsx`):
    - AI 생성 사실관계 미리보기 (`AnalysisAIGeneratedFactPreviewComponent.tsx`)
    - 생성 유형 표시 (선택된 자료 개수에 따라 요약/개별 결정) (`AnalysisFactTypeIndicatorComponent.tsx`)
    - 사실관계 수동 편집 기능 (`AnalysisFactManualEditComponent.tsx`)
    - 가치중립성 점수 표시 (`AnalysisFactNeutralityScoreComponent.tsx`)
    - 생성 확인 버튼 (`AnalysisConfirmFactCreationButtonComponent.tsx`)
    - 취소 버튼 (`AnalysisCancelFactCreationButtonComponent.tsx`)

- **사실관계 트리 구조 뷰** (`AnalysisFactTreeViewComponent.tsx`):
  - **요약사실관계 트리** (`AnalysisSummaryFactTreeComponent.tsx`):
    - 요약 사실관계 노드 (아이콘: `📋`) (`AnalysisSummaryFactNodeComponent.tsx`)
    - 개별 사실관계 하위 노드 (아이콘: `📝`) (`AnalysisIndividualFactNodeComponent.tsx`)
    - 노드 접기/펼치기 토글 (`AnalysisFactNodeToggleComponent.tsx`)
    - 노드 편집 버튼 (아이콘: `✏️`) (`AnalysisEditFactNodeButtonComponent.tsx`)
    - 노드 삭제 버튼 (아이콘: `🗑️`) (`AnalysisDeleteFactNodeButtonComponent.tsx`)
    - 중복 개별사실관계 표시 (중복 정보 툴팁 제공) (`AnalysisDuplicateFactIndicatorComponent.tsx`)
    - 사실관계 검증 상태 표시 (아이콘: `✅`/`⚠️`) (`AnalysisFactVerificationStatusComponent.tsx`)
  
  - **독립 개별사실관계 섹션** (`AnalysisIndependentIndividualFactsComponent.tsx`):
    - 독립 개별 사실관계 노드 목록 (`AnalysisIndependentFactListComponent.tsx`)
    - 각 노드는 검증 상태 및 모순 정보 포함 (`AnalysisIndependentFactNodeComponent.tsx`)
    - 요약사실관계 연결 버튼 (아이콘: `🔗`) (`AnalysisLinkToSummaryFactButtonComponent.tsx`)
  
  - **연결 추천 섹션** (`AnalysisFactLinkRecommendationComponent.tsx`):
    - AI 추천 연결 항목 표시 (아이콘: `🔗`) (`AnalysisRecommendedFactLinkComponent.tsx`)
    - 새 요약사실관계 생성 추천 (아이콘: `➕`) (`AnalysisNewSummaryFactRecommendationComponent.tsx`)
    - 추천 수락 버튼 (`AnalysisAcceptRecommendationButtonComponent.tsx`)

- **사실관계 검증 및 경고** (`AnalysisFactVerificationComponent.tsx`):
  - 모순/배치 경고 표시 (요약-개별 사실관계 간) (`AnalysisFactContradictionWarningComponent.tsx`)
  - 모순/배치 이유 설명 패널 (`AnalysisContradictionReasonPanelComponent.tsx`)
  - 증거 부족 경고 표시 (`AnalysisInsufficientEvidenceWarningComponent.tsx`)
  - 추가 필요 증거 제안 (`AnalysisAdditionalEvidenceSuggestionComponent.tsx`)
  - 개별 사실관계와 증거자료 간 N:N 관계 표시 (`AnalysisFactEvidenceRelationshipComponent.tsx`)

- **사실관계 필터링 및 정렬** (`AnalysisFactFilteringSortingComponent.tsx`):
  - 증거 강도별 정렬 (`AnalysisSortByEvidenceStrengthComponent.tsx`)
  - 모순/배치 여부별 필터링 (`AnalysisFilterByContradictionComponent.tsx`)
  - 관련 목표/주장별 필터링 (`AnalysisFilterByRelatedGoalClaimComponent.tsx`)
  - 독립/연결된 개별사실관계 필터링 (`AnalysisFilterByConnectionStatusComponent.tsx`)

## 3. AI 통합 입력 분석 시스템

### 3.1 목표/주장 자동 분류 시스템 (`AnalysisAIClassificationSystemComponent.tsx`)
사용자가 입력한 텍스트를 AI가 자동으로 분석하여 목표인지 주장인지 판별하고, 적절한 처리 방법을 제안합니다.

- **입력 분석 절차**:
  1. 사용자가 통합 입력란에 텍스트 입력
  2. AI 실시간 분석 (타이핑 중 또는 입력 완료 후 자동 실행)
  3. 분석 결과에 따라 목표 또는 주장으로 분류 제안
  4. 기존 항목과의 관계 분석 및 알림
  5. 사용자 확인 후 최종 입력

- **분류 알고리즘** (`AnalysisAIClassificationAlgorithmComponent.tsx`):
  - 텍스트 의미 분석을 통한 목표/주장 특성 식별
  - 법률 용어 및 표현 패턴 인식
  - 목표는 결과물에 초점, 주장은 논리적 입장에 초점을 맞춤
  - 가중치 기반 분류 점수 계산 (예: "목표 가능성: 85%, 주장 가능성: 15%")

- **관계 분석** (`AnalysisRelationshipAnalysisSystemComponent.tsx`):
  - 기존 목표/주장과의 텍스트 유사도 비교
  - 의미적 포함관계 분석 (상위/하위 개념)
  - 논리적 모순 검사 (배치되는 내용)
  - 목적/수단 관계 식별 (한 항목이 다른 항목의 수단인 경우)
  - 관계 분석 결과 시각화 (중복: 빨간색, 포함: 주황색, 모순: 보라색)

### 3.2 가치중립성 검증 시스템 (`AnalysisNeutralityVerificationSystemComponent.tsx`)
중립적 분석 탭에서 사용자 입력의 가치중립성을 검증하고, 필요 시 중립적 표현으로 변환을 제안합니다.

- **중립성 검사 절차**:
  1. 사용자가 요약/개별 사실관계 입력
  2. AI 실시간 중립성 분석
  3. 가치판단 표현 식별 및 표시
  4. 중립적 표현 대안 제시
  5. 사용자 확인 후 최종 입력

- **중립성 판단 기준** (`AnalysisNeutralityJudgmentCriteriaComponent.tsx`):
  - 주관적 표현 식별 (예: "부당하게", "악의적으로", "고의로" 등)
  - 의견이나 추측 표현 식별 (예: "~인 것으로 보인다", "~일 것이다" 등)
  - 감정적 어조 감지 (예: "심각한", "중대한", "명백한" 등)
  - 법적 결론 표현 식별 (예: "위법하다", "책임이 있다" 등)
  - 중립적 표현으로의 변환 제안 (예: "A가 악의적으로 계약을 위반했다" → "A가 계약 조항을 이행하지 않았다")

### 3.3 사실 세분화 분석 시스템 (`AnalysisFactRefinementSystemComponent.tsx`)
사실의 추상성과 모호성을 분석하고, 필요한 경우 더 구체적인 하위 사실로의 세분화를 제안합니다.

- **사실 분석 절차**:
  1. 사용자가 사실 입력 또는 기존 사실 선택
  2. AI 실시간 분석:
     - 추상성/모호성 수준 평가
     - 구체화 필요성 판단
     - 세분화 가능성 분석
  3. 분석 결과에 따른 개선 제안:
     - 구체화가 필요한 요소 하이라이트
     - 하위 사실 추가 제안
     - 추가 증거자료 수집 필요성 제시

- **세분화 분석 기준** (`AnalysisFactRefinementCriteriaComponent.tsx`):
  - 추상성 수준 평가:
    - 시간적 구체성 (특정 시점 vs. 기간)
    - 장소적 구체성 (특정 장소 vs. 일반적 위치)
    - 행위자 구체성 (특정 인물/조직 vs. 불특정 다수)
    - 행위 구체성 (구체적 행위 vs. 추상적 행위)
  - 모호성 평가:
    - 다의적 해석 가능성
    - 맥락 의존성
    - 주관적 판단 요소
  - 증거 연결성:
    - 직접 증거 존재 여부
    - 간접 증거의 구체성
    - 추가 증거 필요성

- **세분화 제안 시스템** (`AnalysisFactRefinementSuggestionComponent.tsx`):
  - 하위 사실 생성 가이드:
    - 6하원칙 기반 구체화 포인트 제시
    - 시간/장소/행위자/행위 세분화 방향 제안
    - 증거자료 기반 세부사실 도출 방법 제시
  - 증거 수집 가이드:
    - 필요한 추가 증거 유형 제안
    - 증거 수집 우선순위 제시
    - 증거 확보 방법 추천

## 4. 데이터 모델 및 상태 관리

### 4.1 목표-주장-사실 데이터 모델 (`AnalysisGoalClaimFactDataModelService.ts`)
- **목표 인터페이스**:
  ```typescript
  interface Goal {
    id: string;
    content: string;
    type: 
      | 'MONETARY'              // 금전적 보상/배상
      | 'CONTRACT'              // 계약 관련
      | 'LEGAL_DECISION'        // 법적 판단 획득
      | 'ADMINISTRATIVE'        // 행정처분/인허가
      | 'CRIMINAL'             // 형사 관련
      | 'INJUNCTIVE'           // 금지/중지명령
      | 'DECLARATORY'          // 권리/의무 확인
      | 'PREVENTIVE'           // 위험/리스크 예방
      | 'REGULATORY_COMPLIANCE' // 규제 준수
      | 'DISPUTE_RESOLUTION'    // 분쟁 해결
      | 'INTELLECTUAL_PROPERTY' // 지식재산권 보호/활용
      | 'CORPORATE_GOVERNANCE'  // 기업 지배구조/경영권
      | 'LABOR_EMPLOYMENT'      // 노동/고용 관련
      | 'ENVIRONMENTAL'         // 환경 규제/분쟁
      | 'INTERNATIONAL_TRADE'   // 국제 거래/무역
      | 'TAX_PLANNING'         // 조세 계획/분쟁
      | 'RESTRUCTURING'        // 기업 구조조정
      | 'COMPETITION_LAW'      // 공정거래/경쟁법
      | 'DATA_PRIVACY'         // 개인정보/데이터보호
      | 'SHAREHOLDER_RIGHTS';  // 주주 권리/이익 보호
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    relatedClaims: string[]; // Claim IDs
  }
  ```

- **주장 인터페이스**:
  ```typescript
  interface Claim {
    id: string;
    content: string;
    supportingGoals: string[]; // Goal IDs
    supportingFacts: string[]; // Fact IDs
    supportingLaws: string[]; // Law IDs
    supportingPrecedents: string[]; // Precedent IDs
    supportingFinalJudgements: string[]; // FinalJudgement IDs
    priority: number;
    strength: number; // 0-100, 근거 강도
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- **사실 인터페이스**:
  ```typescript
  interface Fact {
    id: string;
    content: string;
    isNeutral: boolean;
    level: 1 | 2 | 3; // 사실의 계층 레벨
    abstractionLevel: number; // 0-100, 추상성 수준
    ambiguityScore: number; // 0-100, 모호성 점수
    needsRefinement: boolean; // 세분화 필요 여부
    parentFactId?: string; // 상위 사실 ID (없으면 최상위 사실)
    childFacts: string[]; // 하위 사실 ID 목록
    displayState: 'EXPANDED' | 'COLLAPSED'; // 노드 표시 상태
    sixWElements: {
      who: string;
      when: string;
      where: string;
      what: string;
      how: string;
      why: string;
    };
    refinementSuggestions: { // AI의 세분화 제안
      suggestedSubFacts: string[]; // 제안된 하위 사실 내용
      missingElements: string[]; // 부족한 6하원칙 요소
      requiredEvidence: string[]; // 필요한 추가 증거 유형
    };
    createdAt: Date;
    updatedAt: Date;
    supportingClaims: string[]; // Claim IDs
    supportingEvidences: string[]; // Evidence IDs
    supportingDocuments: string[]; // Document IDs
    verificationStatus: 'VERIFIED' | 'PARTIAL' | 'INSUFFICIENT';
  }
  ```

- **프로젝트참고자료 인터페이스**:
  ```typescript
  interface ProjectReference {
    id: string;
    type: 'LAW' | 'PRECEDENT' | 'FINAL_JUDGEMENT' | 'EVIDENCE' | 'REFERENCE' | 'DOCUMENT';
    title: string;
    content: string;
    fileUrl?: string;
    metadata: {
      source: string;
      date: Date;
      author?: string;
      version?: string;
      category: string;
      referenceType: {
        // 프로젝트참고자료 유형별 추가 메타데이터
        law?: {
          lawCode: string;
          articleNumber: string;
          effectiveDate: Date;
        };
        precedent?: {
          caseNumber: string;
          court: string;
          judgementDate: Date;
        };
        finalJudgement?: {
          decisionNumber: string;
          authority: string;
          decisionDate: Date;
        };
        evidence?: {
          evidenceType: string;
          acquisitionDate: Date;
          authenticityVerified: boolean;
        };
        reference?: {
          referenceType: string;
          publisher: string;
          publicationDate: Date;
        };
        document?: {
          documentType: string;
          submissionDate: Date;
          submittedBy: string;
        };
      };
    };
    createdAt: Date;
    updatedAt: Date;
    relatedClaims: string[]; // Claim IDs (for LAW, PRECEDENT, FINAL_JUDGEMENT)
    relatedFacts: string[]; // Fact IDs (for EVIDENCE, REFERENCE, DOCUMENT)
  }
  ```

### 4.2 상태 관리 및 지속성 (`AnalysisStateManagementService.ts`)
- Zustand를 활용한 상태 관리 스토어
- 서버 동기화 로직 (자동 저장 및 로드)
- 변경 이력 추적 및 실행 취소/다시 실행 기능
- 협업 상태 충돌 해결 로직

## 5. 디자인 가이드

### 5.1 컬러 스키마
- **주요 색상**:
  - 우리측 입장 분석: 파란색 계열 (#1E88E5)
  - 상대방측 입장 분석: 붉은색 계열 (#E53935)
  - 중립적 분석: 회색 계열 (#757575)
  - 목표 노드: 보라색 계열 (#7B1FA2)
  - 주장 노드: 녹색 계열 (#388E3C)
  - 증거 노드: 주황색 계열 (#F57C00)
  - 경고 메시지: 주황색 계열 (#FF9800)
  - 오류 메시지: 빨간색 계열 (#D32F2F)

### 5.2 아이콘 체계
- **노드 아이콘**:
  - 목표: 🎯 또는 적절한 SVG 아이콘
  - 주장: ⚖️ 또는 적절한 SVG 아이콘
  - 사실: 📝 또는 적절한 SVG 아이콘
  - 프로젝트참고자료: 📄 또는 적절한 SVG 아이콘

- **동작 아이콘**:
  - 추가: ➕ 또는 적절한 SVG 아이콘
  - 편집: ✏️ 또는 적절한 SVG 아이콘
  - 삭제: 🗑️ 또는 적절한 SVG 아이콘
  - 연결: 🔗 또는 적절한 SVG 아이콘
  - AI 추천: 🤖 또는 적절한 SVG 아이콘
  - AI 증거자료 추천: ⚡ 또는 적절한 SVG 아이콘

### 5.3 타이포그래피
- **폰트**:
  - 주 폰트: Noto Sans KR
  - 부 폰트: Roboto
  - 코드 폰트: JetBrains Mono

- **폰트 크기**:
  - 섹션 제목: 24px
  - 서브 제목: 18px
  - 본문 텍스트: 16px
  - 보조 텍스트: 14px
  - 노드 텍스트: 15px

### 5.4 레이아웃 및 반응형 디자인
- **레이아웃 구조**:
  - 상단 서브탭 네비게이션
  - 중앙 분석 화면 (목표-주장 트리 또는 사실관계 관계도)
  - 하단 속성 및 세부 정보 패널
  - AI 추천 및 경고 인라인 표시

- **반응형 동작**:
  - 1200px 이상: 3단 레이아웃
  - 992px ~ 1199px: 2단 레이아웃 (속성 패널 축소)
  - 768px ~ 991px: 1단 레이아웃 (탭 전환식)
  - 767px 이하: 모바일 최적화 레이아웃

## 6. 접근성 및 사용성 고려사항

### 6.1 접근성 지원
- 스크린 리더 호환성
- 키보드 내비게이션 및 단축키
- 적절한 색상 대비 및 고대비 모드
- 텍스트 크기 조정 옵션

### 6.2 사용자 피드백 시스템
- 작업 완료 토스트 메시지
- 진행 중 상태 표시기
- 에러 및 경고 알림
- 툴팁 및 컨텍스트 도움말 