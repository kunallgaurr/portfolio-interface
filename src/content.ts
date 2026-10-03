/**
 * Every piece of copy on the site lives in this file.
 * Edit the values below; no component needs to change.
 */

export type Skill = {
  name: string;
  /** Where the skill has been used; shown in the detail panel. */
  level: string;
  /** One line on how the skill is used. */
  note: string;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  role: string;
  /** One or two sentences shown on the card. */
  summary: string;
  /** Paragraphs shown in the expanded view. */
  description: string[];
  stack: string[];
  highlights: { label: string; value: string }[];
  /** Optional; the expanded view hides the row when this is empty. */
  links: { label: string; href: string }[];
};

export type Job = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  /** Optional; leave empty for roles without published detail. */
  points: string[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type Content = {
  site: {
    /** Public URL of the deployed site; used for Open Graph tags. */
    url: string;
    title: string;
    description: string;
  };
  person: {
    firstName: string;
    lastName: string;
    monogram: string;
    role: string;
    tagline: string;
    location: string;
    /** Short status line shown at the bottom of the hero. */
    availability: string;
    email: string;
  };
  nav: { label: string; href: string }[];
  about: {
    label: string;
    statement: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
  };
  skills: {
    label: string;
    heading: string;
    hint: string;
    groups: SkillGroup[];
  };
  projects: {
    label: string;
    heading: string;
    items: Project[];
  };
  experience: {
    label: string;
    heading: string;
    jobs: Job[];
  };
  contact: {
    label: string;
    heading: string[];
    body: string;
    socials: SocialLink[];
    footnote: string;
  };
};

export const content: Content = {
  site: {
    url: "https://kunalgaur.in",
    title: "Kunal Gaur — Software Developer",
    description:
      "Portfolio of Kunal Gaur, a software developer in New Delhi who builds scalable backend and frontend systems with TypeScript, Node.js and event-driven microservices.",
  },

  person: {
    firstName: "Kunal",
    lastName: "Gaur",
    monogram: "KG",
    role: "Software Developer",
    tagline:
      "I build scalable, reliable backend and frontend systems with TypeScript, Node.js and event-driven microservices.",
    location: "New Delhi, India",
    availability: "SDE 2 at Mono Solutions",
    email: "kunaall.gaurr@gmail.com",
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],

  about: {
    label: "About",
    statement:
      "I build backend and frontend systems that are scalable and efficient, with a focus on clean architecture, microservices and reliability.",
    paragraphs: [
      "My core stack is TypeScript and Node.js with Nest.js and Express.js on the server, and React.js and Next.js on the client. I work with both SQL and NoSQL databases, and I have hands-on experience with Redis, RabbitMQ, Apache Kafka and Grafana.",
      "I started with serverless functions at NFTICALLY, built fintech and blockchain services at SimplyFI, and worked on event-driven gameplay systems at Deltatech Gaming. Today I am a Software Developer 2 at Mono Solutions. I hold a B.Tech in Electrical, Electronics and Communications Engineering from Guru Gobind Singh Indraprastha University.",
    ],
    stats: [
      { value: "3+", label: "Years building production systems" },
      { value: "5", label: "Companies worked with" },
      { value: "4", label: "Chatbots delivered end to end" },
      { value: "<1s", label: "Marketplace filter response" },
    ],
  },

  skills: {
    label: "Skills",
    heading: "The tools I reach for",
    hint: "Hover or focus a node",
    groups: [
      {
        title: "Backend",
        skills: [
          { name: "Node.js", level: "Used across 4 roles", note: "The runtime behind every backend I have shipped." },
          { name: "TypeScript", level: "Used across 4 roles", note: "From serverless functions to distributed services." },
          { name: "NestJS", level: "Deltatech Gaming", note: "Structured, modular services for gameplay workflows." },
          { name: "Express.js", level: "Used across 3 roles", note: "APIs for fintech services and chatbot backends." },
          { name: "Microservices", level: "Used across 2 roles", note: "Event-driven services with clear boundaries." },
          { name: "gRPC", level: "Deltatech Gaming", note: "Led the rollout: proof of concept, then team sessions." },
        ],
      },
      {
        title: "Data & Messaging",
        skills: [
          { name: "MySQL", level: "Used across 2 roles", note: "Complex transactional queries and analytics." },
          { name: "MongoDB", level: "Used across 3 roles", note: "Document storage across several products." },
          { name: "Redis", level: "Used across 2 roles", note: "Timeseries, sorted sets, hashes and JSON for real-time state." },
          { name: "Apache Kafka", level: "Deltatech Gaming", note: "Reliable messaging between distributed services." },
          { name: "RabbitMQ", level: "Deltatech Gaming", note: "Queues for inter-service communication." },
          { name: "WebSocket", level: "Deltatech Gaming", note: "Real-time features for live sessions." },
          { name: "DynamoDB", level: "Deltatech Gaming", note: "Managed NoSQL storage on AWS." },
        ],
      },
      {
        title: "Frontend & Cloud",
        skills: [
          { name: "JavaScript", level: "Frontend and backend", note: "The language under everything else here." },
          { name: "React.js", level: "Frontend", note: "Interfaces for the systems I build." },
          { name: "Next.js", level: "Frontend", note: "This site is built with it." },
          { name: "Redux.js", level: "Frontend", note: "Predictable state for larger interfaces." },
          { name: "AWS Lambda", level: "Deltatech Gaming, NFTICALLY", note: "Serverless functions written in TypeScript." },
          { name: "Serverless", level: "Deltatech Gaming", note: "Serverless Framework for packaging and deploys." },
          { name: "Amazon SNS", level: "SimplyFI", note: "Dynamic email and SMS notifications." },
          { name: "Amazon S3", level: "SimplyFI", note: "Secure document storage and generated invoices." },
          { name: "Grafana", level: "Monitoring", note: "Dashboards for keeping an eye on running systems." },
        ],
      },
    ],
  },

  projects: {
    label: "Selected work",
    heading: "Things I have built",
    items: [
      {
        slug: "collusion-detection",
        title: "Real-Time Collusion Detection",
        year: "2025",
        role: "Software Engineer · Deltatech Gaming",
        summary:
          "A real-time validation layer that keeps colluding users out of the same game session, with a full audit trail behind it.",
        description: [
          "Fair play on a gaming platform depends on keeping colluding users apart. I developed a real-time validation mechanism that detects colluding users and prevents them from participating in the same session.",
          "Alongside it I built an audit logging framework that tracks collusion-related events, identifies the users involved and what triggered each event, and feeds the data into BI pipelines for further analysis.",
        ],
        stack: ["Node.js", "TypeScript", "NestJS", "Redis"],
        highlights: [
          { label: "Validation", value: "Real-time" },
          { label: "Collusion events", value: "Audited" },
          { label: "Analysis", value: "BI-ready" },
        ],
        links: [],
      },
      {
        slug: "gameplay-services",
        title: "Event-Driven Gameplay Services",
        year: "2025",
        role: "Software Engineer · Deltatech Gaming",
        summary:
          "Event-driven microservices that run high-volume transactional workflows at the core of gameplay.",
        description: [
          "I built and optimized event-driven microservices for core gameplay operations, using Redis timeseries, sorted sets, hashes and JSON for real-time features and state management.",
          "Services communicate through Kafka and RabbitMQ. I led the implementation of gRPC for service-to-service calls, ran a successful proof of concept and held knowledge-sharing sessions for the team. I also designed an issue reporting system that captures device details, app version and network conditions to speed up root cause analysis.",
        ],
        stack: ["Node.js", "NestJS", "Redis", "Apache Kafka", "RabbitMQ", "gRPC"],
        highlights: [
          { label: "Message brokers", value: "2" },
          { label: "Service calls", value: "gRPC" },
          { label: "Live state", value: "Redis" },
        ],
        links: [],
      },
      {
        slug: "asset-marketplace",
        title: "Tokenized Asset Marketplace",
        year: "2024",
        role: "Software Engineer · SimplyFI",
        summary:
          "A tokenized asset marketplace built from the ground up, with escrow-backed transactions and sub-second filtering.",
        description: [
          "I built a stable, tokenized asset marketplace from the ground up, with secure asset handling and optimized filtering that responds in under a second.",
          "Payments run through Razorpay's financial APIs for payouts, refunds, merchant onboarding and bank account verification. An escrow-based system keeps transactions transparent between multiple stakeholders, and a role-based access control system manages permissions for users, admins and supervisors.",
        ],
        stack: ["Node.js", "TypeScript", "Microservices", "Razorpay"],
        highlights: [
          { label: "Filter response", value: "<1s" },
          { label: "Payments", value: "Razorpay" },
          { label: "Transactions", value: "Escrow" },
        ],
        links: [],
      },
      {
        slug: "kyc-notifications",
        title: "KYC & Notification Services",
        year: "2024",
        role: "Software Engineer · SimplyFI",
        summary:
          "A full KYC service covering Aadhaar, PAN, passport and driver's licence, plus the notification service around it.",
        description: [
          "I developed a full-featured KYC service that verifies Aadhaar, PAN, passport and driver's licence documents to meet regulatory requirements.",
          "I also created a communication and notification service on AWS SNS that sends dynamic email and SMS for invoices, billing, promotions and user verification, and integrated AWS S3 for secure document storage and automated generation of invoices and bills.",
        ],
        stack: ["Node.js", "TypeScript", "Amazon SNS", "Amazon S3"],
        highlights: [
          { label: "Document types", value: "4" },
          { label: "Channels", value: "Email + SMS" },
          { label: "Documents", value: "S3" },
        ],
        links: [],
      },
      {
        slug: "conversational-bots",
        title: "WhatsApp & Messenger Chatbots",
        year: "2023–24",
        role: "Software Engineer Intern · SimplyFI",
        summary:
          "Three WhatsApp bots and a Facebook Messenger bot on Sinch Chatlayer, with a dashboard to track how people use them.",
        description: [
          "I led the integration of Sinch Chatlayer and delivered three WhatsApp bots and one Facebook Messenger chatbot with dynamic, end-to-end conversational flows. Session management keeps chats continuous and closes sessions properly across platforms.",
          "To measure them, I built a role-based analytics dashboard that tracks user onboarding and chat flow behaviour, with invite-only authentication and verification for secure access.",
        ],
        stack: ["Sinch Chatlayer", "Express.js", "Amazon S3"],
        highlights: [
          { label: "WhatsApp bots", value: "3" },
          { label: "Messenger bots", value: "1" },
          { label: "Dashboard access", value: "Invite-only" },
        ],
        links: [],
      },
      {
        slug: "kamoto-ai",
        title: "Kamoto.ai Conversation Data",
        year: "2023",
        role: "Software Engineer Intern · NFTICALLY",
        summary:
          "Serverless functions and GPT-4 generated conversation data for Kamoto.ai, a virtual celebrity chat platform.",
        description: [
          "I developed and deployed serverless functions with AWS Lambda and TypeScript to make the backend more scalable.",
          "I used OpenAI's GPT-4 API to generate AI-driven conversational data for Kamoto.ai, and wrote and optimized the SQL queries that store and retrieve it for dynamic AI interactions.",
        ],
        stack: ["AWS Lambda", "TypeScript", "GPT-4 API", "MySQL"],
        highlights: [
          { label: "Compute", value: "Lambda" },
          { label: "Model", value: "GPT-4" },
          { label: "Storage", value: "SQL" },
        ],
        links: [],
      },
    ],
  },

  experience: {
    label: "Experience",
    heading: "Where I have worked",
    jobs: [
      {
        company: "Mono Solutions",
        role: "Software Developer\u00a02",
        period: "Jan 2026 — Present",
        location: "Remote · Copenhagen",
        summary:
          "Working remotely with a Copenhagen-based team on Mono's website builder platform.",
        points: [],
      },
      {
        company: "Adaan Digital Solutions",
        role: "Software Developer\u00a02",
        period: "Jan 2026 — Present",
        location: "Remote · New Delhi",
        summary: "Full-time Software Developer 2, working remotely from New Delhi.",
        points: [],
      },
      {
        company: "Deltatech Gaming",
        role: "Software Engineer",
        period: "Nov 2024 — Sep 2025",
        location: "Gurugram",
        summary:
          "Built event-driven microservices for high-volume transactional workflows at the core of gameplay.",
        points: [
          "Used Redis timeseries, sorted sets, hashes and JSON for real-time features and state.",
          "Integrated and maintained Kafka and RabbitMQ for reliable inter-service messaging.",
          "Led the gRPC rollout: proof of concept, then knowledge-sharing sessions.",
          "Designed an issue reporting system that captures device, app version and network conditions.",
          "Built real-time collusion detection and the audit logging that feeds BI pipelines.",
        ],
      },
      {
        company: "SimplyFI",
        role: "Software Engineer",
        period: "May 2024 — Nov 2024",
        location: "Bengaluru",
        summary:
          "Converted my internship into a full-time role and delivered production fintech and blockchain services end to end.",
        points: [
          "Built a tokenized asset marketplace with sub-second filtering.",
          "Integrated Razorpay for payouts, refunds, merchant onboarding and bank verification.",
          "Implemented escrow-based transactions between multiple stakeholders.",
          "Developed a KYC service for Aadhaar, PAN, passport and driver's licence.",
          "Created an AWS SNS notification service and role-based access control.",
        ],
      },
      {
        company: "SimplyFI",
        role: "Software Engineer Intern",
        period: "Oct 2023 — Apr 2024",
        location: "Bengaluru",
        summary: "Delivered conversational bots and the dashboard that measures them.",
        points: [
          "Led the Sinch Chatlayer integration: three WhatsApp bots and one Messenger bot.",
          "Built a role-based analytics dashboard with invite-only authentication.",
          "Implemented session management for chat continuity across platforms.",
        ],
      },
      {
        company: "NFTICALLY",
        role: "Software Engineer Intern",
        period: "Jun 2023 — Aug 2023",
        location: "Remote",
        summary: "Backend work for Kamoto.ai, a virtual celebrity chat platform.",
        points: [
          "Developed and deployed serverless functions with AWS Lambda and TypeScript.",
          "Generated AI-driven conversational data with OpenAI's GPT-4 API.",
          "Wrote and optimized SQL queries for dynamic AI interactions.",
        ],
      },
    ],
  },

  contact: {
    label: "Contact",
    heading: ["Let's build", "something."],
    body: "Have a system to build, a role to discuss or an idea to think through? The fastest way to reach me is email.",
    socials: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/kunal-gaur-connect" }],
    footnote: "Built with Next.js, three.js and hand-written GLSL.",
  },
};
