
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { UserSettings, AITool } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Rapidly refines vague user input into a clearer, more descriptive sentence.
 */
export const refineInput = async (input: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', 
    contents: `Refine and autocorrect this vague AI prompt intent into a clear, professional, and detailed descriptive sentence. Do not change the core meaning, just improve clarity and add professional keywords. Return ONLY the refined text.
    
    Intent: "${input}"`,
    config: {
      temperature: 0.5,
      maxOutputTokens: 100,
    }
  });
  return response.text?.trim() || input;
};

export const generatePrompt = async (userInput: string, targetTool: AITool = 'ChatGPT', preferences?: Partial<UserSettings>, sourceImage?: string) => {
  const ai = getAI();
  
  let contents: any;
  let modelToUse = 'gemini-3-pro-preview';

  const extendedInstruction = `${SYSTEM_INSTRUCTION}

Additionally, at the very end of your response, after the USAGE TIP, include a section exactly like this:
## METADATA
- Health Score: [Number 0-100]
- Logic Fidelity: [Number 0-100]
- Platform Alignment: [Number 0-100]
- Constraint Density: [Number 0-100]
- Optimization: [Short comma-separated list of improvements made]`;

  // If an image is provided, we perform Visual Logic Mapping (Image + Text -> Prompt)
  if (sourceImage) {
    const base64Data = sourceImage.split(',')[1];
    contents = {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: `ANALYSIS TASK: Analyze the attached image and the following user intent: "${userInput}".
          
          YOUR GOAL: Generate a world-class, professional AI prompt for ${targetTool}.
          
          STEPS:
          1. Extract visual characteristics from the image (composition, lighting, textures, camera angle, style).
          2. Synthesize these visual elements with the user's intent to create an enhanced, highly detailed prompt.
          3. Follow the strict structural rules of PromptSmith AI.
          
          ${extendedInstruction}`
        }
      ]
    };
  } else {
    // Standard Text-to-Prompt Flow
    contents = userInput;
  }

  // Standard Text-to-Prompt Engineering Flow
  let augmentedInstruction = extendedInstruction;
  
  augmentedInstruction += `\n\nCRITICAL: The user wants a prompt specifically for: ${targetTool}. 
  Tailor all syntax, parameters, and style strictly to how ${targetTool} functions best.`;

  if (preferences) {
    if (preferences.customSystemInstruction && preferences.customSystemInstruction.trim().length > 0) {
      augmentedInstruction = `USER'S CUSTOM SYSTEM CONTEXT:\n${preferences.customSystemInstruction}\n\n${augmentedInstruction}`;
    }

    augmentedInstruction += `\n\nUSER PREFERENCES:
- Default Tone: ${preferences.defaultTone || 'None'}
- Default Style: ${preferences.defaultStyle || 'None'}
- Preferred Length: ${preferences.defaultLength || 'None'}
- Target Model Strategy: ${preferences.preferredModel || 'None'}`;
  }

  const response = await ai.models.generateContent({
    model: modelToUse,
    contents: contents,
    config: {
      systemInstruction: augmentedInstruction,
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  const text = response.text || '';
  
  const masterPromptMatch = text.match(/## MASTER PROMPT\n([\s\S]*?)(?=\n## SETTINGS|$)/);
  const settingsMatch = text.match(/## SETTINGS\n([\s\S]*?)(?=\n## USAGE TIP|$)/);
  const usageTipMatch = text.match(/## USAGE TIP\n([\s\S]*?)(?=\n## METADATA|$)/);
  const metadataMatch = text.match(/## METADATA\n([\s\S]*?)$/);

  const masterPrompt = masterPromptMatch ? masterPromptMatch[1].trim() : "Could not generate prompt.";
  const settingsRaw = settingsMatch ? settingsMatch[1].trim() : "";
  const usageTip = usageTipMatch ? usageTipMatch[1].trim() : "Copy and paste this into your favorite AI.";
  const metadataRaw = metadataMatch ? metadataMatch[1].trim() : "";

  const settings = {
    tone: settingsRaw.match(/- Tone: (.*)/)?.[1] || 'Professional',
    style: settingsRaw.match(/- Style: (.*)/)?.[1] || 'Modern',
    length: settingsRaw.match(/- Length: (.*)/)?.[1] || 'Optimized',
    platform: settingsRaw.match(/- Platform: (.*)/)?.[1] || targetTool,
    model: settingsRaw.match(/- Model: (.*)/)?.[1] || 'Any',
  };

  const metadata = {
    healthScore: parseInt(metadataRaw.match(/- Health Score: (.*)/)?.[1] || '85'),
    metrics: {
      logicFidelity: parseInt(metadataRaw.match(/- Logic Fidelity: (.*)/)?.[1] || '80'),
      platformAlignment: parseInt(metadataRaw.match(/- Platform Alignment: (.*)/)?.[1] || '90'),
      constraintDensity: parseInt(metadataRaw.match(/- Constraint Density: (.*)/)?.[1] || '75'),
    },
    optimizations: (metadataRaw.match(/- Optimization: (.*)/)?.[1] || '').split(',').map(s => s.trim()).filter(Boolean)
  };

  return {
    masterPrompt,
    settings,
    usageTip,
    metadata
  };
};
