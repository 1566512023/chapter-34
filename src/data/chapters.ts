export interface Chapter {
  id: string;
  number: string;
  title: string;
  theme?: string;
  verse?: string;
  body: string[];
  closing?: string;
  transition?: string;
}

export const chapters: Chapter[] = [
  {
    id: "prologue",
    number: "Prologue",
    title: "The Invitation",
    theme:
      "This is not a birthday website. This is the beginning of another chapter in a life shaped by God's faithfulness.",
    body: [
      "An antique writing desk waits in the quiet of morning.",
      "An envelope rests at its centre, the wax seal already broken.",
      "A handwritten letter unfolds itself, letter by letter.",
      "And then, as the final sentence is written, the ink transforms into golden light.",
    ],
    closing:
      "The light settles onto the pages of a beautifully bound leather journal, and the story begins.",
    transition: "The bookmark lifts gently. Chapter 34 fades into view.",
  },
  {
    id: "chapter-1",
    number: "Chapter One",
    title: "Before Time Began",
    verse:
      "Before I formed you in the womb I knew you, before you were born I set you apart. — Jeremiah 1:5",
    theme: "God knew you before the world knew your name.",
    body: [
      "This chapter feels like dawn.",
      "Before anyone had spoken your name aloud, He had already whispered it into eternity.",
      "Baby photographs fade softly into view, cradled by pressed flowers and morning clouds.",
      "Childhood memories appear as if handwritten into these pages over many, many years.",
    ],
    closing:
      "Before anyone knew your story, God was already writing it.",
    transition: "The childhood photographs blend into an illuminated timeline.",
  },
  {
    id: "chapter-2",
    number: "Chapter Two",
    title: "Thus Far",
    verse:
      "Then Samuel took a stone and set it up… and named it Ebenezer, saying, 'Thus far the Lord has helped us.' — 1 Samuel 7:12",
    theme: "God's faithfulness through every season.",
    body: [
      "A winding golden timeline stretches across the page like flowing ink.",
      "Every milestone becomes an Ebenezer Stone — a marker of grace.",
      "Each stone remembers a prayer once whispered, a burden once carried, a mercy once received.",
    ],
    closing: "Every season had a Shepherd. Every valley had a Guide.",
    transition: "A vine begins to grow from the final stone, blossoming into a garden.",
  },
  {
    id: "chapter-3",
    number: "Chapter Three",
    title: "The Garden That Helped You Bloom",
    theme: "The people whose love helped shape who you are.",
    body: [
      "Wander gently through a peaceful garden.",
      "Flowers bloom when touched. Butterflies carry small memories on their wings.",
      "Birdsong drifts softly across the page, and photographs appear tucked inside pressed petals.",
      "This is a garden of gratitude — every bloom a name, every leaf a kindness remembered.",
    ],
    closing: "You did not bloom alone. You were watered by love.",
    transition: "The garden widens. Its roots become four glowing pillars.",
  },
  {
    id: "chapter-4",
    number: "Chapter Four",
    title: "Her Foundation",
    theme: "Everything she builds grows from these foundations.",
    body: [
      "Four elegant pillars rise slowly from the roots.",
      "God. Family. Law. Legacy.",
      "Each pillar carries Scripture, memory, and reflection.",
      "Sunlight pours over the page like a benediction — standing here should feel like standing inside a cathedral of gratitude.",
    ],
    closing: "These four pillars hold up a life built to last.",
    transition:
      "The pillars become streams of golden light, gently surrounding a silhouette that slowly becomes the woman she is today.",
  },
  {
    id: "chapter-5",
    number: "Chapter Five",
    title: "The Woman You Have Become",
    theme: "Not titles. Callings.",
    body: [
      "Woman of Faith.",
      "Mother.",
      "Life Partner.",
      "Friend.",
      "Leader.",
      "Lawyer.",
      "Business Owner.",
      "Each identity opens gently, like an illustrated card in a keepsake box.",
    ],
    closing: "You are not what you do. You are who He is making you.",
    transition:
      "The Business Owner card lingers open, its illustration slowly becoming the entrance of her law firm.",
  },
  {
    id: "chapter-6",
    number: "Chapter Six",
    title: "Called With Purpose",
    theme: "Her calling through the law.",
    body: [
      "The page becomes an elegant legal case file.",
      "2021 — the dream.",
      "Opening day. First client. First employee.",
      "Growth. Vision for what is still to come.",
      "Every milestone opens with photographs and quiet reflections.",
    ],
    closing: "What began as a dream became a doorway for others.",
    transition:
      "A legal brief gently closes. A child's drawing slips out from inside the folder and lands softly on the next page.",
  },
  {
    id: "chapter-7",
    number: "Chapter Seven",
    title: "Little Hands, Big Love",
    theme: "Her greatest calling.",
    body: [
      "Warm. Playful. Joyful.",
      "Watercolour illustrations. Photographs. Little letters.",
      "Voice recordings and mother-and-daughter memories.",
      "The kind of pages you never want to close.",
    ],
    closing: "Of every calling you carry, this one you carry closest to your heart.",
    transition:
      "Her daughter places a tiny envelope into an old keepsake box. The box slowly opens.",
  },
  {
    id: "chapter-8",
    number: "Chapter Eight",
    title: "Letters for the Future",
    body: [
      "Tiny envelopes fill an antique wooden drawer.",
      "Each letter begins with Scripture.",
      "Each one unfolds with handwritten animations, patient and unhurried.",
    ],
    closing: "Look back, and remember His faithfulness.",
    transition: "The ink slowly becomes stars.",
  },
  {
    id: "chapter-9",
    number: "Chapter Nine",
    title: "God's Faithfulness",
    body: [
      "Stars slowly become answered prayers.",
      "Miracles. Provision. Healing.",
      "Every testimony glows softly in the night sky, a small light against the dark.",
    ],
    closing: "He has never once been late.",
    transition: "One star continues rising. It becomes the North Star.",
  },
  {
    id: "chapter-10",
    number: "Chapter Ten",
    title: "Dreams God Placed in Your Heart",
    body: [
      "Travel. Purpose. Kingdom impact. Future prayers.",
      "Completed dreams sparkle like held stars.",
      "Unfulfilled dreams glow gently, patient and expectant.",
    ],
    closing: "The dreams He gives, He also carries.",
    transition: "A photograph falls onto the dream board. Then another. Then another. They become an album.",
  },
  {
    id: "chapter-11",
    number: "Chapter Eleven",
    title: "Moments Worth Keeping",
    theme: "The Book of Memories.",
    body: [
      "Years appear as beautifully bound albums.",
      "2026. 2027. 2028.",
      "And every year, another volume added to the shelf.",
    ],
    closing: "This is a book that grows forever.",
    transition: "One photograph lifts from the album, gently flips over, and reads: You are deeply loved.",
  },
  {
    id: "chapter-12",
    number: "Chapter Twelve",
    title: "God's Love Letter",
    body: [
      "Bible promises. Identity in Christ. Scripture. Peace. Grace.",
      "Every promise appears as a handwritten love letter, addressed to you by name.",
    ],
    closing: "You are His. You have always been His.",
    transition: "A bookmark slides into the Bible. When lifted, it becomes a prayer ribbon.",
  },
  {
    id: "chapter-13",
    number: "Chapter Thirteen",
    title: "Prayer Room",
    body: [
      "Candles. A prayer journal. A praise journal. Favourite worship.",
      "Quiet reflection.",
      "Everything here slows down.",
    ],
    closing: "Amen.",
    transition: "The candle slowly extinguishes. A courtroom door quietly opens.",
  },
  {
    id: "chapter-14",
    number: "Chapter Fourteen",
    title: "His Verdict",
    body: [
      "Case Name: A Life Redeemed.",
      "Judge: The Lord.",
      "Advocate: Jesus Christ.",
      "Verdict: Loved. Forgiven. Redeemed. Accepted. Free.",
    ],
    closing: "Case closed.",
    transition: "The stamp becomes a wax seal.",
  },
  {
    id: "chapter-15",
    number: "Chapter Fifteen",
    title: "34 Reasons You're Loved",
    body: [
      "Thirty-four beautifully illustrated cards.",
      "Each one flips to reveal a reason held close.",
      "And every birthday, another card is added to the deck.",
    ],
    closing: "You are loved in more ways than any single page could hold.",
    transition: "The final card folds into a paper note and drops into a glass jar.",
  },
  {
    id: "chapter-16",
    number: "Chapter Sixteen",
    title: "Jar of Blessings",
    body: [
      "Every blessing becomes another folded note.",
      "The jar slowly fills over the years, one small mercy at a time.",
    ],
    closing: "Small mercies, gathered, become an overflow.",
    transition: "As the jar overflows, paper notes become leaves.",
  },
  {
    id: "chapter-17",
    number: "Chapter Seventeen",
    title: "Gratitude Tree",
    body: [
      "Every entry grows another leaf.",
      "The tree changes with every season.",
      "Spring. Summer. Autumn. Winter.",
      "And through it all, still rooted.",
    ],
    closing: "Gratitude keeps the roots deep.",
    transition: "A leaf drifts from the tree and lands inside an antique time capsule.",
  },
  {
    id: "chapter-18",
    number: "Chapter Eighteen",
    title: "Time Capsule",
    body: [
      "Letters locked for the future.",
      "35th Birthday. 40th Birthday.",
      "When your daughter turns eighteen.",
      "Christmas. Ten years from now.",
    ],
    closing: "The lock gently clicks. The camera slowly rises into the stars.",
    transition: "The stars themselves become chapters.",
  },
  {
    id: "epilogue",
    number: "Epilogue",
    title: "Future Chapters",
    body: [
      "The stars become chapters.",
      "Chapter 35. Chapter 36. Chapter 37. Chapter 38.",
      "They continue forever.",
      "One star shines brighter than the rest. It becomes the bookmark resting inside the leather journal.",
    ],
    closing:
      "The Lord has been faithful in every chapter already written. He will be faithful in every chapter still to come.",
  },
];

export const dedication = {
  greeting: "To My Beautiful Friend",
  paragraphs: [
    "Today is more than your thirty-fourth birthday. Today begins another chapter.",
    "Not simply another year of life, but another year of God's faithfulness.",
    "Within these pages are memories, answered prayers, dreams, laughter, tears, and countless reminders that God has faithfully walked beside you through every season.",
    "My hope is that whenever life feels uncertain, you'll return to these pages, remember His goodness, and continue writing the beautiful story He is unfolding through your life.",
    "Because every chapter — both joyful and difficult — reveals His faithfulness.",
  ],
  motto: "Every Chapter Tells the Story of God's Faithfulness.",
  signature: "With all my love,\nYour Best Friend",
};