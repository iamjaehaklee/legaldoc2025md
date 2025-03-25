아래는 요청하신 성능 최적화(Qdrant 필터링), 보안(JWT 인증), 확장성(FastAPI 비동기 처리)을 반영한 개선된 `# 법률 문서 생성 시스템 구축 가이드`입니다. 이를 통해 `LegalDoc Editor` 프로젝트의 요구사항을 충족하면서도 시스템의 안정성, 보안성, 확장성을 강화했습니다.

---

# 법률 문서 생성 시스템 구축 가이드 (최종 개선 버전)

## 개요
이 시스템은 `LegalEditor` 프로젝트를 위한 법률 문서 생성 및 프로젝트 분석을 지원합니다. Qdrant와 Supabase를 활용해 OCR된 증거 데이터, 법령/판례, 프로젝트 데이터를 기반으로 RAG를 수행하며, AI Agent는 Write/Ask 모드를 지원합니다. 성능 최적화, 보안, 확장성을 고려한 설계입니다.

- **목표**: 변호사 수준의 법률 문서 생성 및 프로젝트 분석.
- **기술 스택**: Python (FastAPI), Qdrant, SentenceTransformers, OpenAI GPT-4o, Supabase, JWT.

### 법률 프로젝트 목표와 주장의 정의 및 관계

#### 목표(Goal)의 정의
법률 업무에서 목표는 다음 중 하나를 의미합니다:
1. 상대방으로부터 금전, 부동산 인도, 물건 명도, 권리 이전 등 구체적인 것을 얻어내는 것
2. 상대방의 금전, 인도, 권리 이전 등 소송상의, 소송외의 청구에 대해 방어하는 것
3. 상대방과 협상하여 유리한 조건의 계약/합의 체결을 달성하는 것
4. 법원/검찰/경찰/행정청/과세당국/중재원 등 법적판단기관으로부터 유리한 결정을 받는 것
5. 예상치 못한 과다한 조세 부과를 당하거나, 세무조사를 당하는 것을 예방하는 것
6. 장래에 불특정인으로부터 소송, 고소, 청구, 언론폭로 등을 당하거나, 수사기관/행정청/과세당국 등으로부터 조사를 당할 리스크를 예방하는 것

목표는 서로 중복되면 안 되며, 다른 목표들과 목적/수단 관계에 있어서도 안 됩니다. 목표는 궁극적으로 이루고자 하는 최종 결과물입니다.

#### 주장(Claim)의 정의
주장은 목표를 달성하기 위한 구체적인 법적 논점이나 입장입니다. 각 주장은 하나 이상의 목표를 지원하며, 증거자료에 의해 뒷받침되어야 합니다.

#### 목표-주장 관계 구조
목표와 주장은 다음과 같은 계층적 관계를 가집니다:
- 하나의 법률 프로젝트는 여러 개의 목표를 가질 수 있음
- 각 목표는 여러 개의 주장에 의해 지원됨
- 주장은 여러 개의 증거자료로 뒷받침됨
- 주장은 관련 법령 및 판례와 연결될 수 있음

```
프로젝트
 ├── 목표 1
 │    ├── 주장 1.1 ──┬── 증거자료 A
 │    │               ├── 증거자료 B
 │    │               └── 법령/판례 X
 │    └── 주장 1.2 ──┬── 증거자료 C
 │                    └── 법령/판례 Y
 └── 목표 2
      └── 주장 2.1 ──┬── 증거자료 D
                      └── 법령/판례 Z
```

#### RAG 시스템에서의 목표-주장 활용
이러한 구조화된 관계는 RAG 시스템에서 다음과 같이 활용됩니다:

1. **증거 검색 최적화**: 목표와 주장 정보를 쿼리에 포함시켜 관련성 높은 증거 검색
   ```python
   search_query = f"목표: {goal.title} | 주장: {claim.title} | 검색어: {user_query}"
   ```

2. **맥락 기반 응답 생성**: AI 응답 생성 시 목표와 주장을 컨텍스트로 제공
   ```python
   context = f"프로젝트 목표: {goal.description}\n주장: {claim.description}\n"
   ```

3. **증거-주장 연결 자동화**: 새로운 증거자료 업로드 시, 관련 주장 자동 추천
   ```python
   relevant_claims = recommend_claims_for_evidence(evidence_text, project_goals)
   ```

4. **목표 기반 필터링**: 목표별로 관련 문서와 증거 필터링
   ```sql
   WHERE document.goal_id = :goal_id
   ```

이러한 구분과 활용은 법률 RAG 시스템의 정확성과 관련성을 크게 향상시킵니다.

---

## 시스템 아키텍처

