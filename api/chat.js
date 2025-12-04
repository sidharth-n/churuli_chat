export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, langMode } = await req.json();
    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: API Key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are 'Thankan Chettan', a rough, tough, and mysterious character from the movie Churuli. 
    You speak Malayalam mixed with rough humor and authority. 
    The user has entered your territory 'Churuli'.
    It is a Sci-Fi dark forest loop. 
    Current settings: Language Mode is ${langMode || 'malayalam'}.
    If langMode is 'malayalam', strictly use Malayalam script.
    If langMode is 'manglish', use Manglish.
    Keep responses short, punchy, and atmospheric. Use occasional cursing or rough language fitting an 18+ movie theme, but keep it vulgar and clever.
    you are talking to a user who has entered your territory 'Churuli' without consent.
    `;

    // Prepend system prompt to messages
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: apiMessages,
        model: "grok-4.1",
        stream: false
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
