"use client";

import {  useState } from "react";

type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

type MeetingResult = {
  summary: string;
  key_points: string[];
  action_items: ActionItem[];
};

type HistoryItem = {
  id: string;
  title: string;
  transcript: string;
  result: MeetingResult;
  createdAt: string;
};

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

   const deleteHistory = (id: string) => {
        const updated = history.filter((item) => item.id !== id);
        setHistory(updated);
        localStorage.setItem("notes_history", JSON.stringify(updated));
      };

      const renameHistory = (id: string) => {
        const newName = prompt("Enter new name");
        if (!newName) return;

        const updated = history.map((item) =>
        item.id === id ? { ...item, title: newName } : item
      );

      setHistory(updated);
      localStorage.setItem("notes_history", JSON.stringify(updated));
      };

  const [result, setResult] = useState<MeetingResult | null>(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");

    if (!data) return null;

    try {
      return JSON.parse(atob(data)) as MeetingResult;
    } catch {
      return null;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("notes_history");
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = async () => {
    if (!transcript.trim()) return;

    setLoading(true);

    const cleanedTranscript = Array.from(
    new Set(
      transcript
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
      )
    ).join("\n");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ transcript: cleanedTranscript  }),
      });

      const data = await res.json();

      let parsed: MeetingResult | null = null;

      try {
        parsed = JSON.parse(data.content);
      } catch {
        const match = data.content.match(/{[\s\S]*}/);
        parsed = match ? JSON.parse(match[0]) : null;
      }

      if (!parsed) return;

      setResult(parsed);

      const newEntry: HistoryItem = {
        id: crypto.randomUUID(),
        title: cleanedTranscript.slice(0, 40) || "Untitled",
        transcript: cleanedTranscript,
        result: parsed,
        createdAt: new Date().toISOString(),
      };

     

      const updated: HistoryItem[] = [newEntry, ...history];
      setHistory(updated);
      localStorage.setItem("notes_history", JSON.stringify(updated));

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h1 className="font-semibold text-lg">NoteFlow AI</h1>

          <button
            onClick={() =>
              document.documentElement.classList.toggle("dark")
            }
            className="text-xs px-3 py-1 rounded-md bg-white/20 hover:bg-white/30"
          >
            Toggle Theme
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-gray-100 dark:bg-gray-900 p-6">
          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-3 text-black dark:text-white">
                Paste Transcript
              </h2>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-64 border rounded-lg p-3 text-sm 
                bg-white dark:bg-gray-900 
                text-black dark:text-white 
                border-gray-300 dark:border-gray-700"
                placeholder="Paste your meeting transcript..."
              />

              <button
                onClick={handleGenerate}
                className="mt-4 w-full py-2.5 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90"
              >
                {loading ? "Generating..." : "Generate Notes"}
              </button>

              {/* HISTORY */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {history.length === 0 ? (
        <p className="text-xs text-gray-400">No history yet</p>
        ) : (
        history.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between gap-2 p-2 rounded-lg border 
        bg-gray-50 dark:bg-gray-900 
        border-gray-300 dark:border-gray-600"
      >
        {/* CLICK AREA */}
        <button
          onClick={() => {
            setTranscript(item.transcript);
            setResult(item.result);
          }}
          className="flex-1 text-left text-sm font-medium truncate 
          text-black dark:text-white"
        >
          {item.title}
        </button>

        {/* ACTIONS */}
        <div className="flex gap-1">
          <button
            onClick={() => renameHistory(item.id)}
            className="text-xs px-2 py-1 rounded 
            bg-gray-200 dark:bg-gray-700 
            hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Rename
          </button>

          <button
            onClick={() => deleteHistory(item.id)}
            className="text-xs px-2 py-1 rounded 
            bg-red-500 text-white 
            hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      ))
    )}
    </div>
    </div>
      {/* RIGHT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Meeting Notes
                </h2>

                {result && (
                  <div className="flex gap-2">

                    {/* COPY */}
                    <button
                      onClick={async () => {
                        try {
                          const text = `
Summary:
${result.summary}

Key Points:
${result.key_points.join("\n")}

Action Items:
${result.action_items
  .map(
    (i) => `${i.task} (${i.owner}, ${i.deadline})`
  )
  .join("\n")}
`;
                          await navigator.clipboard.writeText(text);
                          alert("Copied!");
                        } catch {
                          alert("Copy failed");
                        }
                      }}
                      className="text-xs px-3 py-1 border rounded 
                      bg-white dark:bg-gray-800 
                      text-black dark:text-white 
                      border-gray-300 dark:border-gray-600 
                      hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Copy
                    </button>

                    {/* SHARE */}
                    <button
                      onClick={() => {
                        const data = btoa(JSON.stringify(result));
                        const url = `${window.location.origin}?data=${data}`;
                        navigator.clipboard.writeText(url);
                        alert("Share link copied!");
                      }}
                      className="text-xs px-3 py-1 border rounded 
                      bg-white dark:bg-gray-800 
                      text-black dark:text-white 
                      border-gray-300 dark:border-gray-600 
                      hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Share
                    </button>

                  </div>
                )}
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              ) : !result ? (
                <p className="text-gray-400 text-sm">
                  Output will appear here...
                </p>
              ) : (
                <div className="space-y-6">

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1">
                      SUMMARY
                    </h3>
                    <p className="text-sm text-black dark:text-white">
                      {result.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1">
                      KEY POINTS
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-black dark:text-white">
                      {result.key_points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-2">
                      ACTION ITEMS
                    </h3>

                    <div className="space-y-2">
                      {result.action_items.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700"
                        >
                          <p className="text-sm font-medium text-black dark:text-white">
                            {item.task}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Owner: {item.owner || "unknown"} • Deadline: {item.deadline || "unspecified"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
