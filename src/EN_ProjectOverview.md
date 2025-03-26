# LegalEditor Project Overview

## 1. Overview
### 1.1 Project Introduction
LegalEditor is a web service for legal document creation, featuring specialized functions for document writing and review.

---

### 1.2 Project Goals (Enhanced Version)
  - **Providing an intuitive and efficient document editing/review environment**: Offering an environment where users can easily write and review legal documents, simplifying workflow by integrating a Plate.js-based rich text editor, file viewer, and law/precedent viewer.
  - **Real-time support and productivity enhancement through AI LLM and AI Agent**: Providing real-time support for document generation, legal risk review, user question responses, and instruction execution through AI LLM and AI Agent like OpenAI GPT-4o, meeting various user needs through Ask/Write/Review modes.
  - **Advanced document management, search, and annotation features**: Extracting text from uploaded files using Upstage AI OCR, enabling quick exploration of files, laws, and precedents through Qdrant RAG-based keyword/context search, and maximizing collaboration and review efficiency through annotation management.
  - **Utilizing legal resources through National Law Information Center Open API**: Providing functionality to search and cite laws and precedents in real-time, enhancing reliability and accuracy in legal document writing, and enabling easy insertion.
  - **Project-specific document/evidence management and collaboration optimization**: Systematically organizing project data with a tree-structured left sidebar using Supabase Storage, and enhancing team work efficiency through role-based collaboration (Owner, Admin, Editor) and notification system.
  - **Maximizing work efficiency through AI-based automation and recommendations**: Reducing repetitive work and increasing productivity through AI-based features such as automatic key points and tag generation during file upload, AI-recommended search results, and real-time clause/law suggestions during document editing.
  - **Strategic legal document writing and risk management through project goal setting and analysis**: Hierarchically managing goals, claims, and facts through the project analysis tab, strengthening legal strategy formulation and document consistency by providing AI-based neutrality verification and risk warnings.
 
---

## 2. Main Features

### 2.1 Project Management 
- **Participant Roles**: Owner, Admin, Editor, Commentator, Viewer.
- **Collaboration**: Invitation acceptance/rejection, paid plan verification, payment suspension handling, AI permission system, notification system.

### 2.2 Screen Structure within Project
- **Project Navigation Bar** (`ProjectNavigationBarComponent.tsx`): Project selection (`ProjectSelectionDropdownComponent.tsx`), "Main Navigation Tab" (`MainNavigationTabsComponent.tsx`) (Workspace, Project Analysis, Chat), member management (`MemberManagementPanelComponent.tsx`), search field (`GlobalSearchFieldComponent.tsx`)
- **Left Sidebar: ProjectData Navigator** (`ProjectLeftSidebarComponent.tsx`)
- **Main Screen** (`ProjectMainAreaComponent.tsx`)
  1. Workspace Screen (`WorkspaceScreen.tsx`): Multiple tab screens including document editor tab screens, file viewer tab screens, law/precedent viewer tab screens
  2. Project Analysis Screen (`ProjectAnalysisScreen.tsx`)
  3. Chat Screen (`ChatScreen.tsx`)
- **Right Sidebar: AI Agent** (`ProjectRightSidebarComponent.tsx`): 

### 2.3 Project File Management
- **Upload/Management**: Utilizing Supabase Storage. Managing ProjectData (including files) in tree structure on left sidebar.
- **OCR**: Text extraction from PDFs, images, etc. using Upstage AI. Storing in Supabase and Qdrant. Storing by page and paragraph standards respectively.
- **Key Points and Tag Generation**: Extracting and storing key points and keyword tags during file upload.
- **Search**: 
  - Keyword/context-based search using Qdrant RAG in addition to title and content matching search.
  - Including AI auto-recommended search results.
  - Searchable in document editor, file viewer, law/precedent viewer, and all citation-available locations.
  - Search modal provides file list, content preview, and relevant content highlighting in the same screen.
