<div align="center">

# 🧠 NoteFlow AI — AI Meeting Notes Generator

**A real-time productivity tool that converts raw meeting transcripts into structured, actionable notes.**

Built to demonstrate how AI can be shaped into a usable product — not just a prompt and a response.

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge)](https://note-flow-ai-three.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI%20%2F%20Groq-AI%20Powered-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://note-flow-ai-three.vercel.app/)

</div>

---

## ⚡ Try It Right Now

No setup. No sign-up. Just paste a transcript and go.

| | |
|---|---|
| 🌐 **Live URL** | https://note-flow-ai-three.vercel.app/ |

---

## 🧠 The Problem It Solves

Meeting transcripts are messy, repetitive, and hard to act on. Teams waste time re-reading conversations to extract what was actually decided.

NoteFlow AI turns raw discussion into structured output instantly:

- 📋 **Summary** — what the meeting was about
- 📌 **Key Points** — the important takeaways
- ✅ **Decisions** — what was agreed upon
- 👤 **Action Items** — who does what, by when

---

## 🔥 Key Highlights

- Structured JSON output from AI — not freeform text
- Transcript cleaning and deduplication before processing
- Persistent history with rename, delete, and active highlighting
- Interactive action item checkboxes for post-meeting tracking

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Summarization** | Structured JSON output via OpenAI / Groq API |
| 🧹 **Transcript Cleaning** | Deduplication and normalization before sending to AI |
| 📋 **Copy & Export** | Instantly copy or export generated notes |
| 🕘 **Persistent History** | Notes saved locally with chat-style history panel |
| ✏️ **Rename & Delete** | Full control over past note sessions |
| ✅ **Action Item Tracking** | Interactive checkboxes per action item |
| 🌙 **Dark Mode** | Full dark mode support |
| ⚡ **Fast UI** | Clean, minimal interface built for quick usage |

---

## 🏗️ How It Works

```
User pastes meeting transcript
        │
        ▼
Input cleaned (deduplication + normalization)
        │
        ▼
Strict structured prompt sent to AI (OpenAI / Groq)
        │
        ▼
AI returns JSON response
        │
        ▼
UI parses and renders:
  ├── Summary
  ├── Key Points
  ├── Decisions
  └── Action Items (owner + deadline + checkbox)
        │
        ▼
Result saved to localStorage history
```

---

## 📷 Example

**Input:**
```
John: We should use minimal design.
Sarah: That improves performance.
Mike: I'll integrate API by Thursday.
John: Agreed. Let's deploy Friday.
```

**Output:**
```
Summary:
Minimal design chosen for better performance, with API integration and deployment planned.

Key Points:
- Minimal design improves performance
- API integration by Thursday
- Deployment by Friday

Decisions:
- Use minimal design approach

Action Items:
- Integrate API → Mike, Thursday
- Deploy landing page → John, Friday
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| AI Integration | OpenAI / Groq API |
| State | React Hooks + localStorage |
| Deployment | Vercel |

---

## 🚀 Run Locally

```bash
git clone https://github.com/KUNAL3369/noteflow-ai.git
cd noteflow-ai
npm install
npm run dev
```

Add your API key to a `.env.local` file:

```
OPENROUTER_API_KEY=your_key_here
```

Open [http://localhost:3000](http://localhost:3000) and you're in.

---

## 🎯 Why This Project Matters

- Built to demonstrate AI integration as a product, not just a wrapper
- Structures unstructured data into a consistent, usable format
- Focuses on frontend UX and real-world utility, not just AI output
- Shows end-to-end thinking — from raw input to deployed, usable tool

---

## 🔮 Planned Improvements

- [ ] Cloud sync with user authentication
- [ ] Shareable note links with public access
- [ ] PDF export
- [ ] Team collaboration features

---

## 📬 Let's Connect

🟢 **Open to:** Frontend Engineer · Product Engineer · Internal Tools Developer · Startup Software Engineer · AI Application Developer *(entry-level & early-stage startups)*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kunal%20Prabhakar-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/prabhakarkunal)
[![Email](https://img.shields.io/badge/Email-kunal.prabhakar3082@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kunal.prabhakar3082@gmail.com)

---

<div align="center">

⭐ **Found this useful? Star the repo — it helps others discover it.**

</div>
