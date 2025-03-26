# LegalEditor 인증 및 보안 설계

## 1. 개요
LegalEditor의 인증 및 보안 설계는 사용자 데이터 보호, 권한 관리, 안전한 API 통신을 목표로 합니다. Supabase Auth와 JWT를 활용하여 사용자 인증을 구현하며, 데이터 암호화와 보안 정책을 통해 시스템 안정성을 보장합니다.

## 2. 사용자 인증 흐름
- **로그인**:
  - Supabase Auth를 통한 이메일/소셜 로그인 지원 (예: Google) (`AuthLoginHandlerComponent.tsx`).
  - 이메일로 회원가입한 경우, 인증 링크가 있는 이메일을 보내서, 이메일 인증을 받아 옴. 
  - 로그인 성공 시 JWT 토큰 발급 및 클라이언트 저장 (로컬 스토리지 또는 쿠키) (`AuthTokenStorageComponent.tsx`).
- **회원가입**:
  - 이메일, 비밀번호 입력 후 필수 약관 동의 확인 (`AuthSignupHandlerComponent.tsx`):
    - '서비스이용약관' 필수 동의 (URL: https://www.notion.so/1b4b91b518d98071a2f1fb4e11c8fafc)
    - '개인정보보호정책' 필수 동의 (URL: https://different-beryl-34c.notion.site/1b4b91b518d980fab835cfc0854c6349?pvs=73)
    - '개인정보제공동의' 필수 동의 (URL: https://wandering-drip-c6d.notion.site/1bf3290bcc3c80d4aa8ff8cc729be2d5?pvs=4)
    - '마케팅 정보 수신 동의' 선택 동의
  - 동의 여부 및 동의 일자를 Users 테이블에 기록
  - 약관 동의 없이는 회원가입 불가능하도록 UI 및 백엔드 검증
- **세션 관리**:
  - 토큰 유효 기간 1시간, 자동 갱신 (refresh token 활용) (`AuthSessionManagementComponent.tsx`).
  - 세션 만료 시 사용자 알림 및 로그인 페이지로 리다이렉트 (`AuthSessionExpirationHandlerComponent.tsx`).
- **로그아웃**:
  - 토큰 삭제 및 세션 종료 (`AuthLogoutHandlerComponent.tsx`).
- **비밀번호 재설정**:
  - 이메일 링크를 통한 비밀번호 재설정 기능 (`AuthPasswordResetFlowComponent.tsx`).
  - 임시 토큰 발급 및 유효 기간 설정 (예: 10분) (`AuthTemporaryTokenHandlerComponent.tsx`).

## 3. 권한 관리
- **Supabase RLS (Row Level Security)**:
  - 프로젝트별 데이터 접근 권한 설정 (예: 관리자만 프로젝트 설정 변경 가능) (`SupabaseRLSConfigComponent.tsx`).
  - 사용자 역할별 권한 체계 (`RoleBasedAccessControlComponent.tsx`):
    - 프로젝트 소유자(Owner): 반드시 유료 플랜 사용자만 가능, 모든 AI 기능 접근 가능
    - 관리자(Admin): 유료 플랜 사용자만 가능, 모든 AI 기능 접근 가능
    - 편집자(Editor): 유료 플랜 사용자만 가능, AI 기능 접근 가능
    - 주석자(Commentator): 무료 플랜 사용자도 가능, AI 기능 접근 불가
    - 조회자(Viewer): 무료 플랜 사용자도 가능, AI 기능 접근 불가, AI 생성 콘텐츠 조회만 가능
- **유료 플랜 권한 검증**:
  - 역할 변경 시 플랜 상태 검증 시스템 (`UserPlanVerificationComponent.tsx`).
  - 고급 역할(Owner, Admin, Editor) 부여 시 유료 플랜 확인 로직 (`PremiumRoleAssignmentHandler.tsx`).
  - 결제 만료 시 자동 권한 조정 시스템 (`SubscriptionExpirationHandler.tsx`):
    - 결제 만료 7일 전 알림 발송 (이메일 및 앱 내 알림)
    - 만료일에 14일 유예기간 시작 및 권한 제한 적용
    - 유예기간 종료 후 무료 플랜으로 자동 전환
  - AI 기능 접근 권한 관리 (`AIFeatureAccessController.tsx`):
    - 유료 플랜 사용자만 AI 기능 사용 및 AI 생성 콘텐츠 수정 가능
    - 모든 사용자는 AI 생성 콘텐츠 조회 가능
    - 무료 사용자의 AI 기능 접근 시도 시 업그레이드 유도 UI 표시
  - 저장 데이터 보존 정책 구현 (`DataRetentionPolicyHandler.tsx`):
    - 결제 중단 후 90일간 모든 데이터 원본 보존
    - 90일 이후 무료 플랜 초과 데이터 아카이브 처리
    - 아카이브 데이터 1년간 보관 및 재결제 시 즉시 복구 기능
  - 협업 활성화 유도 시스템 (`CollaborationPromotionComponent.tsx`):
    - AI 기능 미리보기 제공 (무료 사용자 대상)
    - 협업 효율성 통계 표시
    - 팀 전체 유료 전환 시 혜택 안내
- **초대 링크 관리**:
  - 초대 링크 유효 기간 설정 (예: 24시간) (`InviteLinkExpirationHandlerComponent.tsx`).
  - 초대 링크 사용 후 자동 비활성화 (`InviteLinkDeactivationComponent.tsx`).
  - 초대 시 유료 플랜 여부 확인 및 적용 가능 역할 제한 (`InvitationRoleRestrictionComponent.tsx`).

## 4. 보안 정책
- **HTTPS 강제**: 모든 통신은 HTTPS로 암호화 (`HTTPSEnforcementComponent.tsx`).
- **데이터 암호화**:
  - Supabase Storage에 저장된 증거자료는 AES-256으로 암호화 (`DataEncryptionComponent.tsx`).
  - 데이터베이스 내 민감 데이터(예: 사용자 이메일) 암호화 (`SensitiveDataEncryptionComponent.tsx`).
- **CSRF 방지**:
  - API 요청 시 CSRF 토큰 검증 (`CSRFProtectionComponent.tsx`).
- **XSS 방지**:
  - 사용자 입력 데이터 sanitization (DOMPurify 활용) (`XSSPreventionComponent.tsx`).
- **API 보안**:
  - Python 서버 API는 JWT 토큰으로 보호 (`APIAuthenticationHandlerComponent.tsx`).
  - API 요청 속도 제한 (Rate Limiting) 설정 (예: 분당 100회) (`APIRateLimitingComponent.tsx`).

## 5. 에러 처리 및 보안 위협 대응
- **인증 실패**:
  - 로그인 실패 시 사용자 알림 (예: "이메일 또는 비밀번호가 잘못되었습니다") (`AuthFailureNotificationComponent.tsx`).
  - 5회 실패 시 계정 잠금 (30분) (`AuthAccountLockoutComponent.tsx`).
- **보안 위협 감지**:
  - 비정상적인 API 요청 감지 및 차단 (예: 동일 IP에서 비정상적인 요청 패턴) (`SecurityThreatDetectionComponent.tsx`).
  - 보안 로그 기록 및 알림 (예: "비정상적인 로그인 시도 감지: IP 123.456.789.123") (`SecurityLogHandlerComponent.tsx`).