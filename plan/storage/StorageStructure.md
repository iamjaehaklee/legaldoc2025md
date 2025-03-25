# LegalEditor Storage 구조

## 1. 개요
LegalEditor는 다양한 유형의 파일(증거자료, 문서 등)을 안전하게 저장하고 관리하기 위해 Supabase Storage를 활용합니다. 이 문서는 파일 저장소의 구조, 파일 접근 권한 관리, 보안 정책 등을 정의합니다.

## 2. Supabase Storage 버킷 구조

Supabase Storage는 다음과 같은 버킷 구조로 구성됩니다:

- **evidence**: 증거자료 파일 저장 (PDF, docx, pptx, xlsx, mp3, mp4, hwp, 이미지 등)
- **documents**: 문서 첨부 파일 저장 (에디터에 삽입될 이미지 등)
- **templates**: 템플릿 파일 저장 (기본 제공 템플릿 문서)
- **avatars**: 사용자 프로필 이미지 저장
- **project-icons**: 프로젝트 아이콘 이미지 저장
- **exports**: 문서 내보내기 파일 저장 (PDF, docx 등)
- **temp**: 임시 파일 저장 (24시간 후 자동 삭제)

## 3. 파일 경로 구조

### 3.1 증거자료 (evidence 버킷)
```
evidence/{project_id}/{evidence_id}/{filename}
```

- **project_id**: 프로젝트 UUID
- **evidence_id**: 증거자료 UUID
- **filename**: UUID + 원본 파일 이름 (형식: `{evidence_id}_{원본파일명}`)

예시: `evidence/123e4567-e89b-12d3-a456-426614174000/98765432-e89b-12d3-a456-426614174001/98765432-e89b-12d3-a456-426614174001_계약서.pdf`

### 3.2 문서 첨부 파일 (documents 버킷)
```
documents/{project_id}/{document_id}/{attachment_id}_{filename}
```

- **project_id**: 프로젝트 UUID
- **document_id**: 문서 UUID
- **attachment_id**: 첨부 파일 UUID
- **filename**: 원본 파일 이름

예시: `documents/123e4567-e89b-12d3-a456-426614174000/abcdef12-e89b-12d3-a456-426614174001/87654321-e89b-12d3-a456-426614174002_법정사진.jpg`

### 3.3 보안 정책

### 4.1 권한 체계
- **역할별 접근 권한**:
  - 프로젝트 소유자(Owner): 반드시 유료 플랜 사용자만 가능, 모든 파일 읽기/쓰기/삭제 가능
  - 관리자(Admin): 유료 플랜 사용자만 가능, 모든 파일 읽기/쓰기/삭제 가능
  - 편집자(Editor): 유료 플랜 사용자만 가능, 모든 파일 읽기/쓰기/삭제 가능
  - 주석자(Commentator): 무료 플랜 사용자도 가능, 모든 파일 읽기만 가능
  - 조회자(Viewer): 무료 플랜 사용자도 가능, 모든 파일 읽기만 가능

### 4.2 Supabase RLS 정책
- **읽기 권한 정책 (evidence_files 테이블):**
```sql
CREATE POLICY "모든 역할은 프로젝트 파일을 읽을 수 있음" ON evidence_files
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM project_members
    WHERE project_id = evidence_files.project_id
  )
);
```

- **쓰기 권한 정책 (evidence_files 테이블):**
```sql
CREATE POLICY "편집 이상 권한을 가진 멤버만 파일을 업로드할 수 있음" ON evidence_files
FOR INSERT USING (
  auth.uid() IN (
    SELECT user_id FROM project_members
    WHERE project_id = evidence_files.project_id
    AND project_members.role IN ('owner', 'admin', 'editor')
    AND project_members.is_paid_user = true
  )
);
```

- **수정 권한 정책 (evidence_files 테이블):**
```sql
CREATE POLICY "편집 이상 권한을 가진 멤버만 파일을 수정할 수 있음" ON evidence_files
FOR UPDATE USING (
  auth.uid() IN (
    SELECT user_id FROM project_members
    WHERE project_id = evidence_files.project_id
    AND project_members.role IN ('owner', 'admin', 'editor')
    AND project_members.is_paid_user = true
  )
);
```

