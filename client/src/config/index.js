export const signUpFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    type: "text",
    componentType: "input",
  },
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const signInFormControls = [
  {
    name: "userEmail",
    label: "User Email",
    placeholder: "Enter your user email",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    componentType: "input",
  },
];

export const initialSignInFormData = {
  userEmail: "",
  password: "",
};

export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
};

// --- UPDATED: Languages for "Medium of Instruction" (What language the teacher speaks) ---
export const languageOptions = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "marathi", label: "Marathi" },
  { id: "japanese", label: "Japanese" },
  { id: "german", label: "German" },
  { id: "sanskrit", label: "Sanskrit" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
];

export const courseLevelOptions = [
  { id: "beginner", label: "Beginner (Level 1)" },
  { id: "intermediate", label: "Intermediate (Level 2)" },
  { id: "advanced", label: "Advanced (Level 3)" },
];

// --- UPDATED: Categories are now TARGET LANGUAGES ---
export const courseCategories = [
  { id: "english", label: "English Language" },
  { id: "japanese", label: "Japanese (JLPT)" },
  { id: "german", label: "German (Goethe)" },
  { id: "sanskrit", label: "Sanskrit" },
  { id: "french", label: "French" },
  { id: "spanish", label: "Spanish" },
  { id: "mandarin", label: "Mandarin Chinese" },
  { id: "hindi", label: "Hindi Literature" },
  { id: "marathi", label: "Marathi Literature" },
];

export const courseLandingPageFormControls = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title (e.g. Complete German B1)",
  },
  {
    name: "category",
    label: "Target Language (Category)",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories, // Uses the language list above
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "primaryLanguage",
    label: "Medium of Instruction",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: languageOptions, // e.g. Taught in Hindi or English?
  },
  {
    name: "subtitle",
    label: "Subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter course subtitle",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course description",
  },
  {
    name: "pricing",
    label: "Pricing (₹)",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
  {
    name: "objectives",
    label: "Objectives",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course objectives (comma separated)",
  },
  {
    name: "welcomeMessage",
    label: "Welcome Message",
    componentType: "textarea",
    placeholder: "Welcome message for students",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  primaryLanguage: "",
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: "",
  image: "",
};

export const courseCurriculumInitialFormData = [
  {
    title: "",
    videoUrl: "",
    freePreview: false,
    public_id: "",
  },
];

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
  primaryLanguage: languageOptions,
};