> 이 파일은 [GlobalUIDesign.md](../../ui_structure/GlobalUIDesign.md) 파일에서 인용됨

# 프로젝트데이터 네비게이션 UI 설계



## 1. 전체 레이아웃

### 1.1 상단 탭 네비게이션 (`ProjectDataTabNavigationComponent.tsx`)
- "프로젝트데이터" 리스트를 보여 주기 위하여, 다음 탭들(아이콘)을 가로로 배치:
  - "증거자료" 탭 (기본 선택) : 폴더/파일 트리구조
  - "참고자료" 탭 : 폴더/파일 트리구조
  - "주장서류" 탭 : 폴더/파일 트리구조
  - "법령" 탭
  - "판례" 탭
  - "작성문서" 탭 : 폴더/파일 트리구조
  - "프로젝트최종결정문"탭 : 폴더/파일 트리구조

- 각 탭에는 해당 자료의 개수를 뱃지로 표시 
- 마지막으로 선택한 탭 정보를 localStorage에 저장하여 재방문 시 복원

### 1.2 자료 목록 패널 (`ProjectDataListPanelComponent.tsx`)
- 검색창(제목 및 내용으로 검색): 현재 선택된 탭의 자료들을 결과 보여 줌. 단, 다른 각 탭에도 검색 결과 자료의 개수를 뱃지로 표시.
- 폴더/파일 트리구조인 탭들
    - 정렬 옵션: 날짜순/이름순/크기순
    - 필터 옵션: 파일 형식별, 작성자별, 날짜 범위별
    - 자료 항목 표시:
        - 파일 아이콘 (형식별 다른 아이콘) / 자료명 / 댓글 수 뱃지
- 법령/판례 탭들
    - 정렬 옵션: 법령은 법령명순, 법령/판례는 관련도순.    
    - 법령/판례 항목 표시:
        - 법령 : 법령명칭 / 조항번호 및 제목 / 조항내용(앞부분 및 키워드 해당 부분)
        - 판례 : 법원명 / 선고일자 / 사건번호 / 판례내용(키워드 해당 부분)
- 무한 스크롤로 추가 자료 로딩
- 마우스 호버 하는 경우, 각 자료에 대한 미리보기 모달이 화면에 보여 짐. 이 미리보기 모달에서 '열기'를 누르면 워크스페이스스크린에 서브탭스크린으로 열리는 것임. 
- 미리보기 모달에서 자료의 내용을 스크롤하여 보다가 특정 페이지를 보던 상태에서 해당 미리보기 모달이 닫힌 경우, 다시 그 자료에 대한 미리보기 모달이 열리면 직전에 보던 페이지가 다시 보여지는 것임.   
 

## 2. 상태 관리
- Redux/Zustand로 다음 상태 관리:
  - 현재 선택된 네비게이터 탭 ("증거자료", "참고자료", "주장서류", "법령", "판례",  "작성문서", "프로젝트최종결정문" 중 하나)
  - 현재 선택된 자료의 정보 (ID, 종류, 메타데이터)
  - 자료 목록 필터링/정렬 설정 (날짜순/이름순/크기순, 파일 형식별/작성자별/날짜 범위별)
  - 검색어 및 검색 필터 상태
  - 미리보기 모달 상태:
    - 표시 여부
    - 현재 표시 중인 자료 ID
    - 마지막 스크롤 위치    
  - 댓글 패널 표시/숨김 상태

- localStorage에 저장할 상태:
  - 마지막으로 선택한 네비게이터 탭
  - 자료 목록 필터링/정렬 설정
  - 미리보기 모달의 설정 (자료별):
    - 마지막 스크롤 위치
    - 확대/축소 비율



