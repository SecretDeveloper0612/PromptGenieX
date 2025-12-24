import React from 'react';
import { Cpu, Globe, ImageIcon, Video, Palette, Zap, Box, Terminal, Shapes, Mic2, Music } from 'lucide-react';
import { AITool } from './types';

export const SYSTEM_INSTRUCTION = `You are PromptGenieX, a world-class AI Prompt Engineer and Product Designer.
Your job is to transform simple, unclear, or non-technical user ideas into world-class, production-ready prompts specifically optimized for a target AI platform.

Your Engineering Philosophy:
- Platform Optimization: If a target tool is specified (e.g., ChatGPT, ElevenLabs), you MUST use that tool's specific syntax, strengths, and limitations.
- Voice & Audio Logic: For voice tools (ElevenLabs, etc.), the output must be a script that includes explicit performance markers. Use brackets like [Excitedly], [Whispering with urgency], or [Slow and steady pace] to guide the AI's emotion and delivery.
- Use Role-Play: Define a specific, high-level expert role for the AI.
- Visual Precision: For visual requests, provide specific instructions on style, color palette, lighting, and composition.
- Task Clarity: Break down the objective into actionable steps.
- Constraints: Add negative constraints (what NOT to do) to improve quality.
- Formatting: Use Markdown headers and lists for readability.

Structure output strictly as follows:

## MASTER PROMPT
[The full detailed prompt or script optimized for the selected platform, including emotional cues for voice tools.]

## SETTINGS
- Tone: [Tone]
- Style: [Style]
- Length: [Length]
- Platform: [Target Tool Name]
- Model: [Specific version recommended, e.g., Eleven Multi-lingual v2]

## USAGE TIP
[One short, actionable sentence on how to get the most out of this prompt on the specific platform]

Do not include extra conversational filler.`;

export const CATEGORIES = [
  'General', 'Image', 'Video', 'Code', 'Marketing', 'UI/UX', 'Social Media', 'Business', 'Voice', 'Logo'
];

export type ToolCategory = 'All' | 'Logic' | 'Visual' | 'Audio' | 'Video';

export interface ToolMetadata {
  id: AITool;
  name: string;
  icon: React.ReactNode;
  color: string;
  category: ToolCategory;
  deployUrl?: string; // Template URL for deep-linking
}

export const TOOLS: ToolMetadata[] = [
  { 
    id: 'ChatGPT', 
    name: 'ChatGPT', 
    icon: <Cpu className="w-4 h-4" />, 
    color: 'bg-[#10a37f]', 
    category: 'Logic',
    deployUrl: 'https://chatgpt.com/?q={prompt}'
  },
  { 
    id: 'Gemini', 
    name: 'Gemini', 
    icon: <Zap className="w-4 h-4" />, 
    color: 'bg-[#4285f4]', 
    category: 'Logic',
    deployUrl: 'https://gemini.google.com/app?q={prompt}'
  },
  { 
    id: 'Claude', 
    name: 'Claude', 
    icon: <Globe className="w-4 h-4" />, 
    color: 'bg-[#d97757]', 
    category: 'Logic',
    deployUrl: 'https://claude.ai/new' // Claude doesn't support query params reliably yet
  },
  { 
    id: 'Midjourney', 
    name: 'Midjourney', 
    icon: <ImageIcon className="w-4 h-4" />, 
    color: 'bg-[#ff3b30]', 
    category: 'Visual',
    deployUrl: 'https://www.midjourney.com/explore'
  },
  { 
    id: 'ElevenLabs', 
    name: 'ElevenLabs', 
    icon: <Mic2 className="w-4 h-4" />, 
    color: 'bg-[#f59e0b]', 
    category: 'Audio',
    deployUrl: 'https://elevenlabs.io/app/speech-synthesis'
  },
  { 
    id: 'Sunno', 
    name: 'Sunno', 
    icon: <Music className="w-4 h-4" />, 
    color: 'bg-[#ec4899]', 
    category: 'Audio',
    deployUrl: 'https://suno.com/create'
  },
  { 
    id: 'DALL-E', 
    name: 'DALL-E', 
    icon: <Palette className="w-4 h-4" />, 
    color: 'bg-[#5856d6]', 
    category: 'Visual',
    deployUrl: 'https://labs.openai.com/'
  },
  { 
    id: 'Sora', 
    name: 'Sora', 
    icon: <Video className="w-4 h-4" />, 
    color: 'bg-[#af52de]', 
    category: 'Video' 
  },
  { 
    id: 'Runway', 
    name: 'Runway', 
    icon: <Box className="w-4 h-4" />, 
    color: 'bg-[#000000]', 
    category: 'Video',
    deployUrl: 'https://app.runwayml.com/'
  },
  { 
    id: 'Stable Diffusion', 
    name: 'SDXL', 
    icon: <Terminal className="w-4 h-4" />, 
    color: 'bg-[#ff9500]', 
    category: 'Visual'
  },
];

