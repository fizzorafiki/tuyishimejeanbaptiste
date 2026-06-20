import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily and defensively
let aiClient: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

if (key && key !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Successfully initialized Gemini GenAI Client.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined or is placeholder. Using robust offline mock logic for the AI Assistant.");
}

// Tuyishime Jean Baptiste's professional knowledge base
const PORTFOLIO_CONTEXT = `
You are the AI Portfolio Assistant for Tuyishime Jean Baptiste (TJB), an exceptional and professional Full-Stack Developer.
Your job is to answer questions from potential clients, recruiters, and visitors about Jean Baptiste's work, experience, skills, and values.

Keep your tone:
1. Highly professional, friendly, objective, and polite.
2. Concise and direct (aim for 2-4 sentences or clear bullet points per answer).
3. Confident and helpful, acts on behalf of Jean Baptiste.

Key Background Information:
- Full Name: Tuyishime Jean Baptiste
- Role: Full-Stack Developer / Software Engineer
- Email: fizzorafiki@gmail.com
- Core Philosophy: "Building software systems that are secure, efficient, scalable, and easy to maintain — without unnecessary complexity."
- Core Technical Skills:
  * Frontend: React, Redux, HTML5, CSS3, Tailwind CSS (including Tailwind CSS v4), JavaScript, TypeScript, Framer Motion for responsive UI fluid interactions.
  * Backend: Node.js, Express, REST APIs, secure API design, reverse proxies, and Python.
  * Databases: PostgreSQL, SQL, MongoDB, Indexing & Query Optimization.
  * Infrastructure / DevOps: Docker, Git, Linux, project deployment, security, Rate-limiting, authentication/authorization implementation.
- Major Projects:
  1. "Inventory Management System" (Full-Stack): Designed for stock tracking, product management, warehouse operations, and reporting. Built with React, Node.js, and Express.
  2. "Bakery Ordering Web Suite" (E-Commerce): Complete system supporting customer customization, administrative order flow dashboards, and secure checkouts.
  3. "System Monitoring Dashboard" (Real-time Metric analysis): Integrated system health graph metrics, service status, and warning systems.
  4. "API Gateway Platform" (Backend Security): Enterprise-level gateway carrying out authentications, secure routing, rate limiting, and microservice aggregation.
- Communication Instructions:
  * If someone asks to contact Jean Baptiste or schedule a meeting, politely guide them to the Contact Form at the bottom of the page, or provide his email: fizzorafiki@gmail.com.
  * If a user asks questions unrelated to his portfolio, developer career, or professional topic, gently guide them back to asking in-scope questions about Jean Baptiste's professional abilities.
`;

// Real-Time Portfolio Chats Memory Store
interface ChatMessage {
  id: string;
  sender: "visitor" | "admin" | "ai";
  content: string;
  timestamp: number;
}

interface ChatSession {
  sessionId: string;
  visitorName: string;
  createdAt: number;
  lastActive: number;
  aiEnabled: boolean;
  messages: ChatMessage[];
}

const chatSessions: Record<string, ChatSession> = {
  "demo-session-uuid": {
    sessionId: "demo-session-uuid",
    visitorName: "Potential Recruiter (Demo)",
    createdAt: Date.now() - 3600000,
    lastActive: Date.now() - 1800000,
    aiEnabled: true,
    messages: [
      { id: "m1", sender: "visitor", content: "Hi Baptiste! I am looking for a full-stack developer who is strong with Node.js and React. Are you available for remote contracts?", timestamp: Date.now() - 3600000 },
      { id: "m2", sender: "ai", content: "Hello! Yes, Jean Baptiste is highly proficient in React, Node.js, and TypeScript, and is actively open to full-time roles, freelance setups, and contracts. For direct discussion, you can also reach him at fizzorafiki@gmail.com! Is there an existing project stack you'd like to consult on?", timestamp: Date.now() - 3590000 },
      { id: "m3", sender: "visitor", content: "That sounds excellent. I will review your bakery or inventory dashboard systems.", timestamp: Date.now() - 1800000 }
    ]
  }
};

// Create Supabase Client Lazily and Safely
let supabaseClient: any = null;
const supUrl = process.env.SUPABASE_URL;
const supKey = process.env.SUPABASE_ANON_KEY;

