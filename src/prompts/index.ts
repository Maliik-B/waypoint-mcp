/**
 * MCP Prompt templates for common teacher workflows.
 *
 * Each prompt represents a real task that a teacher or SE teacher
 * performs regularly. The prompts are designed to produce specific,
 * classroom-ready output without requiring the teacher to know
 * MCP or prompt engineering.
 */

export function getPromptList() {
  return [
    {
      name: "differentiate-lesson",
      description:
        "Generate a complete lesson differentiation plan for a student with an IEP. Produces activity-by-activity modifications grounded in UDL principles, accommodation compliance mapping, scaffolded questions, and self-regulation checkpoints. This is the primary workflow for teachers preparing a lesson.",
      arguments: [
        {
          name: "focus",
          description:
            "Optional: focus on a specific area (e.g., 'reading comprehension', 'writing', 'engagement', 'self-regulation'). If omitted, covers all areas.",
          required: false,
        },
      ],
    },
    {
      name: "accommodation-checklist",
      description:
        "Quick compliance check: verify that every IEP accommodation is addressed in the lesson plan. Produces a checklist with YES/NO/NEEDS PLAN for each accommodation and specific recommendations for gaps. Use this before teaching to ensure legal compliance.",
      arguments: [],
    },
    {
      name: "scaffold-activity",
      description:
        "Generate scaffolded versions of specific lesson questions or activities calibrated to the student's reading level. Produces sentence starters, graphic organizers, chunked sub-questions, and fill-in-the-blank alternatives at light/moderate/intensive levels.",
      arguments: [
        {
          name: "activity",
          description:
            "Which activity to scaffold: 'during-reading', 'independent-practice', 'discussion', or a specific question ID (e.g., 'SA-1').",
          required: true,
        },
        {
          name: "level",
          description:
            "Scaffolding intensity: 'light' (hints only), 'moderate' (sentence starters + organizers), or 'intensive' (fill-in-the-blank). Default: moderate.",
          required: false,
        },
      ],
    },
    {
      name: "behavior-support-plan",
      description:
        "Generate a proactive behavior support plan for this lesson based on the student's self-regulation goal and behavioral patterns. Identifies high-risk moments, prevention strategies, and de-escalation scripts. Especially useful for lessons with extended independent work or challenging text.",
      arguments: [],
    },
    {
      name: "progress-monitoring",
      description:
        "Generate a progress monitoring checklist for this lesson aligned to the student's IEP goals and benchmarks. Identifies which lesson activities provide data for which goals, what to observe, and how to record progress. Helps the SE teacher collect IEP progress data during regular instruction.",
      arguments: [],
    },
  ];
}

export function getPromptMessages(
  name: string,
  args: Record<string, string>
): Array<{ role: "user"; content: { type: "text"; text: string } }> {
  const builders: Record<string, () => string> = {
    "differentiate-lesson": () => buildDifferentiatePrompt(args.focus),
    "accommodation-checklist": () => buildAccommodationChecklistPrompt(),
    "scaffold-activity": () => buildScaffoldPrompt(args.activity, args.level),
    "behavior-support-plan": () => buildBehaviorPlanPrompt(),
    "progress-monitoring": () => buildProgressMonitoringPrompt(),
    "teacher-prep": () => buildTeacherPrepPrompt(),
  };

  const builder = builders[name];
  if (!builder) throw new Error(`Unknown prompt: ${name}`);

  return [
    {
      role: "user" as const,
      content: { type: "text" as const, text: builder() },
    },
  ];
}

function buildDifferentiatePrompt(focus?: string): string {
  const focusLine = focus
    ? `\n\nFocus area: ${focus}. Prioritize modifications in this area but still cover other areas briefly.`
    : "";

  return `I need to differentiate the lesson "What is 'Community' and why is it important?" for Jasmine Bailey, a 7th-grade student with an IEP.

Please use the following tools and resources to generate a comprehensive differentiation plan:

1. First, read the student's IEP profile and present levels to understand her needs (use the iep://jasmine-bailey/profile and iep://jasmine-bailey/present-levels resources).

2. Read the lesson overview and activities (use lesson://community-belonging/overview and lesson://community-belonging/activities resources).

3. Use the generate_lesson_modifications tool with activity_name="full-lesson" to produce modifications for each activity.

4. Use the match_accommodations tool to create the accommodation-activity matrix with self-regulation checkpoints.

5. Use the scaffold_question tool with question_id="SA-1" and scaffolding_level="moderate" to scaffold the short answer prompt (the highest-risk activity for Jasmine).

6. Use the check_accommodation_compliance tool to verify all accommodations are addressed.

Organize the output as a teacher-ready document with:
- A one-paragraph summary of Jasmine's key needs for this lesson
- Activity-by-activity modifications (organized by UDL principle)
- The accommodation compliance checklist
- Scaffolded materials for the short answer prompt
- Self-regulation checkpoint schedule
- SE teacher coordination notes${focusLine}`;
}

