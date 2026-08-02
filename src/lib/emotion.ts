/**
 * Lightweight, local emotion recognition for Shamar.
 *
 * Runs in-process (no extra model call) and is used ONLY to shape Shamar's
 * response: which Scripture themes to draw from, whether to ask instead of
 * assume, and whether to prioritise real-world safety support.
 *
 * Inferred emotion labels are never persisted. Nothing here writes to storage.
 */

export type Detection = {
  emotions: string[];
  themes: string[];
  contexts: string[];
  ambiguous: boolean;
  crisis: boolean;
};

/** emotion -> trigger words/phrases (matched on word boundaries, lowercased). */
const EMOTION_CUES: Record<string, string[]> = {
  anxiety: ["anxious", "anxiety", "worried", "worry", "worrying", "nervous", "on edge", "panicking", "panic", "dread"],
  fear: ["afraid", "scared", "fearful", "terrified", "frightened", "fear"],
  sadness: ["sad", "down", "unhappy", "blue", "crying", "tears", "weepy", "low"],
  grief: ["grief", "grieving", "mourning", "passed away", "funeral", "loss of", "lost her", "lost him", "bereaved"],
  loneliness: ["lonely", "alone", "isolated", "no one understands", "by myself"],
  anger: ["angry", "furious", "livid", "rage", "mad at", "resentful"],
  frustration: ["frustrated", "frustrating", "fed up", "sick of", "irritated", "annoyed"],
  confusion: ["confused", "don't know what to do", "unclear", "torn", "conflicted", "lost about"],
  overwhelm: ["overwhelmed", "too much", "drowning", "can't keep up", "swamped"],
  stress: ["stressed", "stress", "pressure", "under pressure", "tense"],
  exhaustion: ["exhausted", "tired", "worn out", "drained", "no energy"],
  burnout: ["burnt out", "burned out", "burnout", "running on empty"],
  "self-doubt": ["not good enough", "self doubt", "doubting myself", "imposter", "can i really", "who am i to"],
  insecurity: ["insecure", "insecurity", "not enough", "comparing myself"],
  disappointment: ["disappointed", "disappointing", "let down", "didn't work out"],
  rejection: ["rejected", "rejection", "turned down", "left out", "excluded"],
  heartbreak: ["heartbroken", "heartbreak", "broken heart", "breakup", "broke up"],
  guilt: ["guilty", "guilt", "my fault", "i should have"],
  shame: ["ashamed", "shame", "embarrassed", "humiliated"],
  regret: ["regret", "wish i had", "wish i hadn't"],
  jealousy: ["jealous", "jealousy"],
  envy: ["envious", "envy"],
  joy: ["joyful", "so happy", "delighted", "over the moon", "joy"],
  excitement: ["excited", "exciting", "can't wait", "thrilled"],
  gratitude: ["grateful", "thankful", "gratitude", "blessed"],
  peace: ["peaceful", "at peace", "calm", "settled"],
  hope: ["hopeful", "hope", "looking forward"],
  love: ["love", "loved", "adore", "cherish"],
  contentment: ["content", "satisfied", "enough for today"],
  pride: ["proud", "so proud"],
  celebration: ["celebrate", "celebrating", "milestone", "we did it", "congratulations"],
  anticipation: ["anticipating", "about to", "coming up", "any day now"],
  uncertainty: ["uncertain", "not sure", "unsure", "what if"],
  waiting: ["waiting", "still waiting", "in limbo", "no answer yet"],
};

/** emotion -> Scripture themes (must exist in scripture.ts THEMES). */
const EMOTION_THEMES: Record<string, string[]> = {
  anxiety: ["Anxiety", "Peace", "Trust"],
  fear: ["Fear", "Courage", "Strength"],
  sadness: ["Sadness", "Hope", "Peace"],
  grief: ["Grief", "Loss", "Healing"],
  loneliness: ["Loneliness", "Friendship", "Peace"],
  anger: ["Anger", "Forgiveness", "Peace"],
  frustration: ["Frustration", "Patience", "Perseverance"],
  confusion: ["Confusion", "Wisdom", "Decision-making"],
  overwhelm: ["Stress", "Rest", "Strength"],
  stress: ["Stress", "Peace", "Rest"],
  exhaustion: ["Rest", "Strength", "Burnout"],
  burnout: ["Burnout", "Rest", "Healing"],
  "self-doubt": ["Purpose", "Strength", "Faith"],
  insecurity: ["Purpose", "Love", "Trust"],
  disappointment: ["Disappointment", "Hope", "Perseverance"],
  rejection: ["Rejection", "Love", "Purpose"],
  heartbreak: ["Heartbreak", "Healing", "Peace"],
  guilt: ["Guilt", "Forgiveness"],
  shame: ["Shame", "Love", "Forgiveness"],
  regret: ["Guilt", "New beginnings", "Forgiveness"],
  jealousy: ["Love", "Gratitude", "Trust"],
  envy: ["Gratitude", "Love", "Trust"],
  joy: ["Joy", "Praise", "Thankfulness"],
  excitement: ["Joy", "Hope", "Purpose"],
  gratitude: ["Gratitude", "Thankfulness", "Praise"],
  peace: ["Peace", "Rest", "Trust"],
  hope: ["Hope", "Faith", "Waiting"],
  love: ["Love", "Family", "Friendship"],
  contentment: ["Peace", "Gratitude", "Provision"],
  pride: ["Success", "Thankfulness", "Legacy"],
  celebration: ["Praise", "Success", "God's faithfulness"],
  anticipation: ["Hope", "Waiting", "Trust"],
  uncertainty: ["Decision-making", "Trust", "Wisdom"],
  waiting: ["Waiting", "Patience", "Prayer"],
};

