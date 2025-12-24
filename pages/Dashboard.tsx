
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
    <div className="flex flex-col items-center gap-3 animate-scale-in">
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
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
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
          return <div key={i} className="text-purple-400 font-black mb-2 animate-reveal">{line}</div>;
        }
        const parts = line.split(/(\[.*?\])/g);
        return (
          <div key={i} className="mb-1 animate-reveal" style={{ animationDelay: `${i * 30}ms` }}>
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
  const [activeCategory, setActiveCategory] = useState<Category>('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'workspace' | 'library'>('workspace');
  const [librarySubTab, setLibrarySubTab] = useState<'explore' | 'private'>('explore');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [powerUps, setPowerUps] = useState<string[]>([]);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [toolCategoryFilter, setToolCategoryFilter] = useState<ToolCategory>('All');
  const [discoveryCategory, setDiscoveryCategory] = useState<string>('All');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateIntent, setNewTemplateIntent] = useState('');
  const [newTemplateTool, setNewTemplateTool] = useState<AITool>('ChatGPT');
  const [newTemplateCategory, setNewTemplateCategory] = useState<Category>('General');
  
  const [logMessages, setLogMessages] = useState<{msg: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<Category | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'compiled' | 'intent'>('compiled');

  const resultRef = useRef<HTMLDivElement>(null);
  const toolScrollRef = useRef<HTMLDivElement>(null);

  const scrollTools = (direction: 'left' | 'right') => {
    if (toolScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      toolScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      playSound('click');
    }
  };

  const toolCategories: ToolCategory[] = ['All', 'Logic', 'Visual', 'Audio', 'Video'];

  useEffect(() => {
    const savedSettings = localStorage.getItem('promptgeniex_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setUserSettings(parsed);
      } catch (e) {}
    }
    const savedHistory = localStorage.getItem('promptgeniex_history');
    if (savedHistory) try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('promptgeniex_history', JSON.stringify(history));
  }, [history]);

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
  }, [searchParams]);

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
      } else if (type === 'click') {
        playNote(1200, now, 0.05, 0.02);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        if (newState) playSound('click');
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
    if (!input.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setLogMessages([]);
    setGenStep(1);
    addLog(`Targeting platform: ${selectedTool}...`, "info");
    
    setTimeout(() => {
      setGenStep(2);
      addLog("Injecting power-ups and constraints...", "info");
    }, 1200);

    let finalInput = input;
    if (powerUps.length > 0) {
      finalInput += `\n\nApply these specialized engineering modifiers: ${powerUps.join(', ')}.`;
    }

    try {
      const genResult = await generatePrompt(finalInput, selectedTool, userSettings);
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substr(2, 9),
        originalInput: input,
        masterPrompt: genResult.masterPrompt,
        settings: genResult.settings,
        metadata: genResult.metadata,
        usageTip: genResult.usageTip,
        timestamp: Date.now(),
        category: activeCategory,
        isFrozen: false
      };
      setResult(newPrompt);
      setHistory(prev => [newPrompt, ...prev]);
      addLog("Master logic engineered successfully.", "success");
      playSound('success');
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
      handleCopy();
      addLog(`Redirecting to ${result.settings.platform}. Logic copied to clipboard.`, "info");
      return;
    }
    const finalUrl = tool.deployUrl.replace('{prompt}', encodeURIComponent(result.masterPrompt));
    navigator.clipboard.writeText(result.masterPrompt);
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
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

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
    return toolCategoryFilter === 'All' || tool.category === toolCategoryFilter;
  });

  const totalDiscoveryPages = Math.ceil(filteredDiscovery.length / ITEMS_PER_PAGE);
  const totalPrivatePages = Math.ceil(filteredPrivateTemplates.length / ITEMS_PER_PAGE);
  const totalPages = librarySubTab === 'explore' ? totalDiscoveryPages : totalPrivatePages;

  const paginatedDiscovery = filteredDiscovery.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const paginatedPrivate = filteredPrivateTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const currentToolMetadata = result ? TOOLS.find(t => t.id === result.settings.platform || t.name === result.settings.platform) : null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-12 min-h-screen relative animate-reveal">
      
      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowSaveModal(false)}>
           <div className="glass-dark max-w-2xl w-full p-10 md:p-12 rounded-[3.5rem] border-emerald-500/20 shadow-4xl animate-scale-in" onClick={e => e.stopPropagation()}>
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
                 <button onClick={() => setShowSaveModal(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-soft">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pattern Title</label>
                    <input 
                       type="text" 
                       value={newTemplateTitle}
                       onChange={e => setNewTemplateTitle(e.target.value)}
                       placeholder="e.g. Cinematic High-Fantasy Script"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-soft font-bold"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Target Engine</label>
                       <select 
                          value={newTemplateTool}
                          onChange={e => setNewTemplateTool(e.target.value as AITool)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none appearance-none cursor-pointer font-bold"
                       >
                          {TOOLS.map(t => <option key={t.id} value={t.id} className="bg-gray-900">{t.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Domain</label>
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
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Engineering Intent</label>
                    <textarea 
                       value={newTemplateIntent}
                       onChange={e => setNewTemplateIntent(e.target.value)}
                       placeholder="Describe the core intent this pattern satisfies..."
                       className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 h-40 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-soft resize-none font-medium leading-relaxed custom-scrollbar"
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

      {/* Header Area */}
      <div className="px-4 md:px-8 py-4 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 animate-reveal">
             <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
                <Sparkles className="text-white w-6 h-6 animate-pulse" />
             </div>
             <div>
                <h1 className="font-black font-satoshi tracking-tighter leading-none text-4xl">Lab Workspace</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Industrial Prompt Engineering</p>
             </div>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl shadow-inner animate-reveal delay-100">
             <button onClick={() => { setActiveTab('workspace'); playSound('click'); }} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-soft flex items-center gap-2 ${activeTab === 'workspace' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
               <Zap className="w-4 h-4" /> Lab
             </button>
             <button onClick={() => { setActiveTab('library'); playSound('click'); }} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-soft flex items-center gap-2 ${activeTab === 'library' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
               <BookOpen className="w-4 h-4" /> Library
             </button>
          </div>
        </div>
      </div>

      {activeTab === 'workspace' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-reveal delay-200">
          
          <div className="lg:col-span-9 space-y-12">
            {/* Tool Selector */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-2 text-purple-400">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                    <span className="text-[10px] font-black">01</span>
                  </div>
                  <h3 className="text-sm font-black font-satoshi uppercase tracking-[0.2em] text-gray-500">Target Platform</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                    {toolCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => { setToolCategoryFilter(cat); playSound('click'); }}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-soft ${
                          toolCategoryFilter === cat ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => scrollTools('left')} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-soft"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => scrollTools('right')} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-soft"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div ref={toolScrollRef} className="flex overflow-x-auto gap-4 pb-4 px-4 no-scrollbar scroll-smooth">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => { setSelectedTool(tool.id); playSound('click'); }}
                    className={`min-w-[160px] p-6 rounded-3xl border transition-soft flex flex-col items-center gap-4 ${
                      selectedTool === tool.id ? 'bg-purple-500/10 border-purple-500 shadow-2xl scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-soft ${selectedTool === tool.id ? 'bg-purple-500 text-white shadow-lg' : 'bg-black/40 text-gray-600'}`}>
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Spec */}
            <div className="space-y-6 animate-reveal delay-300">
               <div className="flex items-center gap-2 text-purple-400 px-4">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                    <span className="text-[10px] font-black">02</span>
                  </div>
                  <h3 className="text-sm font-black font-satoshi uppercase tracking-[0.2em] text-gray-500">Intent Specification</h3>
               </div>

               <div className="glass rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl relative">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-8 p-10 border-r border-white/5">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex gap-2">
                            {['Deep Analysis', 'Strict Logic', 'Creative Burst'].map(p => (
                              <button key={p} onClick={() => togglePowerUp(p)} className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-soft ${powerUps.includes(p) ? 'bg-purple-500 border-purple-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                                {p}
                              </button>
                            ))}
                         </div>
                         <button onClick={() => setInput('')} className="text-gray-600 hover:text-red-400 transition-soft"><Trash2 className="w-5 h-5" /></button>
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
                            className="absolute bottom-4 right-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 hover:bg-purple-500 hover:text-white transition-soft shadow-lg flex items-center gap-2"
                          >
                            {isRefining ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">Refine Intent</span>
                          </button>
                        )}
                      </div>

                      <div className="mt-12 flex gap-4">
                        <Button onClick={handleGenerate} isLoading={isGenerating} disabled={!input.trim()} className="flex-1 h-20 text-xl font-black rounded-[2.5rem] shadow-3xl shadow-purple-500/20">
                          Compile Prompt <Wand2 className="ml-4 w-6 h-6" />
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-4 bg-black/40 p-10 flex flex-col gap-10">
                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"><Layers className="w-3 h-3" /> System Log</h4>
                          <div className="space-y-4 font-mono">
                             {logMessages.length > 0 ? logMessages.map((log, i) => (
                               <div key={i} className="flex gap-3 text-[10px] animate-reveal">
                                 <span className={log.type === 'success' ? 'text-emerald-500' : 'text-purple-400'}>{'>'}</span>
                                 <p className="text-gray-500">{log.msg}</p>
                               </div>
                             )) : <p className="text-[10px] text-gray-800 italic">Awaiting input signal...</p>}
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Results Area */}
            {result && (
              <div ref={resultRef} className="space-y-8 animate-reveal">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                      <span className="text-[10px] font-black">03</span>
                    </div>
                    <h3 className="text-sm font-black font-satoshi uppercase tracking-[0.2em] text-gray-500">Master Output</h3>
                  </div>
                  
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button onClick={() => setViewMode('compiled')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-soft ${viewMode === 'compiled' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}>Compiled</button>
                    <button onClick={() => setViewMode('intent')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-soft ${viewMode === 'intent' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}>Source Intent</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                   <div className="lg:col-span-8">
                      <div className="glass p-12 rounded-[4rem] border-white/5 shadow-2xl relative h-full">
                        <div className="absolute top-8 right-8 flex gap-3">
                           <button onClick={handleCopy} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-soft shadow-xl">
                             {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
                           </button>
                           {currentToolMetadata && (
                             <button onClick={handleDeploy} className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-soft shadow-xl font-black uppercase text-[10px] tracking-widest text-white ${currentToolMetadata.color}`}>
                               Deploy to {currentToolMetadata.name} <ExternalLink className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                        
                        <div className="mb-10 flex items-center gap-4 animate-reveal">
                           <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                              <ShieldAlert className="text-emerald-400 w-6 h-6" />
                           </div>
                           <h3 className="text-2xl font-black font-satoshi tracking-tight">Logic Engine v2.4</h3>
                        </div>

                        <div className="bg-[#0c0c14] rounded-[3rem] border border-white/5 p-10 md:p-14 font-mono text-lg leading-relaxed text-gray-300 shadow-inner">
                          {viewMode === 'compiled' ? (
                            <SyntaxHighlightedPrompt text={result.masterPrompt} />
                          ) : (
                            <div className="italic text-gray-500 animate-reveal">"{result.originalInput}"</div>
                          )}
                        </div>
                      </div>
                   </div>

                   <div className="lg:col-span-4">
                      <div className="glass p-8 rounded-[4rem] border-purple-500/10 bg-purple-500/5 h-full space-y-8 flex flex-col shadow-2xl animate-reveal delay-100">
                         <div className="flex items-center justify-between px-2">
                            <h4 className="text-sm font-black font-satoshi uppercase tracking-widest text-purple-400">Health Monitor</h4>
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
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-2">Optimizations</h5>
                            <div className="space-y-2">
                               {result.metadata?.optimizations.map((opt, i) => (
                                 <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 animate-reveal" style={{ animationDelay: `${i * 100}ms` }}>
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

          <aside className="lg:col-span-3 space-y-8 h-full sticky top-24">
             <div className="glass p-8 rounded-[3rem] border-white/5 h-[calc(100vh-140px)] flex flex-col shadow-2xl relative overflow-hidden animate-reveal delay-500">
                <div className="flex items-center justify-between mb-8 px-2 relative z-10">
                   <h3 className="text-lg font-black font-satoshi tracking-tight">Vault</h3>
                   <History className="w-5 h-5 text-gray-600" />
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
                   {history.map(item => (
                    <VaultCard 
                      key={item.id} 
                      item={item} 
                      isActive={result?.id === item.id} 
                      onClick={() => setResult(item)} 
                      onToggleFreeze={(e) => toggleFreeze(item.id, e)} 
                    />
                   ))}
                   {history.length === 0 && (
                      <div className="py-24 text-center opacity-30">
                         <History className="w-10 h-10 mx-auto mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
                      </div>
                   )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none z-20" />
             </div>
          </aside>
        </div>
      ) : (
        <div className="animate-reveal space-y-16">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
              <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-3xl shadow-inner">
                 <button onClick={() => { setLibrarySubTab('explore'); playSound('click'); }} className={`px-8 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-soft flex items-center gap-2 ${librarySubTab === 'explore' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                   <Globe className="w-4 h-4" /> Global Marketplace
                 </button>
                 <button onClick={() => { setLibrarySubTab('private'); playSound('click'); }} className={`px-8 py-4 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-soft flex items-center gap-2 ${librarySubTab === 'private' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-soft"
                    />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedDiscovery.map((tmpl, idx) => (
                <TemplateCard 
                  key={idx} 
                  tmpl={tmpl} 
                  onUse={() => useTemplate(tmpl.intent, tmpl.tool, tmpl.category as Category)} 
                  onPreview={() => setPreviewTemplate(tmpl)} 
                />
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

const VaultCard: React.FC<{ item: GeneratedPrompt, isActive: boolean, onClick: () => void, onToggleFreeze: (e: React.MouseEvent) => void }> = ({ item, isActive, onClick, onToggleFreeze }) => (
  <button 
    onClick={onClick} 
    className={`w-full p-6 rounded-[2rem] border text-left transition-soft relative overflow-hidden group/card animate-reveal ${
      isActive ? 'bg-purple-500/10 border-purple-500/50 shadow-xl' : 'bg-white/5 border-white/5 hover:bg-white/10'
    } ${item.isFrozen ? 'border-cyan-500/30 bg-cyan-500/5' : ''}`}
  >
     <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{item.settings.platform}</span>
        <div className="flex items-center gap-2">
           {item.isFrozen && <Snowflake className="w-3 h-3 text-cyan-400" />}
           <span className="text-[9px] font-black text-emerald-400">{item.metadata?.healthScore}%</span>
        </div>
     </div>
     <p className="text-xs font-bold line-clamp-2 text-gray-300">{item.originalInput}</p>
  </button>
);

const TemplateCard: React.FC<{ tmpl: DiscoveryTemplate, onUse: () => void, onPreview: () => void }> = ({ tmpl, onUse, onPreview }) => (
  <div onClick={onPreview} className="glass p-10 rounded-[3.5rem] border-white/5 hover:border-purple-500/20 transition-soft group flex flex-col min-h-[460px] shadow-xl cursor-pointer relative overflow-hidden animate-reveal">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-soft border border-white/5 shadow-inner">
       <Sparkles className="w-6 h-6 text-purple-400" />
    </div>
    <h3 className="text-2xl font-black font-satoshi mb-4 group-hover:text-purple-400 transition-soft leading-tight">{tmpl.title}</h3>
    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10 flex-1 line-clamp-4">{tmpl.intent}</p>
    <div className="pt-6 border-t border-white/5">
       <button onClick={(e) => { e.stopPropagation(); onUse(); }} className="w-full py-5 rounded-2xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-soft shadow-lg">
          Use Pattern
       </button>
    </div>
  </div>
);