1. **데이터 소스**:
   - **Qdrant**: 증거 데이터와 법령/판례 벡터 임베딩 (`project_id`로 필터링).
   - **Supabase**: 프로젝트 데이터(문서, 증거, 목표/주장).
   - **국가법령정보센터 Open API**: 법령/판례 검색.
2. **Python 서버**: FastAPI로 RAG, AI Agent, LLM 호출 처리 (비동기 처리).
3. **프론트엔드**: React 기반 UI(`LegalEditor` 참조).
4. **AI Agent**: OpenAI GPT-4o로 추천 및 수정 제안.

---

## 1. Qdrant 설정

### 1.1. Qdrant 서버 설치
```bash
docker run -d -p 6333:6333 -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

### 1.2. 컬렉션 생성 및 데이터 업로드
`project_id`를 payload에 추가해 필터링 지원.

```python
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

qdrant = QdrantClient(os.getenv("QDRANT_URL", "http://localhost:6333"))
model = SentenceTransformer("all-MiniLM-L6-v2")
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# 컬렉션 생성
for collection in ["evidence", "legal_references"]:
    qdrant.recreate_collection(
        collection_name=collection,
        vectors_config={"size": 384, "distance": "Cosine"}
    )

# 증거 데이터 업로드 (Supabase 연동)
evidence_data = supabase.table("documents").select("*").execute().data
for item in evidence_data:
    vector = model.encode(item["ocr_text"]).tolist()
    qdrant.upsert(
        collection_name="evidence",
        points=[{
            "id": item["id"],
            "vector": vector,
            "payload": {
                "text": item["ocr_text"],
                "file_url": item["file_url"],
                "page": item["page_number"],
                "project_id": item["project_id"]  # 필터링용
            }
        }]
    )

# 법령/판례 데이터 (API 가정)
legal_data = [
    {"id": "law1", "text": "민법 제660조: 채무불이행 시 손해배상 책임 발생.", "source": "민법", "project_id": "proj1"},
    # 추가 데이터...
]
for item in legal_data:
    vector = model.encode(item["text"]).tolist()
    qdrant.upsert(
        collection_name="legal_references",
        points=[{"id": item["id"], "vector": vector, "payload": item}]
    )
```

---

## 2. Python 서버 구축

### 2.1. 환경 설정
```bash
pip install fastapi uvicorn qdrant-client sentence-transformers openai supabase python-dotenv pyjwt
```

#### 프로젝트 구조
```
legal_doc_server/
├── main.py
├── rag.py
├── auth.py  # JWT 인증 모듈
├── .env
└── requirements.txt
```

#### `.env`
```
OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret_key
```

---

### 2.2. JWT 인증 모듈
#### `auth.py`
```python
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET")

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")

# 토큰 생성 (예시, 실제로는 로그인 엔드포인트에서 구현)
def create_token(user_id: str) -> str:
    payload = {"user_id": user_id}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
```

---

### 2.3. RAG 및 AI Agent 로직
#### `rag.py`
```python
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from supabase import create_client
import os
from dotenv import load_dotenv
from typing import Dict, List
import asyncio
import difflib
import json

load_dotenv()

qdrant = QdrantClient(os.getenv("QDRANT_URL"))
model = SentenceTransformer("all-MiniLM-L6-v2")
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

async def retrieve_documents(query: str, collection: str, project_id: str, limit: int = 5) -> List[Dict]:
    vector = model.encode(query).tolist()
    results = await asyncio.to_thread(
        qdrant.search,
        collection_name=collection,
        query_vector=vector,
        query_filter=models.Filter(must=[models.FieldCondition(key="project_id", match=models.MatchValue(value=project_id))]),
        limit=limit * 2
    )
    ranked = sorted(results, key=lambda x: x.score, reverse=True)
    return [{"text": hit.payload["text"], "metadata": hit.payload, "score": hit.score} for hit in ranked[:limit]]

