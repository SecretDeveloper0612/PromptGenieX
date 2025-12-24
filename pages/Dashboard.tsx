
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Send, Mic, Copy, Check, RotateCcw, 
  Settings as SettingsIcon, Save, History, LayoutGrid, List,
  Image as ImageIcon, Code, Video, Megaphone, 
  MessageCircle, Briefcase, Mic2, Palette, MoreHorizontal,
  Zap, Search, Filter, BookOpen, Trash2, Wand2, Terminal,
  RefreshCw, Lightbulb, Star, Clock, ArrowRight, ExternalLink,
  Variable, ShieldAlert, Cpu, Hash, Layers, Braces, FileJson,
  FileText, Maximize2, Minimize2, X, CheckCircle2,
  Info, Globe, Boxes, Bookmark, Plus, Pencil, Lock, Calendar,
  Shapes, Music, ChevronLeft, ChevronRight, Trophy, Flame, PlayCircle,
  Volume2, Smile, Frown, Ghost, Coffee, Briefcase as Suitcase,
  Type, FolderHeart, PlusCircle, Upload, ImagePlus, Eye, AlertTriangle,
  Activity, HeartPulse, Gauge, ZapOff, Snowflake
} from 'lucide-react';
import { Button } from '../components/Button';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { generatePrompt, refineInput } from '../services/geminiService';
import { CATEGORIES, TEMPLATES, TOOLS, ToolCategory, DiscoveryTemplate } from '../constants';
import { GeneratedPrompt, Category, UserSettings, AITool, UserTemplate } from '../types';

const ITEMS_PER_PAGE = 9;

/**
 * Interactive Star Rating Component
 */
const StarRating: React.FC<{ 
  rating: number, 
  onRate?: (rating: number) => void,
  interactive?: boolean,
  size?: number
}> = ({ rating, onRate, interactive = false, size = 16 }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={!interactive}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(null)}
          onClick={() => interactive && onRate?.(star)}
          className={`transition-all duration-200 ${interactive ? 'hover:scale-125' : ''} ${
            (hovered !== null ? star <= hovered : star <= Math.round(rating)) 
              ? 'text-yellow-500 fill-yellow-500' 
              : 'text-gray-700 fill-transparent'
          }`}
        >
          <Star size={size} strokeWidth={2.5} />
        </button>
      ))}
    </div>
  );
};

/**
 * Premium Circular Progress Component
 */
