"use client";

import { useState } from "react";

type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

type MeetingResult = {
  summary: string;
  key_points: string[];
  decisions?: string[];
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

  const [result, setResult] = useState<MeetingResult | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (!data) return null;

    try {
      return JSON.parse(atob(data));
    } catch {
      return null;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("notes_history");
    return saved ? JSON.parse(saved) : [];
  });

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
        body: JSON.stringify({ transcript: cleanedTranscript }),
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

      const updated = [newEntry, ...history];
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
          <div>
            <h1 className="font-semibold text-lg">NoteFlow AI</h1>
            <p className="text-xs opacity-80">
              Turn meeting transcripts into structured notes
            </p>
          </div>

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

              {/* INPUT HEADER */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  Paste Transcript
                </h2>

                <button
                  onClick={() =>
                    setTranscript(`John: Finalize landing page by Friday.
Sarah: I'll handle design.
Mike: I'll integrate API by Thursday.`)
                  }
                  className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
                >
                  Try Sample
                </button>
              </div>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-64 border rounded-lg p-3 text-sm 
                bg-white dark:bg-gray-900 
                text-black dark:text-white 
                border-gray-300 dark:border-gray-700"
                placeholder="e.g. John: Let's finalize landing page by Friday..."
              />

              <button
                onClick={handleGenerate}
                disabled={!transcript.trim() || loading}
                className="mt-4 w-full py-2.5 rounded-lg text-white 
                bg-gradient-to-r from-purple-600 to-indigo-600 
                hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Notes"}
              </button>

              {/* HISTORY */}
              <div className="mt-5 space-y-2 max-h-40 overflow-y-auto pr-1">
                {history.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No notes yet. Generate your first one.
                  </p>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg border 
                      bg-gray-50 dark:bg-gray-900 
                      border-gray-300 dark:border-gray-600"
                    >
                      <button
                        onClick={() => {
                          setTranscript(item.transcript);
                          setResult(item.result);
                        }}
                        className="flex-1 text-left text-sm font-medium truncate text-black dark:text-white"
                      >
                        {item.title}
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => renameHistory(item.id)}
                          className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
                        >
                          Rename
                        </button>

                        <button
                          onClick={() => deleteHistory(item.id)}
                          className="text-xs px-2 py-1 rounded bg-red-500 text-white"
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
                        const text = `
                        Summary:
                        ${result.summary}

                        Key Points:
                        ${result.key_points.join("\n")}

                        Decisions:
                        ${result.decisions?.join("\n") || "None"}

                        Action Items:
                        ${result.action_items
                        .map((i) => `${i.task} (${i.owner}, ${i.deadline})`)
                        .join("\n")}
                        `;
                        await navigator.clipboard.writeText(text);
                        alert("Copied!");
                      }}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Copy
                    </button>

                    {/* EXPORT */}
                    <button
                      onClick={() => {
                        const text = `
                        Summary:
                        ${result.summary}

                        Key Points:
                        ${result.key_points.join("\n")}

                        Decisions:
                        ${result.decisions?.join("\n") || "None"}

                        Action Items:
                        ${result.action_items
                        .map((i) => `${i.task} (${i.owner}, ${i.deadline})`)
                        .join("\n")}
                      `;
                        const blob = new Blob([text], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "meeting-notes.txt";
                        a.click();
                      }}
                      className="text-xs px-3 py-1 border rounded"
                    >
                      Export
                    </button>

                  </div>
                )}
              </div>

              {!result ? (
                <p className="text-gray-400 text-sm">
                  Paste a meeting transcript on the left and generate structured notes here.
                </p>
              ) : (
                <div className="space-y-8">

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1">
                      SUMMARY
                    </h3>
                    <p className="text-sm">{result.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1">
                      KEY POINTS
                    </h3>
                    <ul className="list-disc pl-5 text-sm">
                      {result.key_points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 mb-1">
                      DECISIONS
                    </h3>
                    <ul className="list-disc pl-5 text-sm">
                      {result.decisions?.length ? (
                        result.decisions.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))
                      ) : (
                        <li className="text-gray-400">No decisions</li>
                      )}
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
                          className="flex justify-between items-start p-3 border rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.task}</p>
                            <p className="text-xs text-gray-500">
                              {item.owner || "unknown"} •{" "}
                              {item.deadline || "unspecified"}
                            </p>
                          </div>
                          <input type="checkbox" />
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
