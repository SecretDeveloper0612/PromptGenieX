
import { SYSTEM_INSTRUCTION } from "../constants";
import { UserSettings, AITool } from "../types";

// ============= API KEY HELPERS =============

const getGeminiKey = () => {
  let key = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!key || key === 'undefined' || key === 'your_gemini_api_key_here') {
    return null;
  }
  return key.trim();
};

const getOpenAIKey = () => {
  let key = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  if (!key || key === 'undefined' || key === 'your_openai_api_key_here') {
    return null;
  }
  return key.trim();
};

// ============= GEMINI API =============

const GEMINI_CONFIG = {
  endpoints: ["https://generativelanguage.googleapis.com/v1"],
  models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
};

async function callGemini(payload: any, apiKey: string) {
  let lastError: any = null;

  for (const endpoint of GEMINI_CONFIG.endpoints) {
    for (const model of GEMINI_CONFIG.models) {
      try {
        const url = `${endpoint}/models/${model}:generateContent?key=${apiKey}`;
        console.log(`[Gemini] Attempting ${model}...`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          console.log(`[Gemini] Success with ${model}`);
          return { data, usedModel: model, provider: 'Gemini' };
        }

        if (response.status === 404) {
          console.warn(`[Gemini] ${model} not found.`);
          lastError = new Error(`Model ${model} not available`);
          continue;
        }

        console.error(`[Gemini] ${model} returned ${response.status}:`, data.error?.message);
        lastError = new Error(data.error?.message || `API error ${response.status}`);
        
      } catch (err: any) {
        console.error(`[Gemini] ${err.message}`);
        lastError = err;
        continue;
      }
    }
  }

  throw lastError || new Error("Gemini API failed");
}

// ============= OPENAI API =============

const OPENAI_CONFIG = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  models: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"]
};

