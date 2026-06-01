import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Server-side AI Chat proxy endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Invalid request. 'messages' must be an array of chat messages." });
    return;
  }

  const userMessage = messages[messages.length - 1]?.content || "";
  if (!userMessage) {
    res.status(400).json({ error: "Empty message is not allowed." });
    return;
  }

  // If Gemini client is available, use it!
  if (aiClient) {
    try {
      // Map message history block for Gemini thread context
      const contents = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.content }],
      }));

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: PORTFOLIO_CONTEXT,
          temperature: 0.7,
        },
      });

      res.json({ content: response.text });
      return;
    } catch (error: any) {
      console.error("Gemini API execution failed:", error);
      // Fallback to offline logic if the live API fails during request execution
    }
  }

  // High-fidelity fallback simulated intelligence for Offline / Sandboxed mode
  let responseText = "I would be happy to help you with that! Jean Baptiste is a highly proficient Full-Stack Developer specializing in React, Node.js, and modern databases. Is there a specific project, stack competency, or service you are interested in?";
  const msgLower = userMessage.toLowerCase();

  if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("hey")) {
    responseText = "Hello! I am Jean Baptiste's AI Assistant. How can I help you explore his portfolio, projects, or technical expertise today?";
  } else if (msgLower.includes("project") || msgLower.includes("work") || msgLower.includes("build")) {
    responseText = "Jean Baptiste has completed outstanding full-stack projects, including:\n1. **Inventory Management System**: Stock tracking and stock movement tracker.\n2. **Bakery Ordering Web Suite**: Order tracking and administrative dashboards.\n3. **System Monitoring Dashboard**: Performance tracking and health checks.\n4. **API Gateway Platform**: Realized with robust rate-limiting and authorization.";
  } else if (msgLower.includes("skill") || msgLower.includes("tech") || msgLower.includes("stack") || msgLower.includes("react") || msgLower.includes("node")) {
    responseText = "Jean Baptiste's technical stack centers on **React**, **TypeScript**, **Node.js**, **Express**, **Tailwind CSS**, and **Python**. He excels at relational database design (PostgreSQL/SQL), NoSQL databases (MongoDB), optimization, and deploying Docker containers.";
  } else if (msgLower.includes("contact") || msgLower.includes("hire") || msgLower.includes("email") || msgLower.includes("work with") || msgLower.includes("call")) {
    responseText = "You can contact Jean Baptiste directly using the Contact Form below, or by email at **fizzorafiki@gmail.com**. He is currently open to full-time opportunities, consultations, and freelance projects!";
  } else if (msgLower.includes("experience") || msgLower.includes("education") || msgLower.includes("background")) {
    responseText = "Jean Baptiste is an experienced Full-Stack software engineer with a strong engineering design philosophy. He excels at writing optimized, maintainable code, implementing secure microservice layers, and designing sleek user interfaces.";
  } else if (msgLower.includes("price") || msgLower.includes("rate") || msgLower.includes("cost")) {
    responseText = "Rates and pricing depend on the project's scope, requirements, and timeline. Please leave a proposal message in the contact form below or email **fizzorafiki@gmail.com** to receive an estimate.";
  }

  res.json({ content: responseText });
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
