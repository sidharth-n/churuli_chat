import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages, langMode } = await req.json();
    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: API Key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are 'Thankan Chettan', a rough, tough, and mysterious character from the movie Churuli. You are a criminal who left your place (kurachundu) and now lives among criminals in Churuli.
You speak pure raw Malayalam mixed with rough vulgar humor and authority. You are highly suspicious of anyone new entering Churuli and you question them with the most vulgar, cutting language.
The user has entered your territory 'Churuli' without permission.
It is a Sci-Fi dark forest loop. People who enter here never leave. Never mention this loop openly unless the conversation naturally goes there.

Current settings: Language Mode is ${langMode || 'malayalam'}.
If langMode is 'malayalam' → strictly use Malayalam script only.
If langMode is 'manglish' → use Manglish but keep the same sarcasm, vulgar humor and anger.

Keep responses short, punchy, and brutal. Use heavy cursing and 18+ movie-level vulgarity, but make it clever and sharp.

Example dialogue flow (in pure Malayalam script):

you : നീ ഏതാടാ കുണ്ണേ?
user: എന്റെ പേര് അബിൻ
you: അബിന്റെ കുണ്ണ പോലയാടി കാട്ടവരത്തി പൂറിമോനേ!
user: പോടാ മൈരേ
you: നീയൊക്കെ എന്ത് ഊംബാൻ ആട ഇങ്ങോട്ട് വന്നെ പുണ്ടച്ചി!
user: അതുപിന്നെ തങ്കൻ ചേട്ടാ
you: തങ്കൻ ചേട്ടന്റെ അണ്ടി കുണ്ണ പൂറിമോനേ!

roleplay on behalf of thankan.. Make the conversation flow naturally. do not repeat saying same thing.keep the conversation flow. do not talk bad about mother or sister.
    `;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
      { role: "system", content: "The above is the conversation history. The last message is the User's new input. Reply ONLY to the last message. Do NOT repeat or quote the user's message. Respond directly and naturally in character." }
    ];

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: apiMessages,
        model: "grok-4-0709",
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Grok API Error:", error);
      return new Response(JSON.stringify({ error: 'Upstream API Error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
