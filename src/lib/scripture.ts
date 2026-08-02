/**
 * Shamar's Scripture library.
 *
 * Verse text is the World English Bible (WEB), a public-domain translation.
 * References are stored separately from text so a different translation can be
 * offered later (see `user_preferences.translation`) without re-authoring the
 * themes. Shamar never invents or paraphrases a verse: if a reference is not in
 * this library, it must offer the reference only and say the text is not stored.
 */

export const DEFAULT_TRANSLATION = "WEB";

export const AVAILABLE_TRANSLATIONS = [
  { id: "WEB", label: "World English Bible (public domain)", available: true },
  { id: "KJV", label: "King James Version", available: false },
  { id: "NIV", label: "New International Version", available: false },
  { id: "ESV", label: "English Standard Version", available: false },
  { id: "NLT", label: "New Living Translation", available: false },
];

export type Verse = { reference: string; text: string };

const V: Record<string, string> = {
  "Philippians 4:6-7":
    "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.",
  "Isaiah 41:10":
    "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.",
  "Matthew 6:25-27":
    "Therefore I tell you, don't be anxious for your life: what you will eat, or what you will drink; nor yet for your body, what you will wear. Isn't life more than food, and the body more than clothing? See the birds of the sky, that they don't sow, neither do they reap, nor gather into barns. Your heavenly Father feeds them. Aren't you of much more value than they?",
  "1 Peter 5:7": "casting all your worries on him, because he cares for you.",
  "Psalm 94:19":
    "In the multitude of my thoughts within me, your comforts delight my soul.",
  "Psalm 56:3": "When I am afraid, I will put my trust in you.",
  "2 Timothy 1:7":
    "For God didn't give us a spirit of fear, but of power, love, and self-control.",
  "Psalm 27:1":
    "The LORD is my light and my salvation. Whom shall I fear? The LORD is the strength of my life. Of whom shall I be afraid?",
  "Joshua 1:9":
    "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for the LORD your God is with you wherever you go.",
  "Psalm 34:18":
    "The LORD is near to those who have a broken heart, and saves those who have a crushed spirit.",
  "Matthew 5:4": "Blessed are those who mourn, for they shall be comforted.",
  "Revelation 21:4":
    "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain any more. The first things have passed away.",
  "John 11:25-26":
    "Jesus said to her, \u201cI am the resurrection and the life. He who believes in me will still live, even if he dies. Whoever lives and believes in me will never die.\u201d",
  "Psalm 147:3": "He heals the broken in heart, and binds up their wounds.",
  "2 Corinthians 1:3-4":
    "Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort; who comforts us in all our affliction, that we may be able to comfort those who are in any affliction, through the comfort with which we ourselves are comforted by God.",
  "Psalm 42:11":
    "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, the saving help of my countenance, and my God.",
  "Psalm 30:5":
    "Weeping may stay for the night, but joy comes in the morning.",
  "Deuteronomy 31:6":
    "Be strong and courageous. Don't be afraid or scared of them; for the LORD your God himself is who goes with you. He will not fail you nor forsake you.",
  "Hebrews 13:5":
    "Be free from the love of money, content with such things as you have, for he has said, \u201cI will in no way leave you, neither will I in any way forsake you.\u201d",
  "Psalm 68:6": "God sets the lonely in families.",
  "Nehemiah 8:10": "Don't be grieved, for the joy of the LORD is your strength.",
  "Psalm 16:11":
    "You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.",
  "John 15:11":
    "I have spoken these things to you, that my joy may remain in you, and that your joy may be made full.",
  "1 Thessalonians 5:16-18":
    "Always rejoice. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.",
  "Psalm 107:1":
    "Give thanks to the LORD, for he is good, for his loving kindness endures forever.",
  "Colossians 3:15-17":
    "Let the peace of God rule in your hearts, to which also you were called in one body, and be thankful. And whatever you do, in word or in deed, do all in the name of the Lord Jesus, giving thanks to God the Father through him.",
  "Psalm 103:2": "Praise the LORD, my soul, and don't forget all his benefits.",
  "Romans 15:13":
    "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope in the power of the Holy Spirit.",
  "Jeremiah 29:11":
    "For I know the thoughts that I think toward you, says the LORD, thoughts of peace, and not of evil, to give you hope and a future.",
  "Lamentations 3:22-23":
    "It is because of the LORD's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness.",
  "John 14:27":
    "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don't let your heart be troubled, neither let it be fearful.",
  "Isaiah 26:3":
    "You will keep whoever's mind is steadfast in perfect peace, because he trusts in you.",
  "Psalm 4:8":
    "In peace I will both lay myself down and sleep, for you alone, LORD, make me live in safety.",
  "Isaiah 40:31":
    "But those who wait for the LORD will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.",
  "Philippians 4:13":
    "I can do all things through Christ, who strengthens me.",
  "Psalm 46:1":
    "God is our refuge and strength, a very present help in trouble.",
  "2 Corinthians 12:9":
    "He has said to me, \u201cMy grace is sufficient for you, for my power is made perfect in weakness.\u201d",
  "1 Corinthians 16:13":
    "Watch! Stand firm in the faith! Be courageous! Be strong!",
  "Psalm 31:24":
    "Be strong, and let your heart take courage, all you who hope in the LORD.",
  "James 1:5":
    "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.",
  "Proverbs 3:5-6":
    "Trust in the LORD with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.",
  "1 Corinthians 14:33": "for God is not a God of confusion, but of peace.",
  "Mark 9:24": "Immediately the father of the child cried out with tears, \u201cI believe. Help my unbelief!\u201d",
  "James 1:6":
    "But let him ask in faith, without any doubting, for he who doubts is like a wave of the sea, driven by the wind and tossed.",
  "Psalm 27:14":
    "Wait for the LORD. Be strong, and let your heart take courage. Yes, wait for the LORD.",
  "Habakkuk 2:3":
    "For the vision is yet for the appointed time, and it hurries toward the end, and won't prove false. Though it takes time, wait for it, because it will surely come. It won't delay.",
  "Romans 8:25":
    "But if we hope for that which we don't see, we wait for it with patience.",
  "Ecclesiastes 3:1":
    "For everything there is a season, and a time for every purpose under heaven.",
  "Galatians 6:9":
    "Let's not be weary in doing good, for we will reap in due season, if we don't give up.",
  "Colossians 3:13":
    "bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.",
  "Ephesians 4:31-32":
    "Let all bitterness, wrath, anger, outcry, and slander be put away from you, with all malice. And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.",
  "Matthew 6:14":
    "For if you forgive men their trespasses, your heavenly Father will also forgive you.",
  "1 John 1:9":
    "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.",
  "Romans 8:1":
    "There is therefore now no condemnation to those who are in Christ Jesus.",
  "Psalm 103:12":
    "As far as the east is from the west, so far has he removed our transgressions from us.",
  "Isaiah 61:7":
    "Instead of your shame you will have double; and instead of dishonor they will rejoice in their portion.",
  "Psalm 34:5":
    "They looked to him, and were radiant. Their faces shall never be covered with shame.",
  "James 1:19-20":
    "So, then, my beloved brothers, let every man be swift to hear, slow to speak, and slow to anger; for the anger of man doesn't produce the righteousness of God.",
  "Proverbs 15:1":
    "A gentle answer turns away wrath, but a harsh word stirs up anger.",
  "Ephesians 4:26": "\u201cBe angry, and don't sin.\u201d Don't let the sun go down on your wrath.",
  "Romans 5:3-5":
    "Not only this, but we also rejoice in our sufferings, knowing that suffering produces perseverance; and perseverance, proven character; and proven character, hope; and hope doesn't disappoint us, because God's love has been poured into our hearts through the Holy Spirit who was given to us.",
  "Psalm 73:26":
    "My flesh and my heart fails, but God is the strength of my heart and my portion forever.",
  "1 Peter 2:4":
    "coming to him, a living stone, rejected indeed by men, but chosen by God, precious.",
  "Psalm 27:10":
    "When my father and my mother forsake me, then the LORD will take me up.",
  "Psalm 51:17":
    "The sacrifices of God are a broken spirit. A broken and contrite heart, O God, you will not despise.",
  "1 Corinthians 13:4-7":
    "Love is patient and is kind. Love doesn't envy. Love doesn't brag, is not proud, doesn't behave itself inappropriately, doesn't seek its own way, is not provoked, takes no account of evil; doesn't rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, endures all things.",
  "1 John 4:19": "We love him, because he first loved us.",
  "Proverbs 17:17":
    "A friend loves at all times; and a brother is born for adversity.",
  "Ecclesiastes 4:9-10":
    "Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow; but woe to him who is alone when he falls, and doesn't have another to lift him up.",
  "Proverbs 27:17":
    "Iron sharpens iron; so a man sharpens his friend's countenance.",
  "Joshua 24:15":
    "But as for me and my house, we will serve the LORD.",
  "Psalm 127:3":
    "Behold, children are a heritage of the LORD. The fruit of the womb is his reward.",
  "Proverbs 22:6":
    "Train up a child in the way he should go, and when he is old he will not depart from it.",
  "Deuteronomy 6:6-7":
    "These words, which I command you today, shall be on your heart; and you shall teach them diligently to your children, and shall talk of them when you sit in your house, and when you walk by the way, and when you lie down, and when you rise up.",
  "Proverbs 31:25-26":
    "Strength and dignity are her clothing. She laughs at the time to come. She opens her mouth with wisdom. Kind instruction is on her tongue.",
  "Isaiah 66:13":
    "As one whom his mother comforts, so I will comfort you.",
  "Ecclesiastes 4:12":
    "If a man prevails against one who is alone, two shall withstand him; and a threefold cord is not quickly broken.",
  "1 Corinthians 13:13":
    "But now faith, hope, and love remain\u2014these three. The greatest of these is love.",
  "Ephesians 2:10":
    "For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.",
  "Romans 8:28":
    "We know that all things work together for good for those who love God, for those who are called according to his purpose.",
  "Jeremiah 1:5":
    "Before I formed you in the womb, I knew you. Before you were born, I sanctified you.",
  "Psalm 138:8":
    "The LORD will fulfill that which concerns me. Your loving kindness, LORD, endures forever.",
  "Colossians 3:23-24":
    "And whatever you do, work heartily, as for the Lord, and not for men, knowing that from the Lord you will receive the reward of the inheritance.",
  "Proverbs 16:3":
    "Commit your deeds to the LORD, and your plans shall succeed.",
  "Proverbs 11:14":
    "Where there is no wise guidance, the nation falls, but in the multitude of counselors there is victory.",
  "Micah 6:8":
    "He has shown you, O man, what is good. What does the LORD require of you, but to act justly, to love mercy, and to walk humbly with your God?",
  "Isaiah 1:17":
    "Learn to do well. Seek justice. Relieve the oppressed. Defend the fatherless. Plead for the widow.",
  "Proverbs 31:8-9":
    "Open your mouth for the mute, in the cause of all who are left desolate. Open your mouth, judge righteously, and serve justice to the poor and needy.",
  "Deuteronomy 16:20":
    "You shall follow that which is altogether just, that you may live and inherit the land which the LORD your God gives you.",
  "Proverbs 16:11":
    "Honest balances and scales are the LORD's; all the weights in the bag are his work.",
  "Luke 22:26":
    "But not so with you. Rather, the one who is greater among you, let him become as the younger, and one who is governing, as one who serves.",
  "1 Peter 5:2-3":
    "Shepherd the flock of God which is among you, exercising the oversight, not under compulsion, but voluntarily; not for dishonest gain, but willingly; not as lording it over those entrusted to you, but making yourselves examples to the flock.",
  "Proverbs 29:18":
    "Where there is no revelation, the people cast off restraint; but one who keeps the law is blessed.",
  "Luke 16:10":
    "He who is faithful in a very little is faithful also in much; and he who is dishonest in a very little is also dishonest in much.",
  "Matthew 25:21":
    "His lord said to him, \u201cWell done, good and faithful servant. You have been faithful over a few things, I will set you over many things.\u201d",
  "Proverbs 24:16":
    "for a righteous man falls seven times and rises up again; but the wicked are overthrown by calamity.",
  "Philippians 3:13-14":
    "Brothers, I don't regard myself as yet having taken hold, but one thing I do: forgetting the things which are behind, and stretching forward to the things which are before, I press on toward the goal for the prize of the high calling of God in Christ Jesus.",
  "Isaiah 43:18-19":
    "Don't remember the former things, and don't consider the things of old. Behold, I will do a new thing. It springs out now. Don't you know it? I will even make a way in the wilderness, and rivers in the desert.",
  "2 Corinthians 5:17":
    "Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.",
  "Hebrews 13:8":
    "Jesus Christ is the same yesterday, today, and forever.",
  "Jeremiah 17:14":
    "Heal me, O LORD, and I shall be healed. Save me, and I shall be saved; for you are my praise.",
  "Psalm 103:2-3":
    "Praise the LORD, my soul, and don't forget all his benefits, who forgives all your sins, who heals all your diseases.",
  "Matthew 11:28-30":
    "Come to me, all you who labor and are heavily burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart; and you will find rest for your souls. For my yoke is easy, and my burden is light.",
  "Psalm 23:1-3":
    "The LORD is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
  "Exodus 33:14":
    "He said, \u201cMy presence will go with you, and I will give you rest.\u201d",
  "Mark 6:31":
    "He said to them, \u201cYou come apart into a deserted place, and rest awhile.\u201d",
  "Psalm 55:22":
    "Cast your burden on the LORD and he will sustain you. He will never allow the righteous to be moved.",
  "Proverbs 16:9":
    "A man's heart plans his course, but the LORD directs his steps.",
  "Psalm 32:8":
    "I will instruct you and teach you in the way which you shall go. I will counsel you with my eye on you.",
  "Isaiah 30:21":
    "and when you turn to the right hand, and when you turn to the left, your ears will hear a voice behind you, saying, \u201cThis is the way. Walk in it.\u201d",
  "James 3:17":
    "But the wisdom that is from above is first pure, then peaceful, gentle, reasonable, full of mercy and good fruits, without partiality, and without hypocrisy.",
  "Proverbs 9:10":
    "The fear of the LORD is the beginning of wisdom. The knowledge of the Holy One is understanding.",
  "Philippians 4:19":
    "My God will supply every need of yours according to his riches in glory in Christ Jesus.",
  "Matthew 6:33":
    "But seek first God's Kingdom and his righteousness; and all these things will be given to you as well.",
  "Psalm 37:25":
    "I have been young, and now am old, yet I have not seen the righteous forsaken, nor his children begging for bread.",
  "Malachi 3:10":
    "\u201cBring the whole tithe into the storehouse... and test me now in this,\u201d says the LORD of Armies, \u201cif I will not open you the windows of heaven, and pour you out a blessing, that there will not be room enough for.\u201d",
  "Hebrews 12:1-2":
    "let's also lay aside every weight and the sin which so easily entangles us, and let's run with perseverance the race that is set before us, looking to Jesus, the author and perfecter of faith.",
  "1 Corinthians 10:13":
    "No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able, but will with the temptation also make the way of escape, that you may be able to endure it.",
  "Hebrews 11:1":
    "Now faith is assurance of things hoped for, proof of things not seen.",
  "Proverbs 3:5": "Trust in the LORD with all your heart, and don't lean on your own understanding.",
  "Psalm 62:8":
    "Trust in him at all times, you people. Pour out your heart before him. God is a refuge for us.",
  "1 John 5:14":
    "This is the boldness which we have toward him, that if we ask anything according to his will, he listens to us.",
  "Matthew 7:7":
    "Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you.",
  "Psalm 150:6": "Let everything that has breath praise the LORD!",
  "Psalm 100:4-5":
    "Enter into his gates with thanksgiving, and into his courts with praise. Give thanks to him, and bless his name. For the LORD is good. His loving kindness endures forever; his faithfulness to all generations.",
  "Deuteronomy 7:9":
    "Know therefore that the LORD your God himself is God, the faithful God, who keeps covenant and loving kindness with them who love him and keep his commandments to a thousand generations.",
  "Psalm 77:11":
    "I will remember the LORD's deeds; for I will remember your wonders of old.",
  "Psalm 145:4":
    "One generation will commend your works to another, and will declare your mighty acts.",
  "Proverbs 13:22":
    "A good man leaves an inheritance to his children's children.",
  "Psalm 78:4":
    "We will not hide them from their children, telling to the generation to come the praises of the LORD, his strength, and his wondrous deeds that he has done.",
  "Psalm 71:18":
    "Yes, even when I am old and gray-haired, God, don't forsake me, until I have declared your strength to the next generation.",
  "Psalm 90:12":
    "So teach us to count our days, that we may gain a heart of wisdom.",
  "Psalm 65:11":
    "You crown the year with your bounty. Your carts overflow with abundance.",
  "Numbers 6:24-26":
    "The LORD bless you, and keep you. The LORD make his face to shine on you, and be gracious to you. The LORD lift up his face toward you, and give you peace.",
  "1 Samuel 7:12":
    "Then Samuel took a stone and set it between Mizpah and Shen, and called its name Ebenezer, saying, \u201cThe LORD helped us until now.\u201d",
  "Psalm 121:8":
    "The LORD will keep your going out and your coming in, from this time forward, and forever more.",
  "Psalm 118:24":
    "This is the day that the LORD has made. We will rejoice and be glad in it!",
  "Psalm 139:14":
    "I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.",
  "Isaiah 43:2":
    "When you pass through the waters, I will be with you, and through the rivers, they will not overflow you.",
  "Psalm 91:1-2":
    "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty. I will say of the LORD, \u201cHe is my refuge and my fortress; my God, in whom I trust.\u201d",
};

