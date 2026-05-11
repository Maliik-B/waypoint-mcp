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
import { scaffoldQuestion } from "./src/tools/scaffold-questions.js";

// ── Terminal formatting ─────────────────────────────────────────────

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const WHITE = "\x1b[37m";
const BG_BLUE = "\x1b[44m";
const UNDERLINE = "\x1b[4m";

// Match the 110-column terminal we configured
const WIDTH = 100;
const LINE = DIM + "─".repeat(WIDTH) + RESET;
const DOUBLE_LINE = DIM + "═".repeat(WIDTH) + RESET;

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");

// ── Timing ──────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const PAUSE = "\x00PAUSE\x00";
const LONG_PAUSE = "\x00LONGPAUSE\x00";

// ── Layout helpers ──────────────────────────────────────────────────

function banner(lines: string[]) {
  console.log();
  console.log(DOUBLE_LINE);
  for (const line of lines) {
    console.log(`${BOLD}${CYAN}  ${line}${RESET}`);
  }
  console.log(DOUBLE_LINE);
  console.log();
}

async function sectionHeader(n: number, title: string, description: string) {
  console.log();
  console.log();
  console.log(LINE);
  await sleep(100);
  console.log(`${BOLD}${BG_BLUE}${WHITE}  ${n}/4  ${title}  ${RESET}`);
  await sleep(100);
  console.log(`${DIM}  ${description}${RESET}`);
  await sleep(100);
  console.log(LINE);
  console.log();
  await sleep(500);
}

/**
 * Word-wrap a single line of text to fit within maxWidth.
 * Preserves leading indent and adds 2-space continuation indent.
 * Handles ANSI codes in length measurement.
 */
function wordWrap(text: string, maxWidth: number): string[] {
  const visible = stripAnsi(text);
  if (visible.length <= maxWidth) return [text];

  const indentMatch = visible.match(/^(\s*)/);
  const indent = indentMatch ? indentMatch[1] : "";
  const contIndent = indent + "  ";

  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (stripAnsi(test).length > maxWidth && current) {
      lines.push(current);
      current = contIndent + word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Apply inline markdown formatting (bold, italic) to a string.
 */
function inlineFormat(text: string): string {
  let out = text;
  out = out.replace(/\*\*(.+?)\*\*/g, `${BOLD}$1${RESET}`);
  out = out.replace(/\*(.+?)\*/g, `${DIM}$1${RESET}`);
  return out;
}

// ── Table formatter ─────────────────────────────────────────────────

function formatTable(tableLines: string[]): string[] {
  const rows = tableLines
    .filter((l) => !l.trim().match(/^\|[\s\-:|]+\|$/))
    .map((l) =>
      l.split("|").slice(1, -1).map((c) => c.trim())
    );

  if (rows.length === 0) return [];

  const colCount = rows[0].length;
  const INDENT = 4;
  const BORDERS = colCount + 1;
  const CELL_PAD = colCount * 2;
  const available = WIDTH - INDENT - BORDERS - CELL_PAD;

  // Natural widths from content
  const naturalWidths: number[] = [];
  for (let c = 0; c < colCount; c++) {
    naturalWidths.push(Math.max(...rows.map((r) => (r[c] || "").length)));
  }

  // Fit columns to available space
  const totalNatural = naturalWidths.reduce((a, b) => a + b, 0);
  const colWidths: number[] = [];
  if (totalNatural <= available) {
    colWidths.push(...naturalWidths);
  } else {
    // Give each column a fair share, minimum 6 chars
    for (const w of naturalWidths) {
      colWidths.push(Math.max(6, Math.floor((w / totalNatural) * available)));
    }
  }

  const ind = " ".repeat(INDENT);
  const output: string[] = [""];

  // Top border
  output.push(
    DIM + ind + "┌" + colWidths.map((w) => "─".repeat(w + 2)).join("┬") + "┐" + RESET
  );

  rows.forEach((row, rowIdx) => {
    const cells = row.map((cell, c) => {
      // Truncate with ellipsis if too long (tables stay single-line per row)
      let text = cell;
      if (text.length > colWidths[c]) {
        text = text.slice(0, colWidths[c] - 1) + "…";
      }
      // Apply bold/italic
      const formatted = inlineFormat(text);
      // ANSI-aware padding
      const visLen = stripAnsi(formatted).length;
      const pad = Math.max(0, colWidths[c] - visLen);
      const padded = formatted + " ".repeat(pad);
      return rowIdx === 0 ? `${BOLD}${padded}${RESET}` : padded;
    });

    output.push(
      DIM + ind + "│" + RESET +
      cells.map((c) => ` ${c} `).join(DIM + "│" + RESET) +
      DIM + "│" + RESET
    );

    if (rowIdx === 0) {
      output.push(
        DIM + ind + "├" + colWidths.map((w) => "─".repeat(w + 2)).join("┼") + "┤" + RESET
      );
    }
  });

  // Bottom border
  output.push(
    DIM + ind + "└" + colWidths.map((w) => "─".repeat(w + 2)).join("┴") + "┘" + RESET
  );
  output.push("");

  return output;
}

// ── Markdown → Terminal converter ───────────────────────────────────

function formatForTerminal(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let i = 0;
  let linesSinceLastPause = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Tables ──
    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      result.push(...formatTable(tableLines));
      result.push(LONG_PAUSE);
      linesSinceLastPause = 0;
      continue;
    }

    // ── H1 ──
    if (line.startsWith("# ")) {
      if (linesSinceLastPause > 0) result.push(PAUSE);
      result.push("");
      result.push(`${BOLD}${CYAN}${UNDERLINE}${line.slice(2)}${RESET}`);
      result.push("");
      linesSinceLastPause = 0;
      i++;
      continue;
    }

    // ── H2 ──
    if (line.startsWith("## ")) {
      if (linesSinceLastPause > 3) result.push(PAUSE);
      result.push("");
      result.push(`${BOLD}${GREEN}${line.slice(3)}${RESET}`);
      result.push("");
      linesSinceLastPause = 0;
      i++;
      continue;
    }

    // ── H3 ──
    if (line.startsWith("### ")) {
      result.push(`  ${BOLD}${YELLOW}${line.slice(4)}${RESET}`);
      i++;
      linesSinceLastPause++;
      continue;
    }

    // ── Process the line ──
    let raw = line;
    let prefix = "";

    // Blockquotes
    if (raw.startsWith("> ")) {
      raw = raw.slice(2);
      prefix = "    ";
    }

    // Inline formatting
    let formatted = inlineFormat(raw);

    // Bullets
    if (formatted.trim().startsWith("- ")) {
      formatted = `  ${formatted.trim()}`;
      prefix = "";
    }

    // Numbered lists
    if (/^\d+\.\s/.test(formatted.trim())) {
      formatted = `  ${formatted.trim()}`;
      prefix = "";
    }

    // Checkboxes
    formatted = formatted.replace(/- \[ \]/g, `  ${DIM}[ ]${RESET}`);
    formatted = formatted.replace(/- \[x\]/g, `  ${GREEN}[x]${RESET}`);

    // Word-wrap to terminal width
    formatted = prefix + formatted;
    const wrapped = wordWrap(formatted, WIDTH);
    for (const wl of wrapped) {
      result.push(wl);
    }
    linesSinceLastPause += wrapped.length;

    // Auto-pause at natural paragraph breaks
    if (linesSinceLastPause >= 8 && formatted.trim() === "") {
      result.push(PAUSE);
      linesSinceLastPause = 0;
    }

    i++;
  }

  return result.join("\n");
}

