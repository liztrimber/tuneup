import type { Category } from "./store";

export interface CoachingFramework {
  observation: string;
  feeling: string;
  need: string;
  beforeAfter: { before: string; after: string };
  turnTaking: string[];
  deescalation: string[];
}

const COACHING: Partial<Record<Category, CoachingFramework>> = {
  "division-of-labor": {
    observation:
      "Start with a specific, factual observation — no judgment. Example: 'I've been doing the morning routine every day this week.'",
    feeling:
      "Name how it affects you without assigning blame. Example: 'I'm feeling stretched thin and I worry I'll start resenting it.'",
    need:
      "Make a clear, actionable request. Example: 'Could we split mornings so I get Tuesday and Thursday off?'",
    beforeAfter: {
      before: "You never help with bedtime. I'm doing everything around here.",
      after:
        "I've been handling bedtime solo most nights this week. I'm feeling worn out. Can we figure out a way to take turns?",
    },
    turnTaking: [
      "Ask: 'How do you see the split right now? I want to understand your perspective.'",
      "Listen without interrupting — even if you disagree with their assessment.",
      "Reflect back: 'So what I'm hearing is...'",
      "Together: 'What would a fair split look like for both of us?'",
    ],
    deescalation: [
      "If it's getting tense: 'I'm not saying you're not doing enough. I'm saying I need help with this specific thing.'",
      "Pause: 'Can we take a breath? I want us to solve this together, not fight about it.'",
      "Reframe: 'We're on the same team. The problem is the workload, not either of us.'",
    ],
  },
  money: {
    observation:
      "Reference a specific situation, not a pattern accusation. Example: 'I noticed our grocery spending was higher than usual this month.'",
    feeling:
      "Share the underlying concern. Example: 'I feel anxious when we're not aligned on spending because I worry about our savings goal.'",
    need:
      "Suggest a concrete next step. Example: 'Can we set a weekly budget check-in, even just 2 minutes?'",
    beforeAfter: {
      before: "You spent way too much this month. We can't keep doing this.",
      after:
        "I noticed our spending was up this month. I feel stressed about hitting our savings goal. Can we look at the numbers together and see where we are?",
    },
    turnTaking: [
      "Ask: 'What purchases felt important to you this month? I want to understand.'",
      "Share your own priorities: 'Here's what I've been thinking about for our finances.'",
      "Find overlap: 'Where do we agree? Let's start there.'",
      "Decide: 'What's one thing we can both commit to this week?'",
    ],
    deescalation: [
      "If defensive: 'I'm not tracking your spending — I'm trying to plan together.'",
      "Soften: 'Money is stressful. I don't want this to feel like an interrogation.'",
      "Redirect: 'Let's focus on what we want our finances to look like, not what went wrong.'",
    ],
  },
  "something-on-my-mind": {
    observation:
      "Name the thing directly, even if it's vague. Example: 'Something has been bugging me and I've been putting off bringing it up.'",
    feeling:
      "Be honest about the emotion. Example: 'I feel disconnected from you lately and it's weighing on me.'",
    need:
      "Ask for what you need. Example: 'I don't need you to fix it. I just need you to hear me right now.'",
    beforeAfter: {
      before: "We need to talk. Something is wrong.",
      after:
        "I've had something on my mind. It's not urgent, but I want to share it with you because keeping it to myself isn't helping.",
    },
    turnTaking: [
      "Start: 'I want to share something. Can you just listen first before responding?'",
      "After sharing, invite: 'What comes up for you hearing that?'",
      "Acknowledge: 'Thank you for hearing me. That alone helps.'",
      "If needed: 'I don't need a solution — just knowing you understand.'",
    ],
    deescalation: [
      "If they get defensive: 'I'm not saying you did something wrong. I'm sharing where I'm at.'",
      "If overwhelmed: 'We don't have to solve this now. I just needed to say it out loud.'",
      "Ground it: 'I'm bringing this up because I care about us, not because I'm unhappy.'",
    ],
  },
  "personal-needs": {
    observation:
      "State what you need without apologizing for it. Example: 'I haven't had time to myself in two weeks.'",
    feeling:
      "Connect it to your well-being. Example: 'I'm running on empty and I can feel it affecting my patience.'",
    need:
      "Make a specific ask. Example: 'Could I have Saturday morning to myself this week? I'll cover Sunday for you.'",
    beforeAfter: {
      before: "I never get any time to myself. You always get to do what you want.",
      after:
        "I haven't had downtime in a while and I'm feeling burned out. Could I take Saturday morning? Happy to trade so you get time too.",
    },
    turnTaking: [
      "Ask: 'When was the last time you got a real break? I want to make sure we're both getting what we need.'",
      "Offer reciprocity: 'What would help you recharge this week?'",
      "Plan together: 'Let's block out time for both of us.'",
      "Check in: 'Does this feel fair to you?'",
    ],
    deescalation: [
      "If guilt comes up: 'Needing time doesn't make either of us a bad parent.'",
      "Reframe: 'I'm a better partner and parent when I'm not running on empty. This helps both of us.'",
      "If competitive: 'This isn't about who has it harder. We're both maxed out.'",
    ],
  },
  kids: {
    observation:
      "Describe what you've noticed, not your conclusion. Example: 'I've noticed Emma has been having more tantrums at bedtime this week.'",
    feeling:
      "Share your concern without prescribing a solution. Example: 'I'm worried she might be overtired or stressed about something.'",
    need:
      "Suggest teaming up. Example: 'Can we try a consistent bedtime routine this week and see if it helps?'",
    beforeAfter: {
      before: "You need to be stricter with the kids. They're out of control.",
      after:
        "I've noticed the kids are pushing back more at bedtime. I think they might need more consistency. Can we get on the same page about our approach?",
    },
    turnTaking: [
      "Ask: 'What have you noticed? You might be seeing things I'm missing.'",
      "Align: 'What matters most to you in how we handle this?'",
      "Decide: 'Let's try one approach together for a week and check back.'",
      "Support: 'If one of us is handling it, the other backs them up — even if we'd do it differently.'",
    ],
    deescalation: [
      "If it feels like criticism: 'I'm not saying your approach is wrong. I want us to be consistent.'",
      "Redirect: 'The goal is figuring out what the kids need, not who's doing it right.'",
      "Empathize: 'Parenting is hard. We're both doing our best and figuring it out.'",
    ],
  },
  us: {
    observation:
      "Name what's missing without blame. Example: 'I realized we haven't had a real date in over a month.'",
    feeling:
      "Be vulnerable. Example: 'I miss feeling connected to you outside of just running the household.'",
    need:
      "Propose something specific and low-barrier. Example: 'Could we plan one evening this month — even just takeout after the kids are down?'",
    beforeAfter: {
      before: "We never do anything fun anymore. It's like we're just roommates.",
      after:
        "I've been missing our time together. Can we put something on the calendar — even something small? I want to prioritize us.",
    },
    turnTaking: [
      "Ask: 'Do you feel like we've had enough time for us lately?'",
      "Dream: 'If time and money weren't an issue, what would you want us to do together?'",
      "Plan: 'What's one realistic thing we can do in the next two weeks?'",
      "Commit: 'Let's put it on the calendar right now so it actually happens.'",
    ],
    deescalation: [
      "If dismissed: 'I know we're busy. That's exactly why I think we need to be intentional about it.'",
      "If guilt: 'Wanting time together isn't selfish. It's how we stay strong for everything else.'",
      "Lighten: 'It doesn't have to be fancy. I just want to enjoy your company.'",
    ],
  },
};

const PLACEHOLDER_COACHING: CoachingFramework = {
  observation:
    "Start with a factual, nonjudgmental observation about the situation.",
  feeling:
    "Share how it makes you feel, using 'I' statements.",
  need:
    "Make a specific, actionable request.",
  beforeAfter: {
    before: "Coaching content for this category is coming soon.",
    after: "Check back for tailored framing examples.",
  },
  turnTaking: [
    "Share your perspective, then invite your partner's.",
    "Listen without interrupting.",
    "Reflect back what you heard.",
    "Find a shared next step.",
  ],
  deescalation: [
    "Pause if things get heated.",
    "Remind each other you're on the same team.",
    "You can always come back to this topic next week.",
  ],
};

export function getCoaching(category: Category): CoachingFramework {
  return COACHING[category] ?? PLACEHOLDER_COACHING;
}

export const COACHING_STEPS = [
  { key: "observe", label: "Observe", description: "What you've noticed" },
  { key: "feel", label: "Feel", description: "How it affects you" },
  { key: "need", label: "Need", description: "What you'd like" },
] as const;