- **삭제 권한 정책 (evidence_files 테이블):**
```sql
CREATE POLICY "편집 이상 권한을 가진 멤버만 파일을 삭제할 수 있음" ON evidence_files
FOR DELETE USING (
  auth.uid() IN (
    SELECT user_id FROM project_members
    WHERE project_id = evidence_files.project_id
    AND project_members.role IN ('owner', 'admin', 'editor')
    AND project_members.is_paid_user = true
  )
);
```

- **관리자 전용 정책 (project_settings 테이블):**
```sql
CREATE POLICY "관리자 이상만 프로젝트 설정을 변경할 수 있음" ON project_settings
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM project_members
    WHERE project_id = project_settings.project_id
    AND project_members.role IN ('owner', 'admin')
    AND project_members.is_paid_user = true
  )
);
```

### 4.3 유료 플랜 검증 로직
- **권한 변경 시 플랜 상태 검증**:
```typescript
async function updateMemberRole(projectId: string, userId: string, newRole: string) {
  // 역할이 유료 역할인지 확인
  const isPremiumRole = ['owner', 'admin', 'editor'].includes(newRole);
  
  if (isPremiumRole) {
    // 사용자의 플랜 상태 조회
    const { data: userData, error } = await supabase
      .from('user_subscriptions')
      .select('is_paid')
      .eq('user_id', userId)
      .single();
      
    if (error || !userData || !userData.is_paid) {
      throw new Error('유료 플랜 사용자만 이 역할을 가질 수 있습니다.');
    }
  }
  
  // 역할 업데이트 진행
  const { error: updateError } = await supabase
    .from('project_members')
    .update({ role: newRole })
    .eq('project_id', projectId)
    .eq('user_id', userId);
    
  if (updateError) {
    throw new Error('역할 업데이트 중 오류가 발생했습니다.');
  }
  
  return { success: true };
}
```

## 5. 파일 처리 워크플로우

### 5.1 증거자료 업로드 및 처리

1. **클라이언트에서 증거자료 업로드 요청**:
   ```typescript
   const uploadEvidence = async (projectId: string, file: File, tags: string[] = []) => {
     // 1. 먼저 파일 메타데이터를 데이터베이스에 저장
     const { data: evidence, error: dbError } = await supabase
       .from('evidence')
       .insert({
         project_id: projectId,
         title: file.name,
         original_filename: file.name,
         type: getFileType(file.name), // 파일 유형 추출 함수
         mime_type: file.type,
         file_size: file.size,
         tags
       })
       .select()
       .single();
     
     if (dbError) throw dbError;
     
     // 2. 증거자료 파일을 스토리지에 업로드
     const filename = `${evidence.id}_${file.name}`; // UUID + 원본 파일명
     const path = `${projectId}/${evidence.id}/${filename}`;
     
     const { error: uploadError } = await supabase.storage
       .from('evidence')
       .upload(path, file, {
         cacheControl: 'max-age=31536000', // 1년 캐싱
         contentType: file.type,
         upsert: false
       });
     
     if (uploadError) {
       // 업로드 실패 시 데이터베이스 레코드 삭제
       await supabase.from('evidence').delete().eq('id', evidence.id);
       throw uploadError;
     }
     
     // 3. 파일 경로를 데이터베이스에 업데이트
     const { error: updateError } = await supabase
       .from('evidence')
       .update({ 
         file_path: path,
         ocr_status: 'not_started',
         embedding_status: 'not_started'
       })
       .eq('id', evidence.id);
     
     if (updateError) throw updateError;
     
     // 4. 백그라운드 작업 시작 (OCR, 임베딩 등)
     await startProcessingJobs(evidence.id);
     
     return evidence;
   };
   ```

### 5.2 대용량 파일 처리 (청크 업로드)

Supabase Storage는 단일 파일 업로드의 경우 최대 5GB까지 지원합니다. 하지만 대용량 파일은 청크 단위로 분할하여 업로드하는 것이 안정적입니다. 다음은 대용량 파일을 청크 단위로 업로드하는 구현입니다:

```typescript
const chunkSize = 5 * 1024 * 1024; // 5MB 청크 크기

const uploadLargeEvidence = async (projectId: string, file: File, tags: string[] = []) => {
  try {
    // 1. 파일 메타데이터를 데이터베이스에 저장
    const { data: evidence, error: dbError } = await supabase
      .from('evidence')
      .insert({
        project_id: projectId,
        title: file.name,
        original_filename: file.name,
        type: getFileType(file.name),
        mime_type: file.type,
        file_size: file.size,
        tags
      })
      .select()
      .single();
    
    if (dbError) throw dbError;
    
    // 2. 파일 경로 설정
    const filename = `${evidence.id}_${file.name}`;
    const path = `${projectId}/${evidence.id}/${filename}`;
    
    // 3. 파일을 청크로 분할하여 업로드
    const chunks = Math.ceil(file.size / chunkSize);
    const uploadPromises = [];
    
    // 업로드 진행 상태 업데이트
    await supabase.from('evidence').update({ 
      upload_status: 'in_progress',
      upload_progress: 0
    }).eq('id', evidence.id);
    
    // 청크별 업로드
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const blob = file.slice(start, end);
      
      const chunkPath = `${path}_part${i}`;
      uploadPromises.push(
        supabase.storage
          .from('evidence')
          .upload(chunkPath, blob, {
            contentType: file.type,
            upsert: true
          })
          .then(result => {
            // 진행 상태 업데이트
            const progress = Math.round(((i + 1) / chunks) * 100);
            supabase.from('evidence').update({ 
              upload_progress: progress 
            }).eq('id', evidence.id);
            
            return result;
          })
      );
    }
    
    // 모든 청크가 업로드될 때까지 대기
    await Promise.all(uploadPromises);
    
    // 4. 서버 측 함수를 호출하여 청크를 병합
    const { data: mergeResult, error: mergeError } = await supabase.functions
      .invoke('merge-file-chunks', {
        body: { 
          projectId,
          evidenceId: evidence.id,
          filename,
          chunksCount: chunks
        }
      });
    
    if (mergeError) throw mergeError;
    
    // 5. 파일 경로 및 상태 업데이트
    await supabase.from('evidence').update({ 
      file_path: path,
      upload_status: 'completed',
      ocr_status: 'not_started',
      embedding_status: 'not_started'
    }).eq('id', evidence.id);
    
    // 6. 청크 파일 정리 (Edge Function에서 처리)
    
    // 7. 백그라운드 작업 시작
    await startProcessingJobs(evidence.id);
    
    return evidence;
  } catch (error) {
    // 오류 발생 시 정리 작업
    console.error('대용량 파일 업로드 오류:', error);
    // 이미 생성된 증거자료 삭제
    if (evidence?.id) {
      await supabase.from('evidence').delete().eq('id', evidence.id);
      // 업로드된 청크도 삭제
      // (Edge Function을 통해 비동기적으로 처리)
    }
    throw error;
  }
};
```

청크 병합을 위한 Edge Function:

```typescript
// supabase/functions/merge-file-chunks/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  const { projectId, evidenceId, filename, chunksCount } = await req.json();
  const path = `${projectId}/${evidenceId}/${filename}`;
  
  try {
    // 1. 임시 저장소 생성
    const chunks = [];
    
    // 2. 모든 청크 다운로드
    for (let i = 0; i < chunksCount; i++) {
      const chunkPath = `${path}_part${i}`;
      const { data, error } = await supabase.storage
        .from('evidence')
        .download(chunkPath);
      
      if (error) throw error;
      chunks.push(data);
    }
    
    // 3. 청크 병합
    const mergedFile = new Blob(chunks);
    
    // 4. 병합된 파일 업로드
    const { error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(path, mergedFile, {
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // 5. 청크 파일 삭제
    const deletePromises = [];
    for (let i = 0; i < chunksCount; i++) {
      const chunkPath = `${path}_part${i}`;
      deletePromises.push(
        supabase.storage
          .from('evidence')
          .remove([chunkPath])
      );
    }
    
    await Promise.all(deletePromises);
    
    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
```

이 방식을 사용하면 수 GB 크기의 대용량 파일도 안정적으로 업로드할 수 있으며, 업로드 중 네트워크 문제가 발생해도 재시도가 용이합니다.

### 5.3 문서 내 이미지 처리

