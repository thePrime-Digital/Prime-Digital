export type Program = {
  slug: string;
  title: string;
  highlight: string;
  description: string;
  image: string;

  age: string;
  duration: string;
  level: string;

  stats: {
    title: string;
    value: string;
    subtext?: string;
  }[];

  learning: {
    title: string;
    description: string;
  }[];

  journey: {
    title: string;
    time: string;
  }[];

  curriculum: {
    title: string;
    lessons: string;
    items: string[];
  }[];

  projects: {
    title: string;
    description: string;
    image: string;
  }[];
};

export const programs: Program[] = [

  // =========================================================
  // 1. AI & MACHINE LEARNING
  // Existing route kept so nothing breaks.
  // =========================================================
  {
    slug: "ai-robotics-explorer",

    title: "AI & Machine Learning",
    highlight: "Explorer",

    description:
      "Explore artificial intelligence and machine learning through Python, data, computer vision, intelligent systems, and practical AI projects.",

    image: "/pds-assets/program-ai-robotics.jpg",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "Intermediate Level",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "5 Major", subtext: "AI portfolio" },
      { title: "Skills", value: "AI + ML", subtext: "Practical learning" },
      { title: "Learning", value: "Hybrid", subtext: "Live + Self-paced" },
    ],

    learning: [
      {
        title: "AI Fundamentals",
        description:
          "Understand artificial intelligence, machine learning, models, datasets, and intelligent systems.",
      },
      {
        title: "Python for AI",
        description:
          "Use Python to prepare data, build logic, and create simple intelligent applications.",
      },
      {
        title: "Machine Learning",
        description:
          "Learn supervised learning, prediction, classification, and model evaluation.",
      },
      {
        title: "Computer Vision",
        description:
          "Explore image recognition and how machines understand visual information.",
      },
      {
        title: "Data & Models",
        description:
          "Understand datasets, features, training data, accuracy, and model improvement.",
      },
      {
        title: "AI Projects",
        description:
          "Apply AI concepts through practical projects and portfolio-ready demonstrations.",
      },
    ],

    journey: [
      { title: "AI Foundations", time: "Week 1–2" },
      { title: "Python & Data", time: "Week 3–4" },
      { title: "Machine Learning", time: "Week 5–7" },
      { title: "Applied AI", time: "Week 8–9" },
      { title: "Major Project", time: "Week 10–11" },
      { title: "Presentation", time: "Week 12" },
    ],

    curriculum: [
      {
        title: "Introduction to Artificial Intelligence",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "What is Artificial Intelligence?",
          "AI Around Us",
          "Machine Learning vs Traditional Programming",
          "Understanding Data and Models",
          "AI Fundamentals Quiz",
        ],
      },
      {
        title: "Python for AI",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "Python Variables and Data Types",
          "Conditions and Loops",
          "Functions and Reusable Logic",
          "Lists, Dictionaries and Data",
          "Working with Python Libraries",
          "Mini Project: Intelligent Python Tool",
        ],
      },
      {
        title: "Machine Learning Fundamentals",
        lessons: "6 Lessons • 14 Hours",
        items: [
          "How Machines Learn",
          "Features and Labels",
          "Training and Testing Data",
          "Classification",
          "Prediction",
          "Model Accuracy and Evaluation",
        ],
      },
      {
        title: "Computer Vision & Intelligent Systems",
        lessons: "5 Lessons • 12 Hours",
        items: [
          "Introduction to Computer Vision",
          "Images as Data",
          "Object and Image Recognition",
          "AI Decision Making",
          "Mini Project: Vision-Based Application",
        ],
      },
      {
        title: "AI Capstone Project",
        lessons: "5 Lessons • 12 Hours",
        items: [
          "Choose an AI Problem",
          "Prepare Data",
          "Build the Solution",
          "Test and Improve the Model",
          "Final AI Project Presentation",
        ],
      },
    ],

    projects: [
      {
        title: "AI Smart Assistant",
        description:
          "Build an intelligent assistant that responds to inputs and performs useful automated tasks.",
        image: "/pds-assets/program-ai-robotics.jpg",
      },
      {
        title: "Smart Recognition System",
        description:
          "Create a simple AI system that analyzes visual or structured input and produces intelligent output.",
        image: "/programs/ai-robotics/smart-home-hub.png",
      },
    ],
  },


  // =========================================================
  // 2. FULL-STACK WEB DEVELOPMENT
  // =========================================================
  {
    slug: "web-development-pro",

    title: "Full-Stack Web",
    highlight: "Development",

    description:
      "Build complete modern web applications using frontend development, backend APIs, databases, authentication, and deployment.",

    image: "/pds-assets/program-web-dev.jpg",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "Intermediate Level",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "5 Major", subtext: "Full-stack portfolio" },
      { title: "Stack", value: "Modern", subtext: "Frontend + Backend" },
      { title: "Learning", value: "Hybrid", subtext: "Live + Self-paced" },
    ],

    learning: [
      {
        title: "HTML & CSS",
        description:
          "Build structured, responsive, and accessible modern web pages.",
      },
      {
        title: "JavaScript",
        description:
          "Create dynamic interfaces using modern JavaScript and browser APIs.",
      },
      {
        title: "React",
        description:
          "Build reusable component-based frontend applications.",
      },
      {
        title: "Backend Development",
        description:
          "Create server-side logic and REST APIs with Node.js.",
      },
      {
        title: "Databases",
        description:
          "Store, retrieve, and manage application data with MongoDB.",
      },
      {
        title: "Deployment",
        description:
          "Connect the complete stack and deploy production-ready applications.",
      },
    ],

    journey: [
      { title: "Frontend Basics", time: "Week 1–2" },
      { title: "JavaScript", time: "Week 3–4" },
      { title: "React", time: "Week 5–6" },
      { title: "Backend", time: "Week 7–8" },
      { title: "Full Stack", time: "Week 9–11" },
      { title: "Deployment", time: "Week 12" },
    ],

    curriculum: [
      {
        title: "Web Development Foundations",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "How the Web Works",
          "Semantic HTML",
          "Modern CSS",
          "Responsive Layouts",
          "Frontend Project",
        ],
      },
      {
        title: "JavaScript Development",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "JavaScript Fundamentals",
          "Functions and Objects",
          "DOM Manipulation",
          "Events",
          "Async JavaScript",
          "API Integration",
        ],
      },
      {
        title: "React Frontend",
        lessons: "6 Lessons • 14 Hours",
        items: [
          "React Components",
          "Props and State",
          "React Hooks",
          "Forms",
          "Routing",
          "Frontend Application Project",
        ],
      },
      {
        title: "Backend & APIs",
        lessons: "6 Lessons • 14 Hours",
        items: [
          "Node.js Fundamentals",
          "Express",
          "REST APIs",
          "Authentication",
          "Protected Routes",
          "Backend Project",
        ],
      },
      {
        title: "Database & Deployment",
        lessons: "5 Lessons • 12 Hours",
        items: [
          "MongoDB Fundamentals",
          "CRUD Operations",
          "Frontend + Backend Integration",
          "Testing the Application",
          "Production Deployment",
        ],
      },
    ],

    projects: [
      {
        title: "E-Commerce Website",
        description:
          "Build a complete full-stack e-commerce application with products, cart, authentication, and checkout.",
        image: "/pds-assets/program-web-dev.jpg",
      },
      {
        title: "Task Management App",
        description:
          "Create a responsive productivity platform with authentication, database storage, and CRUD operations.",
        image: "/programs/web-development/task-management-app.png",
      },
    ],
  },


  // =========================================================
  // 3. DATA SCIENCE
  // =========================================================
  {
    slug: "data-science-analytics-junior",

    title: "Data Science",
    highlight: "Explorer",

    description:
      "Learn how data is collected, prepared, analyzed, visualized, and used to build predictive and machine-learning solutions.",

    image: "/programs/data-science/hero.png",

    age: "Ages 13–17",
    duration: "12 Weeks",
    level: "Intermediate Level",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "5 Major", subtext: "Data portfolio" },
      { title: "Tools", value: "Python", subtext: "Data + ML" },
      { title: "Learning", value: "Practical", subtext: "Project-based" },
    ],

    learning: [
      {
        title: "Python for Data",
        description:
          "Use Python to work with structured datasets and data-processing workflows.",
      },
      {
        title: "Statistics",
        description:
          "Understand averages, distributions, relationships, and statistical reasoning.",
      },
      {
        title: "Data Cleaning",
        description:
          "Prepare messy datasets for reliable analysis and modeling.",
      },
      {
        title: "Visualization",
        description:
          "Communicate patterns and trends through effective charts and dashboards.",
      },
      {
        title: "Machine Learning",
        description:
          "Build introductory predictive and classification models.",
      },
      {
        title: "Data Projects",
        description:
          "Create portfolio projects using real-world datasets.",
      },
    ],

    journey: [
      { title: "Data Basics", time: "Week 1–2" },
      { title: "Python", time: "Week 3–4" },
      { title: "Analysis", time: "Week 5–6" },
      { title: "Visualization", time: "Week 7–8" },
      { title: "Machine Learning", time: "Week 9–10" },
      { title: "Capstone", time: "Week 11–12" },
    ],

    curriculum: [
      {
        title: "Data Science Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "What is Data Science?",
          "Types of Data",
          "The Data Science Workflow",
          "Understanding Datasets",
          "Data Science Quiz",
        ],
      },
      {
        title: "Python Data Analysis",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "Python for Data",
          "Pandas Fundamentals",
          "Reading Datasets",
          "Filtering and Transforming",
          "Missing Values",
          "Mini Analysis Project",
        ],
      },
      {
        title: "Statistics & Visualization",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "Mean, Median and Mode",
          "Distributions",
          "Relationships Between Variables",
          "Charts and Graphs",
          "Choosing the Right Visualization",
          "Visualization Project",
        ],
      },
      {
        title: "Machine Learning Introduction",
        lessons: "5 Lessons • 12 Hours",
        items: [
          "Features and Targets",
          "Training Data",
          "Regression",
          "Classification",
          "Model Evaluation",
        ],
      },
      {
        title: "Data Science Capstone",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Choose a Dataset",
          "Clean the Data",
          "Analyze and Visualize",
          "Build a Model",
          "Present Your Findings",
        ],
      },
    ],

    projects: [
      {
        title: "Predictive Data Project",
        description:
          "Analyze a dataset and build a basic model to predict future outcomes.",
        image: "/programs/data-science/data-insights.png",
      },
      {
        title: "Data Science Dashboard",
        description:
          "Create a visual project showing patterns, trends, and insights from a real dataset.",
        image: "/programs/data-science/analytics-dashboard.png",
      },
    ],
  },


  // =========================================================
  // 4. CYBERSECURITY
  // =========================================================
  {
    slug: "cyber-defense-junior",

    title: "Cybersecurity",
    highlight: "Foundations",

    description:
      "Learn to identify threats, secure systems and networks, respond to incidents, and understand responsible security practices.",

    image: "/programs/cyber-defense/hero.png",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Labs", value: "Hands-on", subtext: "Security practice" },
      { title: "Projects", value: "3 Major", subtext: "Portfolio work" },
      { title: "Learning", value: "Practical", subtext: "Guided labs" },
    ],

    learning: [
      {
        title: "Cyber Safety",
        description:
          "Understand secure accounts, privacy, phishing, and safe online behavior.",
      },
      {
        title: "Threats",
        description:
          "Learn how malware, social engineering, and common cyber threats work.",
      },
      {
        title: "Networks",
        description:
          "Understand devices, networks, traffic, and network security basics.",
      },
      {
        title: "Security Tools",
        description:
          "Explore firewalls, authentication, antivirus, and monitoring concepts.",
      },
      {
        title: "Incident Response",
        description:
          "Learn how security incidents are detected, documented, and handled.",
      },
      {
        title: "Ethical Security",
        description:
          "Understand responsible vulnerability identification and security testing.",
      },
    ],

    journey: [
      { title: "Safety", time: "Week 1–2" },
      { title: "Threats", time: "Week 3–4" },
      { title: "Networks", time: "Week 5–6" },
      { title: "Security Tools", time: "Week 7–8" },
      { title: "Response", time: "Week 9–10" },
      { title: "Final Project", time: "Week 11–12" },
    ],

    curriculum: [
      {
        title: "Cybersecurity Fundamentals",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "What is Cybersecurity?",
          "Passwords and Authentication",
          "Privacy and Personal Data",
          "Safe Browsing",
          "Cyber Safety Quiz",
        ],
      },
      {
        title: "Cyber Threats",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Malware",
          "Phishing",
          "Social Engineering",
          "Ransomware",
          "Threat Identification",
        ],
      },
      {
        title: "Networks & Defense",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "How Networks Work",
          "IP Addresses",
          "Routers and Wi-Fi",
          "Firewalls",
          "Secure Networks",
          "Network Lab",
        ],
      },
      {
        title: "Security Operations",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Monitoring",
          "Detecting Suspicious Activity",
          "Incident Documentation",
          "Incident Response",
          "Security Review",
        ],
      },
      {
        title: "Cybersecurity Capstone",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Identify Risks",
          "Design Security Controls",
          "Build a Defense Plan",
          "Test the Plan",
          "Final Presentation",
        ],
      },
    ],

    projects: [
      {
        title: "Threat Hunter Challenge",
        description:
          "Analyze security scenarios and identify suspicious behavior and appropriate defensive responses.",
        image: "/programs/cyber-defense/threat-hunter.png",
      },
      {
        title: "Network Defense Lab",
        description:
          "Design and demonstrate a secure network configuration.",
        image: "/programs/cyber-defense/network-security.png",
      },
      {
        title: "Cyber Shield Project",
        description:
          "Create and present a complete cybersecurity awareness and defense strategy.",
        image: "/programs/cyber-defense/security-project.png",
      },
    ],
  },


  // =========================================================
  // 5. UI/UX DESIGN
  // =========================================================
  {
    slug: "ux-ui-design-mastery",

    title: "UI/UX",
    highlight: "Design",

    description:
      "Research users, structure digital products, create interfaces, build prototypes, and test complete user experiences.",

    image: "/programs/ux-ui/hero.png",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "All Levels",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "5 Major", subtext: "Design portfolio" },
      { title: "Tools", value: "Figma", subtext: "Industry workflow" },
      { title: "Learning", value: "Project-based", subtext: "Design practice" },
    ],

    learning: [
      {
        title: "Design Thinking",
        description:
          "Solve real problems through user-centered design methods.",
      },
      {
        title: "UX Research",
        description:
          "Understand users through research, personas, journeys, and testing.",
      },
      {
        title: "Wireframing",
        description:
          "Structure applications using low and high-fidelity wireframes.",
      },
      {
        title: "UI Design",
        description:
          "Use typography, color, spacing, grids, and components.",
      },
      {
        title: "Prototyping",
        description:
          "Create interactive prototypes and realistic user flows.",
      },
      {
        title: "Usability Testing",
        description:
          "Test designs with users and improve based on feedback.",
      },
    ],

    journey: [
      { title: "Foundation", time: "Week 1–2" },
      { title: "Research", time: "Week 3–4" },
      { title: "Wireframes", time: "Week 5–6" },
      { title: "UI Design", time: "Week 7–8" },
      { title: "Prototype", time: "Week 9–10" },
      { title: "Portfolio", time: "Week 11–12" },
    ],

    curriculum: [
      {
        title: "UI/UX Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "UI vs UX",
          "Design Thinking",
          "Understanding Users",
          "Design Principles",
          "UX Quiz",
        ],
      },
      {
        title: "UX Research",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "User Interviews",
          "Surveys",
          "Personas",
          "User Journeys",
          "Research Findings",
        ],
      },
      {
        title: "Wireframes & Architecture",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Information Architecture",
          "User Flows",
          "Low-Fidelity Wireframes",
          "High-Fidelity Wireframes",
          "Wireframe Project",
        ],
      },
      {
        title: "UI Design & Figma",
        lessons: "6 Lessons • 14 Hours",
        items: [
          "Figma Fundamentals",
          "Typography",
          "Color",
          "Grids and Spacing",
          "Components",
          "Responsive Design",
        ],
      },
      {
        title: "Prototype & Test",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Interactive Prototypes",
          "Usability Testing",
          "Gather Feedback",
          "Improve the Design",
          "Portfolio Presentation",
        ],
      },
    ],

    projects: [
      {
        title: "E-Commerce Mobile App",
        description:
          "Design a complete shopping experience including discovery, product, cart, and checkout flows.",
        image: "/programs/ux-ui/ecommerce-mobile-app.png",
      },
      {
        title: "UX Research Project",
        description:
          "Conduct user research and translate findings into an improved product experience.",
        image: "/programs/ux-ui/ux-research.png",
      },
      {
        title: "Analytics Dashboard",
        description:
          "Design a clear and usable analytics dashboard for complex information.",
        image: "/programs/ux-ui/analytics-dashboard.png",
      },
    ],
  },


  // =========================================================
  // 6. DATA ANALYTICS - NEW
  // =========================================================
  {
    slug: "data-analytics",

    title: "Data",
    highlight: "Analytics",

    description:
      "Learn to organize, analyze, visualize, and communicate business data using spreadsheets, SQL, dashboards, and analytical thinking.",

    image: "/programs/data-analytics/hero.png",

    age: "Ages 13–17",
    duration: "10 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "10 Weeks", subtext: "4–5 hrs weekly" },
      { title: "Projects", value: "4 Major", subtext: "Analytics portfolio" },
      { title: "Tools", value: "SQL + BI", subtext: "Dashboard skills" },
      { title: "Learning", value: "Practical", subtext: "Business datasets" },
    ],

    learning: [
      {
        title: "Spreadsheet Analytics",
        description:
          "Use spreadsheets to structure data, calculate metrics, and analyze patterns.",
      },
      {
        title: "SQL",
        description:
          "Query structured data using filters, joins, grouping, and aggregation.",
      },
      {
        title: "Data Cleaning",
        description:
          "Prepare data for accurate and reliable analysis.",
      },
      {
        title: "Dashboards",
        description:
          "Build clear dashboards that communicate important metrics.",
      },
      {
        title: "Business Insights",
        description:
          "Translate numbers into useful recommendations and decisions.",
      },
      {
        title: "Reporting",
        description:
          "Present findings clearly to technical and non-technical audiences.",
      },
    ],

    journey: [
      { title: "Data Basics", time: "Week 1" },
      { title: "Spreadsheets", time: "Week 2–3" },
      { title: "SQL", time: "Week 4–5" },
      { title: "Visualization", time: "Week 6–7" },
      { title: "Business Analysis", time: "Week 8–9" },
      { title: "Capstone", time: "Week 10" },
    ],

    curriculum: [
      {
        title: "Analytics Foundations",
        lessons: "4 Lessons • 6 Hours",
        items: [
          "What is Data Analytics?",
          "Metrics and KPIs",
          "Types of Business Data",
          "Analytics Quiz",
        ],
      },
      {
        title: "Spreadsheet Analysis",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Organizing Data",
          "Formulas",
          "Lookup Functions",
          "Pivot Tables",
          "Spreadsheet Analysis Project",
        ],
      },
      {
        title: "SQL for Analytics",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "SELECT Queries",
          "Filtering Data",
          "Aggregations",
          "Grouping",
          "Joins",
          "SQL Analysis Project",
        ],
      },
      {
        title: "Visualization & Dashboards",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Choosing Charts",
          "Dashboard Layout",
          "KPIs",
          "Interactive Reporting",
          "Dashboard Project",
        ],
      },
      {
        title: "Business Analytics Capstone",
        lessons: "4 Lessons • 8 Hours",
        items: [
          "Define a Business Question",
          "Analyze the Data",
          "Build the Dashboard",
          "Present Recommendations",
        ],
      },
    ],

    projects: [
      {
        title: "Business Analytics Dashboard",
        description:
          "Build a dashboard that tracks KPIs and summarizes business performance.",
        image: "/programs/data-analytics/analytics-dashboard.png",
      },
      {
        title: "Business Insights Report",
        description:
          "Analyze a dataset and present clear findings and recommendations.",
        image: "/programs/data-analytics/business-insights.png",
      },
    ],
  },


  // =========================================================
  // 7. ENTREPRENEURSHIP
  // =========================================================
  {
    slug: "teen-entrepreneurship",

    title: "Entrepreneurship",
    highlight: "Program",

    description:
      "Learn to discover problems, validate ideas, create business models, build brands, manage money, and pitch new ventures.",

    image: "/programs/entrepreneurship/hero.png",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "8 Hands-on", subtext: "Business practice" },
      { title: "Skills", value: "Business", subtext: "Idea to pitch" },
      { title: "Guidance", value: "Mentor", subtext: "Structured learning" },
    ],

    learning: [
      {
        title: "Entrepreneurial Mindset",
        description:
          "Develop confidence, creativity, initiative, and problem-solving.",
      },
      {
        title: "Idea Validation",
        description:
          "Identify real problems and validate business ideas.",
      },
      {
        title: "Business Planning",
        description:
          "Create a practical business model and launch plan.",
      },
      {
        title: "Marketing",
        description:
          "Build a brand and understand how businesses attract customers.",
      },
      {
        title: "Financial Literacy",
        description:
          "Understand pricing, cost, revenue, profit, and budgeting.",
      },
      {
        title: "Pitching",
        description:
          "Communicate business ideas clearly and persuasively.",
      },
    ],

    journey: [
      { title: "Discover", time: "Week 1–2" },
      { title: "Ideate", time: "Week 3–4" },
      { title: "Validate", time: "Week 5–6" },
      { title: "Build", time: "Week 7–8" },
      { title: "Market", time: "Week 9–10" },
      { title: "Pitch", time: "Week 11–12" },
    ],

    curriculum: [
      {
        title: "Entrepreneurship Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "What is Entrepreneurship?",
          "Finding Problems",
          "Entrepreneurial Mindset",
          "Successful Business Examples",
          "Entrepreneurship Quiz",
        ],
      },
      {
        title: "Idea & Customer Validation",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Idea Generation",
          "Target Customers",
          "Interviews",
          "Surveys",
          "Validate Your Idea",
        ],
      },
      {
        title: "Business Planning",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Value Proposition",
          "Business Model",
          "Competition",
          "Business Goals",
          "Simple Business Plan",
        ],
      },
      {
        title: "Marketing & Finance",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "Branding",
          "Marketing Channels",
          "Pricing",
          "Costs",
          "Revenue",
          "Profit",
        ],
      },
      {
        title: "Pitch & Launch",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Build an MVP",
          "Create a Pitch Deck",
          "Storytelling",
          "Presentation Skills",
          "Final Business Pitch",
        ],
      },
    ],

    projects: [
      {
        title: "Eco-Friendly Product",
        description:
          "Develop an eco-friendly product concept and plan how to launch it.",
        image: "/programs/entrepreneurship/eco-bag.png",
      },
      {
        title: "Mobile App Business Concept",
        description:
          "Create and validate a mobile-business idea that solves a real problem.",
        image: "/programs/entrepreneurship/learning-app.png",
      },
      {
        title: "Business Pitch Challenge",
        description:
          "Present a complete business idea with product, market, financial, and growth strategy.",
        image: "/programs/entrepreneurship/business-pitch.png",
      },
    ],
  },


  // =========================================================
  // 8. DIGITAL MARKETING - NEW
  // =========================================================
  {
    slug: "digital-marketing",

    title: "Digital",
    highlight: "Marketing",

    description:
      "Learn how brands grow online through content, social media, search, paid advertising, analytics, and digital campaign strategy.",

    image: "/programs/digital-marketing/hero.png",

    age: "Ages 13–17",
    duration: "10 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "10 Weeks", subtext: "4–5 hrs weekly" },
      { title: "Projects", value: "5 Campaigns", subtext: "Portfolio work" },
      { title: "Skills", value: "Growth", subtext: "Digital strategy" },
      { title: "Learning", value: "Practical", subtext: "Campaign-based" },
    ],

    learning: [
      {
        title: "Marketing Strategy",
        description:
          "Understand audiences, positioning, goals, funnels, and campaign planning.",
      },
      {
        title: "Social Media",
        description:
          "Plan and create platform-specific social media campaigns.",
      },
      {
        title: "SEO",
        description:
          "Understand keywords, search intent, content optimization, and search visibility.",
      },
      {
        title: "Paid Campaigns",
        description:
          "Learn campaign structure, targeting, creative, budgets, and performance metrics.",
      },
      {
        title: "Content Marketing",
        description:
          "Create useful content designed to attract and engage audiences.",
      },
      {
        title: "Analytics",
        description:
          "Measure campaign results and improve strategy using performance data.",
      },
    ],

    journey: [
      { title: "Foundations", time: "Week 1" },
      { title: "Audience", time: "Week 2" },
      { title: "Content", time: "Week 3–4" },
      { title: "SEO & Social", time: "Week 5–6" },
      { title: "Campaigns", time: "Week 7–8" },
      { title: "Analytics", time: "Week 9–10" },
    ],

    curriculum: [
      {
        title: "Digital Marketing Foundations",
        lessons: "4 Lessons • 6 Hours",
        items: [
          "What is Digital Marketing?",
          "Understanding Audiences",
          "Digital Marketing Funnels",
          "Marketing Fundamentals Quiz",
        ],
      },
      {
        title: "Social Media Marketing",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Platform Strategy",
          "Content Planning",
          "Audience Engagement",
          "Social Media Calendar",
          "Campaign Project",
        ],
      },
      {
        title: "SEO & Content Marketing",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Search Intent",
          "Keywords",
          "On-Page SEO",
          "Content Strategy",
          "SEO Content Project",
        ],
      },
      {
        title: "Paid Advertising",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Campaign Objectives",
          "Audience Targeting",
          "Ad Creative",
          "Budget Basics",
          "Campaign Performance",
        ],
      },
      {
        title: "Marketing Analytics",
        lessons: "4 Lessons • 8 Hours",
        items: [
          "Marketing KPIs",
          "Traffic and Conversion",
          "Campaign Reporting",
          "Final Marketing Campaign",
        ],
      },
    ],

    projects: [
      {
        title: "Digital Campaign Dashboard",
        description:
          "Plan a digital campaign and create a dashboard to track its performance.",
        image: "/programs/digital-marketing/campaign-dashboard.png",
      },
      {
        title: "Social Media Growth Strategy",
        description:
          "Create a complete social media strategy for a brand or product.",
        image: "/programs/digital-marketing/social-media-strategy.png",
      },
    ],
  },


  // =========================================================
  // 9. GRAPHIC DESIGN & MOTION GRAPHICS - NEW
  // =========================================================
  {
    slug: "graphic-design-motion-graphics",

    title: "Graphic Design &",
    highlight: "Motion Graphics",

    description:
      "Create visual identities, digital graphics, layouts, animated assets, and motion-based content for modern digital platforms.",

    image: "/programs/graphic-design-motion-graphics/hero.png",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "All Levels",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "8 Creative", subtext: "Design portfolio" },
      { title: "Skills", value: "Visual", subtext: "Static + Motion" },
      { title: "Learning", value: "Creative", subtext: "Project-based" },
    ],

    learning: [
      {
        title: "Design Principles",
        description:
          "Understand composition, hierarchy, balance, contrast, and visual communication.",
      },
      {
        title: "Typography",
        description:
          "Use typography effectively across branding and digital design.",
      },
      {
        title: "Color & Layout",
        description:
          "Build strong visual systems using color, grids, and spacing.",
      },
      {
        title: "Branding",
        description:
          "Create visual identities, logos, and brand assets.",
      },
      {
        title: "Motion Graphics",
        description:
          "Animate text, graphics, shapes, and visual compositions.",
      },
      {
        title: "Portfolio",
        description:
          "Develop polished design and motion projects for a creative portfolio.",
      },
    ],

    journey: [
      { title: "Foundations", time: "Week 1–2" },
      { title: "Visual Design", time: "Week 3–4" },
      { title: "Branding", time: "Week 5–6" },
      { title: "Motion Basics", time: "Week 7–8" },
      { title: "Animation", time: "Week 9–10" },
      { title: "Portfolio", time: "Week 11–12" },
    ],

    curriculum: [
      {
        title: "Graphic Design Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "Visual Communication",
          "Composition",
          "Hierarchy",
          "Color Theory",
          "Design Principles Quiz",
        ],
      },
      {
        title: "Typography & Layout",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Typography Fundamentals",
          "Type Pairing",
          "Grid Systems",
          "Spacing",
          "Editorial Layout Project",
        ],
      },
      {
        title: "Brand Identity",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Brand Strategy",
          "Logo Concepts",
          "Color Systems",
          "Brand Guidelines",
          "Identity Project",
        ],
      },
      {
        title: "Motion Graphics",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "Animation Principles",
          "Keyframes",
          "Motion Typography",
          "Shape Animation",
          "Transitions",
          "Motion Project",
        ],
      },
      {
        title: "Portfolio Project",
        lessons: "4 Lessons • 8 Hours",
        items: [
          "Choose a Creative Brief",
          "Create Visual Assets",
          "Animate the Campaign",
          "Present the Final Portfolio",
        ],
      },
    ],

    projects: [
      {
        title: "Brand Identity Project",
        description:
          "Create a complete visual identity including logo, typography, colors, and campaign assets.",
        image: "/programs/graphic-design-motion-graphics/branding-project.png",
      },
      {
        title: "Motion Graphics Campaign",
        description:
          "Create animated graphics and promotional content for a digital campaign.",
        image: "/programs/graphic-design-motion-graphics/motion-graphics-project.png",
      },
    ],
  },


  // =========================================================
  // 10. SOFTWARE TESTING - NEW
  // =========================================================
  {
    slug: "software-testing",

    title: "Software",
    highlight: "Testing",

    description:
      "Learn software quality assurance through test planning, test cases, bug reporting, API testing, and introductory test automation.",

    image: "/programs/software-testing/hero.png",

    age: "Ages 13–17",
    duration: "10 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "10 Weeks", subtext: "4–5 hrs weekly" },
      { title: "Projects", value: "4 Major", subtext: "QA portfolio" },
      { title: "Skills", value: "QA", subtext: "Manual + Automation" },
      { title: "Learning", value: "Practical", subtext: "Testing labs" },
    ],

    learning: [
      {
        title: "Testing Fundamentals",
        description:
          "Understand quality assurance, software testing, and testing workflows.",
      },
      {
        title: "Test Cases",
        description:
          "Design clear test scenarios, test cases, and expected results.",
      },
      {
        title: "Bug Reporting",
        description:
          "Identify, reproduce, document, and prioritize software defects.",
      },
      {
        title: "Web Testing",
        description:
          "Test websites across functionality, usability, forms, and responsive behavior.",
      },
      {
        title: "API Testing",
        description:
          "Understand requests, responses, status codes, and basic API validation.",
      },
      {
        title: "Automation Basics",
        description:
          "Learn how repetitive software tests can be automated.",
      },
    ],

    journey: [
      { title: "QA Basics", time: "Week 1" },
      { title: "Test Cases", time: "Week 2–3" },
      { title: "Bug Reports", time: "Week 4" },
      { title: "Web Testing", time: "Week 5–6" },
      { title: "API & Automation", time: "Week 7–9" },
      { title: "Capstone", time: "Week 10" },
    ],

    curriculum: [
      {
        title: "Software Testing Foundations",
        lessons: "4 Lessons • 6 Hours",
        items: [
          "What is Software Testing?",
          "Quality Assurance",
          "Testing Life Cycle",
          "Testing Fundamentals Quiz",
        ],
      },
      {
        title: "Test Cases & Bug Reporting",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Test Scenarios",
          "Writing Test Cases",
          "Expected vs Actual Results",
          "Bug Reports",
          "Severity and Priority",
        ],
      },
      {
        title: "Web Application Testing",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Functional Testing",
          "Forms",
          "Navigation",
          "Responsive Testing",
          "Web Testing Project",
        ],
      },
      {
        title: "API Testing",
        lessons: "4 Lessons • 8 Hours",
        items: [
          "What is an API?",
          "Requests and Responses",
          "Status Codes",
          "API Testing Exercise",
        ],
      },
      {
        title: "Automation & QA Capstone",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Automation Concepts",
          "Selecting Tests to Automate",
          "Create a Test Plan",
          "Execute the Test Cycle",
          "Final QA Report",
        ],
      },
    ],

    projects: [
      {
        title: "QA Testing Dashboard",
        description:
          "Create a complete software test plan with test cases, results, bugs, and quality metrics.",
        image: "/programs/software-testing/test-dashboard.png",
      },
      {
        title: "Automation Testing Project",
        description:
          "Design an introductory automated test workflow for a web application.",
        image: "/programs/software-testing/automation-testing.png",
      },
    ],
  },


  // =========================================================
  // 11. PYTHON PROGRAMMING - KEEP
  // =========================================================
  {
    slug: "python-programming-explorer",

    title: "Python Programming",
    highlight: "Explorer",

    description:
      "Learn Python from the ground up through coding challenges, useful scripts, automation, games, and project-based programming.",

    image: "/programs/python-programming/hero.png",

    age: "Ages 11–17",
    duration: "10 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "10 Weeks", subtext: "4–5 hrs weekly" },
      { title: "Projects", value: "6 Practical", subtext: "Coding portfolio" },
      { title: "Language", value: "Python", subtext: "Beginner to projects" },
      { title: "Learning", value: "Hands-on", subtext: "Build while learning" },
    ],

    learning: [
      {
        title: "Python Basics",
        description:
          "Learn syntax, variables, data types, and basic program structure.",
      },
      {
        title: "Logic",
        description:
          "Use conditions, loops, and problem-solving techniques.",
      },
      {
        title: "Functions",
        description:
          "Write organized and reusable Python code.",
      },
      {
        title: "Data Structures",
        description:
          "Work with lists, dictionaries, tuples, and sets.",
      },
      {
        title: "Automation",
        description:
          "Use Python to automate repetitive tasks.",
      },
      {
        title: "Games & Projects",
        description:
          "Build interactive Python projects and games.",
      },
    ],

    journey: [
      { title: "Basics", time: "Week 1–2" },
      { title: "Logic", time: "Week 3" },
      { title: "Functions", time: "Week 4" },
      { title: "Data", time: "Week 5–6" },
      { title: "Projects", time: "Week 7–9" },
      { title: "Capstone", time: "Week 10" },
    ],

    curriculum: [
      {
        title: "Python Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "Python Setup",
          "Variables",
          "Data Types",
          "Input and Output",
          "Python Quiz",
        ],
      },
      {
        title: "Logic & Control Flow",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Conditions",
          "Loops",
          "Nested Logic",
          "Problem Solving",
          "Logic Challenge",
        ],
      },
      {
        title: "Functions & Data Structures",
        lessons: "6 Lessons • 12 Hours",
        items: [
          "Functions",
          "Lists",
          "Dictionaries",
          "Tuples",
          "Sets",
          "Mini Project",
        ],
      },
      {
        title: "Python Automation",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Working with Files",
          "Useful Scripts",
          "Data Processing",
          "Automation Workflow",
          "Automation Project",
        ],
      },
      {
        title: "Python Game Project",
        lessons: "4 Lessons • 8 Hours",
        items: [
          "Game Logic",
          "Input and Movement",
          "Scoring",
          "Build a Python Game",
        ],
      },
    ],

    projects: [
      {
        title: "Python Automation Tool",
        description:
          "Build a practical Python script that automates repetitive data or reporting tasks.",
        image: "/programs/python-programming/automation-project.png",
      },
      {
        title: "Python Game",
        description:
          "Build an interactive Python game using programming logic and event handling.",
        image: "/programs/python-programming/python-game.png",
      },
    ],
  },


  // =========================================================
  // 12. MOBILE APP DEVELOPMENT - KEEP
  // =========================================================
  {
    slug: "mobile-app-development",

    title: "Mobile App",
    highlight: "Development",

    description:
      "Design and build modern mobile applications using interface design, application logic, APIs, data, and deployment concepts.",

    image: "/programs/mobile-app-development/hero.png",

    age: "Ages 13–17",
    duration: "12 Weeks",
    level: "Intermediate Level",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "5 Apps", subtext: "Mobile portfolio" },
      { title: "Skills", value: "Mobile", subtext: "UI + Logic + APIs" },
      { title: "Learning", value: "Project-based", subtext: "Build real apps" },
    ],

    learning: [
      {
        title: "Mobile UI",
        description:
          "Design interfaces specifically for phones and mobile devices.",
      },
      {
        title: "App Logic",
        description:
          "Build interactive behavior and application workflows.",
      },
      {
        title: "State Management",
        description:
          "Manage changing data across application screens.",
      },
      {
        title: "APIs",
        description:
          "Connect mobile applications to external data and services.",
      },
      {
        title: "Storage",
        description:
          "Save and manage application data.",
      },
      {
        title: "Deployment",
        description:
          "Prepare applications for testing and release.",
      },
    ],

    journey: [
      { title: "Foundations", time: "Week 1–2" },
      { title: "UI", time: "Week 3–4" },
      { title: "App Logic", time: "Week 5–6" },
      { title: "Data & APIs", time: "Week 7–8" },
      { title: "Projects", time: "Week 9–11" },
      { title: "Launch", time: "Week 12" },
    ],

    curriculum: [
      {
        title: "Mobile Development Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "Mobile Platforms",
          "App Structure",
          "Screens and Navigation",
          "Development Environment",
          "Mobile Fundamentals Quiz",
        ],
      },
      {
        title: "Mobile Interface Development",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Layouts",
          "Buttons and Inputs",
          "Lists",
          "Responsive Mobile UI",
          "UI Project",
        ],
      },
      {
        title: "App Logic & State",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "User Interaction",
          "Application State",
          "Forms",
          "Validation",
          "Interactive App Project",
        ],
      },
      {
        title: "APIs & Storage",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "API Fundamentals",
          "Fetching Data",
          "Displaying Data",
          "Local Storage",
          "API Project",
        ],
      },
      {
        title: "Build & Launch",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Testing",
          "Debugging",
          "Polishing UI",
          "Preparing Release",
          "Final Mobile App",
        ],
      },
    ],

    projects: [
      {
        title: "E-Commerce Mobile App",
        description:
          "Build a complete shopping app flow with product discovery, product details, cart, and checkout.",
        image: "/programs/mobile-app-development/ecommerce-app.png",
      },
      {
        title: "Learning App",
        description:
          "Create an educational mobile app with modules, progress tracking, and project content.",
        image: "/programs/mobile-app-development/learning-app.png",
      },
    ],
  },


  // =========================================================
  // 13. DIGITAL CONTENT CREATION - KEEP
  // =========================================================
  {
    slug: "digital-content-creation",

    title: "Digital Content",
    highlight: "Creation",

    description:
      "Learn to plan, create, shoot, edit, publish, and grow high-quality digital content across modern platforms.",

    image: "/programs/digital-content/hero.png",

    age: "Ages 12–17",
    duration: "12 Weeks",
    level: "Beginner Friendly",

    stats: [
      { title: "Duration", value: "12 Weeks", subtext: "5–6 hrs weekly" },
      { title: "Projects", value: "10+ Creative", subtext: "Content portfolio" },
      { title: "Skills", value: "Creative", subtext: "Video + Social" },
      { title: "Learning", value: "Hands-on", subtext: "Create and publish" },
    ],

    learning: [
      {
        title: "Content Strategy",
        description:
          "Plan useful and engaging content for specific audiences.",
      },
      {
        title: "Video Production",
        description:
          "Learn framing, lighting, audio, and shooting techniques.",
      },
      {
        title: "Video Editing",
        description:
          "Edit footage using cuts, transitions, audio, and visual effects.",
      },
      {
        title: "Graphic Content",
        description:
          "Create thumbnails, social graphics, and promotional assets.",
      },
      {
        title: "Social Media",
        description:
          "Adapt content for modern digital platforms.",
      },
      {
        title: "Growth",
        description:
          "Understand audience engagement, analytics, and creator growth.",
      },
    ],

    journey: [
      { title: "Plan", time: "Week 1–2" },
      { title: "Shoot", time: "Week 3–4" },
      { title: "Edit", time: "Week 5–6" },
      { title: "Design", time: "Week 7–8" },
      { title: "Publish", time: "Week 9–10" },
      { title: "Grow", time: "Week 11–12" },
    ],

    curriculum: [
      {
        title: "Content Creation Foundations",
        lessons: "5 Lessons • 8 Hours",
        items: [
          "Content Types",
          "Audience",
          "Content Ideas",
          "Storytelling",
          "Content Quiz",
        ],
      },
      {
        title: "Video Production",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Framing",
          "Lighting",
          "Camera Basics",
          "Audio",
          "Shooting Project",
        ],
      },
      {
        title: "Video Editing",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Timeline Editing",
          "Cuts",
          "Transitions",
          "Music and Audio",
          "Editing Project",
        ],
      },
      {
        title: "Graphics & Social Media",
        lessons: "5 Lessons • 10 Hours",
        items: [
          "Thumbnails",
          "Social Graphics",
          "Platform Formats",
          "Content Calendar",
          "Social Campaign",
        ],
      },
      {
        title: "Creator Portfolio",
        lessons: "4 Lessons • 8 Hours",
        items: [
          "Build a Content Series",
          "Publish Content",
          "Review Analytics",
          "Present Your Portfolio",
        ],
      },
    ],

    projects: [
      {
        title: "Travel Vlog Series",
        description:
          "Plan, shoot, edit, and package a professional multi-part vlog.",
        image: "/programs/digital-content/outdoor-vlogging.png",
      },
      {
        title: "Video Channel Project",
        description:
          "Create branded video content and build a consistent digital channel concept.",
        image: "/programs/digital-content/video-editing.png",
      },
      {
        title: "Social Media Campaign",
        description:
          "Create a coordinated social content campaign with graphics, video, and messaging.",
        image: "/programs/digital-content/social-media.png",
      },
    ],
  },
];