/** life-context cues (used for both Scripture themes and memory suggestions). */
const CONTEXT_CUES: Record<string, string[]> = {
  "law firm": ["firm", "law firm", "practice", "client", "court", "case", "matter", "attorney", "advocate", "litigation"],
  leadership: ["team", "hiring", "hire", "employee", "staff", "lead", "leading", "manage", "managing"],
  business: ["business", "revenue", "invoice", "clients", "growth", "company", "brand"],
  daughter: ["zane", "my daughter", "my girl", "my child"],
  family: ["family", "mum", "mom", "home", "cousin", "aunt", "uncle"],
  sister: ["my sister", "sister"],
  granny: ["granny", "grandmother", "gogo", "grandma"],
  prayer: ["prayed", "praying", "prayer", "answered prayer"],
  finances: ["money", "finances", "rent", "bills", "school fees", "budget"],
  health: ["health", "sick", "doctor", "hospital", "healing"],
  faith: ["god", "jesus", "church", "scripture", "bible", "faith"],
  birthday: ["birthday", "turning 34", "new year of life", "another year older"],
};

const CONTEXT_THEMES: Record<string, string[]> = {
  "law firm": ["Her law firm", "Law", "Justice", "Wisdom"],
  leadership: ["Leadership", "Wisdom", "Decision-making"],
  business: ["Business", "Business growth", "Provision"],
  daughter: ["Her daughter", "Motherhood", "Parenting"],
  family: ["Family", "Love", "Legacy"],
  sister: ["Grieving her sister", "Grief", "Hope"],
  granny: ["Remembering her granny", "Legacy", "Gratitude"],
  prayer: ["Prayer", "Waiting", "God's faithfulness"],
  finances: ["Financial pressure", "Provision", "Trust"],
  health: ["Healing", "Strength", "Rest"],
  faith: ["Faith", "Trust", "God's faithfulness"],
  birthday: ["A new year of life", "Gratitude", "God's faithfulness"],
};

const CRISIS_CUES = [
  "kill myself",
  "end my life",
  "take my own life",
  "suicide",
  "suicidal",
  "want to die",
  "don't want to live",
  "dont want to live",
  "self harm",
  "self-harm",
  "hurt myself",
  "cutting myself",
  "he hits me",
  "she hits me",
  "being abused",
  "abusing me",
  "not safe at home",
  "i'm in danger",
  "im in danger",
];

function hit(haystack: string, needle: string): boolean {
  if (needle.includes(" ")) return haystack.includes(needle);
  return new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(haystack);
}

export function detectEmotion(input: string): Detection {
  const text = ` ${input.toLowerCase()} `;

  const crisis = CRISIS_CUES.some((c) => text.includes(c));

  const emotions: string[] = [];
  for (const [emotion, cues] of Object.entries(EMOTION_CUES)) {
    if (cues.some((c) => hit(text, c))) emotions.push(emotion);
  }

  const contexts: string[] = [];
  for (const [ctx, cues] of Object.entries(CONTEXT_CUES)) {
    if (cues.some((c) => hit(text, c))) contexts.push(ctx);
  }

  const themeSet: string[] = [];
  const push = (t: string) => {
    if (!themeSet.includes(t)) themeSet.push(t);
  };
  for (const e of emotions) (EMOTION_THEMES[e] ?? []).forEach(push);
  for (const c of contexts) (CONTEXT_THEMES[c] ?? []).forEach(push);

  // Ambiguous: something heavy is clearly being said, but no clear emotion word.
  const heavy = /(hard|difficult|rough|struggling|heavy|a lot right now|not okay|not ok)/.test(text);
  const ambiguous = emotions.length === 0 && heavy;

  return { emotions, themes: themeSet, contexts, ambiguous, crisis };
}

export const CRISIS_GUIDANCE = `The person may be in real danger or severe distress. Safety comes before theology.
Respond briefly, warmly and without alarm. Do not lead with Scripture, do not offer a passage list, and do not analyse their faith.
Say plainly that you are only a companion app and cannot keep them safe, and encourage them to reach out right now to someone real:
emergency services in their country, a trusted person nearby, their doctor, or a crisis line
(in South Africa: SADAG 0800 567 567, or 0800 12 13 14; elsewhere, their local emergency number).
You may close with one short, gentle line of care. Ask if there is someone they can call right now.`;