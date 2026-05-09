/**
 * Tool: generate_sub_card
 *
 * Generates a substitute teacher emergency card for a student with an IEP.
 *
 * Real-world context: When a substitute teacher covers a class, they typically
 * receive NO information about students with IEPs. The regular teacher may
 * leave general sub plans, but IEP accommodations are legally mandated
 * regardless of who is teaching. A sub who doesn't know about Jasmine's
 * pattern of frustration-to-shutdown will misread her behavior as defiance
 * or laziness.
 *
 * This card is designed to be:
 * - Left in the substitute folder (every classroom has one)
 * - Read in under 2 minutes
 * - Actionable without any prior knowledge of the student
 * - Legally sufficient (covers all mandated accommodations)
 *
 * It deliberately excludes diagnostic details and focuses on WHAT TO DO,
 * not WHY — a sub doesn't need to understand the IEP to follow the card.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const subCardSchema = z.object({
  include_lesson_specifics: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether to include lesson-specific notes (activity timing, question scaffolds). Set to false for a general-purpose card that works across any lesson."
    ),
});

export type SubCardInput = z.infer<typeof subCardSchema>;

export function generateSubCard(rawInput: SubCardInput): string {
  const input = subCardSchema.parse(rawInput);
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const sections: string[] = [];

  sections.push("# Substitute Teacher Card: IEP Student");
  sections.push(
    `**Student:** ${iep.profile.name} | **Grade:** ${iep.profile.grade} | **School:** ${iep.profile.school}`
  );
  sections.push(
    `**SE Teacher:** ${iep.caseManager} (contact the main office if needed)`
  );
  sections.push(
    `**Placement:** ${iep.placementType}`
  );
  sections.push("");

  sections.push(
    "*This student has an Individualized Education Program (IEP). The accommodations below are legally required. Please follow them even if the regular teacher's sub plans don't mention them.*"
  );
  sections.push("");

  // Section 1: The one thing you need to know
  sections.push("## The One Thing to Know");
  sections.push(
    `${iep.profile.name} has a Health Impairment that affects attention, focus, stamina, and task initiation. When she gets frustrated with classwork, she **does not act out**. Instead, she quietly shuts down: head on desk, repeated bathroom requests, or staring at a blank page. **This is not defiance -- it's her disability.**`
  );
  sections.push("");

  // Section 2: Required accommodations (simplified for a sub)
  sections.push("## What She Needs (Required by Law)");
  sections.push("");

  sections.push("### Before the Lesson");
  sections.push(
    `- Seat her in the **front of the room**, near where you'll be standing`
  );
  sections.push(
    `- Give her any **printed handouts or notes** the regular teacher left for her (check the IEP folder on the desk)`
  );
  sections.push("");

  sections.push("### During the Lesson");
  sections.push(
    `- **Repeat directions** to her individually after giving them to the class`
  );
  sections.push(
    `- **Check in every 10 minutes**: Walk by her desk, glance at her work, give a quick nod or thumbs up`
  );
  sections.push(
    `- If she looks lost, remind her: "What's the question asking? Where in the text might you find the answer?"`
  );
  sections.push(
    `- She gets **scheduled breaks**: one after every 15-20 minutes of work (1-2 minutes, at her desk or water fountain)`
  );
  sections.push("");

  sections.push("### If She Shuts Down");
  sections.push(
    "If you see her head go down, she stops writing, or she asks to go to the bathroom more than once:"
  );
  sections.push("");
  sections.push("1. **Don't call her out in front of the class.** Walk to her desk quietly.");
  sections.push(
    '2. **Offer a break**: "Take a minute. Get some water. I\'ll check back with you."'
  );
  sections.push(
    '3. **Lower the bar**: "Just try the first question. You can skip the rest for now."'
  );
  sections.push(
    "4. **If she stays shut down for more than 5 minutes**, send her to the main office to check in with guidance. This is part of her support plan."
  );
  sections.push("");
  sections.push(
    "**Do NOT:** Take away recess/privileges, send her to the hall alone, or tell her to \"just try harder.\" These will make it worse."
  );
  sections.push("");

  // Section 3: What works
  sections.push("## What Works With Her");
  sections.push(
    `- **Specific praise**: "I noticed you went back to the text to find your answer. That's exactly what you should do." (not "good job")`
  );
  sections.push(
    `- **Peer pairing**: She works better with a partner than alone. Pair her with a patient classmate.`
  );
  sections.push(
    `- **Choice**: "Would you rather work on this here, or move to the back table?" Giving her control helps.`
  );
  sections.push(
    `- **Sentence starters**: If she's staring at a blank page for writing, give her the first few words: "The author is saying that..."`
  );
  sections.push("");

  // Section 4: Lesson-specific notes (optional)
  if (input.include_lesson_specifics) {
    sections.push("## Today's Lesson Notes");
    sections.push(
      `**Lesson:** ${lesson.metadata.title}`
    );
    sections.push(
      `**Duration:** ${lesson.metadata.totalDuration} | **Subject:** ELA | **Standard:** ${lesson.metadata.standards.join(", ")}`
    );
    sections.push("");
    sections.push("### Quick Lesson Flow");
    sections.push("| Time | What's Happening | Watch For |");
    sections.push("| --- | --- | --- |");
    sections.push(
      "| 0-5 min | Intro: vocabulary and reading purpose | She should have a vocab reference sheet |"
    );
    sections.push(
      "| 5-20 min | Reading article together + with partner | Pair her with someone patient |"
    );
    sections.push(
      "| 20-28 min | Multiple choice questions (independent) | Check in at minute 25. She can use the text. |"
    );
    sections.push(
      "| 28-30 min | **BREAK** | Let her get water or stretch |"
    );
    sections.push(
      "| 30-40 min | Writing prompt (independent) | **HIGHEST RISK.** If she hasn't started by minute 35, offer to let her finish tomorrow. |"
    );
    sections.push(
      "| 40-45 min | Discussion with partner | She usually does well here. Pair with a friend. |"
    );
    sections.push("");

    sections.push("### Materials in Her Folder");
    sections.push(
      "The regular teacher should have left these in the IEP materials folder:"
    );
    sections.push("- Graphic organizer (two-column table about community traits)");
    sections.push("- Writing scaffold (step-by-step guide for the short answer)");
    sections.push("- Schedule card (lesson timeline with breaks marked)");
    sections.push("- Vocabulary reference sheet");
    sections.push("");
  }

  // Section 5: Quick reference
  sections.push("## Quick Reference");
  sections.push("");
  sections.push("| | |");
  sections.push("| --- | --- |");
  sections.push(`| **Student** | ${iep.profile.name} |`);
  sections.push(`| **Disability** | Health Impairment |`);
  sections.push(`| **SE Teacher** | ${iep.caseManager} |`);
  sections.push(`| **Key pattern** | Frustration -> quiet shutdown (not defiance) |`);
  sections.push(`| **#1 strategy** | Specific praise + scheduled breaks |`);
  sections.push(`| **If stuck** | Lower the bar, offer choice, don't pressure |`);
  sections.push(`| **Emergency** | Send to guidance (main office) |`);

  sections.push("");
  sections.push(
    "*Thank you for supporting this student. If you have questions, the main office can reach her SE teacher.*"
  );

  return sections.join("\n");
}
