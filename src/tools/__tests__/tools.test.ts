/**
 * Smoke tests for all 9 Waypoint MCP tools.
 *
 * Each test verifies:
 * 1. The tool runs without throwing
 * 2. Output contains expected section headers / content markers
 * 3. Output references the correct student and lesson
 * 4. No generic fallback text appears where specific mappings should exist
 *
 * Tests call functions with partial params (cast as any) to verify that
 * Zod schema parsing applies defaults correctly — this mirrors how the
 * MCP server calls tools when Claude omits optional parameters.
 */

import { describe, it, expect } from "vitest";
import { generateModifications } from "../generate-modifications.js";
import { matchAccommodations } from "../match-accommodations.js";
import { scaffoldQuestion } from "../scaffold-questions.js";
import { checkCompliance } from "../check-compliance.js";
import { generatePrepSummary } from "../prep-summary.js";
import { exportMaterials } from "../export-materials.js";
import { generateProgressDataSheet } from "../progress-collector.js";
import { generateTakeHome } from "../take-home.js";
import { generateClassroomSummary } from "../classroom-summary.js";
import { generateSubCard } from "../sub-card.js";

describe("generate_lesson_modifications", () => {
  it("produces UDL-organized modifications for the full lesson", () => {
    const result = generateModifications({ activity_name: "full-lesson" } as any);
    expect(result).toContain("Jasmine Bailey");
    expect(result).toContain("Community");
    expect(result).toContain("Engagement");
    expect(result).toContain("Representation");
    expect(result).toContain("Action & Expression");
    expect(result).toContain("Grade 3");
    expect(result).toContain("Lesson 1 of 8");
  });

  it("produces modifications for a single activity", () => {
    const result = generateModifications({ activity_name: "during-reading" } as any);
    expect(result).toContain("During Reading");
    expect(result).toContain("Jasmine Bailey");
  });

  it("accepts optional focus_areas", () => {
    const result = generateModifications({
      activity_name: "full-lesson",
      focus_areas: ["engagement", "self-regulation"],
    } as any);
    expect(result).toContain("Engagement");
    expect(result).toContain("Self-Regulation");
  });
});

describe("match_accommodations", () => {
  it("maps all 11 accommodations to specific lesson moments", () => {
    const result = matchAccommodations({} as any);
    expect(result).toContain("Accommodation-Activity Matrix");
    expect(result).toContain("Repeat directions");
    expect(result).toContain("Reminders to pause, plan, proceed");
    expect(result).toContain("1:1 check-ins");
    expect(result).toContain("Scheduled breaks");
    expect(result).toContain("Sit in the front of the room");
    // Should NOT contain generic fallback for any mapped accommodation
    expect(result).not.toContain(
      "throughout the lesson as appropriate for each activity"
    );
  });

  it("includes self-regulation checkpoints by default", () => {
    const result = matchAccommodations({} as any);
    expect(result).toContain("Self-Regulation Checkpoints");
    expect(result).toContain("Minute 22");
    expect(result).toContain("HIGHEST RISK POINT");
  });

  it("excludes self-regulation checkpoints when disabled", () => {
    const result = matchAccommodations({
      include_self_regulation_checkpoints: false,
    });
    expect(result).not.toContain("Self-Regulation Checkpoints");
  });

  it("includes SE Teacher Coordination section", () => {
    const result = matchAccommodations({} as any);
    expect(result).toContain("SE Teacher Coordination");
    expect(result).toContain("daily ELA direct service");
  });
});

describe("scaffold_question", () => {
  it("scaffolds SA-1 at moderate level with teacher hints", () => {
    const result = scaffoldQuestion({
      question_id: "SA-1",
      scaffolding_level: "moderate",
      mode: "teacher",
    });
    expect(result).toContain("SA-1");
    expect(result).toContain("identity-forming narrative");
    expect(result).toContain("Sentence starter");
    expect(result).toContain("Expected");
  });

  it("scaffolds SA-1 in student mode without answer hints", () => {
    const result = scaffoldQuestion({
      question_id: "SA-1",
      mode: "student",
    } as any);
    expect(result).toContain("SA-1");
    expect(result).toContain("Student Handout");
    expect(result).not.toContain("Expected answer");
    expect(result).not.toContain("Expected direction");
  });

  it("scaffolds MC questions", () => {
    const result = scaffoldQuestion({ question_id: "MC-1" } as any);
    expect(result).toContain("MC-1");
    expect(result).toContain("Multiple Choice");
  });

  it("scaffolds all questions with 'all'", () => {
    const result = scaffoldQuestion({ question_id: "all" } as any);
    expect(result).toContain("DR-1A");
    expect(result).toContain("MC-1");
    expect(result).toContain("SA-1");
    expect(result).toContain("DISC-1");
  });

  it("defaults to moderate level and teacher mode", () => {
    const result = scaffoldQuestion({ question_id: "MC-3" } as any);
    expect(result).toContain("moderate");
    expect(result).toContain("Teacher Edition");
  });
});

