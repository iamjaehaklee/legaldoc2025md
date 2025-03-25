아래는 요청하신 내용을 기반으로 Supabase Edge Function과 별도의 Python 서버에서 처리해야 할 작업을 구분하고, 구체화한 `.md` 형식의 문서입니다.

---

# OCR 및 데이터 처리 절차 설계

## 사용자 경험 시나리오
**LegalEditor**의 OCR 및 파일 처리 과정은 사용자에게 최대한 원활한 경험을 제공하면서도 기술적 투명성을 유지하도록 설계되었습니다.

1. **파일 업로드 및 표시**:
   - 사용자가 파일을 업로드하면 OCR 처리 상태와 관계없이 즉시 왼쪽 사이드바에 파일이 표시됩니다.
   - OCR 가능한 모든 파일은 사용자의 별도 명령 없이 자동으로 OCR 처리가 시작됩니다.

2. **처리 상태 표시**:
   - OCR 중인 파일: 파일명 옆에 작은 "OCR 처리 중" 위젯이 표시됩니다.
   - 임베딩 중인 파일: OCR 완료 후 "임베딩 중" 위젯이 표시됩니다.
   - 처리 완료: 모든 과정이 완료되면 화면 하단에 Toast 메시지로 "OCR 및 임베딩이 완료되었습니다" 알림을 표시합니다.

3. **파일 접근성**:
   - OCR 완료 전에도 사용자는 파일을 열어볼 수 있습니다.
   - 그러나 텍스트 선택 및 댓글 달기 기능은 OCR이 완료된 후에만 활성화됩니다.
   - 이는 정확한 텍스트 좌표가 OCR 과정에서 생성되기 때문입니다.

4. **백그라운드 처리**:
   - OCR 및 임베딩 작업은 백그라운드에서 진행되어 사용자의 다른 작업을 방해하지 않습니다.
   - 처리 상태는 실시간으로 업데이트되며, 사용자는 계속해서 다른 문서를 편집하거나 분석할 수 있습니다.

---

## 개요
OCR 가능한 문서 업로드 시, UpStage AI API를 활용하여 OCR 데이터를 추출하고, 이를 Supabase DB에 저장하며, 문단 및 목차를 분석한 뒤 Qdrant에 벡터 임베딩을 수행하는 절차를 설계합니다. 작업은 Supabase Edge Function과 별도의 Python 서버로 나누어 처리하며, 각 환경의 특성과 제약을 고려하여 구분합니다.

- **Supabase Edge Function**: 경량화된 서버리스 환경으로, 빠른 응답과 간단한 데이터 처리에 적합.
- **Python 서버**: 복잡한 로직, 외부 API 호출, 대규모 데이터 처리 및 벡터 임베딩에 적합.

---

## 절차별 작업 분배

### 1. OCR 데이터 추출 및 Supabase DB 저장
**설명**: 사용자가 업로드한 문서(이미지, PDF 등)에 대해 UpStage AI API를 호출하여 OCR 값을 추출하고, 페이지 단위로 Supabase DB Table에 저장합니다.

#### 처리 위치: Supabase Edge Function
- **이유**:
  - 사용자가 문서를 업로드하는 즉시 처리해야 하며, Supabase Edge Function은 클라이언트와의 빠른 상호작용에 최적화되어 있음.
  - Supabase는 파일 업로드 및 DB 접근에 대한 기본 제공 기능을 활용 가능.
  - UpStage AI API 호출은 HTTP 요청으로 간단히 처리 가능하며, Edge Function에서 충분히 실행 가능.
- **구체적 절차**:
  1. 클라이언트가 Supabase Storage에 문서 파일을 업로드.
  2. Edge Function이 트리거되어 업로드된 파일 URL을 가져옴.
  3. UpStage AI API에 파일 URL 또는 바이너리 데이터를 전송하여 OCR 결과 반환.
  4. 반환된 OCR 데이터를 JSON 형태로 파싱 후, 페이지 단위로 `UpstageOcrResult` 테이블에 저장하고 `Evidence` 테이블의 OCR 상태를 업데이트.
