// Source of truth for what the biweekly LinkedIn visuals are allowed to draw on.
// Derived from Hassaan's resume. Keep it factual: the generator is told it may only claim
// experience that appears here. Do not add client names or anything confidential (this repo is public).

export const PROFILE = `Hassaan Riaz: Staff Software Consultant at 10Pearls (US-headquartered), delivering remotely for US-based clients from Lahore, Pakistan.
10+ years of engineering: Software Developer at Mezino Technologies (2016-2021), Senior Software Engineer at Rolustech (2021-2022),
Senior Software Engineer II at 10Pearls (2022-2024), Staff Software Consultant at 10Pearls (2025-present).
Stack: Python (Django, DRF, FastAPI, Flask), Scala, Spark/PySpark, AWS (EMR, Glue, S3), GCP, PostgreSQL, MongoDB, Pinecone,
CrewAI, React.js, Angular.js, Docker, Pytest, BDD/TDD, Jira, Confluence.`;

// Each theme is one area of real experience. `experience` is what he actually did (resume wording);
// `angles` are concepts he can credibly explain from that work.
export const THEMES = [
  {
    id: 'rag',
    area: 'RAG pipelines and vector search',
    experience:
      'Designed and built a Retrieval-Augmented Generation pipeline: generated vector embeddings and used Pinecone as the vector database for semantic search and context-aware retrieval over large document sets.',
    angles: [
      'Chunking strategies: fixed-size vs structure-aware vs semantic chunking, and how overlap affects recall',
      'Anatomy of a production RAG pipeline: ingest, chunk, embed, upsert, retrieve, generate',
      'Metadata filtering in vector databases (namespaces, filters) for scoping retrieval',
      'Hybrid search: combining keyword (BM25) and dense vector retrieval',
      'Embedding model choice: dimensions, cost, and why you cannot mix embedding models in one index',
      'Evaluating retrieval quality: recall@k, MRR, and building a small golden dataset',
      'Re-embedding and index migration when the embedding model changes',
      'Grounding answers with citations and handling "insufficient context"',
    ],
  },
  {
    id: 'agents',
    area: 'Multi-agent LLM workflows behind an API',
    experience:
      'Developed a FastAPI application integrated with CrewAI to orchestrate multi-agent workflows, automating a previously manual business process.',
    angles: [
      'When to use agents vs a deterministic workflow with a single LLM call',
      'Decomposing a manual business process into agent roles, tasks and tools',
      'Running long LLM workflows behind an HTTP API: sync vs background jobs vs streaming',
      'Validating LLM output with schemas (Pydantic) before it touches downstream systems',
      'Human-in-the-loop checkpoints in automated agent workflows',
      'Controlling cost and latency in multi-agent pipelines (model tiers, caching, parallel tasks)',
      'Failure handling for LLM calls: timeouts, retries, rate limits, malformed responses',
    ],
  },
  {
    id: 'spark-etl',
    area: 'Large-scale ETL with Scala and Spark on AWS',
    experience:
      'Engineered Scala ETL pipelines transforming large-scale healthcare and logistics datasets into analytics-ready outputs; designed and managed distributed data workflows on AWS EMR and AWS Glue with data on S3.',
    angles: [
      'AWS EMR vs AWS Glue: when to choose which for Spark ETL',
      'Spark partitioning and data skew: why one task runs forever',
      'The small files problem on S3 and how to compact output',
      'Narrow vs wide transformations and what a shuffle really costs',
      'Broadcast joins vs sort-merge joins in Spark',
      'Designing idempotent, re-runnable batch pipelines (partition overwrite, run IDs)',
      'Schema evolution in long-lived data pipelines',
      'Typed Spark in Scala (Datasets) vs PySpark DataFrames',
    ],
  },
  {
    id: 'data-integrity',
    area: 'Data accuracy and integrity in pipelines',
    experience:
      'Stored and served pipeline results through MongoDB with a strong focus on data accuracy and integrity, for healthcare and logistics data.',
    angles: [
      'Data quality gates in ETL: schema, null, range and referential checks before publishing',
      'Reconciliation: proving source and target row counts and totals match',
      'Deduplication and idempotent upserts when loading into MongoDB',
      'Bulk writes to MongoDB from Spark: ordered vs unordered, batching, write concerns',
      'Handling late-arriving and corrected records in batch pipelines',
      'Quarantine (dead-letter) tables for bad records instead of failing the whole job',
    ],
  },
  {
    id: 'backend-apis',
    area: 'Backend services and REST APIs in Python',
    experience:
      'Architected scalable backend services and REST APIs in Python (Django, DRF, FastAPI) for core product features; built REST APIs powering client-facing web apps since 2016; implemented JWT authentication.',
    angles: [
      'Django vs FastAPI: choosing for a new service',
      'Blocking calls inside async FastAPI endpoints and how they stall the event loop',
      'The N+1 query problem in the Django ORM (select_related vs prefetch_related)',
      'JWT authentication flow: access tokens, expiry, and what JWTs cannot do (revocation)',
      'Authentication vs authorization in API design',
      'Pagination strategies: offset vs cursor/keyset',
      'API error design: consistent error envelopes and correlation IDs',
      'Idempotency keys for safe retries on POST endpoints',
    ],
  },
  {
    id: 'refactoring',
    area: 'Refactoring legacy services for performance and reliability',
    experience:
      'Improved API performance and reliability through modular design, code reviews and refactoring of legacy services.',
    angles: [
      'The strangler fig pattern for replacing a legacy service incrementally',
      'Profiling before optimizing: finding where an API actually spends time',
      'Characterization tests: locking in legacy behavior before refactoring',
      'Modular monolith vs microservices: drawing service boundaries',
      'What to look for in a code review beyond style',
    ],
  },
  {
    id: 'testing',
    area: 'Testing strategy: Pytest, TDD and BDD',
    experience:
      'Authored unit and integration tests with Pytest and BDD frameworks, raising coverage and reducing production defects; built automated BDD suites since early in his career.',
    angles: [
      'The test pyramid in practice for a Python backend',
      'BDD (Given/When/Then) as a shared language with product and clients',
      'Testing against a real database vs mocks: transactional test isolation',
      'Pytest fixtures and dependency overrides for testing FastAPI apps',
      'Why coverage percentage is a weak signal and what to measure instead',
      'Flaky tests: common causes and how to eliminate them',
    ],
  },
  {
    id: 'remote-delivery',
    area: 'Remote delivery for US clients across time zones',
    experience:
      'Works remotely from Pakistan (UTC+5) with US-based client stakeholders across time zones, using async communication (Jira, Confluence) to align on scope, priorities and delivery timelines; translates business requirements into technical solutions.',
    angles: [
      'Async-first engineering: writing design docs that unblock a team while you sleep',
      'Making the most of a small time-zone overlap window',
      'Turning a vague client requirement into a scoped technical plan',
      'Surfacing technical risk and dependencies early to non-technical stakeholders',
      'A handoff checklist for distributed teams (PR descriptions, runbooks, decision logs)',
    ],
  },
];
