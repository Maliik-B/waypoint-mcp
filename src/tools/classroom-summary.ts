/**
 * Tool: generate_classroom_summary
 *
 * Generates a classroom-at-a-glance view for a teacher managing multiple
 * IEP students in a single lesson. Shows which accommodations overlap,
 * which materials can be shared vs. individualized, and a combined
 * timeline of when each student needs attention.
 *
 * Real-world context: A gen ed teacher may have 3-5 IEP students in
 * one class period. The SE teacher co-teaches but can't be everywhere
 * at once. This tool helps both teachers coordinate by showing:
 * - Where accommodation needs overlap (one material serves multiple students)
 * - Where needs conflict (one student needs quiet, another needs movement)
 * - A priority timeline (who needs support at which minute)
 *
 * Currently demonstrates with Jasmine Bailey. The schema and output
 * structure are designed to accept multiple students when additional
 * IEP data is loaded.
 */

import { z } from "zod";
import { jasmineBaileyIEP } from "../data/iep-structured.js";
import { communityLesson } from "../data/lesson-structured.js";

export const classroomSummarySchema = z.object({
  focus: z
    .enum(["accommodations", "materials", "timeline", "all"])
    .optional()
    .default("all")
    .describe(
      "Which aspect to focus on. 'accommodations' shows overlap matrix, 'materials' shows shared vs. individual materials, 'timeline' shows minute-by-minute priority, 'all' includes everything."
    ),
});

export type ClassroomSummaryInput = z.infer<typeof classroomSummarySchema>;

