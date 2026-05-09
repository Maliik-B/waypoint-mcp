/**
 * Tool: generate_teacher_prep_summary
 *
 * Generates a one-page "before class" summary for the teacher (or SE teacher)
 * covering everything they need to prepare for a student with an IEP.
 *
 * This is the tool a teacher uses 10 minutes before class. It answers:
 * - What materials do I need to print/prepare?
 * - Where should the student sit?
 * - What are the 3 most important things to remember?
 * - When are the critical moments in this lesson?
 * - What should I watch for?
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const prepSummarySchema = z.object({
  include_materials_list: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to include a printable materials preparation checklist."),
});

export type PrepSummaryInput = z.infer<typeof prepSummarySchema>;

export function generatePrepSummary(rawInput: PrepSummaryInput): string {
  const input = prepSummarySchema.parse(rawInput);
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const sections: string[] = [];

  sections.push("# Teacher Prep Summary: One Page Before Class");
  sections.push(
    `**Student:** ${iep.profile.name} | **Lesson:** ${lesson.metadata.title}`
  );
  sections.push(
    `**Date:** __________ | **Period:** __________ | **SE Teacher:** Marisol Gutierrez-Stone`
  );
  sections.push("");

  // Quick student snapshot
  sections.push("## Jasmine at a Glance");
  sections.push(
    "| What | Detail | Source |"
  );
  sections.push("| --- | --- | --- |");
  sections.push(
    "| Disability | Health Impairment (attention, focus, stamina, task initiation) | IEP Student Profile |"
  );
  sections.push(
    "| Reading Level | Grade 3 (this text is Grade 7) | iReady Fall 2025 |"
  );
  sections.push(
    "| Informational Text | Grade 2 comprehension | iReady Fall 2025 |"
  );
  sections.push(
    "| Writing | 50% accuracy independent; grade-level with 1:1 support | IEP Present Levels, ELA |"
  );
  sections.push(
    "| Behavioral Pattern | Frustration -> head down / bathroom requests -> shutdown | IEP Present Levels, Behavioral |"
  );
  sections.push(
    "| What Works | Positive praise, 1:1 check-ins, graphic organizers, peer interaction | IEP Profile + Accommodations |"
  );
  sections.push("");

  // Top 3 things to remember
  sections.push("## 3 Things to Remember Today");
  sections.push(
    "1. **Jasmine reads at Grade 3; this is a Grade 7 informational text.** She will need scaffolded access to the content, especially paragraphs 2 and 8 (dense bullet lists). Provide the graphic organizer."
  );
  sections.push(
    "2. **Independent Practice (min 20-40) is the highest-risk moment.** She's most likely to shut down here. Check in at minute 22, offer a break at minute 30, and have the small-group option ready."
  );
  sections.push(
    '3. **Praise specificity, not completion.** Instead of "good job," say "Jasmine, I noticed you went back to paragraph 5 to find evidence. That\'s exactly what strong readers do." This matches her motivator profile.'
  );
  sections.push("");

  // Materials checklist
  if (input.include_materials_list) {
    sections.push("## Materials to Prepare Before Class");
    sections.push("- [ ] **Graphic organizer** for paragraph 2/8: Two-column table (Trait of Community | How Lowe Tests It). Pre-fill left column with 6 traits.");
    sections.push(
      "- [ ] **Short answer writing scaffold**: Claim/Evidence/Analysis template with paragraph references (3-4, 4 or 9, 5-7) and sentence starters"
    );
    sections.push(
      "- [ ] **Lesson schedule card**: Intro (5 min) -> Reading (15 min) -> BREAK -> MC (8 min) -> BREAK -> Writing (12 min) -> Discussion (5 min). Mark break times visibly."
    );
    sections.push(
      '- [ ] **Pause-Plan-Proceed card**: Laminated card at Jasmine\'s desk'
    );
    sections.push(
      "- [ ] **Teacher notes copy**: Printed lesson overview with vocabulary, reading schedule, and purpose for reading"
    );
    sections.push(
      "- [ ] **Seating**: Confirm Jasmine is in the front row, near SE teacher circulation path"
    );
    sections.push("");
  }

  // Minute-by-minute quick reference
  sections.push("## Lesson Timeline with Check-In Points");
  sections.push("");
  sections.push("| Time | Activity | Risk | Action for Jasmine |");
  sections.push("| --- | --- | --- | --- |");
  sections.push(
    '| 0-5 | Intro Slide Deck | LOW | Preview vocabulary 1:1. "Which words do you already know?" |'
  );
  sections.push(
    '| 5-10 | Whole-Class Reading (P1-2) | MEDIUM | Stand near desk. After Q DR-1A, whisper: "You\'re doing great following along." |'
  );
  sections.push(
    '| 10-15 | Partner Reading (P3-7) | MEDIUM | Pair with supportive peer. Give task: "Circle what Lowe DOES as part of Newcastle." |'
  );
  sections.push(
    '| 15-20 | Whole-Class Reading (P8) | MEDIUM | Hand out graphic organizer. She fills right column while class reads. Offer 1-min break after. |'
  );
  sections.push(
    "| 20 | TRANSITION | **HIGH** | 1:1 check-in: Restate directions. Provide modified question sheet. |"
  );
  sections.push(
    "| 20-28 | MC Questions | MEDIUM | Check in after 5 min. If struggling, read questions aloud 1:1. |"
  );
  sections.push(
    '| 28-30 | BREAK | -- | "Take 2 min. Get water or stretch. When you come back: just the writing prompt." |'
  );
  sections.push(
    "| 30-40 | Short Answer | **HIGH** | Offer writing scaffold. If shutdown begins, pull to small group with SE teacher. |"
  );
  sections.push(
    '| 40-45 | Discussion | LOW | Pair with comfortable peer. Preview Q1: "Think about Riverstone Prep." |'
  );
  sections.push("");

  // What to watch for (behavioral cues)
  sections.push("## Early Warning Signs (Intervene Before Shutdown)");
  sections.push(
    "| Sign | What It Means | What to Do |"
  );
  sections.push("| --- | --- | --- |");
  sections.push(
    '| Head goes down on desk | Frustration threshold reached | Wait 10 sec, then whisper: "Jasmine, we\'re on paragraph [X]. Can you follow along with your finger?" |'
  );
  sections.push(
    '| Asks to go to bathroom | Avoidance behavior | Offer desk break instead: "Take a minute right here. Stretch, breathe. I\'ll check back in 60 seconds." |'
  );
  sections.push(
    '| Staring at blank page (writing) | Task initiation difficulty | Provide sentence starter: "Start with: When Lowe says... he means..." |'
  );
  sections.push(
    '| Restlessness / fidgeting | Building frustration | Offer movement break or fidget tool. Acknowledge: "This part is hard. Let\'s take it one question at a time." |'
  );
  sections.push("");

  // Data collection reminder
  sections.push("## IEP Data to Collect Today");
  sections.push(
    "Record these for Jasmine's quarterly progress report:"
  );
  sections.push(
    "- [ ] **ELA Goal**: Did she accurately annotate the text? (Benchmark 1) Score: ___/5 questions"
  );
  sections.push(
    "- [ ] **ELA Goal**: Short answer accuracy? (Benchmarks 3-5) Score: ___% on rubric"
  );
  sections.push(
    "- [ ] **Self-Reg Goal**: Did she use a calming strategy when frustrated? (Benchmark 2) Count: ___/opportunities"
  );
  sections.push(
    "- [ ] **Self-Reg Goal**: Did she re-engage after using a strategy? (Benchmark 3) Y / N"
  );
  sections.push(
    "- [ ] **Time in classroom**: ___/45 minutes (track if she leaves)"
  );

  return sections.join("\n");
}