if (supUrl && supKey && supUrl !== "MY_SUPABASE_URL") {
  try {
    supabaseClient = createClient(supUrl, supKey);
    console.log("Successfully initialized Supabase Client.");
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.log("SUPABASE_URL or SUPABASE_ANON_KEY not configured. Falling back to in-memory store.");
}

// Resilient Supabase Synchronization Helpers
async function syncSessionFromSupabase(sessionId: string) {
  if (!supabaseClient) return;
  try {
    const { data: chatData, error: chatError } = await supabaseClient
      .from("tjb_chats")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (chatError) {
      console.warn("Supabase fetch chat warn:", chatError.message);
      return;
    }
    if (!chatData) return;

    const { data: messagesData, error: messagesError } = await supabaseClient
      .from("tjb_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true });

    if (messagesError) {
      console.warn("Supabase fetch messages warn:", messagesError.message);
      return;
    }

    chatSessions[sessionId] = {
      sessionId: chatData.session_id,
      visitorName: chatData.visitor_name,
      createdAt: new Date(chatData.created_at).getTime(),
      lastActive: new Date(chatData.last_active).getTime(),
      aiEnabled: !!chatData.ai_enabled,
      messages: (messagesData || []).map((m: any) => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        timestamp: new Date(m.timestamp).getTime()
      }))
    };
  } catch (err: any) {
    console.error("Resilient syncSessionFromSupabase caught exception:", err.message);
  }
}

async function saveSessionToSupabase(sessionId: string) {
  if (!supabaseClient) return;
  const session = chatSessions[sessionId];
  if (!session) return;
  try {
    const { error } = await supabaseClient
      .from("tjb_chats")
      .upsert({
        session_id: session.sessionId,
        visitor_name: session.visitorName,
        created_at: new Date(session.createdAt).toISOString(),
        last_active: new Date(session.lastActive).toISOString(),
        ai_enabled: session.aiEnabled
      });
    if (error) {
      console.warn("Supabase upsert chat warn:", error.message);
    }
  } catch (err: any) {
    console.error("Resilient saveSessionToSupabase caught exception:", err.message);
  }
}

async function saveMessageToSupabase(sessionId: string, message: ChatMessage) {
  if (!supabaseClient) return;
  try {
    const { error } = await supabaseClient
      .from("tjb_messages")
      .upsert({
        id: message.id,
        session_id: sessionId,
        sender: message.sender,
        content: message.content,
        timestamp: new Date(message.timestamp).toISOString()
      });
    if (error) {
      console.warn("Supabase upsert message warn:", error.message);
    }
  } catch (err: any) {
    console.error("Resilient saveMessageToSupabase caught exception:", err.message);
  }
}

async function deleteSessionFromSupabase(sessionId: string) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from("tjb_messages").delete().eq("session_id", sessionId);
    await supabaseClient.from("tjb_chats").delete().eq("session_id", sessionId);
  } catch (err: any) {
    console.error("Resilient deleteSessionFromSupabase caught exception:", err.message);
  }
}

async function refreshAllSessionsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data: chats, error: chatsError } = await supabaseClient
      .from("tjb_chats")
      .select("*")
      .order("last_active", { ascending: false });

    if (chatsError) {
      console.warn("Supabase query chats list warn (Tables might not be defined):", chatsError.message);
      return;
    }
    if (!chats) return;

    for (const chat of chats) {
      const { data: msgs, error: msgsError } = await supabaseClient
        .from("tjb_messages")
        .select("*")
        .eq("session_id", chat.session_id)
        .order("timestamp", { ascending: true });

      if (!msgsError && msgs) {
        chatSessions[chat.session_id] = {
          sessionId: chat.session_id,
          visitorName: chat.visitor_name,
          createdAt: new Date(chat.created_at).getTime(),
          lastActive: new Date(chat.last_active).getTime(),
          aiEnabled: !!chat.ai_enabled,
          messages: msgs.map((m: any) => ({
            id: m.id,
            sender: m.sender,
            content: m.content,
            timestamp: new Date(m.timestamp).getTime()
          }))
        };
      }
    }
  } catch (err: any) {
    console.error("Resilient refreshAllSessionsFromSupabase caught exception:", err.message);
  }
}

