# 인증 및 사용자 관리 UI 설계

## 1. 인증 관련 컴포넌트 UI 트리

### 1.1 로그인 (AuthLoginHandlerComponent)
```
LoginPage
├── LoginForm
│   ├── EmailInput
│   ├── PasswordInput
│   ├── RememberMeCheckbox
│   ├── LoginButton
│   └── ForgotPasswordLink
├── SocialLoginSection
│   └── GoogleLoginButton
│   
└── SignupLink
```

### 1.2 회원가입 (AuthSignupHandlerComponent)
```
SignupPage
├── SignupForm
│   ├── EmailInput
│   ├── PasswordInput
│   ├── PasswordConfirmInput
│   ├── TitleInput
│   └── AgreementSection
│       ├── ServiceTermsCheckbox
│       ├── PrivacyPolicyCheckbox
│       ├── PersonalInfoConsentCheckbox
│       └── MarketingConsentCheckbox
└── SignupButton
```

### 1.3 세션 관리 UI (AuthSessionManagementComponent)
```
SessionManager
├── SessionStatus
│   └── RemainingTimeIndicator
└── SessionRefreshModal
    ├── RefreshButton
    └── LogoutButton
```

### 1.4 비밀번호 재설정 (AuthPasswordResetFlowComponent)
```
PasswordResetFlow
├── RequestResetPage
│   ├── EmailInput
│   └── SendRequestButton
└── ResetPasswordPage
    ├── NewPasswordInput
    ├── ConfirmPasswordInput
    └── ResetButton
```

## 2. 권한 관리 컴포넌트 UI

### 2.1 역할 기반 접근 제어 (RoleBasedAccessControlComponent)
```
RoleManagement
├── RoleSelector
│   ├── OwnerOption
│   ├── AdminOption
│   ├── EditorOption
│   ├── CommentatorOption
│   └── ViewerOption
└── RolePermissionsList
    └── PermissionItem[]
```

### 2.2 플랜 검증 UI (UserPlanVerificationComponent)
```
PlanVerification
├── CurrentPlanDisplay
├── PlanFeaturesList
└── UpgradeButton
```

### 2.3 구독 만료 관리 (SubscriptionExpirationHandler)
```
SubscriptionManager
├── ExpirationWarning
│   ├── DaysRemainingIndicator
│   └── RenewButton
└── GracePeriodNotice
    ├── RemainingDaysDisplay
    └── UpgradePrompt
```

### 2.4 AI 기능 접근 제어 (AIFeatureAccessController)
```
AIFeatureAccess
├── FeatureList
│   └── FeatureItem[]
        ├── FeatureIcon
        ├── FeatureDescription
        └── AccessStatus
└── UpgradePrompt
    ├── PlanComparison
    └── UpgradeButton
```

## 3. 초대 관리 컴포넌트 UI

### 3.1 초대 링크 관리
```
InviteManagement
├── InviteLinkGenerator
│   ├── RoleSelector
│   └── GenerateButton
├── ActiveInvitesList
│   └── InviteItem[]
        ├── LinkDisplay
        ├── ExpirationTimer
        └── DeactivateButton
└── InviteHistory
```

## 4. 보안 관련 UI 컴포넌트

### 4.1 보안 알림 (SecurityNotifications)
```
SecurityAlerts
├── AlertsList
│   └── AlertItem[]
        ├── AlertIcon
        ├── AlertMessage
        └── AlertTimestamp
└── SecurityLogViewer
```

### 4.2 계정 잠금 알림 (AuthAccountLockoutComponent)
```
AccountLockout
├── LockoutStatus
│   ├── RemainingTimeDisplay
│   └── UnlockInstructions
└── FailedAttemptsCounter
```

## 5. 에러 처리 UI

### 5.1 인증 실패 알림 (AuthFailureNotificationComponent)
```
AuthFailureNotification
├── ErrorMessage
├── RetryButton
└── HelpInstructions
```

### 5.2 보안 위협 알림 (SecurityThreatDetectionComponent)
```
SecurityThreatAlert
├── ThreatDescription
├── RecommendedActions
└── ContactSupportButton
```

## 6. 공통 UI 요소

### 6.1 로딩 상태
- 모든 인증 관련 작업 시 스피너 표시
- 진행 상태 표시 바
- 취소 가능한 작업의 경우 취소 버튼 제공

### 6.2 에러 처리
- 사용자 친화적인 에러 메시지
- 문제 해결을 위한 가이드라인
- 필요한 경우 고객 지원 연결 옵션

### 6.3 접근성
- WCAG 2.1 가이드라인 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 고대비 모드 지원

### 6.4 반응형 디자인
- 모바일 우선 접근
- 다양한 화면 크기 지원
- 터치 인터페이스 최적화
