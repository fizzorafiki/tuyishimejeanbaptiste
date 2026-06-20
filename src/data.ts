import { Project, SkillCategory, Service, Testimonial, SchoolNode } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "inventory-mgmt",
    title: "Inventory Management System",
    description: "A comprehensive high-throughput inventory solution designed to help businesses manage stock, automate product flows, and track real-time warehouse analytics.",
    category: "Full-Stack System",
    imgSeed: "inventory-dashboard",
    tags: ["React", "Express", "Node.js", "PostgreSQL", "Docker"],
    metrics: "Optimized stock audit times by 45%",
    details: [
      "Designed stable relational schemas in PostgreSQL supporting millions of product tracking units across multiple warehouses.",
      "Implemented a secure stock alert system using server-side Cron triggers that auto-generate purchase orders.",
      "Built interactive dashboard visualizers using clean React component state that render query speeds under 100ms.",
      "Deployed safely inside high-availability isolated Docker containers with automated persistent volume backups."
    ],
    demoUrl: "#projects",
    githubUrl: "https://github.com"
  },
  {
    id: "bakery-suite",
    title: "Bakery Ordering Web Suite",
    description: "A secure online bakery customized e-commerce suite featuring modular product categories, interactive checkout systems, and streamlined kitchen flow boards.",
    category: "E-Commerce Suite",
    imgSeed: "bakery-platform",
    tags: ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
    metrics: "$24k+ transacted with zero cart bottlenecks",
    details: [
      "Engineered an interactive product customization system letting users configure baked-goods sizing, toppings, and notes.",
      "Built a robust real-time kitchen tracking screen that updates bake statuses instantly for operational chefs.",
      "Integrated secure mock Stripe proxy workflows with server-side signature validation in Express to counter fraud.",
      "Developed a clean administrative dashboard displaying historical sales graphs, custom dates, and category exports."
    ],
    demoUrl: "#projects",
    githubUrl: "https://github.com"
  },
  {
    id: "system-monitor",
    title: "System Monitoring Dashboard",
    description: "An elegant, interactive real-time DevOps platform monitoring server CPU usage, network pings, database latency, and operational health indicators.",
    category: "DevOps & Analytics",
    imgSeed: "monitoring-latency",
    tags: ["TypeScript", "React", "Node.js", "Socket.io", "Chart.js"],
    metrics: "Discovered & alerted on 3 network anomalies",
    details: [
      "Utilized custom WebSocket events to push microsecond server telemetry directly from host Linux workers to client React views.",
      "Styled an immersive low-latency canvas overlay rendering smooth animation flows for active socket threads.",
      "Configured secure Slack and Email webhook integrations for alerts triggering past customized thresholds (e.g., CPU > 92%).",
      "Created granular filters allowing DevOps engineers to search system events, view pings, and isolate historical memory leaks."
    ],
    demoUrl: "#projects",
    githubUrl: "https://github.com"
  },
  {
    id: "api-gateway",
    title: "Enterprise API Gateway Platform",
    description: "A low-latency API gateway proxy featuring automatic JWT verification, robust IP rate-limiting, and microservices path rewriting.",
    category: "Backend Infrastructure",
    imgSeed: "api-gateway-flow",
    tags: ["Node.js", "Express", "Redis", "TypeScript", "Helmet"],
    metrics: "Proxy overhead latency kept under 4ms",
    details: [
      "Pioneered secure multi-tenant authorization workflows using clean cryptographic token rotation models.",
      "Engineered memory-optimized sliding-window rate limiters utilizing Redis cache registers to prevent DDoS exploits.",
      "Added dynamic microservices proxy paths that rewrite incoming headers and strip unsafe query traces.",
      "Implemented comprehensive log streaming with custom Express transports capturing IP payloads and profiling queries."
    ],
    demoUrl: "#projects",
    githubUrl: "https://github.com"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    icon: "monitor",
    skills: [
      { name: "React & Hooks", proficiency: 94 },
      { name: "TypeScript", proficiency: 90 },
      { name: "Tailwind CSS v4 & v3", proficiency: 95 },
      { name: "Framer Motion", proficiency: 88 },
      { name: "Redux & State Architecture", proficiency: 85 }
    ]
  },
  {
    id: "backend",
    name: "Backend & Core APIs",
    icon: "server",
    skills: [
      { name: "Node.js & Express", proficiency: 92 },
      { name: "REST API Architecture", proficiency: 95 },
      { name: "Python & Core Logic", proficiency: 82 },
      { name: "Reverse Proxies & Gateways", proficiency: 85 },
      { name: "JWT Auth & Security", proficiency: 90 }
    ]
  },
  {
    id: "data",
    name: "Databases & Engines",
    icon: "database",
    skills: [
      { name: "PostgreSQL & SQL", proficiency: 88 },
      { name: "MongoDB", proficiency: 90 },
      { name: "Query Profiling & Indexing", proficiency: 85 },
      { name: "Data Normalization", proficiency: 90 },
      { name: "Caching (Redis)", proficiency: 80 }
    ]
  },
  {
    id: "infrastructure",
    name: "Docker & System Ops",
    icon: "layers",
    skills: [
      { name: "Docker & Containers", proficiency: 86 },
      { name: "Git & CI/CD Pipelines", proficiency: 92 },
      { name: "Linux Administration", proficiency: 85 },
      { name: "Cloud Deployment", proficiency: 88 },
      { name: "System Logging & Alerts", proficiency: 85 }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: "s-fullstack",
    title: "Full-Stack Web Development",
    description: "Creating comprehensive, scalable, and responsive web applications from initial database script designs to final visual user interface animations.",
    icon: "layout-dashboard",
    detailedPoints: [
      "Custom single-page and server-rendered React apps",
      "Sleek and responsive desktop-to-mobile visual optimization",
      "Standard-compliant, typesafe TypeScript codebases",
      "Optimized build assets with lightning-fast initial load times"
    ]
  },
  {
    id: "s-api",
    title: "Secure API Development",
    description: "Developing robust and reliable server-side REST engines, authentication mechanisms, path routing filters, and API proxy structures.",
    icon: "plug",
    detailedPoints: [
      "Well-documented and intuitive path routing patterns",
      "Granular JWT and token verification pipelines",
      "Sliding-window IP rate-limiting protection",
      "Fast response formatting with compression and caching"
    ]
  },
  {
    id: "s-db",
    title: "Database Design & Tuning",
    description: "Designing reliable SQL/NoSQL structures, writing optimized index scopes, and preventing transaction bottlenecks.",
    icon: "hard-drive",
    detailedPoints: [
      "Clean relational structures with foreign key safety",
      "Specialized indexing to cut query times from seconds to ms",
      "NoSQL document schema modeling for schema-free data",
      "Automatic data backup and recovery scripts"
    ]
  },
  {
    id: "s-ui",
    title: "Modern UI Engineering",
    description: "Translating sophisticated visuals into accessible, standard-compliant Tailwind interfaces backed by smooth, non-intrusive motion layout triggers.",
    icon: "palette",
    detailedPoints: [
      "Aesthetic layouts following high-contrast spacing guides",
      "Rich micro-interactions using native Framer Motion",
      "Fully compliant CSS/ARIA tags for modern screen readers",
      "Fluid state updates devoid of layout shifts"
    ]
  },
  {
    id: "s-devops",
    title: "DevOps & Code Auditing",
    description: "Packaging apps inside standard Docker containers, configuring automation builds, and hardening server-side parameters.",
    icon: "gauge",
    detailedPoints: [
      "Isolated container structures making apps host-agnostic",
      "Thorough profiling audits identifying CPU bottlenecks",
      "Secure header configurations (Helmet, CORS parameters)",
      "Continuous build/test integration ensuring strict QA"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Nshimyumuremyi Emmanuel",
    role: "Senior Tech Lead",
    company: "Apex Tech Labs",
    quote: "Jean Baptiste delivered a highly performant inventory dashboard workflow that reduced loading latency on our warehouse dashboards by 45%. His focus on clean data schemas and structural design is unparalleled.",
    avatarSeed: "emmanuel"
  },
  {
    id: "test-2",
    name: "Mukamana Solange",
    role: "E-Commerce Operations Director",
    company: "Delice Bakes",
    quote: "Jean Baptiste's bakery ordering suite transformed our local bakery operations. Customers love the customization flow, and our kitchen chefs have been processing deliveries 30% faster thanks to his administrative dashboard layouts.",
    avatarSeed: "solange"
  },
  {
    id: "test-3",
    name: "Iradukunda Eric",
    role: "Systems Administrator",
    company: "CloudCore",
    quote: "TJB designed an exceptional API gateway configuration that easily manages token validation, path forwarding, and IP limits under heavy loads. His commitment to system stability and optimized code is exemplary.",
    avatarSeed: "eric"
  }
];

export const SCHOOLS: SchoolNode[] = [
  {
    id: "eden",
    level: "Primary Education",
    name: "EDEN SCHOOL",
    tag: "Logical Foundations",
    duration: "2009 - 2014",
    distinction: "Distinction in Mathematics",
    highlights: ["Analytical Mindset", "Math & Logic", "Problem Solving"],
    desc: "Cultivated foundational logical thinking, mathematical proficiency, and structured analysis. Established the mathematical baseline for high-grade computational design and engineering architectures.",
    descRw: "Urufatiro rwo kubara, gusesengura no gutekereza neza mu buryo bwa gihanga. Aha ni ho hantu hashyizwe urufatiro rw'imibare rufasha mu gushushanya na porogaramu za mudasobwa zigezweho."
  },
  {
    id: "kamambe",
    level: "Secondary O-Level",
    name: "KAMAMBE",
    tag: "Scientific Methodology",
    duration: "2015 - 2017",
    distinction: "Top Tier Physics Club Lead",
    highlights: ["Natural Sciences", "Systematic Logic", "Team Collaboration"],
    desc: "Engaged in scientific methodologies comprising biology, mathematics, and complex physics patterns. Built exceptional communication protocols and collaborative logic models.",
    descRw: "Hano hiciwe ubumenyi bw'ibanze mu mibare n'ubugenge (Sciences). Twahoraga twitoza gukorera mu matsinda no gukemura ibibazo biteye amatsiko mu buryo bufatika."
  },
  {
    id: "giheke",
    level: "A2 Secondary",
    name: "GIHEKE TSS",
    tag: "Technical Instruction Node",
    duration: "2018 - 2020",
    distinction: "Software Systems Gold Medalist",
    highlights: ["Software Dev", "IP Routing", "DBMS Foundations"],
    desc: "Rigorous hands-on immersion in software application development, TCP/IP network infrastructures, database engines, and logical configuration management. Graduated top-of-class with professional system software designs.",
    descRw: "Isomo rishyira mu bikorwa ryo gukora porogaramu, gushyiraho imiyoboro y'itumanaho (Networks), no kubaka amadashibodi y'amakuru. Twarangije ku isonga dufite ubumenyi bwo kubaka porogaramu."
  },
  {
    id: "nyanza",
    level: "Higher Education A1 & A0",
    name: "IPRC NYANZA",
    tag: "Full-Stack System Engineering",
    duration: "2021 - 2024",
    distinction: "Engineering Excellence Lead Candidate",
    highlights: ["Advanced Software Eng", "System Architecture", "Telemetry APIs"],
    desc: "Acquired elite theoretical and practical expertise (A1 & A0 credentials) covering advanced algorithms, cloud microservices, architectural patterns, relational database optimization, and high-performance server routines.",
    descRw: "Amashuri makuru na kaminuza mu gukora porogaramu zikomye (Software Engineering), amategeko arinda urubuga, kubaka za API zihuta no gusesengura mudasobwa mu buryo buhanitse (A1 & A0)."
  }
];