1. **에디터에서 이미지 삽입**:
   ```typescript
   const insertImageToDocument = async (projectId: string, documentId: string, file: File) => {
     // 1. 고유 ID 생성
     const attachmentId = crypto.randomUUID();
     const filename = `${attachmentId}_${file.name}`;
     const path = `${projectId}/${documentId}/${filename}`;
     
     // 2. 이미지 업로드
     const { data, error } = await supabase.storage
       .from('documents')
       .upload(path, file, {
         cacheControl: 'max-age=31536000',
         contentType: file.type,
         upsert: false
       });
     
     if (error) throw error;
     
     // 3. 이미지 URL 생성 (에디터에 삽입용)
     const { data: { publicUrl } } = supabase.storage
       .from('documents')
       .getPublicUrl(path);
     
     // 4. 문서에 이미지 삽입
     return {
       id: attachmentId,
       url: publicUrl,
       path: path,
       filename: file.name
     };
   };
   ```

### 5.4 파일 처리 실패 시 재시도 로직

파일 업로드 및 처리 중 네트워크 오류, 일시적인 서버 장애 등의 문제가 발생할 수 있습니다. 이러한 문제에 대응하기 위한 재시도 로직을 구현합니다.

#### 5.4.1 업로드 재시도 전략

```typescript
/**
 * 지수 백오프(Exponential Backoff) 방식을 사용한 재시도 함수
 * @param operation 실행할 비동기 함수
 * @param maxRetries 최대 재시도 횟수
 * @param baseDelay 기본 지연 시간(ms)
 * @param factor 지연 시간 증가 계수
 */
const retryWithExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  factor = 2
): Promise<T> => {
  let retries = 0;
  let lastError: Error;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      retries++;
      
      if (retries >= maxRetries) break;
      
      // 지수 백오프: baseDelay * factor^retries (약간의 무작위성 추가)
      const delay = baseDelay * Math.pow(factor, retries) * (1 + Math.random() * 0.1);
      console.log(`작업 실패, ${retries}번째 재시도 (${delay}ms 후)...`);
      
      // 지정된 시간만큼 대기
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error(`최대 재시도 횟수(${maxRetries}) 초과: ${lastError?.message}`);
};

// 예시: 재시도 로직이 적용된 파일 업로드 함수
const uploadEvidenceWithRetry = async (projectId: string, file: File, tags: string[] = []) => {
  // 메타데이터 생성
  const { data: evidence, error: dbError } = await supabase
    .from('evidence')
    .insert({
      project_id: projectId,
      title: file.name,
      original_filename: file.name,
      type: getFileType(file.name),
      mime_type: file.type,
      file_size: file.size,
      tags,
      upload_status: 'pending'
    })
    .select()
    .single();
  
  if (dbError) throw dbError;
  
  // 파일 경로 설정
  const filename = `${evidence.id}_${file.name}`;
  const path = `${projectId}/${evidence.id}/${filename}`;
  
  try {
    // 업로드 상태 업데이트
    await supabase.from('evidence').update({ upload_status: 'in_progress' }).eq('id', evidence.id);
    
    // 재시도 로직을 사용한 파일 업로드
    await retryWithExponentialBackoff(
      async () => {
        const { error } = await supabase.storage
          .from('evidence')
          .upload(path, file, {
            cacheControl: 'max-age=31536000',
            contentType: file.type,
            upsert: true
          });
        
        if (error) throw error;
      },
      5,  // 최대 5회 재시도
      2000 // 초기 지연 2초
    );
    
    // 업로드 성공 시 상태 업데이트
    await supabase.from('evidence').update({
      file_path: path,
      upload_status: 'completed',
      ocr_status: 'not_started',
      embedding_status: 'not_started'
    }).eq('id', evidence.id);
    
    // 백그라운드 작업 시작
    await startProcessingJobs(evidence.id);
    
    return evidence;
  } catch (error) {
    // 실패 상태 기록
    await supabase.from('evidence').update({
      upload_status: 'failed',
      upload_error: error.message
    }).eq('id', evidence.id);
    
    // 일정 시간 후 자동 재시도 예약 (선택 사항)
    await scheduleRetry('upload_evidence', { evidenceId: evidence.id, projectId, fileName: file.name });
    
    throw error;
  }
};
```

#### 5.4.2 처리 작업 재시도 관리

파일 처리 작업(OCR, 임베딩 생성 등)의 실패를 관리하기 위한 작업 큐 시스템을 구현합니다:

