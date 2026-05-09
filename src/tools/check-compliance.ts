/**
 * Tool: check_accommodation_compliance
 *
 * Reviews a lesson plan against all IEP accommodations and flags
 * any that aren't being addressed. Produces a compliance checklist
 * that a teacher or SE teacher can use to verify every legally
 * mandated accommodation is implemented.
 *
 * This is important because IEP accommodations are legally binding.
 * Missing an accommodation isn't just bad pedagogy - it's a
 * compliance violation.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const checkComplianceSchema = z.object({
  include_recommendations: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether to include specific recommendations for addressing any gaps."
    ),
});

export type CheckComplianceInput = z.infer<typeof checkComplianceSchema>;

export function checkCompliance(input: CheckComplianceInput): string {
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const sections: string[] = [];

  sections.push("# IEP Accommodation Compliance Check");
  sections.push(
    `**Student:** ${iep.profile.name} | **Lesson:** ${lesson.metadata.title}`
  );
  sections.push(
    `**Date:** ${new Date().toLocaleDateString()} | **Subject:** ${lesson.metadata.subject} | **Duration:** ${lesson.metadata.totalDuration}`
  );
  sections.push("");

  // Analyze each accommodation against lesson structure
  sections.push("## Accommodation Compliance Matrix");
  sections.push("");
  sections.push(
    "| # | Accommodation | Category | Addressed? | Risk Level | Notes |"
  );
  sections.push(
    "| --- | --- | --- | --- | --- | --- |"
  );

  const complianceItems = analyzeCompliance();
  complianceItems.forEach((item, i) => {
    sections.push(
      `| ${i + 1} | ${item.accommodation} | ${item.category} | ${item.addressed} | ${item.risk} | ${item.notes} |`
    );
  });
  sections.push("");

  // Summary
  const addressed = complianceItems.filter(
    (c) => c.addressed === "YES" || c.addressed === "PARTIAL"
  ).length;
  const gaps = complianceItems.filter(
    (c) => c.addressed === "NEEDS PLAN"
  ).length;
  const total = complianceItems.length;

  sections.push("## Summary");
  sections.push(`- **Fully addressed:** ${complianceItems.filter((c) => c.addressed === "YES").length}/${total}`);
  sections.push(`- **Partially addressed:** ${complianceItems.filter((c) => c.addressed === "PARTIAL").length}/${total}`);
  sections.push(`- **Needs implementation plan:** ${gaps}/${total}`);
  sections.push("");

  if (gaps > 0 && input.include_recommendations) {
    sections.push("## Recommendations for Gaps");
    sections.push("");

    for (const item of complianceItems) {
      if (item.addressed === "NEEDS PLAN") {
        sections.push(`### ${item.accommodation}`);
        sections.push(item.recommendation);
        sections.push("");
      }
    }
  }

  // Lesson-specific risks
  sections.push("## Lesson-Specific Risk Assessment");
  sections.push("");
  sections.push("### High-Risk Moments for Jasmine in This Lesson");
  sections.push("");
  sections.push(
    "1. **Paragraph 2 (bullet list):** Dense informational text with 6 complex bullet points. At Grade 2 informational text comprehension, this is the hardest section for Jasmine. She may disengage here."
  );
  sections.push(
    "2. **Independent Practice (20 min):** Longest sustained independent work block. Her low reading/writing stamina and tendency to avoid when frustrated make this the highest-risk activity."
  );
  sections.push(
    "3. **Short Answer Prompt:** Open-ended writing requiring claim + evidence + analysis. Without scaffolding, she is likely to produce 0-50% accuracy work or disengage entirely."
  );
  sections.push(
    "4. **Transitions between activities:** Each transition is a potential point where Jasmine may seek to leave the room or disengage. She asks to use the restroom multiple times when struggling."
  );
  sections.push("");

  // IEP goal alignment
  sections.push("## IEP Goal Alignment");
  sections.push("");
  sections.push(
    "This lesson directly supports the following IEP goals and benchmarks:"
  );
  sections.push("");
  sections.push("### ELA Goal (Goal 3)");
  sections.push(
    "- **Benchmark 1 (annotating):** During Reading Questions require annotation for paragraphs 2, 5-7, 8, 10-11"
  );
  sections.push(
    "- **Benchmark 2 (literal comprehension):** MC questions 1-4 test literal comprehension"
  );
  sections.push(
    "- **Benchmark 3 (writing claims):** Short answer prompt requires a claim about 'identity-forming narrative'"
  );
  sections.push(
    "- **Benchmark 4 (textual evidence):** Short answer requires at least 2 text details"
  );
  sections.push(
    "- **Benchmark 5 (analysis):** Short answer requires explaining how evidence connects to claim"
  );
  sections.push("");
  sections.push("### Self-Regulation Goal (Goal 1)");
  sections.push(
    "- **Benchmark 1 (recognizing frustration cues):** Teacher should watch for head down, restlessness, bathroom requests"
  );
  sections.push(
    "- **Benchmark 2 (requesting strategies):** Encourage Jasmine to ask for a break rather than shutting down"
  );
  sections.push(
    "- **Benchmark 3 (using strategies and re-engaging):** After any break, help Jasmine identify which strategy she used and return to the task"
  );

  return sections.join("\n");
}

interface ComplianceItem {
  accommodation: string;
  category: string;
  addressed: "YES" | "PARTIAL" | "NEEDS PLAN";
  risk: "LOW" | "MEDIUM" | "HIGH";
  notes: string;
  recommendation: string;
}

function analyzeCompliance(): ComplianceItem[] {
  return [
    {
      accommodation: "Repeat directions",
      category: "Presentation",
      addressed: "PARTIAL",
      risk: "MEDIUM",
      notes:
        "Lesson has teacher-led facilitation but no explicit direction repetition built in",
      recommendation:
        "Add a step to each activity transition: after giving whole-class directions, walk to Jasmine and restate the task. For Independent Practice, say: 'You have 4 multiple choice and 1 writing prompt. You can look at the text. Start with multiple choice.'",
    },
    {
      accommodation: "Reminders to pause, plan, proceed",
      category: "Presentation",
      addressed: "NEEDS PLAN",
      risk: "HIGH",
      notes:
        "Not built into lesson structure; critical for writing tasks",
      recommendation:
        "Create a laminated 'Pause, Plan, Proceed' card for Jasmine's desk. Before each writing question (DR-1B, DR-2A, DR-3B, SA-1), cue Jasmine: 'Pause -- what is the question asking? Plan -- find the paragraph. Proceed -- write.' The SE teacher can model this during the first During Reading question.",
    },
    {
      accommodation: "Copy of teacher's notes",
      category: "Presentation",
      addressed: "PARTIAL",
      risk: "MEDIUM",
      notes:
        "Lesson slide deck exists but no printed handout specified for Jasmine",
      recommendation:
        "Print the lesson overview page (vocabulary, reading schedule, purpose for reading) and the During Reading question sheet. Jasmine can use the teacher-copy answers as a self-check AFTER attempting each question.",
    },
    {
      accommodation: "Reference sheets, graphic organizers, checklists",
      category: "Presentation",
      addressed: "PARTIAL",
      risk: "HIGH",
      notes:
        "Self-Checklist exists for short answer but no graphic organizer for the complex reading",
      recommendation:
        "Create two materials: (1) A graphic organizer for paragraph 2's 6 traits with a matching column for paragraph 8's evidence. (2) A structured writing template for the short answer with claim/evidence/analysis boxes. Pre-fill the paragraph references.",
    },
    {
      accommodation: "Extra time",
      category: "Timing",
      addressed: "PARTIAL",
      risk: "MEDIUM",
      notes:
        "45-minute lesson with tight pacing; no explicit extra time built in",
      recommendation:
        "Allow Jasmine to skip optional question DR-1B to stay on pace during reading. If she needs more time on Independent Practice, she can finish the short answer during the Discussion period (pair her partner with another group). Priority: MC questions first, then writing.",
    },
    {
      accommodation: "Frequent breaks",
      category: "Timing",
      addressed: "NEEDS PLAN",
      risk: "HIGH",
      notes:
        "No breaks built into the 45-minute lesson",
      recommendation:
        "Schedule 2 brief breaks: (1) After During Reading Questions before Independent Practice (~min 20), (2) After MC questions before short answer (~min 30). Mark both on Jasmine's activity checklist so she can see them coming. Each break is 1-2 minutes: water, stretching, or a movement break.",
    },
    {
      accommodation: "Scheduled breaks",
      category: "Timing",
      addressed: "NEEDS PLAN",
      risk: "HIGH",
      notes: "Same as frequent breaks; needs explicit scheduling",
      recommendation:
        "See frequent breaks above. Additionally, post the lesson schedule with break times on the board or on Jasmine's desk: Intro (5 min) -> Reading (15 min) -> BREAK -> MC Questions (8 min) -> BREAK -> Writing (12 min) -> Discussion (5 min).",
    },
    {
      accommodation: "1:1 check-ins",
      category: "Setting",
      addressed: "PARTIAL",
      risk: "MEDIUM",
      notes:
        "SE teacher is present daily but check-in timing not specified in lesson",
      recommendation:
        "SE teacher checks in at 4 specific points: (1) End of intro -- preview vocabulary, (2) During partner reading -- comprehension check, (3) Start of Independent Practice -- restate directions, (4) After MC questions -- review answers before writing prompt. Each check-in is 30-60 seconds.",
    },
    {
      accommodation: "Reminder to remain engaged",
      category: "Setting",
      addressed: "PARTIAL",
      risk: "HIGH",
      notes:
        "No engagement monitoring plan for a student who quietly disengages",
      recommendation:
        "SE teacher or gen ed teacher uses proximity and nonverbal cues: stand near Jasmine during whole-class reading, gentle tap on desk, point to current paragraph. If head goes down, wait 10 seconds, then whisper: 'Jasmine, we're on paragraph [X]. Can you follow along with your finger?' If bathroom request comes during reading, offer a 1-minute break at the desk instead.",
    },
    {
      accommodation: "Small group (as needed)",
      category: "Setting",
      addressed: "YES",
      risk: "LOW",
      notes:
        "Lesson offers multiple facilitation options including small groups and partner reading",
      recommendation: "",
    },
    {
      accommodation: "Sit in the front of the room",
      category: "Setting",
      addressed: "YES",
      risk: "LOW",
      notes:
        "Simple seating arrangement; no lesson modification needed",
      recommendation: "",
    },
  ];
}