function buildAccommodationChecklistPrompt(): string {
  return `I need to quickly verify that my lesson plan for "What is 'Community' and why is it important?" meets all of Jasmine Bailey's IEP accommodations.

Please:
1. Read Jasmine's accommodations (use the iep://jasmine-bailey/accommodations resource)
2. Read the lesson activities (use lesson://community-belonging/activities resource)
3. Use the check_accommodation_compliance tool with include_recommendations=true

Give me a clear YES/NO/NEEDS PLAN checklist I can tape to my lesson plan binder, plus specific action items for any gaps.`;
}

function buildScaffoldPrompt(
  activity: string,
  level?: string
): string {
  const scaffoldLevel = level || "moderate";

  return `I need scaffolded versions of the ${activity} questions/activities from "What is 'Community' and why is it important?" for Jasmine Bailey.

Jasmine reads at a 3rd-grade level (the text is 7th grade) and has an Informational Text Comprehension score of Grade 2. She benefits from graphic organizers and checklists but needs support generalizing skills from 1:1 to independent work.

Please:
1. Read Jasmine's present levels (use iep://jasmine-bailey/present-levels resource)
2. Read the lesson questions (use lesson://community-belonging/questions resource)
3. Use the scaffold_question tool with question_id="${activity}" and scaffolding_level="${scaffoldLevel}"

Make the scaffolds specific to THIS text (paragraphs, vocabulary, examples from the article). Don't give generic scaffolds that could apply to any text.`;
}

function buildBehaviorPlanPrompt(): string {
  return `I need a proactive behavior support plan for Jasmine Bailey during the lesson "What is 'Community' and why is it important?"

Jasmine's pattern: academic frustration -> avoidance (head down, bathroom requests, withdrawal). She has a self-regulation IEP goal to use calming strategies in 4/5 opportunities.

Please:
1. Read Jasmine's profile and present levels (use iep://jasmine-bailey/profile and iep://jasmine-bailey/present-levels)
2. Read her self-regulation goal (use iep://jasmine-bailey/goals)
3. Read the lesson activities (use lesson://community-belonging/activities)
4. Use the match_accommodations tool with include_self_regulation_checkpoints=true

Generate a plan that includes:
- Minute-by-minute risk assessment (when is she most likely to shut down?)
- Prevention strategies (what to do BEFORE she shuts down)
- Intervention scripts (exact words to say when you notice early warning signs)
- De-escalation protocol (if she does shut down, how to help her re-engage)
- Data collection: what to record for her self-regulation IEP goal`;
}

function buildProgressMonitoringPrompt(): string {
  return `I need to collect IEP progress data for Jasmine Bailey during the lesson "What is 'Community' and why is it important?"

Please:
1. Read Jasmine's IEP goals and benchmarks (use iep://jasmine-bailey/goals)
2. Read the lesson activities and questions (use lesson://community-belonging/activities and lesson://community-belonging/questions)
3. Use the generate_lesson_modifications tool with activity_name="full-lesson" and focus_areas=["accommodations"]

Map each IEP goal and benchmark to specific lesson activities where data can be collected:
- Which questions/activities provide evidence for which benchmarks?
- What should the SE teacher observe and record?
- What work samples should be collected?
- How to rate Jasmine's performance on each benchmark during this lesson

Format as a single-page data collection sheet the SE teacher can print and fill out during the lesson.`;
}

function buildTeacherPrepPrompt(): string {
  return `I need a one-page "before class" prep summary for teaching "What is 'Community' and why is it important?" to a class that includes Jasmine Bailey (IEP student).

Please:
1. Read Jasmine's profile and present levels (use iep://jasmine-bailey/profile and iep://jasmine-bailey/present-levels)
2. Read the lesson overview (use lesson://community-belonging/overview)
3. Use the generate_teacher_prep_summary tool with include_materials_list=true

This should be something I can print and tape to my lesson binder. I need to know:
- Quick snapshot of Jasmine's needs (reading level, behavioral pattern)
- The 3 most important things to remember for THIS lesson
- What materials to prepare (with checkboxes)
- A timeline showing when to check in and when risk is highest
- What to watch for and what to do when I see warning signs
- What IEP data to collect during this lesson`;
}