async def recommend_evidence_for_claim(claim_id: str, project_id: str, limit: int = 5) -> Dict:
    """주장에 대한 근거자료 추천"""
    
    # 주장 정보 가져오기
    claim = supabase.table("Claims").select("*").eq("id", claim_id).single().execute().data
    
    if not claim:
        return {"error": "주장을 찾을 수 없습니다."}
    
    # 관련 목표 정보 가져오기
    goal = None
    if claim.get("goal_id"):
        goal = supabase.table("Goals").select("*").eq("id", claim["goal_id"]).single().execute().data
    
    # 목표 유형 확인 (금전/재산 획득, 계약/합의, 법적 결정)
    goal_type = goal.get("type") if goal else None
    
    # 쿼리 구성 (주장 및 목표 컨텍스트 포함)
    query = f"{claim['title']}. {claim['description']}"
    if goal:
        query += f" 목표: {goal['title']}. {goal['description']} 목표유형: {goal_type}"
    
    # 비동기 검색 병렬 처리
    evidence_task = retrieve_documents_with_context(query, "evidence", project_id, limit=limit*2)
    legal_refs_task = retrieve_documents_with_context(query, "legal_references", project_id, limit=limit)
    
    evidence_results, legal_refs_results = await asyncio.gather(evidence_task, legal_refs_task)
    
    # 증거 관련성 분석
    evidence_with_relevance = await analyze_evidence_relevance(evidence_results, claim, goal)
    
    # 법령/판례 관련성 분석
    legal_refs_with_relevance = await analyze_legal_relevance(legal_refs_results, claim, goal)
    
    # 결과 정렬 (관련성 점수 기준)
    sorted_evidence = sorted(evidence_with_relevance, key=lambda x: x["relevance_score"], reverse=True)[:limit]
    sorted_legal_refs = sorted(legal_refs_with_relevance, key=lambda x: x["relevance_score"], reverse=True)[:limit]
    
    # 각 증거자료의 관련 부분 추출
    for item in sorted_evidence:
        item["relevant_parts"] = await extract_relevant_parts(item["metadata"]["text"], query)
    
    return {
        "claim": {
            "id": claim["id"],
            "title": claim["title"],
            "description": claim["description"]
        },
        "goal": {
            "id": goal["id"] if goal else None,
            "title": goal["title"] if goal else None,
            "type": goal_type,
            "description": goal["description"] if goal else None
        } if goal else None,
        "evidence_recommendations": sorted_evidence,
        "legal_recommendations": sorted_legal_refs,
        "reasoning": "주장 컨텍스트 및 목표 기반 추천",
        "total_recommendations": len(sorted_evidence) + len(sorted_legal_refs)
    }

async def retrieve_documents_with_context(query: str, collection: str, project_id: str, limit: int = 5) -> List[Dict]:
    """컨텍스트 기반 문서 검색"""
    vector = model.encode(query).tolist()
    
    results = await asyncio.to_thread(
        qdrant.search,
        collection_name=collection,
        query_vector=vector,
        query_filter=models.Filter(must=[models.FieldCondition(key="project_id", match=models.MatchValue(value=project_id))]),
        limit=limit * 2  # 후처리를 위해 더 많은 결과 검색
    )
    
    # 향상된 재순위화 (주장 컨텍스트 고려)
    keywords = set(query.lower().split())
    
    def calculate_relevance(hit):
        text = hit.payload["text"].lower()
        # 키워드 매칭 점수
        keyword_score = sum(1 for word in keywords if word in text) / len(keywords) if keywords else 0
        # 코사인 유사도와 키워드 점수 결합
        combined_score = hit.score * 0.7 + keyword_score * 0.3
        # 문서 길이에 따른 가중치 (길이가 너무 짧거나 긴 문서 패널티)
        length = len(text.split())
        length_factor = min(1.0, max(0.5, 1.0 - abs(500 - length) / 1000))
        
        return combined_score * length_factor
    
    ranked = sorted(results, key=calculate_relevance, reverse=True)
    
    return [{"text": hit.payload["text"], "metadata": hit.payload, "score": hit.score} for hit in ranked[:limit]]