// Local assistant generator function to reuse for both proxy and chat sessions
async function askAI(conversation: { role: "user" | "model"; parts: { text: string }[] }[]): Promise<string> {
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: conversation,
        config: {
          systemInstruction: PORTFOLIO_CONTEXT,
          temperature: 0.7,
        },
      });
      return response.text || "";
    } catch (err) {
      console.error("Gemini live execution failed inside askAI:", err);
    }
  }

  // Robust custom fallback system matching Baptiste's profile
  const lastUserMsg = [...conversation].reverse().find(c => c.role === "user")?.parts[0]?.text || "";
  const msgLower = lastUserMsg.toLowerCase();

  if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("hey")) {
    return "Hello! I am Baptiste's AI Assistant. How can I help you explore his full-stack work, databases experience, or system designs today?";
  } else if (msgLower.includes("project") || msgLower.includes("work") || msgLower.includes("build")) {
    return "Baptiste has built elegant server-connected platforms: \n- **Inventory Management**: Designed with React and optimized Node.js backends.\n- **Bakery Ordering Suite**: Featuring secure workflows and transaction admin logs.\n- **System Monitoring App**: Built for real-time telemetry analysis.\n- **API Gateway**: Programmed for authorization security and rate-limiting.";
  } else if (msgLower.includes("skill") || msgLower.includes("tech") || msgLower.includes("stack") || msgLower.includes("react") || msgLower.includes("node")) {
    return "Baptiste specializes in **React**, **TypeScript**, **Node.js**, **Express**, and **Tailwind CSS**. He possesses core competencies in design of relational databases (PostgreSQL/SQL), Docker containerization, and deploying high-performance applications.";
  } else if (msgLower.includes("contact") || msgLower.includes("hire") || msgLower.includes("email") || msgLower.includes("work with")) {
    return "You can get in touch with Jean Baptiste via the Contact Form on his page, or directly write to **fizzorafiki@gmail.com**. He is ready to answer questions and discuss contracts immediately!";
  } else if (msgLower.includes("experience") || msgLower.includes("education") || msgLower.includes("background")) {
    return "Jean Baptiste is an expert Software Engineer who values secure databases, scalable backend infrastructure, and clean, responsive user interfaces.";
  } else if (msgLower.includes("price") || msgLower.includes("rate") || msgLower.includes("cost")) {
    return "Pricing maps to the direct complexity and scale of the proposed software. Feel free to shoot a structured message through the contact form or directly mail Jean Baptiste: **fizzorafiki@gmail.com**.";
  }

  return "I appreciate your response! Jean Baptiste is a highly proficient engineer skilled in modern DevOps, TypeScript engineering, and PostgreSQL database queries. Is there anything specific about his expertise you'd like to know?";
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    mode: process.env.NODE_ENV || "development",
    supabaseConfigured: !!supabaseClient 
  });
});

// GET: Fetch all active chat sessions (useful for Admin Dashboard)
app.get("/api/chat/sessions", async (req, res) => {
  if (supabaseClient) {
    await refreshAllSessionsFromSupabase();
  }
  const sessionsList = Object.values(chatSessions).sort((a, b) => b.lastActive - a.lastActive);
  res.json({ sessions: sessionsList });
});

// GET: Fetch or initialize a single chat session
app.get("/api/chat/session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  
  if (supabaseClient) {
    await syncSessionFromSupabase(sessionId);
  }

  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = {
      sessionId,
      visitorName: `Visitor #${sessionId.substring(0, 5)}`,
      createdAt: Date.now(),
      lastActive: Date.now(),
      aiEnabled: true,
      messages: [
        {
          id: "welcome-msg",
          sender: "ai",
          content: "Hello! I am Jean Baptiste's AI Portfolio Assistant. Feel free to ask any questions about his skills, projects, and stack experience! Baptiste can also join this conversation in real-time.",
          timestamp: Date.now()
        }
      ]
    };
    if (supabaseClient) {
      await saveSessionToSupabase(sessionId);
      await saveMessageToSupabase(sessionId, chatSessions[sessionId].messages[0]);
    }
  }
  res.json(chatSessions[sessionId]);
});

