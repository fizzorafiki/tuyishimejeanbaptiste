import baptisteYellow from "./assets/images/baptiste_yellow_1780256939738.png";
import baptisteRacing from "./assets/images/baptiste_racing_1780256960193.png";
import baptisteJersey from "./assets/images/baptiste_jersey_1780256980156.png";
import baptisteContrast from "./assets/images/baptiste_contrast_1780256998810.png";
import baptisteThoughtful from "./assets/images/baptiste_thoughtful_1780257019193.png";

import nadineImg from "./assets/images/family_nadine_1780257056936.png";
import samuelImg from "./assets/images/family_samuel_1780257077415.png";
import motherImg from "./assets/images/family_mother_1780257096357.png";
import fatherImg from "./assets/images/family_father_1780257117654.png";

export const BAPTISTE_GALLERY = [
  { id: "g-yellow", url: baptisteYellow, title: "Baptiste - Yellow Canvas", desc: "Standing by a warm yellow wall in a sleek leather jacket." },
  { id: "g-racing", url: baptisteRacing, title: "Baptiste - Racing Fire Jacket", desc: "Leaning classic style in custom racing colors & checker sleeve." },
  { id: "g-jersey", url: baptisteJersey, title: "Baptiste - Nerazzurri Pride", desc: "Wearing the iconic vertical-striped blue and black Inter Milan jersey." },
  { id: "g-contrast", url: baptisteContrast, title: "Baptiste - High-Contrast Nostalgia", desc: "Elegant black-and-white custom leather jacket and brick background shot." },
  { id: "g-thoughtful", url: baptisteThoughtful, title: "Baptiste - Reflection Node", desc: "Thoughtful focus pose on clean physical architecture solutions." }
];

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  title: string;
  bio: string;
  metricLabel: string;
  metricValue: string;
  statusText: string;
  roleIcon: string; // e.g. "Cpu", "Activity", "Layers", "Database", "Shield"
  image?: string;
  gallery?: string[];
}

export interface TranslationSet {
  navAbout: string;
  navExpertise: string;
  navProjects: string;
  navFamily: string;
  navServices: string;
  navContact: string;
  
  heroStatus: string;
  heroGreeting: string;
  heroSubtitle: string;
  heroBtnPortfolio: string;
  heroBtnHire: string;
  
  aboutTitle: string;
  aboutSubtitle: string;
  aboutText: string;
  aboutFact1Title: string;
  aboutFact1Desc: string;
  aboutFact2Title: string;
  aboutFact2Desc: string;
  
  expTitle: string;
  expSubtitle: string;
  expDesc: string;
  expProductionStandards: string;
  expTelemetryActive: string;
  expTelemetryInactive: string;
  expAuditReport: string;
  
  projTitle: string;
  projSubtitle: string;
  projDesc: string;
  projAuditNode: string;
  
  famTitle: string;
  famSubtitle: string;
  famDesc: string;
  familyMembers: FamilyMember[];
  
  servTitle: string;
  servSubtitle: string;
  servDesc: string;
  
  conTitle: string;
  conSubtitle: string;
  conDesc: string;
  conFormName: string;
  conFormEmail: string;
  conFormTopic: string;
  conFormMsg: string;
  conFormBtnSubmit: string;
  conDirectEmail: string;
  conContactNode: string;
  conSocialTitle: string;
  
  aiWelcome: string;
  aiButtonText: string;
  
  footerCopyright: string;
  footerRights: string;
}

