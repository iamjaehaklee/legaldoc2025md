
## 4. 페이먼트 기술적 도입 계획

### 4.1 사용자 계정 및 플랜 관리
- **구현**:
  - **Supabase Auth**: 사용자 인증 및 플랜 상태 저장.
    - 테이블: `users` (필드: `id`, `email`, `plan_type`, `project_count`).
  - **플랜 제한 로직**: 
    - 무료 사용자: `project_count <= 2` 체크 후 프로젝트 생성 차단.
    - 유료 사용자: 플랜별 한도 적용 (예: 스타터는 10개).
- **코드 예시**:
  ```tsx
  import { supabase } from './supabaseClient';

  async function createProject(userId: string) {
    const { data: user } = await supabase.from('users').select('plan_type, project_count').eq('id', userId).single();
    if (user.plan_type === 'free' && user.project_count >= 2) {
      throw new Error('무료 플랜 한도 초과');
    }
    // 프로젝트 생성 로직
  }
  ```

### 4.2 결제 시스템
- **도구**: 
  - **토스페이먼츠**: 한국 결제 게이트웨이 통합 (카드, 계좌이체 지원).
  - **Supabase DB**: 결제 상태 및 구독 정보 저장 (`subscriptions` 테이블).
- **구현**:
  - 결제 성공 시 `users` 테이블의 `plan_type` 업데이트.
  - 월간 결제 자동 갱신 (토스페이먼츠 Webhook 활용).
- **코드 예시**:
  ```tsx
  async function handlePaymentSuccess(paymentKey: string, userId: string) {
    const response = await fetch('https://api.tosspayments.com/v1/payments/' + paymentKey, {
      method: 'POST',
      headers: { Authorization: '토스 API 키' },
    });
    if (response.ok) {
      await supabase.from('users').update({ plan_type: 'starter' }).eq('id', userId);
    }
  }
  ```

### 4.3 기능 제한
- **무료 플랜 제한**:
  - 팀 초대 기능 비활성화: 초대 버튼 회색 처리.
- **코드 예시**:
  ```tsx
  function AIAgentPanel({ user }) {
    if (user.plan_type === 'free') {
      return <div>유료 플랜에서 사용 가능합니다. <button>업그레이드</button></div>;
    }
    return <AIAgentComponent />;
  }
  ```

### 4.4 프로젝트 한도 모니터링
- **구현**:
  - Supabase Realtime으로 `project_count` 실시간 추적.
  - 한도 초과 시 알림 UI 표시.
- **코드 예시**:
  ```tsx
  supabase.from('users').on('UPDATE', (payload) => {
    if (payload.new.project_count >= 2 && payload.new.plan_type === 'free') {
      showNotification('프로젝트 한도 초과! 유료 플랜으로 업그레이드하세요.');
    }
  }).subscribe();
  ```

### 4.5 배포 및 테스트
- **환경**: 
  - Vercel 프로덕션 환경 (`https://legal-editor.vercel.app`).
  - Supabase 프로덕션 DB (`prod_legal_editor`).
- **테스트**:
  - 무료 플랜: 2개 프로젝트 생성 후 제한 동작 확인.
  - 유료 플랜: 결제 후 한도 증가 및 기능 활성화 테스트.

---

## 5. 실행 일정
- **2025년 4월 1일**: 결제 시스템 및 플랜 제한 로직 개발 완료.
- **2025년 4월 7일**: 내부 테스트 및 버그 수정.
- **2025년 4월 14일**: 베타 출시 (무료 플랜 + 유료 플랜 할인 프로모션).
- **2025년 7월 14일**: 정식 출시 (프로모션 종료).

---

## 6. 기대 효과
- **초기 유입**: 첫 3개월 내 1,000명 무료 사용자 확보 목표.
- **전환율**: 무료 사용자 중 10%가 유료 플랜으로 전환 (100명).
- **수익**: 스타터 플랜 기준 월 1,990,000원 (100명 × 19,900원).

```