export function generateClassroomSummary(
  rawInput: ClassroomSummaryInput
): string {
  const input = classroomSummarySchema.parse(rawInput);
  const students = [jasmineBaileyIEP];
  const lesson = communityLesson;
  const showAll = input.focus === "all";

  const sections: string[] = [];

  sections.push("# Classroom-at-a-Glance: IEP Student Summary");
  sections.push(`**Lesson:** ${lesson.metadata.title}`);
  sections.push(
    `**Period:** __________ | **Date:** __________ | **Duration:** ${lesson.metadata.totalDuration}`
  );
  sections.push(
    `**IEP Students in This Class:** ${students.length}`
  );
  sections.push("");

  // Student snapshot cards
  sections.push("## Student Snapshots");
  sections.push("");

  for (const student of students) {
    sections.push(`### ${student.profile.name}`);
    sections.push(
      `**Disability:** ${student.profile.disability} | **Reading:** Grade 3 (iReady) | **Placement:** ${student.placementType?.split("(")[0].trim()}`
    );
    sections.push(
      `**Behavioral pattern:** ${student.profile.challenges[0]}`
    );
    sections.push(
      `**Top motivator:** ${student.profile.motivators[0]}`
    );
    sections.push(
      `**SE Teacher:** ${student.caseManager} (daily 55 min, in classroom)`
    );
    sections.push("");
  }

  // Accommodation overlap matrix
  if (showAll || input.focus === "accommodations") {
    sections.push("## Accommodation Matrix");
    sections.push(
      "*Shows which accommodations each student needs. When multiple students share an accommodation, one preparation step covers all of them.*"
    );
    sections.push("");

    sections.push(
      "| Accommodation | Category | " +
        students.map((s) => s.profile.name).join(" | ") +
        " | Shared? |"
    );
    sections.push(
      "| --- | --- | " + students.map(() => "---").join(" | ") + " | --- |"
    );

    // All unique accommodations across students
    const allAccommodations = new Map<
      string,
      { category: string; students: string[] }
    >();
    for (const student of students) {
      for (const acc of student.accommodations) {
        if (!allAccommodations.has(acc.description)) {
          allAccommodations.set(acc.description, {
            category: acc.category,
            students: [],
          });
        }
        allAccommodations.get(acc.description)!.students.push(
          student.profile.name
        );
      }
    }

    for (const [desc, info] of allAccommodations) {
      const checks = students.map((s) =>
        info.students.includes(s.profile.name) ? "YES" : "--"
      );
      const shared =
        info.students.length > 1 ? `YES (${info.students.length})` : "No";
      sections.push(
        `| ${desc} | ${info.category} | ${checks.join(" | ")} | ${shared} |`
      );
    }
    sections.push("");

    if (students.length === 1) {
      sections.push(
        "*With additional IEP students loaded, this matrix shows accommodation overlaps -- e.g., if both Jasmine and another student need 'Frequent breaks,' one scheduled break benefits both. If one student needs quiet and another needs movement breaks, the timeline flags the conflict.*"
      );
      sections.push("");
    }
  }

  // Materials preparation
  if (showAll || input.focus === "materials") {
    sections.push("## Materials Preparation");
    sections.push(
      "*Materials organized by whether they can be shared across students or need to be individualized.*"
    );
    sections.push("");

    sections.push("### Shared Materials (prepare once, use for all IEP students)");
    sections.push("");
    sections.push(
      "| Material | Benefits | Prep Time |"
    );
    sections.push("| --- | --- | --- |");
    sections.push(
      `| Lesson schedule card | Any student who benefits from predictability | 2 min (photocopy) |`
    );
    sections.push(
      `| Vocabulary reference sheet | Any student below grade-level vocabulary | 2 min (photocopy) |`
    );
    sections.push(
      `| Pause-Plan-Proceed card | Any student with task initiation difficulty | 1 min (laminate once, reuse) |`
    );
    sections.push("");

    sections.push("### Individualized Materials");
    sections.push("");

    for (const student of students) {
      sections.push(`**${student.profile.name}:**`);
      sections.push(
        "- [ ] Graphic organizer for paragraph 2/8 (community traits table)"
      );
      sections.push(
        "- [ ] Writing scaffold for SA-1 (claim/evidence/analysis with sentence starters)"
      );
      sections.push(
        "- [ ] Teacher notes copy (lesson overview with vocabulary and reading schedule)"
      );
      sections.push(
        "- [ ] Modified question sheet with paragraph references for Independent Practice"
      );
      sections.push("");
    }

    sections.push(
      `**Total prep time estimate:** ~10 minutes for ${students.length} student(s)`
    );
    sections.push("");
  }

  // Combined timeline
  if (showAll || input.focus === "timeline") {
    sections.push("## Priority Timeline");
    sections.push(
      "*Minute-by-minute guide showing which student needs attention and why. Helps the SE teacher and gen ed teacher divide responsibility.*"
    );
    sections.push("");

    sections.push(
      "| Time | Activity | Priority Student | What They Need | Who Handles |"
    );
    sections.push("| --- | --- | --- | --- | --- |");

    const timeline = [
      {
        time: "0-5",
        activity: "Intro",
        student: "Jasmine",
        need: "Preview vocabulary 1:1, confirm she knows 'narrative' and 'solidarity'",
        who: "SE Teacher",
      },
      {
        time: "5-10",
        activity: "Reading P1-2",
        student: "Jasmine",
        need: "Proximity support during whole-class reading, confirm directions after each question type",
        who: "SE Teacher (near desk)",
      },
      {
        time: "10-15",
        activity: "Partner Reading P3-7",
        student: "Jasmine",
        need: "Pair with supportive peer, give concrete task: 'Circle what Lowe DOES as part of Newcastle'",
        who: "Gen Ed Teacher (pair setup) + SE Teacher (monitor)",
      },
      {
        time: "15-20",
        activity: "Reading P8",
        student: "Jasmine",
        need: "Hand out graphic organizer, offer 1-min break after",
        who: "SE Teacher",
      },
      {
        time: "20",
        activity: "TRANSITION",
        student: "**Jasmine (HIGH)**",
        need: "1:1 check-in: restate directions, provide modified question sheet, confirm she knows where to start",
        who: "SE Teacher (priority)",
      },
      {
        time: "20-28",
        activity: "MC Questions",
        student: "Jasmine",
        need: "Check in at minute 25. If struggling, read questions aloud",
        who: "SE Teacher or Gen Ed",
      },
      {
        time: "28-30",
        activity: "BREAK",
        student: "Jasmine",
        need: "Scheduled break: water, stretch. Mark progress on schedule card",
        who: "Self-managed",
      },
      {
        time: "30-40",
        activity: "Short Answer",
        student: "**Jasmine (HIGH)**",
        need: "Offer writing scaffold. If shutdown begins, pull to small group. Consider take-home if not started by minute 35",
        who: "SE Teacher (priority)",
      },
      {
        time: "40-45",
        activity: "Discussion",
        student: "Jasmine",
        need: "Pair with comfortable peer, preview first question 30 sec early",
        who: "Gen Ed Teacher",
      },
    ];

    for (const entry of timeline) {
      sections.push(
        `| ${entry.time} | ${entry.activity} | ${entry.student} | ${entry.need} | ${entry.who} |`
      );
    }
    sections.push("");

    if (students.length === 1) {
      sections.push(
        "*With multiple IEP students, this timeline interleaves check-ins so the SE teacher knows exactly who to prioritize at each moment. Conflicts (e.g., two students both need 1:1 support at minute 20) are flagged so the gen ed teacher can cover one while the SE teacher covers the other.*"
      );
      sections.push("");
    }
  }

  // Coordination notes
  sections.push("## Teacher Coordination");
  sections.push("");
  sections.push("### SE Teacher Role");
  sections.push(
    `- **Primary responsibility:** ${students.map((s) => s.profile.name).join(", ")}`
  );
  sections.push(
    "- **Highest-priority moments:** Minute 20 (transition to independent practice) and Minute 30-40 (short answer writing)"
  );
  sections.push(
    "- **Data to collect:** See progress data sheet for IEP goal tracking"
  );
  sections.push("");
  sections.push("### Gen Ed Teacher Role");
  sections.push("- Lead whole-class instruction and reading");
  sections.push(
    "- Set up partner pairings before class (pair IEP students with supportive peers)"
  );
  sections.push(
    "- Cover IEP student check-ins when SE teacher is with another student"
  );
  sections.push(
    "- Circulate during independent practice to monitor all students"
  );
  sections.push("");

  // End-of-lesson decision tree
  sections.push("## End-of-Lesson Decision Tree");
  sections.push("");
  sections.push("For each IEP student, check at minute 40:");
  sections.push("");
  sections.push(
    "1. **Completed MC + SA?** -> Collect work, record scores on progress data sheet"
  );
  sections.push(
    "2. **Completed MC, SA incomplete?** -> Generate take-home form for SA-1 (use `generate_take_home` tool)"
  );
  sections.push(
    "3. **MC incomplete?** -> Student finishes MC during discussion time, SA goes home"
  );
  sections.push(
    "4. **Shutdown during independent practice?** -> Note on progress sheet, prioritize re-engagement over completion. No take-home if student is in distress."
  );

  return sections.join("\n");
}
