// client/src/pages/student/resources/data/advancedGameData.js
// All game content hardcoded here — no DB needed for Advanced Practice

export const GAME_DATA = {

  Japanese: {
    flashcards: [
      { front: "あ", back: "a", meaning: "Vowel A", example: "あめ (ame) = Rain" },
      { front: "い", back: "i", meaning: "Vowel I", example: "いぬ (inu) = Dog" },
      { front: "う", back: "u", meaning: "Vowel U", example: "うみ (umi) = Sea" },
      { front: "え", back: "e", meaning: "Vowel E", example: "えき (eki) = Station" },
      { front: "お", back: "o", meaning: "Vowel O", example: "おに (oni) = Demon" },
      { front: "か", back: "ka", meaning: "Ka sound", example: "かさ (kasa) = Umbrella" },
      { front: "き", back: "ki", meaning: "Ki sound", example: "きく (kiku) = Flower" },
      { front: "く", back: "ku", meaning: "Ku sound", example: "くち (kuchi) = Mouth" },
      { front: "さ", back: "sa", meaning: "Sa sound", example: "さかな (sakana) = Fish" },
      { front: "し", back: "shi", meaning: "Shi sound", example: "しろ (shiro) = White" },
      { front: "た", back: "ta", meaning: "Ta sound", example: "たべる (taberu) = To eat" },
      { front: "な", back: "na", meaning: "Na sound", example: "なまえ (namae) = Name" },
      { front: "は", back: "ha", meaning: "Ha sound", example: "はな (hana) = Flower/Nose" },
      { front: "ま", back: "ma", meaning: "Ma sound", example: "まち (machi) = Town" },
      { front: "や", back: "ya", meaning: "Ya sound", example: "やま (yama) = Mountain" },
      { front: "ら", back: "ra", meaning: "Ra sound", example: "らいねん (rainen) = Next year" },
    ],

    matchPairs: [
      { id: 1, character: "あ", match: "a (ah)" },
      { id: 2, character: "い", match: "i (ee)" },
      { id: 3, character: "う", match: "u (oo)" },
      { id: 4, character: "え", match: "e (eh)" },
      { id: 5, character: "お", match: "o (oh)" },
      { id: 6, character: "か", match: "ka" },
      { id: 7, character: "き", match: "ki" },
      { id: 8, character: "く", match: "ku" },
    ],

    fillBlanks: [
      {
        sentence: "わたし ___ がくせい です。",
        hint: "Topic marker particle",
        answer: "は",
        options: ["は", "が", "を", "で"],
        translation: "I am a student.",
      },
      {
        sentence: "ねこ ___ います。",
        hint: "Subject marker particle",
        answer: "が",
        options: ["は", "が", "に", "で"],
        translation: "There is a cat.",
      },
      {
        sentence: "りんご ___ たべます。",
        hint: "Object marker particle",
        answer: "を",
        options: ["は", "が", "を", "で"],
        translation: "I eat an apple.",
      },
      {
        sentence: "がっこう ___ いきます。",
        hint: "Direction marker (going to)",
        answer: "に",
        options: ["は", "に", "で", "と"],
        translation: "I go to school.",
      },
      {
        sentence: "バス ___ いきます。",
        hint: "Means of transport marker",
        answer: "で",
        options: ["に", "で", "を", "が"],
        translation: "I go by bus.",
      },
      {
        sentence: "これ は ___ ですか。",
        hint: "What (question word)",
        answer: "なん",
        options: ["なん", "だれ", "どこ", "いつ"],
        translation: "What is this?",
      },
      {
        sentence: "きょう は ___ ですか。",
        hint: "What day (question)",
        answer: "なんようび",
        options: ["なんようび", "なんじ", "いつ", "どこ"],
        translation: "What day is today?",
      },
      {
        sentence: "えき は ___ ですか。",
        hint: "Where (question word)",
        answer: "どこ",
        options: ["いつ", "なに", "どこ", "だれ"],
        translation: "Where is the station?",
      },
    ],

    listenType: [
      { word: "さくら",    meaning: "Cherry blossom", hint: "4 characters" },
      { word: "ありがとう", meaning: "Thank you",      hint: "5 characters" },
      { word: "おはよう",  meaning: "Good morning",   hint: "4 characters" },
      { word: "すみません", meaning: "Excuse me",      hint: "5 characters" },
      { word: "たべもの",  meaning: "Food",           hint: "4 characters" },
      { word: "がっこう",  meaning: "School",         hint: "4 characters" },
      { word: "でんしゃ",  meaning: "Train",          hint: "4 characters" },
      { word: "みず",     meaning: "Water",          hint: "2 characters" },
    ],

    pronunciation: [
      { word: "さくら",    romaji: "sakura",    meaning: "Cherry blossom" },
      { word: "ありがとう", romaji: "arigatou",  meaning: "Thank you" },
      { word: "おはようございます", romaji: "ohayou gozaimasu", meaning: "Good morning" },
      { word: "こんにちは", romaji: "konnichiwa", meaning: "Hello" },
      { word: "すみません", romaji: "sumimasen", meaning: "Excuse me" },
      { word: "たべます",  romaji: "tabemasu",  meaning: "I eat" },
      { word: "いきます",  romaji: "ikimasu",   meaning: "I go" },
      { word: "みます",   romaji: "mimasu",    meaning: "I see" },
    ],

    aiSystemPrompt: `You are a friendly Japanese language tutor. The student is a beginner learning Japanese. 
Your job is to:
1. Respond in simple Japanese with romaji and English translation in brackets
2. Gently correct any grammar mistakes the student makes
3. Encourage them and explain why something was wrong
4. Keep sentences short and beginner-friendly
5. Format corrections like: ✗ You said: [wrong] → ✓ Correct: [right] — [explanation]
Start by greeting the student and asking a simple question in Japanese.`,
  },

  English: {
    flashcards: [
      { front: "Apple",      back: "सेब / Apple",     meaning: "A red or green fruit",   example: "I eat an apple every day." },
      { front: "Book",       back: "किताब / Book",     meaning: "Written pages bound together", example: "She reads a book at night." },
      { front: "Water",      back: "पानी / Water",     meaning: "H₂O — the liquid of life",  example: "Please drink more water." },
      { front: "School",     back: "स्कूल / School",   meaning: "Place of learning",         example: "He goes to school every day." },
      { front: "Friend",     back: "दोस्त / Friend",   meaning: "A person you like and trust", example: "She is my best friend." },
      { front: "Beautiful",  back: "सुंदर / Beautiful", meaning: "Pleasing to the eye",       example: "The sunset is beautiful." },
      { front: "Running",    back: "दौड़ना / Running",  meaning: "Moving fast on foot",       example: "He is running in the park." },
      { front: "Happy",      back: "खुश / Happy",      meaning: "Feeling joy or pleasure",   example: "She is very happy today." },
      { front: "Mountain",   back: "पहाड़ / Mountain",  meaning: "Large natural elevation",   example: "We climbed the mountain." },
      { front: "Language",   back: "भाषा / Language",  meaning: "System of communication",   example: "English is a global language." },
      { front: "Quickly",    back: "जल्दी / Quickly",  meaning: "At a fast speed",           example: "He finished the work quickly." },
      { front: "Knowledge",  back: "ज्ञान / Knowledge", meaning: "Facts and skills acquired", example: "Knowledge is power." },
    ],

    matchPairs: [
      { id: 1, character: "Happy",   match: "खुश (feeling joy)" },
      { id: 2, character: "Sad",     match: "दुखी (feeling sorrow)" },
      { id: 3, character: "Big",     match: "बड़ा (large in size)" },
      { id: 4, character: "Small",   match: "छोटा (little in size)" },
      { id: 5, character: "Fast",    match: "तेज़ (high speed)" },
      { id: 6, character: "Slow",    match: "धीमा (low speed)" },
      { id: 7, character: "Hot",     match: "गरम (high temperature)" },
      { id: 8, character: "Cold",    match: "ठंडा (low temperature)" },
    ],

    fillBlanks: [
      {
        sentence: "She ___ to school every day.",
        hint: "Simple present tense of 'go' for she/he/it",
        answer: "goes",
        options: ["go", "goes", "went", "going"],
        translation: "वह हर दिन स्कूल जाती है।",
      },
      {
        sentence: "I ___ a book right now.",
        hint: "Present continuous — happening now",
        answer: "am reading",
        options: ["read", "reads", "am reading", "was reading"],
        translation: "मैं अभी एक किताब पढ़ रहा/रही हूँ।",
      },
      {
        sentence: "They ___ to the park yesterday.",
        hint: "Simple past tense of 'go'",
        answer: "went",
        options: ["go", "goes", "went", "will go"],
        translation: "वे कल पार्क गए थे।",
      },
      {
        sentence: "She is ___ intelligent ___ her brother.",
        hint: "Comparison — more...than",
        answer: "more / than",
        options: ["more / than", "very / as", "as / as", "less / then"],
        translation: "वह अपने भाई से ज़्यादा बुद्धिमान है।",
      },
      {
        sentence: "I have lived here ___ five years.",
        hint: "Duration of time — use this preposition",
        answer: "for",
        options: ["since", "for", "from", "during"],
        translation: "मैं यहाँ पाँच साल से रह रहा/रही हूँ।",
      },
      {
        sentence: "If it rains, we ___ stay inside.",
        hint: "First conditional — future possibility",
        answer: "will",
        options: ["will", "would", "should", "shall"],
        translation: "अगर बारिश हुई तो हम अंदर रहेंगे।",
      },
      {
        sentence: "She speaks English ___ a native speaker.",
        hint: "Comparison of similarity",
        answer: "like",
        options: ["as", "like", "than", "so"],
        translation: "वह अंग्रेज़ी एक native speaker की तरह बोलती है।",
      },
      {
        sentence: "The cake was eaten ___ the children.",
        hint: "Passive voice agent marker",
        answer: "by",
        options: ["from", "by", "with", "through"],
        translation: "केक बच्चों द्वारा खाया गया।",
      },
    ],

    listenType: [
      { word: "Beautiful",   meaning: "सुंदर",     hint: "9 letters" },
      { word: "Knowledge",   meaning: "ज्ञान",     hint: "9 letters" },
      { word: "Friendship",  meaning: "दोस्ती",    hint: "10 letters" },
      { word: "Mountain",    meaning: "पहाड़",     hint: "8 letters" },
      { word: "Language",    meaning: "भाषा",      hint: "8 letters" },
      { word: "Umbrella",    meaning: "छाता",      hint: "8 letters" },
      { word: "Butterfly",   meaning: "तितली",     hint: "9 letters" },
      { word: "Elephant",    meaning: "हाथी",      hint: "8 letters" },
    ],

    pronunciation: [
      { word: "Thursday",    romaji: "THURZ-day",   meaning: "गुरुवार" },
      { word: "Comfortable", romaji: "KUMF-ter-bul", meaning: "आरामदायक" },
      { word: "Vegetable",   romaji: "VEJ-tuh-bul",  meaning: "सब्ज़ी" },
      { word: "February",    romaji: "FEB-roo-eri",  meaning: "फ़रवरी" },
      { word: "Library",     romaji: "LYE-breri",    meaning: "पुस्तकालय" },
      { word: "Particularly",romaji: "per-TIK-yoo-ler-lee", meaning: "विशेष रूप से" },
      { word: "Worcestershire",romaji:"WOOS-ter-sheer",meaning: "एक अंग्रेज़ी सॉस" },
      { word: "Entrepreneur",romaji:"on-truh-pruh-NUR",meaning: "उद्यमी" },
    ],

    aiSystemPrompt: `You are a friendly English language tutor for Hindi-speaking beginners.
Your job is to:
1. Respond in simple English with Hindi translation in brackets
2. Gently correct any grammar mistakes the student makes
3. Encourage them and explain mistakes clearly in simple terms
4. Keep sentences short and beginner-friendly
5. Format corrections like: ✗ You said: [wrong] → ✓ Correct: [right] — [reason]
Start by greeting the student warmly and asking a simple question to get the conversation going.`,
  },
};