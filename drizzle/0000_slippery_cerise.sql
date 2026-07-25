CREATE TYPE "public"."idea_stage" AS ENUM('idea', 'prototype', 'live_product');--> statement-breakpoint
CREATE TYPE "public"."idea_status" AS ENUM('draft', 'captured', 'researching', 'validating', 'validated', 'iterating', 'archived');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."interview_type" AS ENUM('interviewee', 'expert');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('quoted', 'approved', 'in_progress', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."research_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."research_type" AS ENUM('web', 'social');--> statement-breakpoint
CREATE TYPE "public"."signal_strength" AS ENUM('weak', 'medium', 'strong');--> statement-breakpoint
CREATE TYPE "public"."suggestion_status" AS ENUM('proposed', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."validation_status" AS ENUM('draft', 'running', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."validation_track" AS ENUM('slow', 'fast');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('strong_yes', 'lean_yes', 'mixed', 'lean_no', 'strong_no');--> statement-breakpoint
CREATE TABLE "assumptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"text" text NOT NULL,
	"risk" varchar(20) DEFAULT 'medium' NOT NULL,
	"uncertainty" varchar(20) DEFAULT 'medium' NOT NULL,
	"rank" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fast_track_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"interviewee_count" integer DEFAULT 0 NOT NULL,
	"expert_count" integer DEFAULT 0 NOT NULL,
	"per_interviewee_rate" numeric(10, 2),
	"expert_rate" numeric(10, 2),
	"analysis_fee" numeric(10, 2),
	"total_estimate" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'USD',
	"status" "order_status" DEFAULT 'quoted' NOT NULL,
	"eta" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"delivered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hypotheses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"problem" text NOT NULL,
	"buyer" text NOT NULL,
	"promised_change" text NOT NULL,
	"why_now" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idea_context_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"description" text,
	"product_desc" text,
	"stage" "idea_stage" DEFAULT 'idea' NOT NULL,
	"target_user" text,
	"problem" text,
	"audience" text,
	"solution" text,
	"why_now" text,
	"traction" text,
	"competitors" text,
	"assets" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"current_stage" "idea_stage" DEFAULT 'idea' NOT NULL,
	"status" "idea_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"category" varchar(100),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"type" "interview_type" NOT NULL,
	"status" "interview_status" DEFAULT 'scheduled' NOT NULL,
	"notes" jsonb,
	"signal_strength" "signal_strength",
	"tags" jsonb,
	"analyst_id" uuid,
	"scheduled_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"context_revision_id" uuid,
	"type" "research_type" NOT NULL,
	"status" "research_status" DEFAULT 'pending' NOT NULL,
	"findings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "research_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"research_run_id" uuid NOT NULL,
	"suggestion" text NOT NULL,
	"rationale" text,
	"source_url" text,
	"status" "suggestion_status" DEFAULT 'proposed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"platform" varchar(100),
	"url" text,
	"excerpt" text,
	"signal_strength" "signal_strength",
	"sentiment" varchar(50),
	"cluster_tag" varchar(200),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "validation_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idea_id" uuid NOT NULL,
	"context_revision_id" uuid,
	"cycle_number" integer NOT NULL,
	"track" "validation_track" NOT NULL,
	"status" "validation_status" DEFAULT 'draft' NOT NULL,
	"verdict" "verdict",
	"confidence" numeric(5, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "verdicts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cycle_id" uuid NOT NULL,
	"verdict" "verdict" NOT NULL,
	"confidence" numeric(5, 2) NOT NULL,
	"evidence_summary" jsonb,
	"signal_distribution" jsonb,
	"next_steps" jsonb,
	"released_at" timestamp,
	"reviewed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fast_track_orders" ADD CONSTRAINT "fast_track_orders_cycle_id_validation_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."validation_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hypotheses" ADD CONSTRAINT "hypotheses_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idea_context_revisions" ADD CONSTRAINT "idea_context_revisions_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_prompts" ADD CONSTRAINT "interview_prompts_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_order_id_fast_track_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."fast_track_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_runs" ADD CONSTRAINT "research_runs_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_runs" ADD CONSTRAINT "research_runs_context_revision_id_idea_context_revisions_id_fk" FOREIGN KEY ("context_revision_id") REFERENCES "public"."idea_context_revisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_suggestions" ADD CONSTRAINT "research_suggestions_research_run_id_research_runs_id_fk" FOREIGN KEY ("research_run_id") REFERENCES "public"."research_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_evidence" ADD CONSTRAINT "social_evidence_cycle_id_validation_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."validation_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validation_cycles" ADD CONSTRAINT "validation_cycles_idea_id_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validation_cycles" ADD CONSTRAINT "validation_cycles_context_revision_id_idea_context_revisions_id_fk" FOREIGN KEY ("context_revision_id") REFERENCES "public"."idea_context_revisions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verdicts" ADD CONSTRAINT "verdicts_cycle_id_validation_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."validation_cycles"("id") ON DELETE cascade ON UPDATE no action;