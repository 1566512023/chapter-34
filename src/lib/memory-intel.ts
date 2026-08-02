/**
 * Shamar's memory intelligence.
 *
 * Notices moments that may be worth preserving and offers — never insists.
 * Every suggestion carries a stable key so a "No thanks" can be remembered
 * and the same suggestion is not offered again.
 *
 * Shamar never manufactures a memory: suggestions only ever restate what
 * Phindile herself has written or done.
 */

export const MEMORY_CATEGORIES = [
  { id: "photo", icon: "📸", label: "Photo Memory" },
  { id: "video", icon: "🎥", label: "Video Memory" },
  { id: "voice", icon: "🎙", label: "Voice Memory" },
  { id: "written", icon: "✍️", label: "Written Memory" },
  { id: "answered-prayer", icon: "🙏", label: "Answered Prayer" },
  { id: "gratitude", icon: "🌿", label: "Gratitude" },
  { id: "letter", icon: "💌", label: "Letter" },
  { id: "law-firm", icon: "⚖️", label: "Law Firm Milestone" },
  { id: "family", icon: "👩‍👧", label: "Family Memory" },
  { id: "friendship", icon: "❤️", label: "Friendship" },
  { id: "birthday", icon: "🎂", label: "Birthday" },
  { id: "growth", icon: "🌱", label: "Personal Growth" },
  { id: "god-wink", icon: "✨", label: "God Wink" },
  { id: "scripture", icon: "📖", label: "Scripture Reflection" },
] as const;

export type MemoryCategoryId = (typeof MEMORY_CATEGORIES)[number]["id"];

export const VISIBILITIES = [
  { id: "private", label: "Private", note: "For you alone" },
  { id: "family", label: "Family", note: "May be shared with family one day" },
  { id: "friends", label: "Friends", note: "May be shared with close friends" },
  { id: "legacy", label: "Future Legacy", note: "For the long-term family archive" },
] as const;

export type MemorySuggestion = {
  key: string;
  category: MemoryCategoryId;
  icon: string;
  message: string;
};

type Rule = {
  key: string;
  category: MemoryCategoryId;
  icon: string;
  message: string;
  cues: RegExp;
};

const RULES: Rule[] = [
  {
    key: "daughter",
    category: "family",
    icon: "👩‍👧",
    message: "This sounds like a moment you'll want to remember. Would you like to preserve it in your Family Memories?",
    cues: /\b(zane|my daughter|my girl|my child)\b/i,
  },
  {
    key: "sister",
    category: "written",
    icon: "✍️",
    message: "Would you like to add this reflection to the memories you keep of your sister?",
    cues: /\bmy sister\b|\bsister\b/i,
  },
  {
    key: "granny",
    category: "family",
    icon: "🌱",
    message: "Would you like to preserve this as part of Granny's legacy?",
    cues: /\b(granny|grandmother|grandma|gogo)\b/i,
  },
  {
    key: "law-firm",
    category: "law-firm",
    icon: "⚖️",
    message: "That's worth marking. Would you like to add this to your Law Firm Timeline?",
    cues: /\b(firm|client|case|court|matter|signed|instructed|hired|won)\b/i,
  },
  {
    key: "answered-prayer",
    category: "answered-prayer",
    icon: "🙏",
    message: "Would you like to record this in your Book of Testimonies?",
    cues: /\b(answered (my )?prayer|prayer was answered|he came through|god came through|breakthrough)\b/i,
  },
  {
    key: "gratitude",
    category: "gratitude",
    icon: "🌿",
    message: "Would you like to keep this as a note of gratitude?",
    cues: /\b(grateful|thankful|blessed|gratitude)\b/i,
  },
  {
    key: "birthday",
    category: "birthday",
    icon: "🎂",
    message: "Would you like to preserve this birthday moment?",
    cues: /\b(birthday|another year older|new year of life)\b/i,
  },
  {
    key: "growth",
    category: "growth",
    icon: "🌱",
    message: "That sounds like growth. Would you like to preserve it?",
    cues: /\b(i learned|i've grown|i have grown|first time i|i finally)\b/i,
  },
  {
    key: "god-wink",
    category: "god-wink",
    icon: "✨",
    message: "A small wonder. Would you like to keep this as a God Wink?",
    cues: /\b(god wink|out of nowhere|just in time|couldn't believe it|coincidence)\b/i,
  },
  {
    key: "friendship",
    category: "friendship",
    icon: "❤️",
    message: "Would you like to preserve this as a friendship memory?",
    cues: /\b(my friend|friendship|she showed up for me)\b/i,
  },
];

export const PHOTO_SUGGESTION: MemorySuggestion = {
  key: "photo-story",
  category: "photo",
  icon: "📸",
  message: "Would you like to tell me the story behind this photograph?",
};

/** Returns at most two gentle suggestions, skipping anything already declined. */
export function suggestMemories(text: string, declined: string[] = []): MemorySuggestion[] {
  const out: MemorySuggestion[] = [];
  for (const rule of RULES) {
    if (declined.includes(rule.key)) continue;
    if (rule.cues.test(text)) {
      out.push({ key: rule.key, category: rule.category, icon: rule.icon, message: rule.message });
      if (out.length === 2) break;
    }
  }
  return out;
}

export const MEMORY_PROMPTS = [
  "What made you smile today?",
  "What are you grateful for?",
  "What would you like your daughter to remember about today?",
  "What did God teach you this season?",
  "Is there something from today you don't want to forget?",
  "What prayer are you carrying right now?",
  "Is there a small moment from today worth preserving?",
];

export function promptOfTheDay(d = new Date()): string {
  const day = Math.floor(d.getTime() / 86_400_000);
  return MEMORY_PROMPTS[day % MEMORY_PROMPTS.length]!;
}

/** Human phrasing for an "On this day" resurfacing. */
export function yearsAgoLabel(memoryDate: string, today = new Date()): string | null {
  const [y, m, d] = memoryDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  if (m !== today.getMonth() + 1 || d !== today.getDate()) return null;
  const years = today.getFullYear() - y;
  if (years <= 0) return null;
  return years === 1 ? "one year ago" : `${years} years ago`;
}