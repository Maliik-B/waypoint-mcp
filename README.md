# Waypoint IEP Differentiation Server

![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tests](https://img.shields.io/badge/tests-48%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18-blue)
![MCP](https://img.shields.io/badge/MCP-1.0-purple)

An MCP server that helps teachers differentiate instruction for students with Individualized Education Programs (IEPs). Given a lesson and a student's IEP, the server provides Claude with the structured context it needs to produce **specific, actionable instructional modifications** that a teacher can use in the classroom without further editing.

Built for the [Waypoint Learning Challenge](https://github.com/igoldstein19/waypoint-challenge).

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
  - [Data Structuring](#data-structuring-the-key-decision)
  - [Tools](#tools-what-claude-can-do)
  - [Multi-Student Design](#multi-student-design)
  - [Prompts](#prompts-pre-built-workflows)
  - [Trade-offs](#trade-offs)
- [Example Output](#example-output-1-accommodation-activity-matrix-with-self-regulation-checkpoints)
- [Domain Understanding](#domain-understanding)
- [Project Structure](#project-structure)

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run (stdio transport for Claude Desktop)
npm start
```

### See It In Action

```bash
npm run demo
```

This prints output from 6 of the 10 tools so you can see the quality without configuring Claude Desktop.

### Claude Desktop Configuration

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "waypoint-iep": {
      "command": "node",
      "args": ["/absolute/path/to/waypoint-mcp/dist/index.js"]
    }
  }
}
```

Then restart Claude Desktop. The server exposes 12 resources, 10 tools, and 6 prompts.

### Try It

In Claude Desktop, use the `differentiate-lesson` prompt to generate a complete lesson differentiation plan, or ask Claude to call specific tools:

- *"Use the differentiate-lesson prompt to create a full modification plan for Jasmine."*
- *"Check whether this lesson meets all of Jasmine's IEP accommodations."*
- *"Scaffold the short answer question at a moderate level for Jasmine."*

---

## Architecture

```
                         Waypoint MCP Server
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  ┌──────────┐   ┌──────────────┐   ┌─────────────────────┐ │
  │  │ IEP PDF  │──>│  Structured  │──>│  12 MCP Resources   │ │
  │  │ (36 pgs) │   │  TypeScript  │   │  iep://{student}/   │ │
  │  └──────────┘   │  Data Files  │   │  lesson://{lesson}/ │ │
  │                 └──────────────┘   └────────┬────────────┘ │
  │  ┌──────────┐          │                    │              │
  │  │ Lesson   │──────────┘                    ▼              │
  │  │ Plan PDF │              ┌────────────────────────────┐  │
  │  └──────────┘              │     10 Tools (Zod schemas) │  │
  │                            │  ┌─────────────────────┐   │  │
  │                            │  │ scaffold_question    │   │  │
  │                            │  │ match_accommodations │   │  │
  │                            │  │ check_compliance     │   │  │
  │                            │  │ export_materials     │   │  │
  │                            │  │ generate_take_home   │   │  │
  │                            │  │ ...5 more            │   │  │
  │                            │  └─────────────────────┘   │  │
  │                            └─────────────┬──────────────┘  │
  │                                          │                 │
  │                            ┌─────────────▼──────────────┐  │
  │                            │  6 Prompts (workflows)     │  │
  │                            └────────────────────────────┘  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ stdio transport
                                 ▼
                          ┌─────────────┐
                          │   Claude    │──> Classroom-ready
                          │   Desktop   │    Markdown output
                          └─────────────┘
```

### The Core Problem

A teacher with a student who has an IEP faces a specific challenge every day: translate a dense, 20-36 page legal document into concrete changes to *tomorrow's lesson*. This requires reasoning about two complex documents simultaneously (the IEP and the lesson plan), which is exactly what an LLM can do well, if given the right context.

The architecture is designed around one question: **how do you structure IEP and curriculum data so that an LLM can produce modifications that are grounded in BOTH documents, not generic advice?**

### Data Structuring: The Key Decision

#### Why not dump the raw PDF?

The sample IEP is 36 pages. Feeding it all into context creates three problems:
1. **Token waste**: Legal boilerplate, signature pages, transportation forms, and assessment participation tables don't inform instruction
2. **Diluted attention**: The pedagogically critical information (present levels, accommodations, goals) gets buried in form fields
3. **Missing structure**: An LLM can't easily iterate over accommodations or cross-reference goals with lesson activities when they're embedded in unstructured text

#### Semantic decomposition into 5 IEP resources

The IEP is parsed into 5 resources, each serving a distinct reasoning purpose:

| Resource | Contents | When Claude Needs It |
|----------|----------|---------------------|
| `profile` | Strengths, challenges, motivators, student vision | Understanding WHO the student is |
| `present-levels` | Assessment data (iReady scores, grades), performance descriptions | Calibrating modification difficulty |
| `goals` | Annual targets with baselines, criteria, benchmarks | Aligning modifications to measurable outcomes |
| `accommodations` | 11 accommodations + 3 modifications + 4 MCAS testing accommodations | Checking legal compliance |
| `services` | Service schedule, case manager, placement type (Full Inclusion) | Coordinating support staff |

This means when Claude needs to scaffold a question, it pulls `present-levels` (to know Jasmine reads at Grade 3) and `accommodations` (to know she gets graphic organizers), without loading 30 pages of unrelated content.

#### Structured JSON, not raw text

Each resource is structured JSON with named fields, not paragraph text. For example, present levels include explicit `assessmentData` fields:

```json
{
  "domain": "academic",
  "subject": "ELA",
  "assessmentData": {
    "iReady Overall Reading": "Grade 3",
    "Vocabulary": "Grade 3",
    "Literature Comprehension": "Grade 3",
    "Informational Text Comprehension": "Grade 2",
    "Current ELA Grade": "1.8 / 3.0",
    "Independent Comprehension Accuracy": "0-50%"
  }
}
```

This lets tools perform precise reasoning ("her informational text comprehension is Grade 2; this is an informational text; scaffold accordingly").

#### Lesson decomposition into 6 resources

The lesson is similarly decomposed:

| Resource | Contents |
|----------|----------|
| `overview` | Standards, timing, skill focus, facilitation options |
| `text` | The full article students read |
| `questions` | All 16 questions with IDs, types, paragraph ranges, sample answers |
| `activities` | 4 activities with duration, modality, content |
| `vocabulary` | 8 words with pronunciations and definitions |
| `full` | Everything combined |

Questions get unique IDs (e.g., `DR-1A`, `MC-3`, `SA-1`) so tools can target specific questions for scaffolding.

### Tools: What Claude Can Do

#### `generate_lesson_modifications`

The primary tool. Given an activity (or the full lesson), it assembles the relevant student context, IEP goals, accommodations, lesson content, and specific questions into a structured prompt. The output is organized by **UDL framework**:

- **Engagement**: How to sustain Jasmine's interest when she encounters frustration
- **Representation**: How to present content accessibly at her reading level
- **Action & Expression**: Alternative ways to demonstrate understanding

#### `match_accommodations`

Maps each of the 11 IEP accommodations to **specific moments** in the 45-minute lesson. Not "provide extra time" generically, but:

> **Extra time** during Independent Practice (Min 20-40): If Jasmine needs more than 20 minutes, she can continue the short answer prompt during the Discussion activity. Target: complete MC questions in 8-10 minutes, leaving 10-12 minutes for writing.

Also generates **proactive self-regulation checkpoints** based on Jasmine's behavioral pattern (frustration -> avoidance -> shutdown), timed to the lesson's natural risk points.

#### `scaffold_question`

Takes a specific question ID and scaffolding level (light/moderate/intensive) and produces scaffolded versions calibrated to the student's reading level. All scaffolds reference the actual lesson content:

- **Light**: Paragraph hints ("Look at paragraphs 3-7")
- **Moderate**: Sentence starters, graphic organizers, chunked sub-questions
- **Intensive**: Fill-in-the-blank with word banks drawn from the text

Supports a **`mode` parameter** (`teacher` or `student`). Teacher mode includes expected answer hints so the SE teacher can reference them mid-lesson without having memorized the Toby Lowe article. Student mode produces a clean handout without answers, ready to photocopy. This mirrors how real curriculum materials always separate teacher and student editions.

#### `check_accommodation_compliance`

Reviews the lesson against all IEP accommodations and produces a compliance matrix with YES/PARTIAL/NEEDS PLAN ratings and risk levels. Includes lesson-specific risk assessment, IEP goal alignment mapping, and a **MCAS testing accommodation cross-reference** that shows how classroom accommodations align with state testing accommodations (ensuring consistent support between instruction and assessment).

This matters because IEP accommodations are **legally mandated**. Missing one isn't just bad pedagogy; it's a compliance violation.

#### `generate_teacher_prep_summary`

Generates a one-page "before class" summary designed to be printed and taped to the lesson binder. Includes:
- Student snapshot table with IEP source citations
- "3 Things to Remember Today" (the most critical insights)
- Materials preparation checklist with checkboxes
- Minute-by-minute lesson timeline with risk levels and specific intervention scripts
- Early warning signs table (behavioral cue -> what it means -> what to do)
- IEP data collection reminders for quarterly progress reporting

This tool addresses a real workflow gap: SE teachers co-teach in general ed classrooms and need a quick reference for each student's needs during each lesson.

#### `export_printable_materials`

Bundles all student materials for a lesson into a single print-ready Markdown document. A teacher prints one packet before class instead of generating each tool's output separately. Includes:
- Graphic organizer (paragraph 2/8 community traits table)
- Writing scaffold (SA-1 step-by-step guide with sentence starters and self-checklist)
- Schedule card (student-facing lesson timeline with checkboxes)
- Pause-Plan-Proceed card (reusable metacognitive prompt)
- Vocabulary reference sheet

Supports **student mode** (clean handouts, no answers) and **teacher mode** (adds answer keys, MC answer key, quick-reference answer guide, and implementation notes).

#### `generate_progress_data_sheet`

Generates a structured IEP progress data collection form mapping this lesson's activities to specific IEP benchmarks. The SE teacher fills it out during or after the lesson for quarterly progress reporting. Includes:
- Per-benchmark observation checklists with scoring rubrics (ELA: annotation, MC accuracy, claim writing, evidence, analysis)
- Self-regulation event log (time, trigger, warning sign, strategy used, re-engagement)
- Benchmark rate calculations with targets (e.g., "___/5 = ___% (target: 80%)")
- Lesson-level metrics (time in classroom, breaks taken, work completion)
- Observer notes for IEP review recommendations

This addresses a real compliance need: SE teachers must collect measurable data every lesson to support quarterly IEP progress reports.

#### `generate_take_home`

Generates a modified take-home version of classwork the student didn't finish. Given that Jasmine has low reading/writing stamina and is likely to not complete SA-1 in class, the take-home form:
- Includes relevant text excerpts (she doesn't need the full article at home)
- Reduces scope (claim + 1 example instead of full claim/evidence/analysis)
- Provides sentence starters and a word bank for independent use
- Includes a parent/guardian note with context and "how you can help" guidance
- Removes time pressure framing and ends with encouragement

This is NOT additional homework -- it's completion of classwork with modified expectations for the unsupported home setting.

#### `generate_classroom_summary`

Generates a classroom-at-a-glance view for teachers managing multiple IEP students in one lesson. Produces:
- **Accommodation overlap matrix**: Shows which accommodations are shared across students (one prep step covers multiple students) and where needs conflict
- **Materials preparation**: Shared materials (photocopy once) vs. individualized materials per student, with prep time estimates
- **Priority timeline**: Minute-by-minute guide showing which student needs attention when, and whether the SE teacher or gen ed teacher handles it
- **End-of-lesson decision tree**: What to do based on work completion status (collect, take-home, or no take-home if student is in distress)

Currently demonstrates with one student; the schema and output structure are designed for multiple students when additional IEP data is loaded.

#### `generate_sub_card`

Generates a substitute teacher emergency card. When a sub covers a class, they typically receive no IEP information. But IEP accommodations are legally mandated regardless of who is teaching. A sub who doesn't know Jasmine's pattern will misread her shutdown as defiance.

The card is designed to be:
- Left in the substitute folder (every classroom has one)
- Read in under 2 minutes by someone with no IEP training
- Actionable without any prior knowledge of the student
- Legally sufficient (covers all mandated accommodations in plain language)

Includes: "The One Thing to Know" (behavioral pattern), required accommodations simplified for a non-specialist, a step-by-step "If She Shuts Down" protocol, what strategies work, and optionally lesson-specific timing notes. Deliberately written in direct, non-jargon language.

### Multi-Student Design

The resource URI scheme (`iep://{student-slug}/{section}`, `lesson://{lesson-slug}/{section}`) is designed for multiple students and lessons. Adding a second student (e.g., `iep://marcus-chen/profile`) or lesson (e.g., `lesson://photosynthesis/overview`) requires only new data files and resource registrations. All tools receive student/lesson context through the resources rather than hardcoded references, so the same `scaffold_question` tool works for any student-lesson combination.

### Prompts: Pre-Built Workflows

6 prompts for common teacher tasks:

| Prompt | Use Case |
|--------|----------|
| `differentiate-lesson` | End-to-end lesson differentiation (the main workflow) |
| `accommodation-checklist` | Quick compliance verification before teaching |
| `scaffold-activity` | Focused scaffolding for a specific activity |
| `behavior-support-plan` | Proactive behavior plan with de-escalation scripts |
| `progress-monitoring` | IEP progress data collection aligned to lesson activities |
| `teacher-prep` | One-page "before class" summary for the lesson binder |

### Trade-offs

**Pre-structured vs. dynamic PDF parsing**: The sample IEP data is pre-structured in TypeScript rather than parsed from PDF at runtime. This was a deliberate choice: the hard part of this problem is *how you model the data*, not *how you extract it*. A production system would need PDF parsing (and the project includes the PDFs in `data/`), but for this challenge, hand-structuring the data lets me show the exact schema decisions I'd make and why.

**Lesson-specific scaffolds vs. generic templates**: The scaffold tool contains question-specific scaffolding for every question in this lesson. This means the output is genuinely specific ("For paragraph 2, fill in: 'There are many _____ kinds of communities'") rather than templated. The trade-off is that adding a new lesson requires writing new scaffolds. In production, this is where Claude's reasoning would generate scaffolds dynamically using the structured data, and the tool's output serves as a prompt that guides Claude's generation rather than being the final output itself.

**Accommodation mappings**: The accommodation-to-activity mappings are hand-crafted for this lesson. In production, Claude would generate these dynamically by cross-referencing the accommodation list with the lesson activities. The hand-crafted versions demonstrate what "specific" and "actionable" actually look like for a teacher.

---

## Example Output 1: Accommodation-Activity Matrix with Self-Regulation Checkpoints

When a teacher uses the `match_accommodations` tool, here's what they get for Jasmine during the "What is Community?" lesson:

<details>
<summary>Click to expand full output</summary>

```
# Accommodation-Activity Matrix
**Student:** Jasmine Bailey | **Lesson:** What is 'Community' and why is it important?
**Duration:** 45 minutes | **Standard:** RI.7.2

## Behavioral Context for Implementation
Jasmine's disability affects attention, task initiation, focus, stamina, and study skills.
**Critical pattern:** Academic frustration leads to avoidance behaviors:
- Quietly puts head down
- Asks to use the restroom multiple times
- Disengages and withdraws rather than asking for help
- Chooses to stay in whole group 80% of the time despite struggling
**Key insight:** Jasmine is MOST at risk of shutdown during independent work
with grade-level text (she reads at Grade 3; this is a 7th-grade text).

## Accommodation Matrix

### [PRESENTATION] Repeat directions

**Intro Slide Deck** (Min 0-5)
> After presenting the Purpose for Reading, restate it simply:
> 'Today we're reading about what makes a community. Our job is to
> figure out Lowe's definition.'

**During Reading** (Min 5-20)
> Before each question type (Think & Share, Write, Turn & Talk),
> restate what students should do: 'For this one, talk to your
> partner about...' Confirm Jasmine understands the directions
> before moving on.

**Independent Practice** (Min 20-40)
> Before releasing students, restate: 'You have 4 multiple choice
> questions and 1 writing prompt. You CAN look back at the text.
> Start with the multiple choice.' Walk to Jasmine and repeat
> these directions 1:1.

### [PRESENTATION] Reference sheets, graphic organizers, and checklists

**During Reading** (Min 5-20)
> Provide a graphic organizer for the paragraph 2 bullet list:
> a table with two columns -- 'Trait of Community' and 'How Lowe
> Tests It in Para 8' -- with the 6 traits pre-filled in the left
> column. Jasmine fills in the right column as she reads paragraph 8.

**Independent Practice** (Min 20-40)
> For the short answer prompt, provide a structured writing checklist:
> (1) Write a claim answering the question, (2) Find evidence in
> paragraph 4 or 9, (3) Explain how the evidence connects to your
> claim. Also provide the Self-Checklist from the lesson enlarged
> and on a separate card.

### [TIMING] Frequent breaks

**During Reading** (Min 5-20)
> Offer a 1-minute movement break after completing the paragraph 1-2
> questions (approximately minute 10). Can be as simple as standing,
> stretching, or getting water.

**Independent Practice** (Min 20-40)
> Schedule a 2-minute break at the transition between MC questions
> and the short answer prompt (approximately minute 30). This is a
> natural stopping point and prevents stamina-related shutdown.

## Proactive Self-Regulation Checkpoints

**Minute 5 (End of Intro)**
*Trigger:* Transition from whole-class intro to reading
*Action:* Quick 1:1 check-in: "Jasmine, before we start reading,
let's look at the vocabulary words together. Which ones do you
already know?" This grounds her in familiar content before
unfamiliar text.

**Minute 10 (During Whole-Class Reading, Paras 1-2)**
*Trigger:* After first Think & Share question -- this is when she
may feel overwhelmed by the dense paragraph 2 bullet list
*Action:* Proximity check: Move near Jasmine's seat. Whisper:
"You're doing great following along. Remember you can use your
reference sheet if the bullet points feel like a lot." Offer her
a brief movement break if she shows signs of disengagement.

**Minute 22 (Start of Independent Practice)**
*Trigger:* HIGHEST RISK POINT: Transition to independent work with
4 MC questions and a short answer.
*Action:* Before independent work begins, 1:1 check-in: "Jasmine,
you have 4 multiple choice questions and a writing prompt. Let's
start with the multiple choice -- they're about what we just read
together. You can look back at the text anytime." Provide her
modified question sheet with paragraph references. Check back
after 5 minutes.

**Minute 32 (Mid-Independent Practice)**
*Trigger:* 10 minutes into independent work -- stamina check.
*Action:* Scheduled break: "Jasmine, take a 2-minute break. Get
some water or do a stretch. When you come back, you just need to
finish the writing prompt." Offer the graphic organizer for the
short answer if she hasn't started it yet.
```

</details>

## Example Output 2: Scaffolded Short Answer Prompt

When a teacher uses `scaffold_question` with `question_id: "SA-1"` and `scaffolding_level: "moderate"`:

```
## SA-1: Short Answer

**Original Question:** You have just read "What is community and why is it
important?" by Toby Lowe. Explain what Lowe means when he says a community
is "a group of people who share an identity-forming narrative." [RI.2]

### Scaffolded Version (moderate)

**Graphic Organizer for Short Answer:**

| Step | What to Write | Where to Find It |
| --- | --- | --- |
| 1. Claim | What does "identity-forming narrative" mean? | Paragraph 3-4 |
| 2. Evidence #1 | Quote or paraphrase from the text | Paragraph 4 or 9 |
| 3. Explain #1 | How does this help explain the definition? | Your own words |
| 4. Evidence #2 | Another quote or detail from the text | Paragraphs 5-7 |
| 5. Explain #2 | How does this connect? | Your own words |

**Sentence starters:**
- Claim: "When Lowe says a community shares an 'identity-forming
  narrative,' he means that _____."
- Evidence: "For example, Lowe explains that _____." (paragraph ___)
- Analysis: "This shows that an identity-forming narrative is _____
  because _____."

**Unit vocabulary to include:** narrative, aspect, moral, specific
```

## Example Output 3: Teacher Prep Summary

The `generate_teacher_prep_summary` tool produces a printable one-page reference. Here's an excerpt:

```
## Lesson Timeline with Check-In Points

| Time | Activity      | Risk     | Action for Jasmine                                    |
|------|---------------|----------|-------------------------------------------------------|
| 0-5  | Intro         | LOW      | Preview vocabulary 1:1. "Which words do you know?"    |
| 5-10 | Reading P1-2  | MEDIUM   | Stand near desk. Whisper: "You're doing great."       |
| 20   | TRANSITION    | **HIGH** | 1:1 check-in. Restate directions. Modified questions.  |
| 28-30| BREAK         | --       | "Take 2 min. Get water. Just the writing prompt left." |
| 30-40| Short Answer  | **HIGH** | Offer scaffold. If shutdown: pull to small group.      |

## Early Warning Signs (Intervene Before Shutdown)

| Sign                    | What It Means           | What to Do                              |
|-------------------------|-------------------------|-----------------------------------------|
| Head down on desk       | Frustration reached     | Wait 10 sec, whisper: "We're on P[X]."  |
| Asks to go to bathroom  | Avoidance behavior      | Offer desk break: "Stretch right here." |
| Staring at blank page   | Task initiation problem | Provide sentence starter                |

## IEP Data to Collect Today
- [ ] ELA Goal: Did she annotate accurately? Score: ___/5
- [ ] Self-Reg: Did she use a calming strategy? Count: ___/opportunities
- [ ] Time in classroom: ___/45 minutes
```

See [`examples/teacher-prep-summary.md`](examples/teacher-prep-summary.md) for the complete output.

---

This scaffolding is calibrated to Jasmine's specific needs: she reads at Grade 3 but the text is Grade 7. The graphic organizer breaks the open-ended prompt into sequential steps (matching her IEP benchmark for finding textual evidence), the paragraph references reduce the cognitive load of searching the full text, and the sentence starters address her 50% independent writing accuracy by giving her a structure to fill in rather than a blank page.

---

## Domain Understanding

### Why UDL Framing Matters

The modifications are organized using the [Universal Design for Learning](https://www.cast.org/impact/universal-design-for-learning-udl) framework rather than a generic "accommodation list" because UDL is the standard pedagogical approach for differentiated instruction. It frames modifications around three principles:

1. **Multiple means of Engagement**: Why should Jasmine care about this lesson? She likes peer interaction and positive praise. The lesson's partner reading and discussion activities are natural engagement points; the independent practice is where engagement breaks down.

2. **Multiple means of Representation**: How can Jasmine access a Grade 7 text at Grade 3 reading level? Not by simplifying the text (that would be a different assignment), but by providing scaffolds that bridge the gap: graphic organizers that pre-structure the complex paragraph 2 bullet list, vocabulary pre-teaching, and the option for the SE teacher to read sections aloud.

3. **Multiple means of Action & Expression**: How can Jasmine show what she understands? The short answer prompt expects claim + evidence + analysis writing. For a student whose independent writing accuracy is 50%, the scaffold provides sentence starters and a step-by-step organizer. At the intensive level, it becomes a fill-in-the-blank with a word bank, which still requires comprehension but removes the writing-from-scratch barrier.

### Teacher-Centric Design

Every output is designed for a teacher's real workflow:

- **Accommodation compliance matrix**: A printable checklist that goes in the lesson binder. The teacher (or SE teacher doing the daily 55-min ELA co-teach) can glance at it before class and know exactly what needs to happen at which minute.

- **Self-regulation checkpoints**: Timed to the lesson's natural transitions, not arbitrary intervals. The highest-risk moment (minute 22, start of independent practice) gets the most detailed intervention script because that's when Jasmine's pattern of frustration-to-shutdown is most likely to activate.

- **Scaffolded materials**: Ready to photocopy. The graphic organizer for the short answer has the exact paragraph numbers and sentence starters from this specific lesson, not placeholders like "[insert text evidence here]."

### What I Learned About IEPs

- IEP accommodations are **legally binding**. A teacher who doesn't implement them isn't just doing poor pedagogy; they're out of compliance with federal law (IDEA). This is why the compliance checker exists as a separate tool.

- Present levels are the **most underused** section of an IEP. They contain specific assessment data (iReady Grade 3, 50% independent accuracy) that directly determines how modifications should be calibrated. Most generic AI tools would say "provide scaffolding"; the present levels tell you *how much* scaffolding.

- Students with IEPs often have **clear behavioral patterns** connected to their disability. Jasmine's is: academic frustration -> avoidance (head down, bathroom requests) -> shutdown -> significant time outside classroom. The goal isn't to prevent frustration but to intercept the cycle between frustration and avoidance with taught calming strategies. The self-regulation checkpoints are timed to intercept this cycle proactively.

---

## Project Structure

```
demo.ts                   # CLI demo: run `npm run demo` to see tool output
LICENSE                   # MIT license
src/
  index.ts                # MCP server entry point (resources, tools, prompts)
  types.ts                # Domain types (IEP, lesson data models)
  sanitize.ts             # Input sanitization for IEP PII in Markdown output
  data/
    iep-structured.ts     # Jasmine's IEP parsed into structured data
    lesson-structured.ts  # Lesson plan parsed into structured data
  resources/
    iep.ts                # 6 IEP resources (profile, levels, goals, accommodations, services, full)
    lesson.ts             # 6 lesson resources (overview, text, questions, activities, vocab, full)
  tools/
    generate-modifications.ts  # UDL-organized lesson modifications
    match-accommodations.ts    # Accommodation-activity matrix + self-reg checkpoints
    scaffold-questions.ts      # Question scaffolding at 3 levels (light/moderate/intensive)
    check-compliance.ts        # IEP compliance verification + MCAS cross-reference
    prep-summary.ts            # One-page teacher prep summary
    export-materials.ts        # Print-ready materials bundle (student/teacher mode)
    progress-collector.ts      # IEP progress data collection forms
    take-home.ts               # Modified take-home for unfinished classwork
    classroom-summary.ts       # Multi-student classroom-at-a-glance
    sub-card.ts                # Substitute teacher emergency card
    __tests__/tools.test.ts    # 48 tests: tools + sanitization + error handling
  prompts/
    index.ts              # 6 prompt templates for teacher workflows
data/
  iep.pdf                 # Original IEP document
  lesson.pdf              # Original lesson plan
examples/
  README.md                     # Index with tool call parameters for each example
  accommodation-matrix.md       # Full accommodation-activity matrix with self-reg checkpoints
  all-questions-scaffolded.md   # All 16 questions scaffolded at moderate level
  classroom-summary.md          # Classroom-at-a-glance with multi-student design
  compliance-check.md           # IEP compliance matrix with MCAS cross-reference
  export-materials-student.md   # Print-ready student handout packet
  export-materials-teacher.md   # Print-ready teacher edition with answer keys
  full-lesson-modifications.md  # Complete modification context for full lesson
  progress-data-sheet.md        # IEP progress data collection form
  scaffolded-short-answer.md    # Short answer scaffolded at moderate level
  sub-card.md                   # Substitute teacher emergency card
  take-home-sa1-mc4.md          # Take-home form with parent note
  teacher-prep-summary.md       # One-page printable teacher prep summary
```

## Author

**Maliik Bryan** - [github.com/Maliik-B](https://github.com/Maliik-B) | Fort Lauderdale, FL

Built with TypeScript, the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk), and [Zod](https://github.com/colinhacks/zod).
