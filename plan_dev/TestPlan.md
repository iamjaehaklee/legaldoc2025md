아래는 LegalEditor 테스트 계획을 훨씬 더 자세히 작성한 버전입니다. Markdown 형식으로 제공하니 `.md` 파일에 바로 복사해서 사용할 수 있습니다. 각 섹션에 세부 항목을 추가하고, 예시 코드를 포함하며, 실행 가능한 세부 사항을 보강했습니다.

---

```markdown
# LegalEditor 테스트 계획

## 1. 개요
LegalEditor의 테스트 계획은 소프트웨어의 품질을 보장하고, 주요 기능의 안정성과 신뢰성을 검증하는 데 목적이 있습니다. 이를 위해 유닛 테스트, 통합 테스트, 사용자 테스트를 체계적으로 진행하며, 버그를 최소화하고 사용자 경험을 최적화합니다. 테스트는 개발 주기 전반에 걸쳐 진행되며, 특히 2025년 3월 26일(Day 3)을 주요 마일스톤으로 설정합니다.

---

## 2. 테스트 전략

### 2.1 유닛 테스트
- **목적**: 개별 컴포넌트의 독립적인 동작을 검증하여 코드 수준의 오류를 조기에 발견.
- **대상**: 
  - 에디터 컴포넌트 (텍스트 입력, 스타일링, 포맷팅).
  - 채팅 UI (메시지 입력, 전송, 인용 삽입).
  - AI Agent 패널 (추천 텍스트 생성, 사용자 입력 반영).
- **도구**: 
  - Jest: JavaScript/TypeScript 테스트 프레임워크.
  - React Testing Library: React 컴포넌트 렌더링 및 상호작용 테스트.
- **테스트 케이스 예시**:
  - **에디터 컴포넌트** (`EditorUnitTestSuite.tsx`):
    - 텍스트 입력 시 상태 업데이트 확인.
    - 스타일링 버튼 클릭 시 CSS 클래스 적용 여부 테스트.
    ```tsx
    import { render, fireEvent } from '@testing-library/react';
    import Editor from '../components/Editor';

    test('텍스트 입력 시 상태가 업데이트된다', () => {
      const { getByRole } = render(<Editor />);
      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: '테스트 텍스트' } });
      expect(input.value).toBe('테스트 텍스트');
    });
    ```
  - **채팅 UI** (`ChatUnitTestSuite.tsx`):
    - 메시지 전송 버튼 클릭 시 메시지 목록에 추가되는지 확인.
    - 인용 삽입 시 텍스트에 하이라이트 적용 여부 테스트.
    ```tsx
    test('메시지 전송 시 목록에 추가된다', () => {
      const { getByRole, getByText } = render(<ChatUI />);
      const input = getByRole('textbox');
      const sendButton = getByRole('button', { name: '전송' });
      fireEvent.change(input, { target: { value: '안녕하세요' } });
      fireEvent.click(sendButton);
      expect(getByText('안녕하세요')).toBeInTheDocument();
    });
    ```

### 2.2 통합 테스트
- **목적**: 프론트엔드와 백엔드 간 데이터 흐름 및 API 호출의 안정성을 검증.
- **대상**: 
  - Supabase와 FastAPI 간 API 통합.
  - 주요 기능: 증거자료 업로드, 채팅 메시지 저장 및 동기화.
- **도구**: 
  - Supabase 클라이언트: JavaScript SDK로 DB 및 Storage 테스트.
  - FastAPI 테스트 클라이언트: Python의 `TestClient`로 API 엔드포인트 호출.
- **테스트 케이스 예시**:
  - **증거자료 업로드** (`EvidenceUploadIntegrationTest.tsx`):
    - 파일 업로드 요청 후 Supabase Storage에 파일 존재 여부 확인.
    - 업로드 실패 시 에러 메시지 반환 테스트.
    ```tsx
    import { uploadFile } from '../api/supabase';
    test('파일 업로드 성공 시 Storage에 저장된다', async () => {
      const file = new File(['내용'], 'test.pdf', { type: 'application/pdf' });
      const result = await uploadFile(file);
      expect(result.status).toBe(200);
      // Supabase Storage API로 파일 존재 여부 확인
    });
    ```
  - **채팅 메시지 저장** (`ChatMessageIntegrationTest.tsx`):
    - 메시지 전송 후 Supabase Realtime 테이블에 저장 확인.
    - Realtime 구독으로 동기화된 메시지 수신 테스트.
    ```tsx
    import { supabase } from '../supabaseClient';
    test('메시지 저장 후 Realtime 동기화 확인', async () => {
      const message = { text: '테스트 메시지', user_id: 'user1' };
      await supabase.from('messages').insert(message);
      const { data } = await supabase.from('messages').select('*').eq('text', '테스트 메시지');
      expect(data[0].text).toBe('테스트 메시지');
    });
    ```

### 2.3 사용자 테스트
- **목적**: 실제 사용자 시나리오에서 기능의 유용성과 안정성을 평가.
- **대상**: 
  - 문서 작성 (에디터 및 증거 인용).
  - 증거 뷰어 (파일 렌더링 및 탐색).
  - 채팅 (실시간 대화 및 인용).
  - 프로젝트분석 (AI 기반 추천).
- **방법**: 
  - 5명의 테스트 사용자에게 Vercel 스테이징 환경 배포.
  - Google Forms로 정량적(5점 척도) 및 정성적(서술형) 피드백 수집.
- **테스트 케이스 예시**:
  - **문서 작성** (`DocumentEditorUserTest.tsx`):
    - 사용자가 계약서를 작성하고 PDF 증거자료를 인용하는 과정 기록.
    - 목표: 인용 삽입 시간이 5초 미만, 오류 0건.
  - **프로젝트분석** (`ProjectAnalysisUserTest.tsx`):
    - AI 추천 목표/주장이 문서 내용과 관련 있는지 사용자 평가.
    - 목표: 80% 이상의 사용자가 "유용하다"고 응답.

---

## 3. 테스트 일정

### 3.1 Day 3 (2025년 3월 26일) 오전
- **유닛 테스트**:
  - 주요 컴포넌트 (에디터, 채팅 UI, AI Agent 패널) 테스트 완료.
  - 성공 기준: 90% 이상 코드 커버리지, 실패 케이스 0건.
- **통합 테스트**:
  - Supabase와 FastAPI API 통합 테스트 완료.
  - 성공 기준: 모든 API 호출 응답 시간 2초 미만, 오류 0건.

### 3.2 Day 3 (2025년 3월 26일) 오후
- **사용자 테스트**:
  - Vercel 스테이징 환경 배포 후 5명에게 링크 제공.
  - 24시간 내 Google Forms로 피드백 수집 완료.

### 3.3 피드백 반영
- **피드백 분석 및 우선순위 설정** (`FeedbackPrioritizationComponent.tsx`):
  - 버그 수정 (우선순위 1): 예: 채팅 메시지 누락.
  - 기능 개선 (우선순위 2): 예: AI 추천 속도 향상.
- **패치 배포** (`PatchDeploymentComponent.tsx`):
  - 피드백 반영 후 Vercel로 패치 배포.
  - 배포 시간: 2025년 3월 27일 오전 10시 목표.

---

## 4. 테스트 환경

### 4.1 프론트엔드
- **로컬 개발 환경**: Vite 기반 (포트: 5173).
- **테스트 환경**: Vercel 스테이징 (URL: `https://legal-editor-staging.vercel.app`).
- **지원 브라우저**: Chrome (최신), Firefox (최신), Safari (최신).

