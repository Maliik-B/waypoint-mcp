#!/usr/bin/env npx tsx
/**
 * Demo script: Shows example output from the Waypoint MCP tools.
 *
 * Run with: npm run demo
 *
 * This lets evaluators see tool output quality without configuring
 * Claude Desktop. Each section shows what a teacher would receive
 * when using the tool.
 */

import { generatePrepSummary } from "./src/tools/prep-summary.js";
import { checkCompliance } from "./src/tools/check-compliance.js";
import { exportMaterials } from "./src/tools/export-materials.js";
import { generateSubCard } from "./src/tools/sub-card.js";
import { scaffoldQuestion } from "./src/tools/scaffold-questions.js";
import { generateTakeHome } from "./src/tools/take-home.js";

const DIVIDER = "\n" + "=".repeat(70) + "\n";
const SECTION = (n: number, title: string) =>
  `${DIVIDER}  DEMO ${n}/6: ${title}${DIVIDER}`;

console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                   WAYPOINT IEP DIFFERENTIATION                     ║
║                        Tool Demo Output                            ║
╠══════════════════════════════════════════════════════════════════════╣
║  Student: Jasmine Bailey (7th grade, Health Impairment)            ║
║  Lesson:  "What is Community?" by Toby Lowe (45 min ELA)          ║
║  IEP:     11 accommodations, 3 modifications, 3 goals             ║
║                                                                    ║
║  This demo shows 6 of the 10 tools. Each produces output that a   ║
║  teacher can use immediately, without further editing.             ║
╚══════════════════════════════════════════════════════════════════════╝
`);

// 1. Teacher Prep Summary
console.log(SECTION(1, "Teacher Prep Summary (generate_teacher_prep_summary)"));
console.log("A one-page 'before class' reference. Print it and tape it to the lesson binder.\n");
console.log(generatePrepSummary({} as any));

// 2. Compliance Check
console.log(SECTION(2, "IEP Compliance Check (check_accommodation_compliance)"));
console.log("Verifies the lesson covers all legally mandated accommodations.\n");
console.log(checkCompliance({} as any));

// 3. Student Materials
console.log(SECTION(3, "Student Materials Packet (export_printable_materials)"));
console.log("A print-ready packet for Jasmine. No answer keys -- clean handouts for photocopying.\n");
console.log(exportMaterials({ mode: "student" } as any));

// 4. Scaffolded Question
console.log(SECTION(4, "Scaffolded Short Answer (scaffold_question)"));
console.log("The hardest question, scaffolded to Jasmine's Grade 3 reading level.\n");
console.log(scaffoldQuestion({
  question_id: "SA-1",
  scaffolding_level: "moderate",
  mode: "student",
} as any));

// 5. Take-Home
console.log(SECTION(5, "Take-Home Form (generate_take_home)"));
console.log("If Jasmine doesn't finish SA-1 in class, this goes home with a parent note.\n");
console.log(generateTakeHome({ unfinished_items: ["SA-1"] } as any));

// 6. Substitute Teacher Card
console.log(SECTION(6, "Substitute Teacher Card (generate_sub_card)"));
console.log("Left in the sub folder. A sub can read this in 2 minutes and know what to do.\n");
console.log(generateSubCard({} as any));

console.log(DIVIDER);
console.log("  All 10 tools are available via MCP when connected to Claude Desktop.");
console.log("  See README.md for the full list and architecture explanation.");
console.log(DIVIDER);