- **Supabase DB 테이블 구조**:
  ```sql
  CREATE TABLE Evidence (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES Projects(id),
    folder_id UUID REFERENCES Folders(id),
    title VARCHAR NOT NULL,
    original_filename VARCHAR NOT NULL,
    type VARCHAR,
    mime_type VARCHAR,
    file_path VARCHAR NOT NULL,
    file_size INTEGER,
    page_count INTEGER,
    duration FLOAT,
    ocr_status VARCHAR DEFAULT 'not_started',
    ocr_completed_at TIMESTAMP,
    content_text TEXT,
    embedding_status VARCHAR DEFAULT 'not_started',
    uploaded_at TIMESTAMP DEFAULT NOW(),
    uploaded_by UUID REFERENCES Users(id),
    tags VARCHAR[]
  );

  CREATE TABLE UpstageOcrResult (
    id UUID PRIMARY KEY,
    evidence_id UUID REFERENCES Evidence(id),
    page_number INTEGER NOT NULL,
    raw_text TEXT NOT NULL,
    confidence_score FLOAT,
    bounding_boxes JSONB,
    processed_at TIMESTAMP DEFAULT NOW(),
    processing_time_ms INTEGER,
    status VARCHAR DEFAULT 'success',
    error_message TEXT
  );

  CREATE TABLE OcrProcessingQueue (
    id UUID PRIMARY KEY,
    evidence_id UUID REFERENCES Evidence(id),
    status VARCHAR DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_details TEXT,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP
  );
  ```
- **Edge Function 코드 예시 (TypeScript)**:
  ```typescript
  import { serve } from "https://deno.land/std/http/server.ts";
  import { createClient } from "https://esm.sh/@supabase/supabase-js";

  serve(async (req) => {
    const supabase = createClient("SUPABASE_URL", "SUPABASE_KEY");
    const { evidence_id, file_path } = await req.json();

    // 처리 큐에 상태 업데이트
    await supabase.from("OcrProcessingQueue").insert({
      evidence_id: evidence_id,
      status: "processing",
      started_at: new Date().toISOString()
    });

    // Evidence 테이블 OCR 상태 업데이트
    await supabase.from("Evidence").update({
      ocr_status: "in_progress"
    }).eq("id", evidence_id);

    try {
      // UpStage AI API 호출
      const ocrResponse = await fetch("https://api.upstage.ai/ocr", {
        method: "POST",
        headers: { "Authorization": "Bearer UPSTAGE_API_KEY" },
        body: JSON.stringify({ url: file_path }),
      });
      const ocrData = await ocrResponse.json();

      // 페이지 단위로 Supabase에 저장
      for (let i = 0; i < ocrData.pages.length; i++) {
        const page = ocrData.pages[i];
        await supabase.from("UpstageOcrResult").insert({
          evidence_id: evidence_id,
          page_number: i + 1,
          raw_text: page.text,
          confidence_score: page.confidence || 0.0,
          bounding_boxes: page.boxes || {},
          processing_time_ms: page.processing_time || 0
        });
      }

      // Evidence 테이블 업데이트
      await supabase.from("Evidence").update({
        ocr_status: "completed",
        ocr_completed_at: new Date().toISOString(),
        page_count: ocrData.pages.length
      }).eq("id", evidence_id);

      // 처리 큐 업데이트
      await supabase.from("OcrProcessingQueue").update({
        status: "completed",
        completed_at: new Date().toISOString()
      }).eq("evidence_id", evidence_id);

      return new Response("OCR 처리 완료", { status: 200 });
    } catch (error) {
      // 오류 발생 시 상태 업데이트
      await supabase.from("Evidence").update({
        ocr_status: "failed"
      }).eq("id", evidence_id);

      await supabase.from("OcrProcessingQueue").update({
        status: "failed",
        error_details: error.message,
        completed_at: new Date().toISOString()
      }).eq("evidence_id", evidence_id);

      return new Response("OCR 처리 실패: " + error.message, { status: 500 });
    }
  });
  ```

---

### 2. 문단 단위 및 목차 파악 후 별도 DB 저장
**설명**: 페이지 단위로 저장된 OCR 데이터를 분석하여 문단과 목차를 파악하고, 이를 별도의 Supabase DB Table에 저장합니다.

#### 처리 위치: Python 서버
- **이유**:
  - 문단 분리 및 목차 분석은 복잡한 텍스트 처리 로직(정규식, NLP 등)이 필요하며, Edge Function의 경량화된 환경에서는 실행 시간 및 메모리 제약으로 부적합.
  - Python은 텍스트 분석 라이브러리(NLTK, SpaCy 등)를 활용하기에 적합.
  - 비동기 처리 및 대규모 데이터 처리가 가능.
