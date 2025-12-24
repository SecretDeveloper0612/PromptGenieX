
export interface GeneratedPrompt {
  id: string;
  originalInput: string;
  masterPrompt: string;
  settings: {
    tone: string;
    style: string;
    length: string;
    platform: string;
    model: string;
  };
  metadata?: {
    healthScore: number;
    metrics: {
      logicFidelity: number;
      platformAlignment: number;
      constraintDensity: number;
    };
    optimizations: string[];
  };
  usageTip: string;
  isFrozen?: boolean;
  timestamp: number;
  category: string;
}

export type Category =
  | 'General'
  | 'Image'
  | 'Video'
  | 'Code'
  | 'Marketing'
  | 'UI/UX'
  | 'Social Media'
  | 'Business'
  | 'Voice'
  | 'Logo'
  | 'Audio';

export type AITool =
  | 'ChatGPT'
  | 'Gemini'
  | 'Claude'
  | 'Midjourney'
  | 'DALL-E'
  | 'Sora'
  | 'Runway'
  | 'Stable Diffusion'
  | 'ElevenLabs'
  | 'Sunno';

export interface UserTemplate {
  id: string;
  title: string;
  intent: string;
  targetTool: AITool;
  category: Category;
  tone: string;
  timestamp: number;
}

export interface TonePreset {
  id: string;
  name: string;
  description: string;
}

export interface UserSettings {
  name: string;
  email: string;
  theme: 'light' | 'dark';
  defaultTone: string;
  defaultStyle: string;
  defaultLength: string;
  preferredModel: string;
  notificationsEnabled: boolean;
  notifyPatternUpdates: boolean;
  notifyAccountActivity: boolean;
  notifyPromptPerformance: boolean;
  notifyMarketingStrategy: boolean;
  customSystemInstruction: string;
  tonePresets: TonePreset[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
}
