# 시나리오 1: 새로운 준비서면 작성하기

## 초기 상태
- 사용자가 프로젝트의 문서작성탭에 위치
- AI Agent가 Write 모드로 설정됨
- 프로젝트데이터가 이미 로드되어 있음

## 사용자 행동 시퀀스

### 1. 새 문서 생성 시작
1. NewDocumentButton(📝) 클릭
2. 문서 유형 선택 드롭다운에서 "준비서면" 선택
3. 문서 요지 입력: "상대방의 채무불이행 책임을 다투는 준비서면"

### 2. 관련 자료 선택
1. MentionSystem의 ProjectReferenceSection에서:
   - EvidenceItem: "계약서", "입금내역서" 선택
   - LawItem: "민법 제390조(채무불이행과 손해배상)" 선택
   - PrecedentItem: "대법원 2020다12345 판결" 선택

2. ProjectAnalysisSection에서:
   - GoalItem: "상대방의 금전지급청구에 대한 방어" 선택
   - ClaimItem: "상대방의 계약 위반이 선행" 선택
   - FactItem: "상대방이 2024.1.15. 계약상 의무 불이행" 선택

### 3. AI 작성 과정 모니터링
1. Process Section의 진행 상황 확인:
   - Data Summary에서 선택된 자료 확인
   - Analysis Steps에서 문서 구조화 진행상황 확인
   - Processing Display에서 실시간 작성 현황 확인

### 4. 결과 검토 및 수정
1. Output Section의 Results Display에서 AI가 생성한 준비서면 초안 검토
2. ModifyDocumentButton(✏️)을 사용해 필요한 부분 수정 지시
3. EditHistory를 통해 수정 이력 확인

### 5. 최종 확정
1. Action Buttons의 "변경사항 적용" 클릭
2. "프로젝트에 저장" 버튼으로 최종 저장

## 예상 결과
- 상대방의 채무불이행을 논리적으로 주장하는 준비서면 완성
- 관련 증거, 법령, 판례가 적절히 인용된 상태
- 프로젝트 목표와 주장이 문서에 효과적으로 반영

## 예외 상황 처리
1. 자료 선택 중 필요한 자료가 없는 경우:
   - DataPickerTrigger를 통해 새로운 자료 추가
2. AI 작성 중 오류 발생 시:
   - Error Display의 재시도 옵션 사용
3. 수정 필요 시:
   - EditHistory의 이전 버전으로 복원 가능 