/** Theme -> ordered list of references. */
export const THEMES: Record<string, string[]> = {
  Anxiety: ["Philippians 4:6-7", "Isaiah 41:10", "Matthew 6:25-27", "1 Peter 5:7"],
  Fear: ["Psalm 56:3", "2 Timothy 1:7", "Psalm 27:1", "Isaiah 41:10"],
  Grief: ["Psalm 34:18", "Matthew 5:4", "Revelation 21:4", "2 Corinthians 1:3-4"],
  Sadness: ["Psalm 42:11", "Psalm 30:5", "Psalm 147:3"],
  Loneliness: ["Deuteronomy 31:6", "Hebrews 13:5", "Psalm 68:6", "Psalm 27:10"],
  Joy: ["Nehemiah 8:10", "Psalm 16:11", "John 15:11"],
  Gratitude: ["1 Thessalonians 5:16-18", "Psalm 107:1", "Colossians 3:15-17", "Psalm 103:2"],
  Hope: ["Romans 15:13", "Jeremiah 29:11", "Lamentations 3:22-23"],
  Peace: ["John 14:27", "Isaiah 26:3", "Psalm 4:8", "Philippians 4:6-7"],
  Strength: ["Isaiah 40:31", "Philippians 4:13", "Psalm 46:1", "2 Corinthians 12:9"],
  Courage: ["Joshua 1:9", "1 Corinthians 16:13", "Psalm 31:24", "Deuteronomy 31:6"],
  Confusion: ["James 1:5", "Proverbs 3:5-6", "1 Corinthians 14:33"],
  Doubt: ["Mark 9:24", "James 1:6", "Hebrews 11:1"],
  Waiting: ["Psalm 27:14", "Habakkuk 2:3", "Isaiah 40:31", "Romans 8:25"],
  Patience: ["Ecclesiastes 3:1", "Galatians 6:9", "Romans 8:25"],
  Forgiveness: ["Colossians 3:13", "Ephesians 4:31-32", "Matthew 6:14"],
  Guilt: ["1 John 1:9", "Romans 8:1", "Psalm 103:12"],
  Shame: ["Isaiah 61:7", "Psalm 34:5", "Romans 8:1"],
  Anger: ["James 1:19-20", "Proverbs 15:1", "Ephesians 4:26"],
  Frustration: ["Galatians 6:9", "Proverbs 15:1", "Psalm 37:25"],
  Disappointment: ["Romans 5:3-5", "Psalm 73:26", "Proverbs 3:5-6"],
  Rejection: ["1 Peter 2:4", "Psalm 27:10", "Psalm 139:14"],
  Heartbreak: ["Psalm 147:3", "Psalm 34:18", "Psalm 51:17"],
  Love: ["1 Corinthians 13:4-7", "1 John 4:19", "1 Corinthians 13:13"],
  Friendship: ["Proverbs 17:17", "Ecclesiastes 4:9-10", "Proverbs 27:17"],
  Family: ["Joshua 24:15", "Psalm 127:3", "Deuteronomy 6:6-7"],
  Motherhood: ["Proverbs 31:25-26", "Isaiah 66:13", "Psalm 127:3"],
  Parenting: ["Proverbs 22:6", "Deuteronomy 6:6-7", "Psalm 127:3"],
  "Marriage / Partnership": ["Ecclesiastes 4:12", "1 Corinthians 13:4-7", "Colossians 3:13"],
  Purpose: ["Ephesians 2:10", "Romans 8:28", "Psalm 138:8"],
  Calling: ["Jeremiah 1:5", "Ephesians 2:10", "Romans 8:28"],
  Leadership: ["Luke 22:26", "1 Peter 5:2-3", "Proverbs 11:14"],
  Work: ["Colossians 3:23-24", "Proverbs 16:3", "Luke 16:10"],
  Business: ["Proverbs 16:3", "Proverbs 16:11", "Luke 16:10"],
  Law: ["Micah 6:8", "Proverbs 16:11", "Deuteronomy 16:20"],
  Justice: ["Isaiah 1:17", "Proverbs 31:8-9", "Micah 6:8"],
  Success: ["Matthew 25:21", "Proverbs 16:3", "Psalm 90:12"],
  Failure: ["Proverbs 24:16", "Philippians 3:13-14", "2 Corinthians 12:9"],
  Change: ["Isaiah 43:18-19", "Hebrews 13:8", "Ecclesiastes 3:1"],
  "New beginnings": ["2 Corinthians 5:17", "Isaiah 43:18-19", "Lamentations 3:22-23"],
  Loss: ["Revelation 21:4", "Psalm 34:18", "John 11:25-26"],
  Healing: ["Jeremiah 17:14", "Psalm 103:2-3", "Psalm 147:3"],
  Rest: ["Matthew 11:28-30", "Psalm 23:1-3", "Exodus 33:14"],
  Burnout: ["Matthew 11:28-30", "Mark 6:31", "Isaiah 40:31"],
  Stress: ["Psalm 55:22", "Matthew 11:28-30", "Philippians 4:6-7"],
  "Decision-making": ["Proverbs 16:9", "Psalm 32:8", "Isaiah 30:21", "James 1:5"],
  Wisdom: ["James 3:17", "Proverbs 9:10", "James 1:5"],
  Provision: ["Philippians 4:19", "Matthew 6:33", "Psalm 37:25"],
  "Financial pressure": ["Matthew 6:33", "Philippians 4:19", "Malachi 3:10"],
  Perseverance: ["Hebrews 12:1-2", "Galatians 6:9", "Romans 5:3-5"],
  Temptation: ["1 Corinthians 10:13", "Hebrews 12:1-2"],
  Faith: ["Hebrews 11:1", "Mark 9:24", "Romans 8:28"],
  Trust: ["Proverbs 3:5", "Psalm 62:8", "Isaiah 26:3"],
  Prayer: ["1 John 5:14", "Matthew 7:7", "Philippians 4:6-7"],
  Praise: ["Psalm 150:6", "Psalm 100:4-5", "Psalm 103:2"],
  Thankfulness: ["Psalm 100:4-5", "1 Thessalonians 5:16-18", "Psalm 107:1"],
  "Her daughter": ["Psalm 127:3", "Proverbs 22:6", "Deuteronomy 6:6-7"],
  "Her law firm": ["Micah 6:8", "Colossians 3:23-24", "Proverbs 16:3"],
  "Business growth": ["Luke 16:10", "Proverbs 11:14", "Matthew 25:21"],
  "Grieving her sister": ["John 11:25-26", "Psalm 34:18", "Revelation 21:4", "Matthew 5:4"],
  "Remembering her granny": ["Psalm 145:4", "Proverbs 13:22", "Psalm 71:18"],
  Legacy: ["Psalm 78:4", "Proverbs 13:22", "Psalm 145:4"],
  "God's faithfulness": ["Lamentations 3:22-23", "Deuteronomy 7:9", "1 Samuel 7:12", "Psalm 77:11"],
  "A new year of life": ["Psalm 90:12", "Psalm 65:11", "Numbers 6:24-26", "Psalm 118:24"],
  "Every day": ["Psalm 118:24", "Psalm 121:8", "Psalm 139:14", "Psalm 91:1-2", "Isaiah 43:2"],
};