### 4.2 백엔드
- **Supabase 테스트 DB**: 
  - 프로젝트: `test_legal_editor`.
  - 테이블: `messages`, `evidence`, `documents`.
- **FastAPI 테스트 서버**: 
  - 로컬: `http://localhost:8000`.
  - 스테이징: `https://legal-editor-api-staging.vercel.app`.

### 4.3 사용자 테스트
- **환경**: 실제 사용자 장치 및 네트워크.
- **최소 사양**: 4GB RAM, 인터넷 속도 10Mbps 이상.

---

## 5. 테스트 결과 보고

### 5.1 결과 정리
- **도구**: Google Sheets.
- **항목**: 
  - "테스트 케이스": 예: "텍스트 입력 시 상태 업데이트".
  - "결과": "성공" / "실패".
  - "수정 필요 여부": "예" / "아니오".
- **예시** (`TestResultsReportComponent.tsx`):
  ```
  | 테스트 케이스                | 결과  | 수정 필요 여부 |
  |-----------------------------|-------|----------------|
  | 텍스트 입력 시 상태 업데이트 | 성공  | 아니오         |
  | 메시지 전송 후 동기화       | 실패  | 예            |
  ```

### 5.2 버그 추적
- **도구**: GitHub Issues.
- **프로세스**:
  - 실패 케이스 발견 시 이슈 생성 (제목: "[Bug] 메시지 동기화 실패").
  - 담당자 할당 및 해결 상태 추적 (`BugTrackingComponent.tsx`).

---

## 6. 추가 고려사항
- **성능 테스트**: 문서 작성 시 로딩 시간 1초 미만 목표 (미래 계획).
- **보안 테스트**: Supabase 인증 및 FastAPI 엔드포인트 보안 점검 (별도 일정).
- **확장성**: 사용자 100명 동시 접속 시 서버 안정성 테스트 (향후 계획).

```