- **Citation**: Mentionable in AI Agent, documents, comments, project analysis, chat, mention dropdown and mention inline chip.
- **Annotations**: Annotation insertion/management using pdf-annotate.js. Available in both **File Preview Modal** and **File View Screen**.
- **File Preview Modal**: Shows contextually relevant content in modal (`FilePreviewModalComponent.tsx`) on mouse hover.
- **File View Screen**: View file content in file view screen (`FileViewScreen.tsx`) as a tab screen in workspace screen (`WorkspaceScreen.tsx`).

### 2.4 Project Law/Precedent Management
- **Law/Precedent API Search**: Utilizing National Law Information Center Open API, storing in Supabase and Qdrant.
- **Law/Precedent RAG Search**: Keyword/context-based search of stored laws/precedents using Qdrant RAG.
- **Citation**: Mentionable in AI Agent, documents, comments, project analysis, chat, mention dropdown and mention inline chip.
- **Annotations**: Annotation insertion/management for specific clauses or paragraphs of laws/precedents. Available in both **Law/Precedent Preview** and **Law/Precedent Viewer**.
- **Law/Precedent Preview Modal**: Shows law (`LawPreviewModalComponent.tsx`) or precedent (`PrecedentPreviewModalComponent.tsx`) preview modal on mouse hover.
- **Law/Precedent View Screen**: View law or precedent content in law view screen (`LawViewScreen.tsx`) or precedent view screen (`PrecedentViewScreen.tsx`) as a tab screen in workspace screen (`WorkspaceScreen.tsx`).

      -------

      # [ProjectData]
      ## [EditingDocument]
      - Documents written or being written by users in this app

      ## [ProjectReference]
      ### Evidence: Materials supporting the facts of this project. Can be submitted by us or the opposing party. ('Our Evidence', 'Opposing Party Evidence')
      ### Claiming Document: Documents stating claims from both our side and the opposing party. Our pleadings, briefs, reference documents, etc., and opposing party's pleadings, briefs, reference documents, etc.
      ### Law: Currently effective legal norms
      ### Precedent: Precedents that serve as de facto legal norms through interpretation and application of laws
      ### Considerable Document: Reference materials that are not laws or precedents but are worth considering for the case
      ### Project Final Judgement: Final judgment from courts, prosecutors, or administrative agencies regarding the dispute. Since it's an initial judgment result, we need to review how to dispute it.

      - Among these, evidence, claiming documents, reference documents, and project final judgements are in 'file' form. That is, PDF, DOCX, PPTX, EXLS, HWP, video, audio, various images, etc.

      -------

### 2.5 Project Document Editing and Management
- **Features**: Legal document writing using Plate.js-based rich text editor.
- **Document Editor**: Professional word processor features (formatting, templates, automatic numbering), easy verification and citation of evidence and laws.
- **File, Law/Precedent Search and Citation**: Call context menu by entering '@' in text editor. Can directly type names of 'ProjectReference[=files, laws/precedents]' or select most relevant ones through search modal.
- **Simultaneous Editing**: Members with Edit permission can work simultaneously.
- **Export**: PDF, DOCX
- **AI Agent Utilization**
  - Can send context before and after cursor position in document editor to AI Agent, or send selected block in document editor to AI Agent.
  - When AI Agent modifies document content, can choose to accept/reject. Can also ask/write/review instructions to AI Agent with that context without choosing accept/reject.
  
### 2.6 AI Agent

- **Ask Mode**:
  - Project data-based answers to user questions (e.g., "Need for damages clause", "Evidence or precedents to cite for this claim").
  - Excludes modifications.
- **Write Mode**:
  - Document generation/modification instruction execution (e.g., "Add confidentiality clause", "Write appeal reasons").
  - Project analysis modification, evidence comment suggestions.
- **Review Mode**:
  - Feedback on legal risks, errors, improvement points.