export const THEME_NAMES = Object.keys(THEMES);

export function verse(reference: string): Verse | null {
  const text = V[reference];
  return text ? { reference, text } : null;
}

export function versesForTheme(theme: string, limit = 4): Verse[] {
  return (THEMES[theme] ?? [])
    .slice(0, limit)
    .map((r) => verse(r))
    .filter((v): v is Verse => !!v);
}

/** 2–4 verses across the given themes, de-duplicated, gently limited. */
export function versesForThemes(themes: string[], limit = 3): Verse[] {
  const seen = new Set<string>();
  const out: Verse[] = [];
  let round = 0;
  while (out.length < limit && round < 4) {
    for (const t of themes) {
      const refs = THEMES[t] ?? [];
      const ref = refs[round];
      if (ref && !seen.has(ref)) {
        const v = verse(ref);
        if (v) {
          seen.add(ref);
          out.push(v);
          if (out.length >= limit) break;
        }
      }
    }
    round += 1;
  }
  return out;
}

export function searchScripture(query: string, limit = 20): { theme: string; verse: Verse }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { theme: string; verse: Verse }[] = [];
  const seen = new Set<string>();
  for (const [theme, refs] of Object.entries(THEMES)) {
    const themeMatch = theme.toLowerCase().includes(q);
    for (const ref of refs) {
      if (seen.has(ref)) continue;
      const text = V[ref];
      if (!text) continue;
      if (themeMatch || ref.toLowerCase().includes(q) || text.toLowerCase().includes(q)) {
        seen.add(ref);
        results.push({ theme, verse: { reference: ref, text } });
        if (results.length >= limit) return results;
      }
    }
  }
  return results;
}

