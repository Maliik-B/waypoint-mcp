/**
 * MCP Resources for IEP data.
 *
 * The IEP is decomposed into 5 semantic resources, each serving a distinct
 * reasoning purpose. This avoids dumping 36 pages of dense legal/educational
 * text into context and instead gives Claude focused, actionable sections.
 *
 * Resource URI scheme: iep://jasmine-bailey/{section}
 */

import { jasmineBaileyIEP } from "../data/iep-structured.js";

export function getIEPResourceList() {
  return [
    {
      uri: "iep://jasmine-bailey/profile",
      name: "Student Profile: Jasmine Bailey",
      description:
        "Student demographics, disability classification, strengths, challenges, motivators, and the student's own vision for their learning. Start here to understand who the student is.",
      mimeType: "application/json",
    },
    {
      uri: "iep://jasmine-bailey/present-levels",
      name: "Present Levels of Performance",
      description:
        "Current academic and behavioral performance with assessment data (iReady scores, grades), including specific strengths and how the disability impacts each area. Essential for calibrating the difficulty of modifications.",
      mimeType: "application/json",
    },
    {
      uri: "iep://jasmine-bailey/goals",
      name: "Measurable Annual Goals",
      description:
        "Three IEP goals (Counseling/Self-Regulation, Mathematics, ELA) with baselines, targets, measurement criteria, and short-term benchmarks. Modifications should support progress toward these goals.",
      mimeType: "application/json",
    },
    {
      uri: "iep://jasmine-bailey/accommodations",
      name: "Accommodations and Modifications",
      description:
        "Legally mandated accommodations (presentation, response, timing, setting) and modifications (content, instruction, output) that MUST be implemented in every lesson. Use this to verify compliance.",
      mimeType: "application/json",
    },
    {
      uri: "iep://jasmine-bailey/services",
      name: "Service Delivery Schedule",
      description:
        "Special education and related services schedule (Math SE teacher daily 55 min, ELA SE teacher daily 55 min, Counseling weekly 30 min). Helps coordinate when support staff are available.",
      mimeType: "application/json",
    },
    {
      uri: "iep://jasmine-bailey/full",
      name: "Complete IEP Summary",
      description:
        "All IEP sections combined into a single resource. Use this when you need the full picture for comprehensive lesson differentiation.",
      mimeType: "application/json",
    },
  ];
}

export function readIEPResource(uri: string): string {
  const iep = jasmineBaileyIEP;

  switch (uri) {
    case "iep://jasmine-bailey/profile":
      return JSON.stringify(iep.profile, null, 2);

    case "iep://jasmine-bailey/present-levels":
      return JSON.stringify(iep.presentLevels, null, 2);

    case "iep://jasmine-bailey/goals":
      return JSON.stringify(iep.goals, null, 2);

    case "iep://jasmine-bailey/accommodations":
      return JSON.stringify(
        {
          accommodations: iep.accommodations,
          modifications: iep.modifications,
        },
        null,
        2
      );

    case "iep://jasmine-bailey/services":
      return JSON.stringify(iep.services, null, 2);

    case "iep://jasmine-bailey/full":
      return JSON.stringify(iep, null, 2);

    default:
      throw new Error(`Unknown IEP resource: ${uri}`);
  }
}
