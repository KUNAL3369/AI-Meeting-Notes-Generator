import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    const prompt = `
You are an AI assistant that generates clean, professional meeting notes.

Return ONLY valid JSON:

{
  "summary": "...",
  "key_points": ["..."],
  "decisions": ["..."],
  "action_items": [
    { "task": "...", "owner": "...", "deadline": "..." }
  ]
}

Guidelines:

STYLE:
- Write concise, professional, neutral tone
- No filler words like "The team discussed"
- Start directly with the outcome
- Keep sentences short and clear

SUMMARY:
- 1–2 lines max
- Focus on outcome, not conversation

KEY POINTS:
- Crisp bullet points
- No repetition
- No full sentences unless needed

DECISIONS:
- Extract explicit OR implicit agreements
- Look for: "agreed", "finalize", "we will", "decided"
- Always convert into clear statements

ACTION ITEMS:
- Start with action verb (e.g. "Design landing page")
- Keep short and specific
- If owner missing → "unknown"
- If deadline missing → "unspecified"

STRICT:
- Use only transcript
- Deduplicate repeated lines

Transcript:
${transcript}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NoteFlow AI",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Invalid response", raw: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ content });

  } catch (error) {
    console.error(error);


    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}