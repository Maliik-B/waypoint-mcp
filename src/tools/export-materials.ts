/**
 * Tool: export_printable_materials
 *
 * Bundles all the materials a teacher needs for a lesson into a single
 * print-ready Markdown document. This includes the graphic organizer,
 * pause-plan-proceed card, lesson schedule card, writing scaffold,
 * and vocabulary reference -- all formatted for clean printing.
 *
 * Real-world context: Teachers print materials before class. Having one
 * document to print (instead of generating each tool's output separately)
 * saves time and ensures nothing is forgotten.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const exportMaterialsSchema = z.object({
  include: z
    .array(
      z.enum([
        "graphic-organizer",
        "writing-scaffold",
        "schedule-card",
        "pause-plan-proceed",
        "vocabulary-reference",
        "teacher-cheat-sheet",
      ])
    )
    .optional()
    .default([
      "graphic-organizer",
      "writing-scaffold",
      "schedule-card",
      "pause-plan-proceed",
      "vocabulary-reference",
      "teacher-cheat-sheet",
    ])
    .describe(
      "Which materials to include. Defaults to all. Options: graphic-organizer, writing-scaffold, schedule-card, pause-plan-proceed, vocabulary-reference, teacher-cheat-sheet."
    ),
  mode: z
    .enum(["student", "teacher"])
    .optional()
    .default("student")
    .describe(
      "Student mode produces clean handouts. Teacher mode adds answer keys and implementation notes."
    ),
});

export type ExportMaterialsInput = z.infer<typeof exportMaterialsSchema>;

export function exportMaterials(rawInput: ExportMaterialsInput): string {
  const input = exportMaterialsSchema.parse(rawInput);
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;
  const isTeacher = input.mode === "teacher";

  const pages: string[] = [];

  pages.push("# Printable Materials Pack");
  pages.push(
    `**Student:** ${iep.profile.name} | **Lesson:** ${lesson.metadata.title}`
  );
  pages.push(
    `**Date:** __________ | **Period:** __________ | **Prepared by:** __________`
  );
  pages.push("");
  pages.push("---");
  pages.push("");

  for (const material of input.include) {
    switch (material) {
      case "graphic-organizer":
        pages.push(...buildGraphicOrganizer(isTeacher));
        break;
      case "writing-scaffold":
        pages.push(...buildWritingScaffold(isTeacher));
        break;
      case "schedule-card":
        pages.push(...buildScheduleCard());
        break;
      case "pause-plan-proceed":
        pages.push(...buildPausePlanProceed());
        break;
      case "vocabulary-reference":
        pages.push(...buildVocabularyReference(isTeacher));
        break;
      case "teacher-cheat-sheet":
        if (isTeacher) {
          pages.push(...buildTeacherCheatSheet());
        }
        break;
    }
  }

  return pages.join("\n");
}

function buildGraphicOrganizer(isTeacher: boolean): string[] {
  const lines: string[] = [];

  lines.push("## Graphic Organizer: Community Traits");
  lines.push(
    "*Use this while reading paragraphs 2 and 8. The left column lists traits from paragraph 2. Fill in the right column with how Lowe tests each trait in paragraph 8 (Newcastle example).*"
  );
  lines.push("");
  lines.push(
    "| Trait of Community (Paragraph 2) | How Lowe Tests It in Paragraph 8 (Newcastle) |"
  );
  lines.push("| --- | --- |");

  const traits = [
    {
      trait: "A shared, identity-forming narrative",
      answer:
        "Newcastle's founding story and football culture form a shared identity",
    },
    {
      trait: "Common values and norms of behavior",
      answer: "Solidarity and loyalty are core values in Newcastle",
    },
    {
      trait: "A sense of mutual obligation",
      answer:
        "Community members feel responsible for each other during hard times",
    },
    {
      trait: "Participation in shared practices",
      answer:
        "Attending football matches, community events, shared rituals",
    },
    {
      trait: "Commitment to the well-being of other members",
      answer:
        "Lowe describes people looking out for each other as part of the community",
    },
    {
      trait: "A sense of belonging",
      answer:
        "Even when dispersed, Newcastle people maintain their identity and accent",
    },
  ];

  for (const t of traits) {
    if (isTeacher) {
      lines.push(`| ${t.trait} | *${t.answer}* |`);
    } else {
      lines.push(`| ${t.trait} | |`);
    }
  }

  lines.push("");
  if (isTeacher) {
    lines.push(
      "*Teacher note: Jasmine should be able to fill in at least 3-4 cells with support. If she fills in 2 or fewer, consider re-reading paragraph 8 aloud together.*"
    );
    lines.push("");
  }
  lines.push("---");
  lines.push("");

  return lines;
}

function buildWritingScaffold(isTeacher: boolean): string[] {
  const lines: string[] = [];

  lines.push("## Writing Scaffold: Short Answer (SA-1)");
  lines.push(
    '*Question: Explain what Lowe means when he says a community is "a group of people who share an identity-forming narrative."*'
  );
  lines.push("");
  lines.push("### Step-by-Step Guide");
  lines.push("");
  lines.push(
    "| Step | What to Write | Where to Find It | Your Answer |"
  );
  lines.push("| --- | --- | --- | --- |");
  lines.push(
    '| 1. Claim | What does "identity-forming narrative" mean? | Paragraphs 3-4 | |'
  );
  lines.push(
    "| 2. Evidence #1 | A quote or detail from the text | Paragraph 4 or 9 | |"
  );
  lines.push(
    "| 3. Explain #1 | How does this help explain the definition? | Your own words | |"
  );
  lines.push(
    "| 4. Evidence #2 | Another quote or detail | Paragraphs 5-7 (Newcastle) | |"
  );
  lines.push(
    "| 5. Explain #2 | How does this connect to the definition? | Your own words | |"
  );
  lines.push("");
  lines.push("### Sentence Starters");
  lines.push("");
  lines.push(
    '- **Claim:** "When Lowe says a community shares an \'identity-forming narrative,\' he means that _____."'
  );
  lines.push(
    '- **Evidence:** "For example, Lowe explains that _____." (paragraph ___)'
  );
  lines.push(
    '- **Analysis:** "This shows that an identity-forming narrative is _____ because _____."'
  );
  lines.push("");
  lines.push(
    "**Vocabulary to include:** narrative, aspect, moral, specific"
  );
  lines.push("");

  if (isTeacher) {
    lines.push("### Expected Response Elements");
    lines.push(
      "- Claim should reference a story/narrative that shapes who people are as a group"
    );
    lines.push(
      '- Strong evidence: Paragraph 4 ("stories we tell about ourselves") or paragraph 9 (Newcastle accent/identity persisting even when dispersed)'
    );
    lines.push(
      "- Analysis should connect narrative to identity formation (the story becomes part of who you are)"
    );
    lines.push(
      "- Rubric target: claim + 2 evidence + 2 analysis = full marks. Jasmine's target: claim + 1 evidence + 1 analysis (progress toward 75%)"
    );
    lines.push("");
  }

  lines.push("### Self-Checklist");
  lines.push("- [ ] My claim answers the question");
  lines.push("- [ ] I included evidence from the text");
  lines.push("- [ ] I wrote the paragraph number for my evidence");
  lines.push("- [ ] I explained how my evidence supports my claim");
  lines.push("- [ ] I used at least one vocabulary word");
  lines.push("");
  lines.push("---");
  lines.push("");

  return lines;
}

function buildScheduleCard(): string[] {
  const lines: string[] = [];

  lines.push("## Lesson Schedule Card");
  lines.push("*Keep on your desk. Check off each section as we finish.*");
  lines.push("");
  lines.push("| | Time | What We're Doing | Done? |");
  lines.push("| --- | --- | --- | --- |");
  lines.push("| 1 | 5 min | Intro: vocabulary and purpose for reading | [ ] |");
  lines.push("| 2 | 15 min | Reading together and with a partner | [ ] |");
  lines.push("| | | **BREAK** | |");
  lines.push("| 3 | 8 min | Multiple choice questions (use the text!) | [ ] |");
  lines.push("| | | **BREAK** | |");
  lines.push("| 4 | 12 min | Short answer writing | [ ] |");
  lines.push("| 5 | 5 min | Discussion with a partner | [ ] |");
  lines.push("");
  lines.push(
    "**Remember:** You can look back at the text anytime. Ask for help if you're stuck."
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  return lines;
}

function buildPausePlanProceed(): string[] {
  const lines: string[] = [];

  lines.push("## Pause, Plan, Proceed Card");
  lines.push("*Use this before answering any question.*");
  lines.push("");
  lines.push("### PAUSE");
  lines.push("What is the question asking me?");
  lines.push("");
  lines.push("Write it in your own words: _________________________________");
  lines.push("");
  lines.push("### PLAN");
  lines.push("Where in the text will I find the answer?");
  lines.push("");
  lines.push("Paragraph number(s): _______");
  lines.push("");
  lines.push("### PROCEED");
  lines.push("Write your answer. Use evidence from the text.");
  lines.push("");
  lines.push("---");
  lines.push("");

  return lines;
}

function buildVocabularyReference(isTeacher: boolean): string[] {
  const lines: string[] = [];
  const lesson = communityLesson;

  lines.push("## Vocabulary Reference Sheet");
  lines.push(
    "*These words appear in the article. Use this sheet while reading.*"
  );
  lines.push("");
  lines.push("| Word | How to Say It | What It Means |");
  lines.push("| --- | --- | --- |");

  for (const v of lesson.vocabulary) {
    const def = v.definition || "______________________________";
    lines.push(`| **${v.word}** | ${v.pronunciation} | ${def} |`);
  }

  lines.push("");

  if (isTeacher) {
    lines.push(
      "*Teacher note: Pre-teach 'narrative', 'solidarity', and 'essence' before the lesson. These three are critical for comprehension and are unlikely to be in Jasmine's Grade 3 vocabulary.*"
    );
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  return lines;
}

function buildTeacherCheatSheet(): string[] {
  const lines: string[] = [];

  lines.push("## Teacher Cheat Sheet (Do Not Distribute to Students)");
  lines.push("");
  lines.push("### Quick Answers for During Reading Questions");
  lines.push("");

  const quickAnswers = [
    {
      id: "DR-1A",
      q: "What is the text mainly about?",
      a: "What community means and why it matters",
    },
    {
      id: "DR-1C",
      q: "How does Lowe define community?",
      a: "Six traits: shared narrative, common values, mutual obligation, shared practices, commitment to well-being, belonging",
    },
    {
      id: "DR-2A",
      q: "How does Lowe test his definition?",
      a: "He applies the 6 traits to Newcastle and shows how the city meets all of them",
    },
    {
      id: "DR-3A",
      q: "What is Newcastle's 'identity-forming narrative'?",
      a: "The city's founding story, industrial heritage, and football culture that shape residents' identity",
    },
    {
      id: "DR-4",
      q: "Why is community important?",
      a: "It provides belonging, moral framework, mutual support, and identity even when members are physically dispersed",
    },
  ];

  for (const qa of quickAnswers) {
    lines.push(`**${qa.id}:** ${qa.q}`);
    lines.push(`> ${qa.a}`);
    lines.push("");
  }

  lines.push("### MC Answer Key");
  lines.push("1. D &nbsp; 2. C &nbsp; 3. B &nbsp; 4. C");
  lines.push("");
  lines.push("---");
  lines.push("");

  return lines;
}
