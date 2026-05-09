/**
 * Tool: generate_take_home
 *
 * Generates a modified take-home version of unfinished classwork.
 * When a student with an IEP doesn't complete work in class (common
 * with low stamina, task initiation issues, or shutdown), the teacher
 * needs a take-home version that:
 *
 * - Reduces scope to what's achievable without SE teacher support
 * - Includes relevant text excerpts (student may not have the article at home)
 * - Provides parent-friendly context so caregivers can help appropriately
 * - Uses lighter scaffolding that doesn't require adult prompting
 * - Removes time pressure framing
 *
 * This is NOT homework -- it's completion of classwork with modified
 * expectations for the independent setting.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const takeHomeSchema = z.object({
  unfinished_items: z
    .array(z.string())
    .describe(
      "Question IDs that were not completed in class (e.g., ['SA-1', 'MC-4']). The take-home form will include modified versions of these."
    ),
  include_parent_note: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether to include a parent/guardian context note explaining the assignment and how to help."
    ),
  reduced_scope: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether to reduce the scope of open-ended questions for independent completion (e.g., claim + 1 evidence instead of full response)."
    ),
});

export type TakeHomeInput = z.infer<typeof takeHomeSchema>;

export function generateTakeHome(rawInput: TakeHomeInput): string {
  const input = takeHomeSchema.parse(rawInput);
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const sections: string[] = [];

  sections.push("# Take-Home: Finish Your Work");
  sections.push(`**Name:** ${iep.profile.name}`);
  sections.push(
    `**Lesson:** ${lesson.metadata.title}`
  );
  sections.push(`**Date:** __________ | **Due:** __________`);
  sections.push("");

  // Parent note
  if (input.include_parent_note) {
    sections.push("---");
    sections.push("");
    sections.push("**Note for Parent/Guardian:**");
    sections.push("");
    sections.push(
      `${iep.profile.name} is working on a reading comprehension lesson about what makes a community. Today in class, she read the article and answered some questions but didn't finish everything. This take-home packet includes:`
    );
    sections.push("");
    sections.push(
      "- The parts of the article she needs to reference (so she doesn't need the full text)"
    );
    sections.push("- The questions she still needs to complete");
    sections.push(
      "- Sentence starters and hints to help her get started"
    );
    sections.push("");
    sections.push("**How you can help:**");
    sections.push(
      "- Read the text excerpts aloud if she asks (she benefits from hearing text read aloud)"
    );
    sections.push(
      "- Encourage her to use the sentence starters rather than staring at a blank page"
    );
    sections.push(
      "- If she gets frustrated, it's okay to take a break and come back to it"
    );
    sections.push(
      "- She does NOT need to write perfect paragraphs -- getting her ideas down is the goal"
    );
    sections.push("");
    sections.push(
      `*${iep.profile.name}'s teacher can be reached at school for any questions.*`
    );
    sections.push("");
    sections.push("---");
    sections.push("");
  }

  // For each unfinished item, generate a take-home version
  for (const itemId of input.unfinished_items) {
    const question = lesson.questions.find((q) => q.id === itemId);
    if (!question) continue;

    switch (question.type) {
      case "short-answer":
        sections.push(...buildTakeHomeShortAnswer(question, input.reduced_scope));
        break;
      case "multiple-choice":
        sections.push(...buildTakeHomeMC(question));
        break;
      case "during-reading":
        sections.push(
          ...buildTakeHomeDuringReading(question, input.reduced_scope)
        );
        break;
      case "discussion":
        sections.push(...buildTakeHomeDiscussion(question));
        break;
    }
  }

  // Encouragement footer
  sections.push("---");
  sections.push("");
  sections.push("**You did good work in class today.** Finishing this at home shows that you can stick with hard work even when it takes extra time. That's a strength.");

  return sections.join("\n");
}

function getRelevantExcerpts(paragraphs: string): string[] {
  const lesson = communityLesson;
  const excerpts: string[] = [];

  // Parse paragraph ranges like "3-4", "5-7", "10-11"
  const ranges = paragraphs.match(/\d+(-\d+)?/g) || [];
  const paraNums = new Set<number>();
  for (const range of ranges) {
    if (range.includes("-")) {
      const [start, end] = range.split("-").map(Number);
      for (let i = start; i <= end; i++) paraNums.add(i);
    } else {
      paraNums.add(Number(range));
    }
  }

  // Extract paragraphs from text content
  const textLines = lesson.textContent.split("\n");
  for (const num of Array.from(paraNums).sort((a, b) => a - b)) {
    const marker = `[${num}]`;
    const paraLine = textLines.find((l) => l.includes(marker));
    if (paraLine) {
      // Truncate very long paragraphs for take-home readability
      const trimmed =
        paraLine.length > 500
          ? paraLine.slice(0, 500) + "..."
          : paraLine;
      excerpts.push(trimmed);
    }
  }

  return excerpts;
}

function buildTakeHomeShortAnswer(
  question: (typeof communityLesson.questions)[number],
  reducedScope: boolean
): string[] {
  const lines: string[] = [];

  lines.push(`## Writing Question (${question.id})`);
  lines.push("");

  // Include relevant text excerpts
  lines.push("### Text You Need");
  lines.push(
    "*These are the parts of the article that will help you answer the question:*"
  );
  lines.push("");

  const excerpts = getRelevantExcerpts("3-4, 5-7, 9");
  for (const excerpt of excerpts) {
    lines.push(`> ${excerpt}`);
    lines.push("");
  }

  // Modified question
  lines.push("### Your Question");
  lines.push("");

  if (reducedScope) {
    lines.push(
      '**Explain what Lowe means when he says a community is "a group of people who share an identity-forming narrative."**'
    );
    lines.push("");
    lines.push("**What you need to write:**");
    lines.push(
      "1. One sentence explaining what \"identity-forming narrative\" means (use the text excerpts above)"
    );
    lines.push(
      "2. One example from the article that shows what this looks like (hint: look at the Newcastle paragraphs)"
    );
    lines.push("");
    lines.push(
      "*That's it -- two things. You can write more if you want, but two is enough.*"
    );
  } else {
    lines.push(`**${question.questionText.split("\n")[0]}**`);
  }

  lines.push("");
  lines.push("### Sentence Starters (pick one to get started)");
  lines.push("");
  lines.push(
    '- "When Lowe says a community shares an \'identity-forming narrative,\' he means that _____."'
  );
  lines.push(
    '- "An identity-forming narrative is a story that _____. For example, Lowe describes how _____."'
  );
  lines.push(
    '- "Lowe defines community as people who share a story that _____."'
  );
  lines.push("");

  lines.push("### Word Bank");
  lines.push(
    "*Try to use at least one of these words from the lesson:*"
  );
  lines.push("");
  lines.push(
    "**narrative** (a story) | **aspect** (a part of something) | **identity** (who you are) | **community** (a group with a shared story)"
  );
  lines.push("");

  lines.push("### Write Your Answer Here");
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");

  return lines;
}

function buildTakeHomeMC(
  question: (typeof communityLesson.questions)[number]
): string[] {
  const lines: string[] = [];

  lines.push(`## Multiple Choice (${question.id})`);
  lines.push("");

  // Check if question references specific paragraphs
  const paraMatch = question.questionText.match(
    /paragraph[s]?\s+(\d+[-–]\d+|\d+)/i
  );
  if (paraMatch) {
    lines.push("### Text You Need");
    const excerpts = getRelevantExcerpts(paraMatch[1]);
    for (const excerpt of excerpts) {
      lines.push(`> ${excerpt}`);
      lines.push("");
    }
  }

  // Present the question with choices
  const qParts = question.questionText.split("\n");
  lines.push(`**${qParts[0]}**`);
  lines.push("");
  for (const part of qParts.slice(1)) {
    if (part.trim()) {
      lines.push(part);
    }
  }
  lines.push("");
  lines.push("**My answer:** _____");
  lines.push("");

  return lines;
}

function buildTakeHomeDuringReading(
  question: (typeof communityLesson.questions)[number],
  reducedScope: boolean
): string[] {
  const lines: string[] = [];

  lines.push(`## Reading Question (${question.id})`);
  lines.push("");

  // Include relevant text
  if (question.paragraphRange) {
    lines.push("### Text You Need");
    lines.push("");
    const excerpts = getRelevantExcerpts(question.paragraphRange);
    for (const excerpt of excerpts) {
      lines.push(`> ${excerpt}`);
      lines.push("");
    }
  }

  lines.push("### Question");
  lines.push(`**${question.questionText}**`);
  lines.push("");

  if (reducedScope && question.format === "Write") {
    lines.push(
      "*Hint: You can answer in 1-2 sentences. Use the text above to help you.*"
    );
    lines.push("");
  }

  lines.push("### Your Answer");
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");

  return lines;
}

function buildTakeHomeDiscussion(
  question: (typeof communityLesson.questions)[number]
): string[] {
  const lines: string[] = [];

  lines.push(`## Think About It (${question.id})`);
  lines.push(
    "*This was a discussion question in class. Write your thoughts here instead.*"
  );
  lines.push("");
  lines.push(`**${question.questionText}**`);
  lines.push("");
  lines.push("### My Thoughts");
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");
  lines.push(
    "________________________________________________________________________"
  );
  lines.push("");

  return lines;
}
