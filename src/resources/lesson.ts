/**
 * MCP Resources for lesson/curriculum data.
 *
 * The lesson is decomposed into focused resources that mirror how
 * a teacher thinks about a lesson: overview first, then specific
 * components (text, questions, activities) as needed.
 *
 * Resource URI scheme: lesson://community-belonging/{section}
 */

import { communityLesson } from "../data/lesson-structured.js";

export function getLessonResourceList() {
  return [
    {
      uri: "lesson://community-belonging/overview",
      name: "Lesson Overview: What is Community?",
      description:
        "Lesson metadata including title, standards (RI.7.2), skill focus (central idea), unit context, duration (45 min), activities breakdown, teacher notes, and facilitation options. Read this first to understand the lesson structure.",
      mimeType: "application/json",
    },
    {
      uri: "lesson://community-belonging/text",
      name: "Reading Text: Full Article",
      description:
        "The complete text students will read: 'What is Community and why is it important?' by Toby Lowe. 11 paragraphs about defining community as a shared identity-forming narrative. Includes vocabulary footnotes.",
      mimeType: "text/plain",
    },
    {
      uri: "lesson://community-belonging/questions",
      name: "All Lesson Questions",
      description:
        "All questions from the lesson: 8 during-reading questions (Think & Share, Write, Turn & Talk, Find Evidence), 4 multiple-choice comprehension questions, 1 short answer prompt, and 3 discussion questions. Includes teacher-copy sample answers.",
      mimeType: "application/json",
    },
    {
      uri: "lesson://community-belonging/activities",
      name: "Lesson Activities Sequence",
      description:
        "The 4 lesson activities in order: Intro (5 min, whole-class), During Reading (15 min, mixed modality), Independent Practice (20 min, independent), Student-Led Discussion (5 min, partner). Includes timing, modalities, and descriptions.",
      mimeType: "application/json",
    },
    {
      uri: "lesson://community-belonging/vocabulary",
      name: "Lesson Vocabulary",
      description:
        "8 vocabulary words with pronunciations and definitions: Aspect, Moral, Narrative, Specific, Solidarity, Dispersed, Manifestation, Essence.",
      mimeType: "application/json",
    },
    {
      uri: "lesson://community-belonging/full",
      name: "Complete Lesson Plan",
      description:
        "All lesson data combined: metadata, full text, all questions with answers, activities, vocabulary, teacher notes, and facilitation options.",
      mimeType: "application/json",
    },
  ];
}

export function readLessonResource(uri: string): string {
  const lesson = communityLesson;

  switch (uri) {
    case "lesson://community-belonging/overview":
      return JSON.stringify(
        {
          metadata: lesson.metadata,
          activities: lesson.activities.map((a) => ({
            name: a.name,
            duration: a.duration,
            readingModality: a.readingModality,
            description: a.description,
          })),
          teacherNotes: lesson.teacherNotes,
          facilitationOptions: lesson.facilitationOptions,
        },
        null,
        2
      );

    case "lesson://community-belonging/text":
      return lesson.textContent;

    case "lesson://community-belonging/questions":
      return JSON.stringify(lesson.questions, null, 2);

    case "lesson://community-belonging/activities":
      return JSON.stringify(lesson.activities, null, 2);

    case "lesson://community-belonging/vocabulary":
      return JSON.stringify(lesson.vocabulary, null, 2);

    case "lesson://community-belonging/full":
      return JSON.stringify(lesson, null, 2);

    default:
      throw new Error(`Unknown lesson resource: ${uri}`);
  }
}