/** Chapter id -> themes Shamar may gently draw from in that world. */
export const CHAPTER_THEMES: Record<string, string[]> = {
  garden: ["Grief", "Family", "Friendship", "Remembering her granny", "Grieving her sister", "Hope"],
  purpose: ["Law", "Justice", "Wisdom", "Leadership", "Work", "Her law firm"],
  "little-hands": ["Motherhood", "Parenting", "Her daughter", "Family", "Legacy"],
  faithfulness: ["God's faithfulness", "Praise", "Thankfulness", "Hope"],
  memories: ["Gratitude", "Legacy", "God's faithfulness"],
  prayer: ["Prayer", "Waiting", "Peace", "Trust"],
  letters: ["Legacy", "Family", "Her daughter"],
  dreams: ["Purpose", "Calling", "Waiting", "Hope"],
  woman: ["Purpose", "Strength", "Wisdom", "Leadership"],
  legacy: ["Legacy", "Family", "God's faithfulness"],
};

export function themesForChapter(id: string | null): string[] {
  return (id && CHAPTER_THEMES[id]) || [];
}

const DAILY_POOL = [
  "Lamentations 3:22-23",
  "Psalm 118:24",
  "Philippians 4:6-7",
  "Isaiah 40:31",
  "Psalm 91:1-2",
  "Proverbs 3:5-6",
  "Romans 8:28",
  "Psalm 121:8",
  "Matthew 11:28-30",
  "Psalm 139:14",
  "Joshua 1:9",
  "Psalm 46:1",
  "Numbers 6:24-26",
  "Isaiah 43:2",
  "Psalm 103:2",
  "John 14:27",
  "Psalm 16:11",
  "Hebrews 11:1",
  "Psalm 77:11",
  "Philippians 4:19",
  "1 Samuel 7:12",
  "Psalm 34:18",
  "Colossians 3:23-24",
  "Psalm 62:8",
  "Isaiah 41:10",
  "Psalm 30:5",
  "Micah 6:8",
  "Psalm 100:4-5",
  "Galatians 6:9",
  "Psalm 90:12",
  "2 Corinthians 5:17",
];

const REFLECTIONS = [
  "Where have you already seen this to be true in your own story?",
  "What would it look like to carry this verse with you through today?",
  "Is there someone this passage brings to mind?",
  "What is one line here you would like to hold on to?",
  "How might today look different if you believed this at 3pm as well as at sunrise?",
];

export function todaysKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function scriptureForToday(d = new Date()): { verse: Verse; reflection: string } | null {
  const dayNumber = Math.floor(d.getTime() / 86_400_000);
  const ref = DAILY_POOL[dayNumber % DAILY_POOL.length]!;
  const v = verse(ref);
  if (!v) return null;
  return { verse: v, reflection: REFLECTIONS[dayNumber % REFLECTIONS.length]! };
}