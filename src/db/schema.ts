import { pgTable, uuid, text, timestamp, integer, varchar, jsonb, pgEnum } from "drizzle-orm/pg-core";

// --- Enums ---

export const hypothesisStatus = pgEnum("hypothesis_status", [
  "draft",
  "active",
  "validated",
  "invalidated",
  "archived",
]);

export const assumptionRisk = pgEnum("assumption_risk", [
  "low",
  "medium",
  "high",
]);

export const experimentType = pgEnum("experiment_type", [
  "interview",
  "waitlist",
  "landing",
  "pilot",
]);

export const experimentStatus = pgEnum("experiment_status", [
  "draft",
  "running",
  "completed",
  "abandoned",
]);

export const signalLadder = pgEnum("signal_ladder", [
  "weak",
  "medium",
  "strong",
]);

export const decisionOutcome = pgEnum("decision_outcome", [
  "kill",
  "pivot",
  "build",
]);

// --- Tables ---

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ideas = pgTable("ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  problem: text("problem"),
  audience: text("audience"),
  solution: text("solution"),
  whyNow: text("why_now"),
  status: hypothesisStatus("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Versioned context revisions — the backbone of the capture stage.
// Each time a founder edits their idea context, we store the full snapshot
// so they can see how their thinking evolved.
export const ideaContextRevisions = pgTable("idea_context_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  problem: text("problem"),
  audience: text("audience"),
  solution: text("solution"),
  whyNow: text("why_now"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hypotheses = pgTable("hypotheses", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  problem: text("problem").notNull(),
  buyer: text("buyer").notNull(),
  promisedChange: text("promised_change").notNull(),
  whyNow: text("why_now"),
  status: hypothesisStatus("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assumptions = pgTable("assumptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  risk: assumptionRisk("risk").default("medium").notNull(),
  uncertainty: assumptionRisk("uncertainty").default("medium").notNull(),
  rank: integer("rank"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experiments = pgTable("experiments", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  type: experimentType("type").notNull(),
  status: experimentStatus("status").default("draft").notNull(),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const signals = pgTable("signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  experimentId: uuid("experiment_id")
    .notNull()
    .references(() => experiments.id, { onDelete: "cascade" }),
  ladder: signalLadder("ladder").notNull(),
  score: integer("score"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const decisions = pgTable("decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  cycle: integer("cycle").notNull(),
  outcome: decisionOutcome("outcome").notNull(),
  evidenceRef: jsonb("evidence_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
