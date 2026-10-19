// Source of truth for what the twice-weekly LinkedIn visuals draw on.
// Two content pillars:
//   - experience:   lessons from work on Hassaan's resume. The generator may only claim experience
//                   that appears here, so keep it factual.
//   - architecture: system design / scaling deep-dives that position him as a consultant. These are
//                   explainers and decision guides; they must NOT claim hands-on production use of a
//                   technology unless it is listed in an experience theme.
// Do not add client names or anything confidential (this repo is public).

// Personal brand: guides the voice of every post (it is never printed in the post itself). Edit freely.
export const BRAND = {
  positioning:
    'Staff Software Consultant who helps teams design, scale and ship reliable backend, data and AI systems. ' +
    'Known for clear trade-off thinking: when to use a pattern, when not to, and what it costs.',
};

// Which pillar each post uses, cycling by post count: two architecture posts, then one experience post.
export const PILLAR_PATTERN = ['architecture', 'architecture', 'experience'];

export const PROFILE = `Hassaan Riaz: Staff Software Consultant at 10Pearls (US-headquartered), delivering remotely for US-based clients from Lahore, Pakistan.
10+ years of engineering: Software Developer at Mezino Technologies (2016-2021), Senior Software Engineer at Rolustech (2021-2022),
Senior Software Engineer II at 10Pearls (2022-2024), Staff Software Consultant at 10Pearls (2025-present).
Stack: Python (Django, DRF, FastAPI, Flask), Scala, Spark/PySpark, AWS (EMR, Glue, S3), GCP, PostgreSQL, MongoDB, Pinecone,
CrewAI, React.js, Angular.js, Docker, Pytest, BDD/TDD, Jira, Confluence.`;

