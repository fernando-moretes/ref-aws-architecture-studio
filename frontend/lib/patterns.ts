export type Pillar =
  | "operational-excellence"
  | "security"
  | "reliability"
  | "performance"
  | "cost"
  | "sustainability";

export type Pattern = {
  slug: string;
  title: string;
  tagline: string;
  category: "web" | "api" | "data" | "events" | "ml" | "batch";
  services: string[]; // service codes
  description: string;
  whenToUse: string[];
  whenToAvoid: string[];
  mermaid: string;
  adrSummary: {
    context: string;
    decision: string;
    consequences: string[];
  };
  pillars: Partial<Record<Pillar, string>>;
  costNotes: string;
};

export const PATTERNS: Pattern[] = [
  {
    slug: "three-tier-web",
    title: "Classic Three-Tier Web App",
    tagline: "ALB + ECS Fargate + Aurora with CloudFront in front.",
    category: "web",
    services: ["cloudfront", "alb", "ecs", "fargate", "aurora", "elasticache", "s3", "vpc", "waf"],
    description:
      "A pragmatic baseline for stateful web applications: CloudFront caches static assets and protects the origin, an ALB routes to a Fargate service running the app tier, Aurora Postgres holds relational state, and ElastiCache reduces hot-path latency.",
    whenToUse: [
      "You have a single team owning a monolith or a small set of services.",
      "Steady traffic with predictable scaling needs.",
      "You want a managed database without leaving relational guarantees.",
    ],
    whenToAvoid: [
      "Bursty / extremely spiky workloads — Lambda + DynamoDB is a better baseline.",
      "Truly multi-region active-active needs (this pattern is single-region active).",
    ],
    mermaid: `flowchart LR
  User((User)) --> CF[CloudFront]
  CF --> WAF[AWS WAF]
  WAF --> ALB[Application LB]
  ALB --> APP[ECS Fargate Service]
  APP --> DB[(Aurora Postgres)]
  APP --> CACHE[(ElastiCache Redis)]
  APP --> ASSETS[(S3 Assets)]
  CF -.cache.-> ASSETS`,
    adrSummary: {
      context:
        "We need a managed, secure baseline for a web application with stateful relational data and predictable scaling.",
      decision:
        "Adopt CloudFront → WAF → ALB → ECS Fargate → Aurora Postgres with ElastiCache as a hot-path cache. Static assets go to S3 and are served through the same CloudFront distribution.",
      consequences: [
        "Single-region active footprint; cross-region failover is a follow-up decision.",
        "Container images become a unit of delivery; the team needs CI to ECR.",
        "Aurora reduces database operations but introduces vendor coupling.",
      ],
    },
    pillars: {
      security: "WAF in front, KMS-encrypted EBS/Aurora, IAM roles per task, secrets in Secrets Manager.",
      reliability: "Multi-AZ Fargate service + Aurora Multi-AZ; ALB health checks.",
      cost: "Fargate Spot for non-critical tasks; Aurora Serverless v2 for low/variable load.",
      performance: "ElastiCache for hot paths; CloudFront for static assets.",
      "operational-excellence": "Blue/green via CodeDeploy + Fargate; CloudWatch Container Insights.",
    },
    costNotes:
      "Baseline ~$300-700/month for a small workload (1 ALB, 2 Fargate tasks, db.t3.medium Aurora, small ElastiCache). Aurora is the largest line item.",
  },
  {
    slug: "serverless-api",
    title: "Serverless REST API",
    tagline: "API Gateway + Lambda + DynamoDB.",
    category: "api",
    services: ["apigw", "lambda", "dynamodb", "cloudfront", "cloudwatch", "xray", "iam", "kms"],
    description:
      "A pay-per-use API for unpredictable load: API Gateway terminates HTTPS, Lambda handles each request and persists to DynamoDB, with CloudFront in front for caching and edge security.",
    whenToUse: [
      "Spiky or unpredictable traffic; idle is free.",
      "Small, well-bounded API surface (CRUD-ish).",
      "Teams comfortable with event-driven and per-request billing models.",
    ],
    whenToAvoid: [
      "Requests longer than 29s (API Gateway limit) or 15min (Lambda limit).",
      "Workloads requiring complex relational queries with joins.",
    ],
    mermaid: `flowchart LR
  User((Client)) --> CF[CloudFront]
  CF --> APIGW[API Gateway HTTP API]
  APIGW --> L[(Lambda: handler)]
  L --> DDB[(DynamoDB)]
  L --> CW[CloudWatch Logs/Metrics]
  L --> XR[X-Ray Traces]`,
    adrSummary: {
      context:
        "We need a low-ops API that scales to zero and to thousands of requests per second without capacity planning.",
      decision:
        "Use API Gateway HTTP API in front of Lambda functions, with DynamoDB as the system of record. CloudFront fronts the API for caching and WAF.",
      consequences: [
        "No idle cost; per-request cost scales with traffic.",
        "Cold starts must be considered for latency-sensitive endpoints.",
        "Schema design in DynamoDB requires up-front access-pattern thinking.",
      ],
    },
    pillars: {
      security: "IAM auth or Cognito; per-function execution role; KMS for DynamoDB at rest.",
      reliability: "Multi-AZ by default; DLQs on Lambda; on-demand DynamoDB.",
      cost: "Pay per request; no idle cost; reserved concurrency to cap blast radius.",
      performance: "Provisioned concurrency for hot endpoints; DynamoDB DAX if needed.",
      "operational-excellence": "Structured JSON logs; X-Ray tracing; canary deployments.",
    },
    costNotes:
      "At 1M requests/month with avg 200ms Lambda + DynamoDB on-demand, expect ~$5-15/month including CloudWatch.",
  },
  {
    slug: "data-lake",
    title: "Data Lake on S3",
    tagline: "S3 + Glue + Athena + Lake Formation.",
    category: "data",
    services: ["s3", "glue", "athena", "kinesis", "iam", "kms", "cloudwatch"],
    description:
      "An open data lake using S3 as storage, Glue for ETL and cataloging, Athena for SQL on top, and Kinesis for streaming ingestion.",
    whenToUse: [
      "Multi-source analytical workloads where storage is cheap and queries are ad-hoc.",
      "Data engineering teams comfortable with Spark and partitioned Parquet.",
    ],
    whenToAvoid: [
      "Sub-second BI queries on the same dataset — use Redshift or Aurora.",
      "Tiny datasets (< 1 GB) — Postgres is enough.",
    ],
    mermaid: `flowchart LR
  Sources[Source systems] --> KIN[Kinesis Data Streams]
  KIN --> RAW[(S3 raw zone)]
  RAW --> GLUE[Glue ETL Spark]
  GLUE --> CURATED[(S3 curated zone Parquet)]
  CURATED --> ATH[Athena]
  CURATED --> CAT[Glue Data Catalog]
  ATH -.queries.-> Users((Analysts))`,
    adrSummary: {
      context:
        "We need to land event and source-system data centrally for analytics without committing to a single warehouse.",
      decision:
        "Use S3 as the storage layer with raw / curated zones, Glue for ETL and the catalog, and Athena as the default query engine.",
      consequences: [
        "Open formats (Parquet) keep us portable across query engines.",
        "Schema evolution requires discipline in Glue jobs.",
        "Cost grows with scanned bytes — partitioning is critical.",
      ],
    },
    pillars: {
      security: "Lake Formation row/column-level access; KMS-encrypted buckets; IAM roles per zone.",
      reliability: "S3 11-9s durability; cross-region replication for the curated zone.",
      cost: "Lifecycle to IA / Glacier on raw zone; partitioned Parquet to reduce Athena scans.",
      performance: "Partition by date + tenant; columnar Parquet; bucketing for joins.",
      sustainability: "Cold tiers and compaction reduce energy and cost together.",
    },
    costNotes:
      "Storage dominates: $23/TB-month Standard, $4/TB-month Glacier Deep Archive. Athena $5/TB scanned.",
  },
  {
    slug: "event-driven-microservices",
    title: "Event-Driven Microservices",
    tagline: "EventBridge + Lambda + DynamoDB + SQS DLQ.",
    category: "events",
    services: ["eventbridge", "lambda", "sqs", "dynamodb", "sns", "cloudwatch", "iam"],
    description:
      "Producers emit domain events to EventBridge; consumers subscribe by pattern. Each consumer owns its data store and uses SQS as a buffer with a DLQ for poison messages.",
    whenToUse: [
      "Multiple teams owning bounded contexts that must communicate asynchronously.",
      "Need for loose coupling and replay (via EventBridge archive or Kinesis).",
    ],
    whenToAvoid: [
      "Strict synchronous request-response contracts — use API Gateway + Lambda.",
      "Tiny systems where the overhead is more than the benefit.",
    ],
    mermaid: `flowchart LR
  Producer[Producer Service] --> EB((EventBridge Bus))
  EB -->|order.created| Q1[SQS]
  EB -->|order.created| Q2[SQS]
  Q1 --> L1[(Lambda: billing)]
  Q2 --> L2[(Lambda: notification)]
  L1 --> DDB1[(DynamoDB billing)]
  L2 --> SNS[SNS topic]
  Q1 -.dlq.-> DLQ1[(SQS DLQ)]
  Q2 -.dlq.-> DLQ2[(SQS DLQ)]`,
    adrSummary: {
      context:
        "Multiple teams need to react to domain events without runtime coupling to the producer.",
      decision:
        "Adopt EventBridge as the central bus; consumers subscribe via rules; SQS sits between EventBridge and Lambda for durability and DLQs.",
      consequences: [
        "Event schemas become a contract; a registry is needed as the system grows.",
        "Idempotency is the consumer's responsibility.",
        "Replay is possible via EventBridge archive.",
      ],
    },
    pillars: {
      reliability: "DLQs per consumer; retries with backoff; archives for replay.",
      security: "Bus-level resource policies; IAM per rule; encrypt with KMS.",
      "operational-excellence": "Schema registry; event catalog; CloudWatch metrics per rule.",
      cost: "EventBridge $1 per million events; SQS $0.40 per million.",
    },
    costNotes:
      "Generally < $10/month for 10M events including SQS and Lambda invocations.",
  },
  {
    slug: "static-spa-on-cdn",
    title: "Static SPA on CloudFront",
    tagline: "S3 + CloudFront + ACM + Route 53.",
    category: "web",
    services: ["s3", "cloudfront", "route53", "waf", "iam"],
    description:
      "A pure static frontend (Next.js export, Vite, etc.) served from S3 behind CloudFront with TLS via ACM and DNS via Route 53.",
    whenToUse: [
      "Marketing sites, dashboards, SPAs that talk to APIs over HTTPS.",
      "Cost-sensitive deployments where traffic is mostly cacheable.",
    ],
    whenToAvoid: [
      "Server-side rendering with per-request personalization — use Lambda@Edge or Vercel.",
    ],
    mermaid: `flowchart LR
  User((User)) --> R53[Route 53]
  R53 --> CF[CloudFront]
  CF --> WAF[AWS WAF]
  WAF --> S3[(S3 static bucket)]`,
    adrSummary: {
      context:
        "We have a static frontend and need a low-cost, globally fast and secure delivery surface.",
      decision:
        "Serve from S3 behind CloudFront with WAF, ACM-issued TLS and Route 53 DNS.",
      consequences: [
        "Cache invalidations become an operational concern at deploy time.",
        "Origin S3 bucket must be private (OAC).",
      ],
    },
    pillars: {
      security: "OAC for S3, WAF rules, HSTS, no public bucket.",
      cost: "Most traffic is cache hits; sub-$5/month for typical sites.",
      performance: "Edge cache; HTTP/3; Brotli.",
    },
    costNotes: "Often < $5/month for low-traffic sites; CloudFront free tier is generous.",
  },
  {
    slug: "ml-batch-inference",
    title: "Batch ML Inference Pipeline",
    tagline: "Step Functions + SageMaker Batch Transform + S3.",
    category: "ml",
    services: ["s3", "stepfunctions", "sagemaker", "lambda", "eventbridge", "cloudwatch"],
    description:
      "Schedule a batch inference job via EventBridge cron, orchestrate with Step Functions, and use SageMaker Batch Transform to score data lake records into a curated output.",
    whenToUse: [
      "Daily / hourly model scoring on large datasets.",
      "When real-time inference is not required and cost matters.",
    ],
    whenToAvoid: [
      "Real-time low-latency scoring — use a SageMaker endpoint or Lambda + small model.",
    ],
    mermaid: `flowchart LR
  CRON[EventBridge cron] --> SF[Step Functions]
  SF --> PRE[Lambda: prepare]
  PRE --> S3IN[(S3 input)]
  SF --> SM[SageMaker Batch Transform]
  S3IN --> SM
  SM --> S3OUT[(S3 output)]
  SF --> POST[Lambda: post-process]
  S3OUT --> POST`,
    adrSummary: {
      context:
        "We need scheduled, scalable model scoring on data lake batches without standing up a real-time endpoint.",
      decision:
        "Use Step Functions to orchestrate a Lambda preparer, a SageMaker Batch Transform job and a Lambda post-processor, triggered by EventBridge cron.",
      consequences: [
        "No idle endpoint cost between runs.",
        "End-to-end latency is hours, not milliseconds.",
        "Operational complexity is concentrated in the state machine.",
      ],
    },
    pillars: {
      cost: "Pay only when scoring runs; right-size the SageMaker instance.",
      reliability: "Step Functions retries; CloudWatch alarms on failure.",
      "operational-excellence": "Versioned state machine; X-Ray on Lambdas.",
    },
    costNotes:
      "Cost = SageMaker instance-hours + S3 storage. Daily ml.m5.large run for 30 minutes ≈ $1.5/day.",
  },
];

export function findPattern(slug: string): Pattern | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}
