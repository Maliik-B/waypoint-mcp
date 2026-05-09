/**
 * Structured IEP data for Jasmine Bailey.
 *
 * This is the result of parsing the 36-page IEP PDF into semantically
 * meaningful sections. Each section maps to an MCP resource that Claude
 * can request independently based on the task at hand.
 *
 * Key design decision: We extract ONLY the pedagogically actionable
 * information. Legal boilerplate, signature pages, transportation forms,
 * and administrative data are excluded because they don't inform
 * instructional differentiation.
 */

import type { IEPData } from "../types.js";

export const jasmineBaileyIEP: IEPData = {
  profile: {
    name: "Jasmine Bailey",
    grade: "7th grade",
    age: 12,
    school: "Riverstone Prep Public Charter School",
    disability: "Health Impairment",
    strengths: [
      "Contributes thoughtful comments in class when calm and focused",
      "Open to feedback, especially during 1-on-1 check-ins",
      "Warm personality, gets along well with peers",
      "Likes to participate and help others",
      "Enjoys having class jobs and responsibilities",
      "Responds well to specific positive praise",
      "Shows increasing understanding of personal boundaries",
      "Can identify coping strategies in counseling setting",
      "Can distinguish between her own emotions and others' feelings",
    ],
    challenges: [
      "Academic frustration leads to avoidance behaviors (head down, bathroom requests)",
      "Shuts down rather than asking for help when stuck",
      "Low reading and writing stamina",
      "Difficulty sustaining attention during whole-group instruction",
      "Inconsistent effort on writing assignments",
      "Struggles to generalize skills from 1:1 to group settings",
      "Spends significant time outside classroom checking in with adults",
      "Difficulty with task initiation",
    ],
    motivators: [
      "Specific positive praise",
      "Peer interaction and socialization",
      "Creative activities (drawing, dance)",
      "Class jobs and helping others",
      "1-on-1 attention from adults",
    ],
    studentVision: {
      math: "I want to get faster at multi-step problems.",
      ela: "I want to read books that aren't too easy and be able to understand them.",
      science: "I want to do more lab experiments and write about what I see.",
      history: "I want to learn how to take better notes.",
      overall:
        "I want to get 3's in all my classes. I want to ask for help when I'm stuck instead of giving up.",
    },
    parentConcerns:
      "Jasmine's mom is concerned about her grades and her ability to keep up with grade-level work.",
    teamVision: {
      thisYear:
        "The team will support Jasmine in improving her grades in all subject areas. The team will continue to encourage her to attend small groups for Math and ELA.",
      fiveYear:
        "The team would like to see Jasmine graduate from Riverstone Prep Middle School and attend Riverstone Prep High School.",
    },
  },

  presentLevels: [
    {
      domain: "academic",
      subject: "ELA",
      currentPerformance:
        "Jasmine's current ELA grade is a 1.8 on a standards-based scale where 3 reflects full mastery. She is at a 3rd-grade reading level (iReady Fall 2025). She can decode most grade-level words and reads with adequate fluency. However, she struggles with literal and inferential comprehension questions both verbally and in writing. She has low reading and writing stamina. When independently engaged with accommodations, she struggles to access grade-level texts. Homework comprehension accuracy ranges from 0% to 50% when completed independently.",
      assessmentData: {
        "iReady Overall Reading": "Grade 3",
        Vocabulary: "Grade 3",
        "Literature Comprehension": "Grade 3",
        "Informational Text Comprehension": "Grade 2",
        "Current ELA Grade": "1.8 / 3.0",
        "Independent Comprehension Accuracy": "0-50%",
        "Writing with 1:1 Support": "Grade level",
        "Writing Independent": "Below grade level (50% accuracy)",
      },
      strengths:
        "Can decode most grade-level words. Reads with adequate fluency. Starting to find value in graphic organizers and checklists. Can participate in writing activities at grade level with 1:1 adult support.",
      impactOfDisability:
        "Attention, task initiation, focus, stamina, and study skills are all affected. Leads to avoidance behaviors, withdrawal from instruction, and trouble with adaptability. Chooses to stay in whole group 80% of the time despite struggling. When faced with difficult literacy tasks, quietly puts head down or asks to use restroom repeatedly.",
    },
    {
      domain: "academic",
      subject: "Math",
      currentPerformance:
        "Jasmine has gotten better with multi-digit operations and integer rules. She is at a grade 4 level on her most recent iReady math assessment. She is working on increasing her math problem-solving skills involving word problems.",
      assessmentData: {
        "iReady Math": "Grade 4",
        "Word Problem Accuracy": "55%",
      },
      strengths:
        "Improving with multi-digit operations and integer rules. Likes to participate in class when calm and focused.",
      impactOfDisability:
        "Difficulty with multi-step word problems requiring sustained attention. Task initiation challenges affect starting problem sets independently.",
    },
    {
      domain: "behavioral",
      currentPerformance:
        "Jasmine is new to Riverstone Prep and has adjusted relatively well. She attends counseling weekly and engages with her counselor. She prefers small-group and quiet activities. She can identify coping strategies in counseling but sometimes does not apply them in the classroom, leading to withdrawal and shutdown. When frustration arises, she has shown the ability to walk away from difficult situations. She demonstrates increasing understanding of personal boundaries.",
      strengths:
        "Engages well in counseling. Can identify emotions and coping strategies. Shows ability to walk away from frustrating situations. Increasing understanding of boundaries. Enjoys socializing with peers in unstructured settings.",
      impactOfDisability:
        "Academic frustration leads to avoidance behaviors. Rather than asking for help, Jasmine tends to disengage and put her head down. Has spent significant time outside classroom checking in with adults, leading to inconsistent time in the classroom. Struggles to regulate herself when encountering frustration.",
    },
  ],

  goals: [
    {
      area: "Counseling / Self-Regulation",
      baseline:
        "Jasmine can identify emotions and coping strategies in counseling sessions. She does well with listening to instructions; however, she struggles at times to use interventions when prompted. She sometimes does not apply these strategies in the classroom, leading to withdrawal and shutdown. She has shown the ability to walk away from difficult situations but sometimes shuts down rather than using strategies that work for her.",
      annualTarget:
        "Jasmine will improve her self-regulation skills by using a taught calming strategy (deep breathing, movement break, fidget tool, sensory tool, or grounding exercise) to calm her body and re-engage back to tasks in 4 out of 5 opportunities (80%).",
      criteria: "80% of opportunities",
      method: "Observation, Work Samples",
      schedule: "End of Quarter",
      responsiblePerson: "Social Worker",
      benchmarks: [
        {
          description:
            "Given fading adult support, Jasmine will recognize and describe physical cues of being triggered or frustrated (tense body, faster breathing, restlessness, lowered head) in 4 out of 5 opportunities.",
        },
        {
          description:
            "Jasmine will independently request or initiate a calming strategy (movement break, breathing pattern, sensory tool, grounding exercise) when experiencing dysregulation in 4 out of 5 opportunities.",
        },
        {
          description:
            "When experiencing frustration, Jasmine will use a taught self-regulation strategy and return to the classroom to engage in the assigned task, reflecting on the effectiveness of her strategy in 4 out of 5 opportunities.",
        },
      ],
    },
    {
      area: "Mathematics",
      baseline:
        "Jasmine is working at approximately 55% accuracy on multi-step word problems and grade-level questions involving multiple operations.",
      annualTarget:
        "Jasmine will improve problem solving of multi-step word problems and grade-level questions involving multiple operations, from an average of 55% to 75%.",
      criteria: "From 55% to 75%",
      method: "Curriculum Based Assessment",
      schedule: "End of Quarter",
      responsiblePerson: "SE Classroom Teacher",
      benchmarks: [
        {
          description:
            "Jasmine will increase her skill solving word problems and show understanding with reason from 55% to 75%.",
        },
        {
          description:
            "Jasmine will improve skill when solving equations involving integers and order of operations from 55% to 75%.",
        },
        {
          description:
            "Jasmine will increase her ability to utilize her resources such as reference sheets and class notes from 55% to 75%.",
        },
      ],
    },
    {
      area: "ELA",
      baseline:
        "Jasmine is at a 3rd-grade reading level (iReady Fall 2025). Subcategory: Vocabulary Grade 3, Literature Comprehension Grade 3, Informational Text Grade 2. Current ELA grade is 1.8/3.0. She can participate in writing at grade level with 1:1 support but independent performance remains below grade level at 50% accuracy. Homework comprehension ranges from 0-50% accuracy independently.",
      annualTarget:
        "Jasmine will increase her ability to comprehend complex texts to independently answer literal and inferential comprehension questions or writing prompts that meet grade-level rubrics, from 50% to 75%.",
      criteria: "From 50% to 75%",
      method: "Work Samples, Curriculum Based Assessment, Rubrics",
      schedule: "End of Quarter",
      responsiblePerson: "SE Classroom Teacher",
      benchmarks: [
        {
          description:
            "Jasmine will be able to accurately annotate a given text for the prompt, labeled annotation focus, supporting detail, etc.",
        },
        {
          description:
            "Jasmine will increase her ability to independently answer literal comprehension questions about a text such as main idea, setting, or plot.",
        },
        {
          description:
            "Jasmine will increase her ability to write a claim that accurately answers each part of the question.",
        },
        {
          description:
            "Jasmine will increase her ability to independently find 3 effective pieces of textual evidence to support the claim and answers.",
        },
        {
          description:
            "Jasmine will increase her ability to write analysis to show how her evidence is relevant to and contributes to her claim.",
        },
      ],
    },
  ],

  accommodations: [
    {
      category: "presentation",
      description: "Repeat directions",
    },
    {
      category: "presentation",
      description: "Reminders to pause, plan, proceed",
    },
    {
      category: "presentation",
      description: "Copy of teacher's notes",
    },
    {
      category: "presentation",
      description: "Reference sheets, graphic organizers, and checklists",
    },
    {
      category: "timing",
      description: "Extra time",
    },
    {
      category: "timing",
      description: "Frequent breaks",
    },
    {
      category: "timing",
      description: "Scheduled breaks",
    },
    {
      category: "setting",
      description: "1:1 check-ins",
    },
    {
      category: "setting",
      description: "Reminder to remain engaged",
    },
    {
      category: "setting",
      description: "Small group (as needed)",
    },
    {
      category: "setting",
      description: "Sit in the front of the room",
    },
  ],

  modifications: [
    {
      category: "content",
      description: "Multimodal instruction",
    },
    {
      category: "instruction",
      description: "Inclusion support",
    },
    {
      category: "instruction",
      description: "Small group pull-outs when appropriate",
    },
  ],

  services: [
    {
      goalNumbers: "2, 3",
      type: "Academic Support Consultation",
      provider: "Special Education Teacher",
      location: "General Education Classroom",
      frequency: "Weekly",
      duration: "10 minutes",
    },
    {
      goalNumbers: "1",
      type: "Counseling Consultation",
      provider: "Counselor",
      location: "Counselor's Office",
      frequency: "Monthly",
      duration: "10 minutes",
    },
    {
      goalNumbers: "2",
      type: "Math - Direct Service",
      provider: "Special Education Teacher",
      location: "General Education Classroom",
      frequency: "Daily",
      duration: "55 minutes",
    },
    {
      goalNumbers: "3",
      type: "ELA - Direct Service",
      provider: "Special Education Teacher",
      location: "General Education Classroom",
      frequency: "Daily",
      duration: "55 minutes",
    },
    {
      goalNumbers: "1",
      type: "Counseling - Direct Service",
      provider: "Counselor",
      location: "Counselor's Office",
      frequency: "Weekly",
      duration: "30 minutes",
    },
  ],

  caseManager: "Marisol Gutierrez-Stone",

  placementType: "Full Inclusion Program (IEP services provided outside the general education classroom less than 21% of the time; 80% inclusion)",

  bullyingVulnerability: {
    isVulnerable: true,
    response:
      "The team found that Jasmine is more vulnerable to bullying due to her disability. Emotional regulation goals have been created to address these concerns. The team developed goals and accommodations to support Jasmine with her social interactions and self-advocacy skills.",
  },

  testingAccommodations: [
    {
      code: "DF1",
      category: "designated-feature",
      description: "Small Group test administration",
    },
    {
      code: "DF3",
      category: "designated-feature",
      description: "Frequent brief supervised breaks",
    },
    {
      code: "DF4",
      category: "designated-feature",
      description: "Separate or alternate test location",
    },
    {
      code: "A9",
      category: "presentation",
      description:
        "Use a Department approved graphic organizer, checklist, or supplemental reference sheet",
    },
  ],
};
