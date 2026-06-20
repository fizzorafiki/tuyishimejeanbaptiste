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
  Upload,
  Edit3,
  RefreshCw,
  GraduationCap,
  Award,
  BookOpen
} from "lucide-react";
import { PROJECTS, SKILL_CATEGORIES, SERVICES, TESTIMONIALS, SCHOOLS } from "./data";
import { Project, ChatMessage, VisitorMessage, SkillCategory, SchoolNode } from "./types";
import { TRANSLATIONS, BAPTISTE_GALLERY } from "./translations";
import { WebGLShader } from "./components/ui/web-gl-shader";
import { LiquidButton } from "./components/ui/liquid-glass-button";
import { ImageCropperModal } from "./components/ImageCropperModal";

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

  const [schools, setSchools] = useState<SchoolNode[]>(() => {
    const saved = localStorage.getItem("tjb_portfolio_schools");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading schools:", e);
      }
    }
    return SCHOOLS;
  });

  const [newSchoolLevel, setNewSchoolLevel] = useState("");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolTag, setNewSchoolTag] = useState("");
  const [newSchoolDuration, setNewSchoolDuration] = useState("");
  const [newSchoolDistinction, setNewSchoolDistinction] = useState("");
  const [newSchoolHighlights, setNewSchoolHighlights] = useState("");
  const [newSchoolDesc, setNewSchoolDesc] = useState("");
  const [newSchoolDescRw, setNewSchoolDescRw] = useState("");
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);

  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryDesc, setNewGalleryDesc] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

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
  const [adminActiveTab, setAdminActiveTab] = useState<"project" | "skill" | "gallery" | "school" | "records" | "chats">("project");

  // Admin Live Chat management
  const [adminChatSessions, setAdminChatSessions] = useState<any[]>([]);
  const [activeAdminSessionId, setActiveAdminSessionId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);

  // Visitor Client-side Real-time Chat details
  const [chatSessionId, setChatSessionId] = useState<string>(() => {
    let saved = localStorage.getItem("tjb_portfolio_session_id");
    if (!saved) {
      saved = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("tjb_portfolio_session_id", saved);
    }
    return saved;
  });
  const [visitorName, setVisitorName] = useState<string>(() => {
    return localStorage.getItem("tjb_portfolio_visitor_name") || "";
  });
  const [sessionAiEnabled, setSessionAiEnabled] = useState<boolean>(true);
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);
  const [skillsLoading, setSkillsLoading] = useState<boolean>(true);
  const [selectedSchoolNode, setSelectedSchoolNode] = useState<string>("nyanza");

  // Image cropper state
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [cropperSrc, setCropperSrc] = useState<string>("");
  const [cropperTarget, setCropperTarget] = useState<"project" | "gallery" | null>(null);
  const [cropperAspect, setCropperAspect] = useState<"1:1" | "16:9" | "4:3" | "free">("1:1");
  const [cropQueue, setCropQueue] = useState<string[]>([]);
  const [cropQueueIndex, setCropQueueIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkillsLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  const handleRecalibrateSkills = () => {
    setSkillsLoading(true);
    const timer = setTimeout(() => {
      setSkillsLoading(false);
    }, 1400);
  };

  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(data => {
        if (data && data.supabaseConfigured) {
          setSupabaseActive(true);
        }
      })
      .catch(err => console.error("Could not fetch API health state:", err));
  }, []);

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
      setSchools(SCHOOLS);
      localStorage.removeItem("tjb_portfolio_projects");
      localStorage.removeItem("tjb_portfolio_skill_categories");
      localStorage.removeItem("tjb_portfolio_gallery");
      localStorage.removeItem("tjb_portfolio_schools");
      setAdminSuccessMsg("Registers flushed. Initial state restored.");
    }
  };

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccessMsg("");

    if (!newSchoolName.trim() || !newSchoolLevel.trim() || !newSchoolTag.trim() || !newSchoolDuration.trim() || !newSchoolDesc.trim()) {
      setAdminError("Please populate Name, Level, Tag, Duration, and English Description.");
      return;
    }

    const highlightsArray = newSchoolHighlights
      ? newSchoolHighlights.split(",").map(h => h.trim()).filter(Boolean)
      : ["Academic Node"];

    if (editingSchoolId) {
      const updated = schools.map((s) =>
        s.id === editingSchoolId
          ? {
              ...s,
              level: newSchoolLevel.trim(),
              name: newSchoolName.trim().toUpperCase(),
              tag: newSchoolTag.trim(),
              duration: newSchoolDuration.trim(),
              distinction: newSchoolDistinction.trim(),
              highlights: highlightsArray,
              desc: newSchoolDesc.trim(),
              descRw: newSchoolDescRw.trim() || undefined
            }
          : s
      );
      setSchools(updated);
      localStorage.setItem("tjb_portfolio_schools", JSON.stringify(updated));
      setEditingSchoolId(null);
      setAdminSuccessMsg("Academic trajectory node updated successfully!");
    } else {
      const newSchool: SchoolNode = {
        id: `s-custom-${Date.now()}`,
        level: newSchoolLevel.trim(),
        name: newSchoolName.trim().toUpperCase(),
        tag: newSchoolTag.trim(),
        duration: newSchoolDuration.trim(),
        distinction: newSchoolDistinction.trim() || "Academic Distinction Verified",
        highlights: highlightsArray,
        desc: newSchoolDesc.trim(),
        descRw: newSchoolDescRw.trim() || undefined
      };
      const updated = [...schools, newSchool];
      setSchools(updated);
      localStorage.setItem("tjb_portfolio_schools", JSON.stringify(updated));
      setAdminSuccessMsg("New academic trajectory node successfully published!");
    }

    // Reset Form
    setNewSchoolLevel("");
    setNewSchoolName("");
    setNewSchoolTag("");
    setNewSchoolDuration("");
    setNewSchoolDistinction("");
    setNewSchoolHighlights("");
    setNewSchoolDesc("");
    setNewSchoolDescRw("");
  };

  const handleEditSchoolInit = (id: string) => {
    const target = schools.find((s) => s.id === id);
    if (target) {
      setNewSchoolLevel(target.level);
      setNewSchoolName(target.name);
      setNewSchoolTag(target.tag);
      setNewSchoolDuration(target.duration);
      setNewSchoolDistinction(target.distinction || "");
      setNewSchoolHighlights(target.highlights.join(", "));
      setNewSchoolDesc(target.desc);
      setNewSchoolDescRw(target.descRw || "");
      setEditingSchoolId(id);
      setAdminSuccessMsg(`School node loaded for calibration: "${target.name}"`);
    }
  };

  const handleCancelEditSchool = () => {
    setNewSchoolLevel("");
    setNewSchoolName("");
    setNewSchoolTag("");
    setNewSchoolDuration("");
    setNewSchoolDistinction("");
    setNewSchoolHighlights("");
    setNewSchoolDesc("");
    setNewSchoolDescRw("");
    setEditingSchoolId(null);
    setAdminSuccessMsg("School node calibration canceled.");
  };

  const handleDeleteSchool = (id: string) => {
    if (window.confirm("Delete this academic registry node from portfolio? This is irreversible.")) {
      const updated = schools.filter((s) => s.id !== id);
      setSchools(updated);
      localStorage.setItem("tjb_portfolio_schools", JSON.stringify(updated));
      
      // If we deleted the active view, select another one or reset to empty/first
      if (selectedSchoolNode === id) {
        if (updated.length > 0) {
          setSelectedSchoolNode(updated[0].id);
        } else {
          setSelectedSchoolNode("");
        }
      }
      setAdminSuccessMsg("School node excised from academic timeline registry.");
    }
  };

  // Convert uploaded files safely to inline base64 and initiate premium cropping calibration
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAdminError("File is too large. Limit is 2MB for storage consistency.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropperSrc(reader.result as string);
        setCropperTarget("project");
        setCropperAspect("16:9");
        setCropperOpen(true);
        setAdminSuccessMsg("Asset loaded. Please align, adjust and crop your project graphic illustration.");
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 2 * 1024 * 1024) {
          setAdminError(`File "${file.name}" is too large. Limit is 2MB for storage consistency.`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      const loadedUrls: string[] = [];
      let loadedCount = 0;

      validFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          loadedUrls[index] = reader.result as string;
          loadedCount++;
          if (loadedCount === validFiles.length) {
            const finalUrls = loadedUrls.filter(Boolean);
            setCropQueue(finalUrls);
            setCropQueueIndex(0);
            
            // Set up cropper states for the FIRST image in the queue
            setCropperSrc(finalUrls[0]);
            setCropperTarget("gallery");
            setCropperAspect("1:1");
            setCropperOpen(true);
            setAdminSuccessMsg(`Photo 1 of ${finalUrls.length} loaded. Align and crop to begin.`);
          }
        };
        reader.readAsDataURL(file);
      });

      e.target.value = "";
    }
  };

  const handleCropperComplete = (croppedBase64: string) => {
    if (cropperTarget === "project") {
      setNewProjectImage(croppedBase64);
      setAdminSuccessMsg("Project graphic alignment metrics cropped and finalized successfully.");
      setCropperOpen(false);
      setCropperTarget(null);
    } else if (cropperTarget === "gallery") {
      // Append to list of cropped images
      setNewGalleryImages((prev) => {
        const updated = [...prev, croppedBase64];
        // For backwards compatibility, keep single newGalleryImage set with the first item
        if (updated.length === 1) {
          setNewGalleryImage(croppedBase64);
        }
        return updated;
      });

      const nextIdx = cropQueueIndex + 1;
      if (cropQueue.length > 0 && nextIdx < cropQueue.length) {
        // Sequentially load the next file from our cropping queue
        setCropQueueIndex(nextIdx);
        setCropperSrc(cropQueue[nextIdx]);
        setAdminSuccessMsg(`Photo ${nextIdx + 1} of ${cropQueue.length} cropped. Align and crop this next segment.`);
      } else {
        // Reached end of sequential queue
        setCropQueue([]);
        setCropQueueIndex(0);
        setCropperOpen(false);
        setCropperTarget(null);
        setAdminSuccessMsg("All selected photo nodes have been cropped and enqueued for publication.");
      }
    }
  };

  const handleCropperCancel = () => {
    setCropperOpen(false);
    setCropperTarget(null);
    setCropQueue([]);
    setCropQueueIndex(0);
    setAdminSuccessMsg("Cropper workflow discarded.");
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccessMsg("");

    const activeImageSrcs = newGalleryImages.length > 0 ? newGalleryImages : (newGalleryImage ? [newGalleryImage] : []);

    if (!newGalleryTitle.trim() || !newGalleryDesc.trim() || activeImageSrcs.length === 0) {
      setAdminError("Please populate Title, Description, and select at least one image file from your desktop.");
      return;
    }

    if (editingGalleryId) {
      const originalImage = galleryImages.find((img) => img.id === editingGalleryId);
      const targetSrc = activeImageSrcs[0];
      const updated = galleryImages.map((img) =>
        img.id === editingGalleryId
          ? { ...img, title: newGalleryTitle.trim(), desc: newGalleryDesc.trim(), url: targetSrc }
          : img
      );
      setGalleryImages(updated);
      localStorage.setItem("tjb_portfolio_gallery", JSON.stringify(updated));
      
      // Keep active image state synchronized if the modified image was the currently selected preview
      if (originalImage && activeGalleryImage === originalImage.url) {
        setActiveGalleryImage(targetSrc);
      }

      setEditingGalleryId(null);
      setAdminSuccessMsg("Gallery image updated successfully!");
    } else {
      let updated = [...galleryImages];
      
      if (activeImageSrcs.length === 1) {
        const newPhoto = {
          id: `g-custom-${Date.now()}`,
          url: activeImageSrcs[0],
          title: newGalleryTitle.trim(),
          desc: newGalleryDesc.trim()
        };
        updated.push(newPhoto);
      } else {
        // Publish multiple separately
        activeImageSrcs.forEach((src, idx) => {
          const serialNum = idx + 1;
          const totalNum = activeImageSrcs.length;
          const customTitle = `${newGalleryTitle.trim()} [Photo ${serialNum}/${totalNum}]`;
          const newPhoto = {
            id: `g-custom-${Date.now()}-${idx}`,
            url: src,
            title: customTitle,
            desc: newGalleryDesc.trim()
          };
          updated.push(newPhoto);
        });
      }

      setGalleryImages(updated);
      localStorage.setItem("tjb_portfolio_gallery", JSON.stringify(updated));
      setAdminSuccessMsg(`Successfully published ${activeImageSrcs.length} separate photo nodes to the interactive photostream!`);
    }

    // Clear form
    setNewGalleryTitle("");
    setNewGalleryDesc("");
    setNewGalleryImage("");
    setNewGalleryImages([]);
  };

  const handleEditGalleryInit = (id: string) => {
    const target = galleryImages.find(img => img.id === id);
    if (target) {
      setEditingGalleryId(id);
      setNewGalleryTitle(target.title);
      setNewGalleryDesc(target.desc);
      setNewGalleryImage(target.url);
      setNewGalleryImages([target.url]);
      setAdminSuccessMsg(`Ready to edit: "${target.title}"`);
    }
  };

  const handleCancelEditGallery = () => {
    setEditingGalleryId(null);
    setNewGalleryTitle("");
    setNewGalleryDesc("");
    setNewGalleryImage("");
    setNewGalleryImages([]);
    setAdminSuccessMsg("Editing canceled.");
  };

  const handleDeleteGalleryImage = (id: string) => {
    const target = galleryImages.find(item => item.id === id);
    const updated = galleryImages.filter(item => item.id !== id);
    setGalleryImages(updated);
    localStorage.setItem("tjb_portfolio_gallery", JSON.stringify(updated));
    if (editingGalleryId === id) {
      setEditingGalleryId(null);
      setNewGalleryTitle("");
      setNewGalleryDesc("");
      setNewGalleryImage("");
      setNewGalleryImages([]);
    }
    // Synchronize selected preview if the active gallery image is being deleted
    if (target && activeGalleryImage === target.url) {
      setActiveGalleryImage(null);
    }
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
      const sections = ["about", "expertise", "projects", "family", "services", "gallery", "contact"];
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

  // Visitor Poll effect (polls when user chat window is open)
  useEffect(() => {
    let intervalId: any = null;

    const syncVisitorSession = async () => {
      try {
        const res = await fetch(`/api/chat/session/${chatSessionId}`);
        if (res.ok) {
          const data = await res.json();
          // Transform content/timestamp to front-end types
          const parsedMsgs: ChatMessage[] = data.messages.map((m: any) => ({
            id: m.id,
            role: m.sender === "visitor" ? "user" : "assistant",
            content: m.content,
            timestamp: new Date(m.timestamp)
          }));
          setChatMessages(parsedMsgs);
          setSessionAiEnabled(data.aiEnabled);
        }
      } catch (err) {
        console.error("Failed to poll visitor chat session:", err);
      }
    };

    // Immediate initial sync
    syncVisitorSession();

    if (isAIChatOpen) {
      intervalId = setInterval(syncVisitorSession, 2500); // 2.5s polling loop
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [chatSessionId, isAIChatOpen]);

  // Admin Poll effect (polls when admin active tab is "chats")
  useEffect(() => {
    if (!isAdminLoggedIn || adminActiveTab !== "chats") return;
    let intervalId: any = null;

    const syncAdminSessionsList = async () => {
      try {
        const res = await fetch("/api/chat/sessions");
        if (res.ok) {
          const data = await res.json();
          setAdminChatSessions(data.sessions || []);
        }
      } catch (err) {
        console.error("Failed to poll admin sessions list:", err);
      }
    };

    syncAdminSessionsList();
    intervalId = setInterval(syncAdminSessionsList, 2500); // Poll list every 2.5s

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAdminLoggedIn, adminActiveTab]);

  // Toggle Visitor AI auto-reply
  const handleToggleVisitorAI = async (val: boolean) => {
    setSessionAiEnabled(val);
    try {
      const res = await fetch("/api/chat/toggle-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: chatSessionId, aiEnabled: val })
      });
      if (res.ok) {
        const data = await res.json();
        setSessionAiEnabled(data.aiEnabled);
      }
    } catch (err) {
      console.error("Error toggling AI auto-play mode:", err);
    }
  };

  // Chat message sending pipeline with Server-side session API
  const handleSendAIChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAILoading) return;

    const userPrompt = chatInput.trim();
    setChatInput("");
    setIsAILoading(true);

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: chatSessionId,
          sender: "visitor",
          content: userPrompt,
          visitorName: visitorName.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error("HTTP chat send failed.");
      }

      const data = await response.json();
      const parsedMsgs: ChatMessage[] = data.messages.map((m: any) => ({
        id: m.id,
        role: m.sender === "visitor" ? "user" : "assistant",
        content: m.content,
        timestamp: new Date(m.timestamp)
      }));
      setChatMessages(parsedMsgs);
      setSessionAiEnabled(data.aiEnabled);
    } catch (err) {
      console.error("AI chat submit exception:", err);
      // Clean fallback if backend goes raw offline
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-local-fallback-${Date.now()}`,
          role: "user",
          content: userPrompt,
          timestamp: new Date()
        },
        {
          id: `ai-err-msg-${Date.now()}`,
          role: "assistant",
          content: "I'm executing in local sandbox node profile. Jean Baptiste is a professional developer specializing in PostgreSQL databases, Node.js, and client-side React. Let me know which of his projects you would like to audit, or type an inquiry!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  // Admin Reply submission logic
  const handleAdminSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeAdminSessionId || !adminReplyText.trim()) return;

    const replyContent = adminReplyText.trim();
    setAdminReplyText("");
    setAiSuggestion(""); // Reset suggestion box

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeAdminSessionId,
          sender: "admin",
          content: replyContent
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Sync local list state immediately
        setAdminChatSessions(prev => prev.map(s => s.sessionId === activeAdminSessionId ? data : s));
      }
    } catch (err) {
      console.error("Admin send reply failed:", err);
    }
  };

  // Admin toggle AI assistant toggle
  const handleAdminToggleAI = async (sessionId: string, val: boolean) => {
    try {
      const res = await fetch("/api/chat/toggle-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, aiEnabled: val })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminChatSessions(prev => prev.map(s => s.sessionId === sessionId ? data : s));
      }
    } catch (err) {
      console.error("Admin failed toggling ai:", err);
    }
  };

  // Admin AI suggest helper draft
  const handleAdminRequestSuggestion = async () => {
    if (!activeAdminSessionId) return;
    setIsSuggestionLoading(true);
    setAiSuggestion("");

    try {
      const res = await fetch("/api/chat/suggest-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeAdminSessionId })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error("Failed to call suggest-ai on backend:", err);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  // Wipe chat session completely
  const handleAdminDeleteSession = async (sessionId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this chat session record?")) return;
    try {
      const res = await fetch("/api/chat/delete-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      if (res.ok) {
        setAdminChatSessions(prev => prev.filter(s => s.sessionId !== sessionId));
        if (activeAdminSessionId === sessionId) {
          setActiveAdminSessionId(null);
        }
      }
    } catch (err) {
      console.error("Admin wipe chat failed:", err);
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

  const renderSchoolIcon = (school: SchoolNode) => {
    const lvl = school.level.toLowerCase();
    const id = school.id.toLowerCase();
    if (lvl.includes("primary") || id.includes("eden")) {
      return <BookOpen className="w-5 h-5" />;
    }
    if (lvl.includes("secondary") || id.includes("kamambe")) {
      return <Award className="w-5 h-5" />;
    }
    if (lvl.includes("technical") || id.includes("giheke") || lvl.includes("a2")) {
      return <Code className="w-5 h-5" />;
    }
    return <GraduationCap className="w-5 h-5" />;
  };

  const getSectionLabel = (sec: string) => {
    switch (sec) {
      case "about": return t.navAbout;
      case "expertise": return t.navExpertise;
      case "school": return t.navSchool;
      case "projects": return t.navProjects;
      case "family": return t.navFamily;
      case "services": return t.navServices;
      case "gallery": return t.navGallery;
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
                      { id: "school", label: "Manage Schools & Education", desc: "Add or edit academic trajectory matrix items", icon: <GraduationCap className="w-4 h-4" /> },
                      { id: "chats", label: "Live Visitor Chats", desc: "Real-time chats list and AI suggestion copilot", icon: <MessageSquare className="w-4 h-4" /> },
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
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">
                          {editingGalleryId ? "Revise Existing Photo Node" : "Publish Dynamic Photo Node"}
                        </h3>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">
                          {editingGalleryId 
                            ? "Configure the new title, context description, and image data for this asset." 
                            : "Select an image from your desktop (limit 2MB), assign metadata labels, and broadcast it directly to the landing page photostream."}
                        </p>
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
                        <div className="space-y-4">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Select Photo Asset from Desktop</span>
                          
                          {newGalleryImages.length > 0 ? (
                            <div className="space-y-4 w-full text-left">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-neutral-950 border border-neutral-900 rounded-2xl max-h-[300px] overflow-y-auto">
                                {newGalleryImages.map((src, index) => (
                                  <div key={index} className="group relative rounded-xl overflow-hidden border border-neutral-850 aspect-square bg-neutral-900 flex items-center justify-center shadow-lg">
                                    <img src={src} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={`Preview ${index + 1}`} referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = newGalleryImages.filter((_, i) => i !== index);
                                          setNewGalleryImages(updated);
                                          if (updated.length > 0) {
                                            setNewGalleryImage(updated[0]);
                                          } else {
                                            setNewGalleryImage("");
                                          }
                                        }}
                                        className="p-1.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 rounded-lg text-red-500 hover:text-red-400 transition-colors shadow-md cursor-pointer"
                                        title="Remove Photo Node"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <span className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono font-bold text-orange-400 border border-neutral-800">
                                      Photo {index + 1}
                                    </span>
                                  </div>
                                ))}
                                
                                {/* Inner add-more zone */}
                                <div className="relative rounded-xl border border-dashed border-neutral-800 hover:border-orange-500/30 flex flex-col items-center justify-center p-3 text-center aspect-square bg-neutral-950 hover:bg-neutral-950/50 transition-all cursor-pointer">
                                  <Plus className="w-5 h-5 text-neutral-500" />
                                  <span className="text-[8.5px] font-mono text-neutral-400 mt-1 block">Add More</span>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleryImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono text-neutral-400 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                  <span>{newGalleryImages.length} cropped node(s) staged sequentially</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewGalleryImages([]);
                                    setNewGalleryImage("");
                                  }}
                                  className="px-3 py-1 bg-neutral-950 hover:bg-neutral-900 text-[10px] font-mono text-red-500 hover:text-red-400 border border-neutral-900 rounded-lg transition-colors cursor-pointer"
                                >
                                  Clear All Cropped
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative border-2 border-dashed border-neutral-900 hover:border-orange-500/40 rounded-2xl p-6 bg-neutral-950/60 transition-colors flex flex-col items-center justify-center text-center">
                              <Upload className="w-8 h-8 text-neutral-700 mb-2" />
                              <span className="text-xs text-neutral-300 font-mono block font-medium">Drag-and-drop or Browse desktop files</span>
                              <span className="text-[10px] text-neutral-500 font-mono block mt-1">Supports multi-selection & queue cropping</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleGalleryImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <button
                            type="submit"
                            className="py-3.5 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-lg shadow-orange-500/15 flex items-center justify-center gap-1.5 font-bold"
                          >
                            {editingGalleryId ? <Check className="w-4.5 h-4.5 text-neutral-950" /> : <Plus className="w-4.5 h-4.5" />}
                            <span>{editingGalleryId ? "Save Dynamic Changes" : "Publish Dynamic Photo Node"}</span>
                          </button>
                          {editingGalleryId && (
                            <button
                              type="button"
                              onClick={handleCancelEditGallery}
                              className="py-3.5 px-6 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 cursor-pointer text-neutral-400 hover:text-neutral-250 font-mono text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold"
                            >
                              <X className="w-4 h-4 text-red-500" />
                              <span>Cancel Edit</span>
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Active Photostream Panels List (Direct Management) */}
                      <div className="space-y-4 pt-6 border-t border-neutral-900/50">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-orange-500" />
                            <span>Currently Active Photostream Panels ({galleryImages.length})</span>
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider">Add, Update, or Delete Entries</span>
                        </div>

                        {galleryImages.length === 0 ? (
                          <p className="text-[11px] font-mono text-neutral-550 italic">No gallery images registered.</p>
                        ) : (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {galleryImages.map((p) => (
                              <div
                                key={p.id}
                                className={`p-3 bg-neutral-950/80 border rounded-2xl flex flex-col justify-between gap-3 group transition-all duration-300 ${
                                  editingGalleryId === p.id ? "border-orange-500/50 shadow-lg shadow-orange-500/5" : "border-neutral-900 hover:border-neutral-800"
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-905 border border-neutral-900 relative">
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
                                
                                <div className="flex gap-2 pt-1 border-t border-neutral-900/40">
                                  <button
                                    type="button"
                                    onClick={() => handleEditGalleryInit(p.id)}
                                    className="flex-1 py-1.5 bg-neutral-900 hover:bg-orange-500/10 border border-neutral-850 hover:border-orange-500/20 text-neutral-400 hover:text-orange-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                                    title="Edit gallery node metadata & URL"
                                  >
                                    <Edit3 className="w-3 h-3 text-orange-500" />
                                    <span>Update</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Purge this photostream frame? This trace will be permanently deleted from dynamic stores.")) {
                                        handleDeleteGalleryImage(p.id);
                                      }
                                    }}
                                    className="flex-1 py-1.5 bg-neutral-900 hover:bg-red-500/10 border border-neutral-850 hover:border-red-500/20 text-neutral-450 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                                    title="Permanently Delete Image"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {adminActiveTab === "school" && (
                    <div className="bg-neutral-900/10 border border-neutral-900/40 p-6 rounded-2xl space-y-6 animate-fade-in text-left">
                      <div className="border-b border-neutral-900/50 pb-4">
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-orange-500" />
                          <span>{editingSchoolId ? "Calibrate Educational Node" : "Publish Educational Node"}</span>
                        </h3>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">
                          Configure curriculum parameters, graduation milestones, distinctions, and technical competencies accumulated on your Rwanda academic trajectory timeline.
                        </p>
                      </div>

                      <form onSubmit={handleAddSchool} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">School Name *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolName}
                              onChange={(e) => setNewSchoolName(e.target.value)}
                              placeholder="E.g., IPRC NYANZA"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono uppercase"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Education Level *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolLevel}
                              onChange={(e) => setNewSchoolLevel(e.target.value)}
                              placeholder="E.g., Higher Education A1 & A0"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Trajectory Tag / Subtitle *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolTag}
                              onChange={(e) => setNewSchoolTag(e.target.value)}
                              placeholder="E.g., Full-Stack System Engineering"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Duration *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolDuration}
                              onChange={(e) => setNewSchoolDuration(e.target.value)}
                              placeholder="E.g., 2021 - 2024"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Academic Distinction / Honors</label>
                            <input
                              type="text"
                              value={newSchoolDistinction}
                              onChange={(e) => setNewSchoolDistinction(e.target.value)}
                              placeholder="E.g., Engineering Excellence Lead Candidate"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Skill Competencies / Highlights (Comma-Separated)</label>
                            <input
                              type="text"
                              value={newSchoolHighlights}
                              onChange={(e) => setNewSchoolHighlights(e.target.value)}
                              placeholder="E.g., Advanced Software Eng, TCP/IP Routing, DBMS Foundations"
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">English Description *</label>
                            <textarea
                              required
                              rows={3}
                              value={newSchoolDesc}
                              onChange={(e) => setNewSchoolDesc(e.target.value)}
                              placeholder="Acquired elite software architecture skills..."
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-605 focus:outline-none transition-all font-mono leading-relaxed"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Kinyarwanda Description (Optional)</label>
                            <textarea
                              rows={3}
                              value={newSchoolDescRw}
                              onChange={(e) => setNewSchoolDescRw(e.target.value)}
                              placeholder="Hano hiciwe ubumenyi bwo gukora porogaramu zikomye..."
                              className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-605 focus:outline-none transition-all font-mono leading-relaxed"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="submit"
                            className="py-3 px-6 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-1.5 font-bold"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{editingSchoolId ? "Re-Calibrate System Node" : "Publish Trajectory Node"}</span>
                          </button>

                          {editingSchoolId && (
                            <button
                              type="button"
                              onClick={handleCancelEditSchool}
                              className="py-3 px-6 bg-neutral-905 hover:bg-neutral-850 cursor-pointer border border-neutral-800 text-neutral-400 font-mono text-xs uppercase tracking-widest rounded-xl transition-all font-bold"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Timeline overview lists with delete & edit option triggers */}
                      <div className="space-y-3 pt-6 border-t border-neutral-900/60">
                        <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Active Academic Timeline Configurations ({schools.length})</label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {schools.map((item) => (
                            <div key={item.id} className="p-4 rounded-xl border border-neutral-905 bg-neutral-950/70 relative group/item flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-mono text-orange-500 font-bold uppercase">{item.level}</span>
                                  <span className="text-[9px] font-mono text-neutral-500">{item.duration}</span>
                                </div>
                                <h4 className="text-sm font-sans font-extrabold text-neutral-100">{item.name}</h4>
                                <p className="text-[10px] text-neutral-400 leading-relaxed max-w-md line-clamp-2 font-mono">
                                  {item.desc}
                                </p>
                              </div>

                              <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-900">
                                <button
                                  type="button"
                                  onClick={() => handleEditSchoolInit(item.id)}
                                  className="py-2 px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/15 rounded-lg transition-all font-mono text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                                >
                                  Edit Node
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSchool(item.id)}
                                  className="py-2 px-3 bg-neutral-950 hover:bg-red-500/10 hover:text-red-400 border border-neutral-900 hover:border-red-500/25 rounded-lg transition-all font-mono text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                                >
                                  Delete Node
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminActiveTab === "chats" && (
                    <div className="space-y-6 animate-fade-in text-left">
                      <div className="border-b border-neutral-900/50 pb-4">
                        <h3 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-orange-500" />
                          <span>Live Chat Control Hub</span>
                        </h3>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">
                          Synchronized live chat feed. Communicate directly with portfolio guests in real-time or activate the Gemini AI auto-responder.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-mono text-xs">
                        {/* LEFT COLUMN: ACTIVE CONVERSATIONS FEED */}
                        <div className="md:col-span-4 space-y-4">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block border-b border-neutral-900 pb-1.5">
                            Conversations ({adminChatSessions.length})
                          </span>

                          {adminChatSessions.length === 0 ? (
                            <div className="p-8 border border-neutral-900 rounded-2xl bg-neutral-950/40 text-center text-neutral-600">
                              No active portfolio visitors yet.
                            </div>
                          ) : (
                            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                              {adminChatSessions.map((session) => {
                                const isSelected = activeAdminSessionId === session.sessionId;
                                const isOnline = Date.now() - session.lastActive < 45000;
                                const lastMsg = session.messages[session.messages.length - 1];

                                return (
                                  <div
                                    key={session.sessionId}
                                    onClick={() => {
                                      setActiveAdminSessionId(session.sessionId);
                                      setAiSuggestion("");
                                    }}
                                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left relative flex flex-col gap-2 group ${
                                      isSelected
                                        ? "border-orange-500 bg-orange-500/[0.04] text-neutral-200"
                                        : "border-neutral-900 bg-neutral-950/60 hover:bg-neutral-900/40 text-neutral-400 hover:text-neutral-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? "bg-green-500 animate-pulse" : "bg-neutral-700"}`} />
                                        <span className="font-bold truncate text-[11px]">
                                          {session.visitorName || "Anon Guest"}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAdminDeleteSession(session.sessionId);
                                        }}
                                        className="p-1 rounded text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Wipe conversation trace"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Preview message snippet */}
                                    {lastMsg && (
                                      <p className="text-[10px] text-neutral-550 truncate leading-snug">
                                        <span className="font-semibold text-neutral-450 uppercase text-[9px] mr-1">
                                          {lastMsg.sender === "admin" ? "you" : lastMsg.sender}:
                                        </span>
                                        {lastMsg.content}
                                      </p>
                                    )}

                                    {/* AI and last active controls bar */}
                                    <div className="flex items-center justify-between border-t border-neutral-900/60 pt-2 text-[9px]">
                                      <span className="text-neutral-600">
                                        Active: {new Date(session.lastActive).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                      <label
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 cursor-pointer hover:text-orange-400 transition-colors"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={session.aiEnabled}
                                          onChange={(e) => handleAdminToggleAI(session.sessionId, e.target.checked)}
                                          className="sr-only"
                                        />
                                        <span className={session.aiEnabled ? "text-orange-500 font-bold" : "text-neutral-600"}>
                                          AI {session.aiEnabled ? "ON" : "OFF"}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: CHAT THREAD CONSOLE */}
                        <div className="md:col-span-8 flex flex-col gap-4">
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block border-b border-neutral-900 pb-1.5">
                            Live Workspace Console
                          </span>

                          {activeAdminSessionId === null ? (
                            <div className="p-12 border border-neutral-900 bg-neutral-950/20 rounded-2xl flex flex-col items-center justify-center text-center gap-3.5 text-neutral-550 min-h-[360px]">
                              <Sparkles className="w-8 h-8 text-neutral-700 animate-pulse" />
                              <div className="space-y-1">
                                <p className="font-bold text-neutral-400">No session selected</p>
                                <p className="max-w-xs text-[10.5px] leading-relaxed">
                                  Click on any visitor conversation card in the left column switchboard to begin live interaction.
                                </p>
                              </div>
                            </div>
                          ) : (
                            (() => {
                              const activeSession = adminChatSessions.find(s => s.sessionId === activeAdminSessionId);
                              if (!activeSession) {
                                return (
                                  <div className="p-8 text-center text-neutral-600">
                                    Syncing session buffer...
                                  </div>
                                );
                              }

                              return (
                                <div className="space-y-4 animate-fade-in">
                                  {/* Thread Header */}
                                  <div className="flex items-center justify-between p-3.5 bg-neutral-950/80 border border-neutral-900 rounded-xl">
                                    <div className="space-y-1 min-w-0">
                                      <p className="font-bold text-neutral-200 truncate">{activeSession.visitorName}</p>
                                      <p className="text-[9.5px] text-neutral-600">ID: {activeSession.sessionId}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className={`px-2.5 py-1 rounded text-[9px] font-bold ${
                                        activeSession.aiEnabled
                                          ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                          : "bg-neutral-900 border border-neutral-850 text-neutral-550"
                                      }`}>
                                        AI AUTO-REPLY: {activeSession.aiEnabled ? "ACTIVE" : "PAUSED"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Thread Flow Scroll Container */}
                                  <div className="flex flex-col gap-4 p-4 border border-neutral-900 bg-neutral-950/60 rounded-2xl h-[300px] overflow-y-auto scrollbar-thin">
                                    {activeSession.messages.map((m: any) => (
                                      <div
                                        key={m.id}
                                        className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                                      >
                                        <div
                                          className={`max-w-[85%] rounded-xl px-4 py-3 text-[11.5px] leading-relaxed relative ${
                                            m.sender === "admin"
                                              ? "bg-orange-500 text-white font-medium"
                                              : m.sender === "ai"
                                                ? "bg-neutral-900 border border-neutral-850 text-neutral-300"
                                                : "bg-neutral-200 text-neutral-950 font-medium"
                                          }`}
                                        >
                                          {/* Sender handle */}
                                          <div className={`text-[8.5px] uppercase font-bold tracking-wider mb-1 opacity-60 flex items-center gap-1 ${
                                            m.sender === "admin" ? "text-orange-105" : m.sender === "ai" ? "text-orange-500" : "text-neutral-600"
                                          }`}>
                                            <span>{m.sender === "admin" ? "YOU (Admin)" : m.sender === "ai" ? "AI Rep (Gemini)" : "Visitor"}</span>
                                          </div>

                                          <p className="whitespace-pre-wrap">{m.content}</p>

                                          <span className="text-[8.5px] block mt-1.5 text-right opacity-50 font-mono">
                                            {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* AI SUGGESTION COPILOT COMPONENT */}
                                  <div className="p-3.5 border border-dashed border-orange-500/30 rounded-2xl bg-orange-500/[0.015] space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-orange-500" />
                                        <span>AI Suggestion Copilot Drafting</span>
                                      </p>
                                      <button
                                        type="button"
                                        disabled={isSuggestionLoading}
                                        onClick={handleAdminRequestSuggestion}
                                        className="px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 hover:border-orange-500/30 font-bold transition-all rounded text-[9.5px] uppercase cursor-pointer"
                                      >
                                        {isSuggestionLoading ? "Synthesizing..." : "Generate AI Reply"}
                                      </button>
                                    </div>

                                    {aiSuggestion && (
                                      <div className="p-3 rounded-xl border border-neutral-900 bg-neutral-950 text-[11px] leading-relaxed text-neutral-300 space-y-2">
                                        <p className="italic text-neutral-300">"{aiSuggestion}"</p>
                                        <div className="flex justify-end">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setAdminReplyText(aiSuggestion);
                                              setAiSuggestion("");
                                            }}
                                            className="px-2.5 py-1 bg-neutral-105 text-neutral-950 font-bold rounded text-[9px] uppercase tracking-wide hover:bg-white active:scale-95 transition-all cursor-pointer"
                                          >
                                            Accept & Load to Input
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Reply execution input form */}
                                  <form onSubmit={handleAdminSendReply} className="flex gap-2.5 items-center">
                                    <input
                                      type="text"
                                      value={adminReplyText}
                                      onChange={(e) => setAdminReplyText(e.target.value)}
                                      placeholder="Write direct live response to client..."
                                      className="flex-grow bg-neutral-950 text-xs border border-neutral-900 rounded-xl px-4 py-3 placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                                    />
                                    <button
                                      type="submit"
                                      disabled={!adminReplyText.trim()}
                                      className="p-3 bg-orange-500 border-none text-white rounded-xl hover:bg-orange-600 font-bold disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
                                    >
                                      <Send className="w-4 h-4" />
                                    </button>
                                  </form>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </div>
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
                              
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleEditGalleryInit(p.id);
                                    setAdminActiveTab("gallery");
                                  }}
                                  className="flex-1 py-1.5 bg-neutral-900 hover:bg-orange-500/10 border border-neutral-850 hover:border-orange-500/20 text-neutral-450 hover:text-orange-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.2 cursor-pointer font-bold mt-2"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm("Purge this photostream frame? This trace will be permanently deleted from dynamic stores.")) {
                                      handleDeleteGalleryImage(p.id);
                                    }
                                  }}
                                  className="flex-1 py-1.5 bg-neutral-900 hover:bg-red-500/10 border border-neutral-850 hover:border-red-500/20 text-neutral-450 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.2 cursor-pointer font-bold mt-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Purge</span>
                                </button>
                              </div>
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
            {["about", "expertise", "school", "projects", "family", "services", "gallery", "contact"].map((section) => (
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
              {["about", "expertise", "school", "projects", "family", "services", "gallery", "contact"].map((section) => (
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

          {/* Telemetry Control Toolbar */}
          <div className="flex justify-center -mt-6 mb-12">
            <button
              onClick={handleRecalibrateSkills}
              disabled={skillsLoading}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 hover:border-orange-500/40 border border-neutral-850 text-neutral-300 hover:text-white rounded-full font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer relative shadow-lg shadow-black/40 disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${skillsLoading ? "animate-spin" : "hover:rotate-180 transition-transform duration-500"}`} />
              <span>{skillsLoading ? "Synchronizing Telemetry..." : "Recalibrate Stack Metrics"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
            </button>
          </div>

          {skillsLoading ? (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {[
                { id: "frontend", name: "Frontend Development", icon: "monitor", systemLog: "Initializing TS compiler... Dynamic route trees compiled... OK (94%)" },
                { id: "backend", name: "Backend & Core APIs", icon: "server", systemLog: "Profiling Express pipelines... Instantiating routes... OK (92%)" },
                { id: "data", name: "Databases & Engines", icon: "database", systemLog: "Re-indexing PostgreSQL trees... Pruning orphan leaves... OK (88%)" },
                { id: "infrastructure", name: "Docker & System Ops", icon: "layers", systemLog: "Securing image bounds... Testing container health metrics... OK (86%)" }
              ].map((categorySkeleton) => (
                <div
                  key={categorySkeleton.id}
                  className="relative overflow-hidden rounded-3xl border border-neutral-900 bg-neutral-950/20 p-6 md:p-8 flex flex-col justify-between h-[420px] select-none"
                >
                  <div className="space-y-6">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                      <div className="flex items-center gap-4">
                        <span className="shrink-0 p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-orange-500/40 animate-pulse">
                          {renderSkillIcon(categorySkeleton.icon)}
                        </span>
                        <div className="space-y-2">
                          <h3 className="h-4 w-32 bg-neutral-900 rounded animate-pulse" />
                          <div className="h-2.5 w-44 bg-neutral-900/60 rounded animate-pulse" />
                        </div>
                      </div>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400/50 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500/50" />
                      </span>
                    </div>

                    {/* Progress skeleton elements */}
                    <div className="space-y-5 pt-1">
                      {[1, 2, 3, 4].map((loaderId) => (
                        <div key={loaderId} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="h-3.5 w-24 bg-neutral-900/80 rounded animate-pulse" />
                            <div className="h-3.5 w-8 bg-neutral-900/80 rounded animate-pulse" />
                          </div>
                          <div className="relative w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden p-[0.5px] border border-neutral-900/60">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 rounded-full animate-pulse"
                              style={{ width: `${60 + loaderId * 8}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal log skeleton */}
                  <div className="mt-8 pt-4 border-t border-neutral-900/40">
                    <div className="bg-neutral-950 rounded-xl p-3.5 border border-neutral-900/70 font-mono text-[10.5px] animate-pulse space-y-1.5">
                      <span className="text-[9px] font-bold text-orange-500/50 uppercase tracking-wider block mb-1">
                        [TJB-Telemetry-Auditor://recalibrating...]
                      </span>
                      <p className="text-neutral-600 leading-relaxed font-light font-mono text-[10px]">
                        // SYSTEM: {categorySkeleton.systemLog}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {skillCategories.map((cat) => (
                <motion.div
                  key={cat.id}
                  className="relative overflow-hidden rounded-3xl border border-neutral-900/60 bg-neutral-900/10 p-6 md:p-8 hover:border-orange-500/25 hover:bg-neutral-900/20 transition-all duration-300 shadow-xl flex flex-col justify-between group select-none min-h-[420px]"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", duration: 0.4 }}
                >
                  {/* Embedded background abstract glow */}
                  <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-orange-500/[0.012] group-hover:bg-orange-500/[0.025] blur-[50px] transition-all duration-500 pointer-events-none" />
                  
                  <div className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between border-b border-neutral-900/40 pb-4">
                      <div className="flex items-center gap-4">
                        <span className="shrink-0 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 text-orange-500 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300 shadow-md">
                          {renderSkillIcon(cat.icon)}
                        </span>
                        <div>
                          <h3 className="text-sm font-mono uppercase tracking-[0.15em] font-bold text-neutral-100 group-hover:text-orange-450 transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 block">
                            Telemetry Operational Matrix
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>
                      </div>
                    </div>

                    {/* Skills Progress lists */}
                    <div className="grid gap-x-6 gap-y-5 pt-1">
                      {cat.skills.map((skill) => (
                        <div key={skill.name} className="space-y-2 font-mono group/item">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-neutral-300 font-medium group-hover/item:text-neutral-100 group-hover:text-neutral-200 transition-colors">
                              {skill.name}
                            </span>
                            <span className="text-orange-450 font-mono font-bold text-[10px] bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10 group-hover/item:bg-orange-500/10 transition-all">
                              {skill.proficiency}%
                            </span>
                          </div>
                          
                          {/* Segmented customized progress meter bar with a glowing light beacons at tip */}
                          <div className="relative w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/80 p-[0.5px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-orange-500 via-orange-450 to-amber-400 rounded-full relative"
                            >
                              {/* Glowing tracker beacon at tip */}
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#f97316] animate-pulse" />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Micro operational metrics module at bottom */}
                  <div className="mt-8 pt-4 border-t border-neutral-900/40">
                    <div className="bg-neutral-950 rounded-xl p-3.5 border border-neutral-900 text-[10.5px] font-mono relative overflow-hidden group-hover:border-neutral-850/80 transition-all">
                      <span className="text-[9px] font-bold text-orange-500/90 uppercase tracking-wider block mb-1">
                        [TJB-Telemetry-Auditor://live-node]
                      </span>
                      <p className="text-neutral-500 leading-relaxed font-light group-hover:text-neutral-450 transition-colors font-mono">
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
          )}
        </div>
      </motion.section>

      {/* My School (Academic Trajectory Node Module) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="school"
        className="py-24 border-t border-neutral-900/30 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="font-mono text-xs text-orange-500 uppercase tracking-[0.3em] font-extrabold flex items-center gap-2">
                <span className="w-4 h-[1px] bg-orange-500" />
                <span>Academic Trajectory Matrix</span>
              </p>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-neutral-100 max-w-lg mt-2 leading-tight">
                My Schools & Education <span className="text-orange-500 font-mono">_</span>
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-mono max-w-sm font-light leading-relaxed">
              Verifiable calibration sequence representing academic accomplishments, technical training nodes, and engineering expertise accumulated in Rwanda.
            </p>
          </div>

          {/* Grid of Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {schools.map((school) => {
              const isSelected = selectedSchoolNode === school.id;
              return (
                <motion.div
                  key={school.id}
                  onClick={() => setSelectedSchoolNode(school.id)}
                  className={`cursor-pointer group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between min-h-[300px] select-none ${
                    isSelected
                      ? "bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5"
                      : "bg-neutral-900/10 border-neutral-900/60 hover:border-orange-500/30 hover:bg-neutral-900/20"
                  }`}
                  whileHover={{ y: -5 }}
                >
                  {/* Decorative glowing back-pill */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-50 rounded-3xl pointer-events-none" />
                  )}

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider text-orange-500 font-bold uppercase">
                        {school.level}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {school.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      <div className={`p-2.5 rounded-xl font-bold transition-all ${
                        isSelected 
                          ? "bg-orange-500 text-neutral-950 scale-110" 
                          : "bg-neutral-950 text-orange-500 group-hover:bg-orange-500/20 group-hover:text-orange-400"
                      }`}>
                        {renderSchoolIcon(school)}
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-base text-neutral-100 tracking-tight leading-none group-hover:text-orange-500 transition-colors">
                          {school.name}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block leading-none">
                          {school.tag}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-neutral-400 leading-relaxed font-sans font-light">
                      {language === "en" ? school.desc : (school.descRw || school.desc)}
                    </p>
                  </div>

                  {/* Highlights and distinctions */}
                  <div className="mt-6 pt-4 border-t border-neutral-900/60 flex flex-wrap gap-1.5 relative z-10">
                    {school.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className={`text-[9.5px] font-mono px-2 py-0.5 rounded leading-none ${
                          isSelected
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-neutral-950 text-neutral-500 border border-neutral-900"
                        }`}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* School Node Live Telemetry Inspection Module */}
          <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-900/80 font-mono text-xs relative overflow-hidden">
            <span className="text-[9px] font-extrabold text-orange-500 uppercase tracking-widest block mb-1">
              [TJB-Academic-Telemetry://live-node-inspector]
            </span>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
              <div className="space-y-1">
                <p className="text-neutral-400 font-sans">
                  {(() => {
                    const activeSchool = schools.find(s => s.id === selectedSchoolNode);
                    if (activeSchool) {
                      const descText = language === "en" ? activeSchool.desc : (activeSchool.descRw || activeSchool.desc);
                      return (
                        <span>
                          ACTIVE INSPECTION: <strong className="text-orange-500">{activeSchool.name} {activeSchool.level}</strong>. {descText}
                        </span>
                      );
                    }
                    return <span>Select an academic trajectory node above to load verified telemetry parameters.</span>;
                  })()}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-neutral-500 font-mono flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> STATUS: DEPLOYED</span>
                  <span>&bull;</span>
                  <span>ACADEMIC KEY: {selectedSchoolNode?.toUpperCase()}-NODE-TJB-2026</span>
                  <span>&bull;</span>
                  <span className="text-orange-500/80">HONORS: {(() => {
                    const activeSchool = schools.find(s => s.id === selectedSchoolNode);
                    return activeSchool ? (activeSchool.distinction || "Academic Distinction Verified") : "N/A";
                  })()}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center bg-neutral-900/90 border border-neutral-850 rounded-xl px-4 py-2.5 text-[10px] text-orange-450 font-mono font-bold uppercase tracking-widest shadow-inner self-stretch md:self-auto justify-center">
                <span>Verification Node Active</span>
              </div>
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

      {/* Interactive Gallery Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
        id="gallery"
        className="py-24 border-t border-neutral-900/30 bg-neutral-950/20 relative snap-start"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 font-semibold px-2.5 py-1 bg-orange-500/5 border border-orange-500/15 rounded-full inline-block">
                {language === "rw" ? "AMAFOTO DEYITALI" : "SELF-NODE TELEMETRY"}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100">
                {language === "rw" ? "Agasanduku k'Amafoto" : "Photostream & Gallery"}
              </h2>
            </div>
            <p className="text-neutral-500 font-light text-sm max-w-sm">
              {language === "rw" 
                ? "Amafoto y'ingirakamaro mu mishinga, amahugurwa ndetse no mu bikorwa bya buri munsi bifotoreye kuri terefoni cyane cyane i Kigali."
                : "Real-time visual telemetry, presentation stages, production logs, and community interactions in high-fidelity snaps."}
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => {
                    setActiveGalleryImage(image.url);
                    setIsGalleryOpen(true);
                  }}
                  className="group relative rounded-3xl overflow-hidden bg-neutral-900/15 border border-neutral-900/60 p-4 hover:border-orange-500/30 hover:bg-neutral-900/25 transition-all cursor-pointer flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Image Container with zoom aspect ratio */}
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900/80 relative flex items-center justify-center">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-100">{language === "rw" ? "Fungura Ifoto" : "Expand Snap"}</span>
                        <Camera className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                    {/* Metadata text aspect */}
                    <div className="space-y-2 px-1">
                      <h3 className="text-sm font-bold text-neutral-100 tracking-tight group-hover:text-orange-500 transition-colors">
                        {image.title}
                      </h3>
                      <p className="text-xs text-neutral-450 leading-relaxed font-mono font-light line-clamp-2">
                        {image.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900/40 mt-4 flex items-center justify-between px-1 font-mono text-[10px] text-neutral-500">
                    <span className="uppercase tracking-wider">Node Frame #{idx + 1}</span>
                    <span className="text-orange-500/80 uppercase font-semibold">View &bull; zoom in</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-neutral-900/80 rounded-3xl p-12 text-center bg-neutral-900/5">
              <Camera className="w-12 h-12 text-neutral-700 mx-auto mb-4 animate-pulse" />
              <p className="text-sm font-mono text-neutral-400 font-medium">{language === "rw" ? "Nta mafoto arashyirwamo." : "No gallery images exist in storage."}</p>
              <p className="text-xs font-mono text-neutral-550 mt-1">{language === "rw" ? "Ubuyobozi bukeneye kwinjira kugira ngo bushyiremo amafoto m'ububiko." : "Admin privileges required to upload assets from desktop files."}</p>
            </div>
          )}
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
      <footer className="border-t border-neutral-900/50 bg-neutral-950/40 backdrop-blur-md pt-16 pb-12 px-6 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[150px] rounded-full bg-orange-500/3 blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* Developer Identity & Bweyeye Sector Rwanda info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-neutral-250 font-bold tracking-wider">TJB<span className="text-orange-500">.</span> Portfolio</span>
              </div>
              <p className="text-neutral-450 font-light text-xs leading-relaxed max-w-sm">
                Tuyishime Jean Baptiste is a dedicated software developer passionate about building high-performance, resilient, and beautiful system nodes.
              </p>
              {/* Origin info box */}
              <div className="flex gap-3 p-4 bg-neutral-900/20 border border-neutral-900/60 rounded-2xl max-w-sm">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-orange-500" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-400 block">Origin Location</span>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans">
                    Proudly hail from <span className="text-neutral-250 font-medium font-mono">Bweyeye sector, Rusizi District, Western Province, Rwanda</span> — a vibrant mountainous region adjacent to the majestic Nyungwe Forest.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="md:col-span-3 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-neutral-500 block">Portal Navigation</span>
              <ul className="space-y-2.5 font-mono text-xs">
                {[
                  "Home_#home",
                  "Projects_#projects",
                  "Competencies_#skills",
                  "Experience_#experience",
                  "Contact_#contact"
                ].map((link) => {
                  const [name, target] = link.split("_");
                  return (
                    <li key={target}>
                      <a
                        href={target}
                        className="text-neutral-450 hover:text-orange-500 transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-orange-500/50 font-semibold">•</span>
                        <span>{name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* RealChat AI section & quick launcher */}
            <div className="md:col-span-4 space-y-4">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-neutral-500 block">AI & Database Hub</span>
              <div className="p-5 bg-orange-500/[0.02] border border-orange-500/10 hover:border-orange-500/20 rounded-2xl space-y-4 transition-all duration-300">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                      <span className="text-[10px] uppercase font-mono tracking-wider text-green-400 font-bold">RealChat AI Online</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono font-bold uppercase tracking-wider">
                      Gemini 3.5 Flash
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold uppercase tracking-wider">
                      Supabase DB
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans">
                    Connect immediately with my responsive Gemini 3.5 Flash powered AI copilot, dynamically mirrored to a secure, real-time <span className="text-emerald-400 font-mono">Supabase</span> database layer.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsAIChatOpen(true)}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all font-bold flex items-center justify-center gap-2 group shadow-lg shadow-orange-500/5 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>RealChat AI With Me</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar copyright & login */}
          <div className="pt-8 border-t border-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px]">
            <div className="text-neutral-500">
              <span>{t.footerCopyright} &copy; {new Date().getFullYear()} TJB. All rights Reserved.</span>
            </div>
            
            <div className="flex items-center gap-4 text-neutral-500">
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
              <div className="p-4 bg-neutral-900/50 border-b border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                    <div>
                      <h3 className="font-bold text-neutral-100">Live Chat & AI Copilot</h3>
                      <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 flex-wrap">
                        <span>Connected to Baptiste</span>
                        <span className="text-neutral-750 font-sans">&bull;</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-sans font-bold uppercase tracking-wider ${
                          supabaseActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-neutral-900 text-neutral-550 border border-neutral-850"
                        }`} title={supabaseActive ? "Active Sync with Supabase Database" : "Sync fallback to Node Server cache"}>
                          {supabaseActive ? "Supabase Active" : "Local Mem"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAIChatOpen(false)}
                    className="p-1.5 rounded-lg border border-neutral-900 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nickname & AI Controls Row */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-neutral-900 pt-2.5">
                  <div className="space-y-1">
                    <span className="text-[9px] text-neutral-550 block font-bold uppercase">Your Nickname</span>
                    <input
                      type="text"
                      placeholder="Recruiter / Guest"
                      value={visitorName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVisitorName(val);
                        localStorage.setItem("tjb_portfolio_visitor_name", val);
                      }}
                      className="w-full bg-neutral-950 text-[10px] border border-neutral-900 rounded px-2 py-1 text-neutral-250 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-between items-end">
                    <span className="text-[9px] text-neutral-550 block font-bold uppercase text-right w-full">AI Auto-Reply</span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-neutral-450 hover:text-neutral-250">
                      <input
                        type="checkbox"
                        checked={sessionAiEnabled}
                        onChange={(e) => handleToggleVisitorAI(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-7 h-4 bg-neutral-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-neutral-500 after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500 peer-checked:after:bg-neutral-950"></div>
                      <span className="text-[10px]">
                        {sessionAiEnabled ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>
                </div>
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
                  className="px-4.5 py-3 bg-orange-500 hover:bg-orange-600 border border-none text-white rounded-xl font-mono text-xs uppercase tracking-wider font-bold disabled:opacity-40 transition-all shrink-0 cursor-pointer flex items-center gap-2 active:scale-95 shadow-md shadow-orange-500/15"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
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
                            placeholder="Enter username"
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
                            placeholder="Enter password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-605 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono"
                          />
                        </div>
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
                        { id: "school", label: "Manage Schools", icon: <GraduationCap className="w-3.5 h-3.5" /> },
                        { id: "chats", label: "Live Visitor Chats", icon: <MessageSquare className="w-3.5 h-3.5" /> },
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
                          <h4 className="text-neutral-100 font-mono text-xs uppercase tracking-widest font-bold">
                            {editingGalleryId ? "Revise Existing Photo Node" : "Publish Dynamic Photo Node"}
                          </h4>
                          <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                            {editingGalleryId
                              ? "Configure the new title, context description, and image data for this asset."
                              : "Select a photo from your desktop, assign descriptive labels, and instantly populate the landing page photostream."}
                          </p>
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
                          <div className="space-y-3">
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Select Photo Assets (Supports Multiple Uploads)</span>
                            
                            {newGalleryImages.length > 0 ? (
                              <div className="space-y-3 w-full text-left">
                                <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950 border border-neutral-900 rounded-xl max-h-[220px] overflow-y-auto">
                                  {newGalleryImages.map((src, index) => (
                                    <div key={index} className="group relative rounded-lg overflow-hidden border border-neutral-850 aspect-square bg-neutral-900 flex items-center justify-center shadow">
                                      <img src={src} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} referrerPolicy="no-referrer" />
                                      <div className="absolute inset-0 bg-neutral-950/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = newGalleryImages.filter((_, i) => i !== index);
                                            setNewGalleryImages(updated);
                                            if (updated.length > 0) {
                                              setNewGalleryImage(updated[0]);
                                            } else {
                                              setNewGalleryImage("");
                                            }
                                          }}
                                          className="p-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 rounded text-red-500 hover:text-red-400 cursor-pointer"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <span className="absolute bottom-1.5 left-1.5 bg-neutral-950/80 px-1.5 py-0.5 rounded text-[7px] font-mono font-bold text-orange-400">
                                        #{index + 1}
                                      </span>
                                    </div>
                                  ))}
                                  
                                  {/* Inner add-more for mobile */}
                                  <div className="relative rounded-lg border border-dashed border-neutral-850 hover:border-orange-500/30 flex flex-col items-center justify-center p-2 text-center aspect-square bg-neutral-950 transition-all cursor-pointer">
                                    <Plus className="w-4 h-4 text-neutral-500" />
                                    <span className="text-[8px] font-mono text-neutral-400 mt-1">Add</span>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={handleGalleryImageChange}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-mono text-neutral-400 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    <span>{newGalleryImages.length} node(s) staged</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewGalleryImages([]);
                                      setNewGalleryImage("");
                                    }}
                                    className="px-2 py-1 bg-neutral-950 text-[9px] font-mono text-red-500 rounded border border-neutral-850 cursor-pointer"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="relative border-2 border-dashed border-neutral-850 hover:border-orange-500/40 rounded-2xl p-5 bg-neutral-900 transition-colors flex flex-col items-center justify-center text-center">
                                <Upload className="w-6 h-6 text-neutral-600 mb-1.5" />
                                <span className="text-xs text-neutral-300 font-mono block font-medium">Browse desktop files</span>
                                <span className="text-[9px] text-neutral-550 font-mono block mt-0.5">JPEG/PNG, supports multiple uploads</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleGalleryImageChange}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <button
                              type="submit"
                              className="py-3 px-5 bg-orange-500 cursor-pointer text-white font-mono text-xs uppercase tracking-widest hover:bg-orange-600 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 font-bold"
                            >
                              {editingGalleryId ? <Check className="w-4 h-4 cursor-pointer" /> : <Plus className="w-4 h-4" />}
                              <span>{editingGalleryId ? "Save Changes" : "Publish Dynamic Photo Node"}</span>
                            </button>
                            {editingGalleryId && (
                              <button
                                type="button"
                                onClick={handleCancelEditGallery}
                                className="py-3 px-5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 cursor-pointer text-neutral-400 hover:text-neutral-250 font-mono text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 font-bold"
                              >
                                <X className="w-4 h-4 text-red-500" />
                                <span>Cancel Edit</span>
                              </button>
                            )}
                          </div>
                        </form>

                        {/* Active Photostream Panels List (Direct Management) */}
                        <div className="space-y-4 pt-6 border-t border-neutral-905">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 flex items-center gap-2">
                              <Camera className="w-4 h-4 text-orange-500" />
                              <span>Currently Active Photostream Panels ({galleryImages.length})</span>
                            </h4>
                            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider">Add, Update, or Delete</span>
                          </div>

                          {galleryImages.length === 0 ? (
                            <p className="text-[11px] font-mono text-neutral-550 italic">No gallery images registered.</p>
                          ) : (
                            <div className="grid sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                              {galleryImages.map((p) => (
                                <div
                                  key={p.id}
                                  className={`p-3 bg-neutral-950/80 border rounded-2xl flex flex-col justify-between gap-3 group transition-all duration-300 ${
                                    editingGalleryId === p.id ? "border-orange-500/50 shadow-lg shadow-orange-500/5" : "border-neutral-900 hover:border-neutral-800"
                                  }`}
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
                                  
                                  <div className="flex gap-2 pt-1 border-t border-neutral-900/40">
                                    <button
                                      type="button"
                                      onClick={() => handleEditGalleryInit(p.id)}
                                      className="flex-1 py-1.5 bg-neutral-900 hover:bg-orange-500/10 border border-neutral-850 hover:border-orange-500/20 text-neutral-300 hover:text-orange-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.2 cursor-pointer font-bold"
                                      title="Edit gallery node metadata & URL"
                                    >
                                      <Edit3 className="w-3 h-3 text-orange-500" />
                                      <span>Update</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm("Purge this photostream frame? This trace will be permanently deleted from dynamic stores.")) {
                                          handleDeleteGalleryImage(p.id);
                                        }
                                      }}
                                      className="flex-1 py-1.5 bg-neutral-900 hover:bg-red-500/10 border border-neutral-850 hover:border-red-500/20 text-neutral-450 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.2 cursor-pointer font-bold"
                                      title="Permanently remove image asset"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: MANAGE SCHOOLS */}
                    {adminActiveTab === "school" && (
                      <div className="space-y-6 animate-fade-in text-left">
                        <div className="border-b border-neutral-905 pb-3">
                          <h3 className="text-neutral-100 font-mono text-[11px] uppercase tracking-widest font-bold">
                            {editingSchoolId ? "Calibrate Educational Node" : "Publish Educational Node"}
                          </h3>
                        </div>

                        <form onSubmit={handleAddSchool} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">School Name *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolName}
                              onChange={(e) => setNewSchoolName(e.target.value)}
                              placeholder="E.g., IPRC NYANZA"
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono uppercase"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Education Level *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolLevel}
                              onChange={(e) => setNewSchoolLevel(e.target.value)}
                              placeholder="E.g., Higher Education A1 & A0"
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Trajectory Tag *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolTag}
                              onChange={(e) => setNewSchoolTag(e.target.value)}
                              placeholder="E.g., Full-Stack System Engineering"
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Duration *</label>
                            <input
                              type="text"
                              required
                              value={newSchoolDuration}
                              onChange={(e) => setNewSchoolDuration(e.target.value)}
                              placeholder="E.g., 2021 - 2024"
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Academic Distinction / Honors</label>
                            <input
                              type="text"
                              value={newSchoolDistinction}
                              onChange={(e) => setNewSchoolDistinction(e.target.value)}
                              placeholder="E.g., Engineering Excellence Lead Candidate"
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Highlights (Comma-Separated)</label>
                            <input
                              type="text"
                              value={newSchoolHighlights}
                              onChange={(e) => setNewSchoolHighlights(e.target.value)}
                              placeholder="E.g., Advanced Software Eng, TCP/IP Routing"
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">English Description *</label>
                            <textarea
                              required
                              rows={3}
                              value={newSchoolDesc}
                              onChange={(e) => setNewSchoolDesc(e.target.value)}
                              placeholder="Acquired elite software architecture skills..."
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Kinyarwanda Description (Optional)</label>
                            <textarea
                              rows={3}
                              value={newSchoolDescRw}
                              onChange={(e) => setNewSchoolDescRw(e.target.value)}
                              placeholder="Hano hiciwe ubumenyi bwo gukora porogaramu zikomye..."
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-3 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="flex gap-4 pt-2">
                            <button
                              type="submit"
                              className="py-3 px-5 bg-orange-500 text-white font-mono text-[10px] uppercase tracking-wider hover:bg-orange-600 rounded-xl transition-all font-bold cursor-pointer"
                            >
                              {editingSchoolId ? "Update Node" : "Publish Trajectory Node"}
                            </button>
                            {editingSchoolId && (
                              <button
                                type="button"
                                onClick={handleCancelEditSchool}
                                className="py-3 px-5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </form>

                        {/* Mobile Lists overview with Delete and edit options */}
                        <div className="space-y-3 pt-6 border-t border-neutral-900">
                          <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold">Active Academic Timeline Nodes ({schools.length})</label>
                          <div className="space-y-3">
                            {schools.map((item) => (
                              <div key={item.id} className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/70 space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-mono text-orange-500 font-bold uppercase">{item.level}</span>
                                  <span className="text-[9px] font-mono text-neutral-500">{item.duration}</span>
                                </div>
                                <h4 className="text-xs font-bold text-neutral-200">{item.name}</h4>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditSchoolInit(item.id)}
                                    className="py-1.5 px-3 bg-orange-500/10 text-orange-400 border border-orange-500/15 rounded-lg transition-all font-mono text-[9px] uppercase font-bold tracking-wider"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSchool(item.id)}
                                    className="py-1.5 px-3 bg-neutral-900 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-neutral-850 hover:border-red-500/20 rounded-lg transition-all font-mono text-[9px] uppercase font-bold tracking-wider"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {adminActiveTab === "chats" && (
                      <div className="space-y-6 animate-fade-in text-left">
                        <div className="border-b border-neutral-905 pb-3">
                          <h3 className="text-neutral-100 font-mono text-[11px] uppercase tracking-widest font-bold">
                            Live Visitor Chats
                          </h3>
                        </div>
                        <div className="p-4 border border-neutral-900 rounded-xl bg-neutral-950/40 text-center text-neutral-600 font-mono text-xs">
                          {adminChatSessions.length === 0 ? "No active chat sessions." : `There are ${adminChatSessions.length} active sessions. Please manage them on a desktop computer for optimal calibration controls.`}
                        </div>
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

                        {/* Gallery Assets Registry Management */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300 border-b border-neutral-900 pb-2 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-orange-500" />
                            <span>Currently Active Photostream Panels ({galleryImages.length})</span>
                          </h4>

                          <div className="grid sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
                            {galleryImages.map((p) => (
                              <div
                                key={p.id}
                                className="p-3 bg-neutral-900/35 border border-neutral-850 hover:border-orange-500/20 rounded-2xl flex flex-col justify-between gap-3 group transition-all"
                              >
                                <div className="space-y-2">
                                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
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
                                
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleEditGalleryInit(p.id);
                                      setAdminActiveTab("gallery");
                                    }}
                                    className="flex-1 py-1.5 bg-neutral-900 hover:bg-orange-500/10 border border-neutral-800 hover:border-orange-500/20 text-neutral-450 hover:text-orange-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.2 cursor-pointer font-bold mt-2"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("Purge this photostream frame? This trace will be permanently deleted from dynamic stores.")) {
                                        handleDeleteGalleryImage(p.id);
                                      }
                                    }}
                                    className="flex-1 py-1.5 bg-neutral-900 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/20 text-neutral-450 hover:text-red-400 font-mono text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.2 cursor-pointer font-bold mt-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Purge</span>
                                  </button>
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

      {/* Image Cropper Modal Layer */}
      <ImageCropperModal
        isOpen={cropperOpen}
        src={cropperSrc}
        onClose={handleCropperCancel}
        onCropComplete={handleCropperComplete}
        aspectPreset={cropperAspect}
      />

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
