// server/seed.js
// Run with: node seed.js
// Make sure your .env is configured with MONGO_URI

require("dotenv").config();
const mongoose = require("mongoose");
const Resource = require("./models/Resource");

const MONGO_URI = process.env.MONGO_URI;

const seedData = [

// ══════════════════════════════════════════════════════════
// JAPANESE
// ══════════════════════════════════════════════════════════

// ALPHABETS
{
  language:"Japanese", category:"Alphabet", level:1, subType:"Hiragana - Vowels", isFree:true,
  title:"Basic Vowels (あいうえお)",
  data:[
    {term:"あ",pronunciation:"a",  translation:{hindi:"अ",english:"a"},  exampleSentence:"あい (ai) = Love"},
    {term:"い",pronunciation:"i",  translation:{hindi:"इ",english:"i"},  exampleSentence:"いぬ (inu) = Dog"},
    {term:"う",pronunciation:"u",  translation:{hindi:"उ",english:"u"},  exampleSentence:"うみ (umi) = Sea"},
    {term:"え",pronunciation:"e",  translation:{hindi:"ए",english:"e"},  exampleSentence:"えき (eki) = Station"},
    {term:"お",pronunciation:"o",  translation:{hindi:"ओ",english:"o"},  exampleSentence:"おに (oni) = Demon"},
  ]
},
{
  language:"Japanese", category:"Alphabet", level:1, subType:"Hiragana - K Row", isFree:true,
  title:"K-Row (かきくけこ)",
  data:[
    {term:"か",pronunciation:"ka",translation:{hindi:"का",english:"ka"},exampleSentence:"かさ (kasa) = Umbrella"},
    {term:"き",pronunciation:"ki",translation:{hindi:"कि",english:"ki"},exampleSentence:"きく (kiku) = Chrysanthemum"},
    {term:"く",pronunciation:"ku",translation:{hindi:"कु",english:"ku"},exampleSentence:"くち (kuchi) = Mouth"},
    {term:"け",pronunciation:"ke",translation:{hindi:"के",english:"ke"},exampleSentence:"けむり (kemuri) = Smoke"},
    {term:"こ",pronunciation:"ko",translation:{hindi:"को",english:"ko"},exampleSentence:"こえ (koe) = Voice"},
  ]
},
{
  language:"Japanese", category:"Alphabet", level:1, subType:"Hiragana - S Row", isFree:true,
  title:"S-Row (さしすせそ)",
  data:[
    {term:"さ",pronunciation:"sa", translation:{hindi:"सा",english:"sa"}, exampleSentence:"さかな (sakana) = Fish"},
    {term:"し",pronunciation:"shi",translation:{hindi:"शि",english:"shi"},exampleSentence:"しろ (shiro) = White"},
    {term:"す",pronunciation:"su", translation:{hindi:"सु",english:"su"}, exampleSentence:"すし (sushi) = Sushi"},
    {term:"せ",pronunciation:"se", translation:{hindi:"से",english:"se"}, exampleSentence:"せんせい (sensei) = Teacher"},
    {term:"そ",pronunciation:"so", translation:{hindi:"सो",english:"so"}, exampleSentence:"そら (sora) = Sky"},
  ]
},
{
  language:"Japanese", category:"Alphabet", level:2, subType:"Katakana - Vowels", isFree:false,
  title:"Katakana Vowels (アイウエオ)",
  data:[
    {term:"ア",pronunciation:"a",translation:{hindi:"अ",english:"a"},exampleSentence:"アイス (aisu) = Ice cream"},
    {term:"イ",pronunciation:"i",translation:{hindi:"इ",english:"i"},exampleSentence:"インク (inku) = Ink"},
    {term:"ウ",pronunciation:"u",translation:{hindi:"उ",english:"u"},exampleSentence:"ウール (uuru) = Wool"},
    {term:"エ",pronunciation:"e",translation:{hindi:"ए",english:"e"},exampleSentence:"エアコン (eakon) = Air conditioner"},
    {term:"オ",pronunciation:"o",translation:{hindi:"ओ",english:"o"},exampleSentence:"オレンジ (orenji) = Orange"},
  ]
},
{
  language:"Japanese", category:"Alphabet", level:3, subType:"Basic Kanji", isFree:false,
  title:"N5 Kanji - Numbers & Nature",
  data:[
    {term:"一",pronunciation:"ichi",translation:{hindi:"एक",     english:"one"},     exampleSentence:"一つ (hitotsu) = One thing"},
    {term:"二",pronunciation:"ni",  translation:{hindi:"दो",     english:"two"},     exampleSentence:"二月 (nigatsu) = February"},
    {term:"三",pronunciation:"san", translation:{hindi:"तीन",    english:"three"},   exampleSentence:"三人 (sannin) = Three people"},
    {term:"山",pronunciation:"yama",translation:{hindi:"पहाड़",  english:"mountain"},exampleSentence:"富士山 (Fujisan) = Mt. Fuji"},
    {term:"川",pronunciation:"kawa",translation:{hindi:"नदी",    english:"river"},   exampleSentence:"川が流れる = River flows"},
    {term:"日",pronunciation:"hi",  translation:{hindi:"दिन",    english:"day/sun"}, exampleSentence:"今日 (kyou) = Today"},
    {term:"月",pronunciation:"tsuki",translation:{hindi:"चाँद",  english:"moon"},    exampleSentence:"月曜日 = Monday"},
    {term:"火",pronunciation:"hi",  translation:{hindi:"आग",     english:"fire"},    exampleSentence:"火曜日 = Tuesday"},
  ]
},

// GRAMMAR
{
  language:"Japanese", category:"Grammar", level:1, subType:"Particles", isFree:true,
  title:"Basic Particles (は が を に で)",
  data:[
    {term:"は (wa)",  pronunciation:"wa",   definition:"Topic marker. Marks the topic of the sentence.",   translation:{hindi:"के बारे में",english:"topic marker"},exampleSentence:"わたし は がくせい です。= I am a student."},
    {term:"が (ga)",  pronunciation:"ga",   definition:"Subject marker. Marks the grammatical subject.",  translation:{hindi:"(कर्ता)",    english:"subject marker"},exampleSentence:"ねこ が います。= There is a cat."},
    {term:"を (wo)",  pronunciation:"wo/o", definition:"Object marker. Marks the direct object.",         translation:{hindi:"(कर्म)",     english:"object marker"}, exampleSentence:"りんご を たべます。= I eat an apple."},
    {term:"に (ni)",  pronunciation:"ni",   definition:"Direction / time / location marker.",              translation:{hindi:"में/को/पर",  english:"direction/location"},exampleSentence:"がっこう に いきます。= I go to school."},
    {term:"で (de)",  pronunciation:"de",   definition:"Means or location of action marker.",             translation:{hindi:"से/में",     english:"by means of"},   exampleSentence:"バス で いきます。= I go by bus."},
  ]
},
{
  language:"Japanese", category:"Grammar", level:1, subType:"Verb Endings", isFree:false,
  title:"Polite Present Tense (〜ます形)",
  data:[
    {term:"〜ます",          pronunciation:"~masu",       definition:"Polite affirmative present/future.", translation:{hindi:"करता हूँ",     english:"do/will do"},    exampleSentence:"たべます = I eat / will eat"},
    {term:"〜ません",         pronunciation:"~masen",      definition:"Polite negative present/future.",   translation:{hindi:"नहीं करता",    english:"do not"},        exampleSentence:"たべません = I do not eat"},
    {term:"〜ました",         pronunciation:"~mashita",    definition:"Polite past affirmative.",          translation:{hindi:"किया था",       english:"did"},           exampleSentence:"たべました = I ate"},
    {term:"〜ませんでした",   pronunciation:"~masen deshita",definition:"Polite past negative.",           translation:{hindi:"नहीं किया था",  english:"did not do"},    exampleSentence:"たべませんでした = I did not eat"},
  ]
},

// VOCABULARY
{
  language:"Japanese", category:"Vocabulary", level:1, subType:"Greetings", isFree:true,
  title:"Daily Greetings",
  data:[
    {term:"おはようございます",  pronunciation:"ohayou gozaimasu",   translation:{hindi:"सुप्रभात",        english:"Good morning"},       exampleSentence:"おはようございます！今日もいい天気ですね。"},
    {term:"こんにちは",          pronunciation:"konnichiwa",          translation:{hindi:"नमस्ते",          english:"Hello/Good afternoon"},exampleSentence:"こんにちは、お元気ですか？"},
    {term:"こんばんは",          pronunciation:"konbanwa",            translation:{hindi:"शुभ संध्या",      english:"Good evening"},       exampleSentence:"こんばんは、今日はどうでしたか？"},
    {term:"おやすみなさい",      pronunciation:"oyasumi nasai",       translation:{hindi:"शुभ रात्रि",      english:"Good night"},         exampleSentence:"おやすみなさい、また明日ね。"},
    {term:"ありがとうございます",pronunciation:"arigatou gozaimasu",  translation:{hindi:"बहुत धन्यवाद",    english:"Thank you very much"}, exampleSentence:"ありがとうございます、助かりました！"},
    {term:"すみません",          pronunciation:"sumimasen",           translation:{hindi:"माफ कीजिये",      english:"Excuse me / Sorry"},   exampleSentence:"すみません、駅はどこですか？"},
  ]
},
{
  language:"Japanese", category:"Vocabulary", level:1, subType:"Numbers", isFree:false,
  title:"Numbers 1–10",
  data:[
    {term:"いち",    pronunciation:"ichi",    translation:{hindi:"एक",   english:"1"},exampleSentence:"いちまい = one sheet"},
    {term:"に",      pronunciation:"ni",      translation:{hindi:"दो",   english:"2"},exampleSentence:"にほん = Japan"},
    {term:"さん",    pronunciation:"san",     translation:{hindi:"तीन",  english:"3"},exampleSentence:"さんぽ = walk"},
    {term:"よん/し", pronunciation:"yon/shi", translation:{hindi:"चार",  english:"4"},exampleSentence:"よんじゅう = forty"},
    {term:"ご",      pronunciation:"go",      translation:{hindi:"पाँच", english:"5"},exampleSentence:"ごがつ = May"},
    {term:"ろく",    pronunciation:"roku",    translation:{hindi:"छह",   english:"6"},exampleSentence:"ろくじ = 6 o'clock"},
    {term:"なな/しち",pronunciation:"nana",   translation:{hindi:"सात",  english:"7"},exampleSentence:"しちじ = 7 o'clock"},
    {term:"はち",    pronunciation:"hachi",   translation:{hindi:"आठ",   english:"8"},exampleSentence:"はちがつ = August"},
    {term:"く/きゅう",pronunciation:"ku/kyuu",translation:{hindi:"नौ",   english:"9"},exampleSentence:"きゅうじゅう = ninety"},
    {term:"じゅう",  pronunciation:"juu",     translation:{hindi:"दस",   english:"10"},exampleSentence:"じゅういち = eleven"},
  ]
},

// COMMON PHRASES
{
  language:"Japanese", category:"CommonPhrases", level:1, subType:"Survival Phrases", isFree:true,
  title:"Essential Survival Phrases",
  data:[
    {term:"わかりません",           pronunciation:"wakarimasen",            translation:{hindi:"समझ नहीं आया",english:"I don't understand"},   exampleSentence:"すみません、わかりません。"},
    {term:"トイレはどこですか",     pronunciation:"toire wa doko desu ka",  translation:{hindi:"शौचालय कहाँ है?",english:"Where is the toilet?"},exampleSentence:"トイレはどこですか？"},
    {term:"いくらですか",           pronunciation:"ikura desu ka",          translation:{hindi:"कितने का है?",english:"How much is it?"},        exampleSentence:"これはいくらですか？"},
    {term:"たすけてください",       pronunciation:"tasukete kudasai",       translation:{hindi:"मदद करें",    english:"Please help me"},         exampleSentence:"たすけてください！"},
    {term:"もう一度お願いします",   pronunciation:"mou ichido onegaishimasu",translation:{hindi:"दोबारा कहें",english:"Please say it again"},    exampleSentence:"もう一度お願いします。"},
    {term:"えいごはなせますか",     pronunciation:"eigo hanasemasu ka",     translation:{hindi:"अंग्रेज़ी बोलते हैं?",english:"Do you speak English?"},exampleSentence:"えいごはなせますか？"},
  ]
},

// PRONUNCIATION
{
  language:"Japanese", category:"Pronunciation", level:1, subType:"Long Vowels", isFree:true,
  title:"Long vs Short Vowels",
  data:[
    {term:"おばさん vs おばあさん",pronunciation:"obasan vs obaasan",definition:"Short = aunt; Long = grandmother. Vowel length changes meaning completely.",translation:{hindi:"आंटी vs दादी/नानी",english:"Aunt vs Grandmother"},exampleSentence:"おばあさんにプレゼントをあげました。"},
    {term:"ゆき vs ゆうき",        pronunciation:"yuki vs yuuki",  definition:"ゆき = snow; ゆうき = courage.",                                       translation:{hindi:"बर्फ vs साहस",  english:"Snow vs Courage"},       exampleSentence:"ゆうきをもって進め。"},
    {term:"ここ vs こうこう",       pronunciation:"koko vs koukou",definition:"ここ = here; こうこう = high school.",                                  translation:{hindi:"यहाँ vs हाई स्कूल",english:"Here vs High school"},exampleSentence:"こうこうはここからちかいですか？"},
  ]
},

// STORIES
{
  language:"Japanese", category:"Stories", level:1, subType:"Short Story", isFree:true,
  title:"犬と猫 (The Dog and the Cat)",
  data:[
    {term:"むかし、ある村に犬と猫がいました。",  pronunciation:"Mukashi, aru mura ni inu to neko ga imashita.",   translation:{hindi:"एक समय एक गाँव में एक कुत्ता और बिल्ली रहती थी।",english:"Once upon a time, in a village, lived a dog and a cat."}},
    {term:"犬は毎日走るのが好きでした。",         pronunciation:"Inu wa mainichi hashiru no ga suki deshita.",    translation:{hindi:"कुत्ते को रोज़ दौड़ना पसंद था।",english:"The dog liked to run every day."}},
    {term:"猫はいつも木の上で寝ていました。",     pronunciation:"Neko wa itsumo ki no ue de nete imashita.",      translation:{hindi:"बिल्ली हमेशा पेड़ के ऊपर सोती थी।",english:"The cat always slept on top of a tree."}},
    {term:"ある日、大きな嵐が来ました。",         pronunciation:"Aru hi, ooki na arashi ga kimashita.",           translation:{hindi:"एक दिन बड़ा तूफ़ान आया।",english:"One day, a big storm came."}},
    {term:"犬と猫は一緒に雨宿りをしました。",     pronunciation:"Inu to neko wa issho ni amayadori wo shimashita.",translation:{hindi:"दोनों ने मिलकर बारिश से बचाव किया।",english:"The dog and cat sheltered together."}},
    {term:"それから、二匹は親友になりました。",   pronunciation:"Sorekara, nihiki wa shinyuu ni narimashita.",    translation:{hindi:"उसके बाद वे सबसे अच्छे दोस्त बन गए।",english:"After that, the two became best friends."}},
  ]
},

// ══════════════════════════════════════════════════════════
// ENGLISH
// ══════════════════════════════════════════════════════════

{
  language:"English", category:"Alphabet", level:1, subType:"Vowels", isFree:true,
  title:"Vowels (A E I O U)",
  data:[
    {term:"A",pronunciation:"eɪ (ay)",  translation:{hindi:"अ",marathi:"अ"},exampleSentence:"Apple, Ant, Arrow"},
    {term:"E",pronunciation:"iː (ee)",  translation:{hindi:"ए",marathi:"ए"},exampleSentence:"Elephant, Egg, Eagle"},
    {term:"I",pronunciation:"aɪ (eye)", translation:{hindi:"आई",marathi:"आय"},exampleSentence:"Ice, Island, Iron"},
    {term:"O",pronunciation:"oʊ (oh)",  translation:{hindi:"ओ",marathi:"ओ"},exampleSentence:"Orange, Ocean, Oven"},
    {term:"U",pronunciation:"juː (you)",translation:{hindi:"यू",marathi:"यू"},exampleSentence:"Umbrella, Under, Use"},
  ]
},
{
  language:"English", category:"Alphabet", level:1, subType:"Consonants", isFree:true,
  title:"Consonants B to H",
  data:[
    {term:"B",pronunciation:"biː",  translation:{hindi:"बी",marathi:"बी"},exampleSentence:"Ball, Book, Bird"},
    {term:"C",pronunciation:"siː",  translation:{hindi:"सी",marathi:"सी"},exampleSentence:"Cat, Car, Cup"},
    {term:"D",pronunciation:"diː",  translation:{hindi:"डी",marathi:"डी"},exampleSentence:"Dog, Door, Dance"},
    {term:"F",pronunciation:"ɛf",   translation:{hindi:"एफ",marathi:"एफ"},exampleSentence:"Fish, Flower, Flag"},
    {term:"G",pronunciation:"dʒiː", translation:{hindi:"जी",marathi:"जी"},exampleSentence:"Goat, Girl, Green"},
    {term:"H",pronunciation:"eɪtʃ", translation:{hindi:"एच",marathi:"एच"},exampleSentence:"House, Horse, Hat"},
  ]
},
{
  language:"English", category:"Grammar", level:1, subType:"Tenses", isFree:true,
  title:"Simple Tenses Overview",
  data:[
    {term:"Simple Present",    pronunciation:"",definition:"Habits, facts, general truths. Base verb (+s/es for he/she/it).",     translation:{hindi:"सामान्य वर्तमान काल",marathi:"साधा वर्तमानकाळ"},exampleSentence:"She reads a book every day."},
    {term:"Simple Past",       pronunciation:"",definition:"Completed actions in the past. Verb + ed or irregular form.",         translation:{hindi:"सामान्य भूत काल",marathi:"साधा भूतकाळ"},   exampleSentence:"He walked to school yesterday."},
    {term:"Simple Future",     pronunciation:"",definition:"Future actions. will + base verb.",                                    translation:{hindi:"सामान्य भविष्य काल",marathi:"साधा भविष्यकाळ"},exampleSentence:"They will travel next year."},
    {term:"Present Continuous",pronunciation:"",definition:"Actions happening now. am/is/are + verb+ing.",                        translation:{hindi:"वर्तमान निरंतर काल",marathi:"वर्तमान चालू काळ"},exampleSentence:"I am learning English right now."},
    {term:"Past Continuous",   pronunciation:"",definition:"Ongoing past actions. was/were + verb+ing.",                          translation:{hindi:"भूत निरंतर काल",marathi:"भूत चालू काळ"},    exampleSentence:"She was cooking when I called."},
  ]
},
{
  language:"English", category:"Grammar", level:1, subType:"Articles", isFree:true,
  title:"Articles: A, An, The",
  data:[
    {term:"A",  pronunciation:"eɪ",     definition:"Before consonant sounds. Any one of a general group.",          translation:{hindi:"एक",marathi:"एक"},exampleSentence:"I saw a dog in the park."},
    {term:"An", pronunciation:"æn",     definition:"Before vowel sounds (a, e, i, o, u).",                          translation:{hindi:"एक (स्वर पहले)",marathi:"एक"},exampleSentence:"She ate an apple."},
    {term:"The",pronunciation:"ðə/ðiː", definition:"Specific noun known to both speaker and listener.",             translation:{hindi:"वह/वो (निश्चित)",marathi:"तो/ती/ते"},exampleSentence:"Please close the door."},
  ]
},
{
  language:"English", category:"Vocabulary", level:1, subType:"Family", isFree:true,
  title:"Family Relationships",
  data:[
    {term:"Mother",     pronunciation:"ˈmʌðər",      translation:{hindi:"माँ",      marathi:"आई"},   exampleSentence:"My mother cooks delicious food."},
    {term:"Father",     pronunciation:"ˈfɑːðər",     translation:{hindi:"पिता",     marathi:"बाबा"}, exampleSentence:"My father goes to work early."},
    {term:"Brother",    pronunciation:"ˈbrʌðər",     translation:{hindi:"भाई",      marathi:"भाऊ"},  exampleSentence:"My brother plays cricket."},
    {term:"Sister",     pronunciation:"ˈsɪstər",     translation:{hindi:"बहन",      marathi:"बहीण"}, exampleSentence:"My sister is very kind."},
    {term:"Grandfather",pronunciation:"ˈɡrændfɑːðər",translation:{hindi:"दादा",     marathi:"आजोबा"},exampleSentence:"My grandfather tells great stories."},
    {term:"Grandmother",pronunciation:"ˈɡrændmʌðər", translation:{hindi:"दादी",     marathi:"आजी"},  exampleSentence:"My grandmother makes the best tea."},
  ]
},
{
  language:"English", category:"CommonPhrases", level:1, subType:"Greetings", isFree:true,
  title:"Everyday Greetings",
  data:[
    {term:"How are you?",        pronunciation:"haʊ ɑːr juː",     translation:{hindi:"आप कैसे हैं?",    marathi:"तुम्ही कसे आहात?"},exampleSentence:""},
    {term:"I'm fine, thank you.",pronunciation:"aɪm faɪn θæŋk juː",translation:{hindi:"मैं ठीक हूँ।",  marathi:"मी ठीक आहे."},    exampleSentence:""},
    {term:"Nice to meet you.",   pronunciation:"naɪs tə miːt juː", translation:{hindi:"आपसे मिलकर खुशी हुई।",marathi:"तुम्हाला भेटून आनंद."},exampleSentence:""},
    {term:"See you later.",      pronunciation:"siː juː ˈleɪtər",  translation:{hindi:"बाद में मिलते हैं।",marathi:"नंतर भेटू."},  exampleSentence:""},
    {term:"Have a good day!",    pronunciation:"hæv ə ɡʊd deɪ",   translation:{hindi:"आपका दिन अच्छा हो!",marathi:"तुमचा दिवस चांगला जावो!"},exampleSentence:""},
    {term:"I'm sorry.",          pronunciation:"aɪm ˈsɒri",        translation:{hindi:"मुझे माफ करें।",  marathi:"मला माफ करा."},  exampleSentence:""},
  ]
},
{
  language:"English", category:"Pronunciation", level:1, subType:"Silent Letters", isFree:true,
  title:"Silent Letters",
  data:[
    {term:"knife",    pronunciation:"naɪf (k silent)",   definition:"'k' is silent before 'n'.",   translation:{hindi:"चाकू",      marathi:"चाकू"},  exampleSentence:"She cut bread with a knife."},
    {term:"write",    pronunciation:"raɪt (w silent)",   definition:"'w' is silent before 'r'.",   translation:{hindi:"लिखना",     marathi:"लिहणे"}, exampleSentence:"Please write your name."},
    {term:"island",   pronunciation:"ˈaɪlənd (s silent)",definition:"'s' is silent in island.",    translation:{hindi:"द्वीप",     marathi:"बेट"},   exampleSentence:"They live on an island."},
    {term:"honest",   pronunciation:"ˈɒnɪst (h silent)", definition:"'h' is silent at the start.", translation:{hindi:"ईमानदार",   marathi:"प्रामाणिक"},exampleSentence:"She is an honest person."},
    {term:"Wednesday",pronunciation:"ˈwɛnzdeɪ (d silent)",definition:"First 'd' is silent.",       translation:{hindi:"बुधवार",    marathi:"बुधवार"}, exampleSentence:"Meeting is on Wednesday."},
  ]
},
{
  language:"English", category:"Stories", level:1, subType:"Fable", isFree:true,
  title:"The Tortoise and the Hare",
  data:[
    {term:"Once upon a time, a hare and a tortoise decided to have a race.",pronunciation:"",translation:{hindi:"एक समय, एक खरगोश और एक कछुए ने दौड़ लगाने का निश्चय किया।",marathi:"एकदा एक ससा आणि एक कासव शर्यत लावायचे ठरवले."}},
    {term:"The hare was very fast and felt confident he would win easily.",   pronunciation:"",translation:{hindi:"खरगोश बहुत तेज़ था और उसे यकीन था कि वह आसानी से जीत जाएगा।",marathi:"ससा खूप वेगवान होता आणि तो सहज जिंकेल असे वाटत होते."}},
    {term:"Halfway through the race, the hare sat down to rest and fell asleep.",pronunciation:"",translation:{hindi:"आधी दौड़ में खरगोश बैठ गया और सो गया।",marathi:"शर्यतीच्या मध्यावर ससा बसला आणि झोपी गेला."}},
    {term:"The tortoise walked slowly but steadily, never stopping.",           pronunciation:"",translation:{hindi:"कछुआ धीरे लेकिन लगातार चलता रहा।",marathi:"कासव हळूहळू पण सातत्याने चालत राहिले."}},
    {term:"When the hare woke up, the tortoise had already crossed the finish line.",pronunciation:"",translation:{hindi:"जब खरगोश उठा, तो कछुआ पहले ही अंतिम रेखा पार कर चुका था।",marathi:"ससा उठला तेव्हा कासवाने आधीच शेवटची रेषा ओलांडली होती."}},
    {term:"Slow and steady wins the race.",pronunciation:"",translation:{hindi:"धीरे और स्थिर रहने वाला ही दौड़ जीतता है।",marathi:"हळू आणि स्थिर राहणारा शर्यत जिंकतो."}},
  ]
},

];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing resources (optional — comment out to keep old data)
    await Resource.deleteMany({});
    console.log("🗑️  Cleared existing resources");

    await Resource.insertMany(seedData);
    console.log(`✅ Inserted ${seedData.length} resource documents`);

    await mongoose.disconnect();
    console.log("✅ Done! Disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();