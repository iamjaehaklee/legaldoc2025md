# 시나리오 3: 법률 자문 질의응답

## 초기 상태
- AI Agent가 Ask 모드로 설정됨
- 프로젝트의 기존 자료들이 로드된 상태
- 사용자가 특정 법적 쟁점에 대한 자문을 구하고자 함

## 사용자 행동 시퀀스

### 1. 모드 전환 및 초기 설정
1. Header의 Mode Switch를 통해 Ask 모드로 전환
2. Context Display에서 현재 프로젝트 맥락 확인

### 2. 질의 준비
1. MentionSystem을 통해 관련 자료 참조:
   - LawItem: "공정거래법 제23조" 선택
   - PrecedentItem: "대법원 2022공정1234 판결" 선택
   - EvidenceItem: "시장점유율 분석자료" 선택
2. ProjectAnalysisSection에서:
   - GoalItem: "공정거래위원회 시정명령 대응" 선택
   - ClaimItem: "시장지배적 지위 남용 아님" 선택

### 3. 질의 입력 및 처리
1. Input Section에서:
   - 구체적인 질문 입력: "당사의 가격 정책이 시장지배적 지위 남용에 해당하는지?"
   - 관련 자료들이 InlineChip으로 표시된 것 확인
2. Process Section 모니터링:
   - Data Summary에서 참조된 자료 확인
   - Analysis Steps에서 법리 검토 진행상황 확인

### 4. 응답 검토
1. Output Section의 Results Display에서:
   - AI의 법률 분석 검토
   - 추가 질문 필요 사항 확인
2. 필요시 SuggestNextButton(🤖)을 통해:
   - 추가 검토가 필요한 쟁점 파악
   - 관련 판례 추천 확인

### 5. 후속 조치
1. Action Buttons를 통해:
   - 중요 답변 내용 클립보드 복사
   - 검토 결과 프로젝트에 저장
2. Feedback Section에서:
   - 답변의 유용성 평가
   - 추가 의견 입력

## 예상 결과
- 법적 쟁점에 대한 명확한 답변 획득
- 관련 법령과 판례에 기반한 분석
- 향후 대응 방향에 대한 가이드라인 수립

## 예외 상황 처리
1. 질문의 맥락이 불명확한 경우:
   - AI가 구체화 질문을 통해 명확화
   - Context Display를 통해 추가 정보 제공
2. 답변이 불충분한 경우:
   - 추가 질문 기능 활용
   - 관련 자료 추가 요청
3. 새로운 법적 쟁점 발견 시:
   - 프로젝트 목표/주장 업데이트 제안
   - 추가 검토 필요 사항 기록 