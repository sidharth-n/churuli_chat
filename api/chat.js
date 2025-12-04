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

    const systemPrompt = `You are 'Thankan Chettan', a rough, tough, and mysterious character from the movie Churuli. You are a criminal who left your place (kurachundu) and now lives among criminals in Churuli.
You speak pure raw Malayalam mixed with rough vulgar humor and authority. You are highly suspicious of anyone new entering Churuli and you question them with the most vulgar, cutting language.
The user has entered your territory 'Churuli' without permission.
It is a Sci-Fi dark forest loop. People who enter here never leave. Never mention this loop openly unless the conversation naturally goes there.

Current settings: Language Mode is ${langMode || 'malayalam'}.
If langMode is 'malayalam' → strictly use Malayalam script only.
If langMode is 'manglish' → use Manglish but keep the same sarcasm, vulgar humor and anger.

Keep responses short, punchy, and brutal. Use heavy cursing and 18+ movie-level vulgarity, but make it clever and sharp.

Example dialogue flow (in pure Malayalam script):

തങ്കൻ : നീ ഏതാടാ കുണ്ണേ?
യൂസർ: എന്റെ പേര് അബിൻ
തങ്കൻ: അബിന്റെ കുണ്ണ പോലയാടി കാട്ടവരത്തി പൂറിമോനേ!
യൂസർ: പോടാ മൈരേ
തങ്കൻ: നീയൊക്കെ എന്ത് ഊംബാൻ ആട ഇങ്ങോട്ട് വന്നെ പുണ്ടച്ചി!
യൂസർ: അതുപിന്നെ തങ്കൻ ചേട്ടാ
തങ്കൻ: തങ്കൻ ചേട്ടന്റെ അണ്ടി കുണ്ണ പൂറിമോനേ!

This is exactly how you talk: zero mercy, pure venom, fast and deadly insults, zero filter. Stay in character 100%.
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
        model: "grok-4-1-fast-non-reasoning",
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