```typescript
// 작업 큐 테이블 구조
/*
CREATE TABLE job_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  payload JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  retries INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

// 작업 예약 함수
const scheduleJob = async (jobType: string, payload: any, priority = 0, maxRetries = 3) => {
  const { data, error } = await supabase
    .from('job_queue')
    .insert({
      job_type: jobType,
      payload,
      priority,
      max_retries: maxRetries
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// 재시도 예약 함수
const scheduleRetry = async (jobType: string, payload: any, priority = 0) => {
  // 이미 큐에 있는 동일한 작업 확인
  const { data: existingJobs } = await supabase
    .from('job_queue')
    .select()
    .eq('job_type', jobType)
    .eq('payload->evidenceId', payload.evidenceId)
    .in('status', ['pending', 'processing']);
  
  // 이미 대기 중인 작업이 있으면 새 작업을 추가하지 않음
  if (existingJobs?.length > 0) return existingJobs[0];
  
  // 실패한 작업 조회
  const { data: failedJobs } = await supabase
    .from('job_queue')
    .select()
    .eq('job_type', jobType)
    .eq('payload->evidenceId', payload.evidenceId)
    .eq('status', 'failed');
  
  // 실패한 작업이 있으면 재시도 횟수 확인
  if (failedJobs?.length > 0) {
    const failedJob = failedJobs[0];
    
    // 최대 재시도 횟수 미만이면 재시도
    if (failedJob.retries < failedJob.max_retries) {
      // 지수 백오프 지연 계산
      const nextRetryDelay = 60 * 1000 * Math.pow(2, failedJob.retries); // 분 단위로 증가
      const nextRetryAt = new Date(Date.now() + nextRetryDelay);
      
      const { data, error } = await supabase
        .from('job_queue')
        .update({
          status: 'pending',
          retries: failedJob.retries + 1,
          next_retry_at: nextRetryAt,
          updated_at: new Date()
        })
        .eq('id', failedJob.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // 최대 재시도 횟수 초과 시 알림 생성
      await createNotification('maximum_retries_exceeded', {
        evidenceId: payload.evidenceId,
        jobType
      });
      
      throw new Error(`작업 '${jobType}'의 최대 재시도 횟수(${failedJob.max_retries}) 초과`);
    }
  }
  
  // 새 작업 생성
  return scheduleJob(jobType, payload, priority);
};

// Edge Function에서 주기적으로 실행되는 작업 처리 함수
const processJobQueue = async () => {
  // 1. 처리할 작업 가져오기
  const { data: jobs, error } = await supabase
    .from('job_queue')
    .select()
    .eq('status', 'pending')
    .lte('next_retry_at', new Date())
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10);
  
  if (error) throw error;
  
  // 2. 각 작업 처리
  for (const job of jobs) {
    // 작업 상태 업데이트
    await supabase
      .from('job_queue')
      .update({
        status: 'processing',
        updated_at: new Date()
      })
      .eq('id', job.id);
    
    try {
      // 작업 유형에 따라 처리
      switch (job.job_type) {
        case 'upload_evidence':
          await processEvidenceUpload(job.payload);
          break;
        case 'ocr_processing':
          await processOCR(job.payload);
          break;
        case 'embedding_generation':
          await generateEmbeddings(job.payload);
          break;
        // 기타 작업 유형...
        default:
          throw new Error(`알 수 없는 작업 유형: ${job.job_type}`);
      }
      
      // 작업 완료 상태 업데이트
      await supabase
        .from('job_queue')
        .update({
          status: 'completed',
          updated_at: new Date()
        })
        .eq('id', job.id);
    } catch (error) {
      // 작업 실패 상태 업데이트
      await supabase
        .from('job_queue')
        .update({
          status: 'failed',
          error: error.message,
          updated_at: new Date()
        })
        .eq('id', job.id);
      
      console.error(`작업 처리 실패 (ID: ${job.id}, 유형: ${job.job_type}):`, error);
    }
  }
};
```

### 5.5 중복 파일 처리 전략

동일한 파일이 여러 번 업로드되는 경우를 효율적으로 관리하기 위한 중복 파일 처리 전략을 구현합니다.

#### 5.5.1 해시 기반 중복 감지

