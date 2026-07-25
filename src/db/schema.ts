import { pgTable, uuid, text, timestamp, integer, varchar, jsonb, pgEnum, numeric } from "drizzle-orm/pg-core";

// ─── Enums ───

export const ideaStage = pgEnum("idea_stage", [
  "idea",
  "prototype",
  "live_product",
]);

export const ideaStatus = pgEnum("idea_status", [
  "draft",
  "captured",
  "researching",
  "validating",
  "validated",
  "iterating",
  "archived",
]);

export const researchType = pgEnum("research_type", ["web", "social"]);
export const researchStatus = pgEnum("research_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const suggestionStatus = pgEnum("suggestion_status", [
  "proposed",
  "accepted",
  "rejected",
]);

export const validationTrack = pgEnum("validation_track", ["slow", "fast"]);
export const validationStatus = pgEnum("validation_status", [
  "draft",
  "running",
  "completed",
  "abandoned",
]);

export const verdictEnum = pgEnum("verdict", [
  "strong_yes",
  "lean_yes",
  "mixed",
  "lean_no",
  "strong_no",
]);

export const signalStrength = pgEnum("signal_strength", ["weak", "medium", "strong"]);

export const orderStatus = pgEnum("order_status", [
  "quoted",
  "approved",
  "in_progress",
  "delivered",
  "cancelled",
]);

export const interviewType = pgEnum("interview_type", ["interviewee", "expert"]);
export const interviewStatus = pgEnum("interview_status", [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
]);

// ─── Tables ───

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ideas — one row per idea, belongs to a user
export const ideas = pgTable("ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  currentStage: ideaStage("current_stage").default("idea").notNull(),
  status: ideaStatus("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Context revisions — the versioned backbone. Full context lives here.
// Every meaningful change creates a new revision.
export const ideaContextRevisions = pgTable("idea_context_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  description: text("description"),          // the idea in their words
  productDesc: text("product_desc"),         // what they're building
  stage: ideaStage("stage").default("idea").notNull(),
  targetUser: text("target_user"),           // ICP description
  problem: text("problem"),                  // the pain observed
  audience: text("audience"),                // who it's for
  solution: text("solution"),               // solution hypothesis
  whyNow: text("why_now"),                   // why now
  traction: text("traction"),                // current traction (if live product)
  competitors: text("competitors"),           // known competitors
  assets: jsonb("assets"),                   // links: site, repo, deck, app store, metrics
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Research runs — web/social research executed on a context revision
export const researchRuns = pgTable("research_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  contextRevisionId: uuid("context_revision_id")
    .references(() => ideaContextRevisions.id, { onDelete: "set null" }),
  type: researchType("type").notNull(),
  status: researchStatus("status").default("pending").notNull(),
  findings: jsonb("findings"),               // structured research output
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Research suggestions — proposed changes from research, founder accepts/rejects
export const researchSuggestions = pgTable("research_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  researchRunId: uuid("research_run_id")
    .notNull()
    .references(() => researchRuns.id, { onDelete: "cascade" }),
  suggestion: text("suggestion").notNull(),
  rationale: text("rationale"),              // why this change is proposed
  sourceUrl: text("source_url"),             // what prompted it
  status: suggestionStatus("status").default("proposed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Validation cycles — one per validation run on an idea
export const validationCycles = pgTable("validation_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  contextRevisionId: uuid("context_revision_id")
    .references(() => ideaContextRevisions.id, { onDelete: "set null" }),
  cycleNumber: integer("cycle_number").notNull(),
  track: validationTrack("track").notNull(),
  status: validationStatus("status").default("draft").notNull(),
  verdict: verdictEnum("verdict"),
  confidence: numeric("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Social evidence — from slow track social listening
export const socialEvidence = pgTable("social_evidence", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => validationCycles.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 100 }),
  url: text("url"),
  excerpt: text("excerpt"),
  signalStrength: signalStrength("signal_strength"),
  sentiment: varchar("sentiment", { length: 50 }),
  clusterTag: varchar("cluster_tag", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fast track orders — paid human interviews
export const fastTrackOrders = pgTable("fast_track_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => validationCycles.id, { onDelete: "cascade" }),
  intervieweeCount: integer("interviewee_count").notNull().default(0),
  expertCount: integer("expert_count").notNull().default(0),
  perIntervieweeRate: numeric("per_interviewee_rate", { precision: 10, scale: 2 }),
  expertRate: numeric("expert_rate", { precision: 10, scale: 2 }),
  analysisFee: numeric("analysis_fee", { precision: 10, scale: 2 }),
  totalEstimate: numeric("total_estimate", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: orderStatus("status").default("quoted").notNull(),
  eta: timestamp("eta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  deliveredAt: timestamp("delivered_at"),
});

// Interviews — individual interview records within a fast track order
export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => fastTrackOrders.id, { onDelete: "cascade" }),
  type: interviewType("type").notNull(),
  status: interviewStatus("status").default("scheduled").notNull(),
  notes: jsonb("notes"),                     // structured notes
  signalStrength: signalStrength("signal_strength"),
  tags: jsonb("tags"),                        // signal tags
  analystId: uuid("analyst_id"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Verdicts — the decision-grade report from a validation cycle
export const verdicts = pgTable("verdicts", {
  id: uuid("id").primaryKey().defaultRandom(),
  cycleId: uuid("cycle_id")
    .notNull()
    .references(() => validationCycles.id, { onDelete: "cascade" }),
  verdict: verdictEnum("verdict").notNull(),
  confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull(),
  evidenceSummary: jsonb("evidence_summary"),  // what we heard/found
  signalDistribution: jsonb("signal_distribution"), // weak/medium/strong counts
  nextSteps: jsonb("next_steps"),              // AI-powered recommendations
  releasedAt: timestamp("released_at"),
  reviewedBy: uuid("reviewed_by"),             // analyst who reviewed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hypotheses — structured hypothesis derived from the idea (architecture doc)
export const hypotheses = pgTable("hypotheses", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  problem: text("problem").notNull(),
  buyer: text("buyer").notNull(),
  promisedChange: text("promised_change").notNull(),
  whyNow: text("why_now"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assumptions — ranked riskiest assumptions (architecture doc)
export const assumptions = pgTable("assumptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  risk: varchar("risk", { length: 20 }).default("medium").notNull(),
  uncertainty: varchar("uncertainty", { length: 20 }).default("medium").notNull(),
  rank: integer("rank"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Interview prompts — AI-generated, non-leading prompts from hypothesis
export const interviewPrompts = pgTable("interview_prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  category: varchar("category", { length: 100 }),  // problem, urgency, budget, workflow, etc.
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
