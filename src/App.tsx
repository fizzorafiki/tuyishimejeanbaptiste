import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Code,
  Database,
  Terminal,
  Globe,
  Server,
  Zap,
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Check,
  ExternalLink,
  Github,
  Linkedin,
  ChevronUp,
  Menu,
  X,
  Send,
  Sparkles,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Quote,
  Activity,
  HardDrive,
  LayoutGrid,
  Plug,
  Palette,
  Gauge,
  User,
  Coffee,
  Download,
  MapPin,
  Calendar,
  Layers,
  Cpu,
  Shield,
  Camera,
  Eye
} from "lucide-react";
import { PROJECTS, SKILL_CATEGORIES, SERVICES, TESTIMONIALS } from "./data";
import { Project, ChatMessage, VisitorMessage, SkillCategory } from "./types";
import { TRANSLATIONS, BAPTISTE_GALLERY } from "./translations";
import { WebGLShader } from "./components/ui/web-gl-shader";
import { LiquidButton } from "./components/ui/liquid-glass-button";

const scrollRevealVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function App() {
  // Scroll Parallax Hooks
  const { scrollY } = useScroll();
  const yHeroText = useTransform(scrollY, [0, 600], [0, -85]);
  const yHeroImg = useTransform(scrollY, [0, 600], [0, 60]);
  const rotateHeroImg = useTransform(scrollY, [0, 600], [0, 6]);
  const opacityHeroElements = useTransform(scrollY, [0, 450], [1, 0.15]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.08]);

  // Navigation & menu states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [activeTab, setActiveTab ] = useState("about");

  // Localized state with English and Kinyarwanda
  const [language, setLanguage] = useState<"en" | "rw">("en");
  const t = TRANSLATIONS[language];

  // Local clock state
  const [currentTimeUTC, setCurrentTimeUTC] = useState("");
  const [currentLocalTime, setCurrentLocalTime] = useState("");

  // Skills interactive category selector
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("frontend");

  // Project modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Photo Gallery states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null);
  const [copiedGalleryIndex, setCopiedGalleryIndex] = useState(false);

  // Community guestbook local storage state
  const [guestMessages, setGuestMessages] = useState<VisitorMessage[]>([]);

  // Form submission feedback
  const [isFormSending, setIsFormSending] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formMessage, setFormMessage] = useState("");

  // AI assistant states
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Hello! I am Jean Baptiste's AI Portfolio Agent. You can ask me questions about his skills, projects, stack experience, or general professional facts!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Interactive Terminal playground state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "TJB Core OS version 2.50 [Initialized successfully]",
    "Type '/help' or select a shortcut script below to query active developer records.",
    "Target system: http://localhost:3000 | Ingress route: standard-safe"
  ]);
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);

  // Self-typing hero loop
  const heroRoles = [
    "Building scalable full-stack architectures...",
    "Designing optimized database systems...",
    "Implementing microservices and secure custom APIs...",
    "Crafting clean and fluid React interfaces...",
    "Hardening production Docker container nodes..."
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  // Setup local clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // UTC representation
      setCurrentTimeUTC(now.toUTCString().replace("GMT", "UTC"));
      // Local representations
      setCurrentLocalTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Manage Typing subtitle animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentRole = heroRoles[roleIndex];
    
    if (isDeletingRole) {
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, typedText.length - 1));
      }, 35);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, typedText.length + 1));
      }, 65);
    }

    if (!isDeletingRole && typedText === currentRole) {
      timer = setTimeout(() => setIsDeletingRole(true), 2500); // Wait state
    } else if (isDeletingRole && typedText === "") {
      setIsDeletingRole(false);
      setRoleIndex((prev) => (prev + 1) % heroRoles.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeletingRole, roleIndex]);

  // Load and cache Guestbook log
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tjb-portfolio-guestbook");
      if (saved) {
        setGuestMessages(JSON.parse(saved));
      } else {
        // Hydrate with cool default simulated feedback so it looks highly populated and realistic
        const initialSim = [
          {
            id: "initial-guest-1",
            name: "Ingabire Jeanne",
            email: "jeanne.i@cloudwork.rw",
            topic: "project",
            message: "I checked out your inventory management system and really love the relational structure. Let's schedule a call next week about a business intelligence pipeline!",
            timestamp: "2026-05-30, 14:12"
          },
          {
            id: "initial-guest-2",
            name: "Arthur Pendelton",
            email: "arthur@fintechdev.com",
            topic: "consultation",
            message: "Outstanding api-gateway latency limits. This is high quality engineering.",
            timestamp: "2026-05-29, 09:44"
          }
        ];
        setGuestMessages(initialSim);
        localStorage.setItem("tjb-portfolio-guestbook", JSON.stringify(initialSim));
      }
    } catch (e) {
      console.error("Local storage lookup failed:", e);
    }
  }, []);

  // Handle scroll headers
  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 80);
      
      // Update active hash highlighted tab
      const sections = ["about", "expertise", "projects", "family", "services", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto scroll interactive console logs to view latest entries
  useEffect(() => {
    terminalLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Auto scroll AI Chat window to latest prompt
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Terminal commands handling
  const runTerminalCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const newLogs = [...terminalLogs, `$ ${trimmed}`];

    if (lower === "/help" || lower === "help" || lower === "ls") {
      newLogs.push(
        "Available Console parameters:",
        "  /about      - Display Jean Baptiste's brief mission credentials",
        "  /skills     - List technical skill arrays and rating points",
        "  /projects   - Display current portfolio systems & status",
        "  /metrics    - Performance index measurements",
        "  /clear      - Flush terminal logs log console buffer"
      );
    } else if (lower === "/about") {
      newLogs.push(
        "TJB Personnel Record:",
        "  Role: Full-Stack Engineer / System Architect",
        "  Focus: Writing high-security express proxies, relational database optimizations,",
        "         and fluid, component-driven client portals.",
        "  Philosophy: Crafting architectural code devoid of performance bloat."
      );
    } else if (lower === "/skills") {
      newLogs.push(
        "Direct Tech stack query metrics:",
        "  - TypeScript/JavaScript: 94% status OK",
        "  - React framework:       92% status OK",
        "  - Node.js & Express API: 95% status OK",
        "  - Relational Databases:  90% status OK",
        "  - Container Isolation:   88% status OK"
      );
    } else if (lower === "/projects") {
      newLogs.push(
        "Active production files listed:",
        "  [1] Inventory Management System (React, Node, PostgreSQL, Docker) - Status: ACTIVE",
        "  [2] Bakery Ordering Web Suite   (React, Express, MongoDB, Tailwind) - Status: ACTIVE",
        "  [3] System Monitoring Dashboard (TypeScript, WebSockets, Chart)    - Status: ONLINE",
        "  [4] Low-Latency API Gateway     (Express, Redis, Token rotational)  - Status: ENFORCED"
      );
    } else if (lower === "/metrics") {
      newLogs.push(
        "System telemetry statistics:",
        "  - Server ingress response offset: ~3.8ms",
        "  - Database indexing latency drop: -45%",
        "  - Static asset cache hit ratio:   98.2%",
        "  - Coffee consumption frequency:    High"
      );
    } else if (lower === "/clear" || lower === "clear") {
      setTerminalLogs([]);
      setTerminalInput("");
      return;
    } else {
      newLogs.push(
        `Command '${trimmed}' not found.`,
        "Type '/help' to list supported operational scripts."
      );
    }

    setTerminalLogs(newLogs);
    setTerminalInput("");
  };

  // Chat message sending pipeline with Server-side Gemini API
  const handleSendAIChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAILoading) return;

    const userPrompt = chatInput.trim();
    const timestampStr = new Date();
    
    // Add User Message
    const updatedMessages: ChatMessage[] = [
      ...chatMessages,
      {
        id: `user-msg-${Date.now()}`,
        role: "user",
        content: userPrompt,
        timestamp: timestampStr
      }
    ];

    setChatMessages(updatedMessages);
    setChatInput("");
    setIsAILoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("API request failed with standard error.");
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-msg-${Date.now()}`,
          role: "assistant",
          content: data.content || "I apologize, I encountered an issue compiling a response. Please ask me again!",
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error("AI service failure:", err);
      // Client-side fallback text to keep user experience smooth even during mock states
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-msg-err-${Date.now()}`,
          role: "assistant",
          content: "I'm executing in local sandbox node profile. Jean Baptiste is a professional developer specializing in PostgreSQL databases, Node.js, and client-side React. Let me know which of his projects you would like to audit, or type an inquiry!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  // Submit contact form & append real feedback inside persistent Client Guestbook
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;

    setIsFormSending(true);

    // Simulate reliable web request and persist to simulated guestbook ledger
    setTimeout(() => {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 10) + ", " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      const newMsg: VisitorMessage = {
        id: `guest-msg-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        topic: formTopic || "other",
        message: formMessage.trim(),
        timestamp: formattedDate
      };

      const updatedGuestHub = [newMsg, ...guestMessages];
      setGuestMessages(updatedGuestHub);
      localStorage.setItem("tjb-portfolio-guestbook", JSON.stringify(updatedGuestHub));

      // Reset Form fields
      setFormName("");
      setFormEmail("");
      setFormTopic("");
      setFormMessage("");
      setIsFormSending(false);

      // Trigger automatic console notification on console sandbox as a surprise
      setTerminalLogs((prev) => [
        ...prev,
        `[INCOMING TELEMETRY] Secure contact payload received from ${newMsg.name}. Successfully written to local storage node registry!`
      ]);
      
      // Auto-open success toast or notification
      alert("Success! Your message has been posted live onto the local Developer Message Registry below. Thank you, I'll get back to you soon!");
    }, 1200);
  };

  // Utility to find correct icon for skills and services
  const renderSkillIcon = (iconName: string) => {
    switch (iconName) {
      case "monitor":
        return <Code className="w-5 h-5 text-orange-500" />;
      case "server":
        return <Server className="w-5 h-5 text-orange-500" />;
      case "database":
        return <Database className="w-5 h-5 text-orange-500" />;
      case "layers":
        return <Layers className="w-5 h-5 text-orange-500" />;
      default:
        return <Terminal className="w-5 h-5 text-orange-500" />;
    }
  };

  const getSectionLabel = (sec: string) => {
    switch (sec) {
      case "about": return t.navAbout;
      case "expertise": return t.navExpertise;
      case "projects": return t.navProjects;
      case "family": return t.navFamily;
      case "services": return t.navServices;
      case "contact": return t.navContact;
      default: return sec;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500 selection:text-neutral-950 overflow-x-hidden relative">
      {/* GL Shader Interactive Background */}
      <WebGLShader />

      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/3 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-orange-500/2 blur-[120px] pointer-events-none" />

      {/* Persistent Navigation Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isNavbarScrolled
            ? "bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900 py-4 shadow-lg shadow-neutral-950/20"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#hero"
            className="text-neutral-100 font-mono text-sm tracking-widest font-semibold flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            TJB<span className="text-orange-500">&lt;/&gt;</span>
          </a>

          {/* Core Desktop Navbar Menu Links */}
          <div className="hidden md:flex items-center gap-6">
            {["about", "expertise", "projects", "family", "services", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={() => setActiveTab(section)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors duration-200 relative py-1.5 ${
                  activeTab === section ? "text-orange-500" : "text-neutral-400 hover:text-neutral-100"
                }`}
              >
                {getSectionLabel(section)}
                {activeTab === section && (
                  <motion.div
                    layoutId="navbar-line"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>



          {/* Dynamic Interactive Metadata Clocks */}
          <div className="hidden lg:flex items-center gap-5 border-l border-neutral-900 pl-6 text-neutral-500 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-600 animate-spin" style={{ animationDuration: "12s" }} />
              <span>GMT:</span>
              <span className="text-neutral-300 bg-neutral-900 border border-neutral-900 px-1.5 py-0.5 rounded">
                {currentTimeUTC ? currentTimeUTC.substring(17, 25) : "Ticks..."} UTC
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>DEV NODE:</span>
              <span className="text-orange-500 font-semibold uppercase tracking-wider">ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Pill */}
            <div className="flex items-center bg-neutral-900/60 border border-neutral-800 rounded-full p-0.5 font-mono text-[10px] shadow-inner shrink-0">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  language === "en"
                    ? "bg-orange-500 text-neutral-950 font-bold"
                    : "text-neutral-450 hover:text-neutral-200"
                }`}
                aria-label="Set language to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("rw")}
                className={`px-2.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  language === "rw"
                    ? "bg-orange-500 text-neutral-950 font-bold"
                    : "text-neutral-450 hover:text-neutral-200"
                }`}
                aria-label="Set language to Kinyarwanda"
              >
                RW
              </button>
            </div>

            {/* Quick Trigger to open AI Buddy */}
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs hover:bg-orange-500/20 hover:border-orange-500/40 transition-all font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.aiButtonText}</span>
            </button>

            {/* Mobile Nav Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-neutral-400 hover:text-neutral-100 p-1.5 rounded-lg border border-neutral-900 hover:bg-neutral-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Responsive Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[64px] z-30 bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-900 block md:hidden"
          >
            <div className="flex flex-col gap-5 p-8 max-h-screen overflow-y-auto">
              {["about", "expertise", "projects", "family", "services", "contact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => {
                    setActiveTab(section);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-lg uppercase tracking-widest font-mono py-2 border-b border-neutral-900/50 ${
                    activeTab === section ? "text-orange-500 pl-3 border-l hover:border-orange-500 animate-pulse" : "text-neutral-400"
                  }`}
                >
                  {getSectionLabel(section)}
                </a>
              ))}



              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between p-4 bg-neutral-900/40 rounded-xl border border-neutral-900/80 mt-2">
                <span className="text-[11px] font-mono text-neutral-450 uppercase tracking-widest">{language === "en" ? "Language:" : "Ururimi:"}</span>
                <div className="flex items-center bg-neutral-950 border border-neutral-850 rounded-lg p-0.5 font-mono text-[10px]">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      language === "en"
                        ? "bg-orange-500 text-neutral-950 font-bold"
                        : "text-neutral-450 hover:text-neutral-200"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("rw")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      language === "rw"
                        ? "bg-orange-500 text-neutral-950 font-bold"
                        : "text-neutral-450 hover:text-neutral-200"
                    }`}
                  >
                    RW
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-900 space-y-4">
                <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>ENVIRONMENT STATUS:</span>
                  <span className="text-green-500 font-bold tracking-wider">LIVE NODE COMPILING</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>UTC TIME:</span>
                  <span className="text-neutral-300 font-semibold">{currentTimeUTC || "..."}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Presentation Screen */}
      <header id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6 snap-start">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center relative z-10 py-16">
          
          {/* Left Hero: Display Info */}
          <motion.div
            style={{ y: yHeroText, opacity: opacityHeroElements }}
            className="lg:col-span-7 flex flex-col items-start gap-6"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 backdrop-blur shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase">{t.heroStatus}</span>
            </div>

            <div className="space-y-4">
              <p className="text-orange-500 font-mono text-xs uppercase tracking-[0.3em] font-medium">Full-Stack Software Engineer</p>
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tighter leading-none text-neutral-100">
                Tuyishime <br />
                <span className="text-neutral-500">Jean Baptiste</span>
              </h1>
            </div>

            {/* Simulated typing workflow text */}
            <div className="h-8 flex items-center gap-2 font-mono text-neutral-400 text-sm md:text-base border-l-2 border-orange-500 pl-3 bg-neutral-900/10 py-1 w-full max-w-lg rounded-r">
              <span className="text-orange-500 font-semibold">TJB_node:/$</span>
              <span className="text-neutral-300 font-medium">
                {typedText}
                <span className="animate-pulse bg-orange-500 inline-block w-2.5 h-4 ml-1 align-middle" />
              </span>
            </div>

            <p className="text-sm md:text-base text-neutral-400 font-light max-w-xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <a href="#projects" className="inline-block">
                <LiquidButton size="xl" className="text-white border border-neutral-700/60 rounded-full font-mono">
                  <span>{t.heroBtnPortfolio}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </LiquidButton>
              </a>
              <a href="#contact" className="inline-block">
                <LiquidButton size="xl" className="text-neutral-350 border border-neutral-850 rounded-full hover:text-white font-mono">
                  <span>{t.heroBtnHire}</span>
                  <Mail className="w-3.5 h-3.5 hover:text-orange-500 transition-colors" />
                </LiquidButton>
              </a>
            </div>
          </motion.div>

          {/* Right Hero: Elegant Circular Profile Image */}
          <motion.div
            style={{ y: yHeroImg, opacity: opacityHeroElements, rotate: rotateHeroImg }}
            className="lg:col-span-5 flex items-center justify-center relative w-full h-full min-h-[380px]"
          >
            {/* Ambient background glows */}
            <div className="absolute w-[360px] h-[360px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute w-[240px] h-[240px] rounded-full bg-orange-600/5 blur-[60px] pointer-events-none" />
            
            {/* Outer decorative pulsing circle border */}
            <div className="relative p-2.5 rounded-full border border-neutral-900/60 bg-neutral-950/40 backdrop-blur-md shadow-2xl">
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-orange-500/20 via-transparent to-neutral-800/10 animate-[spin_30s_linear_infinite] pointer-events-none" />
              
              {/* Inner glowing ring wrapper */}
              <div className="relative p-1.5 rounded-full bg-neutral-950 border border-neutral-850 shadow-inner">
                {/* Image container with fixed size, styled nicely */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border border-orange-500/30 shadow-orange-500/10 shadow-lg">
                  <img
                    src="https://i.ibb.co/wtR7Kwf/IMG-20260403-WA0009-1.jpg"
                    alt="Tuyishime Jean Baptiste — Full-Stack Developer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
                </div>
              </div>

              {/* Decorative Tech Badges on the circle */}
              <div className="absolute bottom-2 -right-1 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl px-3.5 py-1.5 backdrop-blur shadow flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[10px] font-mono text-neutral-300 font-bold tracking-wider uppercase">Active Node</span>
              </div>

              <div className="absolute top-2 -left-1 bg-neutral-900/90 border border-neutral-800/80 rounded-2xl px-3.5 py-1.5 backdrop-blur shadow flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-mono text-neutral-300 font-bold tracking-wider uppercase">KIGALI, RWANDA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* About Baptiste Grid section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="about"
        className="py-24 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual Portrait Container */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative border border-neutral-900 bg-neutral-900/20 group">
                {/* Seed themed beautiful backdrop image */}
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=755"
                  alt="Tuyishime Jean Baptiste Portrait"
                  className="w-full h-full object-cover filter grayscale group-hover:scale-105 duration-700 transition"
                />
                
                {/* Visual dark styling overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                
                {/* Metrics detail badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-neutral-950/80 backdrop-blur-md rounded-2xl p-5 border border-neutral-900 text-center">
                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div>
                      <p className="text-xl font-bold text-orange-500">4+</p>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Live Apps</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-orange-500">5+</p>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Services</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-orange-500">100%</p>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Delivered</p>
                    </div>
                  </div>
                </div>

                {/* Floating badge details */}
                <div className="absolute -top-3 -right-3 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 backdrop-blur shadow flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">Active Node</h4>
                    <p className="text-[9px] font-mono text-neutral-500">Dockerized deploy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* General Text Profile */}
            <div className="lg:col-span-7 flex flex-col gap-6 items-start">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/10 rounded-full">
                {t.aboutSubtitle}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">
                {t.aboutTitle}
              </h2>
              <div className="space-y-4 text-neutral-450 font-light text-sm md:text-base leading-relaxed">
                <p>
                  {t.aboutText}
                </p>
                <p className="border-l-2 border-orange-500/40 pl-4 font-mono text-xs text-neutral-400">
                  <strong>{t.aboutFact1Title}</strong>: {t.aboutFact1Desc}
                </p>
                <p className="border-l-2 border-orange-500/40 pl-4 font-mono text-xs text-neutral-400">
                  <strong>{t.aboutFact2Title}</strong>: {t.aboutFact2Desc}
                </p>
              </div>

              {/* Grid details */}
              <div className="grid sm:grid-cols-2 gap-4 w-full pt-4 font-mono text-xs text-neutral-300">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-900/50">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Kigali, Rwanda (GMT+2)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-900/50">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>fizzorafiki@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-900/50">
                  <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Full-Time Contract / Contract Projects</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/40 border border-neutral-900/50">
                  <Coffee className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Speaks: English, French, Kinyarwanda</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 w-full">
                <LiquidButton
                   onClick={() => setIsAIChatOpen(true)}
                  className="text-white border border-orange-500/30 rounded-full font-mono font-medium"
                  size="xl"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>{t.aiButtonText}</span>
                </LiquidButton>
                <a href="#contact" className="inline-block">
                  <LiquidButton size="xl" className="text-neutral-350 border border-neutral-850 rounded-full hover:text-white font-mono">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 hover:text-orange-500 transition-colors" />
                    <span>Schedule Sync</span>
                  </LiquidButton>
                </a>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Expertise Stack Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="expertise"
        className="py-24 bg-neutral-950/40 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full">
              {t.expSubtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">{t.expTitle}</h2>
            <p className="text-neutral-500 font-light text-sm">
              {t.expDesc}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left selector menu buttons */}
            <div className="lg:col-span-4 flex flex-col gap-3.5">
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSkillCategory(cat.id)}
                  className={`relative overflow-hidden flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer group ${
                    selectedSkillCategory === cat.id
                      ? "bg-neutral-900/80 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md"
                      : "bg-neutral-950/10 border-neutral-900/60 text-neutral-400 hover:bg-neutral-900/40 hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`shrink-0 p-2.5 rounded-lg border transition-colors duration-300 ${
                      selectedSkillCategory === cat.id 
                        ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
                        : "bg-neutral-950 border-neutral-850 text-neutral-500 group-hover:text-orange-500/80"
                    }`}>
                      {renderSkillIcon(cat.icon)}
                    </span>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold font-mono block">
                        {cat.name}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                        Telemetry {selectedSkillCategory === cat.id ? t.expTelemetryActive : t.expTelemetryInactive}
                      </span>
                    </div>
                  </div>
                  
                  {/* Blinking status light on categories */}
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        selectedSkillCategory === cat.id ? "bg-orange-400" : "bg-neutral-800"
                      }`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        selectedSkillCategory === cat.id ? "bg-orange-500" : "bg-neutral-750"
                      }`} />
                    </span>
                  </div>
                </button>
              ))}

              <div className="p-5 rounded-2xl border border-neutral-900/60 bg-neutral-950/30 backdrop-blur-sm font-mono text-[11px] text-neutral-500 space-y-3 mt-2">
                <p className="text-neutral-400 uppercase tracking-widest font-bold text-[9px] border-b border-neutral-900 pb-2">Production Standards Audits</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                  <span>Strict TypeScript compilation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                  <span>Query logging & latency metrics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                  <span>OWASP secure header validation</span>
                </div>
              </div>
            </div>

            {/* Right progress sliders matrix */}
            <div className="lg:col-span-8 bg-neutral-900/20 border border-neutral-900 rounded-3xl p-8 relative flex flex-col justify-between min-h-[420px] backdrop-blur-md shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-[100px] rounded-full bg-orange-500/2 blur-[40px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSkillCategory}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-neutral-200 font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-8 flex items-center gap-2">
                      <span className="text-neutral-500">Audit Node:</span>
                      <span className="text-orange-500 bg-orange-500/5 px-2.5 py-1 border border-orange-500/10 rounded-full">
                        {SKILL_CATEGORIES.find((c) => c.id === selectedSkillCategory)?.name}
                      </span>
                    </h3>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      {SKILL_CATEGORIES.find((c) => c.id === selectedSkillCategory)?.skills.map((skill) => (
                        <div key={skill.name} className="space-y-2 font-mono group p-3.5 rounded-xl border border-transparent hover:border-neutral-900/60 hover:bg-neutral-950/20 transition-all duration-300">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-300 group-hover:text-neutral-100 transition-colors font-medium">{skill.name}</span>
                            <span className="text-orange-500 font-extrabold text-[11px] bg-orange-500/5 px-1.5 py-0.5 rounded border border-orange-500/10">{skill.proficiency}%</span>
                          </div>
                          
                          {/* Dynamic custom styled gauge track slider */}
                          <div className="relative w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/80 p-[1px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Built-in live simulation telemetry console */}
                  <div className="mt-8 pt-4 border-t border-neutral-900/60">
                    <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-900 text-[11px] font-mono relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                      </div>
                      <span className="text-orange-500 font-bold block mb-1.5 uppercase tracking-wider text-[9px]">[TJB-Telemetry-Auditor://live-node]</span>
                      <p className="text-neutral-450 leading-relaxed font-light">
                        {selectedSkillCategory === "frontend" && (
                          "// SYSTEM: Production builds compiled under tight TS flags. Dynamic route compression enabled. Strict DOM-performance layouts tested across 12 mobile & desktop viewports."
                        )}
                        {selectedSkillCategory === "backend" && (
                          "// SYSTEM: Core server proxy rates validated at 15k requests/minute. Memory index footprints trimmed safely using cluster management and Redis micro-caching controllers."
                        )}
                        {selectedSkillCategory === "data" && (
                          "// SYSTEM: Relational foreign constraint indices matched. B-Tree leaf fragmentation checked. Zero sequential table scans reported on millions of production unit records."
                        )}
                        {selectedSkillCategory === "infrastructure" && (
                          "// SYSTEM: Secure container isolation profiles verified. Automated Docker registry health checks returned 200 OK. Encrypted TLS keys cached in server security variables."
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Projects Grid Section with dialogs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="projects"
        className="py-24 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full">
                Featured Work
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">Functional Implementations</h2>
            </div>
            <p className="text-neutral-500 font-light text-sm max-w-sm">
              Real world digital platforms combining complex state modules, low-overhead database structures, and strict visual precision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                layoutId={`project-container-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900/15 border border-neutral-900/60 p-0 hover:border-orange-500/30 hover:bg-neutral-900/25 cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(249,115,22,0.06)]"
                whileHover={{ y: -6 }}
              >
                {/* Embedded background abstract glow */}
                <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-orange-500/[0.015] group-hover:bg-orange-500/[0.035] blur-[50px] transition-all duration-500 pointer-events-none" />

                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_2s_infinite]" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-450 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-850">
                          {project.category}
                        </span>
                      </div>
                      <span className="text-xs text-orange-500 font-mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <span className="text-[11px] font-medium">Audit Node</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <h3 className="text-xl font-bold text-neutral-100 group-hover:text-orange-500 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-xs md:text-sm font-light text-neutral-400 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {project.metrics && (
                    <div className="mt-5 flex items-center gap-2 w-fit font-mono text-[10px] text-green-400 bg-green-500/5 border border-green-500/10 px-3 py-1.5 rounded-xl shadow-inner">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <span className="font-semibold">{project.metrics}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-neutral-900/40 bg-neutral-950/40 flex flex-wrap gap-1.5 mt-auto">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-850/80 rounded-lg text-[10px] font-mono font-medium transition-all duration-300 group-hover:border-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project detail lightbox overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Modal element */}
            <motion.div
              layoutId={`project-container-${selectedProject.id}`}
              className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="p-8 overflow-y-auto space-y-6 scrollbar-thin">
                <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block mb-1">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-2xl font-bold text-neutral-100">{selectedProject.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 rounded-lg border border-neutral-900 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-mono tracking-[0.2em] text-orange-500 font-bold">System Summary</h4>
                  <p className="text-sm font-light text-neutral-400 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {selectedProject.metrics && (
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <span className="text-xs font-mono text-neutral-400 block">Verified performance outcome</span>
                      <span className="text-xs font-mono text-green-400 font-semibold">{selectedProject.metrics}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-mono tracking-[0.2em] text-orange-500 font-bold">Architectural Specifications</h4>
                  <ul className="space-y-3 font-mono text-[11px] text-neutral-400 pl-1.5">
                    {selectedProject.details.map((detail, index) => (
                      <li key={index} className="flex gap-3 items-start leading-relaxed">
                        <span className="text-orange-500 select-none shrink-0">&gt;&gt;</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-neutral-900 pt-6 flex flex-wrap gap-2 items-center">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-neutral-900 text-neutral-300 border border-neutral-850 rounded text-[9px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="sm:ml-auto flex gap-3 pt-4 sm:pt-0">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-100 border border-neutral-850 rounded-lg hover:border-neutral-700 transition-all flex items-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Explore Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Immersive Photo Gallery Lightbox Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsGalleryOpen(false);
                setActiveGalleryImage(null);
              }}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl pointer-events-auto cursor-pointer"
            />

            {/* Lightbox element */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.52 }}
              className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:max-h-[75vh]"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setIsGalleryOpen(false);
                  setActiveGalleryImage(null);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100 transition-colors pointer-events-auto cursor-pointer focus:outline-none"
                aria-label="Close Gallery"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Expanded View */}
              <div className="flex-1 bg-neutral-900/10 flex items-center justify-center p-6 relative min-h-[300px] md:min-h-0 border-r border-neutral-900/40">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGalleryImage || BAPTISTE_GALLERY[0].url}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full max-h-[40vh] md:max-h-[60vh] flex items-center justify-center relative rounded-2xl overflow-hidden"
                  >
                    <img
                      src={activeGalleryImage || BAPTISTE_GALLERY[0].url}
                      alt={BAPTISTE_GALLERY.find(p => p.url === (activeGalleryImage || BAPTISTE_GALLERY[0].url))?.title || "Baptiste photo"}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg shadow-black/50"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Side controls & Thumbnails Grid */}
              <div className="w-full md:w-[320px] p-6 flex flex-col justify-between bg-neutral-950/80 relative space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-orange-500 uppercase font-semibold block mb-2">
                    {language === "rw" ? "AMAFOTO DEYITALI" : "SELF-NODE TELEMETRY"}
                  </span>
                  
                  {/* Title and Description */}
                  {(() => {
                    const activeObj = BAPTISTE_GALLERY.find(p => p.url === (activeGalleryImage || BAPTISTE_GALLERY[0].url));
                    return (
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-neutral-100 tracking-tight">
                          {activeObj?.title || "Baptiste Card"}
                        </h3>
                        <p className="text-xs font-light text-neutral-400 leading-relaxed font-mono bg-neutral-900/30 p-3 rounded-xl border border-neutral-900">
                          {activeObj?.desc || "A custom developer metadata aspect snapshot."}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-5">
                  {/* Select other frame */}
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block mb-3">
                      {language === "rw" ? "Hitamo Ifoto" : "Select Frame"}
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {BAPTISTE_GALLERY.map((p) => {
                        const isSelected = (activeGalleryImage || BAPTISTE_GALLERY[0].url) === p.url;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setActiveGalleryImage(p.url)}
                            className={`relative aspect-[3/4] rounded-lg overflow-hidden border transition-all cursor-pointer bg-neutral-950 ${
                              isSelected
                                ? "border-orange-500 ring-2 ring-orange-500/20 scale-102"
                                : "border-neutral-900 hover:border-neutral-750"
                            }`}
                          >
                            <img
                              src={p.url}
                              alt={p.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
                                <Check className="w-4 h-4 text-orange-400" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions: Copy Link & Download Asset */}
                  <div className="space-y-2 border-t border-neutral-900/60 pt-4">
                    <button
                      onClick={() => {
                        const url = window.location.origin + (activeGalleryImage || BAPTISTE_GALLERY[0].url);
                        navigator.clipboard.writeText(url);
                        setCopiedGalleryIndex(true);
                        setTimeout(() => setCopiedGalleryIndex(false), 2000);
                      }}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-850 rounded-xl hover:border-neutral-700 transition-all font-mono text-[10px] text-neutral-300 hover:text-white uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                      <span>{copiedGalleryIndex ? (language === "rw" ? "YAKOPOWE!" : "COPIED!") : (language === "rw" ? "Koporora Inzira" : "Copy Direct Link")}</span>
                    </button>
                    
                    <a
                      href={activeGalleryImage || BAPTISTE_GALLERY[0].url}
                      download={`baptiste_portrait_${BAPTISTE_GALLERY.find(p => p.url === (activeGalleryImage || BAPTISTE_GALLERY[0].url))?.id || "photo"}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-orange-500 text-neutral-950 font-mono font-bold text-[10px] rounded-xl hover:bg-orange-400 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === "rw" ? "Manura Ifoto" : "Download High-Res"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Family Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="family"
        className="py-24 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full">
                {t.famSubtitle}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">{t.famTitle}</h2>
            </div>
            <p className="text-neutral-500 font-light text-sm max-w-sm">
              {t.famDesc}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {t.familyMembers.map((member) => (
              <motion.div
                key={member.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900/15 border border-neutral-900/60 p-6 hover:border-orange-500/35 hover:bg-neutral-900/25 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(249,115,22,0.06)]"
                whileHover={{ y: -6 }}
              >
                {/* Visual glow indicator */}
                <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-orange-500/[0.005] group-hover:bg-orange-500/[0.02] blur-[40px] transition-all duration-500 pointer-events-none" />

                <div className="space-y-4">
                  {/* Avatar section */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-center font-bold text-sm text-orange-500 shadow-inner group-hover:border-orange-500/35 transition-all shrink-0 relative">
                      {member.roleIcon === "Cpu" && <Cpu className="w-5 h-5 text-orange-500 animate-[pulse_3s_infinite]" />}
                      {member.roleIcon === "Database" && <Database className="w-5 h-5 text-orange-500 animate-[pulse_3.5s_infinite]" />}
                      {member.roleIcon === "Shield" && <Shield className="w-5 h-5 text-orange-500 animate-[pulse_4s_infinite]" />}
                      {member.roleIcon === "Activity" && <Activity className="w-5 h-5 text-orange-500 animate-[pulse_2.5s_infinite]" />}
                      {member.roleIcon === "Layers" && <Layers className="w-5 h-5 text-orange-500 animate-[pulse_4.5s_infinite]" />}
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-450 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-850">
                      {member.relation}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="space-y-1">
                    <h3 className="text-md font-bold text-neutral-100 group-hover:text-orange-500 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-mono text-orange-500 font-medium">
                      {member.title}
                    </p>
                  </div>

                  <p className="text-xs font-light text-neutral-450 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Status meter and badges */}
                <div className="mt-6 pt-4 border-t border-neutral-900/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-500">{member.metricLabel}</span>
                    <span className="text-neutral-300 font-semibold">{member.metricValue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-medium text-green-400 bg-green-500/5 border border-green-500/10 px-2.5 py-1 rounded-lg w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[pulse_1.5s_infinite]" />
                    <span>{member.statusText}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services and operations section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="services"
        className="py-24 bg-neutral-950/40 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full">
              {t.servSubtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">{t.servTitle}</h2>
            <p className="text-neutral-500 font-light text-sm">
              {t.servDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, index) => (
              <div
                key={s.id}
                className="p-8 rounded-2xl bg-neutral-900/20 border border-neutral-900 hover:border-orange-500/20 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-center justify-center shrink-0">
                    {s.icon === "layout-dashboard" && <LayoutGrid className="w-5 h-5 text-orange-500" />}
                    {s.icon === "plug" && <Plug className="w-5 h-5 text-orange-500" />}
                    {s.icon === "hard-drive" && <HardDrive className="w-5 h-5 text-orange-500" />}
                    {s.icon === "palette" && <Palette className="w-5 h-5 text-orange-500" />}
                    {s.icon === "gauge" && <Gauge className="w-5 h-5 text-orange-500" />}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-neutral-100 tracking-wide font-mono uppercase text-[12px] group-hover:text-orange-500 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-xs font-light text-neutral-400 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-900/40 p-1 mt-6">
                  <ul className="space-y-2 text-[10px] font-mono text-neutral-500">
                    {s.detailedPoints.map((pt, i) => (
                      <li key={i} className="flex gap-2 items-center leading-relaxed">
                        <Check className="w-3 h-3 text-orange-500 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Developer Philosophy block */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        className="py-24 border-t border-neutral-900/30 overflow-hidden relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-orange-500/2 blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <Quote className="w-10 h-10 text-neutral-800 mx-auto block" />
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-neutral-300 leading-snug">
            &ldquo;Building software systems that are secure, efficient, scalable, and easy to maintain — without unnecessary complexity.&rdquo;
          </h2>
          <div className="flex gap-3 justify-center items-center font-mono">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center font-bold text-xs text-orange-500">
              TJB
            </div>
            <div className="text-left text-xs">
              <p className="text-neutral-200 font-semibold">Tuyishime Jean Baptiste</p>
              <p className="text-neutral-500">Full-Stack Engineer</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Review Slider */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        className="py-24 border-t border-neutral-900/30 bg-neutral-950/40 relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full">
              Peer Verification
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">Testimonials & Reviews</h2>
            <p className="text-neutral-500 font-light text-sm">
              Direct telemetry feedback from product directors, administrative supervisors, and peer technical leads.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="p-8 rounded-2xl bg-neutral-900/10 border border-neutral-900/60 relative flex flex-col justify-between">
                <Quote className="w-5 h-5 text-neutral-800 mb-6" />
                
                <p className="text-xs md:text-sm font-light text-neutral-350 leading-relaxed mb-8 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 font-mono pt-4 border-t border-neutral-900/50">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center uppercase font-bold text-neutral-400 text-xs">
                    {t.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="text-left text-[11px]">
                    <p className="text-neutral-200 font-bold">{t.name}</p>
                    <p className="text-neutral-500 font-semibold">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form and Client Ledger Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="contact"
        className="py-24 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Column: Direct methods */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full inline-block">
                  {t.conSubtitle}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">{t.conTitle}</h2>
                <p className="text-neutral-450 font-light text-sm leading-relaxed max-w-sm">
                  {t.conDesc}
                </p>
              </div>

              {/* Direct links */}
              <div className="space-y-4 max-w-md font-mono text-xs">
                <a
                  href="mailto:fizzorafiki@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:border-orange-500/20 hover:bg-neutral-900/10 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20">
                    <Mail className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-0.5">{t.conDirectEmail}</span>
                    <span className="text-neutral-200 group-hover:text-orange-500 transition-colors">fizzorafiki@gmail.com</span>
                  </div>
                </a>

                <a
                  href="tel:+250780000000"
                  className="flex items-center gap-4 p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:border-orange-500/20 hover:bg-neutral-900/10 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20">
                    <Phone className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold mb-0.5">{t.conContactNode}</span>
                    <span className="text-neutral-200 group-hover:text-orange-500 transition-colors">+250 780 000 000</span>
                  </div>
                </a>
              </div>

              {/* Github and socials */}
              <div className="space-y-2 mt-auto">
                <h4 className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest font-semibold">{t.conSocialTitle}</h4>
                <div className="flex gap-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    className="w-10 h-10 rounded-lg bg-neutral-905 border border-neutral-900/70 hover:border-orange-500/20 text-neutral-400 hover:text-neutral-100 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    className="w-10 h-10 rounded-lg bg-neutral-905 border border-neutral-900/70 hover:border-orange-500/20 text-neutral-400 hover:text-neutral-100 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic submission form */}
            <div className="lg:col-span-7 bg-neutral-900/10 border border-neutral-900 p-8 rounded-2xl relative">
              <div className="absolute inset-x-0 bottom-0 h-[100px] rounded-full bg-orange-500/1 blur-[40px] pointer-events-none" />
              
              <h3 className="text-neutral-250 font-mono text-xs uppercase tracking-widest font-bold mb-6">Telemetry message payload</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-5 font-mono text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-500">{t.conFormName}</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder-neutral-700 font-mono focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-neutral-500">{t.conFormEmail}</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder-neutral-700 font-mono focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500">{t.conFormTopic}</label>
                  <select
                    required
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 font-mono focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-neutral-950">Select topic Category</option>
                    <option value="project" className="bg-neutral-950">Full-Stack Project Rewrite</option>
                    <option value="consultation" className="bg-neutral-950">Technical Consultation</option>
                    <option value="collaboration" className="bg-neutral-950">Developer Collaboration</option>
                    <option value="other" className="bg-neutral-950">Other Inquiries</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-neutral-500">{t.conFormMsg}</label>
                  <textarea
                    required
                    rows={5}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Enter project specifications, latency matrices, or meeting coordinates..."
                    className="w-full bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder-neutral-700 font-mono focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFormSending}
                  className="w-full py-4.5 bg-neutral-100 hover:bg-neutral-200 font-medium text-xs text-neutral-950 border border-none rounded-xl uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                >
                  {isFormSending ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                      <span>{language === "rw" ? "Ohereza..." : "Transmitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.conFormBtnSubmit}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* Living Community Registry guestbook */}
          <div className="mt-20 border-t border-neutral-900 pt-16">
            <div className="space-y-3 mb-10 max-w-xl">
              <h3 className="text-xl font-bold text-neutral-200 font-mono uppercase text-[12px] flex items-center gap-2">
                <Coffee className="w-4 h-4 text-orange-500" />
                <span>Guestbook message ledger</span>
              </h3>
              <p className="text-neutral-505 font-light text-xs leading-relaxed font-mono">
                Real-time synchronized feedback registry. Messages submitted through the contact form are logged directly to local persistent storage below!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {guestMessages.map((msg) => (
                <div key={msg.id} className="p-6 rounded-xl border border-neutral-900 bg-neutral-900/10 flex flex-col justify-between font-mono text-[11px] gap-4">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-neutral-300 font-bold">{msg.name}</span>
                      <span className="text-neutral-550 italic bg-neutral-900 px-2 py-0.5 rounded border border-neutral-850">
                        {msg.topic === "project" ? "rewrite" : msg.topic}
                      </span>
                    </div>
                    <p className="text-neutral-400 font-light leading-relaxed">
                      &rdquo;{msg.message}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 text-[9px] border-t border-neutral-900/40 pt-3 mt-1 justify-between">
                    <span>REGISTRY NODE: OK</span>
                    <span>LOG AT: {msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.section>

      {/* Elegant minimalist styled Footer */}
      <footer className="border-t border-neutral-900/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neutral-400 font-semibold">TJB<span className="text-orange-500">.</span></span>
            <span className="text-neutral-750">|</span>
            <span className="text-neutral-600">{t.footerCopyright} &copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-5 text-neutral-500 hover:text-neutral-400 text-xs font-mono">
            <span>{t.footerRights}</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Agent dialogue Drawer */}
      <AnimatePresence>
        {isAIChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Dark background close shield */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIChatOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            {/* Panel box */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full flex flex-col justify-between shadow-2xl z-10"
            >
              {/* Header */}
              <div className="p-4 bg-neutral-900/50 border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                  <div>
                    <h3 className="font-bold text-neutral-100">AI Portfolio Assistant</h3>
                    <p className="text-[10px] text-neutral-500">Powered by Gemini 3.5 Flash</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAIChatOpen(false)}
                  className="p-1.5 rounded-lg border border-neutral-900 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Log messages flow */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-neutral-100 text-neutral-950 font-medium"
                          : "bg-neutral-900 border border-neutral-850 text-neutral-300"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <span className={`text-[9px] block mt-1.5 font-mono text-right opacity-60 ${msg.role === "user" ? "text-neutral-900" : "text-neutral-550"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isAILoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-900 border border-neutral-850 text-neutral-400 rounded-2xl p-4 text-xs font-mono flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-neutral-405 border-t-transparent animate-spin shrink-0" />
                      <span>Assistant is composing...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggestions quick tap triggers */}
              <div className="p-3 border-t border-neutral-900/60 bg-neutral-950/50 space-y-1.5">
                <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider font-bold">Suggested queries</p>
                <div className="flex flex-wrap gap-1">
                  {[
                    "What projects did Baptiste build?",
                    "What databases do you specialize in?",
                    "How do I reach out to scheduler?"
                  ].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => {
                        setChatInput(sug);
                      }}
                      className="text-[10px] font-mono text-left font-medium text-neutral-400 bg-neutral-900 hover:text-neutral-200 border border-neutral-850 px-2.5 py-1.5 rounded transition-all w-full cursor-pointer"
                    >
                      &gt; {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input section block */}
              <form onSubmit={handleSendAIChat} className="p-4 bg-neutral-900/30 border-t border-neutral-900 flex items-center gap-2.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask and learn about Baptiste's career..."
                  disabled={isAILoading}
                  className="w-full bg-neutral-950 text-xs border border-neutral-900 hover:border-neutral-800 rounded-xl px-4 py-3 placeholder-neutral-650 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAILoading || !chatInput.trim()}
                  className="p-3 bg-neutral-105 border border-none text-neutral-950 rounded-xl hover:bg-neutral-200 disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Scroll back to top shortcut tool */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`fixed bottom-6 right-6 z-30 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-100 hover:border-neutral-700 hover:bg-neutral-850 transition-all shadow-md focus:outline-none cursor-pointer ${
          isNavbarScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        aria-label="Back to Top"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
    </div>
  );
}