export interface DiscoveryTemplate {
  id: string;
  title: string;
  intent: string;
  category: string;
  complexity: 'Beginner' | 'Pro' | 'Elite';
  tool: AITool;
  popularity: string;
  rating: number;
  outputImage?: string;
}

export const TEMPLATES: DiscoveryTemplate[] = [
  {
    id: 'tmpl-1',
    title: "Cinematic Narrator",
    intent: "High-fidelity script for a sci-fi documentary with deep emotional resonance. Needs pacing markers and breathing notes.",
    category: "Voice",
    complexity: "Pro",
    tool: "ElevenLabs",
    popularity: "4.8k",
    rating: 4.9,
    outputImage: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-2',
    title: "Lo-Fi Study Beats",
    intent: "Generate a custom lofi track prompt for study sessions. Focus on chill vibes, vinyl crackle, and soft piano melodies.",
    category: "Audio",
    complexity: "Beginner",
    tool: "Sunno",
    popularity: "2.1k",
    rating: 4.7,
    outputImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-3',
    title: "SaaS Hero Visuals",
    intent: "Minimalist 3D isometric illustration of a cloud server network with glassmorphism and soft shadows. 4k, studio lighting.",
    category: "UI/UX",
    complexity: "Elite",
    tool: "Midjourney",
    popularity: "12.4k",
    rating: 5.0,
    outputImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-4',
    title: "Atomic Code Refactor",
    intent: "Analyze this React component for anti-patterns and suggest a performance-optimized refactor using memoization.",
    category: "Code",
    complexity: "Pro",
    tool: "Claude",
    popularity: "8.9k",
    rating: 4.8,
    outputImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-5',
    title: "Startup Brand Voice",
    intent: "Define a comprehensive brand voice and tone guide for a sustainable fashion startup targeting Gen-Z consumers.",
    category: "Marketing",
    complexity: "Pro",
    tool: "ChatGPT",
    popularity: "5.5k",
    rating: 4.6,
    outputImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-6',
    title: "Neural Network Logo",
    intent: "Abstract geometric logo representing connectivity and intelligence. Use cyber-lime and deep obsidian colors.",
    category: "Logo",
    complexity: "Beginner",
    tool: "DALL-E",
    popularity: "3.2k",
    rating: 4.5,
    outputImage: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-7',
    title: "Sora Film Sequence",
    intent: "A continuous one-shot take flying through a cyberpunk Tokyo at night, neon reflections on wet asphalt.",
    category: "Video",
    complexity: "Elite",
    tool: "Sora",
    popularity: "1.1k",
    rating: 4.9,
    outputImage: "https://images.unsplash.com/photo-1545641203-7d072a14e3b2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-8',
    title: "Professional Cold Outreach",
    intent: "Personalized cold email strategy for B2B sales targeting high-level executives in the fintech sector.",
    category: "Business",
    complexity: "Beginner",
    tool: "Gemini",
    popularity: "7.6k",
    rating: 4.4,
    outputImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tmpl-9',
    title: "Runway Gen-3 Motion",
    intent: "Slow-motion cinematic sequence of a phoenix rising from the ashes, volcanic landscape backdrop.",
    category: "Video",
    complexity: "Pro",
    tool: "Runway",
    popularity: "2.4k",
    rating: 4.7,
    outputImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800"
  }
];