describe("check_accommodation_compliance", () => {
  it("produces compliance matrix with ratings", () => {
    const result = checkCompliance({} as any);
    expect(result).toContain("Compliance Check");
    expect(result).toContain("YES");
    expect(result).toContain("PARTIAL");
    expect(result).toContain("NEEDS PLAN");
  });

  it("includes MCAS testing accommodation cross-reference", () => {
    const result = checkCompliance({} as any);
    expect(result).toContain("MCAS");
    expect(result).toContain("DF1");
    expect(result).toContain("DF3");
    expect(result).toContain("A9");
  });

  it("includes IEP goal alignment", () => {
    const result = checkCompliance({} as any);
    expect(result).toContain("ELA Goal");
    expect(result).toContain("Self-Regulation Goal");
  });

  it("includes risk assessment", () => {
    const result = checkCompliance({} as any);
    expect(result).toContain("High-Risk Moments");
    expect(result).toContain("Independent Practice");
  });
});

describe("generate_teacher_prep_summary", () => {
  it("produces a one-page prep summary", () => {
    const result = generatePrepSummary({} as any);
    expect(result).toContain("Teacher Prep Summary");
    expect(result).toContain("Jasmine at a Glance");
    expect(result).toContain("3 Things to Remember");
    expect(result).toContain("Materials to Prepare");
    expect(result).toContain("Early Warning Signs");
    expect(result).toContain("IEP Data to Collect");
  });

  it("includes case manager name", () => {
    const result = generatePrepSummary({} as any);
    expect(result).toContain("Marisol Gutierrez-Stone");
  });

  it("includes lesson timeline with risk levels", () => {
    const result = generatePrepSummary({} as any);
    expect(result).toContain("HIGH");
    expect(result).toContain("MEDIUM");
    expect(result).toContain("LOW");
  });
});

describe("export_printable_materials", () => {
  it("produces student materials without answers", () => {
    const result = exportMaterials({ mode: "student" } as any);
    expect(result).toContain("Printable Materials Pack");
    expect(result).toContain("Graphic Organizer");
    expect(result).toContain("Writing Scaffold");
    expect(result).toContain("Schedule Card");
    expect(result).toContain("Pause, Plan, Proceed");
    expect(result).toContain("Vocabulary Reference");
    expect(result).not.toContain("Teacher Cheat Sheet");
  });

  it("produces teacher materials with answer keys", () => {
    const result = exportMaterials({ mode: "teacher" } as any);
    expect(result).toContain("Teacher Cheat Sheet");
    expect(result).toContain("MC Answer Key");
  });

  it("uses defaults when called with empty params", () => {
    const result = exportMaterials({} as any);
    expect(result).toContain("Printable Materials Pack");
    expect(result).toContain("Graphic Organizer");
  });

  it("supports selective material inclusion", () => {
    const result = exportMaterials({
      include: ["vocabulary-reference"],
      mode: "student",
    });
    expect(result).toContain("Vocabulary Reference");
    expect(result).not.toContain("Graphic Organizer");
    expect(result).not.toContain("Schedule Card");
  });
});

describe("generate_progress_data_sheet", () => {
  it("produces progress data collection form", () => {
    const result = generateProgressDataSheet({} as any);
    expect(result).toContain("Progress Data Collection");
    expect(result).toContain("ELA");
    expect(result).toContain("Self-Regulation");
    expect(result).toContain("Benchmark");
  });

  it("includes correct MC answer key from lesson data", () => {
    const result = generateProgressDataSheet({} as any);
    // MC-1 = D, MC-2 = C, MC-3 = B, MC-4 = C
    expect(result).toContain("| MC-1 | _____ | D |");
    expect(result).toContain("| MC-2 | _____ | C |");
    expect(result).toContain("| MC-3 | _____ | B |");
    expect(result).toContain("| MC-4 | _____ | C |");
  });

  it("includes frustration event log", () => {
    const result = generateProgressDataSheet({} as any);
    expect(result).toContain("Frustration");
    expect(result).toContain("Trigger");
    expect(result).toContain("Re-engage");
  });

  it("uses defaults when called with empty params", () => {
    const result = generateProgressDataSheet({} as any);
    expect(result).toContain("ELA");
    expect(result).toContain("Self-Regulation");
  });
});

