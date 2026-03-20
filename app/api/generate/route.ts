import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    const prompt = `
You are an AI assistant that generates high-quality, structured meeting notes.

Return ONLY valid JSON in this format:

{
  "summary": "...",
  "key_points": ["..."],
  "action_items": [
    { "task": "...", "owner": "...", "deadline": "..." }
  ]
}

Strict Rules:
- Use ONLY information from the transcript
- DO NOT hallucinate or add external information
- Deduplicate repeated lines
- Merge repeated discussions into one clear point
- If the same sentence repeats → treat it as one discussion
- Always stay grounded in the input

Quality Rules:
- Summary must be 1–2 clear sentences (not just a title)
- Key points must be meaningful and specific (avoid vague words like "Design")
- Action items must be clear and actionable (e.g., "Complete landing page design")
- Always include owner if mentioned in transcript
- Preserve important details like deadlines and responsibilities
- DO NOT assign a deadline unless it is explicitly mentioned for that specific task
- DO NOT reuse another task's deadline

Fallback Rules:
- If owner missing → "unknown"
- If deadline missing → "unspecified"

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