```typescript
// 파일 해시 계산 함수
const calculateFileHash = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsArrayBuffer(file);
  });
};

// evidence 테이블에 file_hash 컬럼 추가 필요
// ALTER TABLE evidence ADD COLUMN file_hash TEXT;
// CREATE INDEX evidence_file_hash_idx ON evidence(file_hash);

// 중복 확인 후 업로드 함수
const uploadEvidenceWithDuplicateCheck = async (projectId: string, file: File, tags: string[] = []) => {
  try {
    // 1. 파일 해시 계산
    const fileHash = await calculateFileHash(file);
    
    // 2. 동일 프로젝트 내 동일 해시를 가진 파일 검색
    const { data: existingFiles } = await supabase
      .from('evidence')
      .select('id, title, file_path')
      .eq('project_id', projectId)
      .eq('file_hash', fileHash)
      .eq('deleted_at', null);
    
    // 3. 동일한 파일이 이미 존재하는 경우
    if (existingFiles && existingFiles.length > 0) {
      // 3.1. 사용자에게 중복 파일 알림 및 처리 방법 선택 요청
      return {
        isDuplicate: true,
        existingFiles,
        fileHash
      };
    }
    
    // 4. 새 파일인 경우 정상적으로 업로드 진행
    // 메타데이터 생성
    const { data: evidence, error: dbError } = await supabase
      .from('evidence')
      .insert({
        project_id: projectId,
        title: file.name,
        original_filename: file.name,
        type: getFileType(file.name),
        mime_type: file.type,
        file_size: file.size,
        file_hash: fileHash, // 해시 값 저장
        tags
      })
      .select()
      .single();
    
    if (dbError) throw dbError;
    
    // 파일 업로드 로직
    const filename = `${evidence.id}_${file.name}`;
    const path = `${projectId}/${evidence.id}/${filename}`;
    
    const { error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(path, file, {
        cacheControl: 'max-age=31536000',
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      // 업로드 실패 시 데이터베이스 레코드 삭제
      await supabase.from('evidence').delete().eq('id', evidence.id);
      throw uploadError;
    }
    
    // 파일 경로 업데이트
    await supabase.from('evidence').update({ 
      file_path: path,
      ocr_status: 'not_started',
      embedding_status: 'not_started'
    }).eq('id', evidence.id);
    
    // 백그라운드 작업 시작
    await startProcessingJobs(evidence.id);
    
    return {
      isDuplicate: false,
      evidence
    };
  } catch (error) {
    console.error('파일 업로드 중 오류:', error);
    throw error;
  }
};

// 중복 파일 처리 함수 (사용자 선택에 따라 처리)
const handleDuplicateFile = async (
  projectId: string, 
  file: File, 
  fileHash: string, 
  action: 'upload_anyway' | 'use_existing' | 'upload_as_new_version', 
  existingEvidenceId?: string
) => {
  switch (action) {
    case 'upload_anyway':
      // 중복 여부 무시하고 새 파일로 업로드
      return uploadEvidence(projectId, file);
    
    case 'use_existing':
      // 기존 파일 사용
      if (!existingEvidenceId) {
        throw new Error('기존 증거자료 ID가 필요합니다');
      }
      return supabase
        .from('evidence')
        .select()
        .eq('id', existingEvidenceId)
        .single();
    
    case 'upload_as_new_version':
      // 기존 파일의 새 버전으로 업로드
      if (!existingEvidenceId) {
        throw new Error('기존 증거자료 ID가 필요합니다');
      }
      
      // 1. 기존 증거자료 정보 조회
      const { data: existingEvidence, error: fetchError } = await supabase
        .from('evidence')
        .select('title, version, versions')
        .eq('id', existingEvidenceId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // 2. 새 버전 번호 생성
      const newVersion = (existingEvidence.version || 1) + 1;
      
      // 3. 기존 파일 경로 가져오기
      const { data: { publicUrl: existingUrl } } = supabase.storage
        .from('evidence')
        .getPublicUrl(`${projectId}/${existingEvidenceId}/${existingEvidenceId}_${existingEvidence.title}`);
      
      // 4. 새 파일 업로드
      const filename = `${existingEvidenceId}_v${newVersion}_${file.name}`;
      const path = `${projectId}/${existingEvidenceId}/${filename}`;
      
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(path, file, {
          contentType: file.type,
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // 5. 증거자료 메타데이터 업데이트
      const versions = existingEvidence.versions || [];
      versions.push({
        version: existingEvidence.version || 1,
        file_path: existingUrl,
        created_at: new Date()
      });
      
      const { data: updatedEvidence, error: updateError } = await supabase
        .from('evidence')
        .update({
          file_path: path,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          file_hash: fileHash,
          version: newVersion,
          versions: versions
        })
        .eq('id', existingEvidenceId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // 6. 새 파일에 대한 처리 작업 시작
      await startProcessingJobs(existingEvidenceId);
      
      return updatedEvidence;
  }
};
```