// ── Paced printer ───────────────────────────────────────────────────

async function printWithPacing(text: string) {
  for (const line of text.split("\n")) {
    if (line === PAUSE) {
      await sleep(800);
      continue;
    }
    if (line === LONG_PAUSE) {
      await sleep(1200);
      continue;
    }
    console.log(line);
    await sleep(30);
  }
}

// ── Run the demo ────────────────────────────────────────────────────

async function main() {
  banner([
    "WAYPOINT IEP DIFFERENTIATION SERVER",
    "",
    "Student:  Jasmine Bailey (7th grade, Health Impairment)",
    'Lesson:   "What is Community?" by Toby Lowe (45 min ELA)',
    "IEP:      11 accommodations, 3 modifications, 3 goals",
    "",
    "10 tools  |  12 resources  |  6 prompts  |  48 tests",
    "TypeScript + Zod  |  Model Context Protocol SDK",
    "",
    "Each tool below produces output a teacher can use immediately.",
  ]);

  await sleep(1500);

  // 1. Teacher Prep Summary
  await sectionHeader(
    1,
    "Teacher Prep Summary",
    "A one-page 'before class' reference. Print it, tape it to the lesson binder."
  );
  await printWithPacing(formatForTerminal(generatePrepSummary({} as any)));

  // 2. Compliance Check
  await sectionHeader(
    2,
    "IEP Compliance Check",
    "Verifies the lesson covers all 11 legally mandated accommodations."
  );
  await printWithPacing(formatForTerminal(checkCompliance({} as any)));

  // 3. Student Materials
  await sectionHeader(
    3,
    "Student Materials Packet",
    "A print-ready packet for Jasmine. No answer keys -- clean handouts for photocopying."
  );
  await printWithPacing(formatForTerminal(exportMaterials({ mode: "student" } as any)));

  // 4. Scaffolded Question
  await sectionHeader(
    4,
    "Scaffolded Short Answer",
    "The hardest question, scaffolded to Jasmine's Grade 3 reading level."
  );
  await printWithPacing(
    formatForTerminal(
      scaffoldQuestion({
        question_id: "SA-1",
        scaffolding_level: "moderate",
        mode: "student",
      } as any)
    )
  );

  // Closing
  await sleep(800);
  console.log();
  console.log(DOUBLE_LINE);
  console.log(
    `${BOLD}${CYAN}  All 10 tools available via MCP when connected to Claude Desktop.${RESET}`
  );
  console.log(
    `${DIM}  See README.md for the full tool list and architecture explanation.${RESET}`
  );
  console.log(
    `${DIM}  github.com/Maliik-B/waypoint-mcp${RESET}`
  );
  console.log(DOUBLE_LINE);
  console.log();
}

main();
