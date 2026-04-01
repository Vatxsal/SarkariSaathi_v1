<div align="center">
  <h1>SarkariSaathi (सरकारी साथी) 🇮🇳</h1>
  <p><strong>AI-powered navigation for the Indian citizen. From confusion to clarity.</strong></p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Powered%20by-Next.js%2014-black?logo=next.js" alt="Next.js"></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase"></a>
    <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white" alt="Google Gemini"></a>
    <a href="mailto:nexusai.build@gmail.com"><img src="https://img.shields.io/badge/Contact-NexusAI-blue" alt="Contact"></a>
  </p>
</div>

---

## 🚨 The India-Scale Problem

Millions of Indian citizens struggle daily to access essential government services. 

* **The Middleman Tax:** People lose their hard-earned money to local agents and unofficial middlemen just to understand or submit basic forms.
* **The Complexity Trap:** Official government websites are fragmented, highly bureaucratic, and often lack clear, linear step-by-step instructions.
* **The Language Barrier:** Critical processes are heavily documented in complex English, alienating a vast majority of the rural and semi-urban population.
* **The Information Gap:** Citizens waste hours—and make multiple repeat trips to government offices—simply trying to figure out which exact documents are required for their specific use case.

---

## 🌍 Why This Matters

This is not just another tool; it is civic infrastructure. SarkariSaathi solves a massive, real-world bottleneck in India. By eliminating the dependency on middlemen and translating complex bureaucracy into simple native languages, we save citizens both time and money. It is an agent of empowerment, bringing government services directly to the fingertips of the people who need them the most.

---

## 💡 Our Approach

At **NexusAI**, we believe accessing your fundamental rights shouldn't be a privilege. Our core philosophy is built on:

* **"No Middlemen"**: Empowering every citizen to do it themselves, for free.
* **"Clarity over Complexity"**: Transforming bureaucratic jargon into simple, actionable steps.
* **"Localized Guidance"**: Speaking the user's language—literally.
* **"Trust through Accuracy"**: We don't guess. We map directly to verified official processes.
* **"AI as Navigator, Not Decision Maker"**: AI is used exclusively to understand human intent and route users to verified static data. It does not hallucinate official legal or financial advice.

---

## ✨ What SarkariSaathi Does

SarkariSaathi is a highly simplified, intelligence-driven gateway to Indian government services:

* **Understands Intent**: A user types their problem in plain language (e.g., "Mera ration card kho gaya, kya karu?").
* **Maps Context**: The AI extracts the exact service and subcase, cross-referencing it with the user's selected state.
* **Delivers the Guide**: Immediately provides a verified, step-by-step roadmap on how to solve the issue, complete with official links and document checklists.
* **Frictionless Entry**: Works instantly in multiple languages without requiring an initial login (optional auth is available for extended usage).

---

## 🤖 The Roadmap: Towards AI Action Agents

**SarkariSaathi V1 is just the foundation layer.** Our ultimate roadmap transitions this project from an *Information Platform* to an *Action Engine*.

We are actively building secure AI Agents designed to:
* **Autonomously Navigate Portals:** Seamlessly connect to official government websites.
* **Auto-Fill Forms:** Automatically fill out complex web forms on the user's behalf.
* **Assisted Submission:** Gather, format, and organize uploaded documents locally.
* **Human Verification:** Always pause for explicit human review and consent before any final submission.
* **End-to-End Pipeline:** Act as a completely secure, transparent digital assistant to manage the entire application flow from start to finish.

---

## 🛠️ Tech Stack 

SarkariSaathi is architected for speed, reliability, and security.

* **Framework:** **Next.js 14 (App Router)** — Chosen for optimal server-side rendering, secure internal API routes, and powerful SEO capabilities.
* **Database:** **Supabase (PostgreSQL)** — Leveraged for highly scalable, relational data storage containing the localized, canonical government guidelines.
* **Authentication:** **Better Auth** — Implemented for secure, frictionless Google OAuth and robust session management without heavy client-side bundles.
* **Rate Limiting:** **Custom PostgreSQL Windowing** — A bespoke `prompt_usage` table enforces a rolling 16-hour limit to prevent platform abuse. Better Auth handles global strict API rate limiting independently.
* **AI Integration:** **Google Gemini Suite** — Operating a cascading fallback (2.5-Flash down to 1.5-Flash). Used strictly as an NLP intent-detection engine to parse unstructured text into a highly controlled JSON routing schema.
* **State Management:** **React Context + LocalStorage Sync** — A lightweight, custom context provider ensures the user's localized Indian State persists across separate tabs and sessions instantly.
* **Security Practices:** Strict CORS/Origin validation on API endpoints, `HttpOnly` and `SameSite=Lax` cookie usage, and strict parameter boundary checks to ensure total data safety.

---

## 🔒 Security & Trust

* **Zero Hallucination Guarantee:** The AI is tightly sandboxed. It does not generate advice; it only reads user queries to calculate routing matrices to our statically verified database guidelines.
* **Data Minimization:** We only store exactly what is required for authentication and limit tracking. 
* **Secure Auth Flow:** All sessions are handled securely on the server with standard cryptographic protections.
* **Total Transparency:** We surface the exact official URLs where the information originates.

---

## 📈 Current Scope & Features

The platform is rapidly expanding to cover multiple central and state government services.

* **15+ Core Services Covered:**
  * Ration Card
  * Aadhaar Update
  * PAN Card
  * Driving License (DL)
  * 10+ Central Government Schemes (PM Kisan, Ayushman Bharat, PM Awas Yojana, PM Ujjwala, PM Vishwakarma, etc.)
* **AI Chat Navigation:** Conversational parsing matching to exact regional processes.
* **Language Support (v1):** Seamless runtime toggle between Hindi & English interfaces via i18next.
* **Guest Access:** Experience the platform freely before committing to an account.
* **Smart Rate Limits:** Fair usage protections to keep the service highly available for everyone.

---

## 🚀 Future Localization Expansion (v2)

We are committed to making SarkariSaathi accessible to every citizen. Support for multiple Indian languages is upcoming:
* ✅ Hindi
* ✅ English
* ⏳ Tamil
* ⏳ Telugu
* ⏳ Marathi
* ⏳ Bengali

---

## 🏢 About the Parent Brand

SarkariSaathi is a flagship product being developed under **NexusAI**, an early-stage startup focused on building impactful technological infrastructure.

* **Founder:** Vatsal Mishra (Founder, NexusAI)
* **Contact:** [nexusai.build@gmail.com](mailto:nexusai.build@gmail.com)

---

## ⚠️ Disclaimer

SarkariSaathi is an independent civic technology initiative and is **not affiliated with, endorsed by, or representing any government entity.** All information provided is sourced from publicly available official portals. Always verify details on the respective `gov.in` or `nic.in` state websites before taking official action.