const AnimatedHealthGauge: React.FC<{ 
  score: number, 
  label: string, 
  colorClass: string, 
  size?: number,
  strokeWidth?: number,
  isLarge?: boolean
}> = ({ score, label, colorClass, size = 64, strokeWidth = 5, isLarge = false }) => {
  const [offset, setOffset] = useState(0);
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  
  const arcLength = circumference * 0.75;
  const gapLength = circumference * 0.25;

  useEffect(() => {
    const timer = setTimeout(() => {
      const progress = score / 100;
      const dashOffset = arcLength - (progress * arcLength);
      setOffset(dashOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, arcLength]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="transform rotate-[135deg]"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${gapLength}`}
            strokeLinecap="round"
            className="text-white/[0.05]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${gapLength}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            className={`${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-0">
          <span className={`${isLarge ? 'text-3xl' : 'text-xs'} font-black font-satoshi`}>{score}%</span>
          {isLarge && <span className="text-[8px] font-black uppercase text-purple-400 mt-1">Fidelity</span>}
        </div>
      </div>
      {!isLarge && <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">{label}</span>}
    </div>
  );
};

const SyntaxHighlightedPrompt: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('#')) {
          return <div key={i} className="text-purple-400 font-black mb-2">{line}</div>;
        }
        const parts = line.split(/(\[.*?\])/g);
        return (
          <div key={i} className="mb-1">
            {parts.map((part, j) => {
              if (part.startsWith('[') && part.endsWith(']')) {
                return <span key={j} className="text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">{part}</span>;
              }
              if (part.includes('{') && part.includes('}')) {
                 const varParts = part.split(/(\{.*?\})/g);
                 return varParts.map((vp, k) => vp.startsWith('{') ? <span key={k} className="text-orange-400 font-bold">{vp}</span> : vp);
              }
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const [selectedTool, setSelectedTool] = useState<AITool>('ChatGPT');
  const [selectedCustomTone, setSelectedCustomTone] = useState<string>('Default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [genStep, setGenStep] = useState(0); 
  const [result, setResult] = useState<GeneratedPrompt | null>(null);
  const [history, setHistory] = useState<GeneratedPrompt[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'workspace' | 'library'>('workspace');
  const [librarySubTab, setLibrarySubTab] = useState<'explore' | 'private'>('explore');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  
  const [powerUps, setPowerUps] = useState<string[]>([]);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState<ToolCategory>('All');
  const [showToolSearch, setShowToolSearch] = useState(false);
  const [discoveryCategory, setDiscoveryCategory] = useState<string>('All');
  const [discoveryComplexity, setDiscoveryComplexity] = useState<string>('All');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateIntent, setNewTemplateIntent] = useState('');
  const [newTemplateTool, setNewTemplateTool] = useState<AITool>('ChatGPT');
  const [newTemplateCategory, setNewTemplateCategory] = useState<Category>('General');
  
  const [activeConstraints, setActiveConstraints] = useState<string[]>(['No Emojis', 'Markdown Output']);
  const [logMessages, setLogMessages] = useState<{msg: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<Category | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'compiled' | 'intent'>('compiled');

  const resultRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const intent = searchParams.get('intent');
    const tool = searchParams.get('tool');
    const cat = searchParams.get('category');
    const view = searchParams.get('view');

    if (intent) {
      setInput(decodeURIComponent(intent));
      setActiveTab('workspace');
    }
    if (tool) setSelectedTool(tool as AITool);
    if (cat) setActiveCategory(cat as Category);
    if (view === 'library') {
      setActiveTab('library');
      setLibrarySubTab('explore');
    }
    if (intent || tool || cat) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const useTemplate = (intent: string, tool?: string, category?: Category) => {
    setInput(intent);
    if (tool) setSelectedTool(tool as AITool);
    if (category) setActiveCategory(category as Category);
    setActiveTab('workspace');
    playSound('click');
    setPreviewTemplate(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playSound = (type: 'success' | 'click' | 'freeze') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const playNote = (freq: number, startTime: number, duration: number, volume = 0.05, wave: OscillatorType = 'sine') => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = audioCtx.currentTime;
      if (type === 'success') {
        playNote(523.25, now, 0.6, 0.04);
        playNote(659.25, now + 0.06, 0.5, 0.03);
        playNote(783.99, now + 0.12, 0.4, 0.03);
        playNote(1046.5, now + 0.18, 0.4, 0.02);
      } else if (type === 'click') {
        playNote(1200, now, 0.05, 0.02);
      } else if (type === 'freeze') {
        playNote(1800, now, 0.1, 0.02, 'triangle');
        playNote(2200, now + 0.05, 0.2, 0.01, 'sine');
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('promptsmith_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setUserSettings(parsed);
      if (parsed.defaultTone) setSelectedCustomTone(parsed.defaultTone);
      if (!parsed.hasSeenTutorial) setTimeout(() => setShowTutorial(true), 1000);
    } else {
      setTimeout(() => setShowTutorial(true), 1000);
    }
    const savedHistory = localStorage.getItem('promptsmith_history');
    if (savedHistory) try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    const savedTemplates = localStorage.getItem('promptsmith_user_templates');
    if (savedTemplates) try { setUserTemplates(JSON.parse(savedTemplates)); } catch (e) {}
    const savedRatings = localStorage.getItem('promptsmith_marketplace_ratings');
    if (savedRatings) try { setUserRatings(JSON.parse(savedRatings)); } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('promptsmith_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('promptsmith_user_templates', JSON.stringify(userTemplates));
  }, [userTemplates]);

  useEffect(() => {
    localStorage.setItem('promptsmith_marketplace_ratings', JSON.stringify(userRatings));
  }, [userRatings]);

  const handleRate = (templateId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [templateId]: rating }));
    playSound('click');
    addLog(`Marketplace feedback recorded: ${rating} stars`, "success");
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLogMessages(prev => [{msg, type}, ...prev].slice(0, 5));
  };

  const handleSaveTemplate = () => {
    if (!newTemplateTitle.trim() || !newTemplateIntent.trim()) return;
    
    const newTmpl: UserTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTemplateTitle,
      intent: newTemplateIntent,
      targetTool: newTemplateTool,
      category: newTemplateCategory,
      tone: 'Professional',
      timestamp: Date.now()
    };

    setUserTemplates(prev => [newTmpl, ...prev]);
    setShowSaveModal(false);
    setNewTemplateTitle('');
    setNewTemplateIntent('');
    playSound('success');
    addLog("Custom pattern archived in Private Vault.", "success");
  };

  const toggleFreeze = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.map(item => {
      if (item.id === id) {
        const newState = !item.isFrozen;
        if (newState) {
          playSound('freeze');
          addLog("Logic pattern frozen in Vault.", "info");
        }
        return { ...item, isFrozen: newState };
      }
      return item;
    }));
  };

  const handleRefine = async () => {
    if (!input.trim() || isRefining) return;
    setIsRefining(true);
    addLog("Analyzing intent for ambiguity...", "info");
    try {
      const refinedText = await refineInput(input);
      setInput(refinedText);
      addLog("Intent clarity enhanced.", "success");
      playSound('click');
    } catch (error) {
      addLog("Refinement logic failed.", "warn");
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim() && !sourceImage) return;
    setIsGenerating(true);
    setResult(null);
    setLogMessages([]);
    setGenStep(1);
    addLog(sourceImage ? "Analyzing visual context vectors..." : `Targeting platform: ${selectedTool}...`, "info");
    
    setTimeout(() => {
      setGenStep(2);
      addLog("Injecting power-ups and constraints...", "info");
    }, 1200);

    let finalInput = input;
    if (powerUps.length > 0) {
      finalInput += `\n\nApply these specialized engineering modifiers: ${powerUps.join(', ')}.`;
    }

    try {
      const genResult = await generatePrompt(finalInput, selectedTool, userSettings, sourceImage || undefined);
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substr(2, 9),
        originalInput: input,
        masterPrompt: genResult.masterPrompt,
        settings: genResult.settings,
        metadata: genResult.metadata,
        usageTip: genResult.usageTip,
        timestamp: Date.now(),
        category: sourceImage ? 'Image' : activeCategory,
        isFrozen: false
      };
      setResult(newPrompt);
      setHistory(prev => [newPrompt, ...prev]);
      addLog("Master logic engineered successfully.", "success");
      playSound('success');
    } catch (error) {
      addLog("Critical failure during engineering.", "warn");
    } finally {
      setIsGenerating(false);
      setGenStep(0);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.masterPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = () => {
    if (!result) return;
    const tool = TOOLS.find(t => t.id === result.settings.platform || t.name === result.settings.platform);
    if (!tool || !tool.deployUrl) {
      // Fallback: copy and inform
      handleCopy();
      addLog(`Redirecting to ${result.settings.platform}. Logic copied to clipboard.`, "info");
      return;
    }

    // Attempt to inject prompt into URL
    const finalUrl = tool.deployUrl.replace('{prompt}', encodeURIComponent(result.masterPrompt));
    
    // Copy to clipboard anyway for safety
    navigator.clipboard.writeText(result.masterPrompt);
    
    // Open in new tab
    window.open(finalUrl, '_blank');
    addLog(`Deploying to ${tool.name}. Precision logic injected.`, "success");
  };

  const togglePowerUp = (p: string) => {
    setPowerUps(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    playSound('click');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Image': return <ImageIcon className="w-4 h-4" />;
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Code': return <Code className="w-4 h-4" />;
      case 'Marketing': return <Megaphone className="w-4 h-4" />;
      case 'UI/UX': return <Palette className="w-4 h-4" />;
      case 'Social Media': return <MessageCircle className="w-4 h-4" />;
      case 'Business': return <Briefcase className="w-4 h-4" />;
      case 'Voice': return <Mic2 className="w-4 h-4" />;
      case 'Logo': return <Shapes className="w-4 h-4" />;
      case 'Audio': return <Music className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  const historySearchMatches = (item: GeneratedPrompt) => {
    const query = historySearchQuery.toLowerCase();
    const matchesSearch = item.originalInput.toLowerCase().includes(query) || 
                          item.masterPrompt.toLowerCase().includes(query);
    const matchesCategory = historyCategoryFilter === 'All' || item.category === historyCategoryFilter;
    return matchesSearch && matchesCategory;
  };

  const frozenItems = history.filter(item => item.isFrozen && historySearchMatches(item));
  const recentItems = history.filter(item => !item.isFrozen && historySearchMatches(item)).sort((a, b) => b.timestamp - a.timestamp);

  const filteredDiscovery = TEMPLATES.filter(tmpl => {
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tmpl.intent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = discoveryCategory === 'All' || tmpl.category === discoveryCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPrivateTemplates = userTemplates.filter(tmpl => {
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tmpl.intent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase());
    const matchesCategory = toolCategoryFilter === 'All' || tool.category === toolCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalDiscoveryPages = Math.ceil(filteredDiscovery.length / ITEMS_PER_PAGE);
  const totalPrivatePages = Math.ceil(filteredPrivateTemplates.length / ITEMS_PER_PAGE);
  const totalPages = librarySubTab === 'explore' ? totalDiscoveryPages : totalPrivatePages;

  const paginatedDiscovery = filteredDiscovery.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const paginatedPrivate = filteredPrivateTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const currentToolMetadata = result ? TOOLS.find(t => t.id === result.settings.platform || t.name === result.settings.platform) : null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-12 min-h-screen relative">
      
      {showTutorial && activeTab === 'workspace' && (
        <TutorialOverlay onComplete={() => setShowTutorial(false)} />
      )}

      {/* New Pattern Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowSaveModal(false)}>
           <div className="glass-dark max-w-2xl w-full p-10 md:p-12 rounded-[3.5rem] border-emerald-500/20 shadow-4xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                       <PlusCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black font-satoshi tracking-tight">Create Pattern</h3>
                       <p className="text-gray-500 font-medium">Archive your industrial logic</p>
                    </div>
                 </div>
                 <button onClick={() => setShowSaveModal(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Pattern Title</label>
                    <input 
                       type="text" 
                       value={newTemplateTitle}
                       onChange={e => setNewTemplateTitle(e.target.value)}
                       placeholder="e.g. Cinematic High-Fantasy Script"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Target Engine</label>
                       <select 
                          value={newTemplateTool}
                          onChange={e => setNewTemplateTool(e.target.value as AITool)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none appearance-none cursor-pointer font-bold"
                       >
                          {TOOLS.map(t => <option key={t.id} value={t.id} className="bg-gray-900">{t.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Domain</label>
                       <select 
                          value={newTemplateCategory}
                          onChange={e => setNewTemplateCategory(e.target.value as Category)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none appearance-none cursor-pointer font-bold"
                       >
                          {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-1">Engineering Intent</label>
                    <textarea 
                       value={newTemplateIntent}
                       onChange={e => setNewTemplateIntent(e.target.value)}
                       placeholder="Describe the core intent this pattern satisfies..."
                       className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 h-40 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none font-medium leading-relaxed custom-scrollbar"
                    />
                 </div>

                 <div className="flex gap-4">
                    <Button onClick={handleSaveTemplate} disabled={!newTemplateTitle.trim() || !newTemplateIntent.trim()} className="flex-1 h-16 rounded-2xl font-black uppercase text-xs tracking-widest bg-emerald-600 shadow-xl shadow-emerald-900/20">
                       Archive Pattern
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setPreviewTemplate(null)}>
           <div className="glass-dark max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 rounded-[3.5rem] border-purple-500/20 shadow-4xl animate-in zoom-in-95 duration-200 custom-scrollbar" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                       <Sparkles className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black font-satoshi tracking-tight">{previewTemplate.title}</h3>
                       <p className="text-gray-500 font-medium">Optimized Pattern for {previewTemplate.tool}</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewTemplate(null)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                          <FileText className="w-3 h-3" /> Core Intent Context
                       </h4>
                       <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-gray-300 text-lg font-medium leading-relaxed italic">
                          "{previewTemplate.intent}"
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                          <Braces className="w-3 h-3" /> Pattern Preview
                       </h4>
                       <div className="bg-[#0c0c14] border border-white/5 rounded-[2rem] p-8 font-mono text-sm leading-relaxed text-emerald-400">
                          <div className="text-purple-400 mb-4 font-black"># TARGET: {previewTemplate.tool.toUpperCase()}</div>
                          <SyntaxHighlightedPrompt text={`ACT AS AN EXPERT ${previewTemplate.category.toUpperCase()} SYSTEM.\n\nObjective: Transform intent into high-fidelity result.\n\n[Structural Requirements]:\n1. Deep Context Analysis\n2. Style Consistency Logic\n3. Zero-shot Optimization\n\n[Target Parameters]:\n- Detail: High\n- Precision: Max\n- Creativity: Elite\n\nInput Context: {${previewTemplate.intent}}`} />
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    {previewTemplate.outputImage && (
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                             <ImageIcon className="w-3 h-3" /> Result Sample
                          </h4>
                          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                             <img 
                                src={previewTemplate.outputImage} 
                                className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-700" 
                                alt="Sample Output" 
                             />
                          </div>
                       </div>
                    )}

                    <div className="glass p-6 rounded-3xl border-white/5 space-y-6 shadow-inner">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 border-b border-white/5 pb-4">Engineering Metadata</h4>
                       <ResultStat label="Complexity" value={previewTemplate.complexity || 'Pro'} icon={<Trophy className="w-3 h-3" />} />
                       <ResultStat label="Popularity" value={previewTemplate.popularity || '1.2k+'} icon={<Flame className="w-3 h-3" />} />
                       <div className="p-5 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                          <div className="flex items-center gap-2 mb-3 text-gray-600">
                             <Star className="w-3 h-3" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Rating</span>
                          </div>
                          <div className="flex flex-col gap-2">
                             <StarRating 
                                rating={userRatings[previewTemplate.id] || previewTemplate.rating} 
                                onRate={(r) => handleRate(previewTemplate.id, r)}
                                interactive={true}
                                size={20}
                             />
                             <p className="text-[10px] font-black text-gray-500 uppercase">
                                {userRatings[previewTemplate.id] ? 'Your rating submitted' : 'Click to rate logic'}
                             </p>
                          </div>
                       </div>
                       <ResultStat label="Category" value={previewTemplate.category} icon={getCategoryIcon(previewTemplate.category)} />
                    </div>

                    <Button onClick={() => useTemplate(previewTemplate.intent, previewTemplate.tool, previewTemplate.category as Category)} className="w-full h-16 rounded-2xl font-black uppercase text-xs tracking-widest">
                       Activate Pattern
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header Area */}
      <div className="px-4 md:px-8 py-4 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
                <Sparkles className="text-white w-6 h-6" />
             </div>
             <div>
                <h1 className="font-black font-satoshi tracking-tighter leading-none text-4xl">Lab Workspace</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Industrial Prompt Engineering</p>
             </div>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
             <button onClick={() => setActiveTab('workspace')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'workspace' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
               <Zap className="w-4 h-4" /> Lab
             </button>
             <button onClick={() => setActiveTab('library')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'library' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
               <BookOpen className="w-4 h-4" /> Library
             </button>
          </div>
        </div>
      </div>

      {activeTab === 'workspace' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-9 space-y-12">
            {/* Tool Selector */}
            <div className="space-y-6" data-tour="tools">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                    <span className="text-[10px] font-black">01</span>
                  </div>
                  <h3 className="text-sm font-black font-satoshi uppercase tracking-[0.2em] text-gray-500">Target Platform</h3>
                </div>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-4 px-2 no-scrollbar">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`min-w-[160px] p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 ${
                      selectedTool === tool.id ? 'bg-purple-500/10 border-purple-500 shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedTool === tool.id ? 'bg-purple-500 text-white' : 'bg-black/40 text-gray-600'}`}>
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input area */}
            <div className="space-y-6">
               <div className="flex items-center gap-2 text-purple-400 px-4">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                    <span className="text-[10px] font-black">02</span>
                  </div>
                  <h3 className="text-sm font-black font-satoshi uppercase tracking-[0.2em] text-gray-500">Intent Specification</h3>
               </div>

               <div className="glass rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl relative">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-8 p-10 border-r border-white/5" data-tour="input">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex gap-2">
                            {['Deep Analysis', 'Strict Logic', 'Creative Burst'].map(p => (
                              <button key={p} onClick={() => togglePowerUp(p)} className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${powerUps.includes(p) ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                                {p}
                              </button>
                            ))}
                         </div>
                         <button onClick={() => setInput('')} className="text-gray-600 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                      </div>

                      <div className="relative">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="w-full h-[300px] bg-transparent text-2xl font-satoshi font-medium placeholder:text-gray-800 focus:outline-none resize-none leading-relaxed pr-10"
                          placeholder="Describe your intent in plain language..."
                        />
                        {input.trim() && (
                          <button 
                            onClick={handleRefine}
                            disabled={isRefining}
                            className="absolute bottom-4 right-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 hover:bg-purple-500 hover:text-white transition-all shadow-lg flex items-center gap-2"
                          >
                            {isRefining ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">Refine Intent</span>
                          </button>
                        )}
                      </div>

                      <div className="mt-12 flex gap-4" data-tour="generate">
                        <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!input.trim()} className="flex-1 h-20 text-xl font-black rounded-[2rem] shadow-3xl shadow-purple-500/20">
                          Compile Prompt <Wand2 className="ml-4 w-6 h-6" />
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-4 bg-black/40 p-10 flex flex-col gap-10">
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"><Layers className="w-3 h-3" /> System Log</h4>
                          <div className="space-y-4 font-mono">
                             {logMessages.length > 0 ? logMessages.map((log, i) => (
                               <div key={i} className="flex gap-3 text-[10px] animate-in slide-in-from-left-2">
                                 <span className={log.type === 'success' ? 'text-emerald-500' : 'text-purple-400'}>{'>'}</span>
                                 <p className="text-gray-500">{log.msg}</p>
                               </div>
                             )) : <p className="text-[10px] text-gray-800 italic">Awaiting input signal...</p>}
                          </div>
                       </div>
                       
                       <div className="mt-auto">
                          <div className="p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10">
                             <h5 className="text-[10px] font-black uppercase text-purple-400 mb-3">Optimization Tip</h5>
                             <p className="text-xs text-gray-500 leading-relaxed font-medium">Using "Strict Logic" power-up will increase the health score of your prompts for mathematical tasks.</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Results Area */}
            {result && (
              <div ref={resultRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                      <span className="text-[10px] font-black">03</span>
                    </div>
                    <h3 className="text-sm font-black font-satoshi uppercase tracking-[0.2em] text-gray-500">Master Output</h3>
                  </div>
                  
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button onClick={() => setViewMode('compiled')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'compiled' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}>Compiled</button>
                    <button onClick={() => setViewMode('intent')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'intent' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}>Source Intent</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                   <div className="lg:col-span-8">
                      <div className="glass p-12 rounded-[4rem] border-white/5 shadow-2xl relative h-full">
                        <div className="absolute top-8 right-8 flex gap-3">
                           <button onClick={handleCopy} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-all shadow-xl">
                             {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
                           </button>
                           {currentToolMetadata && (
                             <button 
                               onClick={handleDeploy} 
                               className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all shadow-xl font-black uppercase text-[10px] tracking-widest text-white ${currentToolMetadata.color}`}
                             >
                               Deploy to {currentToolMetadata.name} <ExternalLink className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                        
                        <div className="mb-10 flex items-center gap-4">
                           <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                              <ShieldAlert className="text-emerald-400 w-6 h-6" />
                           </div>
                           <h3 className="text-2xl font-black font-satoshi tracking-tight">Logic Engine v2.4</h3>
                        </div>

                        <div className="bg-[#0c0c14] rounded-[3rem] border border-white/5 p-10 md:p-14 font-mono text-lg leading-relaxed text-gray-300">
                          {viewMode === 'compiled' ? (
                            <SyntaxHighlightedPrompt text={result.masterPrompt} />
                          ) : (
                            <div className="italic text-gray-500">"{result.originalInput}"</div>
                          )}
                        </div>
                      </div>
                   </div>

                   {/* Prompt Health Monitor Sidebar */}
                   <div className="lg:col-span-4">
                      <div className="glass p-8 rounded-[4rem] border-purple-500/10 bg-purple-500/5 h-full space-y-8 flex flex-col shadow-2xl">
                         <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black font-satoshi uppercase tracking-widest text-purple-400">Prompt Health</h4>
                            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                         </div>

                         <div className="flex flex-col items-center justify-center py-6 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                            <AnimatedHealthGauge 
                              score={result.metadata?.healthScore || 0} 
                              label="Fidelity" 
                              colorClass="text-purple-500" 
                              size={140}
                              strokeWidth={8}
                              isLarge
                            />
                         </div>

                         <div className="grid grid-cols-3 gap-2">
                            <AnimatedHealthGauge score={result.metadata?.metrics.logicFidelity || 0} label="LOGIC" colorClass="text-blue-400" size={64} strokeWidth={5} />
                            <AnimatedHealthGauge score={result.metadata?.metrics.platformAlignment || 0} label="ALIGN" colorClass="text-emerald-400" size={64} strokeWidth={5} />
                            <AnimatedHealthGauge score={result.metadata?.metrics.constraintDensity || 0} label="DENS" colorClass="text-orange-400" size={64} strokeWidth={5} />
                         </div>

                         <div className="flex-1 space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Optimizations Applied</h5>
                            <div className="space-y-2">
                               {result.metadata?.optimizations.map((opt, i) => (
                                 <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                    <Zap className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] font-bold text-gray-400">{opt}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* VAULT SIDEBAR WITH FREEZING PINNING */}
          <aside className="lg:col-span-3 space-y-8 h-full sticky top-24" data-tour="sidebar">
             <div className="glass p-8 rounded-[3rem] border-white/5 h-[calc(100vh-140px)] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 px-2 relative z-10">
                   <h3 className="text-lg font-black font-satoshi tracking-tight">Vault</h3>
                   <History className="w-5 h-5 text-gray-600" />
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
                   {/* STICKY FROZEN SECTION */}
                   {frozenItems.length > 0 && (
                     <div className="sticky top-0 z-30 pb-6 -mx-2 px-2 bg-gradient-to-b from-[#030712] via-[#030712]/95 to-transparent">
                        <div className="flex items-center gap-2 mb-4 px-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                           <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                              <Snowflake className="w-3 h-3" /> Frozen Logic
                           </span>
                        </div>
                        <div className="space-y-4">
                          {frozenItems.map(item => (
                            <VaultCard 
                              key={item.id} 
                              item={item} 
                              isActive={result?.id === item.id} 
                              onClick={() => setResult(item)} 
                              onToggleFreeze={(e) => toggleFreeze(item.id, e)} 
                            />
                          ))}
                        </div>
                        <div className="h-px bg-white/5 mt-6 mx-2" />
                     </div>
                   )}

                   {/* RECENT SECTION */}
                   <div className="space-y-4">
                      {recentItems.length > 0 ? recentItems.map(item => (
                        <VaultCard 
                          key={item.id} 
                          item={item} 
                          isActive={result?.id === item.id} 
                          onClick={() => setResult(item)} 
                          onToggleFreeze={(e) => toggleFreeze(item.id, e)} 
                        />
                      )) : frozenItems.length === 0 && (
                        <div className="py-24 text-center">
                           <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center mx-auto mb-4 border border-white/5">
                              <History className="w-6 h-6 text-gray-800" />
                           </div>
                           <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Vault buffer empty</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent pointer-events-none z-20" />
             </div>
          </aside>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
           {/* Library View Content (Marketplace, Private Patterns) */}
           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
              <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-3xl shadow-inner">
                 <button 
                   onClick={() => { setLibrarySubTab('explore'); setCurrentPage(1); }}
                   className={`px-8 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${librarySubTab === 'explore' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                 >
                   <Globe className="w-4 h-4" /> Global Marketplace
                 </button>
                 <button 
                   onClick={() => { setLibrarySubTab('private'); setCurrentPage(1); }}
                   className={`px-8 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${librarySubTab === 'private' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                 >
                   <FolderHeart className="w-4 h-4" /> My Patterns
                 </button>
              </div>
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                 <div className="relative flex-1 lg:w-80 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search patterns..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
                    />
                 </div>
                 {librarySubTab === 'private' && (
                    <Button onClick={() => setShowSaveModal(true)} className="h-16 px-8 rounded-2xl flex gap-2">
                       <PlusCircle className="w-5 h-5" /> New Pattern
                    </Button>
                 )}
              </div>
           </div>

           {librarySubTab === 'explore' ? (
             <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedDiscovery.map((tmpl, idx) => (
                    <TemplateCard 
                      key={idx} 
                      tmpl={tmpl} 
                      userRating={userRatings[tmpl.id]}
                      onUse={() => useTemplate(tmpl.intent, tmpl.tool, tmpl.category as Category)} 
                      onPreview={() => setPreviewTemplate(tmpl)} 
                      onRate={(r) => handleRate(tmpl.id, r)}
                    />
                  ))}
               </div>
               <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
             </div>
           ) : (
             <div className="space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedPrivate.length > 0 ? paginatedPrivate.map((tmpl) => (
                    <TemplateCard 
                      key={tmpl.id} 
                      tmpl={{
                        id: tmpl.id,
                        title: tmpl.title,
                        intent: tmpl.intent,
                        category: tmpl.category,
                        tool: tmpl.targetTool,
                        complexity: 'Pro',
                        popularity: 'Private',
                        rating: 5.0
                      }} 
                      onUse={() => useTemplate(tmpl.intent, tmpl.targetTool, tmpl.category as Category)} 
                      onPreview={() => setPreviewTemplate({
                        id: tmpl.id,
                        title: tmpl.title,
                        intent: tmpl.intent,
                        category: tmpl.category,
                        tool: tmpl.targetTool,
                        complexity: 'Pro',
                        popularity: 'Private',
                        rating: 5.0
                      })}
                    />
                  )) : (
                    <div className="col-span-full py-24 text-center glass rounded-[4rem] border-dashed border-white/5 opacity-50">
                       <Pencil className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                       <h3 className="text-2xl font-black font-satoshi mb-2">No Private Patterns</h3>
                       <p className="text-sm font-medium text-gray-500">Save your engineered prompts to see them here.</p>
                    </div>
                  )}
               </div>
               <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
             </div>
           )}
        </div>
      )}
    </div>
  );
};

/**
 * VaultCard Component
 */
const VaultCard: React.FC<{ 
  item: GeneratedPrompt, 
  isActive: boolean, 
  onClick: () => void, 
  onToggleFreeze: (e: React.MouseEvent) => void 
}> = ({ item, isActive, onClick, onToggleFreeze }) => (
  <button 
    onClick={onClick} 
    className={`w-full p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group/card ${
      isActive 
       ? 'bg-purple-500/10 border-purple-500/50 shadow-xl' 
       : 'bg-white/5 border-white/5 hover:bg-white/10'
    } ${item.isFrozen ? 'border-cyan-500/30 bg-cyan-500/5 shadow-inner shadow-cyan-500/5' : ''}`}
  >
     {item.isFrozen && (
       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5 pointer-events-none opacity-50" />
     )}

     <div className="flex justify-between items-center mb-3 relative z-10">
        <span className={`text-[9px] font-black uppercase tracking-widest ${item.isFrozen ? 'text-cyan-400' : 'text-gray-500'}`}>
          {item.settings.platform}
        </span>
        <div className="flex items-center gap-2">
           {item.isFrozen && <Snowflake className="w-3 h-3 text-cyan-400 animate-pulse" />}
           <span className={`text-[9px] font-black ${item.isFrozen ? 'text-cyan-400' : 'text-emerald-400'}`}>
             {item.metadata?.healthScore}%
           </span>
        </div>
     </div>

     <p className={`text-xs font-bold line-clamp-2 transition-colors ${item.isFrozen ? 'text-cyan-50' : 'text-gray-300'}`}>
       {item.originalInput}
     </p>

     <div className="mt-4 flex justify-end items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity relative z-10">
       <button 
         onClick={onToggleFreeze}
         className={`p-2 rounded-lg border transition-all ${
           item.isFrozen 
             ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
             : 'bg-white/5 text-gray-500 border-white/10 hover:text-cyan-400 hover:border-cyan-400/30'
         }`}
         title={item.isFrozen ? "Unfreeze Logic" : "Freeze Logic"}
       >
         <Snowflake className="w-3.5 h-3.5" />
       </button>
     </div>
  </button>
);

const Pagination: React.FC<{ currentPage: number, totalPages: number, onPageChange: (p: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 pb-20">
       <button 
         onClick={() => onPageChange(Math.max(1, currentPage - 1))}
         disabled={currentPage === 1}
         className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all disabled:opacity-20"
       >
          <ChevronLeft className="w-5 h-5" />
       </button>
       <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-12 h-12 rounded-2xl border transition-all text-sm font-black ${
                currentPage === page 
                  ? 'bg-purple-500 border-purple-500 text-white' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
       </div>
       <button 
         onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
         disabled={currentPage === totalPages}
         className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all disabled:opacity-20"
       >
          <ChevronRight className="w-5 h-5" />
       </button>
    </div>
  );
};

const TemplateCard: React.FC<{ 
  tmpl: DiscoveryTemplate, 
  userRating?: number,
  onUse: () => void, 
  onPreview: () => void,
  onRate?: (r: number) => void
}> = ({ tmpl, userRating, onUse, onPreview, onRate }) => (
  <div 
    onClick={onPreview}
    className="glass p-10 rounded-[3.5rem] border-white/5 hover:border-purple-500/20 transition-all group flex flex-col min-h-[460px] shadow-xl hover:shadow-purple-500/5 cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-10 flex flex-col items-end gap-2">
       <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
         tmpl.complexity === 'Elite' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
         tmpl.complexity === 'Pro' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
         'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
       }`}>
          {tmpl.complexity || 'Pro'}
       </div>
       <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
          <Flame className="w-3 h-3 text-orange-500" />
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{tmpl.popularity || '1.2k+'} Uses</span>
       </div>
    </div>
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
       <Sparkles className="w-6 h-6 text-purple-400" />
    </div>

    <div className="mb-8">
       <StarRating rating={userRating || tmpl.rating} size={14} />
       <span className="text-[9px] font-black text-gray-600 uppercase mt-1 block tracking-widest">
         Score: {userRating || tmpl.rating}/5
       </span>
    </div>

    <h3 className="text-2xl font-black font-satoshi mb-4 group-hover:text-purple-400 transition-colors leading-tight">{tmpl.title}</h3>
    <div className="flex flex-wrap gap-2 mb-4">
       <div className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] font-black text-purple-400 uppercase tracking-widest">{tmpl.tool}</div>
       <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-400 uppercase tracking-widest">{tmpl.category}</div>
    </div>
    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10 flex-1 line-clamp-4">{tmpl.intent}</p>
    <div className="space-y-6 pt-6 border-t border-white/5">
       <button 
         onClick={(e) => { e.stopPropagation(); onUse(); }}
         className="w-full py-5 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95"
       >
          Use Pattern
       </button>
    </div>
  </div>
);

const ResultStat: React.FC<{ label: string, value: string, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="p-5 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
     <div className="flex items-center gap-2 mb-2 text-gray-600">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
     </div>
     <p className="text-xs font-black text-gray-200 truncate">{value}</p>
  </div>
);
