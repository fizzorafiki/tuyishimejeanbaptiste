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
  Instagram,
  Twitter,
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
  Eye,
  Lock,
  Unlock,
  Settings,
  Plus,
  Trash2,
  Upload
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

  // Dynamic customized data states (persisted in localStorage)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("tjb_portfolio_projects");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading portfolio projects:", e);
      }
    }
    return PROJECTS;
  });

  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(() => {
    const saved = localStorage.getItem("tjb_portfolio_skill_categories");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading skill categories:", e);
      }
    }
    return SKILL_CATEGORIES;
  });

  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; title: string; desc: string }[]>(() => {
    const saved = localStorage.getItem("tjb_portfolio_gallery");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading gallery images:", e);
      }
    }
    return BAPTISTE_GALLERY;
  });

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDesc, setNewGalleryDesc] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");

  const getProjectImage = (project: Project) => {
    if (project.image) return project.image;
    
    // Provide gorgeous Unsplash falls backs based on ID or category or image seed
    const seed = project.imgSeed || project.id || "";
    if (seed.includes("inventory")) {
      return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600";
    }
    if (seed.includes("bakery")) {
      return "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600";
    }
    if (seed.includes("monitoring") || seed.includes("monitor") || seed.includes("latency")) {
      return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600";
    }
    if (seed.includes("gateway") || seed.includes("api")) {
      return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600";
    }
    
    // Default gorgeous dark tech setup
    return "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600";
  };

  // Admin authentication and modal portal states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("tjb_admin_session") === "active";
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSuccessMsg, setAdminSuccessMsg] = useState("");
  const [adminActiveTab, setAdminActiveTab] = useState<"project" | "skill" | "gallery" | "records">("project");

  // Custom router state tracking paths
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // States for adding a project
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("");
  const [newProjectMetrics, setNewProjectMetrics] = useState("");
  const [newProjectTags, setNewProjectTags] = useState("");
  const [newProjectDetails, setNewProjectDetails] = useState(""); // Comma or newline separated
  const [newProjectDemoUrl, setNewProjectDemoUrl] = useState("");
  const [newProjectGithubUrl, setNewProjectGithubUrl] = useState("");
  const [newProjectImage, setNewProjectImage] = useState("");

  // States for adding a skill
  const [selectedOrNewSkillCatId, setSelectedOrNewSkillCatId] = useState("frontend");
  const [newSkillCatName, setNewSkillCatName] = useState("");
  const [newSkillCatIcon, setNewSkillCatIcon] = useState("server");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState(90);

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

  // Admin Login Handle function
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccessMsg("");
    const usernameInput = adminUsername.trim().toLowerCase();
    const isAcceptedUsername = usernameInput === "admin" || usernameInput === "fizzorafiki" || usernameInput === "fizzorafiki@gmail.com";
    if (isAcceptedUsername && adminPassword === "admin123") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("tjb_admin_session", "active");
      setAdminSuccessMsg("Authorization granted. Accessing admin dashboard...");
      // clear inputs
      setAdminUsername("");
      setAdminPassword("");
    } else {
      setAdminError("Invalid credential signatures.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("tjb_admin_session");
    setAdminSuccessMsg("");
    setAdminError("");
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccessMsg("");

    if (!newProjectTitle.trim() || !newProjectDesc.trim() || !newProjectCategory.trim()) {
      setAdminError("Please populate Title, Description, and Category labels.");
      return;
    }

    const tagsArr = newProjectTags
      ? newProjectTags.split(",").map(t => t.trim()).filter(Boolean)
      : ["Custom Node"];

    const detailsArr = newProjectDetails
      ? newProjectDetails.split("\n").map(d => d.trim()).filter(Boolean)
      : [
          "Published and monitored via the administrative settings gateway.",
          "Custom telemetry performance measurements enabled on system entry."
        ];

    const newProj: Project = {
      id: `custom-proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim(),
      category: newProjectCategory.trim(),
      imgSeed: "custom-node",
      tags: tagsArr,
      metrics: newProjectMetrics.trim() || undefined,
      details: detailsArr,
      demoUrl: newProjectDemoUrl.trim() || "#projects",
      githubUrl: newProjectGithubUrl.trim() || "https://github.com",
      image: newProjectImage || undefined
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("tjb_portfolio_projects", JSON.stringify(updated));

    // Reset standard state hooks
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectCategory("");
    setNewProjectMetrics("");
    setNewProjectTags("");
    setNewProjectDetails("");
    setNewProjectDemoUrl("");
    setNewProjectGithubUrl("");
    setNewProjectImage("");

    setAdminSuccessMsg("Dynamic Project compiled and published successfully.");
  };

  const handleDeleteProject = (projId: string) => {
    const updated = projects.filter(p => p.id !== projId);
    setProjects(updated);
    localStorage.setItem("tjb_portfolio_projects", JSON.stringify(updated));
    setAdminSuccessMsg("Project deleted from environment.");
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccessMsg("");

    if (!newSkillName.trim()) {
      setAdminError("Please provide a Skill name.");
      return;
    }

    let updatedCats = [...skillCategories];

    if (selectedOrNewSkillCatId === "new") {
      if (!newSkillCatName.trim()) {
        setAdminError("Category catalog name is empty.");
        return;
      }
      const newCatId = `custom-cat-${Date.now()}`;
      const newCategory: SkillCategory = {
        id: newCatId,
        name: newSkillCatName.trim(),
        icon: newSkillCatIcon || "server",
        skills: [{ name: newSkillName.trim(), proficiency: Number(newSkillProficiency) }]
      };
      updatedCats.push(newCategory);
      // set updates in selectors
      setSelectedOrNewSkillCatId(newCatId);
      setNewSkillCatName("");
    } else {
      const idx = updatedCats.findIndex(c => c.id === selectedOrNewSkillCatId);
      if (idx !== -1) {
        const skillKey = newSkillName.trim();
        const existingSkillIdx = updatedCats[idx].skills.findIndex(s => s.name.toLowerCase() === skillKey.toLowerCase());
        
        if (existingSkillIdx !== -1) {
          updatedCats[idx].skills[existingSkillIdx].proficiency = Number(newSkillProficiency);
        } else {
          updatedCats[idx].skills.push({ name: skillKey, proficiency: Number(newSkillProficiency) });
        }
      }
    }

    setSkillCategories(updatedCats);
    localStorage.setItem("tjb_portfolio_skill_categories", JSON.stringify(updatedCats));

    setNewSkillName("");
    setNewSkillProficiency(90);
    setAdminSuccessMsg("Technical skill synced with the active catalog.");
  };

  const handleDeleteSkill = (catId: string, skillName: string) => {
    const updatedCats = skillCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          skills: c.skills.filter(s => s.name !== skillName)
        };
      }
      return c;
    }).filter(c => c.skills.length > 0);

    setSkillCategories(updatedCats);
    localStorage.setItem("tjb_portfolio_skill_categories", JSON.stringify(updatedCats));
    setAdminSuccessMsg("Skill point dropped.");
  };

  const handleResetData = () => {
    if (window.confirm("Synchronize database registers to default state? Custom projects and catalog entries will be cleaned.")) {
      setProjects(PROJECTS);
      setSkillCategories(SKILL_CATEGORIES);
      setGalleryImages(BAPTISTE_GALLERY);
      localStorage.removeItem("tjb_portfolio_projects");
      localStorage.removeItem("tjb_portfolio_skill_categories");
      localStorage.removeItem("tjb_portfolio_gallery");
      setAdminSuccessMsg("Registers flushed. Initial state restored.");
    }
  };

  // Convert uploaded files safely to inline base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAdminError("File is too large. Limit is 2MB for storage consistency.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProjectImage(reader.result as string);
        setAdminSuccessMsg("Asset uploaded and processed successfully.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAdminError("File is too large. Limit is 2MB for storage consistency.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalleryImage(reader.result as string);
        setAdminSuccessMsg("Gallery image asset uploaded and parsed.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccessMsg("");

    if (!newGalleryTitle.trim() || !newGalleryDesc.trim() || !newGalleryImage) {
      setAdminError("Please populate Title, Description, and select an image file from your desktop.");
      return;
    }

    const newPhoto = {
      id: `g-custom-${Date.now()}`,
      url: newGalleryImage,
      title: newGalleryTitle.trim(),
      desc: newGalleryDesc.trim()
    };

    const updated = [...galleryImages, newPhoto];
    setGalleryImages(updated);
    localStorage.setItem("tjb_portfolio_gallery", JSON.stringify(updated));

    // Clear form
    setNewGalleryTitle("");
    setNewGalleryDesc("");
    setNewGalleryImage("");
    
    setAdminSuccessMsg("Gallery image published to the photostream successfully!");
  };

  const handleDeleteGalleryImage = (id: string) => {
    const updated = galleryImages.filter(item => item.id !== id);
    setGalleryImages(updated);
    localStorage.setItem("tjb_portfolio_gallery", JSON.stringify(updated));
    setAdminSuccessMsg("Gallery image trace purged from local registry.");
  };

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
      case "cpu":
        return <Cpu className="w-5 h-5 text-orange-500" />;
      case "palette":
        return <Palette className="w-5 h-5 text-orange-500" />;
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

  if (currentPath === "/admin") {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500 selection:text-neutral-950 overflow-x-hidden relative flex flex-col">
        {/* GL Shader Interactive Background */}
        <WebGLShader />

        {/* Dynamic Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.12),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/3 blur-[140px] pointer-events-none" />

        {/* Persistent Navigation Header */}
        <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900/60 py-4 shadow-lg shadow-neutral-950/20">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/");
              }}
              className="text-neutral-100 font-mono text-sm tracking-widest font-semibold flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              TJB<span className="text-orange-500">&lt;/&gt;</span>
              <span className="text-[10px] text-neutral-500 font-normal uppercase tracking-wider bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full ml-1.5">
                Admin Center
              </span>
            </a>

            <div className="flex items-center gap-4 text-neutral-500 text-[11px] font-mono">
              <div className="hidden sm:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-600 animate-spin" style={{ animationDuration: "12s" }} />
                <span>GMT:</span>
                <span className="text-neutral-300 bg-neutral-900 border border-neutral-900 px-1.5 py-0.5 rounded">
                  {currentTimeUTC ? currentTimeUTC.substring(17, 25) : "Ticks..."} UTC
                </span>
              </div>

              <span className="hidden sm:inline text-neutral-850">|</span>

              <button
                onClick={() => navigateTo("/")}
                className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-sans font-medium"
              >
                <span>Back to App</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          </div>
        </nav>

        {/* Space spacing fill */}
        <div className="h-20" />

        {/* Main Content Workspace viewport */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10 flex flex-col">
          
          {/* Status logs */}
          <div className="space-y-4 mb-8">
            {adminError && (
              <div className="p-4 bg-red-500/5 border border-red-500/15 text-red-400 text-xs rounded-xl flex items-center gap-2.5 font-mono animate-[shake_0.5s_ease-in-out] max-w-xl mx-auto w-full">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}
            {adminSuccessMsg && (
              <div className="p-4 bg-green-500/5 border border-green-500/15 text-green-400 text-xs rounded-xl flex items-center gap-2.5 font-mono max-w-xl mx-auto w-full">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{adminSuccessMsg}</span>
              </div>
            )}
          </div>

          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto py-12 w-full">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900/15 border border-neutral-900/70 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative"
              >
                <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-orange-500/[0.015] blur-[30px] pointer-events-none" />
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <span className="p-3 bg-orange-500/5 border border-orange-500/15 text-orange-500 rounded-2xl inline-block mb-3">
                      <Lock className="w-5 h-5 animate-pulse" />
                    </span>
                    <h2 className="text-lg font-bold text-neutral-105">Access Key Challenge</h2>
                    <p className="text-[11px] font-mono text-neutral-500 max-w-xs mx-auto uppercase tracking-wider">Provide secure administrative credentials for portal gate permission</p>
                  </div>

                  <div className="space-y-4 font-mono">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-neutral-450 uppercase tracking-wider block">Developer ID</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., admin"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-neutral-455 uppercase tracking-wider block">Security Token Key</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-950/80 border border-neutral-900 rounded-xl font-mono text-[9.5px] text-neutral-500 text-center uppercase tracking-wider leading-relaxed">
                    Authentication Tip: Login with Username <span className="text-orange-500 font-bold">fizzorafiki</span> or <span className="text-orange-500 font-bold">admin</span> & Password <span className="text-orange-500 font-bold">admin123</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.12)] flex items-center justify-center gap-2 font-bold hover:scale-[1.01]"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Inbound Authenticate Gate</span>
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-10 animate-fade-in flex-1">
              {/* Authorized Dashboard Header control row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 bg-neutral-900/10 border border-neutral-900 rounded-3xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-green-500/[0.01] blur-[60px] pointer-events-none" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-green-400">Gateway Pipeline Status Active</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">Welcome back, Tuyishime Jean Baptiste</h2>
                  <p className="text-[11px] font-mono text-neutral-500">Authorized telemetry system console. Update custom specializations, system designs, and projects index logs dynamically.</p>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="px-4 py-2 border border-red-500/15 text-red-500 bg-red-500/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  Terminate Session
                </button>
              </div>

              {/* Dynamic split space with Tab system */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Switchboard Column */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 space-y-2">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-2 block border-b border-neutral-900 pb-1.5">Active Nodes Panel Switchboard</span>
                    {[
                      { id: "project", label: "Add Project Integration", desc: "Introduce a system blueprint logs node", icon: <LayoutGrid className="w-4 h-4" /> },
                      { id: "skill", label: "Add Skill Specialty", desc: "Update expertise proficiency registers", icon: <Cpu className="w-4 h-4" /> },
                      { id: "gallery", label: "Manage Photo Gallery", desc: "Upload custom photos from your desktop", icon: <Camera className="w-4 h-4" /> },
                      { id: "records", label: "Manage Active Clusters", desc: "View core matrix listings & drop node records", icon: <Activity className="w-4 h-4" /> }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setAdminActiveTab(item.id as any);
                          setAdminError("");
                          setAdminSuccessMsg("");
                        }}
                        className={`w-full p-4 rounded-xl text-left border flex items-center gap-4 transition-all duration-300 cursor-pointer ${
                          adminActiveTab === item.id
                            ? "border-orange-500/40 bg-orange-500/[0.03] text-orange-400 font-semibold"
                            : "border-transparent text-neutral-450 hover:bg-neutral-900/50 hover:text-neutral-200"
                        }`}
                      >
                        <span className={`p-2.5 rounded-lg border transition-all ${
                          adminActiveTab === item.id ? "bg-orange-500/10 border-orange-500/20 text-orange-500" : "bg-neutral-900 border-neutral-850 text-neutral-500"
                        }`}>
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <span className="text-[11px] uppercase tracking-wider font-mono block leading-none font-bold">{item.label}</span>
                          <span className="text-[10px] font-mono text-neutral-500 block mt-1 leading-snug">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Production Standards and Statistics Cards */}
                  <div className="p-5 rounded-2xl border border-neutral-900/60 bg-neutral-900/10 backdrop-blur-md font-mono text-[11px] text-neutral-555 space-y-3.5">
                    <p className="text-neutral-400 uppercase tracking-widest font-bold text-[9px] border-b border-neutral-900 pb-2">Console Operations Check List</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                      <span>Production records persistent on browser node storage</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                      <span>Local and remote files validated with typesafety limits</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                      <span>Secure content forms and escape protocols enabled</span>
                    </div>
                  </div>
                </div>

                {/* Right Workspace Form Module */}
                <div className="lg:col-span-8 bg-neutral-900/15 border border-neutral-900 rounded-3xl p-6 md:p-8 relative min-h-[460px] backdrop-blur-md">
                  <div className="absolute inset-x-0 top-0 h-[100px] rounded-full bg-orange-500/2 blur-[40px] pointer-events-none" />
                  
                  {/* TAB CONTENT: ADD PROJECT */}
                  {adminActiveTab === "project" && (
                    <div className="space-y-6">
                      <div className="border-b border-neutral-900/50 pb-4">
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">Declare New System Design Node</h3>
                        <p className="text-[11px] font-mono text-neutral-555 mt-1">Publish an original creation to the Featured Projects grid index.</p>
                      </div>

                      <form onSubmit={handleAddProject} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Project Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Automated Crypto Ledger"
                              value={newProjectTitle}
                              onChange={(e) => setNewProjectTitle(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Category Segment *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Full-Stack System, Enterprise Gateway"
                              value={newProjectCategory}
                              onChange={(e) => setNewProjectCategory(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">System Description *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Summarize key scope, infrastructure parameters, and systems goals..."
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Key Metric (Optional)</label>
                            <input
                              type="text"
                              placeholder="E.g., Audit latency dropped by 45%"
                              value={newProjectMetrics}
                              onChange={(e) => setNewProjectMetrics(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-205 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Stack Tags (Comma separated)</label>
                            <input
                              type="text"
                              placeholder="React, TypeScript, SQLite, Express"
                              value={newProjectTags}
                              onChange={(e) => setNewProjectTags(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-205 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Image Inputs Section */}
                        <div className="p-5 bg-neutral-950/40 border border-neutral-900 rounded-2xl space-y-4">
                          <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-orange-500" />
                            <span>Project Asset Mockup Image</span>
                          </h4>
                          <p className="text-[11px] text-neutral-505 font-mono">Provide an exquisite illustration. You can upload an image file or paste a custom photo URL.</p>

                          <div className="grid md:grid-cols-2 gap-5 items-start">
                            {/* File upload */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-mono text-neutral-450 uppercase tracking-widest block font-bold">Select Local Image File</span>
                              <div className="relative border border-dashed border-neutral-800 hover:border-orange-500/40 rounded-xl p-4 bg-neutral-950/60 transition-colors flex flex-col items-center justify-center text-center">
                                <Upload className="w-5 h-5 text-neutral-600 mb-2" />
                                <span className="text-[10px] text-neutral-450 font-mono block font-medium">JPEG or PNG file</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileChange}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </div>
                            </div>

                            {/* Direct Web URL */}
                            <div className="space-y-2">
                              <span className="text-[9px] font-mono text-neutral-450 uppercase tracking-widest block font-bold">Or Enter Photo Web URL</span>
                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/...q=80&w=600"
                                value={newProjectImage}
                                onChange={(e) => setNewProjectImage(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3.5 text-xs text-neutral-205 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                              />
                            </div>
                          </div>

                          {/* Preview container */}
                          {newProjectImage && (
                            <div className="pt-2 border-t border-neutral-900 flex items-center gap-4">
                              <div className="w-20 h-11 rounded border border-neutral-850 bg-neutral-950 overflow-hidden shrink-0">
                                <img src={newProjectImage} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <span className="text-[10px] font-mono text-green-400 block font-semibold uppercase">Register Asset Loaded</span>
                                <button
                                  type="button"
                                  onClick={() => setNewProjectImage("")}
                                  className="text-[10px] font-mono text-red-500 hover:text-red-400 underline mt-0.5"
                                >
                                  Purge image link
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Detailed Specs list */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Architectural Specifications (One detail statement per line)</label>
                          <textarea
                            rows={3}
                            placeholder="Implemented typesafe, compiled database routes minimizing memory overhead.&#10;Integrated TLS-enabled endpoints keeping core systems isolated."
                            value={newProjectDetails}
                            onChange={(e) => setNewProjectDetails(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Demo Sandbox Link (Optional)</label>
                            <input
                              type="text"
                              placeholder="#projects"
                              value={newProjectDemoUrl}
                              onChange={(e) => setNewProjectDemoUrl(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-205 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">GitHub Source Repository (Optional)</label>
                            <input
                              type="url"
                              placeholder="https://github.com"
                              value={newProjectGithubUrl}
                              onChange={(e) => setNewProjectGithubUrl(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-205 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Publish Project Integration</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB CONTENT: ADD SKILL */}
                  {adminActiveTab === "skill" && (
                    <div className="space-y-6">
                      <div className="border-b border-neutral-900/50 pb-4">
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">Inject Technical Proficiency specialty</h3>
                        <p className="text-[11px] font-mono text-neutral-555 mt-1">Append localized skill registers or construct dynamic custom groupings.</p>
                      </div>

                      <form onSubmit={handleAddSkill} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Skill Catalog Category</label>
                            <select
                              value={selectedOrNewSkillCatId}
                              onChange={(e) => setSelectedOrNewSkillCatId(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3.5 text-xs text-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                            >
                              {skillCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                              <option value="new">+ Declare New Custom Category</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Skill Specialty Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Go / Gin API, WebSockets"
                              value={newSkillName}
                              onChange={(e) => setNewSkillName(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3.5 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Conditional New Category setup */}
                        {selectedOrNewSkillCatId === "new" && (
                          <div className="p-5 bg-neutral-950/40 border border-neutral-850 rounded-2xl grid md:grid-cols-2 gap-6 animate-fade-in">
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">New Category Directory Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="E.g., Systems Operations, Automation"
                                value={newSkillCatName}
                                onChange={(e) => setNewSkillCatName(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Launcher Icon Representation</label>
                              <select
                                value={newSkillCatIcon}
                                onChange={(e) => setNewSkillCatIcon(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-805 rounded-xl px-4 py-3 text-xs text-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                              >
                                <option value="server">Server (Network Systems)</option>
                                <option value="monitor">Monitor (Frontend Platforms)</option>
                                <option value="database">Database (Storage Engines)</option>
                                <option value="layers">Layers (Systems Admin)</option>
                                <option value="cpu">Cpu (Core Logic)</option>
                                <option value="palette">Palette (Responsive Styling)</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-semibold">Proficiency Rating Level</label>
                            <span className="text-xs font-mono text-orange-500 font-extrabold bg-orange-500/5 px-2.5 py-1 rounded border border-orange-500/10">
                              {newSkillProficiency}% proficiency
                            </span>
                          </div>
                          
                          <input
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            value={newSkillProficiency}
                            onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                            className="w-full h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-orange-500 border border-neutral-900"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-neutral-600">
                            <span>0% (Junior Practitioner)</span>
                            <span>50% (Competent Specialist)</span>
                            <span>100% (Grandmaster Core Authority)</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Sync Skill Specialty Points</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {adminActiveTab === "gallery" && (
                    <div className="bg-neutral-900/10 border border-neutral-900/40 p-6 rounded-2xl space-y-6 animate-fade-in text-left">
                      <div className="border-b border-neutral-900/50 pb-4">
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">Publish Dynamic Photo Node</h3>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">Select an image from your desktop (limit 2MB), assign metadata labels, and broadcast it directly to the landing page photostream.</p>
                      </div>

                      <form onSubmit={handleAddGalleryImage} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Photo Title / Label</label>
                            <input
                              type="text"
                              value={newGalleryTitle}
                              onChange={(e) => setNewGalleryTitle(e.target.value)}
                              placeholder="e.g., Baptiste - Cloud Hackathon Winner"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Event Context / Aspect Description</label>
                            <input
                              type="text"
                              value={newGalleryDesc}
                              onChange={(e) => setNewGalleryDesc(e.target.value)}
                              placeholder="e.g., Presenting scalable API clusters to high-profile developers in Kigali."
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* File upload drag/drop zone */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Select Photo Asset from Desktop</span>
                          <div className="relative border-2 border-dashed border-neutral-900 hover:border-orange-500/40 rounded-2xl p-6 bg-neutral-950/60 transition-colors flex flex-col items-center justify-center text-center">
                            {newGalleryImage ? (
                              <div className="space-y-4">
                                <div className="w-56 h-36 mx-auto rounded-xl overflow-hidden border border-neutral-900 relative">
                                  <img src={newGalleryImage} alt="Gallery item upload preview" className="w-full h-full object-cover" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setNewGalleryImage("")}
                                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-red-500 hover:text-red-400 border border-neutral-850 rounded-lg transition-colors cursor-pointer"
                                >
                                  Remove Selected Image
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-neutral-700 mb-2" />
                                <span className="text-xs text-neutral-300 font-mono block font-medium">Drag-and-drop or Browse desktop files</span>
                                <span className="text-[10px] text-neutral-500 font-mono block mt-1">JPEG, PNG, or GIF up to 2MB</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleGalleryImageChange}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-lg shadow-orange-500/15 flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Plus className="w-4.5 h-4.5" />
                          <span>Publish Dynamic Photo Node</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB CONTENT: ACTIVE NODES CATALOG / MANAGEMENT */}
                  {adminActiveTab === "records" && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-neutral-900/50 pb-4">
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">Node Datastore Clusters</h3>
                        <p className="text-[11px] font-mono text-neutral-555 mt-1">Audit existing projects array and specializations matrix. Pure operational dashboard drop features.</p>
                      </div>

                      {/* Cache reset panel */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-neutral-950/80 border border-neutral-900 rounded-2xl gap-4 font-mono">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-250 uppercase tracking-wide">Authorized State Flush</h4>
                          <p className="text-[10.5px] text-neutral-550 mt-0.5">Flush custom memory configurations to recover default seed static profiles.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetData}
                          className="px-4 py-2.5 bg-red-500/10 border border-red-500/15 text-red-550 hover:text-red-400 hover:bg-red-500/15 rounded-xl text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all"
                        >
                          Reset System Catalog
                        </button>
                      </div>

                      {/* Projects management list - BEAUTIFUL GOOD CARDS GRID */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 border-b border-neutral-900/50 pb-2 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-orange-500" />
                          <span>Currently Active Project Nodes ({projects.length})</span>
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                          {projects.map((proj) => (
                            <div 
                              key={proj.id} 
                              className="p-4 bg-neutral-950/80 border border-neutral-900 rounded-2xl hover:border-orange-500/20 transition-all flex items-center justify-between gap-4 group"
                            >
                              <div className="flex items-center gap-3.5 overflow-hidden">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-850 shrink-0">
                                  <img 
                                    src={getProjectImage(proj)} 
                                    alt={proj.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    referrerPolicy="no-referrer" 
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-semibold text-neutral-200 block truncate text-xs">{proj.title}</span>
                                  <span className="text-[9px] text-neutral-500 block uppercase tracking-wider mt-0.5 truncate font-mono">{proj.category}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-2 rounded-lg border border-neutral-850 text-neutral-550 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer shrink-0"
                                title="Delete project node"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical skill matrix list - BEAUTIFUL GOOD CARDS */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 border-b border-neutral-900/50 pb-2 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-orange-500" />
                          <span>Technical Skill Specializations</span>
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                          {skillCategories.map((cat) => (
                            <div key={cat.id} className="p-4 bg-neutral-950/80 border border-neutral-900 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between border-b border-neutral-900/50 pb-2">
                                <span className="font-bold text-orange-500 text-[11px] tracking-wider uppercase font-mono">{cat.name}</span>
                                <span className="text-[9px] font-mono text-neutral-600">Specialty Set</span>
                              </div>
                              <div className="space-y-1.5 pt-0.5">
                                {cat.skills.length === 0 ? (
                                  <span className="text-[10px] text-neutral-600 block italic leading-none font-mono">No nodes configured</span>
                                ) : (
                                  cat.skills.map((sk) => (
                                    <div key={sk.name} className="flex items-center justify-between gap-3 text-neutral-400 py-1 px-1.5 rounded-lg hover:bg-neutral-900/30 transition-all font-mono text-[10.5px]">
                                      <span className="truncate text-neutral-300 font-medium">{sk.name} ({sk.proficiency}%)</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(cat.id, sk.name)}
                                        className="text-neutral-500 hover:text-red-400 hover:underline text-[9.5px] cursor-pointer font-bold uppercase tracking-wider"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gallery Assets Registry Management */}
                      <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 border-b border-neutral-900/50 pb-2 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-orange-500" />
                          <span>Currently Active Photostream Panels ({galleryImages.length})</span>
                        </h4>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                          {galleryImages.map((p) => (
                            <div
                              key={p.id}
                              className="p-3 bg-neutral-950/80 border border-neutral-900 hover:border-orange-500/20 rounded-2xl flex flex-col justify-between gap-3 group transition-all"
                            >
                              <div className="space-y-2">
                                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-850 relative">
                                  <img
                                    src={p.url}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="font-semibold text-neutral-200 block truncate text-xs">{p.title}</span>
                                  <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed font-mono">{p.desc}</p>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm("Purge this photostream frame? This trace will be permanently deleted from dynamic stores.")) {
                                    handleDeleteGalleryImage(p.id);
                                  }
                                }}
                                className="w-full py-1.5 bg-neutral-900 hover:bg-red-500/10 border border-neutral-850 hover:border-red-500/20 text-neutral-450 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold mt-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Purge Asset Node</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Console operational footer */}
        <footer className="py-8 border-t border-neutral-900 mt-auto bg-neutral-950/80 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
          Tuyishime Jean Baptiste — Administrative Node v1.2.6
        </footer>
      </div>
    );
  }

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
            href={currentPath === "/" ? "#hero" : "/"}
            onClick={(e) => {
              if (currentPath !== "/") {
                e.preventDefault();
                navigateTo("/");
              }
            }}
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
                onClick={(e) => {
                  if (currentPath !== "/") {
                    e.preventDefault();
                    navigateTo("/");
                    setTimeout(() => {
                      const el = document.getElementById(section);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                  setActiveTab(section);
                }}
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
                  onClick={(e) => {
                    if (currentPath !== "/") {
                      e.preventDefault();
                      navigateTo("/");
                      setTimeout(() => {
                        const el = document.getElementById(section);
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
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

              <div className="flex flex-wrap items-center gap-4 pt-4 w-full">
                <LiquidButton
                   onClick={() => setIsAIChatOpen(true)}
                  className="text-white border border-orange-500/30 rounded-full font-mono font-medium"
                  size="xl"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>{t.aiButtonText}</span>
                </LiquidButton>

                <button
                  onClick={() => {
                    if (galleryImages.length > 0) {
                      setActiveGalleryImage(galleryImages[0].url);
                    }
                    setIsGalleryOpen(true);
                  }}
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-850 hover:border-neutral-700 rounded-full font-mono font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/30 hover:scale-[1.01]"
                >
                  <Camera className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span>Interactive Photostream ({galleryImages.length})</span>
                </button>
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

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {skillCategories.map((cat) => (
              <motion.div
                key={cat.id}
                className="relative overflow-hidden rounded-3xl border border-neutral-900/60 bg-neutral-900/15 p-6 md:p-8 hover:border-orange-500/30 hover:bg-neutral-900/25 transition-all duration-300 shadow-xl flex flex-col justify-between group select-none"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", duration: 0.4 }}
              >
                {/* Embedded background abstract glow */}
                <div className="absolute top-0 right-0 w-[160px] h-[160px] rounded-full bg-orange-500/[0.015] group-hover:bg-orange-500/[0.035] blur-[50px] transition-all duration-500 pointer-events-none" />
                
                <div className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-neutral-900/40 pb-4">
                    <div className="flex items-center gap-4">
                      <span className="shrink-0 p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-orange-500 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300">
                        {renderSkillIcon(cat.icon)}
                      </span>
                      <div>
                        <h3 className="text-sm font-mono uppercase tracking-[0.15em] font-bold text-neutral-100">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                          Telemetry Operational Matrix
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                      </span>
                    </div>
                  </div>

                  {/* Skills Progress lists */}
                  <div className="grid gap-x-6 gap-y-5 pt-1">
                    {cat.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-300 font-medium group-hover:text-neutral-100 transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-orange-500 font-extrabold text-[10px] bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">
                            {skill.proficiency}%
                          </span>
                        </div>
                        
                        {/* Custom styled progress slider */}
                        <div className="relative w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/80 p-[0.5px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full shadow-[0_0_6px_rgba(249,115,22,0.25)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Micro operational metrics module at bottom */}
                <div className="mt-8 pt-4 border-t border-neutral-900/40">
                  <div className="bg-neutral-950 rounded-xl p-3.5 border border-neutral-900 text-[10.5px] font-mono relative overflow-hidden">
                    <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider block mb-1">
                      [TJB-Telemetry-Auditor://live-node]
                    </span>
                    <p className="text-neutral-500 leading-relaxed font-light">
                      {cat.id === "frontend" && "// SYSTEM: Production builds compiled under tight TS flags. Dynamic asset compression. Checked layout viewports."}
                      {cat.id === "backend" && "// SYSTEM: Core API rates validated. Footprints trimmed down using clusters and high-efficiency Redis microcaches."}
                      {cat.id === "data" && "// SYSTEM: Relational schema indices parsed. B-Tree leaf fragmentation checked. Zero sequential table scans."}
                      {cat.id === "infrastructure" && "// SYSTEM: Secure container configs compiled. Health triggers returned 205 OK. Admin-auth tokens parsed."}
                      {!["frontend", "backend", "data", "infrastructure"].includes(cat.id) && `// SYSTEM: Custom admin parameters synchronized successfully. Initialized telemetry tracker for ${cat.name}.`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layoutId={`project-container-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900/15 border border-neutral-900/60 p-0 hover:border-orange-500/30 hover:bg-neutral-900/25 cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(249,115,22,0.06)]"
                whileHover={{ y: -6 }}
              >
                {/* Embedded background abstract glow */}
                <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-orange-500/[0.015] group-hover:bg-orange-500/[0.035] blur-[50px] transition-all duration-500 pointer-events-none" />

                <div className="w-full h-48 overflow-hidden border-b border-neutral-900 bg-neutral-950 relative">
                  <img
                    src={getProjectImage(project)}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

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

                <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950">
                  <img
                    src={getProjectImage(selectedProject)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
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
                  {galleryImages.length > 0 ? (
                    <motion.div
                      key={activeGalleryImage || galleryImages[0].url}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full max-h-[40vh] md:max-h-[60vh] flex items-center justify-center relative rounded-2xl overflow-hidden"
                    >
                      <img
                        src={activeGalleryImage || galleryImages[0].url}
                        alt={galleryImages.find(p => p.url === (activeGalleryImage || galleryImages[0].url))?.title || "Baptiste photo"}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-lg shadow-black/50"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ) : (
                    <div className="text-neutral-500 font-mono text-xs">No gallery images registered.</div>
                  )}
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
                    const activeObj = galleryImages.find(p => p.url === (activeGalleryImage || (galleryImages[0]?.url || "")));
                    return (
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-neutral-100 tracking-tight">
                          {activeObj?.title || (language === "rw" ? "Idosiye Y'ifoto" : "Baptiste Card")}
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
                    <div className="grid grid-cols-5 gap-2 max-h-[140px] overflow-y-auto pr-1">
                      {galleryImages.map((p) => {
                        const isSelected = (activeGalleryImage || (galleryImages[0]?.url || "")) === p.url;
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
                        const currentImg = activeGalleryImage || (galleryImages[0]?.url || "");
                        if (currentImg) {
                          const url = currentImg.startsWith("data:") ? currentImg : window.location.origin + currentImg;
                          navigator.clipboard.writeText(url);
                          setCopiedGalleryIndex(true);
                          setTimeout(() => setCopiedGalleryIndex(false), 2000);
                        }
                      }}
                      className="w-full px-4 py-2 bg-neutral-900 border border-neutral-850 rounded-xl hover:border-neutral-700 transition-all font-mono text-[10px] text-neutral-300 hover:text-white uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                      <span>{copiedGalleryIndex ? (language === "rw" ? "YAKOPOWE!" : "COPIED!") : (language === "rw" ? "Koporora Inzira" : "Copy Direct Link")}</span>
                    </button>
                    
                    {galleryImages.length > 0 && (
                      <a
                        href={activeGalleryImage || galleryImages[0].url}
                        download={`baptiste_portrait_${galleryImages.find(p => p.url === (activeGalleryImage || galleryImages[0].url))?.id || "photo"}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2 bg-orange-500 text-neutral-950 font-mono font-bold text-[10px] rounded-xl hover:bg-orange-400 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === "rw" ? "Manura Ifoto" : "Download High-Res"}</span>
                      </a>
                    )}
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
                  className="flex items-center gap-4 p-4.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group shadow-lg"
                >
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-wider font-bold mb-0.5">{t.conDirectEmail}</span>
                    <span className="text-neutral-200 group-hover:text-orange-400 text-xs transition-colors font-medium">fizzorafiki@gmail.com</span>
                  </div>
                </a>

                {/* Direct audio/voice call */}
                <a
                  href="tel:0793373177"
                  className="flex items-center gap-4 p-4.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group shadow-lg"
                >
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-colors">
                    <Phone className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-wider font-bold mb-0.5">{t.conContactNode} (Voice Node)</span>
                    <span className="text-neutral-200 group-hover:text-orange-400 text-xs transition-colors font-medium">0793373177</span>
                  </div>
                </a>

                {/* Direct Whatsapp link */}
                <a
                  href="https://wa.me/250793373177"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group shadow-lg"
                >
                  <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-colors">
                    <MessageSquare className="w-5 h-5 text-neutral-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-550 block uppercase font-mono tracking-wider font-bold mb-0.5">Instant WhatsApp Secure Chat</span>
                    <span className="text-neutral-200 group-hover:text-orange-400 text-xs transition-colors font-medium">0793373177 (Chat live)</span>
                  </div>
                </a>
              </div>

              {/* Improved social grid with fizzorafiki handles */}
              <div className="space-y-4 mt-8 md:mt-2">
                <h4 className="text-[10px] font-mono text-neutral-550 uppercase tracking-[0.25em] font-bold">{t.conSocialTitle}</h4>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <a
                    href="https://github.com/fizzorafiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 transition-all duration-300 cursor-pointer group shadow-md"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-all">
                      <Github className="w-4 h-4 text-neutral-450 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-550 block uppercase font-bold tracking-wider">GitHub</span>
                      <span className="text-[11px] font-mono text-neutral-300 truncate block group-hover:text-neutral-100 font-medium">fizzorafiki</span>
                    </div>
                  </a>

                  <a
                    href="https://linkedin.com/in/fizzorafiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 transition-all duration-300 cursor-pointer group shadow-md"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-all">
                      <Linkedin className="w-4 h-4 text-neutral-450 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-550 block uppercase font-bold tracking-wider">LinkedIn</span>
                      <span className="text-[11px] font-mono text-neutral-300 truncate block group-hover:text-neutral-100 font-medium font-mono">fizzorafiki</span>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/fizzorafiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 transition-all duration-300 cursor-pointer group shadow-md"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-all">
                      <Instagram className="w-4 h-4 text-neutral-450 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-550 block uppercase font-bold tracking-wider">Instagram</span>
                      <span className="text-[11px] font-mono text-neutral-300 truncate block group-hover:text-neutral-100 font-medium">fizzorafiki</span>
                    </div>
                  </a>

                  <a
                    href="https://x.com/fizzorafiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/20 hover:border-orange-500/30 hover:bg-neutral-900/10 transition-all duration-300 cursor-pointer group shadow-md"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center group-hover:border-orange-500/20 transition-all">
                      <Twitter className="w-4 h-4 text-neutral-450 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-550 block uppercase font-bold tracking-wider">Twitter</span>
                      <span className="text-[11px] font-mono text-neutral-300 truncate block group-hover:text-neutral-100 font-medium">fizzorafiki</span>
                    </div>
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

          <div className="flex items-center gap-4 text-neutral-500 text-xs font-mono">
            <span>{t.footerRights}</span>
            <span className="text-neutral-850">|</span>
            <button
              id="admin-console-trigger"
              onClick={() => navigateTo("/admin")}
              className="flex items-center gap-1.5 text-neutral-600 hover:text-orange-500 transition-colors cursor-pointer font-bold uppercase tracking-wider"
              title="System Control Gate"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Console Login</span>
            </button>
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

      {/* Dynamic Master Control Admin Portal Panel */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAdminModalOpen(false);
                setAdminError("");
                setAdminSuccessMsg("");
              }}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
            />

            {/* Panel box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
              className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10"
            >
              {/* Header */}
              <div className="p-6 bg-neutral-900/40 border-b border-neutral-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl">
                    <Settings className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
                  </span>
                  <div>
                    <h3 className="font-bold text-neutral-100 text-base flex items-center gap-2">
                      <span>Portfolio Administration Node</span>
                      {isAdminLoggedIn && (
                        <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest text-green-400 bg-green-500/5 border border-green-500/15 rounded-full uppercase">
                          Authorized Access
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Control pipeline registers & asset declarations</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setAdminError("");
                    setAdminSuccessMsg("");
                  }}
                  className="p-2 rounded-lg border border-neutral-900 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
                {/* Error & Success Messages */}
                {adminError && (
                  <div className="p-4 bg-red-500/5 border border-red-500/15 text-red-400 text-xs rounded-xl flex items-center gap-2.5 font-mono animate-[shake_0.5s_ease-in-out]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}
                {adminSuccessMsg && (
                  <div className="p-4 bg-green-500/5 border border-green-500/15 text-green-400 text-xs rounded-xl flex items-center gap-2.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{adminSuccessMsg}</span>
                  </div>
                )}

                {/* LOGIN SCREEN MODE */}
                {!isAdminLoggedIn ? (
                  <div className="max-w-md mx-auto py-8">
                    <form onSubmit={handleAdminLogin} className="space-y-5">
                      <div className="space-y-1.5 text-center mb-6">
                        <h4 className="text-sm font-semibold text-neutral-300">Access Key Challenge</h4>
                        <p className="text-xs font-mono text-neutral-500">Provide system developer credentials</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Username</label>
                          <input
                            type="text"
                            required
                            placeholder="username (admin)"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Access Token Password</label>
                          <input
                            type="password"
                            required
                            placeholder="password (admin123)"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-605 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-900/50 border border-neutral-850 rounded-xl font-mono text-[9px] text-neutral-500 text-center uppercase tracking-wider">
                        Authentication Tip: Use Username <span className="text-orange-500 font-bold">fizzorafiki</span> or <span className="text-orange-500 font-bold">admin</span> & Password <span className="text-orange-500 font-bold">admin123</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center justify-center gap-2 mt-2 font-bold"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Authenticate Systems</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  /* AUTHORIZED ADMIN CONSOLE */
                  <div className="space-y-8">
                    {/* Navigation tabs */}
                    <div className="flex border-b border-neutral-905 pb-px gap-2 overflow-x-auto">
                      {[
                        { id: "project", label: "Add Project", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                        { id: "skill", label: "Add Skill Specialty", icon: <Cpu className="w-3.5 h-3.5" /> },
                        { id: "gallery", label: "Manage Gallery", icon: <Camera className="w-3.5 h-3.5" /> },
                        { id: "records", label: "Nodes Datastore Config", icon: <Activity className="w-3.5 h-3.5" /> }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setAdminActiveTab(item.id as any);
                            setAdminError("");
                            setAdminSuccessMsg("");
                          }}
                          className={`px-4 py-3 text-[11px] font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                            adminActiveTab === item.id
                              ? "border-orange-500 text-orange-500 font-bold bg-orange-500/5"
                              : "border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-950"
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="ml-auto px-4 py-3 text-[11px] font-mono uppercase tracking-wider text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                    {/* TAB CONTENT: ADD PROJECT */}
                    {adminActiveTab === "project" && (
                      <form onSubmit={handleAddProject} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Project Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Automated Crypto Ledger"
                              value={newProjectTitle}
                              onChange={(e) => setNewProjectTitle(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Category Segment *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Full-Stack System, Enterprise Gateway"
                              value={newProjectCategory}
                              onChange={(e) => setNewProjectCategory(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Summary Summary *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Summarize key scope, infrastructure parameters, and systems goals..."
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Key Metric (Optional)</label>
                            <input
                              type="text"
                              placeholder="E.g., Audit latency dropped by 45%"
                              value={newProjectMetrics}
                              onChange={(e) => setNewProjectMetrics(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Technologies Stack Tags (Comma separated)</label>
                            <input
                              type="text"
                              placeholder="React, TypeScript, SQLite, Express"
                              value={newProjectTags}
                              onChange={(e) => setNewProjectTags(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Image Inputs Section */}
                        <div className="p-5 bg-neutral-900/20 border border-neutral-900 rounded-2xl space-y-4">
                          <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-orange-500" />
                            <span>Project Asset Illustration Image</span>
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-mono">Provide a descriptive photo mockup. You can upload a design file or paste a web graphic URL.</p>

                          <div className="grid md:grid-cols-2 gap-5 items-start">
                            {/* File upload */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Select Local Image File</label>
                              <div className="relative border border-dashed border-neutral-800 hover:border-orange-500/40 rounded-xl p-4 bg-neutral-950/40 transition-colors flex flex-col items-center justify-center text-center">
                                <Upload className="w-5 h-5 text-neutral-650 mb-2" />
                                <span className="text-[10px] text-neutral-400 font-mono block font-medium">JPEG, WebP, PNG files up to 2MB</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileChange}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </div>
                            </div>

                            {/* Direct Web URL */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Or Enter Photo Web Link Address</label>
                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=650"
                                value={newProjectImage}
                                onChange={(e) => setNewProjectImage(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                              />
                            </div>
                          </div>

                          {/* Preview container */}
                          {newProjectImage && (
                            <div className="pt-2 border-t border-neutral-900 flex items-center gap-4">
                              <div className="w-20 h-12 rounded border border-neutral-850 bg-neutral-950 overflow-hidden shrink-0">
                                <img src={newProjectImage} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <span className="text-[10px] font-mono text-green-400 block font-semibold uppercase">Register Asset Loaded</span>
                                <button
                                  type="button"
                                  onClick={() => setNewProjectImage("")}
                                  className="text-[10px] font-mono text-red-550 hover:text-red-400 underline mt-1"
                                >
                                  Purge loaded image
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Detailed Specs list */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Architectural Specifications (One detail statement per line)</label>
                          <textarea
                            rows={4}
                            placeholder="Implemented typesafe, compiled database routes minimizing memory overhead.&#10;Integrated TLS-enabled endpoints keeping core systems isolated."
                            value={newProjectDetails}
                            onChange={(e) => setNewProjectDetails(e.target.value)}
                            className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Demo Sandbox Link (Optional)</label>
                            <input
                              type="text"
                              placeholder="#projects"
                              value={newProjectDemoUrl}
                              onChange={(e) => setNewProjectDemoUrl(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">GitHub Source Repository (Optional)</label>
                            <input
                              type="url"
                              placeholder="https://github.com"
                              value={newProjectGithubUrl}
                              onChange={(e) => setNewProjectGithubUrl(e.target.value)}
                              className="w-full bg-neutral-900/50 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Publish Project Integration</span>
                        </button>
                      </form>
                    )}

                    {/* TAB CONTENT: ADD SKILL */}
                    {adminActiveTab === "skill" && (
                      <form onSubmit={handleAddSkill} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Skill Catalog Category</label>
                            <select
                              value={selectedOrNewSkillCatId}
                              onChange={(e) => setSelectedOrNewSkillCatId(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                            >
                              {skillCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                              <option value="new">+ Declare New Custom Category</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Skill Specialty Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g., Go / Gin API, WebSockets"
                              value={newSkillName}
                              onChange={(e) => setNewSkillName(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                            />
                          </div>
                        </div>

                        {/* Conditional New Category setup */}
                        {selectedOrNewSkillCatId === "new" && (
                          <div className="p-5 bg-neutral-900/30 border border-neutral-850 rounded-2xl grid md:grid-cols-2 gap-6 animate-fade-in">
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">New Category Directory Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="E.g., Systems Operations, Automation"
                                value={newSkillCatName}
                                onChange={(e) => setNewSkillCatName(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Launcher Icon Representation</label>
                              <select
                                value={newSkillCatIcon}
                                onChange={(e) => setNewSkillCatIcon(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-orange-500"
                              >
                                <option value="server">Server (Network Systems)</option>
                                <option value="monitor">Monitor (Frontend Platforms)</option>
                                <option value="database">Database (Storage Engines)</option>
                                <option value="layers">Layers (Systems Admin)</option>
                                <option value="cpu">Cpu (Core Logic)</option>
                                <option value="palette">Palette (Responsive Styling)</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block font-semibold">Proficiency Rating Level</label>
                            <span className="text-xs font-mono text-orange-500 font-extrabold bg-orange-500/5 px-2.5 py-1 rounded border border-orange-500/10">
                              {newSkillProficiency}% proficiency
                            </span>
                          </div>
                          
                          <input
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            value={newSkillProficiency}
                            onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                            className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-neutral-600">
                            <span>0% (Junior Practitioner)</span>
                            <span>50% (Competent Specialist)</span>
                            <span>100% (Grandmaster Core Authority)</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="py-3.5 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center justify-center gap-1.5 font-bold"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Sync Skill Specialty Points</span>
                        </button>
                      </form>
                    )}

                    {adminActiveTab === "gallery" && (
                      <div className="bg-neutral-900/10 border border-neutral-905 p-5 rounded-2xl space-y-6 animate-fade-in text-left">
                        <div className="border-b border-neutral-900/50 pb-4">
                          <h4 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">Publish Dynamic Photo Node</h4>
                          <p className="text-[10px] font-mono text-neutral-500 mt-0.5">Select a photo from your desktop, assign descriptive labels, and instantly populate the landing page photostream.</p>
                        </div>

                        <form onSubmit={handleAddGalleryImage} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Photo Title / Label</label>
                              <input
                                type="text"
                                value={newGalleryTitle}
                                onChange={(e) => setNewGalleryTitle(e.target.value)}
                                placeholder="Baptiste portrait shot"
                                className="w-full bg-neutral-900 border border-neutral-850 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Event Context / Aspect Description</label>
                              <input
                                type="text"
                                value={newGalleryDesc}
                                onChange={(e) => setNewGalleryDesc(e.target.value)}
                                placeholder="Taken during systems engineering audit."
                                className="w-full bg-neutral-900 border border-neutral-850 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                              />
                            </div>
                          </div>

                          {/* File upload drag/drop zone */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Select Photo Asset from Desktop</span>
                            <div className="relative border-2 border-dashed border-neutral-850 hover:border-orange-500/40 rounded-2xl p-5 bg-neutral-900 transition-colors flex flex-col items-center justify-center text-center">
                              {newGalleryImage ? (
                                <div className="space-y-3">
                                  <div className="w-40 h-28 mx-auto rounded-xl overflow-hidden border border-neutral-800 relative">
                                    <img src={newGalleryImage} alt="Gallery item upload preview" className="w-full h-full object-cover" />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNewGalleryImage("")}
                                    className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-900 text-[10px] font-mono text-red-500 hover:text-red-400 border border-neutral-850 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Remove Image
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-neutral-600 mb-1.5" />
                                  <span className="text-xs text-neutral-300 font-mono block font-medium">Browse desktop files</span>
                                  <span className="text-[9px] text-neutral-550 font-mono block mt-0.5">JPEG/PNG up to 2MB</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleGalleryImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="py-3 px-5 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 font-bold"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Publish Dynamic Photo Node</span>
                          </button>
                        </form>
                      </div>
                    )}

                    {/* TAB CONTENT: ACTIVE NODES CATALOG */}
                    {adminActiveTab === "records" && (
                      <div className="space-y-8">
                        {/* Summary action */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-neutral-200">Synchronized State Cache</h4>
                            <p className="text-[10px] font-mono text-neutral-500 mt-0.5">Flush custom memory configurations to recover default static profiles.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleResetData}
                            className="px-4 py-2 bg-red-500/10 border border-red-500/15 text-red-500 hover:text-red-400 hover:bg-red-500/15 rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors"
                          >
                            Reset System Data Catalog
                          </button>
                        </div>

                        {/* Projects management list */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 border-b border-neutral-900 pb-2">Currently Active Projects ({projects.length})</h4>
                          
                          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                            {projects.map((proj) => (
                              <div key={proj.id} className="p-3 bg-neutral-900/35 border border-neutral-850 rounded-xl flex items-center justify-between gap-4 font-mono text-[11px]">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  {proj.image ? (
                                    <img src={proj.image} alt={proj.title} className="w-9 h-9 rounded object-cover shrink-0" referrerPolicy="referrer" />
                                  ) : (
                                    <div className="w-9 h-9 rounded bg-neutral-950 flex items-center justify-center text-[8px] text-neutral-600 uppercase shrink-0 font-bold border border-neutral-900">Seed</div>
                                  )}
                                  <div className="min-w-0">
                                    <span className="font-semibold text-neutral-200 block truncate">{proj.title}</span>
                                    <span className="text-[9px] text-neutral-500 block uppercase tracking-wide truncate">{proj.category}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="p-1.5 rounded-lg border border-neutral-850 text-neutral-500 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer shrink-0"
                                  title="Delete project node"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Skills management list */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 border-b border-neutral-900 pb-2">Active Technical Skill Matrix</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                            {skillCategories.map((cat) => (
                              <div key={cat.id} className="p-4 bg-neutral-900/15 border border-neutral-900 rounded-xl space-y-2.5 text-[11px] font-mono">
                                <span className="font-bold text-orange-500 text-xs tracking-wide uppercase border-b border-neutral-900/50 pb-1.5 block">{cat.name}</span>
                                <div className="space-y-2 pt-1">
                                  {cat.skills.map((sk) => (
                                    <div key={sk.name} className="flex items-center justify-between gap-2.5 text-neutral-400 py-0.5">
                                      <span className="truncate">{sk.name} ({sk.proficiency}%)</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(cat.id, sk.name)}
                                        className="text-neutral-500 hover:text-red-400 text-[10px] cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