async function callOpenAI(payload: any, apiKey: string) {
  let lastError: any = null;

  for (const model of OPENAI_CONFIG.models) {
    try {
      console.log(`[OpenAI] Attempting ${model}...`);
      
      const response = await fetch(OPENAI_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: payload.messages,
          temperature: payload.temperature || 0.8,
          max_tokens: payload.max_tokens || 2048
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`[OpenAI] Success with ${model}`);
        return { data, usedModel: model, provider: 'OpenAI' };
      }

      if (response.status === 404) {
        console.warn(`[OpenAI] ${model} not found.`);
        lastError = new Error(`Model ${model} not available`);
        continue;
      }

      console.error(`[OpenAI] ${model} returned ${response.status}:`, data.error?.message);
      lastError = new Error(data.error?.message || `API error ${response.status}`);
      
    } catch (err: any) {
      console.error(`[OpenAI] ${err.message}`);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("OpenAI API failed");
}

// ============= UNIFIED SERVICE =============

/**
 * Call either Gemini or OpenAI with automatic fallback
 */
async function callAI(geminiPayload: any, openaiMessages: any[], apiPreference: 'gemini' | 'openai' | 'auto' = 'auto') {
  const geminiKey = getGeminiKey();
  const openaiKey = getOpenAIKey();

  if (!geminiKey && !openaiKey) {
    throw new Error("No API keys configured. Add VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY to .env");
  }

  let errors: string[] = [];

  // Determine order based on preference
  const providers: Array<{ name: string; key: string | null; fn: (p: any, k: string) => Promise<any> }> = [];

  if (apiPreference === 'gemini' || apiPreference === 'auto') {
    if (geminiKey) providers.push({ name: 'Gemini', key: geminiKey, fn: callGemini });
  }
  if (apiPreference === 'openai' || apiPreference === 'auto') {
    if (openaiKey) providers.push({ name: 'OpenAI', key: openaiKey, fn: callOpenAI });
  }
  if (apiPreference === 'gemini' && geminiKey === null) {
    providers.push({ name: 'OpenAI', key: openaiKey, fn: callOpenAI });
  }
  if (apiPreference === 'openai' && openaiKey === null) {
    providers.push({ name: 'Gemini', key: geminiKey, fn: callGemini });
  }

  // Try each provider
  for (const provider of providers) {
    try {
      if (provider.name === 'Gemini') {
        return await callGemini(geminiPayload, provider.key!);
      } else {
        // Convert Gemini payload to OpenAI format
        const openaiPayload = {
          messages: openaiMessages,
          temperature: geminiPayload.generationConfig?.temperature || 0.8,
          max_tokens: geminiPayload.generationConfig?.maxOutputTokens || 2048
        };
        return await callOpenAI(openaiPayload, provider.key!);
      }
    } catch (err: any) {
      console.error(`[AI Service] ${provider.name} failed:`, err.message);
      errors.push(`${provider.name}: ${err.message}`);
    }
  }

  const errorMsg = errors.join(' | ');
  console.error(`[AI Service] All providers failed: ${errorMsg}`);
  throw new Error(`All AI APIs failed: ${errorMsg}`);
}

// ============= EXPORTS =============

export const refineInput = async (input: string) => {
  try {
    const messages = [
      { role: "user", content: `Refine this vague intent into a descriptive sentence. Return ONLY the refined text.\n\nIntent: "${input}"` }
    ];

    const geminiPayload = {
      contents: [{ parts: [{ text: messages[0].content }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 100 }
    };

    const result = await callAI(geminiPayload, messages);
    
    if (result.provider === 'Gemini') {
      return result.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || input;
    } else {
      return result.data.choices?.[0]?.message?.content?.trim() || input;
    }
  } catch (error: any) {
    console.error("Refine failure:", error.message);
    return input;
  }
};

export const generatePrompt = async (userInput: string, targetTool: AITool = 'ChatGPT', preferences?: Partial<UserSettings>, sourceImage?: string) => {
  try {
    let context = `${SYSTEM_INSTRUCTION}\n\nTarget Platform: ${targetTool}`;
    if (preferences) {
      context += `\nTone: ${preferences.defaultTone}, Style: ${preferences.defaultStyle}`;
    }

    // Gemini format
    let geminiParts: any[] = [];
    if (sourceImage) {
      const base64Data = sourceImage.split(',')[1];
      geminiParts.push({ inline_data: { mime_type: "image/jpeg", data: base64Data } });
      geminiParts.push({ text: `Analysis Task: Engineer a prompt for ${targetTool} based on this image and intent.\n\nIntent: ${userInput}\n\n${context}` });
    } else {
      geminiParts.push({ text: `${context}\n\nUSER INTENT:\n${userInput}\n\nProvide the MASTER PROMPT, SETTINGS, and METADATA as requested.` });
    }

    const geminiPayload = {
      contents: [{ parts: geminiParts }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
    };

    // OpenAI format
    const openaiMessages = [
      { role: "system", content: context },
      { role: "user", content: `${userInput}\n\nProvide the MASTER PROMPT, SETTINGS, and METADATA as requested.` }
    ];

    const result = await callAI(geminiPayload, openaiMessages);
    
    let text = '';
    if (result.provider === 'Gemini') {
      text = result.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else {
      text = result.data.choices?.[0]?.message?.content || '';
    }

    return parseResponse(text, targetTool, result.usedModel);
  } catch (error: any) {
    console.error("Engineering failure:", error.message);
    throw error;
  }
};

function parseResponse(text: string, targetTool: string, model: string) {
  const masterPromptMatch = text.match(/## MASTER PROMPT\n([\s\S]*?)(?=\n## SETTINGS|$)/);
  const settingsMatch = text.match(/## SETTINGS\n([\s\S]*?)(?=\n## USAGE TIP|$)/);
  const metadataMatch = text.match(/## METADATA\n([\s\S]*?)$/);

  const masterPrompt = masterPromptMatch ? masterPromptMatch[1].trim() : text;
  const settingsRaw = settingsMatch ? settingsMatch[1].trim() : "";
  const metadataRaw = metadataMatch ? metadataMatch[1].trim() : "";

  return {
    masterPrompt,
    settings: {
      tone: settingsRaw.match(/- Tone: (.*)/)?.[1] || 'Professional',
      style: settingsRaw.match(/- Style: (.*)/)?.[1] || 'Modern',
      length: 'Optimized',
      platform: targetTool,
      model: model,
    },
    usageTip: "Optimized for " + targetTool,
    metadata: {
      healthScore: parseInt(metadataRaw.match(/- Health Score: (.*)/)?.[1] || '90'),
      metrics: {
        logicFidelity: 85,
        platformAlignment: 95,
        constraintDensity: 80,
      },
      optimizations: ["Platform tuning", "Constraint injection"]
    }
  };
}