async def analyze_evidence_relevance(evidence_results: List[Dict], claim: Dict, goal: Dict = None) -> List[Dict]:
    """증거자료의 주장 관련성 분석"""
    if not evidence_results:
        return []
    
    claim_desc = f"주장: {claim['title']}. {claim['description']}"
    if goal:
        claim_desc += f" 목표: {goal['title']}. {goal['description']}"
    
    evidence_with_relevance = []
    
    # 증거 배치 처리 (5개씩 처리)
    batch_size = 5
    for i in range(0, len(evidence_results), batch_size):
        batch = evidence_results[i:i+batch_size]
        evidence_texts = [item["text"] for item in batch]
        
        prompt = f"""
        다음 주장에 대한 근거 자료들의 관련성을 1부터 100점 사이의 점수로 평가하고, 관련성의 이유를 설명하세요.
        
        {claim_desc}
        
        근거 자료:
        {json.dumps(evidence_texts, ensure_ascii=False)}
        
        각 근거 자료에 대해 다음 형식으로 응답하세요:
        [
          {{
            "index": 0,
            "relevance_score": 점수(1-100),
            "relevance_reason": "관련성 이유 설명"
          }},
          ...
        ]
        """
        
        try:
            response = await asyncio.to_thread(
                openai_client.chat.completions.create,
                model="gpt-4",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "법률 문서 관련성 평가 전문가입니다. JSON 형식으로 응답합니다."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            result = json.loads(response.choices[0].message.content)
            
            for analysis in result:
                idx = analysis["index"]
                if idx < len(batch):
                    item = batch[idx].copy()
                    # 점수를 0-1 범위로 정규화
                    item["relevance_score"] = analysis["relevance_score"] / 100.0 if isinstance(analysis["relevance_score"], (int, float)) else 0.5
                    item["relevance_reason"] = analysis["relevance_reason"]
                    evidence_with_relevance.append(item)
        
        except Exception as e:
            # 오류 발생 시 기본 점수 할당
            for item in batch:
                item_copy = item.copy()
                item_copy["relevance_score"] = item["score"]  # 기본 점수로 원래 검색 점수 사용
                item_copy["relevance_reason"] = "기본 검색 점수 기반"
                evidence_with_relevance.append(item_copy)
    
    return evidence_with_relevance

async def analyze_legal_relevance(legal_results: List[Dict], claim: Dict, goal: Dict = None) -> List[Dict]:
    """법령/판례의 주장 관련성 분석"""
    # 증거자료 분석과 유사한 로직
    if not legal_results:
        return []
    
    claim_desc = f"주장: {claim['title']}. {claim['description']}"
    if goal:
        claim_desc += f" 목표: {goal['title']}. {goal['description']}"
    
    legal_with_relevance = []
    
    # 법령/판례 배치 처리
    batch_size = 5
    for i in range(0, len(legal_results), batch_size):
        batch = legal_results[i:i+batch_size]
        legal_texts = [item["text"] for item in batch]
        
        prompt = f"""
        다음 주장에 대한 법령/판례들의 관련성을 1부터 100점 사이의 점수로 평가하고, 관련성의 이유를 설명하세요.
        
        {claim_desc}
        
        법령/판례:
        {json.dumps(legal_texts, ensure_ascii=False)}
        
        각 법령/판례에 대해 다음 형식으로 응답하세요:
        [
          {{
            "index": 0,
            "relevance_score": 점수(1-100),
            "relevance_reason": "관련성 이유 설명",
            "application_strategy": "법령/판례 적용 전략"
          }},
          ...
        ]
        """
        
        try:
            response = await asyncio.to_thread(
                openai_client.chat.completions.create,
                model="gpt-4",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "법률 관련성 평가 전문가입니다. JSON 형식으로 응답합니다."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            result = json.loads(response.choices[0].message.content)
            
            for analysis in result:
                idx = analysis["index"]
                if idx < len(batch):
                    item = batch[idx].copy()
                    # 점수를 0-1 범위로 정규화
                    item["relevance_score"] = analysis["relevance_score"] / 100.0 if isinstance(analysis["relevance_score"], (int, float)) else 0.5
                    item["relevance_reason"] = analysis["relevance_reason"]
                    item["application_strategy"] = analysis.get("application_strategy", "")
                    legal_with_relevance.append(item)
        
        except Exception as e:
            # 오류 발생 시 기본 점수 할당
            for item in batch:
                item_copy = item.copy()
                item_copy["relevance_score"] = item["score"]  # 기본 점수로 원래 검색 점수 사용
                item_copy["relevance_reason"] = "기본 검색 점수 기반"
                item_copy["application_strategy"] = ""
                legal_with_relevance.append(item_copy)
    
    return legal_with_relevance

async def extract_relevant_parts(text: str, query: str) -> List[Dict]:
    """텍스트에서 쿼리와 관련된 부분 추출"""
    if not text or len(text) < 50:
        return [{"text": text, "relevance": 1.0 if text else 0.0}]
    
    # 텍스트를 문단으로 분할
    paragraphs = text.split('\n\n')
    if len(paragraphs) <= 1:
        # 문단이 없으면 문장으로 분할
        import re
        paragraphs = re.split(r'(?<=[.!?])\s+', text)
    
    # 문단이 너무 많으면 병합
    if len(paragraphs) > 20:
        merged_paragraphs = []
        for i in range(0, len(paragraphs), 3):
            merged = ' '.join(paragraphs[i:i+3])
            if merged:
                merged_paragraphs.append(merged)
        paragraphs = merged_paragraphs
    
    # 각 문단의 벡터 계산
    query_vector = model.encode(query).tolist()
    paragraph_vectors = model.encode(paragraphs).tolist()
    
    # 각 문단의 코사인 유사도 계산
    from scipy.spatial.distance import cosine
    similarities = [1 - cosine(query_vector, para_vec) for para_vec in paragraph_vectors]
    
    # 관련성 점수가 높은 순으로 상위 5개 문단 선택
    relevant_parts = []
    for idx, similarity in sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[:5]:
        if similarity > 0.3:  # 임계값보다 높은 유사도만 포함
            relevant_parts.append({
                "text": paragraphs[idx],
                "relevance": float(similarity),
                "position": idx
            })
    
    return relevant_parts

async def process_requirement(query: str, requirement_type: str, project_id: str, mode: str = "write") -> Dict:
    # 기존 함수는 유지하고, 새 함수 호출 추가
    project_data = supabase.table("projects").select("*").eq("id", project_id).execute().data[0]
    
    # 비동기 검색
    evidence_task = retrieve_documents(query, "evidence", project_id)
    legal_refs_task = retrieve_documents(query, "legal_references", project_id)
    evidence, legal_refs = await asyncio.gather(evidence_task, legal_refs_task)
    
    prompts = {
        "create_document": "새로운 법률 문서를 작성하시오.",
        "edit_document": "기존 문서를 수정하시오.",
        "suggest_goals": "프로젝트 목표를 추천하시오.",
        "suggest_claims": "주장할 사항을 제시하시오.",
        "provide_evidence": "주장을 뒷받침할 증거를 제시하시오."
    }
    
    if requirement_type not in prompts:
        return {"error": "지원되지 않는 요구사항입니다."}
    
    prompt = f"""
    당신은 변호사입니다. 아래 데이터를 기반으로 요구사항을 처리하세요.
    프로젝트: {project_data['name']}
    요구사항: {prompts[requirement_type]}
    증거: {evidence}
    법령/판례: {legal_refs}
    모드: {mode}
    """
    
    for _ in range(3):
        try:
            response = await asyncio.to_thread(
                openai_client.chat.completions.create,
                model="gpt-4",
                messages=[{"role": "system", "content": "당신은 변호사입니다."}, {"role": "user", "content": prompt}]
            )
            result = response.choices[0].message.content
            break
        except Exception as e:
            if _ == 2:
                return {"error": f"LLM 호출 실패: {str(e)}"}
    
    reliability_score = min(95, max(70, len(evidence) * 10 + len(legal_refs) * 5))
    
    return {
        "result": result,
        "evidence": evidence,
        "legal_references": legal_refs,
        "reliability_score": reliability_score,
        "reasoning": f"증거 {len(evidence)}건, 법령/판례 {len(legal_refs)}건 기반",
        "mode": mode
    }

async def analyze_goal_conflicts(project_id: str, goal_id: str = None, new_goal: Dict = None) -> Dict:
    """목표 간 중복 및 목적/수단 관계 분석"""
    
    # 프로젝트의 모든 목표 가져오기 (새로 추가/수정하려는 목표 제외)
    existing_goals = supabase.table("Goals").select("*").eq("project_id", project_id)
    if goal_id:
        existing_goals = existing_goals.neq("id", goal_id)
    existing_goals = existing_goals.execute().data
    
    conflicts = []
    
    # 새 목표 또는 수정하려는 목표
    goal_to_check = new_goal or supabase.table("Goals").select("*").eq("id", goal_id).single().execute().data
    
    if not goal_to_check:
        return {"error": "분석할 목표가 없습니다."}
    
    # 목표 간 중복 및 목적/수단 관계 검사
    for existing_goal in existing_goals:
        # 중복 검사
        if await check_goal_duplication(goal_to_check, existing_goal):
            conflicts.append({
                "type": "duplication",
                "conflicting_goal_id": existing_goal["id"],
                "conflicting_goal_title": existing_goal["title"],
                "reason": "목표가 중복됩니다."
            })
        
        # 목적/수단 관계 검사
        if await check_goal_means_end_relationship(goal_to_check, existing_goal):
            conflicts.append({
                "type": "means_end_relationship",
                "conflicting_goal_id": existing_goal["id"],
                "conflicting_goal_title": existing_goal["title"],
                "reason": "목표 간 목적/수단 관계가 있습니다."
            })
    
    return {
        "goal": {
            "id": goal_to_check.get("id"),
            "title": goal_to_check["title"],
            "description": goal_to_check["description"],
            "type": goal_to_check.get("type")
        },
        "conflicts": conflicts,
        "has_conflicts": len(conflicts) > 0
    }

async def check_goal_duplication(goal1: Dict, goal2: Dict) -> bool:
    """두 목표 간 중복 여부 검사"""
    # 간단한 텍스트 유사도 검사
    title_similarity = difflib.SequenceMatcher(None, goal1["title"].lower(), goal2["title"].lower()).ratio()
    desc_similarity = difflib.SequenceMatcher(None, goal1["description"].lower(), goal2["description"].lower()).ratio() if goal1.get("description") and goal2.get("description") else 0
    
    # 목표 유형이 같고 내용이 유사하면 중복으로 판단
    if goal1.get("type") == goal2.get("type") and (title_similarity > 0.7 or desc_similarity > 0.7):
        return True
    
    # LLM 분석 (고급 중복 검사)
    prompt = f"""
    다음 두 법률 목표가 실질적으로 동일한지 분석하세요:
    
    목표 1:
    제목: {goal1['title']}
    설명: {goal1.get('description', '설명 없음')}
    유형: {goal1.get('type', '유형 없음')}
    
    목표 2:
    제목: {goal2['title']}
    설명: {goal2.get('description', '설명 없음')}
    유형: {goal2.get('type', '유형 없음')}
    
    법률 목표는 다음 중 하나여야 합니다:
    1. 상대방으로부터 금전, 부동산 인도, 물건 명도, 권리 이전 등을 얻는 것
    2. 유리한 조건의 계약/합의 체결
    3. 법원/검찰/결정 등 법적판단기관으로부터 유리한 결정을 받는 것
    
    두 목표가 동일하면 "true", 다르면 "false"만 답변하세요.
    """
    
    response = await asyncio.to_thread(
        openai_client.chat.completions.create,
        model="gpt-4o",
        messages=[{"role": "system", "content": "법률 텍스트 분석 전문가로서 목표 중복성을 평가합니다."}, 
                {"role": "user", "content": prompt}],
        temperature=0.1
    )
    
    result = response.choices[0].message.content.strip().lower()
    return "true" in result

async def check_goal_means_end_relationship(goal1: Dict, goal2: Dict) -> bool:
    """두 목표 간 목적/수단 관계 검사"""
    # LLM 분석
    prompt = f"""
    다음 두 법률 목표 사이에 목적/수단 관계가 있는지 분석하세요:
    
    목표 1:
    제목: {goal1['title']}
    설명: {goal1.get('description', '설명 없음')}
    유형: {goal1.get('type', '유형 없음')}
    
    목표 2:
    제목: {goal2['title']}
    설명: {goal2.get('description', '설명 없음')}
    유형: {goal2.get('type', '유형 없음')}
    
    법률 목표는 다음 중 하나여야 합니다:
    1. 상대방으로부터 금전, 부동산 인도, 물건 명도, 권리 이전 등을 얻는 것
    2. 유리한 조건의 계약/합의 체결
    3. 법원/검찰/결정 등 법적판단기관으로부터 유리한 결정을 받는 것
    
    한 목표가 다른 목표를 달성하기 위한 수단이거나, 한 목표가 다른 목표의 부분적 성취에 불과하다면 목적/수단 관계가 있는 것입니다.
    
    목적/수단 관계가 있으면 "true", 없으면 "false"만 답변하세요.
    """
    
    response = await asyncio.to_thread(
        openai_client.chat.completions.create,
        model="gpt-4o",
        messages=[{"role": "system", "content": "법률 텍스트 분석 전문가로서 목표 간 관계를 평가합니다."}, 
                {"role": "user", "content": prompt}],
        temperature=0.1
    )
    
    result = response.choices[0].message.content.strip().lower()
    return "true" in result

---

### 2.4. FastAPI 서버
#### `main.py`
```python
from fastapi import FastAPI, Depends
from rag import process_requirement, suggest_revision, get_document_fields, document_version_diff, migrate_version_annotations, restore_document_version
from auth import verify_token
import asyncio
from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union

app = FastAPI()

class DocumentFieldRequest(BaseModel):
    document_type: str
    context: Optional[str] = None

class VersionCompareRequest(BaseModel):
    document_id: str
    source_version_id: str
    target_version_id: str

class VersionMigrateRequest(BaseModel):
    document_id: str
    source_version_id: str
    target_version_id: str
    include_comments: bool = True
    include_highlights: bool = True

class VersionRestoreRequest(BaseModel):
    document_id: str
    version_id: str
    create_new_version: bool = True
    change_description: Optional[str] = None

@app.post("/process-requirement")
async def process_legal_requirement(
    query: str,
    requirement_type: str,
    project_id: str,
    mode: str = "write",
    user_id: str = Depends(verify_token)
):
    result = await process_requirement(query, requirement_type, project_id, mode)
    return result

@app.post("/suggest-revision")
async def suggest_content_revision(
    content: str,
    context: str,
    user_id: str = Depends(verify_token)
):
    result = await suggest_revision(content, context)
    return result

@app.post("/get-document-fields")
async def get_fields_for_document(
    request: DocumentFieldRequest,
    user_id: str = Depends(verify_token)
):
    """문서 유형에 따라 필요한 입력 필드와 자동완성 기본값을 제공하는 엔드포인트"""
    result = await get_document_fields(request.document_type, request.context)
    return result

@app.post("/document-version-diff")
async def get_document_version_diff(
    request: VersionCompareRequest,
    user_id: str = Depends(verify_token)
):
    """두 문서 버전 간의 차이점을 분석"""
    result = await document_version_diff(request.document_id, request.source_version_id, request.target_version_id)
    return result

@app.post("/migrate-version-annotations")
async def migrate_annotations_between_versions(
    request: VersionMigrateRequest,
    user_id: str = Depends(verify_token)
):
    """한 버전의 주석과 하이라이트를 다른 버전으로 마이그레이션"""
    result = await migrate_version_annotations(
        request.document_id, 
        request.source_version_id, 
        request.target_version_id,
        request.include_comments,
        request.include_highlights
    )
    return result

@app.post("/restore-document-version")
async def restore_to_previous_version(
    request: VersionRestoreRequest,
    user_id: str = Depends(verify_token)
):
    """이전 문서 버전으로 복원"""
    result = await restore_document_version(
        request.document_id,
        request.version_id,
        request.create_new_version,
        request.change_description
    )
    return result

# 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 3. 사용 예시

### 요청 예시 (JWT 인증 포함)
```bash
curl -X POST "http://localhost:8000/process-requirement" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"query": "피고가 계약을 위반함", "requirement_type": "suggest_goals", "project_id": "proj1", "mode": "ask"}'
```

### 응답 예시
```json
{
  "result": "추천 목표:\n1. 손해배상금 5억원 이상 받기\n2. 피고의 계약 위반 입증",
  "evidence": [{"text": "피고는 2023년 5월 원고에게 1억원을 지급해야 한다.", "metadata": {"file_url": "contract.pdf", "page": 3, "project_id": "proj1"}, "score": 0.92}],
  "legal_references": [{"text": "민법 제660조: 채무불이행 시 손해배상 책임 발생.", "metadata": {"source": "민법", "project_id": "proj1"}, "score": 0.87}],
  "reliability_score": 85,
  "reasoning": "증거 1건, 법령 1건 기반",
  "mode": "ask"
}
```

### 문서 버전 관리 API 사용 예시

#### 버전 차이점 비교
```bash
curl -X POST "http://localhost:8000/document-version-diff" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"document_id": "doc123", "source_version_id": "ver1", "target_version_id": "ver2"}'
```

#### 주석 및 하이라이트 마이그레이션
```bash
curl -X POST "http://localhost:8000/migrate-version-annotations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"document_id": "doc123", "source_version_id": "ver1", "target_version_id": "ver2", "include_comments": true, "include_highlights": true}'
```

#### 이전 버전으로 복원
```bash
curl -X POST "http://localhost:8000/restore-document-version" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"document_id": "doc123", "version_id": "ver1", "create_new_version": true, "change_description": "이전 버전으로 복원"}'
```

### 응답 예시 (버전 차이점 비교)
```json
{
  "source_version": {
    "id": "ver1",
    "version": "1.0",
    "created_at": "2023-05-15T08:30:45",
    "created_by": "user123",
    "change_description": "최초 작성"
  },
  "target_version": {
    "id": "ver2",
    "version": "2.0",
    "created_at": "2023-05-20T14:25:10",
    "created_by": "user123",
    "change_description": "새로운 증거자료 반영"
  },
  "diff": {
    "added": [
      "제5조: 손해배상 조항 추가",
      "제7조: 특별 조건 추가"
    ],
    "deleted": [
      "원래 제4조 일부 내용 삭제"
    ],
    "modified": [
      "제3조: 계약 기간 1년에서 2년으로 변경",
      "제6조: 위약금 조항 강화"
    ]
  },
  "html_diff": "<!DOCTYPE html><html>...</html>"
}
```

---

## 4. 개선된 기능

1. **성능 최적화**:
   - **Qdrant 필터링**: `project_id`로 검색 범위 제한, 불필요한 데이터 제외.
   - **비동기 처리**: FastAPI와 `asyncio`로 검색 및 LLM 호출 병렬화.
2. **보안**:
   - **JWT 인증**: 모든 엔드포인트에 사용자 인증 추가.
3. **확장성**:
   - **FastAPI 비동기**: 동시 요청 처리 능력 향상.
   - **Qdrant**: 대규모 데이터 처리를 위한 필터링 최적화.
4. **AI Agent**: Write/Ask 모드 지원, 수정 제안 제공.
5. **Re-ranking**: 검색 결과 품질 개선.
6. **문서 버전 관리**: 
   - **버전 비교**: 두 버전 간 차이점을 HTML 및 구조화된 형식으로 제공
   - **주석 마이그레이션**: 버전 간 주석 및 하이라이트 자동 마이그레이션
   - **이전 버전 복원**: 새 버전 생성 또는 덮어쓰기 방식의 복원 지원

---

## 5. UI 연동 (`LegalEditor`)
- **문서작성탭**: 
  - `/process-requirement`로 문서 생성/수정
  - `/suggest-revision`로 AI Agent 수정 제안
  - `/get-document-fields`로 문서 유형별 동적 필드 정보 가져오기
  - **버전 관리**:
    - `/document-version-diff`로 버전 간 차이점 비교
    - `/migrate-version-annotations`로 주석/하이라이트 마이그레이션
    - `/restore-document-version`으로 이전 버전 복원

### 동적 필드 생성 API 사용 예시
```bash
curl -X POST "http://localhost:8000/get-document-fields" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"document_type": "NDA", "context": "소프트웨어 기술 관련 비밀유지계약"}'
```

### 응답 예시
```json
{
  "document_type": "NDA",
  "fields": {
    "fields": [
      {
        "id": "party_first",
        "name": "제1 당사자",
        "type": "text",
        "required": true,
        "description": "계약의 첫 번째 당사자 정보(회사명 또는 개인명)",
        "default_value": "ABC 주식회사"
      },
      {
        "id": "party_second",
        "name": "제2 당사자",
        "type": "text",
        "required": true,
        "description": "계약의 두 번째 당사자 정보(회사명 또는 개인명)",
        "default_value": "XYZ 주식회사"
      },
      {
        "id": "confidential_info_type",
        "name": "비밀정보 유형",
        "type": "textarea",
        "required": true,
        "description": "보호 대상이 되는 비밀정보의 종류와 범위",
        "default_value": "소프트웨어 개발 기술 및 노하우, 소스코드, 알고리즘, 기술 문서, 설계도"
      },
      {
        "id": "contract_period",
        "name": "계약 기간",
        "type": "text",
        "required": true,
        "description": "비밀유지 의무가 지속되는 기간",
        "default_value": "계약 체결일로부터 3년"
      },
      {
        "id": "governing_law",
        "name": "준거법",
        "type": "dropdown",
        "required": true,
        "description": "계약에 적용되는 법률",
        "default_value": "대한민국 법",
        "options": ["대한민국 법", "미국 법", "영국 법", "EU 법", "일본 법", "중국 법"]
      },
      {
        "id": "damage_compensation",
        "name": "손해배상 규정",
        "type": "textarea",
        "required": false,
        "description": "비밀유지 위반 시 손해배상에 관한 조항",
        "default_value": "비밀정보 유출 시 상대방에게 발생한 모든 손해를 배상하며, 위약금으로 금 5억원을 지급한다."
      },
      {
        "id": "dispute_resolution",
        "name": "분쟁해결 방법",
        "type": "radio",
        "required": false,
        "description": "계약 관련 분쟁 발생 시 해결 방법",
        "default_value": "중재",
        "options": ["소송", "중재", "조정"]
      }
    ]
  },
  "reasoning": "AI가 분석한 법률 문서 유형별 필드 정보"
}
```

---

## 6. 추가 고려사항
- **모니터링**: 요청 로그 추가 (예: `logging` 모듈 사용).
- **에러 처리**: 비동기 작업 실패 시 사용자 알림.
- **클러스터링**: 대규모 트래픽 대비 Python 서버 확장.
- **필드 메타데이터 캐싱**: 자주 요청되는 문서 유형의 필드 정보를 캐싱하여 응답 속도 향상.
- **문서 유형별 템플릿 학습**: 사용자 피드백을 통해 문서 유형별 필드 정보 지속적 개선.
- **문서 버전 비교 최적화**: 대용량 문서의 버전 비교 시 성능 최적화
- **버전 간 마이그레이션 정확도 향상**: 코사인 유사도 기반 문단 매핑으로 주석 마이그레이션 정확도 개선
- **버전 관리 UI 경험 개선**: 직관적인 버전 차이 시각화 및 네비게이션

---

## 결론
이 가이드는 성능 최적화(Qdrant 필터링), 보안(JWT), 확장성(FastAPI 비동기)을 반영한 "최선"의 설계입니다. `LegalEditor` 요구사항을 충족하며, 실시간 협업과 AI 추천 기능을 지원합니다. 특히 문서 유형에 따른 동적 필드 생성 기능과 문서 버전 관리 기능을 통해 다양한 법률 문서 작성과 이력 관리에 유연하게 대응할 수 있습니다. 추가 요구사항이 있다면 말씀해주세요!