#### 5.5.2 중복 파일 처리 정책

중복 파일 발견 시 다음과 같은 처리 정책을 적용합니다:

1. **사용자 선택 기반 처리**:
   - **새로 업로드(Upload Anyway)**: 중복 여부 무시하고 새 파일로 업로드
   - **기존 파일 사용(Use Existing)**: 새 업로드 없이 기존 파일 참조
   - **새 버전으로 업로드(Upload as New Version)**: 기존 파일의 새 버전으로 처리

2. **자동화된 중복 처리 (선택적 적용)**:
   - 프로젝트 설정에 따라 자동 중복 처리 정책 적용
   - 자동으로 기존 파일 사용 또는 항상 새 파일로 업로드

3. **다른 프로젝트 간 중복 파일**:
   - 전역 해시 인덱스를 통해 다른 프로젝트의 동일 파일 감지
   - 사용자에게 다른 프로젝트의 동일 파일 존재 알림 (참조 가능)

```typescript
// 프로젝트 설정에 중복 파일 처리 정책 추가
/*
ALTER TABLE projects ADD COLUMN duplicate_file_policy TEXT DEFAULT 'ask_user';
COMMENT ON COLUMN projects.duplicate_file_policy IS '중복 파일 처리 정책: ask_user, always_upload_new, use_existing, always_new_version';
*/

// 전역 스토리지 중복 확인 (다른 프로젝트 포함)
const checkGlobalDuplicates = async (fileHash: string, projectId: string) => {
  // 1. 현재 프로젝트를 제외한 다른 프로젝트에서 동일 해시 검색
  const { data: duplicates } = await supabase
    .from('evidence')
    .select(`
      id, 
      title, 
      project_id, 
      projects!inner(id, title)
    `)
    .eq('file_hash', fileHash)
    .neq('project_id', projectId)
    .eq('deleted_at', null);
  
  return duplicates || [];
};

// 프로젝트 정책에 따른 중복 파일 처리
const handleDuplicateByPolicy = async (projectId: string, file: File, duplicates: any[]) => {
  // 프로젝트 설정 조회
  const { data: project } = await supabase
    .from('projects')
    .select('duplicate_file_policy')
    .eq('id', projectId)
    .single();
  
  // 중복이 없으면 정상 업로드
  if (!duplicates || duplicates.length === 0) {
    return uploadEvidence(projectId, file);
  }
  
  // 정책에 따른 처리
  switch (project?.duplicate_file_policy) {
    case 'always_upload_new':
      // 항상 새 파일로 업로드
      return uploadEvidence(projectId, file);
    
    case 'use_existing':
      // 기존 파일 사용
      return {
        isDuplicate: true,
        usedExisting: true,
        evidence: duplicates[0]
      };
    
    case 'always_new_version':
      // 항상 새 버전으로 업로드
      const fileHash = await calculateFileHash(file);
      return handleDuplicateFile(
        projectId, 
        file, 
        fileHash,
        'upload_as_new_version', 
        duplicates[0].id
      );
    
    case 'ask_user':
    default:
      // 사용자에게 선택 요청
      return {
        isDuplicate: true,
        duplicates,
        needUserAction: true
      };
  }
};
```

## 6. 스토리지 모니터링 및 관리

### 6.1 파일 접근 로그 추적

Supabase Storage의 접근 로그를 추적하기 위해 다음 테이블을 생성합니다:

```sql
CREATE TABLE storage_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  bucket_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  operation TEXT NOT NULL, -- download, upload, delete, signedUrl
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX storage_access_logs_user_id_idx ON storage_access_logs(user_id);
CREATE INDEX storage_access_logs_bucket_file_idx ON storage_access_logs(bucket_id, file_path);
CREATE INDEX storage_access_logs_created_at_idx ON storage_access_logs(created_at);
```

파일 접근 시 로그를 기록하는 함수:

