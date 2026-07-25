-- BRAINS-AI migration: survey / questionnaire engine
-- Adds surveys, survey_questions, survey_responses, survey_answers, survey_analyses.

CREATE TYPE "survey_status" AS ENUM ('draft', 'published', 'closed');

CREATE TABLE "surveys" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "cycle_id" uuid NOT NULL REFERENCES "validation_cycles"("id") ON DELETE CASCADE,
  "idea_id" uuid NOT NULL REFERENCES "ideas"("id") ON DELETE CASCADE,
  "title" varchar(500) NOT NULL,
  "intro" text,
  "status" "survey_status" DEFAULT 'draft' NOT NULL,
  "track" "validation_track" NOT NULL,
  "outreach_message" text,
  "target_count" integer DEFAULT 10 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "survey_questions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "survey_id" uuid NOT NULL REFERENCES "surveys"("id") ON DELETE CASCADE,
  "question" text NOT NULL,
  "category" varchar(100),
  "order" integer DEFAULT 0 NOT NULL,
  "is_gating" boolean DEFAULT false NOT NULL,
  "is_required" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "survey_responses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "survey_id" uuid NOT NULL REFERENCES "surveys"("id") ON DELETE CASCADE,
  "respondent_name" varchar(255),
  "respondent_email" varchar(255),
  "is_expert" boolean DEFAULT false NOT NULL,
  "is_paid" boolean DEFAULT false NOT NULL,
  "problem_experienced" varchar(20),
  "submitted_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "survey_answers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "response_id" uuid NOT NULL REFERENCES "survey_responses"("id") ON DELETE CASCADE,
  "question_id" uuid NOT NULL REFERENCES "survey_questions"("id") ON DELETE CASCADE,
  "answer" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "survey_analyses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "survey_id" uuid NOT NULL REFERENCES "surveys"("id") ON DELETE CASCADE,
  "analysis" jsonb NOT NULL,
  "gate_passed" boolean NOT NULL,
  "problem_experienced_pct" numeric(5, 2) NOT NULL,
  "verdict" "verdict",
  "summary" text NOT NULL,
  "recommendation" text NOT NULL,
  "respondent_breakdown" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);
