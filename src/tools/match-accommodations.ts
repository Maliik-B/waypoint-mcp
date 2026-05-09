/**
 * Tool: match_accommodations
 *
 * Maps each IEP accommodation to specific moments in the lesson where
 * it should be implemented. Produces a concrete accommodation-activity
 * matrix that a teacher (or SE teacher) can use as a checklist.
 *
 * This goes beyond generic "provide extra time" to specify exactly
 * WHEN and HOW each accommodation applies during the 45-minute lesson.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const matchAccommodationsSchema = z.object({
  include_self_regulation_checkpoints: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Whether to include proactive self-regulation checkpoint recommendations based on the student's behavioral pattern."
    ),
});

export type MatchAccommodationsInput = z.infer<
  typeof matchAccommodationsSchema
>;

export function matchAccommodations(input: MatchAccommodationsInput): string {
  const iep = jasmineBaileyIEP;
  const lesson = communityLesson;

  const sections: string[] = [];

  sections.push("# Accommodation-Activity Matrix");
  sections.push(
    `**Student:** ${iep.profile.name} | **Lesson:** ${lesson.metadata.title}`
  );
  sections.push(
    `**Duration:** ${lesson.metadata.totalDuration} | **Standard:** ${lesson.metadata.standards.join(", ")}`
  );
  sections.push("");

  // Context about Jasmine's behavioral pattern
  sections.push("## Behavioral Context for Implementation");
  sections.push(
    "Jasmine's disability affects attention, task initiation, focus, stamina, and study skills."
  );
  sections.push("**Critical pattern:** Academic frustration leads to avoidance behaviors:");
  sections.push(
    "- Quietly puts head down"
  );
  sections.push("- Asks to use the restroom multiple times");
  sections.push("- Disengages and withdraws rather than asking for help");
  sections.push(
    "- Chooses to stay in whole group 80% of the time despite struggling"
  );
  sections.push(
    "**Key insight:** Jasmine is MOST at risk of shutdown during independent work with grade-level text (she reads at Grade 3; this is a 7th-grade text)."
  );
  sections.push("");

  // Build the matrix
  sections.push("## Accommodation Matrix");
  sections.push("");
  sections.push(
    "For each accommodation, the following shows exactly when and how to implement it during this lesson's activities."
  );
  sections.push("");

  // Each accommodation mapped to activities
  for (const acc of iep.accommodations) {
    sections.push(`### [${acc.category.toUpperCase()}] ${acc.description}`);
    sections.push("");

    const mappings = getAccommodationMappings(acc.description);
    for (const mapping of mappings) {
      sections.push(`**${mapping.activity}** (${mapping.timing})`);
      sections.push(`> ${mapping.implementation}`);
      sections.push("");
    }
  }

  // Modifications
  sections.push("## Modifications Matrix");
  sections.push("");
  for (const mod of iep.modifications) {
    sections.push(`### [${mod.category.toUpperCase()}] ${mod.description}`);
    sections.push("");

    const mappings = getModificationMappings(mod.description);
    for (const mapping of mappings) {
      sections.push(`**${mapping.activity}** (${mapping.timing})`);
      sections.push(`> ${mapping.implementation}`);
      sections.push("");
    }
  }

  // Self-regulation checkpoints
  if (input.include_self_regulation_checkpoints) {
    sections.push("## Proactive Self-Regulation Checkpoints");
    sections.push(
      "Based on Jasmine's pattern of academic frustration leading to shutdown, schedule these check-ins BEFORE she is likely to disengage:"
    );
    sections.push("");

    const checkpoints = [
      {
        time: "Minute 5 (End of Intro)",
        trigger: "Transition from whole-class intro to reading",
        action:
          'Quick 1:1 check-in: "Jasmine, before we start reading, let\'s look at the vocabulary words together. Which ones do you already know?" This grounds her in familiar content before unfamiliar text.',
      },
      {
        time: "Minute 10 (During Whole-Class Reading, Paras 1-2)",
        trigger:
          "After first Think & Share question -- this is when she may feel overwhelmed by the dense paragraph 2 bullet list",
        action:
          'Proximity check: Move near Jasmine\'s seat. Whisper: "You\'re doing great following along. Remember you can use your reference sheet if the bullet points feel like a lot." Offer her a brief movement break if she shows signs of disengagement (head lowering, fidgeting).',
      },
      {
        time: "Minute 15 (Transition to Partner Reading)",
        trigger:
          "Partner reading of paragraphs 3-7 -- she may disengage if partner reads too fast or she can't follow",
        action:
          'Pair her with a patient, supportive peer. Before they start: "Jasmine, your job is to find where Lowe talks about what he DOES as part of Newcastle\'s community. Circle those actions." This gives her a concrete, achievable task within the reading.',
      },
      {
        time: "Minute 22 (Start of Independent Practice)",
        trigger:
          "HIGHEST RISK POINT: Transition to independent work with 4 MC questions and a short answer. This is where shutdown is most likely.",
        action:
          'Before independent work begins, 1:1 check-in: "Jasmine, you have 4 multiple choice questions and a writing prompt. Let\'s start with the multiple choice -- they\'re about what we just read together. You can look back at the text anytime." Provide her modified question sheet with paragraph references. Check back after 5 minutes.',
      },
      {
        time: "Minute 32 (Mid-Independent Practice)",
        trigger:
          "10 minutes into independent work -- stamina check. If she has low reading and writing stamina, this is when it fades.",
        action:
          'Scheduled break: "Jasmine, take a 2-minute break. Get some water or do a stretch. When you come back, you just need to finish the writing prompt." Offer the graphic organizer for the short answer if she hasn\'t started it yet.',
      },
      {
        time: "Minute 40 (Discussion Transition)",
        trigger:
          "Transition to student-led discussion -- this could be energizing (she likes peer interaction) or overwhelming",
        action:
          'Pair with a peer she\'s comfortable with. Give her the first discussion question to look at 30 seconds before everyone starts: "Think about Riverstone Prep as a community. What\'s something courteous people do here?" This connects to her personal experience and lets her prep a response.',
      },
    ];

    for (const cp of checkpoints) {
      sections.push(`**${cp.time}**`);
      sections.push(`*Trigger:* ${cp.trigger}`);
      sections.push(`*Action:* ${cp.action}`);
      sections.push("");
    }
  }

  // Services coordination note
  sections.push("## SE Teacher Coordination");
  sections.push(
    "Jasmine receives daily ELA direct service from the SE teacher (55 min) in the general education classroom."
  );
  sections.push(
    "The SE teacher should be present for this lesson and can:"
  );
  sections.push(
    "- Lead the 1:1 check-ins at the self-regulation checkpoints above"
  );
  sections.push(
    "- Sit near Jasmine during whole-class reading to provide proximity support"
  );
  sections.push(
    "- Pull Jasmine for small-group support during Independent Practice if she begins to shut down"
  );
  sections.push(
    "- Pre-teach vocabulary before the lesson if possible (use the 10-min weekly academic support consultation)"
  );

  return sections.join("\n");
}

interface ActivityMapping {
  activity: string;
  timing: string;
  implementation: string;
}

function getAccommodationMappings(
  accommodation: string
): ActivityMapping[] {
  // These mappings are specific to the community lesson structure
  const mappings: Record<string, ActivityMapping[]> = {
    "Repeat directions": [
      {
        activity: "Intro Slide Deck",
        timing: "Min 0-5",
        implementation:
          "After presenting the Purpose for Reading, restate it simply: 'Today we're reading about what makes a community. Our job is to figure out Lowe's definition.'",
      },
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Before each question type (Think & Share, Write, Turn & Talk), restate what students should do: 'For this one, talk to your partner about...' Confirm Jasmine is following by using a discreet proximity check (stand near her desk, glance at her paper) rather than asking her to repeat back publicly, which can single her out.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "Before releasing students, restate: 'You have 4 multiple choice questions and 1 writing prompt. You CAN look back at the text. Start with the multiple choice.' Walk to Jasmine and repeat these directions 1:1.",
      },
    ],
    "Reminders to pause, plan, proceed": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Before each written response question (DR-1B, DR-2A, DR-3B), cue Jasmine: 'Pause -- what is the question asking? Plan -- where in the text will you find the answer? Proceed -- write your answer.' Provide a small laminated 'Pause, Plan, Proceed' card at her desk.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "For the short answer prompt, model the process: 'Pause -- the question asks what Lowe means by identity-forming narrative. Plan -- paragraphs 3, 4, and 9 explain this. Proceed -- write your claim first.'",
      },
    ],
    "Copy of teacher's notes": [
      {
        activity: "Intro Slide Deck",
        timing: "Min 0-5",
        implementation:
          "Provide Jasmine with a printed copy of the lesson overview including the Purpose for Reading, vocabulary words with definitions, and the reading schedule (which paragraphs are whole-class, partner, independent).",
      },
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Give Jasmine the teacher copy's sample answers for the During Reading Questions. She can use these as a reference AFTER attempting each question. This prevents her from copying but gives her a check on her understanding.",
      },
    ],
    "Reference sheets, graphic organizers, and checklists": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Provide a graphic organizer for the paragraph 2 bullet list: a table with two columns -- 'Trait of Community' and 'How Lowe Tests It in Para 8' -- with the 6 traits pre-filled in the left column. Jasmine fills in the right column as she reads paragraph 8.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "For the short answer prompt, provide a structured writing checklist: (1) Write a claim answering the question, (2) Find evidence in paragraph 4 or 9, (3) Explain how the evidence connects to your claim. Also provide the Self-Checklist from the lesson enlarged and on a separate card.",
      },
    ],
    "Extra time": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Allow Jasmine to skip optional question DR-1B (marked with asterisk) to stay on pace. If she's behind on written responses, she can complete them during Independent Practice after finishing the MC questions.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "If Jasmine needs more than 20 minutes, she can continue the short answer prompt during the Discussion activity (partner can discuss while she finishes writing). Target: complete MC questions in 8-10 minutes, leaving 10-12 minutes for writing.",
      },
    ],
    "Frequent breaks": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Offer a 1-minute movement break after completing the paragraph 1-2 questions (approximately minute 10). Can be as simple as standing, stretching, or getting water.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "Schedule a 2-minute break at the transition between MC questions and the short answer prompt (approximately minute 30). This is a natural stopping point and prevents stamina-related shutdown.",
      },
    ],
    "1:1 check ins": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "SE teacher checks in after paragraphs 1-2 questions and again during partner reading (paragraphs 3-7). Focus on comprehension: 'What has Lowe said so far about community?' If Jasmine can't summarize, re-read paragraph 3's definition together.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "Check in after Jasmine completes MC questions (before starting short answer). Review her MC answers together -- if she got Q1 or Q2 wrong, guide her back to the relevant paragraph to self-correct before starting the writing prompt.",
      },
    ],
    "Scheduled breaks": [
      {
        activity: "Full Lesson",
        timing: "Min 0-45",
        implementation:
          "Two scheduled breaks: (1) After During Reading Questions at minute 20 before Independent Practice, (2) After MC questions at approximately minute 30 before the short answer. Mark these on Jasmine's task checklist so she can see the breaks coming -- knowing a break is ahead helps sustain focus.",
      },
    ],
    "Reminder to remain engaged": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "Use proximity (SE teacher or gen ed teacher near Jasmine's desk). Nonverbal cues: gentle tap on desk, point to the current paragraph. If she puts her head down, wait 10 seconds, then whisper: 'Jasmine, we're on paragraph [X]. Can you follow along with your finger?'",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "Check body language every 3-4 minutes. If Jasmine appears to disengage, offer a choice: 'Would you like to keep working here, or would it help to move to the small table with [SE teacher]?' Preserve her autonomy while offering support.",
      },
    ],
    "Small group (as needed)": [
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "During partner reading (paragraphs 3-7), SE teacher can pull Jasmine and 1-2 other students for a small group read. Pre-read paragraph 3's definition before the class gets there. Define 'identity-forming narrative' in student-friendly language: 'a shared story that becomes part of who you are.'",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "If Jasmine begins to shut down during independent work, SE teacher pulls her to a small group of 2-3 students. Work through MC questions together (not giving answers, but re-reading relevant paragraphs aloud). Then co-construct the short answer using the graphic organizer.",
      },
    ],
    "Sit in the front of the room": [
      {
        activity: "Full Lesson",
        timing: "Min 0-45",
        implementation:
          "Ensure Jasmine is seated in the front row, ideally near the SE teacher's circulation path. During whole-class reading, she should be close enough to see the projected text and hear clearly. Front seating also makes nonverbal engagement cues easier.",
      },
    ],
  };

  return mappings[accommodation] || [
    {
      activity: "Full Lesson",
      timing: "Min 0-45",
      implementation: `Implement "${accommodation}" throughout the lesson as appropriate for each activity.`,
    },
  ];
}

function getModificationMappings(
  modification: string
): ActivityMapping[] {
  const mappings: Record<string, ActivityMapping[]> = {
    "Multimodal instruction": [
      {
        activity: "Intro Slide Deck",
        timing: "Min 0-5",
        implementation:
          "Pair the visual slide deck with a brief verbal preview: 'This article is about what makes a community different from just a group of people. The author says it's about a shared STORY.' Write 'community = shared story' on the board.",
      },
      {
        activity: "During Reading",
        timing: "Min 5-20",
        implementation:
          "For the Newcastle example (paragraphs 5-7): Have students watch a 1-minute clip of a Newcastle football match crowd (shows the community feeling visually). Or: draw a simple web on the board showing Lowe's connections to Newcastle (pride, accent, events, future). Jasmine can reference the visual web instead of re-reading paragraphs.",
      },
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "Read MC questions aloud as a class before releasing students to work independently. For the short answer, allow Jasmine to first verbally explain her answer to the SE teacher, then write it down -- she comprehends better verbally in 1:1 settings.",
      },
    ],
    "Inclusion support": [
      {
        activity: "Full Lesson",
        timing: "Min 0-45",
        implementation:
          "SE teacher co-facilitates the lesson: leads vocabulary pre-teach, monitors Jasmine during whole-class reading, facilitates small group during partner reading, provides 1:1 support during independent practice. Both teachers circulate during discussion.",
      },
    ],
    "Small group pull-outs when appropriate": [
      {
        activity: "Independent Practice",
        timing: "Min 20-40",
        implementation:
          "If Jasmine shows signs of shutdown during independent practice, SE teacher pulls her and 1-2 other IEP students to a small table. Read MC questions aloud, discuss answer choices, then tackle the short answer with the graphic organizer. This is the most likely pull-out point in this lesson.",
      },
    ],
  };

  return mappings[modification] || [
    {
      activity: "Full Lesson",
      timing: "Min 0-45",
      implementation: `Implement "${modification}" throughout the lesson as appropriate.`,
    },
  ];
}
