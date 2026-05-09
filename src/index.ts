#!/usr/bin/env node

/**
 * Waypoint MCP Server
 *
 * An MCP server that helps teachers differentiate instruction for students
 * with Individualized Education Programs (IEPs).
 *
 * Architecture:
 * - Resources: Structured IEP and lesson data decomposed into semantic sections
 * - Tools: Functions for generating modifications, scaffolding, and compliance checking
 * - Prompts: Pre-built templates for common teacher workflows
 *
 * The server exposes the IEP and curriculum data in a way that lets Claude
 * reason about the intersection of a specific student's needs and a specific
 * lesson's content, producing concrete, classroom-ready modifications.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getIEPResourceList, readIEPResource } from "./resources/iep.js";
import { getLessonResourceList, readLessonResource } from "./resources/lesson.js";
import {
  generateModifications,
  generateModificationsSchema,
} from "./tools/generate-modifications.js";
import {
  matchAccommodations,
  matchAccommodationsSchema,
} from "./tools/match-accommodations.js";
import {
  scaffoldQuestion,
  scaffoldQuestionSchema,
} from "./tools/scaffold-questions.js";
import {
  checkCompliance,
  checkComplianceSchema,
} from "./tools/check-compliance.js";
import { z } from "zod";
import {
  generatePrepSummary,
  prepSummarySchema,
} from "./tools/prep-summary.js";
import { getPromptMessages } from "./prompts/index.js";

const server = new McpServer({
  name: "waypoint-iep",
  version: "1.0.0",
});

// ── Resources ────────────────────────────────────────────────────────

server.resource(
  "iep-profile",
  "iep://jasmine-bailey/profile",
  {
    description:
      "Student demographics, disability, strengths, challenges, motivators, and student vision",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readIEPResource(uri.href),
      },
    ],
  })
);

server.resource(
  "iep-present-levels",
  "iep://jasmine-bailey/present-levels",
  {
    description:
      "Current academic (ELA Grade 3, Math Grade 4) and behavioral performance with assessment data",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readIEPResource(uri.href),
      },
    ],
  })
);

server.resource(
  "iep-goals",
  "iep://jasmine-bailey/goals",
  {
    description:
      "Three IEP goals: Self-Regulation, Mathematics, ELA with baselines, targets, and benchmarks",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readIEPResource(uri.href),
      },
    ],
  })
);

server.resource(
  "iep-accommodations",
  "iep://jasmine-bailey/accommodations",
  {
    description:
      "11 legally mandated accommodations (presentation, timing, setting) and 3 modifications (content, instruction)",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readIEPResource(uri.href),
      },
    ],
  })
);

server.resource(
  "iep-services",
  "iep://jasmine-bailey/services",
  {
    description:
      "Service delivery schedule: SE teacher daily 55 min (Math + ELA), Counselor weekly 30 min",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readIEPResource(uri.href),
      },
    ],
  })
);

server.resource(
  "iep-full",
  "iep://jasmine-bailey/full",
  {
    description: "Complete IEP data: all sections combined",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readIEPResource(uri.href),
      },
    ],
  })
);

server.resource(
  "lesson-overview",
  "lesson://community-belonging/overview",
  {
    description:
      "Lesson metadata: title, standards (RI.7.2), activities, timing, facilitation options",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readLessonResource(uri.href),
      },
    ],
  })
);

server.resource(
  "lesson-text",
  "lesson://community-belonging/text",
  {
    description: "Full article text: 'What is Community?' by Toby Lowe (11 paragraphs)",
    mimeType: "text/plain",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/plain",
        text: readLessonResource(uri.href),
      },
    ],
  })
);

server.resource(
  "lesson-questions",
  "lesson://community-belonging/questions",
  {
    description:
      "All questions: 8 during-reading, 4 multiple-choice, 1 short answer, 3 discussion (with answers)",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readLessonResource(uri.href),
      },
    ],
  })
);

server.resource(
  "lesson-activities",
  "lesson://community-belonging/activities",
  {
    description:
      "4 activities: Intro (5 min), During Reading (15 min), Independent Practice (20 min), Discussion (5 min)",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readLessonResource(uri.href),
      },
    ],
  })
);

server.resource(
  "lesson-vocabulary",
  "lesson://community-belonging/vocabulary",
  {
    description:
      "8 vocabulary words: Aspect, Moral, Narrative, Specific, Solidarity, Dispersed, Manifestation, Essence",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readLessonResource(uri.href),
      },
    ],
  })
);

server.resource(
  "lesson-full",
  "lesson://community-belonging/full",
  {
    description: "Complete lesson plan: all sections combined",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: readLessonResource(uri.href),
      },
    ],
  })
);

// ── Tools ────────────────────────────────────────────────────────────

server.tool(
  "generate_lesson_modifications",
  "Generate specific, actionable instructional modifications for a lesson activity. Modifications are organized using UDL framework (Engagement, Representation, Action & Expression) and grounded in both the curriculum content and IEP. Returns a structured prompt with full student context, relevant IEP goals, accommodations, lesson content, and modification instructions for Claude to reason about.",
  generateModificationsSchema.shape,
  async (params) => {
    const result = generateModifications(
      params as any
    );
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

server.tool(
  "match_accommodations",
  "Map each IEP accommodation to specific moments in the lesson. Produces a concrete accommodation-activity matrix showing exactly WHEN and HOW each legally mandated accommodation should be implemented during the 45-minute lesson. Optionally includes proactive self-regulation checkpoints based on the student's behavioral pattern (frustration -> avoidance -> shutdown).",
  matchAccommodationsSchema.shape,
  async (params) => {
    const result = matchAccommodations(
      params as any
    );
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

server.tool(
  "scaffold_question",
  "Generate a scaffolded version of a specific lesson question calibrated to the student's reading level (Grade 3 iReady, Grade 2 informational text). Produces sentence starters, graphic organizers, chunked sub-questions, or fill-in-the-blank alternatives. All scaffolds use the actual lesson content (specific paragraphs, vocabulary, examples). Available levels: light (hints), moderate (starters + organizers), intensive (fill-in-the-blank).",
  scaffoldQuestionSchema.shape,
  async (params) => {
    const result = scaffoldQuestion(params as any);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

server.tool(
  "check_accommodation_compliance",
  "Review the lesson plan against all IEP accommodations and produce a compliance checklist. Flags accommodations as YES/PARTIAL/NEEDS PLAN with risk levels. Includes lesson-specific risk assessment (high-risk moments for the student), IEP goal alignment mapping, and specific recommendations for any gaps. Important because IEP accommodations are legally binding.",
  checkComplianceSchema.shape,
  async (params) => {
    const result = checkCompliance(params as any);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

server.tool(
  "generate_teacher_prep_summary",
  "Generate a one-page 'before class' summary with everything a teacher needs to prepare: student snapshot (reading level, behavioral pattern, what works), top 3 things to remember, materials checklist, minute-by-minute timeline with risk levels, early warning signs and intervention scripts, and IEP data collection reminders. Designed to be printed and taped to the lesson binder.",
  prepSummarySchema.shape,
  async (params) => {
    const result = generatePrepSummary(params as any);
    return {
      content: [{ type: "text", text: result }],
    };
  }
);

// ── Prompts ──────────────────────────────────────────────────────────

server.prompt(
  "differentiate-lesson",
  "Generate a complete lesson differentiation plan for a student with an IEP. Produces activity-by-activity modifications grounded in UDL principles, accommodation compliance mapping, scaffolded questions, and self-regulation checkpoints.",
  { focus: z.string().optional().describe("Optional: focus on a specific area (e.g., 'reading comprehension', 'writing', 'engagement', 'self-regulation')") },
  async (args) => ({
    messages: getPromptMessages("differentiate-lesson", args as Record<string, string>),
  })
);

server.prompt(
  "accommodation-checklist",
  "Quick compliance check: verify that every IEP accommodation is addressed in the lesson plan. Produces a YES/NO/NEEDS PLAN checklist with recommendations.",
  async () => ({
    messages: getPromptMessages("accommodation-checklist", {}),
  })
);

server.prompt(
  "scaffold-activity",
  "Generate scaffolded versions of specific lesson questions calibrated to the student's reading level. Produces sentence starters, graphic organizers, and fill-in-the-blank alternatives.",
  {
    activity: z.string().describe("Which activity to scaffold: 'during-reading', 'independent-practice', 'discussion', or a question ID (e.g., 'SA-1')"),
    level: z.string().optional().describe("Scaffolding intensity: 'light', 'moderate', or 'intensive'. Default: moderate"),
  },
  async (args) => ({
    messages: getPromptMessages("scaffold-activity", args as Record<string, string>),
  })
);

server.prompt(
  "behavior-support-plan",
  "Generate a proactive behavior support plan for this lesson based on the student's self-regulation goal. Identifies high-risk moments, prevention strategies, and de-escalation scripts.",
  async () => ({
    messages: getPromptMessages("behavior-support-plan", {}),
  })
);

server.prompt(
  "progress-monitoring",
  "Generate a progress monitoring checklist aligned to IEP goals. Maps lesson activities to benchmarks and creates a data collection sheet for the SE teacher.",
  async () => ({
    messages: getPromptMessages("progress-monitoring", {}),
  })
);

server.prompt(
  "teacher-prep",
  "Generate a printable one-page 'before class' prep summary. Includes student snapshot, top 3 reminders, materials checklist, minute-by-minute timeline with risk levels, early warning signs, and IEP data collection sheet.",
  async () => ({
    messages: getPromptMessages("teacher-prep", {}),
  })
);

// ── Start Server ─────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Waypoint MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