export const TRANSLATIONS: Record<"en" | "rw", TranslationSet> = {
  en: {
    navAbout: "About",
    navExpertise: "Expertise",
    navProjects: "Projects",
    navFamily: "Family",
    navServices: "Services",
    navContact: "Contact",
    
    heroStatus: "Open to custom roles",
    heroGreeting: "Crafting High-Grade Full Stack Digital Systems",
    heroSubtitle: "A self-taught full-stack engineer specialized in high-performance Node API development, PostgreSQL optimization, and fluid container deployments.",
    heroBtnPortfolio: "Audit Portfolio",
    heroBtnHire: "Hire Baptiste",
    
    aboutTitle: "Tuyishime Jean Baptiste",
    aboutSubtitle: "Professional Credentials",
    aboutText: "A versatile computer systems practitioner focused on engineering low-latency interfaces, query routers, and reliable application state databases. Combining aesthetic UI/UX precision with bulletproof server-side architectures.",
    aboutFact1Title: "Kigali Gateway Node",
    aboutFact1Desc: "Operating directly from Kigali, Rwanda to deliver global compliance standards.",
    aboutFact2Title: "100% Performance SLA",
    aboutFact2Desc: "Each microservice is profiling-optimized with sub-100ms average query latencies.",
    
    expTitle: "Expertise Stack & Telemetry",
    expSubtitle: "Technical Competence",
    expDesc: "Interactive summary of core compiler pipelines, query languages, and container engineering proficiency.",
    expProductionStandards: "Production Standards Audits",
    expTelemetryActive: "Telemetry Connected",
    expTelemetryInactive: "Telemetry Inactive",
    expAuditReport: "Audit Node:",
    
    projTitle: "Production Relentless Builds",
    projSubtitle: "Active Protocols",
    projDesc: "Deployments currently executed inside production environments featuring live metrics data registries.",
    projAuditNode: "Audit Node",
    
    famTitle: "Family Core Nodes",
    famSubtitle: "System Integrators",
    famDesc: "An honors-level tribute layout tracking the core supportive human network behind Jean Baptiste's technical execution.",
    familyMembers: [
      {
        id: "member-jb",
        name: "Tuyishime Jean Baptiste",
        relation: "Self / Subject",
        title: "Full-Stack Engineer",
        bio: "Specializes in scalable Express APIs, database query optimizations, and low-latency React views. Orchestrates the local code portfolio and node pipelines.",
        metricLabel: "Active Stack",
        metricValue: "Node / TS / React",
        statusText: "Core Subject",
        roleIcon: "Cpu",
        image: baptisteJersey,
        gallery: [baptisteYellow, baptisteRacing, baptisteJersey, baptisteContrast, baptisteThoughtful]
      },
      {
        id: "member-mother",
        name: "Dusabiremana Antoinette",
        relation: "Mother",
        title: "Database Core Engine",
        bio: "The structural foundation of the family cluster. Optimizes emotional index storage, caches unconditional support, and provides high-uptime warmth.",
        metricLabel: "Affection SLA",
        metricValue: "100% Always-On",
        statusText: "Operational Core",
        roleIcon: "Database",
        image: motherImg
      },
      {
        id: "member-father",
        name: "Nkundwanabake Sylvestre",
        relation: "Father",
        title: "Chief Security & Router",
        bio: "Administers security profiles, protects system boundary firewalls, and installs critical structural routing keys across generations.",
        metricLabel: "Guidance Level",
        metricValue: "Enterprise Grade",
        statusText: "Secure Gateway",
        roleIcon: "Shield",
        image: fatherImg
      },
      {
        id: "member-sister",
        name: "Dusengimana Nadine",
        relation: "Sister",
        title: "UX/UI Communication Hub",
        bio: "Coordinates event streams, manages shared visual resources, and provides high-bandwidth empathy queues to debug daily operational problems.",
        metricLabel: "Sync Thread Rate",
        metricValue: "Auto Syncing",
        statusText: "Stable Router",
        roleIcon: "Activity",
        image: nadineImg
      },
      {
        id: "member-brother",
        name: "Hakizimana Samuel",
        relation: "Brother",
        title: "Operations & Microservices",
        bio: "Traces pipeline deployment tasks, handles load balances, and debugs client-server communication handshakes for immediate family support.",
        metricLabel: "Docker Uplinked",
        metricValue: "Multi-cluster Hub",
        statusText: "Uptime Verified",
        roleIcon: "Layers",
        image: samuelImg
      }
    ],
    
    servTitle: "Engineering Ops Solutions",
    servSubtitle: "Telemetry Capabilities",
    servDesc: "Direct technical solutions provided across production systems, indexing, and API microservice routers.",
    
    conTitle: "Let's Build Something Beautiful",
    conSubtitle: "Get in Touch",
    conDesc: "Schedule a teleconference review about your modern web portal database indexing, server refactoring, or scaling.",
    conFormName: "Operator Name",
    conFormEmail: "Direct Mail Node",
    conFormTopic: "Topic Select Array",
    conFormMsg: "Your Micro-payload Message",
    conFormBtnSubmit: "Transmit Payload",
    conDirectEmail: "Direct Email",
    conContactNode: "Contact Node",
    conSocialTitle: "Social Telemetry links",
    
    aiWelcome: "Hello! I am Jean Baptiste's AI Portfolio Agent. You can ask me questions about his family, skills, projects, or professional credentials!",
    aiButtonText: "Ask AI Agent Anything",
    
    footerCopyright: "Tuyishime Jean Baptiste — System Architect Node",
    footerRights: "All telemetry rights reserved."
  },
  rw: {
    navAbout: "Ibyerekeye",
    navExpertise: "Ubumenyi",
    navProjects: "Imishinga",
    navFamily: "Umuryango",
    navServices: "Serivisi",
    navContact: "Twandikire",
    
    heroStatus: "Niteguye imirimo mishya",
    heroGreeting: "Guhanga Sisitemu z'Imiyoboro ya Full-Stack Zigezweho",
    heroSubtitle: "Umuhanga wiyigishije mu guhanga imishinga ye, inzobere mu gukora API za Node zihuta cyane, kunoza PostgreSQL, no gushyira porogaramu mu ngunguru za Docker.",
    heroBtnPortfolio: "Genzura Imishinga",
    heroBtnHire: "Koresha Baptiste",
    
    aboutTitle: "Tuyishime Jean Baptiste",
    aboutSubtitle: "Ibyangombwa by'Umwuga",
    aboutText: "Ninzobere mu gukora sisitemu za mudasobwa, nshishikajwe no kubaka imiyoboro yihuta, kunoza amashusho n'amakuru meza ku ruhande rw'umukoresha ndetse n'inyuma mu bubiko bwa mudasobwa busobanutse.",
    aboutFact1Title: "Ahantu Akorera (Kigali Node)",
    aboutFact1Desc: "Akorera muryo butaziguye i Kigali mu Rwanda, atanga serivisi zujuje ubuziranenge ku rwego rw'isi.",
    aboutFact2Title: "Umuvuduko 100% SLA",
    aboutFact2Desc: "Buri serivisi ntoya inozwa neza kugira ngo igere ku muvuduko uri munsi ya minisegonda 100.",
    
    expTitle: "Urutonde rw'Ubumenyi",
    expSubtitle: "Ubumenyi mu Bukorikori",
    expDesc: "Incamake y'ubumenyi buhanitse mu gukora imirimo y'inyuma n'imbere, indimi n'ibikoresho bikoreshwa muri sisitemu.",
    expProductionStandards: "Ibizami by'Ubuziranenge",
    expTelemetryActive: "Ipimo Ifunguye",
    expTelemetryInactive: "Ipimo Ifunze",
    expAuditReport: "Genzura Ubumenyi:",
    
    projTitle: "Imishinga Yakozwe",
    projSubtitle: "Imiyoboro Ifunguye",
    projDesc: "Porogaramu ziri gukoreshwa kuri ubu zifite ububiko bumara imyaka n'ibipimo bizima by'umuvuduko.",
    projAuditNode: "Genzura Umushinga",
    
    famTitle: "Abagize Umuryango we",
    famSubtitle: "Imirimo n'Ubusugire",
    famDesc: "Urutonde kandi n'ishimwe rukomeye ku muryango amfasha, ari nawo shingiro n'inkunga ikomeye mu mirimo yanjye ya buri munsi.",
    familyMembers: [
      {
        id: "member-jb",
        name: "Tuyishime Jean Baptiste",
        relation: "Twebwe",
        title: "Umuhanga Mukuru (Full-Stack)",
        bio: "Umuhanga mu kubaka ama API ya Express akora neza, kunoza idatabaza ya SQL, no gukina na React. Ni we uha umurongo umushinga.",
        metricLabel: "Ubumenyi",
        metricValue: "Node / TS / React",
        statusText: "Afunguye Imishinga",
        roleIcon: "Cpu",
        image: baptisteJersey,
        gallery: [baptisteYellow, baptisteRacing, baptisteJersey, baptisteContrast, baptisteThoughtful]
      },
      {
        id: "member-mother",
        name: "Dusabiremana Antoinette",
        relation: "Mama",
        title: "Umutima n'Ishingiro rya Datorera",
        bio: "Urugero rw'ubumwe n'inkingi ya mwamba y'umuryango wacu. Abika urukundo rutagereranywa, agahora afunguye kandi akongeza umutekano.",
        metricLabel: "SLA y'Urukundo",
        metricValue: "100% Idahagarara",
        statusText: "Umutima Mukuru",
        roleIcon: "Database",
        image: motherImg
      },
      {
        id: "member-father",
        name: "Nkundwanabake Sylvestre",
        relation: "Papa",
        title: "Umujyanama Mukuru w'Umutekano",
        bio: "Icungamutekano n'inzira z'ubuyobozi mu gisekuru cyacu. Arinda imbibi, akadutoza ubusugire no gufata neza inzira zose z'ubuzima.",
        metricLabel: "Inyigisho ze",
        metricValue: "Zihamye cyane",
        statusText: "Umutekano Wokomeza",
        roleIcon: "Shield",
        image: fatherImg
      },
      {
        id: "member-sister",
        name: "Dusengimana Nadine",
        relation: "Mushiki wanjye",
        title: "Ihuriro ry'Itumanaho n'Ubwumvikane",
        bio: "Yoroshya itumanaho ry'amakuru mu muryango, adufasha guhuza imishinga ndetse akanatuyobora mu bihe bitoroshye by'ubuzima.",
        metricLabel: "Sync Thread Rate",
        metricValue: "Ihuza Rikora Neza",
        statusText: "Itumanaho Ryizewe",
        roleIcon: "Activity",
        image: nadineImg
      },
      {
        id: "member-brother",
        name: "Hakizimana Samuel",
        relation: "Murumuna wanjye",
        title: "Guhuza no Gucunga Sisitemu",
        bio: "Ushinzwe kuboneza neza no gushyira mu bikorwa imirimo itandukanye ya buri munsi, anyarutsa serivisi no gufasha umuryango cyane.",
        metricLabel: "Guhuza Serivisi",
        metricValue: "Node Clusters zose",
        statusText: "Igihe cyo Gukora: 100%",
        roleIcon: "Layers",
        image: samuelImg
      }
    ],
    
    servTitle: "Ibyo Dukora n'Ibisubizo Bitangwa",
    servSubtitle: "Ubumenyi muri Serivisi",
    servDesc: "Ibisubizo bya tekiniki bitangwa ku mishinga, kubungabunga amakuru n'imiyoboro y'itumanaho rya API.",
    
    conTitle: "Mubeza Duhange Imishinga Ikomeye",
    conSubtitle: "Twandikire",
    conDesc: "Saba ibiganiro ku bijyanye no kunoza idatabaza, guhindura imiterere y'iserveri, cyangwa kwagura sisitemu yawe.",
    conFormName: "Izina ry'Ukoresha",
    conFormEmail: "Imeri yawe",
    conFormTopic: "Hitamo Icyo Twandikira",
    conFormMsg: "Ubutumwa bwawe",
    conFormBtnSubmit: "Ohereza Payload",
    conDirectEmail: "Imeri Itaziguye",
    conContactNode: "Inomero ya Telephone",
    conSocialTitle: "Imiyoboro n'Imbuga nkoranyambaga",
    
    aiWelcome: "Muraho! Ndi Intumwa ya AI ya Jean Baptiste. Urashobora kumbaza ikibazo icyo ari cyo cyose ku muryango we, ubumenyi bwe, imishinga ye cyangwa ibindi bijyanye n'akazi!",
    aiButtonText: "Baza AI Icyo Aricyo Cyose",
    
    footerCopyright: "Tuyishime Jean Baptiste — Umuhanga mu Kubaka Sisitemu",
    footerRights: "Uburenganzira bwose burabunzwe."
  }
};