describe("generate_take_home", () => {
  it("produces take-home for SA-1", () => {
    const result = generateTakeHome({ unfinished_items: ["SA-1"] } as any);
    expect(result).toContain("Take-Home");
    expect(result).toContain("Jasmine Bailey");
    expect(result).toContain("identity-forming narrative");
    expect(result).toContain("Sentence Starter");
  });

  it("includes parent note by default", () => {
    const result = generateTakeHome({ unfinished_items: ["SA-1"] } as any);
    expect(result).toContain("Parent/Guardian");
    expect(result).toContain("How you can help");
  });

  it("excludes parent note when disabled", () => {
    const result = generateTakeHome({
      unfinished_items: ["SA-1"],
      include_parent_note: false,
    } as any);
    expect(result).not.toContain("Parent/Guardian");
  });

  it("includes text excerpts so student doesn't need full article", () => {
    const result = generateTakeHome({ unfinished_items: ["SA-1"] } as any);
    expect(result).toContain("Text You Need");
  });

  it("includes encouragement footer", () => {
    const result = generateTakeHome({ unfinished_items: ["SA-1"] } as any);
    expect(result).toContain("good work");
  });

  it("handles multiple unfinished items", () => {
    const result = generateTakeHome({
      unfinished_items: ["SA-1", "MC-4"],
    } as any);
    expect(result).toContain("SA-1");
    expect(result).toContain("MC-4");
  });
});

describe("generate_classroom_summary", () => {
  it("produces classroom-at-a-glance with all sections", () => {
    const result = generateClassroomSummary({} as any);
    expect(result).toContain("Classroom-at-a-Glance");
    expect(result).toContain("Student Snapshots");
    expect(result).toContain("Accommodation Matrix");
    expect(result).toContain("Materials Preparation");
    expect(result).toContain("Priority Timeline");
    expect(result).toContain("Teacher Coordination");
    expect(result).toContain("Decision Tree");
  });

  it("shows SE and gen ed teacher roles", () => {
    const result = generateClassroomSummary({} as any);
    expect(result).toContain("SE Teacher Role");
    expect(result).toContain("Gen Ed Teacher Role");
  });

  it("supports focused views", () => {
    const timeline = generateClassroomSummary({ focus: "timeline" });
    expect(timeline).toContain("Priority Timeline");
    expect(timeline).not.toContain("Accommodation Matrix");

    const materials = generateClassroomSummary({ focus: "materials" });
    expect(materials).toContain("Materials Preparation");
    expect(materials).not.toContain("Priority Timeline");
  });

  it("includes end-of-lesson decision tree", () => {
    const result = generateClassroomSummary({} as any);
    expect(result).toContain("Completed MC + SA");
    expect(result).toContain("Shutdown");
    expect(result).toContain("take-home");
  });
});

describe("generate_sub_card", () => {
  it("produces a substitute teacher card", () => {
    const result = generateSubCard({} as any);
    expect(result).toContain("Substitute Teacher Card");
    expect(result).toContain("Jasmine Bailey");
    expect(result).toContain("The One Thing to Know");
    expect(result).toContain("What She Needs");
    expect(result).toContain("If She Shuts Down");
    expect(result).toContain("What Works");
  });

  it("emphasizes this is not defiance", () => {
    const result = generateSubCard({} as any);
    expect(result).toContain("not defiance");
  });

  it("includes lesson-specific notes by default", () => {
    const result = generateSubCard({} as any);
    expect(result).toContain("Today's Lesson Notes");
    expect(result).toContain("HIGHEST RISK");
    expect(result).toContain("Materials in Her Folder");
  });

  it("excludes lesson notes when disabled", () => {
    const result = generateSubCard({ include_lesson_specifics: false });
    expect(result).not.toContain("Today's Lesson Notes");
    expect(result).toContain("The One Thing to Know");
  });
});
