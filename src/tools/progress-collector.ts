/**
 * Tool: generate_progress_data_sheet
 *
 * Generates a structured data collection form aligned to IEP goals and
 * benchmarks for this specific lesson. The SE teacher fills this out
 * during or immediately after the lesson.
 *
 * Real-world context: IEP teams review progress quarterly. The SE teacher
 * needs to collect specific, measurable data during every lesson to report
 * on whether goals are being met. Without a structured form, data collection
 * is inconsistent and progress reports become vague.
 *
 * This tool maps lesson activities to IEP benchmarks so the teacher knows
 * exactly what to observe, when to observe it, and how to record it.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

function getMCAnswer(id: string): string {
  const q = communityLesson.questions.find((q) => q.id === id);
  return q?.sampleAnswer || "?";
}

export const progressCollectorSchema = z.object({
  goals: z
    .array(z.enum(["self-regulation", "math", "ela", "all"]))
    .optional()
    .default(["all"])
    .describe(
      "Which IEP goals to generate data collection for. Default: all applicable goals."
    ),
});

export type ProgressCollectorInput = z.infer<typeof progressCollectorSchema>;

export function generateProgressDataSheet(
  rawInput: ProgressCollectorInput
): string {
  const input = progressCollectorSchema.parse(rawInput);
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const includeAll = input.goals.includes("all");

  const sections: string[] = [];

  sections.push("# IEP Progress Data Collection Sheet");
  sections.push(
    `**Student:** ${iep.profile.name} | **Lesson:** ${lesson.metadata.title}`
  );
  sections.push(
    `**Date:** __________ | **Observer:** __________ | **Period:** __________`
  );
  sections.push(
    `**Subject:** ${lesson.metadata.subject} | **Duration:** ${lesson.metadata.totalDuration}`
  );
  sections.push("");

  // ELA Goal
  if (includeAll || input.goals.includes("ela")) {
    const elaGoal = iep.goals.find((g) => g.area === "ELA");
    if (elaGoal) {
      sections.push("## Goal 3: ELA");
      sections.push(`**Annual Target:** ${elaGoal.annualTarget}`);
      sections.push(`**Baseline:** ${elaGoal.criteria}`);
      sections.push(`**Measurement:** ${elaGoal.method}`);
      sections.push("");

      sections.push("### Benchmark Data Collection");
      sections.push("");

      // Benchmark 1: Annotating
      sections.push("#### Benchmark 1: Accurately annotate text");
      sections.push(
        "**Observe during:** During Reading (min 5-20)"
      );
      sections.push(
        "**What to look for:** Does Jasmine annotate the text for the prompt focus (supporting details, key ideas)?"
      );
      sections.push("");
      sections.push("| Question | Did Jasmine Annotate? | Accuracy | Notes |");
      sections.push("| --- | --- | --- | --- |");
      sections.push("| DR-1A (main idea, P1) | Y / N | Correct / Partial / Incorrect | |");
      sections.push("| DR-1C (definition, P2) | Y / N | Correct / Partial / Incorrect | |");
      sections.push("| DR-2A (testing definition, P5-7) | Y / N | Correct / Partial / Incorrect | |");
      sections.push("| DR-3A (Newcastle narrative, P8) | Y / N | Correct / Partial / Incorrect | |");
      sections.push("| DR-4 (importance, P10-11) | Y / N | Correct / Partial / Incorrect | |");
      sections.push("");
      sections.push("**Annotation Score:** _____ / 5 correct annotations");
      sections.push("");

      // Benchmark 2: Literal comprehension
      sections.push("#### Benchmark 2: Answer literal comprehension questions");
      sections.push("**Observe during:** Independent Practice (min 20-28)");
      sections.push(
        "**What to look for:** Can Jasmine independently answer MC questions about main idea, key details?"
      );
      sections.push("");
      sections.push("| Question | Jasmine's Answer | Correct Answer | Correct? |");
      sections.push("| --- | --- | --- | --- |");
      sections.push(`| MC-1 | _____ | ${getMCAnswer("MC-1")} | Y / N |`);
      sections.push(`| MC-2 | _____ | ${getMCAnswer("MC-2")} | Y / N |`);
      sections.push(`| MC-3 | _____ | ${getMCAnswer("MC-3")} | Y / N |`);
      sections.push(`| MC-4 | _____ | ${getMCAnswer("MC-4")} | Y / N |`);
      sections.push("");
      sections.push("**MC Score:** _____ / 4 = _____% ");
      sections.push(
        "**Support used:** None / Reference sheet / Teacher read aloud / Small group"
      );
      sections.push("");

      // Benchmark 3: Write a claim
      sections.push("#### Benchmark 3: Write a claim answering the question");
      sections.push("**Observe during:** Independent Practice (min 28-40)");
      sections.push("**What to look for:** SA-1 response");
      sections.push("");
      sections.push("| Criteria | Rating | Evidence |");
      sections.push("| --- | --- | --- |");
      sections.push(
        '| Claim answers the question | 0 (none) / 1 (partial) / 2 (complete) | Quote Jasmine\'s claim: "_____" |'
      );
      sections.push(
        "| Claim addresses all parts | 0 / 1 / 2 | Does it mention both \"identity-forming\" AND \"narrative\"? Y / N |"
      );
      sections.push("");

      // Benchmark 4: Find textual evidence
      sections.push(
        "#### Benchmark 4: Find effective pieces of textual evidence"
      );
      sections.push("");
      sections.push("| Evidence Piece | Source Paragraph | Relevant to Claim? |");
      sections.push("| --- | --- | --- |");
      sections.push("| 1. _____ | P_____ | Y / N |");
      sections.push("| 2. _____ | P_____ | Y / N |");
      sections.push("| 3. _____ | P_____ | Y / N (if provided) |");
      sections.push("");
      sections.push("**Evidence Score:** _____ / 3 effective pieces");
      sections.push("");

      // Benchmark 5: Write analysis
      sections.push("#### Benchmark 5: Write analysis connecting evidence to claim");
      sections.push("");
      sections.push("| Criteria | Rating |");
      sections.push("| --- | --- |");
      sections.push(
        "| Explains HOW evidence relates to claim | 0 (none) / 1 (attempted) / 2 (clear connection) |"
      );
      sections.push(
        "| Uses reasoning, not just restating | 0 (restates) / 1 (some reasoning) / 2 (strong reasoning) |"
      );
      sections.push("");
      sections.push(
        "**Overall SA-1 Score:** _____ / 10 = _____% (claim: /4 + evidence: /3 + analysis: /3)"
      );
      sections.push("");
      sections.push("---");
      sections.push("");
    }
  }

  // Self-Regulation Goal
  if (includeAll || input.goals.includes("self-regulation")) {
    const selfRegGoal = iep.goals.find(
      (g) => g.area === "Counseling / Self-Regulation"
    );
    if (selfRegGoal) {
      sections.push("## Goal 1: Self-Regulation");
      sections.push(`**Annual Target:** ${selfRegGoal.annualTarget}`);
      sections.push(`**Baseline:** ${selfRegGoal.criteria}`);
      sections.push("");

      sections.push("### Frustration/Dysregulation Events Log");
      sections.push(
        "*Record each time Jasmine shows signs of frustration or dysregulation during the lesson.*"
      );
      sections.push("");
      sections.push(
        "| # | Time | Trigger (what was happening) | Warning Sign | Strategy Used | Re-engaged? | Time to Re-engage |"
      );
      sections.push("| --- | --- | --- | --- | --- | --- | --- |");
      sections.push("| 1 | _____ | _____ | Head down / Bathroom / Fidgeting / Other: _____ | Breathing / Movement / Fidget / Sensory / Grounding / None | Y / N | _____ min |");
      sections.push("| 2 | _____ | _____ | Head down / Bathroom / Fidgeting / Other: _____ | Breathing / Movement / Fidget / Sensory / Grounding / None | Y / N | _____ min |");
      sections.push("| 3 | _____ | _____ | Head down / Bathroom / Fidgeting / Other: _____ | Breathing / Movement / Fidget / Sensory / Grounding / None | Y / N | _____ min |");
      sections.push("| 4 | _____ | _____ | Head down / Bathroom / Fidgeting / Other: _____ | Breathing / Movement / Fidget / Sensory / Grounding / None | Y / N | _____ min |");
      sections.push("");

      sections.push("### Benchmark Tracking");
      sections.push("");

      // Benchmark 1: Recognize physical cues
      sections.push(
        "#### Benchmark 1: Recognize and describe physical cues of frustration"
      );
      sections.push(
        "Did Jasmine identify her own frustration cues (tense body, faster breathing, restlessness, lowered head)?"
      );
      sections.push("");
      sections.push("- [ ] Independently recognized cues");
      sections.push("- [ ] Recognized with adult prompt");
      sections.push("- [ ] Did not recognize / shut down without awareness");
      sections.push("");
      sections.push("**Opportunities observed:** _____ | **Successful:** _____");
      sections.push("**Rate:** _____ / _____ = _____% (target: 80%)");
      sections.push("");

      // Benchmark 2: Request/initiate calming strategy
      sections.push(
        "#### Benchmark 2: Independently request or initiate a calming strategy"
      );
      sections.push("");
      sections.push("- [ ] Independently requested a break or strategy");
      sections.push("- [ ] Used a strategy after adult prompt");
      sections.push("- [ ] Did not use a strategy");
      sections.push("");
      sections.push("**Strategy used (circle):** Deep breathing / Movement break / Fidget tool / Sensory tool / Grounding exercise / Other: _____");
      sections.push("");
      sections.push("**Opportunities observed:** _____ | **Successful:** _____");
      sections.push("**Rate:** _____ / _____ = _____% (target: 80%)");
      sections.push("");

      // Benchmark 3: Use strategy and return to task
      sections.push(
        "#### Benchmark 3: Use strategy, return to classroom, engage in task, reflect"
      );
      sections.push("");
      sections.push("- [ ] Used strategy AND returned to task");
      sections.push("- [ ] Used strategy but did not fully re-engage");
      sections.push("- [ ] Did not use strategy / remained disengaged");
      sections.push("");
      sections.push(
        "**Could Jasmine reflect on whether her strategy worked?** Y / N"
      );
      sections.push(
        '**If yes, what did she say?** "_____"'
      );
      sections.push("");
      sections.push("**Opportunities observed:** _____ | **Successful:** _____");
      sections.push("**Rate:** _____ / _____ = _____% (target: 80%)");
      sections.push("");
      sections.push("---");
      sections.push("");
    }
  }

  // General lesson metrics
  sections.push("## Lesson-Level Metrics");
  sections.push("");
  sections.push("| Metric | Value |");
  sections.push("| --- | --- |");
  sections.push("| Total time in classroom | _____ / 45 min |");
  sections.push("| Times left classroom | _____ |");
  sections.push("| Breaks taken (scheduled) | _____ / 2 |");
  sections.push("| Breaks taken (unscheduled) | _____ |");
  sections.push(
    "| Accommodations implemented | _____ / 11 |"
  );
  sections.push(
    "| Small group used? | Y / N (during: _____) |"
  );
  sections.push(
    "| Work completion | MC: ___/4 | SA: started / partial / complete |"
  );
  sections.push("");

  sections.push("## Observer Notes");
  sections.push("");
  sections.push(
    "What worked well today?"
  );
  sections.push("");
  sections.push("_____________________________________________");
  sections.push("");
  sections.push("What should be adjusted for next lesson?");
  sections.push("");
  sections.push("_____________________________________________");
  sections.push("");
  sections.push(
    "Should any accommodations be modified at the next IEP review? Which ones and why?"
  );
  sections.push("");
  sections.push("_____________________________________________");

  return sections.join("\n");
}