- **Real-time Support (Future Plan)**:
  - Real-time clause, phrase, law/precedent suggestions.
  - Context-based auto-completion and template recommendations.

### 2.7 Project Analysis
- **Structure**: Three subtabs of 'Our Position Analysis', 'Opposing Party Position Analysis (and Our Counter-strategy)', 'Neutral Fact Analysis'
- **Features**: 
  1. Hierarchical management of Goals, Claims, Facts, ProjectData + AI real-time feedback/modification
  2. AI Agent references project analysis content in search, recommendations, and document editor work.
  3. Easy addition of project analysis items throughout document editor, file viewer, chat, etc.
- **Visualization**: Tree, filtering, consistency/ambiguity verification (warning messages)
- **AI Support**: Goal/claim classification, search and recommendations, neutrality verification, fact subdivision suggestions
- **Citation**: In AI Agent, documents, comments, project analysis, chat, `[@ Goal/Claim/Fact]` format
- **Preview**: Goal/claim/fact preview modal (`GoalClaimFactPreviewModalComponent.tsx`) on mouse hover

      -------

      ## [Opponent]
      - Here, opponent refers to individuals or corporations in civil cases, investigative agencies (prosecutors, police) in criminal cases, tax authorities in tax cases, administrative agencies in administrative disposition/investigation cases, Financial Supervisory Service in financial investigation cases, Fair Trade Commission in fair trade investigation/disposition cases, etc.

      - **Goal**: In legal practice, a goal means one of the following:
        1. Obtaining specific things from the opposing party such as money, real estate delivery, property return, right transfer, etc.
        2. Defending against the opposing party's claims for money, delivery, right transfer, etc. in litigation or non-litigation
        3. Achieving favorable contract/agreement conclusion through negotiation with the opposing party
        4. Obtaining favorable decisions from legal judgment institutions such as courts/prosecutors/police/administrative agencies/tax authorities/arbitration institutions
        5. Preventing unexpected excessive tax imposition or tax investigation
        6. Preventing future risks of litigation, criminal complaint, claims, media exposure, or investigation from unspecified persons, investigative agencies/administrative agencies/tax authorities, etc.
        
        Goals should not overlap or be in purpose/means relationship with other goals. Goals are the ultimate final results to be achieved.

      - **Claim**: Claims are specific legal arguments or positions to achieve goals. Each claim supports one or more goals and must be supported by Facts and ProjectReference including laws, precedents, project final judgements, and reference documents. For example, if the goal is to receive damages, a claim would be "damages occurred due to the opposing party's contract breach."

      - **Fact**: Facts are extracted contents following the 6W principle (preferably including when, who, what, where, why, how) directly supported by evidence and claiming documents among ProjectReference. Facts can have a hierarchical structure, and comprehensive/abstract/ambiguous facts can be composed of more specific subdivided subordinate facts. For example, the comprehensive fact "Eulsoon breached the contract" can be subdivided into specific subordinate facts like "Eulsoon received 1 million won in real estate purchase contract balance on April 1, 2024, 16:23", "Eulsoon did not comply with the balance payment deadline specified in the contract on April 1, 2024."

      -------


### 2.8 Chat
- **Features**: Real-time chat, ProjectData, Project Analysis items[Goals, Claims, Facts] citation available.


---

## 3. Target Users
- Legal professionals (lawyers, legal practitioners, etc.).
- Corporate legal teams.
- General users who need to write legal documents.

---

## 4. Technical Stack
### 4.1 Frontend
- React 18, TypeScript 5.x, Plate.js, react-pdf, pdf-annotate.js.

### 4.2 Backend
- Next.js 14, Supabase (DB/Storage), Drizzle ORM, Qdrant, FastAPI (Python server).

### 4.3 AI
- OpenAI GPT-4o (document generation, AI Agent), Upstage AI (OCR).

### 4.4 Others
- National Law Information Center Open API (law/precedent search).
- Supabase Realtime (chat).
- jsPDF (PDF export). 