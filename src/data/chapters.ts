export interface ChapterItem {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  scripture?: string;
  image?: string;
  placeholder?: boolean;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  theme?: string;
  verse?: string;
  closing?: string;
  items?: ChapterItem[];
}

export const chapters: Chapter[] = [
  {
    id: "before-time",
    number: "Chapter One",
    title: "Before Time Began",
    verse:
      "Before I formed you in the womb I knew you, before you were born I set you apart. — Jeremiah 1:5",
    theme: "God knew you before the world knew your name.",
    closing: "Before anyone knew your story, God was already writing it.",
    items: [
      { id: "whispered", title: "A Name Whispered in Eternity", body: "Before the world knew you, Heaven already did. He wrote your name before your first breath.", scripture: "Psalm 139:16" },
      { id: "first-breath", title: "First Breath", body: "The morning you arrived. A tiny bundle of promise, held for the very first time.", placeholder: true },
      { id: "little-one", title: "Little One", body: "Baby photograph — add here.", placeholder: true },
      { id: "childhood", title: "Childhood Days", body: "Where laughter lived and days were simple.", placeholder: true },
      { id: "pressed-flower", title: "A Pressed Flower", body: "A memory from the garden of childhood, kept between the pages of time." },
    ],
  },
  {
    id: "thus-far",
    number: "Chapter Two",
    title: "Thus Far",
    verse:
      "Then Samuel took a stone and set it up… and named it Ebenezer, saying, 'Thus far the Lord has helped us.' — 1 Samuel 7:12",
    theme: "God's faithfulness through every season.",
    closing: "Every season had a Shepherd. Every valley had a Guide.",
    items: [
      { id: "s1", title: "The Beginning", subtitle: "1991", body: "The day the story began." },
      { id: "s2", title: "Little Girl, Big Dreams", subtitle: "Childhood", body: "Where the seeds of purpose were planted." },
      { id: "s3", title: "Coming of Age", subtitle: "The teenage years", body: "Learning, growing, being shaped." },
      { id: "s4", title: "The Call to Law", subtitle: "University", body: "The moment purpose met preparation." },
      { id: "s5", title: "Motherhood", subtitle: "Zane", body: "The greatest calling of all." },
      { id: "s6", title: "The Firm", subtitle: "2021", body: "The dream God placed in her heart became a door." },
      { id: "s7", title: "Today", subtitle: "Chapter 34", body: "Thus far the Lord has helped her." },
    ],
  },
  {
    id: "garden",
    number: "Chapter Three",
    title: "The Garden That Helped You Bloom",
    theme: "The people whose love helped shape who you are.",
    closing: "You did not bloom alone. You were watered by love.",
    items: [
      { id: "granny", title: "Granny", body: "The steady hands that first taught her prayer. The lullabies still hum in her heart.", placeholder: true },
      { id: "sister", title: "Sister", body: "The first friend. The forever friend. The one who shares the same stories and the same blood.", placeholder: true },
      { id: "mother", title: "Mother", body: "The woman whose love became her first picture of grace." },
      { id: "father", title: "Father", body: "Strength, steadiness, a quiet kind of love." },
      { id: "mentor", title: "A Mentor", body: "One who saw what she could not yet see in herself." },
      { id: "add-yours", title: "Add Another Name", body: "A blossom left blank — for a name you would like to plant here." },
    ],
  },
  {
    id: "foundation",
    number: "Chapter Four",
    title: "Her Foundation",
    theme: "Everything she builds grows from these foundations.",
    closing: "These four pillars hold up a life built to last.",
    items: [
      { id: "god", title: "God", subtitle: "The Cornerstone", body: "Everything begins here. Everything returns here. The rock beneath every other pillar.", scripture: "Psalm 18:2" },
      { id: "family", title: "Family", subtitle: "The Home", body: "Where she is fully known and fully loved. The soil that keeps her rooted." },
      { id: "law", title: "Law", subtitle: "The Calling", body: "Justice as an act of worship. Serving people with excellence." },
      { id: "legacy", title: "Legacy", subtitle: "The Inheritance", body: "What she is building for those who will come after." },
    ],
  },
  {
    id: "woman",
    number: "Chapter Five",
    title: "The Woman You Have Become",
    theme: "Not titles. Callings.",
    closing: "You are not what you do. You are who He is making you.",
    items: [
      { id: "faith", title: "Woman of Faith", body: "Anchored, prayerful, believing even when the road is quiet." },
      { id: "mother", title: "Mother", body: "Zane's mother, first and always. A softness the world does not see." },
      { id: "partner", title: "Partner", body: "A love that walks beside, not behind." },
      { id: "lawyer", title: "Lawyer", body: "Sharp, prepared, principled. She fights so others can rest." },
      { id: "leader", title: "Leader", body: "The one others look to. The one who sets the tone." },
      { id: "owner", title: "Business Owner", body: "She built a place where dreams become work and work becomes purpose." },
      { id: "sister", title: "Sister", body: "Loyal. Present. Deeply loved." },
    ],
  },
  {
    id: "purpose",
    number: "Chapter Six",
    title: "Called With Purpose",
    theme: "Her calling through law.",
    closing: "What began as a dream became a doorway for others.",
    items: [
      { id: "dream", title: "The Dream", subtitle: "Before 2021", body: "A whisper. A conviction. A prayer she wouldn't stop praying." },
      { id: "opening", title: "Opening Day", subtitle: "2021", body: "Keys turned. Doors opened. The dream became an address." },
      { id: "first-client", title: "First Client", body: "The moment the calling put on a name." },
      { id: "first-employee", title: "First Employee", body: "The dream now belonged to more than one." },
      { id: "growth", title: "Growth", body: "New matters, new courts, new rooms in the office." },
      { id: "vision", title: "Vision Ahead", body: "What she is still praying toward. The next chapter of the firm." },
    ],
  },
  {
    id: "little-hands",
    number: "Chapter Seven",
    title: "Little Hands, Big Love",
    theme: "Her greatest calling.",
    closing: "Of every calling you carry, this one you carry closest to your heart.",
    items: [
      { id: "zane", title: "Zane", body: "The little heart that made her a mother. The reason for so many prayers of thanks." },
      { id: "drawing", title: "A Drawing on the Fridge", body: "Every scribble is a small love letter." },
      { id: "birthdays", title: "Birthdays", body: "Cakes, songs, silly hats, whole days set apart for one small person." },
      { id: "school", title: "School Days", body: "Uniforms, lunch boxes, and proud mama moments." },
      { id: "traditions", title: "Traditions", body: "The small rituals that turn a house into a home." },
      { id: "future", title: "Room for More", body: "A quiet prayer for the children God may still bring." },
    ],
  },
  {
    id: "letters",
    number: "Chapter Eight",
    title: "Letters for the Future",
    closing: "Look back, and remember His faithfulness.",
    items: [
      { id: "to-god", title: "To God", body: "Thank You. For every prayer answered, and every one still on the way." },
      { id: "to-zane", title: "To Zane", body: "My love, whatever chapter you are reading when you find this, know that I have loved you since before you knew your own name." },
      { id: "to-children", title: "To Future Children", body: "If God brings you, know that you were prayed for long before you were held." },
      { id: "to-self", title: "To My Future Self", body: "Be gentle with yourself. He has not brought you this far to leave you." },
      { id: "to-family", title: "To Family", body: "Thank you for being my beginning, and my belonging." },
    ],
  },
  {
    id: "faithfulness",
    number: "Chapter Nine",
    title: "God's Faithfulness",
    closing: "He has never once been late.",
    items: [
      { id: "p1", title: "A Prayer Answered", body: "The one you were sure was too big to ask." },
      { id: "p2", title: "Provision", body: "The month the numbers didn't add up, and somehow they did." },
      { id: "p3", title: "Healing", body: "The quiet miracle nobody else saw." },
      { id: "p4", title: "The Firm", body: "The dream that became a doorway." },
      { id: "p5", title: "Zane", body: "The prayer with a name and a heartbeat." },
      { id: "p6", title: "Peace in the Storm", body: "The night the fear didn't win." },
      { id: "p7", title: "Doors Opened", body: "The rooms He walked you into." },
      { id: "p8", title: "Doors Closed", body: "The mercies that felt like losses at the time." },
      { id: "p9", title: "A Whisper", body: "The moment you knew He was near." },
      { id: "p10", title: "The North Star", body: "The one constant when everything else moved." },
    ],
  },
  {
    id: "dreams",
    number: "Chapter Ten",
    title: "Dreams God Placed in Your Heart",
    closing: "The dreams He gives, He also carries.",
    items: [
      { id: "d1", title: "Open the Firm", subtitle: "Fulfilled", body: "The prayer that put on brick and mortar." },
      { id: "d2", title: "Become a Mother", subtitle: "Fulfilled", body: "Held answer, wrapped in a blanket." },
      { id: "d3", title: "See the World", subtitle: "Growing", body: "Places still waiting for her footprints." },
      { id: "d4", title: "Kingdom Impact", subtitle: "In progress", body: "Serving people the way He would." },
      { id: "d5", title: "A Home of Her Own", subtitle: "Believing", body: "The house that will hold the next chapter." },
      { id: "d6", title: "Write a Book", subtitle: "Believing", body: "One day, this story on paper." },
      { id: "d7", title: "Mentor Others", subtitle: "In progress", body: "Being for someone what her mentors were for her." },
      { id: "d8", title: "A Secret Dream", subtitle: "Held", body: "The one she has only whispered to God." },
    ],
  },
  {
    id: "memories",
    number: "Chapter Eleven",
    title: "Moments Worth Keeping",
    theme: "A library that grows forever.",
    closing: "This is a book that grows forever.",
    items: [
      { id: "2021", title: "2021", body: "The year the firm opened. A year of firsts." },
      { id: "2022", title: "2022", body: "Growth. Little routines becoming traditions." },
      { id: "2023", title: "2023", body: "Answered prayers, quiet ones." },
      { id: "2024", title: "2024", body: "Depth. Steadiness. A settling into who she is." },
      { id: "2025", title: "2025", body: "The year before this one — memories still warm." },
      { id: "2026", title: "2026 — Chapter 34", body: "This year. This chapter. This gift." },
      { id: "2027", title: "2027", body: "A blank album, waiting." },
      { id: "2028", title: "2028", body: "Another blank album, waiting." },
    ],
  },
  {
    id: "love-letter",
    number: "Chapter Twelve",
    title: "God's Love Letter",
    closing: "You are His. You have always been His.",
    items: [
      { id: "fear", title: "For Fear", scripture: "Isaiah 41:10", body: "Fear not, for I am with you; be not dismayed, for I am your God." },
      { id: "hope", title: "For Hope", scripture: "Jeremiah 29:11", body: "For I know the plans I have for you — plans to give you hope and a future." },
      { id: "peace", title: "For Peace", scripture: "John 14:27", body: "Peace I leave with you; my peace I give to you." },
      { id: "joy", title: "For Joy", scripture: "Nehemiah 8:10", body: "The joy of the Lord is your strength." },
      { id: "purpose", title: "For Purpose", scripture: "Ephesians 2:10", body: "You are His workmanship, created for good works prepared in advance." },
      { id: "grace", title: "For Grace", scripture: "2 Corinthians 12:9", body: "My grace is sufficient for you; my power is made perfect in weakness." },
      { id: "identity", title: "For Identity", scripture: "1 Peter 2:9", body: "You are a chosen people, a royal priesthood — His own possession." },
    ],
  },
  {
    id: "prayer",
    number: "Chapter Thirteen",
    title: "Prayer Room",
    closing: "Amen.",
    items: [
      { id: "prayers", title: "Prayers", body: "The ones still on the way. Held in confidence." },
      { id: "praises", title: "Praises", body: "For all He has already done." },
      { id: "answered", title: "Answered", body: "The prayers that already have testimonies." },
      { id: "devotionals", title: "Devotionals", body: "Small readings for quiet mornings." },
      { id: "worship", title: "Worship", body: "The songs that carry her." },
      { id: "studies", title: "Bible Studies", body: "The books of Scripture she is walking through." },
    ],
  },
  {
    id: "verdict",
    number: "Chapter Fourteen",
    title: "His Verdict",
    closing: "Case closed.",
    items: [
      { id: "loved", title: "Loved", body: "With an everlasting love." },
      { id: "forgiven", title: "Forgiven", body: "As far as the east is from the west." },
      { id: "redeemed", title: "Redeemed", body: "Bought with a price." },
      { id: "accepted", title: "Accepted", body: "In the Beloved." },
      { id: "free", title: "Free", body: "Whom the Son sets free is free indeed." },
    ],
  },
  {
    id: "legacy",
    number: "Chapter Fifteen",
    title: "Legacy",
    theme: "One faithful life can influence many generations.",
    closing: "Roots deep. Branches wide.",
    items: [
      { id: "tree", title: "The Family Tree", body: "Where she came from, and where she is going." },
      { id: "values", title: "Family Values", body: "Faith. Excellence. Kindness. Loyalty. Truth." },
      { id: "crest", title: "The Family Crest", body: "The symbols that carry her house." },
      { id: "blessings", title: "Jar of Blessings", body: "Every folded note a small mercy. The jar keeps filling." },
      { id: "capsule-35", title: "Time Capsule — 35th Birthday", body: "A letter waiting for one year from now.", placeholder: true },
      { id: "capsule-40", title: "Time Capsule — 40th Birthday", body: "A letter waiting for six years from now.", placeholder: true },
      { id: "capsule-zane", title: "Time Capsule — Zane at 18", body: "A letter waiting for the day he becomes a man.", placeholder: true },
      { id: "capsule-christmas", title: "Time Capsule — Christmas", body: "A letter to be opened by candlelight.", placeholder: true },
      { id: "capsule-decade", title: "Time Capsule — Ten Years From Now", body: "A letter waiting for a woman she has not yet become.", placeholder: true },
    ],
  },
  {
    id: "future",
    number: "Chapter Sixteen",
    title: "Future Chapters",
    theme: "There is no ending. Only another chapter waiting to be lived.",
    closing:
      "The Lord has been faithful in every chapter already written. He will be faithful in every chapter still to come.",
  },
];

export const dedication = {
  greeting: "To My Beautiful Sister",
  paragraphs: [
    "Today is more than your thirty-fourth birthday. Today begins another chapter.",
    "Not simply another year of life, but another year of God's faithfulness.",
    "Within these pages are memories, answered prayers, dreams, laughter, tears, and countless reminders that God has faithfully walked beside you through every season.",
    "My hope is that whenever life feels uncertain, you'll return to these pages, remember His goodness, and continue writing the beautiful story He is unfolding through your life.",
    "Because every chapter — both joyful and difficult — reveals His faithfulness.",
  ],
  motto: "Every Chapter Tells the Story of God's Faithfulness.",
  signature: "With all my love,\nYour Sister",
};