- **구체적 절차**:
  1. Supabase DB의 `UpstageOcrResult` 테이블에서 OCR 데이터를 조회.
  2. Python 스크립트로 텍스트를 분석하여 문단과 목차를 추출.
     - 문단: 줄바꿈(`\n\n`) 또는 문장 끝 패턴 기반 분리.
     - 목차: 번호(1., 2. 등) 또는 특정 키워드(예: "Chapter", "Section") 탐지.
  3. 분석된 데이터를 `OcrParagraphs`와 `OcrToc` 테이블에 저장.
- **Supabase DB 테이블 구조**:
  ```sql
  CREATE TABLE OcrParagraphs (
    id UUID PRIMARY KEY,
    evidence_id UUID REFERENCES Evidence(id),
    ocr_result_id UUID REFERENCES UpstageOcrResult(id),
    paragraph_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    start_position INTEGER,
    end_position INTEGER,
    embedding_vector VECTOR,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE OcrToc (
    id UUID PRIMARY KEY,
    evidence_id UUID REFERENCES Evidence(id),
    title TEXT NOT NULL,
    level INTEGER NOT NULL,
    page_number INTEGER NOT NULL,
    parent_id UUID REFERENCES OcrToc(id),
    sequence INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- **Python 코드 예시**:
  ```python
  from supabase import create_client
  import re
  import uuid

  supabase = create_client("SUPABASE_URL", "SUPABASE_KEY")

  # 처리 대기 중인 증거 조회
  response = supabase.table("Evidence").select("id").eq("ocr_status", "completed").eq("embedding_status", "not_started").execute()
  evidences = response.data

  for evidence in evidences:
      evidence_id = evidence["id"]
      
      # OCR 결과 조회
      ocr_response = supabase.table("UpstageOcrResult").select("*").eq("evidence_id", evidence_id).order("page_number").execute()
      ocr_results = ocr_response.data
      
      # 문단 처리
      for ocr_result in ocr_results:
          ocr_text = ocr_result["raw_text"]
          paragraphs = ocr_text.split("\n\n")
          
          current_position = 0
          for i, para in enumerate(paragraphs):
              para_text = para.strip()
              if not para_text:
                  continue
                  
              start_pos = ocr_text.find(para_text, current_position)
              end_pos = start_pos + len(para_text)
              current_position = end_pos
              
              # 문단 저장
              supabase.table("OcrParagraphs").insert({
                  "id": str(uuid.uuid4()),
                  "evidence_id": evidence_id,
                  "ocr_result_id": ocr_result["id"],
                  "paragraph_index": i + 1,
                  "text": para_text,
                  "start_position": start_pos,
                  "end_position": end_pos
              }).execute()
      
      # 목차 추출 (모든 페이지의 OCR 결과를 합쳐서 분석)
      all_text = " ".join([ocr["raw_text"] for ocr in ocr_results])
      
      # 목차 패턴: 숫자. 텍스트 페이지번호
      toc_entries = re.findall(r"(\d+\.)\s+([^\d]+)\s+(\d+)", all_text)
      
      for i, (number, title, page) in enumerate(toc_entries):
          level = len(number.split(".")) - 1  # 1. = 레벨 1, 1.1. = 레벨 2
          
          # 목차 저장
          supabase.table("OcrToc").insert({
              "id": str(uuid.uuid4()),
              "evidence_id": evidence_id,
              "title": title.strip(),
              "level": level,
              "page_number": int(page),
              "sequence": i + 1
          }).execute()
      
      # Evidence 임베딩 상태 업데이트
      supabase.table("Evidence").update({
          "embedding_status": "in_progress"
      }).eq("id", evidence_id).execute()
  ```

---

### 3. Qdrant에 벡터 임베딩 저장
**설명**: 문단 단위로 저장된 데이터를 Qdrant에 벡터 임베딩으로 저장하여 검색 가능하도록 설정합니다.

#### 처리 위치: Python 서버
- **이유**:
  - 벡터 임베딩은 딥러닝 모델(예: SentenceTransformers)을 사용하며, 이는 Edge Function의 실행 환경에서 불가능.
  - Qdrant 클라이언트와의 통신 및 대량 데이터 처리가 필요.
- **구체적 절차**:
  1. Supabase의 `OcrParagraphs` 테이블에서 문단 데이터 조회.
  2. SentenceTransformers 모델로 텍스트를 벡터화.
  3. 벡터를 `OcrParagraphs` 테이블의 `embedding_vector` 필드에 저장하고 Qdrant에 벡터와 메타데이터 업로드.
- **Python 코드 예시**:
  ```python
  from qdrant_client import QdrantClient
  from sentence_transformers import SentenceTransformer

  qdrant = QdrantClient("http://qdrant-server:6333")
  model = SentenceTransformer("all-MiniLM-L6-v2")

  # 임베딩 대기 중인 증거 조회
  response = supabase.table("Evidence").select("id").eq("embedding_status", "in_progress").execute()
  evidences = response.data

  for evidence in evidences:
      evidence_id = evidence["id"]
      
      # 문단 데이터 조회
      paragraphs_response = supabase.table("OcrParagraphs").select("*").eq("evidence_id", evidence_id).execute()
      paragraphs = paragraphs_response.data

      # 벡터 임베딩 및 저장
      for para in paragraphs:
          # 텍스트 벡터화
          vector = model.encode(para["text"]).tolist()
          
          # Supabase에 벡터 저장
          supabase.table("OcrParagraphs").update({
              "embedding_vector": vector
          }).eq("id", para["id"]).execute()
          
          # Qdrant에 벡터 저장
          qdrant.upsert(
              collection_name="evidence_vectors",
              points=[{
                  "id": para["id"],
                  "vector": vector,
                  "payload": {
                      "evidence_id": evidence_id,
                      "paragraph_index": para["paragraph_index"],
                      "text": para["text"],
                      "page_number": get_page_number(para["ocr_result_id"])  # 페이지 번호 추출 함수
                  }
              }]
          )
      
      # 문서 전체 텍스트 생성 (검색용)
      all_text = " ".join([para["text"] for para in paragraphs])
      
      # Evidence 테이블 업데이트
      supabase.table("Evidence").update({
          "embedding_status": "completed",
          "content_text": all_text
      }).eq("id", evidence_id).execute()

  # 페이지 번호 조회 함수
  def get_page_number(ocr_result_id):
      response = supabase.table("UpstageOcrResult").select("page_number").eq("id", ocr_result_id).execute()
      return response.data[0]["page_number"] if response.data else 1
  ```

---

### 4. 자동 태그 생성 및 적용
**설명**: OCR 및 임베딩 처리가 완료된 후, 문서의 내용을 분석하여 자동으로 5개의 관련 태그를 생성하고 적용합니다.

#### 처리 위치: Python 서버
- **이유**:
  - 태그 생성은 텍스트 분석과 AI 모델 추론이 필요하며, 이는 Python 환경이 적합함.
  - 문서 전체 내용에 대한 통합적 분석이 필요하며, OCR과 임베딩 완료 후 수행하는 것이 효율적.
  - LLM 호출 및 추론 과정이 Edge Function의 실행 시간 제약을 초과할 가능성이 있음.
- **구체적 절차**:
  1. OCR 및 임베딩 처리가 완료된 증거자료에 대해 자동 태그 생성 절차 실행.
  2. 문서 전체 텍스트와 주요 문단을 추출하여 LLM에 전송.
  3. LLM을 사용하여 문서 주제, 문서 유형, 핵심 키워드 등을 분석.
  4. 분석 결과를 바탕으로 가장 관련성 높은 태그 5개 생성.
  5. 생성된 태그를 Supabase의 `Evidence` 테이블에 저장.
  6. 태그 생성 완료 상태를 업데이트하고, 클라이언트에 알림.
- **Supabase DB 변경**:
  ```sql
  ALTER TABLE Evidence
  ADD COLUMN auto_tags_generated BOOLEAN DEFAULT FALSE;
  ```
- **Python 코드 예시**:
  ```python
  import openai
  from supabase import create_client

  supabase = create_client("SUPABASE_URL", "SUPABASE_KEY")
  openai.api_key = "OPENAI_API_KEY"

  # 임베딩 완료 및 태그 미생성 증거 조회
  response = supabase.table("Evidence").select("id", "content_text").eq("embedding_status", "completed").eq("auto_tags_generated", False).execute()
  evidences = response.data

  for evidence in evidences:
      evidence_id = evidence["id"]
      content_text = evidence["content_text"]
      
      # 텍스트가 너무 길면 요약 또는 트렁케이션
      if len(content_text) > 15000:
          # 앞부분 5000자, 중간 5000자, 뒷부분 5000자 추출
          text_for_analysis = content_text[:5000] + "\n...\n" + content_text[len(content_text)//2-2500:len(content_text)//2+2500] + "\n...\n" + content_text[-5000:]
      else:
          text_for_analysis = content_text
      
      # LLM으로 태그 추천 요청
      try:
          # 문서 분석 및 태그 생성 요청
          response = openai.chat.completions.create(
              model="gpt-4",
              messages=[
                  {"role": "system", "content": "문서를 분석하여 관련된 태그 5개를 생성해주세요. 다음 기준을 고려하세요: 1) 문서 유형(예: 계약서, 이메일, 소송 자료), 2) 핵심 주제, 3) 포함된 중요 개체 또는 인물, 4) 관련 법률 분야, 5) 시간적 특성. 태그는 짧고 명확하게 작성하며, 쉼표로 구분된 리스트로 반환해주세요."},
                  {"role": "user", "content": f"다음 문서를 분석하고 태그 5개를 생성해주세요:\n\n{text_for_analysis}"}
              ],
              temperature=0.7,
              max_tokens=150
          )
          
          # 응답에서 태그 추출
          tags_text = response.choices[0].message.content.strip()
          # 쉼표로 구분된 태그 분리 및 정리
          tags = [tag.strip() for tag in tags_text.split(',')]
          # 최대 5개 태그만 사용
          tags = tags[:5]
          
          # 태그 데이터베이스에 저장
          supabase.table("Evidence").update({
              "tags": tags,
              "auto_tags_generated": True
          }).eq("id", evidence_id).execute()
          
          print(f"Evidence ID {evidence_id} auto-tagged with: {tags}")
          
      except Exception as e:
          print(f"Error auto-tagging evidence ID {evidence_id}: {str(e)}")
          continue
  ```

- **태그 생성 품질 관리**:
  - 언어 모델에 법률 문서 특화 프롬프트 사용 (법률 용어, 문서 유형, 사건 종류 등 고려).
  - 프로젝트 컨텍스트 고려 (프로젝트 제목, 기존 문서 태그 등 참조).
  - 이미 프로젝트에서 사용 중인 태그와의 일관성 유지.
  - 사용자 피드백을 통한 태그 품질 개선 (태그 수정 패턴 학습).

---

## 요약

| 단계                          | 처리 위치              | 주요 이유                                      |
|-------------------------------|------------------------|-----------------------------------------------|
| 1. OCR 및 페이지 단위 저장    | Supabase Edge Function | 빠른 응답, Supabase 통합성, 간단한 API 호출 가능 |
| 2. 문단/목차 분석 및 저장     | Python 서버            | 복잡한 텍스트 처리, 풍부한 라이브러리 활용     |
| 3. Qdrant 벡터 임베딩         | Python 서버            | 딥러닝 모델 사용, 대량 데이터 처리 필요        |
| 4. 자동 태그 생성 및 적용     | Python 서버            | 텍스트 분석과 AI 모델 추론 필요, 문서 전체 분석 필요 |

---

## 추가 고려사항
- **트리거**: OcrProcessingQueue 테이블을 활용하여 작업 상태를 관리하고, Supabase DB 트리거로 Python 서버 작업을 시작.
- **스케일링**: Python 서버는 작업 큐(예: Celery)와 Redis를 활용하여 분산 처리 가능.
- **보안**: API 키는 환경 변수로 관리하고, 클라이언트와 서버 간 통신은 암호화.
- **오류 처리**: 실패한 작업은 재시도 로직 구현 (retry_count, last_retry_at 필드 활용).
- **모니터링**: 처리 시간 및 상태를 로깅하여 성능 분석 및 문제 해결에 활용.

이 설계는 LegalEditor 시스템의 데이터베이스 구조와 통합되어 효율성과 유지보수성을 고려한 최적화된 접근 방식입니다.

--- 

위 내용을 바탕으로 필요 시 추가 질문 주시면 더 구체화해드리겠습니다!