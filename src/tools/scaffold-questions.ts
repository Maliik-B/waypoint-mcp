/**
 * Tool: scaffold_question
 *
 * Takes a specific question from the lesson and generates a scaffolded
 * version calibrated to the student's reading level and IEP goals.
 *
 * Scaffolding strategies:
 * - Sentence starters (for writing prompts)
 * - Chunked sub-questions (break complex questions into steps)
 * - Paragraph references (point to where the answer lives)
 * - Vocabulary support (define key terms in the question)
 * - Graphic organizers (structured note-taking frameworks)
 *
 * All scaffolds are specific to the actual lesson content.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const scaffoldQuestionSchema = z.object({
  question_id: z
    .string()
    .describe(
      "The question ID to scaffold (e.g., 'DR-1A', 'MC-1', 'SA-1', 'DISC-1'). Use 'all' to scaffold every question."
    ),
  scaffolding_level: z
    .enum(["light", "moderate", "intensive"])
    .optional()
    .default("moderate")
    .describe(
      "How much scaffolding to provide. Light = paragraph hints. Moderate = sentence starters + chunked questions. Intensive = fill-in-the-blank with word banks."
    ),
  mode: z
    .enum(["teacher", "student"])
    .optional()
    .default("teacher")
    .describe(
      "Output mode. 'teacher' includes expected answer hints for the teacher's reference copy. 'student' produces a clean handout without answer hints, ready to photocopy and hand to the student."
    ),
});

export type ScaffoldQuestionInput = z.infer<typeof scaffoldQuestionSchema>;

export function scaffoldQuestion(rawInput: ScaffoldQuestionInput): string {
  const input = scaffoldQuestionSchema.parse(rawInput);
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;
  const isTeacherMode = input.mode === "teacher";

  const sections: string[] = [];

  const modeLabel = isTeacherMode ? "Teacher Edition (includes answer hints)" : "Student Handout";
  sections.push("# Scaffolded Question(s) for Jasmine Bailey");
  sections.push(
    `**Scaffolding Level:** ${input.scaffolding_level} | **Mode:** ${modeLabel} | **Reading Level:** Grade 3 (iReady)`
  );
  sections.push("");

  // IEP rationale context (teacher edition only)
  if (isTeacherMode) {
    sections.push("## Scaffolding Rationale");
    sections.push(
      "Jasmine's IEP benchmarks include: accurately annotating text, answering literal comprehension questions, writing claims with evidence, and finding textual evidence. Scaffolds should BUILD these skills, not bypass them."
    );
    sections.push("");
    sections.push("Key considerations:");
    sections.push(
      "- She can decode grade-level words but struggles with literal and inferential comprehension"
    );
    sections.push(
      "- She benefits from graphic organizers and checklists (starting to find value in them)"
    );
    sections.push(
      "- Writing is stronger with 1:1 support; independent writing is ~50% accuracy"
    );
    sections.push(
      "- She needs to use reference sheets and class notes more effectively (Math benchmark 3, applicable to ELA too)"
    );
    sections.push("");
  }

  if (input.question_id === "all") {
    for (const q of lesson.questions) {
      sections.push(scaffoldSingleQuestion(q, input.scaffolding_level, isTeacherMode));
      sections.push("---");
      sections.push("");
    }
  } else {
    const question = lesson.questions.find((q) => q.id === input.question_id);
    if (!question) {
      return `Question ID "${input.question_id}" not found. Available IDs: ${lesson.questions.map((q) => q.id).join(", ")}`;
    }
    sections.push(scaffoldSingleQuestion(question, input.scaffolding_level, isTeacherMode));
  }

  return sections.join("\n");
}

function scaffoldSingleQuestion(
  question: (typeof communityLesson.questions)[number],
  level: "light" | "moderate" | "intensive",
  isTeacherMode: boolean
): string {
  const lines: string[] = [];

  lines.push(`## ${question.id}: ${question.format}`);
  lines.push(`**Original Question:** ${question.questionText}`);
  if (question.paragraphRange) {
    lines.push(`**Paragraph(s):** ${question.paragraphRange}`);
  }
  lines.push("");

  // Generate scaffolding based on question type and level
  switch (question.type) {
    case "during-reading":
      lines.push(scaffoldDuringReading(question, level, isTeacherMode));
      break;
    case "multiple-choice":
      lines.push(scaffoldMultipleChoice(question, level, isTeacherMode));
      break;
    case "short-answer":
      lines.push(scaffoldShortAnswer(question, level, isTeacherMode));
      break;
    case "discussion":
      lines.push(scaffoldDiscussion(question, level, isTeacherMode));
      break;
  }

  let result = lines.join("\n");

  // In student mode, strip teacher-only content:
  // - Lines starting with *Expected (answer hints)
  // - Lines starting with *The teacher/SE teacher should (teacher directives)
  if (!isTeacherMode) {
    result = result
      .split("\n")
      .filter((line) => {
        const trimmed = line.trim();
        return (
          !trimmed.startsWith("*Expected") &&
          !trimmed.startsWith("*The teacher") &&
          !trimmed.startsWith("*The SE teacher") &&
          !trimmed.startsWith("*Hint for Jasmine:")
        );
      })
      .join("\n")
      // Clean up double blank lines left by removal
      .replace(/\n{3,}/g, "\n\n");
  }

  return result;
}

function scaffoldDuringReading(
  q: (typeof communityLesson.questions)[number],
  level: "light" | "moderate" | "intensive",
  isTeacherMode: boolean
): string {
  const lines: string[] = [];

  lines.push(`### Scaffolded Version (${level})`);
  lines.push("");

  if (level === "light") {
    lines.push("**Hint for Jasmine:**");
    if (q.paragraphRange) {
      lines.push(
        `Look at paragraph(s) ${q.paragraphRange}. The answer is in the text.`
      );
    }
    if (q.format === "Write") {
      lines.push("Try to write at least 2 sentences.");
    }
  } else if (level === "moderate") {
    lines.push("**Modified question for Jasmine:**");
    lines.push("");

    // Question-specific scaffolds
    if (q.id === "DR-1A") {
      lines.push(
        "Read paragraph 1. Lowe says the word 'community' has a 'strange power.'"
      );
      lines.push("What does he mean? Choose one:");
      lines.push("- [ ] People use the word a lot but don't explain what they mean");
      lines.push("- [ ] Community is a dangerous word");
      lines.push("- [ ] Nobody talks about community");
      lines.push(
        "Now tell your partner: Why do you think people don't say what they mean by 'community'?"
      );
    } else if (q.id === "DR-1B") {
      lines.push("Look at the bullet list in paragraph 2.");
      lines.push("Count the bullet points. Lowe lists things that a good definition of community should explain.");
      lines.push("");
      lines.push('**Sentence starter:** "In paragraph 2, Lowe lists six things that a definition of community needs to explain. This connects to paragraph 1 because _____."');
      lines.push("");
      lines.push("*Expected direction: The list supports Lowe's claim that people don't define 'community' clearly, by showing what a good definition must cover.*");
    } else if (q.id === "DR-1C") {
      lines.push(
        "Look at the bullet list in paragraph 2. Find THREE traits of a community."
      );
      lines.push("Fill in:");
      lines.push(
        "1. There are many different kinds of communities (like places, religions, or __________)."
      );
      lines.push(
        "2. Communities can make people feel __________ and like they belong."
      );
      lines.push(
        "3. Communities shape what people think is __________ and __________."
      );
      lines.push("");
      lines.push("*Expected answers: (1) interests/shared practices, (2) togetherness/positive, (3) good, bad*");
    } else if (q.id === "DR-2A") {
      lines.push(
        "Lowe says a community is 'a group of people who share an identity-forming narrative' (paragraph 3)."
      );
      lines.push("He uses Newcastle as an example. In paragraphs 5-6, find:");
      lines.push("- What does Lowe DO to be part of Newcastle's community? (list 2 things)");
      lines.push("- How does being part of Newcastle make him FEEL? (list 1 feeling)");
      lines.push("");
      lines.push(
        '**Sentence starter:** "Lowe\'s example supports his definition because Newcastle\'s shared story is part of who he is. For example, he _____ and _____."'
      );
      lines.push("");
      lines.push("*Expected direction: He shows people around the city, feels pride/at home when hearing the accent, attends football matches, adopted Newcastle character traits. These show the community's story is part of his identity.*");
    } else if (q.id === "DR-2B") {
      lines.push("Think about a community YOU are part of (your school, neighborhood, team, family, etc.).");
      lines.push("");
      lines.push("Fill in before talking:");
      lines.push("- My community: __________");
      lines.push("- Our shared story: __________");
      lines.push("- Something I do that shows I'm part of this community: __________");
    } else if (q.id === "DR-3A") {
      lines.push("Look at paragraph 2 (the first list) and paragraph 8 (the second list).");
      lines.push("Both lists have 6 bullet points.");
      lines.push("");
      lines.push("**Question:** Why did Lowe write TWO lists?");
      lines.push("- The first list says what a definition NEEDS to do");
      lines.push("- The second list shows that his definition **meets** each of those requirements");
      lines.push("");
      lines.push("In your own words: Why does Lowe go through each trait a second time?");
      lines.push("");
      lines.push("*Expected answer: Lowe tests his definition against the 6 criteria from paragraph 2 to prove it works.*");
    } else if (q.id === "DR-3B") {
      lines.push("In paragraph 8, Lowe checks his definition against 6 traits.");
      lines.push("Choose 3 of these traits and explain in your own words:");
      lines.push("");
      lines.push("| Trait | Why Lowe's definition works |");
      lines.push("| --- | --- |");
      lines.push(
        '| Different types of communities | A "shared story" can be about a place, religion, or __________ |'
      );
      lines.push(
        "| Positive feelings | Being part of a shared story makes people feel __________ |"
      );
      lines.push(
        "| Part of many communities | People can have more than one __________ |"
      );
      lines.push("");
      lines.push("*Expected answers: (1) any other social practice/interest, (2) like they belong / part of something larger / togetherness, (3) identity-forming story / shared story*");
    } else if (q.id === "DR-4") {
      lines.push("The title asks TWO questions:");
      lines.push("1. **What** is community?");
      lines.push("2. **Why** is it important?");
      lines.push("");
      lines.push("Find one quote that answers each:");
      lines.push('- WHAT is community? Look in paragraphs 9-10 for Lowe\'s definition. Start with "Community is..."');
      lines.push(
        '- WHY is it important? Look in paragraph 11 for why Lowe thinks community matters for "social change."'
      );
    }
  } else {
    // Intensive
    lines.push("**Fill-in-the-blank version for Jasmine:**");
    lines.push("");

    if (q.id === "DR-1A") {
      lines.push("Lowe says the word 'community' has a '__________ power.'");
      lines.push(
        "This means the word makes people feel __________ and __________."
      );
      lines.push(
        "But Lowe says people almost never __________ what they mean by 'community.'"
      );
      lines.push("");
      lines.push("**Word bank:** strange, togetherness, positivity, say/explain");
    } else if (q.id === "DR-1C") {
      lines.push("Three traits of a community from paragraph 2:");
      lines.push("");
      lines.push("1. There are __________ types of communities (bullet 1)");
      lines.push(
        "2. Communities create __________ feelings (bullet 2)"
      );
      lines.push(
        "3. Communities shape what is __________ and __________ (bullet 4)"
      );
      lines.push("");
      lines.push(
        "**Word bank:** different, positive/good, good, bad"
      );
    } else {
      lines.push(
        "The teacher or SE teacher should work through this question 1:1 with Jasmine."
      );
      lines.push(
        "Read the relevant paragraph(s) aloud together, then have Jasmine dictate her answer verbally before writing."
      );
      if (q.sampleAnswer) {
        lines.push("");
        lines.push(`**Target answer direction:** ${q.sampleAnswer}`);
      }
    }
  }

  return lines.join("\n");
}

function scaffoldMultipleChoice(
  q: (typeof communityLesson.questions)[number],
  level: "light" | "moderate" | "intensive",
  _isTeacherMode: boolean
): string {
  const lines: string[] = [];

  lines.push(`### Scaffolded Version (${level})`);
  lines.push("");

  if (level === "light") {
    // Just add paragraph references
    const hints: Record<string, string> = {
      "MC-1": "Hint: Think about the whole article. What was Lowe TRYING to do?",
      "MC-2": "Hint: Which quote best captures the MAIN point of the entire article?",
      "MC-3":
        'Hint: Replace "slighted" with each answer choice. Which one makes the most sense in context?',
      "MC-4":
        "Hint: Paragraphs 5-7 are about Lowe and Newcastle. How does this HELP the reader?",
    };
    lines.push(hints[q.id] || "Hint: Re-read the relevant paragraph(s).");
  } else if (level === "moderate") {
    // Eliminate one wrong answer and add reasoning prompt
    if (q.id === "MC-1") {
      lines.push("**Step 1:** Cross out the answer that is clearly wrong:");
      lines.push(
        "- C talks about 'describing life in Newcastle' -- is that what the WHOLE article is about? No. Cross out C."
      );
      lines.push(
        "**Step 2:** Now choose between A, B, and D. The article mostly:"
      );
      lines.push(
        "- Talks about being part of multiple communities (A), OR"
      );
      lines.push(
        "- Shows how community shaped the author's life (B), OR"
      );
      lines.push("- Gives a clear definition of community (D)?");
    } else if (q.id === "MC-2") {
      lines.push("**Step 1:** Read each quote. Ask: Does this quote capture the MAIN IDEA?");
      lines.push(
        "**Step 2:** The main idea is Lowe's DEFINITION of community."
      );
      lines.push("Which quote IS the definition? Look for the word 'community is...'");
    } else if (q.id === "MC-3") {
      lines.push(
        '**Step 1:** Read the sentence: "I feel slighted when people say horrible things about it."'
      );
      lines.push(
        "**Step 2:** People are saying HORRIBLE things about Newcastle. How would that make Lowe feel?"
      );
      lines.push(
        "- Bored? Insulted? Motivated? Recognized?"
      );
      lines.push("Which feeling makes sense when someone says something mean about a place you love?");
    } else if (q.id === "MC-4") {
      lines.push("**Step 1:** Paragraphs 5-7 are about Lowe and Newcastle.");
      lines.push("**Step 2:** WHY did Lowe include this story? To:");
      lines.push("- Explain why community is neither good nor bad (A)?");
      lines.push("- Describe Newcastle life (B)?");
      lines.push("- Give a PERSONAL EXAMPLE of his definition (C)?");
      lines.push("- Show Newcastle has many members (D)?");
      lines.push(
        "Think: Does this example help you understand what 'identity-forming narrative' means?"
      );
    }
  } else {
    // Intensive: reduce to 2 choices
    if (q.id === "MC-1") {
      lines.push("Choose the best answer (2 choices):");
      lines.push(
        "- **B.** to demonstrate the way community has shaped the author's life"
      );
      lines.push(
        "- **D.** to give a clear and useful definition of community"
      );
      lines.push("");
      lines.push(
        "Think: Is the article MOSTLY about the author's personal life, or about defining community?"
      );
    } else if (q.id === "MC-2") {
      lines.push("Choose the quote that IS Lowe's definition:");
      lines.push(
        '- **B.** "It is this choice to participate..."'
      );
      lines.push(
        '- **C.** "Community is a group of people who share a story..."'
      );
    } else if (q.id === "MC-3") {
      lines.push(
        "If someone says something mean about a place you love, you feel:"
      );
      lines.push("- **A.** bored");
      lines.push("- **B.** insulted");
    } else if (q.id === "MC-4") {
      lines.push("Lowe's Newcastle story is:");
      lines.push("- **B.** A description of Newcastle");
      lines.push("- **C.** A personal example of his definition");
    }
  }

  return lines.join("\n");
}

function scaffoldShortAnswer(
  q: (typeof communityLesson.questions)[number],
  level: "light" | "moderate" | "intensive",
  _isTeacherMode: boolean
): string {
  const lines: string[] = [];

  lines.push(`### Scaffolded Version (${level})`);
  lines.push("");

  if (level === "light") {
    lines.push("**Paragraph references:** Look at paragraphs 3, 4, and 9.");
    lines.push("**Vocabulary to use:** narrative, aspect, community");
    lines.push(
      "**Remember:** Include at least 2 details from the text."
    );
  } else if (level === "moderate") {
    lines.push("**Graphic Organizer for Short Answer:**");
    lines.push("");
    lines.push("| Step | What to Write | Where to Find It |");
    lines.push("| --- | --- | --- |");
    lines.push(
      '| 1. Claim | What does "identity-forming narrative" mean? | Paragraph 3-4 |'
    );
    lines.push(
      "| 2. Evidence #1 | Quote or paraphrase from the text | Paragraph 4 or 9 |"
    );
    lines.push(
      "| 3. Explain Evidence #1 | How does this help explain the definition? | Your own words |"
    );
    lines.push(
      "| 4. Evidence #2 | Another quote or detail from the text | Paragraphs 5-7 |"
    );
    lines.push(
      "| 5. Explain Evidence #2 | How does this connect? | Your own words |"
    );
    lines.push("");
    lines.push("**Sentence starters:**");
    lines.push(
      '- Claim: "When Lowe says a community shares an \'identity-forming narrative,\' he means that _____."'
    );
    lines.push(
      '- Evidence: "For example, Lowe explains that _____." (paragraph ___)'
    );
    lines.push(
      '- Analysis: "This shows that an identity-forming narrative is _____ because _____."'
    );
    lines.push("");
    lines.push("**Unit vocabulary to include:** narrative, aspect, moral, specific");
    lines.push("");
    lines.push("*Expected answer direction:*");
    lines.push("*- Claim: ...he means that a community shares a story so important it becomes part of who they are.*");
    lines.push('*- Evidence #1: "Those people build the shared story archetypes of that community into their sense of themselves" (para 4).*');
    lines.push("*- Evidence #2: Lowe shows people around Newcastle, feels pride and at home hearing the accent (paras 5-6).*");
    lines.push("*- Analysis: An identity-forming narrative is a story that shapes a person's identity and worldview.*");
  } else {
    // Intensive: partially filled in
    lines.push("**Fill in the blanks to complete your response:**");
    lines.push("");
    lines.push(
      'When Lowe says a community shares an "identity-forming narrative," he means that a community is a group of people who share a __________ that is so important that it becomes part of __________. '
    );
    lines.push("");
    lines.push(
      "For example, Lowe explains that people in a community \"build the shared story archetypes of that community into their sense of __________\" (paragraph 4). This means the community's story becomes part of how they see __________. "
    );
    lines.push("");
    lines.push(
      "Lowe also shows this through his own example. He is part of the __________ community because he __________. (Write one thing Lowe does from paragraphs 5-6.) "
    );
    lines.push("");
    lines.push(
      "This shows that an \"identity-forming narrative\" is a shared story that shapes who people __________ and how they see the __________."
    );
    lines.push("");
    lines.push(
      "**Word bank:** story, who they are, themselves, the world, Newcastle, are, world"
    );
    lines.push("");
    lines.push("**Checklist:**");
    lines.push("- [ ] Did I explain what 'identity-forming narrative' means?");
    lines.push("- [ ] Did I include 2 details from the text?");
    lines.push(
      "- [ ] Did I use unit vocabulary (narrative, aspect, moral, or specific)?"
    );
    lines.push("");
    lines.push("*Expected completed version: ...share a **story** that is so important that it becomes part of **who they are**. ...into their sense of **themselves**... how they see **the world**. ...part of the **Newcastle** community because he **shows people around the city / attends football matches / adopted their character traits**. ...shapes who people **are** and how they see the **world**.*");
  }

  return lines.join("\n");
}

function scaffoldDiscussion(
  q: (typeof communityLesson.questions)[number],
  level: "light" | "moderate" | "intensive",
  _isTeacherMode: boolean
): string {
  const lines: string[] = [];

  lines.push(`### Scaffolded Version (${level})`);
  lines.push("");

  if (level === "light") {
    lines.push("**Think about your answer for 30 seconds before sharing.**");
    if (q.id === "DISC-1") {
      lines.push("Think about your school, neighborhood, or family.");
    } else if (q.id === "DISC-2") {
      lines.push("There is no wrong answer. Explain your thinking.");
    } else {
      lines.push("Think about the different communities Lowe mentioned.");
    }
  } else if (level === "moderate") {
    if (q.id === "DISC-1") {
      lines.push("**Before you talk with your partner, fill in:**");
      lines.push("- A community I'm part of: __________");
      lines.push("- Something that is courteous (polite/kind) in that community: __________");
      lines.push("");
      lines.push(
        '**Sentence starter:** "In my __________ community, it is courteous to _________. For example, _________."'
      );
      lines.push("");
      lines.push(
        "*Hint for Jasmine: Think about Riverstone Prep. What's something people do here to be kind or respectful?*"
      );
    } else if (q.id === "DISC-2") {
      lines.push("**Think about it this way:**");
      lines.push(
        "- Can you be part of a team but disagree with some of the rules?"
      );
      lines.push(
        "- Can you be part of a family but have different opinions than your family?"
      );
      lines.push("");
      lines.push("**Choose your position:**");
      lines.push('- "Yes, I think you can be part of a community without agreeing with everything because _____."');
      lines.push('- "No, I think you have to agree because _____."');
    } else if (q.id === "DISC-3") {
      lines.push("**List 2 communities you belong to:**");
      lines.push("1. __________");
      lines.push("2. __________");
      lines.push("");
      lines.push("**Now think:** What's one good thing about being part of BOTH?");
      lines.push(
        '**Sentence starter:** "One benefit of belonging to more than one community is _________ because _________."'
      );
    }
  } else {
    lines.push(
      "**The SE teacher should preview the discussion question with Jasmine 30 seconds before the class starts discussing.**"
    );
    lines.push("");
    if (q.id === "DISC-1") {
      lines.push(
        'Help her connect to something concrete: "Think about lunchtime at Riverstone. What\'s something nice people do?" Then she can share that with her partner.'
      );
    } else if (q.id === "DISC-2") {
      lines.push(
        'Simplify: "Can you be part of your school but disagree with a rule? That\'s what this question is about."'
      );
    } else {
      lines.push(
        'Simplify: "You\'re part of your school AND your family. Those are two communities. What\'s good about being in both?"'
      );
    }
  }

  return lines.join("\n");
}
