/**
 * Tool: generate_lesson_modifications
 *
 * The primary tool. Generates specific, actionable instructional modifications
 * for a lesson activity grounded in both the curriculum content and the
 * student's IEP.
 *
 * Modifications are organized using the Universal Design for Learning (UDL)
 * framework's three principles:
 * - Engagement: How to recruit and sustain the student's interest
 * - Representation: How to present information in accessible ways
 * - Action & Expression: How the student demonstrates understanding
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const generateModificationsSchema = z.object({
  activity_name: z
    .enum([
      "intro",
      "during-reading",
      "independent-practice",
      "discussion",
      "full-lesson",
    ])
    .describe(
      "Which lesson activity to generate modifications for. Use 'full-lesson' for comprehensive modifications across all activities."
    ),
  focus_areas: z
    .array(
      z.enum([
        "engagement",
        "representation",
        "action-expression",
        "accommodations",
        "self-regulation",
      ])
    )
    .optional()
    .describe(
      "Optional: specific UDL principles or IEP areas to focus on. If omitted, all areas are addressed."
    ),
});

export type GenerateModificationsInput = z.infer<
  typeof generateModificationsSchema
>;

export function generateModifications(
  input: GenerateModificationsInput
): string {
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const activityMap: Record<string, typeof lesson.activities[number] | null> = {
    intro: lesson.activities[0],
    "during-reading": lesson.activities[1],
    "independent-practice": lesson.activities[2],
    discussion: lesson.activities[3],
    "full-lesson": null,
  };

  const activity = activityMap[input.activity_name];
  const focusAreas = input.focus_areas || [
    "engagement",
    "representation",
    "action-expression",
    "accommodations",
    "self-regulation",
  ];

  // Build the context prompt for Claude to reason about
  const sections: string[] = [];

  // Header
  sections.push("# Lesson Modification Request\n");

  // Student context (always included - this is the minimum needed)
  sections.push("## Student Profile");
  sections.push(`**Name:** ${iep.profile.name}`);
  sections.push(`**Grade:** ${iep.profile.grade}`);
  sections.push(`**Disability:** ${iep.profile.disability}`);
  sections.push(
    `**Reading Level:** 3rd grade (iReady) | **Informational Text:** Grade 2`
  );
  sections.push(`**ELA Grade:** 1.8/3.0 (3 = mastery)`);
  sections.push("");

  sections.push("### Key Strengths");
  iep.profile.strengths.slice(0, 5).forEach((s) => sections.push(`- ${s}`));
  sections.push("");

  sections.push("### Key Challenges");
  iep.profile.challenges.slice(0, 5).forEach((c) => sections.push(`- ${c}`));
  sections.push("");

  sections.push("### What Motivates Jasmine");
  iep.profile.motivators.forEach((m) => sections.push(`- ${m}`));
  sections.push("");

  // Relevant IEP goals
  sections.push("## Relevant IEP Goals");
  const elaGoal = iep.goals.find((g) => g.area === "ELA");
  if (elaGoal) {
    sections.push(`### ELA Goal`);
    sections.push(`**Target:** ${elaGoal.annualTarget}`);
    sections.push(`**Baseline:** ${elaGoal.baseline.slice(0, 200)}...`);
    sections.push("**Benchmarks:**");
    elaGoal.benchmarks.forEach((b) => sections.push(`- ${b.description}`));
    sections.push("");
  }

  const selfRegGoal = iep.goals.find((g) =>
    g.area.includes("Self-Regulation")
  );
  if (selfRegGoal) {
    sections.push(`### Self-Regulation Goal`);
    sections.push(`**Target:** ${selfRegGoal.annualTarget}`);
    sections.push("");
  }

  // Accommodations (always relevant)
  sections.push("## Required Accommodations (Legally Mandated)");
  iep.accommodations.forEach((a) =>
    sections.push(`- [${a.category}] ${a.description}`)
  );
  sections.push("");

  sections.push("## Modifications");
  iep.modifications.forEach((m) =>
    sections.push(`- [${m.category}] ${m.description}`)
  );
  sections.push("");

  // Lesson context
  sections.push("## Lesson Context");
  sections.push(`**Title:** ${lesson.metadata.title}`);
  sections.push(`**Unit:** ${lesson.metadata.unit}`);
  sections.push(`**Standard:** ${lesson.metadata.standards.join(", ")}`);
  sections.push(
    `**Skill Focus:** ${lesson.metadata.skillFocus}`
  );
  sections.push(`**Total Duration:** ${lesson.metadata.totalDuration}`);
  sections.push("");

  // Specific activity context
  if (activity) {
    sections.push(`## Target Activity: ${activity.name}`);
    sections.push(`**Duration:** ${activity.duration}`);
    sections.push(`**Reading Modality:** ${activity.readingModality}`);
    sections.push(`**Description:** ${activity.description}`);
    sections.push(`**Content:** ${activity.content}`);
    sections.push("");

    // Include relevant questions for this activity
    const relevantQuestions = getQuestionsForActivity(input.activity_name);
    if (relevantQuestions.length > 0) {
      sections.push("### Questions in This Activity");
      relevantQuestions.forEach((q) => {
        sections.push(`- **[${q.id}] ${q.format}:** ${q.questionText}`);
        if (q.sampleAnswer) {
          sections.push(`  *Expected answer:* ${q.sampleAnswer}`);
        }
      });
      sections.push("");
    }
  } else {
    // Full lesson mode
    sections.push("## All Activities");
    lesson.activities.forEach((a) => {
      sections.push(`### ${a.name} (${a.duration}, ${a.readingModality})`);
      sections.push(a.description);
      sections.push(`Content: ${a.content}`);
      sections.push("");
    });
  }

  // Focus areas
  sections.push("## Requested Focus Areas");
  focusAreas.forEach((f) => {
    const labels: Record<string, string> = {
      engagement:
        "**Engagement (UDL Principle 1):** How to recruit and sustain Jasmine's interest, especially when she encounters frustration with grade-level text",
      representation:
        "**Representation (UDL Principle 2):** How to present the content accessibly given her 3rd-grade reading level and Grade 2 informational text comprehension",
      "action-expression":
        "**Action & Expression (UDL Principle 3):** Alternative ways for Jasmine to demonstrate understanding beyond open-ended writing",
      accommodations:
        "**Accommodation Compliance:** Specific implementation of each legally mandated accommodation during this activity",
      "self-regulation":
        "**Self-Regulation Support:** Proactive strategies to prevent shutdown/avoidance and support Jasmine's self-regulation IEP goal",
    };
    sections.push(`- ${labels[f]}`);
  });
  sections.push("");

  // Instructions for Claude
  sections.push("## Instructions for Generating Modifications");
  sections.push(
    "Generate SPECIFIC, ACTIONABLE modifications that a teacher can use without further editing."
  );
  sections.push(
    "Every modification must be grounded in BOTH the lesson content AND the IEP."
  );
  sections.push("Be specific about:");
  sections.push(
    "- Which paragraph/question/activity moment the modification applies to"
  );
  sections.push("- Exact wording of scaffolds, sentence starters, or prompts");
  sections.push("- How to implement each accommodation during this activity");
  sections.push(
    "- Proactive self-regulation check-in points (not just reactive)"
  );
  sections.push("");
  sections.push("AVOID generic advice like 'provide visual supports' or 'use graphic organizers.'");
  sections.push(
    "Instead, describe THE SPECIFIC graphic organizer with its content pre-filled from this lesson."
  );

  return sections.join("\n");
}

function getQuestionsForActivity(activityName: string) {
  const lesson = communityLesson;

  switch (activityName) {
    case "during-reading":
      return lesson.questions.filter((q) => q.type === "during-reading");
    case "independent-practice":
      return lesson.questions.filter(
        (q) => q.type === "multiple-choice" || q.type === "short-answer"
      );
    case "discussion":
      return lesson.questions.filter((q) => q.type === "discussion");
    default:
      return [];
  }
}