```typescript
const logStorageAccess = async (bucketId: string, filePath: string, operation: string) => {
  const { error } = await supabase
    .from('storage_access_logs')
    .insert({
      bucket_id: bucketId,
      file_path: filePath,
      operation: operation,
      ip_address: window.clientIp || 'unknown', // 클라이언트 IP (미들웨어에서 설정)
      user_agent: navigator.userAgent
    });
  
  if (error) console.error('로그 기록 오류:', error);
};
```

### 6.2 스토리지 할당량 관리

프로젝트별 스토리지 할당량을 관리하기 위한 함수:

```typescript
const getProjectStorageUsage = async (projectId: string) => {
  // 1. 증거자료 크기 합계
  const { data: evidenceSize, error: evidenceError } = await supabase
    .from('evidence')
    .select('file_size')
    .eq('project_id', projectId);
  
  if (evidenceError) throw evidenceError;
  
  // 2. 문서 첨부 파일 크기 계산 (추정)
  const { data: attachments, error: attachmentsError } = await supabase
    .storage
    .from('documents')
    .list(projectId);
  
  if (attachmentsError) throw attachmentsError;
  
  // 3. 내보내기 파일 크기 계산
  const { data: exports, error: exportsError } = await supabase
    .storage
    .from('exports')
    .list(projectId);
  
  if (exportsError) throw exportsError;
  
  // 4. 총 사용량 계산 (바이트 단위)
  const totalEvidenceSize = evidenceSize.reduce((sum, item) => sum + (item.file_size || 0), 0);
  const totalAttachmentsSize = 0; // 실제로는 파일 메타데이터에서 크기를 가져와야 함
  const totalExportsSize = 0; // 실제로는 파일 메타데이터에서 크기를 가져와야 함
  
  return {
    totalSize: totalEvidenceSize + totalAttachmentsSize + totalExportsSize,
    evidenceSize: totalEvidenceSize,
    attachmentsSize: totalAttachmentsSize,
    exportsSize: totalExportsSize
  };
};
```

### 6.3 임시 파일 자동 삭제

Supabase 함수를 사용하여 매일 임시 파일 및 만료된 내보내기 파일을 자동으로 삭제합니다:

```typescript
// supabase/functions/cleanup-storage/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    // 1. 24시간 이상 지난 임시 파일 찾기
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // temp 버킷의 모든 파일 목록
    const { data: tempFiles, error: tempError } = await supabase
      .storage
      .from('temp')
      .list();
    
    if (tempError) throw tempError;
    
    // 2. 오래된 임시 파일 삭제
    for (const file of tempFiles) {
      // 파일명에서 타임스탬프 추출 (temp/{user_id}/{timestamp}_{random_id}.{extension})
      const timestamp = file.name.split('/')[2].split('_')[0];
      const fileDate = new Date(parseInt(timestamp));
      
      if (fileDate < oneDayAgo) {
        await supabase.storage.from('temp').remove([file.name]);
      }
    }
    
    // 3. 7일 이상 지난 내보내기 파일 삭제
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: exportFiles, error: exportError } = await supabase
      .storage
      .from('exports')
      .list();
    
    if (exportError) throw exportError;
    
    for (const file of exportFiles) {
      const parts = file.name.split('_');
      const timestamp = parts[parts.length - 1].split('.')[0];
      const fileDate = new Date(parseInt(timestamp));
      
      if (fileDate < sevenDaysAgo) {
        await supabase.storage.from('exports').remove([file.name]);
      }
    }
    
    return new Response(JSON.stringify({ status: 'success' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
```

## 7. 백업 및 복구 전략

1. **정기 백업**:
   - 매일 증거자료 버킷의 전체 백업
   - 증분 백업으로 스토리지 효율성 유지
   
2. **복구 절차**:
   - 파일 손상 또는 삭제 시 백업에서 복원
   - 메타데이터와 파일 경로 일관성 유지 확인

## 8. 멀티 리전 배포 전략

1. **파일 복제**:
   - 주요 증거자료는 여러 리전에 복제하여 가용성 향상
   - 액세스 패턴에 따라 리전별 서비스 제공

2. **리전 선택 로직**:
   - 사용자 위치에 가까운 리전에서 파일 제공
   - 장애 발생 시 자동 대체 리전으로 전환 


   --

   [TODO]

   SQL POLICY 명칭을 영어로 변경할 것