// POST: Send a message to a session
app.post("/api/chat/send", async (req, res) => {
  const { sessionId, sender, content, visitorName } = req.body;

  if (!sessionId || !sender || !content) {
    res.status(400).json({ error: "Missing required params: sessionId, sender, content." });
    return;
  }

  if (supabaseClient) {
    await syncSessionFromSupabase(sessionId);
  }

  // Ensure session exists
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = {
      sessionId,
      visitorName: visitorName || `Visitor #${sessionId.substring(0, 5)}`,
      createdAt: Date.now(),
      lastActive: Date.now(),
      aiEnabled: true,
      messages: []
    };
  }

  const session = chatSessions[sessionId];
  session.lastActive = Date.now();
  if (visitorName) {
    session.visitorName = visitorName;
  }

  // Append new message
  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    sender,
    content,
    timestamp: Date.now()
  };
  session.messages.push(newMessage);

  if (supabaseClient) {
    await saveSessionToSupabase(sessionId);
    await saveMessageToSupabase(sessionId, newMessage);
  }

  // If a visitor sent the message and AI auto-response is turned on, generate AI response
  if (sender === "visitor" && session.aiEnabled) {
    const aiConversation = session.messages.map(m => ({
      role: (m.sender === "visitor" ? "user" : "model") as "user" | "model",
      parts: [{ text: m.content }]
    }));

    const aiText = await askAI(aiConversation);
    const aiMessage: ChatMessage = {
      id: `ai-msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      sender: "ai",
      content: aiText,
      timestamp: Date.now()
    };
    session.messages.push(aiMessage);

    if (supabaseClient) {
      await saveMessageToSupabase(sessionId, aiMessage);
    }
  }

  res.json(session);
});

// POST: Toggle AI mode for a session
app.post("/api/chat/toggle-ai", async (req, res) => {
  const { sessionId, aiEnabled } = req.body;
  if (!sessionId || aiEnabled === undefined) {
    res.status(400).json({ error: "Missing sessionId or aiEnabled boolean representation." });
    return;
  }

  if (supabaseClient) {
    await syncSessionFromSupabase(sessionId);
  }

  if (chatSessions[sessionId]) {
    chatSessions[sessionId].aiEnabled = !!aiEnabled;
    if (supabaseClient) {
      await saveSessionToSupabase(sessionId);
    }
    res.json(chatSessions[sessionId]);
  } else {
    res.status(404).json({ error: "Session not found." });
  }
});

// POST: Generate AI suggested response for the Administrator
app.post("/api/chat/suggest-ai", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.status(400).json({ error: "Missing sessionId." });
    return;
  }

  if (supabaseClient) {
    await syncSessionFromSupabase(sessionId);
  }

  if (!chatSessions[sessionId]) {
    res.status(404).json({ error: "Chat session invalid or not found." });
    return;
  }

  const session = chatSessions[sessionId];
  
  // Format prompt to ask AI for a suggestion in the person of Jean Baptiste
  const promptContext = `
  You are an AI co-pilot helping Tuyishime Jean Baptiste (TJB) write a direct, concise, and professional reply in a real-time chat with a recruiter or potential client.
  Analyze the current message history and draft an exceptional, helpful response on behalf of Jean Baptiste.
  Keep it maximum 2-3 sentences.
  Current conversation history:
  ${session.messages.map(m => `${m.sender.toUpperCase()}: ${m.content}`).join("\n")}
  
  Write ONLY the recommended reply itself. Do not include any meta text or headers. Keep the tone professional, matching Baptiste's voice.
  `;

  let suggestionText = "";
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptContext,
        config: {
          temperature: 0.6
        }
      });
      suggestionText = response.text || "";
    } catch (err) {
      console.error("Gemini failed on suggestion:", err);
    }
  }

  if (!suggestionText) {
    // offline suggestion builder
    const lastMsg = [...session.messages].reverse().find(m => m.sender === "visitor")?.content.toLowerCase() || "";
    if (lastMsg.includes("project") || lastMsg.includes("portfolio")) {
      suggestionText = "Thanks for asking! I invite you to audit my bakery ordering app or inventory tracking dashboards directly in the grid. What features are you most interested in?";
    } else if (lastMsg.includes("hire") || lastMsg.includes("join") || lastMsg.includes("call")) {
      suggestionText = "I would be thrilled to jump on a call. Let me know your availability, or shoot me a direct schedule invitation at fizzorafiki@gmail.com.";
    } else {
      suggestionText = "Thanks so much for reaching out! I'd love to learn more about the products your team is building and how my full-stack skillset could help.";
    }
  }

  res.json({ suggestion: suggestionText });
});

// POST: Permanently delete/archive a chat session (Admin command)
app.post("/api/chat/delete-session", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.status(400).json({ error: "Missing sessionId parameter." });
    return;
  }

  if (supabaseClient) {
    await deleteSessionFromSupabase(sessionId);
  }

  if (chatSessions[sessionId]) {
    delete chatSessions[sessionId];
    res.json({ success: true, message: "Chat session trace wiped." });
  } else {
    res.status(404).json({ error: "No such trace exists." });
  }
});

// Legacy Server-side AI Chat proxy endpoint (retained for backward compatibility support)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid request. 'messages' must be an array of chat messages." });
    return;
  }

  const userConversation = messages.map((m) => ({
    role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
    parts: [{ text: m.content }]
  }));

  const text = await askAI(userConversation);
  res.json({ content: text });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
