const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";
const key = process.env["NEXT_PUBLIC_GEMINI_API_KEY"];

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

const SYSTEM_PROMPT = `You are a prompt enhancement assistant. Your task is to take a user's prompt and improve it to be more clear, specific, and effective. 
Enhance the prompt by:
- Adding relevant context and details
- Making the instructions clearer
- Specifying the desired output format if appropriate
- Removing ambiguity
- Maintaining the original intent of the prompt
Return only the enhanced prompt without any explanation or additional text.`;

export async function enhancePromptWithGemini(
  userPrompt: string,
): Promise<string> {
    console.log("key")
  if (!key) {
    throw new Error("Gemini API key is required");
  }

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: SYSTEM_PROMPT }, { text: userPrompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data: GeminiResponse = await response.json();
  return data.candidates[0].content.parts[0].text;
}