// Each theme is one area of real experience. `experience` is what he actually did (resume wording);
// `angles` are concepts he can credibly explain from that work.
const EXPERIENCE_THEMES = [
  {
    id: 'rag',
    pillar: 'experience',
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
    pillar: 'experience',
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
    pillar: 'experience',
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
    pillar: 'experience',
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
    pillar: 'experience',
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
    pillar: 'experience',
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
    pillar: 'experience',
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
    pillar: 'experience',
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

// Consultant-level system design topics. `focus` frames the theme for the generator.
const ARCHITECTURE_THEMES = [
  {
    id: 'messaging',
    pillar: 'architecture',
    area: 'Messaging and event streaming (Kafka, RabbitMQ, SQS)',
    focus: 'Choosing and operating message brokers and event streams correctly.',
    angles: [
      'Kafka vs RabbitMQ vs SQS: log vs queue, and which to choose for which workload',
      'Kafka partitions, keys and consumer groups: how ordering and parallelism really work',
      'RabbitMQ exchanges: direct vs topic vs fanout vs headers routing',
      'At-most-once vs at-least-once vs exactly-once delivery, and what "exactly-once" in Kafka actually guarantees',
      'The transactional outbox pattern: publishing events without dual writes',
      'Dead-letter queues and poison messages: retry topics with backoff',
      'Consumer lag: what it signals and how to scale consumers',
      'Competing consumers vs pub/sub fan-out',
      'Message ordering guarantees and the cost of strict ordering',
      'Schema registry and event versioning (Avro/Protobuf, backward compatibility)',
    ],
  },
  {
    id: 'async-concurrency',
    pillar: 'architecture',
    area: 'Async I/O and concurrency',
    focus: 'Getting concurrency right in backend services, especially Python.',
    angles: [
      'Concurrency vs parallelism vs async I/O',
      'How the asyncio event loop schedules coroutines (and what blocks it)',
      'Threads vs processes vs asyncio in Python: picking by workload (I/O vs CPU-bound)',
      'The GIL and free-threaded Python (3.13+): what changes for backend code',
      'Backpressure: bounded queues and semaphores to stop overload',
      'Structured concurrency with asyncio.TaskGroup and cancellation',
      'Connection pools under async load: sizing and exhaustion',
      'Background work in web apps: in-process tasks vs Celery/ARQ workers',
      'Race conditions in async code: check-then-act and how to avoid it',
    ],
  },
  {
    id: 'scaling',
    pillar: 'architecture',
    area: 'Scaling web applications',
    focus: 'How systems grow from one server to many, and the trade-offs at each step.',
    angles: [
      'Scaling a web app from 1 to 1M users: the typical stages',
      'Vertical vs horizontal scaling, and why stateless services come first',
      'L4 vs L7 load balancing and load-balancing algorithms',
      'Caching strategies: cache-aside vs write-through vs write-back',
      'Cache stampede / thundering herd: request coalescing, jittered TTLs, early refresh',
      'Read replicas and replication lag: read-your-writes problems',
      'Database sharding strategies: range vs hash vs directory',
      'Consistent hashing and virtual nodes',
      'Autoscaling signals: CPU vs queue depth vs latency',
      'CDNs and edge caching for APIs',
    ],
  },
  {
    id: 'distributed-data',
    pillar: 'architecture',
    area: 'Distributed data and consistency',
    focus: 'Keeping data correct when it lives in more than one place.',
    angles: [
      'CAP vs PACELC: the trade-off that matters day to day',
      'Saga pattern: orchestration vs choreography',
      'Two-phase commit and why most microservices avoid it',
      'Event sourcing and CQRS: when they pay off and when they hurt',
      'Change Data Capture (CDC) with Debezium: streaming database changes',
      'Idempotency keys: making retries safe end to end',
      'Distributed locks and fencing tokens',
      'Optimistic vs pessimistic locking',
      'Leader-follower vs multi-leader vs leaderless replication',
    ],
  },
  {
    id: 'resilience',
    pillar: 'architecture',
    area: 'Reliability and resilience patterns',
    focus: 'Designing services that degrade gracefully instead of failing together.',
    angles: [
      'Retries with exponential backoff and jitter (and retry storms)',
      'Circuit breaker pattern: closed, open, half-open',
      'Timeouts and deadline propagation across service calls',
      'Bulkhead pattern: isolating failures',
      'Rate limiting algorithms: token bucket vs leaky bucket vs sliding window',
      'Load shedding and graceful degradation',
      'SLIs, SLOs and error budgets for a backend team',
      'Health checks: liveness vs readiness vs startup probes',
    ],
  },
  {
    id: 'architecture-decisions',
    pillar: 'architecture',
    area: 'Architecture decisions and service design',
    focus: 'The structural decisions a consultant helps teams make, and how to reason about them.',
    angles: [
      'Monolith vs modular monolith vs microservices: choosing by team and domain',
      'Synchronous (REST/gRPC) vs asynchronous (events) service communication',
      'API gateway vs backend-for-frontend (BFF)',
      'REST vs gRPC vs GraphQL: picking an API style',
      'Event-driven architecture: benefits and hidden costs',
      'Multi-tenancy patterns: shared schema vs schema-per-tenant vs database-per-tenant',
      'Architecture Decision Records (ADRs): documenting why, not just what',
      'Domain-driven design boundaries: finding service seams',
      'Build vs buy for platform components',
    ],
  },
  {
    id: 'databases-at-scale',
    pillar: 'architecture',
    area: 'Databases at scale',
    focus: 'How databases behave under real load, and how to choose and tune them.',
    angles: [
      'B-tree vs LSM-tree storage engines',
      'How database indexes work, and when they hurt writes',
      'Transaction isolation levels and the anomalies each one allows',
      'MVCC in PostgreSQL: how readers and writers avoid blocking',
      'Connection pooling with PgBouncer: transaction vs session mode',
      'Table partitioning in PostgreSQL for large time-series data',
      'SQL vs NoSQL: choosing by access pattern, not hype',
      'Offset vs keyset pagination at scale',
    ],
  },
  {
    id: 'ai-architecture',
    pillar: 'architecture',
    area: 'Architecture of production AI/LLM systems',
    focus: 'Running LLM features reliably and economically at scale (connects to his real RAG and agent work).',
    angles: [
      'LLM gateway pattern: routing, fallbacks, rate limits and cost tracking',
      'Semantic caching for LLM responses',
      'Vector search internals: HNSW vs IVF indexes',
      'Scaling RAG: multi-tenant isolation and index partitioning',
      'Evaluating LLM features in production: offline evals vs online signals',
      'Streaming LLM responses through an API (SSE) and handling disconnects',
      'Guardrails: validating and constraining LLM output before acting on it',
    ],
  },
];

export const THEMES = [...EXPERIENCE_THEMES, ...ARCHITECTURE_THEMES];
