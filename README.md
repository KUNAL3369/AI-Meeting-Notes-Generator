# 🚀 AI Meeting Notes Generator (NoteFlow AI)

🔗 **Live Demo:** [https://note-flow-ai-three.vercel.app/](https://note-flow-ai-three.vercel.app/)

---

## 📌 Overview

**AI Meeting Notes Generator** is a productivity tool that converts raw meeting transcripts into structured, actionable notes.

It transforms messy conversations into:

- ✅ Summary
- ✅ Key Points
- ✅ Decisions
- ✅ Action Items (with owner + deadline)

Built with a strong focus on **real-world usability**, not just AI output.

---

## ✨ Features

- 🧠 AI-powered summarization using structured JSON output
- 🧹 Transcript cleaning + deduplication for better accuracy
- 📋 Copy & Export meeting notes instantly
- 🕘 Persistent history (localStorage)
- 💬 Chat-style history selection with active highlighting
- ✏️ Rename & delete past notes
- ✅ Interactive action items (checkbox tracking)
- 🌙 Dark mode support
- ⚡ Fast, clean UI for quick usage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| AI Integration | OpenAI / Groq API |
| State Management | React Hooks + localStorage |

---

## 🧠 How It Works

1. User pastes meeting transcript
2. Input is cleaned (deduplicated lines)
3. Sent to AI with strict structured prompt
4. AI returns JSON response
5. UI parses and displays:
   - Summary
   - Key Points
   - Decisions
   - Action Items
6. Result is saved to history for later use

---

## 📷 Example Output

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
Minimal design chosen for better performance with API integration planned.

Key Points:
- Minimal design improves performance
- API integration by Thursday
- Deployment by Friday

Decisions:
- Use minimal design approach

Action Items:
- Implement design (Sarah, unspecified)
- Integrate API (Mike, Thursday)
- Deploy landing page (John, Friday)
```

---

## 🧪 Local Setup

```bash
git clone https://github.com/your-username/noteflow-ai.git
cd noteflow-ai
npm install
npm run dev
```

> Add your API key to a `.env.local` file:
> ```
> OPENROUTER_API_KEY=your_key_here
> ```

---

## 📈 What This Project Demonstrates

- Building **AI-powered products**, not just integrations
- Structuring unstructured data into usable formats
- Strong **frontend UX + product thinking**
- End-to-end development (idea → deployment)

---

## 🔮 Future Improvements

- [ ] User authentication (save notes in cloud)
- [ ] Shareable links with public access
- [ ] PDF export
- [ ] Team collaboration features

---

## 👨‍💻 Author

**Kunal Prabhakar** 


---

## ⭐ If you found this useful

Give it a star ⭐ on GitHub — it helps with visibility and means a lot!
