/**
 * Structured lesson data for "What is 'Community' and why is it important?"
 *
 * The lesson is decomposed into its pedagogical components:
 * - Metadata for quick context (standards, timing, skill focus)
 * - Activities in sequence with reading modalities and timing
 * - Questions categorized by type and cognitive demand
 * - Vocabulary with pronunciations
 * - Teacher notes and facilitation options
 *
 * This structure lets Claude reason about SPECIFIC moments in the lesson
 * where differentiation is needed, rather than treating the lesson as
 * a monolithic block of text.
 */

import type { LessonData } from "../types.js";

export const communityLesson: LessonData = {
  metadata: {
    title: "What is 'Community' and why is it important?",
    author: "Toby Lowe",
    unit: "Unit 1: Community and Belonging",
    gradeLevel: "7th grade",
    subject: "ELA",
    standards: ["RI.7.2"],
    totalDuration: "45 minutes",
    skillFocus:
      "Determining and summarizing the central idea of a text and identifying the details that develop it",
    knowledgeFocus:
      "This informational text offers a useful and accurate definition for 'community' which students will refer to throughout the unit. Students consider the feelings people associate with their communities and how the shared narrative of a community influences members' views.",
  },

  textContent: `"What is 'community' and why is it important?" by Toby Lowe

About this Text: Toby Lowe is a professor of public management who works with government and volunteer organizations to find ways of making public services better. The following text is a summary of Lowe's PhD centered around the use and misuse of the term "community."

[1] The word "community" has a strange power to it. It conveys a sense of togetherness and positivity. It speaks both of solidarity and homeliness. You will, almost never, hear people say what they mean by "community."

What does community mean? And why is it important?

[2] Here are the things that I think a definition of community must be able to explain in order to reflect the various communities in the world:
- A definition of community must be able to account for the different types of communities that exist in the world. For example, it must be able to account for both a community of place, and something more dispersed, like "the academic community" or "the Islamic community."
- It must be able to account for the positive feelings that people have about "community" (e.g. the sense of togetherness), but without saying that "community" is necessarily good (after all, one of the best examples of a community is the Mafia, and even with the kindest reading of their activities, you'd struggle to argue that, on balance, they are a force for good in the world).
- It must be able to explain the sense of identity and belonging associated with "community." It must explain the feeling of pride or hurt we feel when a community of which we are part is praised or attacked. And it must explain the "in" group/"out" group nature of this identity -- why some people are part of a particular community, and others are not.
- The definition of community must be able to explain why "community" has the normative (moral) power that it does -- how communities shape our sense of what 'good' and 'bad' means. For example, our community shapes our understanding of what being a good neighbor means -- the shared understanding of how we should treat people around here.
- It must be able to explain why "community" is different from other social groups -- such as "society," "family," or just a group of people.
- It must be able to account for the fact that people can be part of different communities simultaneously.

[3] Given that framing, I offer this as my definition of "community": A community is a group of people who share an identity-forming narrative.

[4] This means, a group of people who share a story that is so important to them that it defines an aspect of who they are. Those people build the shared story archetypes (characters) of that community into their sense of themselves; they build the history of those communities into their own personal history; and they see the world through the lens of those shared stories.

[5] So, one of the communities that I consider myself to be part of is the community based around the city of Newcastle. The manifestations of this are that I take pride in showing people around the city. I feel slighted when people say horrible things about it. I feel at home whenever I hear a Geordie (Newcastle) accent (despite not having one myself). And so on.

[6] But what makes me part of this community is my choice to write Newcastle's stories into my own story: the character traits for how Geordies are supposed to behave (be friendly, talk to strangers at bus stops, support Newcastle United, etc., etc.) are character traits that I have adopted. I take part in shared events where this story is played out -- such as attending football matches at St. James Park and other cultural events in the city. I feel that arguments about the future of the city (should this building be built here? What green spaces does the city need? etc., etc.) are arguments about my own future. I see arguments about the UK's future through the lens of the future of Newcastle.

[7] It is this choice to participate in the making and remaking of these stories about the city that makes me part of the community of Newcastle. It's not just about where you live, or where you work: it is possible to live and work in Newcastle without doing these things, without becoming part of this community. And there are many people who are from Newcastle originally, but who now live elsewhere, who would still consider themselves part of the Newcastle community because they still take an active part in conversations about what it means to be a part of this community.

[8] Let's see how this definition works against the six key criteria for being an accurate and useful definition of "community":
- It can account for all the different kinds of community -- what people call "communities of interest" and "communities of place." The essence of community is a shared story -- that story can be about a place, or it can be about a religion, or any other social practice.
- It can account for the positive feelings people have about being part of a community. The sense of a shared identity, of being part of something larger than we are, is well known as a source of good feeling. Communities can be positive social forces, doing good in the world, and they can be negative, doing harm (and they can be both of those things at once). Community is not, in and of itself, morally praiseworthy. It just is.
- This definition of community explains the nature of shared identity in communities, and highlights the specific mechanism by which this occurs. It is the process of telling a story about yourself that draws on the shared cultural story archetypes which creates and maintains a shared identity.
- It explains why community has the normative (moral) force that it does, because it is our narratives that provide us with our explanations for what good/bad look like.
- It explains why "community" is different from other types of social groups. A community is a group with a shared identity-forming narrative.
- The definition understands that people can be part of many communities simultaneously, and also how they can become part of (and drift away from) particular communities.

[9] Community is a group of people who share a story that is so important to them that it defines an aspect of who they are.

[10] On one level, this is simply a plea for a more precise use of language. I am not saying that "community" is the only (or even most important) social grouping, but it is a particular type of social grouping that explains the strong sense of shared identity that people feel.

[11] I think my key message is that community is an important concept for social change because it helps us to see that social change requires a change in some of the most important stories we tell ourselves. Social change requires that we rewrite our communal narratives. Social change is change in community.`,

  activities: [
    {
      name: "Intro Slide Deck",
      duration: "5 minutes",
      description:
        "Guide students through the slide deck to introduce them to the reading lesson and skill focus.",
      readingModality: "whole-class",
      content:
        "Purpose for Reading: To understand what a community is so that we can build our understanding about how communities create feelings of both belonging and rejection.",
    },
    {
      name: "During Reading Questions",
      duration: "15 minutes",
      description:
        "Students read and answer the During Reading Questions. Uses whole class, partner, and whole class reading modalities across different paragraph sections.",
      readingModality: "whole-class",
      content:
        "Paragraphs 1-2 (Whole Class): Think & Share, Write, Turn & Talk about community definition and key traits. Paragraphs 3-7 (Partner): Write about Newcastle example, Turn & Talk about personal communities. Paragraph 8 (Whole Class): Turn & Talk about bulleted list structure, Write three reasons definition works. Paragraphs 10-11: Find Evidence answering title question.",
    },
    {
      name: "Independent Practice",
      duration: "20 minutes",
      description:
        "Students complete 4 multiple choice questions and a short answer prompt to measure their understanding of the text.",
      readingModality: "independent",
      content:
        "4 MC questions testing author's purpose [RI.6], central idea evidence [RI.1], vocabulary in context [RI.4], and paragraph function [RI.2]. 1 short answer: Explain what Lowe means by 'identity-forming narrative' with at least two text details and unit vocabulary.",
    },
    {
      name: "Student-Led Discussion",
      duration: "5 minutes",
      description:
        "Students practice speaking with academic language as they discuss questions about the text with a partner.",
      readingModality: "discussion",
      content:
        "3 discussion questions: (1) Courteous behavior in your community, (2) Can you be part of a community without conforming to its views? (3) Benefits of belonging to more than one community.",
    },
  ],

  vocabulary: [
    {
      word: "Aspect",
      pronunciation: "as-pekt",
      definition: "a particular part or feature of something",
    },
    {
      word: "Moral",
      pronunciation: "mawr-uhl",
      definition: "relating to principles of right and wrong",
    },
    {
      word: "Narrative",
      pronunciation: "nar-uh-tiv",
      definition: "a spoken or written account of connected events; a story",
    },
    {
      word: "Specific",
      pronunciation: "spi-sif-ik",
      definition: "clearly defined or identified",
    },
    {
      word: "Solidarity",
      pronunciation: "sol-ih-dar-ih-tee",
      definition: "a feeling of unity or togetherness based on a common interest",
    },
    {
      word: "Dispersed",
      pronunciation: "dih-sperst",
      definition: "spread out",
    },
    {
      word: "Manifestation",
      pronunciation: "man-ih-fes-tay-shun",
      definition: "a sign of something happening",
    },
    {
      word: "Essence",
      pronunciation: "es-ens",
      definition: "the quality that makes something what it is",
    },
  ],

  questions: [
    // During Reading Questions
    {
      id: "DR-1A",
      type: "during-reading",
      paragraphRange: "1-2",
      format: "Think & Share",
      questionText:
        "What claim does Lowe make about the word 'community' in paragraph 1?",
      sampleAnswer:
        "It is a word that has a lot of power and can mean different things, but people aren't always clear with what they think it means.",
    },
    {
      id: "DR-1B",
      type: "during-reading",
      paragraphRange: "1-2",
      format: "Write (Optional)",
      questionText:
        "What is the relationship between the claim above and the bulleted list in paragraph 2?",
      sampleAnswer:
        "Lowe lists the things that a good definition of community should explain.",
    },
    {
      id: "DR-1C",
      type: "during-reading",
      paragraphRange: "1-2",
      format: "Turn & Talk",
      questionText:
        "Based on the bulleted list, summarize at least three key traits of a community.",
      sampleAnswer:
        "There are many different kinds of communities. Communities can create positive feelings of togetherness and belonging. Communities influence members' views of what is good and bad. People can be part of multiple communities.",
    },
    {
      id: "DR-2A",
      type: "during-reading",
      paragraphRange: "3-7",
      format: "Write",
      questionText:
        "How does Lowe's example of belonging to the Newcastle community support his definition?",
      sampleAnswer:
        "It shows that part of his identity is the shared story of Newcastle. He acts how people from there are supposed to act, takes pride in the community, and chooses to take part in events that are part of Newcastle's story.",
    },
    {
      id: "DR-2B",
      type: "during-reading",
      paragraphRange: "3-7",
      format: "Turn & Talk",
      questionText:
        "Consider the communities you are a part of. Share how one of these communities fits Lowe's definition.",
      sampleAnswer:
        "Student responses will vary. Students should discuss the shared story of their chosen community.",
    },
    {
      id: "DR-3A",
      type: "during-reading",
      paragraphRange: "8",
      format: "Turn & Talk",
      questionText:
        "Refer back to the bulleted list in Paragraph 2. Why does the author include another bulleted list in this section?",
      sampleAnswer:
        "Lowe tests his definition of community against each of the 6 key traits outlined in paragraph 2.",
    },
    {
      id: "DR-3B",
      type: "during-reading",
      paragraphRange: "8",
      format: "Write",
      questionText:
        "In your own words, explain at least three reasons why Lowe thinks his definition that community is 'a shared story' works.",
      sampleAnswer:
        "A community's shared story can be based on place, religion or shared interests. A shared story makes people have positive feelings of belonging and contributes to their sense of self. The shared story of a community shapes the way members see the world.",
    },
    {
      id: "DR-4",
      type: "during-reading",
      paragraphRange: "10-11",
      format: "Find Evidence",
      questionText:
        "The title of this text is 'What is community and why is it important?' Highlight two pieces of evidence that answer both questions.",
      sampleAnswer:
        '"Community is a group of people who share a story that is so important to them that it defines an aspect of who they are." (10) | "community is an important concept for social change because it helps us to see that social change requires a change in some of the most important stories we tell ourselves." (11)',
    },
    // Multiple Choice Questions
    {
      id: "MC-1",
      type: "multiple-choice",
      format: "Multiple Choice",
      questionText:
        "Which best describes the author's main purpose in writing the article? [RI.6]\nA. to illustrate how important it is to be part of multiple communities\nB. to demonstrate the way community has shaped the author's life\nC. to describe the life of a person who lives in Newcastle\nD. to give a clear and useful definition of community",
      sampleAnswer: "D",
      standard: "RI.6",
    },
    {
      id: "MC-2",
      type: "multiple-choice",
      format: "Multiple Choice",
      questionText:
        'Which piece of evidence best illustrates the central idea of the article? [RI.1]\nA. "So, one of the communities that I consider myself to be part of is the community based around the city of Newcastle." (Paragraph 5)\nB. "It is this choice to participate in the making and remaking of these stories about the city that makes me part of the community of Newcastle." (Paragraph 7)\nC. "Community is a group of people who share a story that is so important to them that it defines an aspect of who they are." (Paragraph 9)\nD. "Social change requires that we rewrite our communal narratives." (Paragraph 11)',
      sampleAnswer: "C",
      standard: "RI.1",
    },
    {
      id: "MC-3",
      type: "multiple-choice",
      format: "Multiple Choice",
      questionText:
        'What is the best meaning of the word "slighted" as it is used in the excerpt from paragraph 5? [RI.4]\nA. bored\nB. insulted\nC. motivated\nD. recognized',
      sampleAnswer: "B",
      standard: "RI.4",
    },
    {
      id: "MC-4",
      type: "multiple-choice",
      format: "Multiple Choice",
      questionText:
        "How do paragraphs 5-7 help the reader understand the author's central idea? [RI.2]\nA. by explaining why community is neither good nor bad\nB. by describing life for members of the Newcastle community\nC. by giving an example of a community that is part of the author's story\nD. by illustrating how the Newcastle community has many different members",
      sampleAnswer: "C",
      standard: "RI.2",
    },
    // Short Answer
    {
      id: "SA-1",
      type: "short-answer",
      format: "Short Answer",
      questionText:
        'You have just read "What is community and why is it important?" by Toby Lowe. Explain what Lowe means when he says a community is "a group of people who share an identity-forming narrative." [RI.2]\n\nMake sure to incorporate relevant unit vocabulary in your writing.\n\nSelf-Checklist: Did I fully answer the prompt? Did I include at least two details from the text? Did I incorporate relevant unit vocabulary?',
      sampleAnswer:
        "See teacher guide for sample answer.",
      standard: "RI.2",
    },
    // Discussion Questions
    {
      id: "DISC-1",
      type: "discussion",
      format: "Student-Led Discussion",
      questionText:
        "Consider a community you are part of. What is something that is considered courteous behavior in that community?",
    },
    {
      id: "DISC-2",
      type: "discussion",
      format: "Student-Led Discussion",
      questionText:
        "Do you think it is possible to be a part of a community without conforming to its views? Explain your answer.",
    },
    {
      id: "DISC-3",
      type: "discussion",
      format: "Student-Led Discussion",
      questionText:
        'Lowe says that "people can be part of many communities." What might be some of the benefits of belonging to more than one community?',
    },
  ],

  teacherNotes: [
    "This lesson introduces students to key unit knowledge about community. Students will use the definition of community outlined in this article throughout the unit.",
    "This lesson is designed to be a whole class lesson because it provides students with more guidance on analyzing the author's argument around the definition of community.",
    "Use the recommended reading modalities (whole class, partner, independent) and the During Reading Questions.",
    "During Reading Questions marked with an asterisk (*) are optional questions. Teachers can choose to use these questions with students needing more support.",
  ],

  facilitationOptions: [
    "Option 1 (Recommended): Teacher-led, scaffolded and supportive. Use recommended reading modalities. Pause to answer During Reading Questions during reading. 45 total minutes.",
    "Option 2: Greater student independence. Assign longer chunks of independent reading. Skip some supportive During Reading Questions. Students take notes independently: annotate for details the author uses to explain the definition of 'community.'",
    "Option 3: Student-led small groups. Students in partners or groups of 3-5. Answer During Reading Questions and alternate readers. Teacher circulates to check understanding.",
  ],
};
