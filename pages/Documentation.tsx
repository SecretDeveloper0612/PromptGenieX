
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, Terminal, Zap, Shield, Cpu, 
  Search, ChevronRight, MessageSquare, Code, 
  ImageIcon, Mic2, Video, Layers, BrainCircuit,
  FileText, Lightbulb, Play, AlertCircle,
  Copy, Check, Info, Box, Hash, Braces,
  Settings, Key, Database, Workflow, Sparkles
} from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Play className="w-3 h-3" />,
    items: [
      { id: 'quick-start', title: 'Quick Start' },
      { id: 'core-architecture', title: 'Core Architecture' },
      { id: 'authentication', title: 'Authentication' }
    ]
  },
  {
    id: 'engineering',
    title: 'Prompt Engineering',
    icon: <BrainCircuit className="w-3 h-3" />,
    items: [
      { id: 'universal-framework', title: 'Universal Framework' },
      { id: 'role-play-injection', title: 'Role-Play Injection' },
      { id: 'constraint-mapping', title: 'Constraint Mapping' }
    ]
  },
  {
    id: 'platforms',
    title: 'Platform Specifics',
    icon: <Cpu className="w-3 h-3" />,
    items: [
      { id: 'chatgpt-logic', title: 'ChatGPT-4 / Omni' },
      { id: 'claude-logic', title: 'Claude 3.5 Sonnet' },
      { id: 'midjourney-logic', title: 'Midjourney v6' }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Patterns',
    icon: <Layers className="w-3 h-3" />,
    items: [
      { id: 'visual-vectors', title: 'Visual Context Vectors' },
      { id: 'chain-of-thought', title: 'Chain of Thought' },
      { id: 'dynamic-variables', title: 'Dynamic Variables' }
    ]
  }
];

export const Documentation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('quick-start');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      // Find if the section exists in any category
      const exists = DOC_SECTIONS.some(cat => cat.items.some(item => item.id === section));
      if (exists) {
        setActiveItem(section);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeItem]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'quick-start':
        return (
          <DocPage title="Quick Start" subtitle="Get your first engineered prompt in under 30 seconds.">
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              PromptSmith AI is designed to be the bridge between raw ideas and professional-grade AI execution. Follow these three steps to begin your engineering journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <StepCard num="01" title="Select Engine" desc="Choose the AI model you intend to use." />
               <StepCard num="02" title="Input Intent" desc="Type your goal in plain language." />
               <StepCard num="03" title="Compile" desc="Click 'Compile Logic' for your master prompt." />
            </div>
            <h3 className="text-2xl font-black font-satoshi mb-6">Hello World Example</h3>
            <div className="bg-[#0c0c14] border border-white/5 rounded-3xl p-8 mb-8">
               <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Input Intent</p>
               <p className="text-gray-300 font-mono text-sm italic mb-8">"I need an app for healthy habits."</p>
               <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Compiled Output</p>
               <div className="p-6 bg-black/40 rounded-xl font-mono text-sm text-emerald-400 border border-emerald-500/10 leading-relaxed">
                  ACT AS AN ELITE PRODUCT DESIGNER.<br/><br/>
                  GOAL: Architect a habit-tracking ecosystem for high-performers.<br/>
                  CONTEXT: Cross-platform accessibility with neural-trigger rewards.<br/>
                  ... [Detailed logic continues]
               </div>
            </div>
          </DocPage>
        );
      case 'core-architecture':
        return (
          <DocPage title="Core Architecture" subtitle="How PromptSmith compiles instructions.">
            <p className="text-gray-400 leading-relaxed mb-10">
              Our engineering pipeline uses a proprietary 4-stage compilation process to ensure mathematical adherence to your intent while maximizing model creativity.
            </p>
            <div className="space-y-12">
               <ArchItem icon={<Sparkles className="w-5 h-5" />} title="1. Semantic Parser" desc="Analyzes natural language for entities, intent vectors, and hidden constraints." color="purple" />
               <ArchItem icon={<BrainCircuit className="w-5 h-5" />} title="2. Logic Mapper" desc="Matches intent to optimized reasoning frameworks like Chain-of-Thought or Tree-of-Thought." color="blue" />
               <ArchItem icon={<Terminal className="w-5 h-5" />} title="3. Platform Adapter" desc="Injects platform-specific syntax (MJ parameters, Claude XML tags, GPT framing)." color="emerald" />
               <ArchItem icon={<Shield className="w-5 h-5" />} title="4. Guardrail Injection" desc="Applies negative prompts to prevent common model hallucinations and drift." color="orange" />
            </div>
          </DocPage>
        );
      case 'authentication':
        return (
          <DocPage title="Authentication" subtitle="Securing your private vault patterns.">
             <div className="p-8 bg-purple-500/5 border border-purple-500/10 rounded-3xl mb-12">
                <div className="flex gap-4 items-start">
                   <Key className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                   <div>
                      <h4 className="text-lg font-black font-satoshi mb-2">Private Vault Encryption</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                         All prompt patterns saved in your library are encrypted using AES-256 standards. Our servers only store the encrypted blobs; the decryption key remains active only during your authenticated session.
                      </p>
                   </div>
                </div>
             </div>
             <div className="space-y-8">
                <h3 className="text-2xl font-black font-satoshi">Integration Tokens</h3>
                <p className="text-gray-400">If you are using the PromptSmith API for agency workflows, you must generate a Bearer Token in your settings panel.</p>
                <div className="bg-[#0c0c14] p-6 rounded-2xl border border-white/5 font-mono text-sm flex items-center justify-between">
                   <span className="text-gray-500">Authorization: Bearer ps_live_********************</span>
                   <button onClick={() => handleCopy("Bearer ps_live_********************", 'auth-key')} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                      {copied === 'auth-key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-600" />}
                   </button>
                </div>
             </div>
          </DocPage>
        );
      case 'universal-framework':
        return (
          <DocPage title="Universal Framework" subtitle="The 5-layer stack for perfect output.">
             <p className="text-gray-400 mb-12">Every engineered prompt follows a strict mathematical structure designed to minimize drift. We deconstruct user intent into a 5-layer stack:</p>
             <div className="space-y-6">
                <LayerItem num="1" label="ROLE" color="purple" text="Expert persona definition with domain authority markers." />
                <LayerItem num="2" label="TASK" color="blue" text="Primary objective deconstructed into atomic, sequential steps." />
                <LayerItem num="3" label="CTXT" color="emerald" text="Constraint set and background information injection." />
                <LayerItem num="4" label="FMT" color="orange" text="Strict output formatting and structural requirements." />
                <LayerItem num="5" label="GUARD" color="pink" text="Negative prompting and hallucination guardrails." />
             </div>
          </DocPage>
        );
      case 'role-play-injection':
        return (
          <DocPage title="Role-Play Injection" subtitle="Force the AI into a state of domain authority.">
            <p className="text-gray-400 leading-relaxed mb-10">
              Generic prompts get generic answers because the AI defaults to a "General Assistant" persona. Role-Play Injection forces the model to prioritize a specific knowledge subset.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass p-8 rounded-3xl border-white/5">
                  <h4 className="font-black font-satoshi mb-4 text-purple-400 uppercase text-xs tracking-widest">Bad Persona</h4>
                  <p className="text-gray-500 italic">"Help me with marketing strategy."</p>
               </div>
               <div className="glass p-8 rounded-3xl border-purple-500/20 bg-purple-500/5">
                  <h4 className="font-black font-satoshi mb-4 text-emerald-400 uppercase text-xs tracking-widest">Engineered Persona</h4>
                  <p className="text-gray-300 italic">"ACT AS A GROWTH LEAD AT A TIER-1 SAAS. Your expertise is in high-fidelity conversion optimization and funnel logic..."</p>
               </div>
            </div>
          </DocPage>
        );
      case 'constraint-mapping':
        return (
          <DocPage title="Constraint Mapping" subtitle="Strict guardrails for predictable results.">
             <p className="text-gray-400 mb-10">Constraints are just as important as the task itself. PromptSmith applies "Logical Dampening" to prevent the model from adding unwanted conversational filler.</p>
             <div className="bg-[#0c0c14] border border-white/5 rounded-3xl p-8 font-mono text-sm leading-relaxed">
                <div className="text-purple-400 mb-4 font-black"># CONSTRAINT_STACK_V4</div>
                <div className="text-gray-500">// Native Negative Prompting</div>
                <p className="text-pink-400/80 mt-2">- NO conversational filler (e.g., 'Sure, here is...')</p>
                <p className="text-pink-400/80">- NO repetitive advice or moralizing caveats.</p>
                <p className="text-pink-400/80">- OUTPUT strictly in JSON format.</p>
                <p className="text-pink-400/80">- LENGTH must not exceed 250 tokens.</p>
             </div>
          </DocPage>
        );
      case 'chatgpt-logic':
        return (
          <DocPage title="ChatGPT-4 / Omni" subtitle="Maximizing the system instruction buffer.">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                   <Cpu className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold font-satoshi">Token Efficiency Guide</h4>
             </div>
             <p className="text-gray-400 leading-relaxed mb-10">GPT-4 Omni responds exceptionally well to "System Framing." Use headers and bulleted constraints. For longer prompts, use "Chain of Thought" markers at the end of the system block.</p>
             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                   <Info className="w-4 h-4 text-blue-400" />
                   <span className="text-[10px] font-black uppercase text-gray-500">Best Practice</span>
                </div>
                <p className="text-sm text-gray-400">Place high-priority instructions at the very beginning AND the very end of the prompt for maximum attention weight.</p>
             </div>
          </DocPage>
        );
      case 'claude-logic':
        return (
          <DocPage title="Claude 3.5 Sonnet" subtitle="Leveraging XML for structured reasoning.">
             <p className="text-gray-400 mb-10">Anthropic models are uniquely optimized for XML tag parsing. This allows for clear separation of context, examples, and instructions.</p>
             <div className="bg-[#0c0c14] border border-white/5 rounded-3xl p-8 font-mono text-sm">
                <span className="text-gray-600">&lt;role&gt;</span><br/>
                <span className="text-emerald-400 ml-4">Expert Analyst</span><br/>
                <span className="text-gray-600">&lt;/role&gt;</span><br/>
                <span className="text-gray-600">&lt;context&gt;</span><br/>
                <span className="text-emerald-400 ml-4">Analyze financial report Ps-90.</span><br/>
                <span className="text-gray-600">&lt;/context&gt;</span>
             </div>
          </DocPage>
        );
      case 'midjourney-logic':
        return (
          <DocPage title="Midjourney v6" subtitle="Parameter weighting and visual depth logic.">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                   <h4 className="font-bold text-white flex items-center gap-2"><ImageIcon className="w-4 h-4 text-purple-400" /> Style Reference</h4>
                   <p className="text-sm text-gray-500">Use the --sref parameter for stylistic consistency across generations.</p>
                </div>
                <div className="space-y-4">
                   <h4 className="font-bold text-white flex items-center gap-2"><Maximize2 className="w-4 h-4 text-purple-400" /> Chaos & Stylize</h4>
                   <p className="text-sm text-gray-500">PromptSmith automatically calculates the ideal --c and --s values based on your complexity request.</p>
                </div>
             </div>
          </DocPage>
        );
      case 'visual-vectors':
        return (
          <DocPage title="Visual Context Vectors" subtitle="Engineering from images.">
             <p className="text-gray-400 mb-10">When you upload an image, our Semantic Parser extracts "Style Vectors" (composition, palette, lighting) and converts them into text-based instructions for your target tool.</p>
             <div className="flex flex-col md:flex-row gap-6 items-center p-8 bg-white/5 rounded-[3rem] border border-white/10">
                <div className="w-24 h-24 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/20 shrink-0">
                   <ImageIcon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1">
                   <h5 className="font-black font-satoshi mb-2">Multi-Modal Synthesis</h5>
                   <p className="text-xs text-gray-500 leading-relaxed font-medium">The compiler doesn't just describe the image; it identifies the technical specifications (e.g., 'f/1.8 aperture', 'Golden hour lighting') required to replicate that aesthetic in your next prompt.</p>
                </div>
             </div>
          </DocPage>
        );
      case 'chain-of-thought':
        return (
          <DocPage title="Chain of Thought" subtitle="Unlocking complex reasoning patterns.">
             <p className="text-gray-400 mb-10">CoT prompts force the model to "think out loud" before arriving at a final answer, drastically reducing logic errors in math, code, and strategy.</p>
             <div className="bg-[#0c0c14] border border-white/5 rounded-3xl p-8">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Injected Trigger</p>
                <p className="text-gray-300 font-mono text-sm">"BEFORE PROVIDING THE FINAL SOLUTION, SHOW YOUR STEP-BY-STEP REASONING PROCESS INSIDE &lt;thought&gt; TAGS. ANALYZE ALL POSSIBLE EDGE CASES."</p>
             </div>
          </DocPage>
        );
      case 'dynamic-variables':
        return (
          <DocPage title="Dynamic Variables" subtitle="Creating modular prompt templates.">
             <p className="text-gray-400 mb-10">Use the brackets [ ] or curly braces { } in your intents. PromptSmith detects these as input slots for reusable patterns.</p>
             <div className="p-8 glass rounded-3xl border-emerald-500/10 mb-8">
                <h4 className="font-black font-satoshi text-emerald-400 mb-4">Variable Pattern</h4>
                <p className="text-gray-300 font-mono">"Write an email to <span className="bg-emerald-500/20 text-emerald-400 px-2 rounded-md">[Client_Name]</span> about the <span className="bg-emerald-500/20 text-emerald-400 px-2 rounded-md">[Project_Scope]</span> using a <span className="bg-emerald-500/20 text-emerald-400 px-2 rounded-md">[Tone]</span> tone."</p>
             </div>
          </DocPage>
        );
      default:
        return <div>Section coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col lg:flex-row">
      {/* Documentation Sidebar */}
      <aside className="w-full lg:w-80 border-r border-white/5 p-8 flex flex-col gap-10 lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search docs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none transition-all font-medium placeholder:text-gray-700" 
          />
        </div>

        <nav className="space-y-10">
          {DOC_SECTIONS.map((section) => (
            <div key={section.id} className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                {section.icon} {section.title}
              </h4>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveItem(item.id)}
                    className={`text-sm transition-all text-left px-3 py-2 rounded-xl flex items-center justify-between group ${
                      activeItem === item.id 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {item.title}
                    <ChevronRight className={`w-3 h-3 transition-transform ${activeItem === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Documentation Content */}
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-16 max-w-5xl">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderContent()}
          
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-center md:text-left">
                <p className="text-sm text-gray-500 font-medium">Was this guide helpful?</p>
                <div className="flex gap-4 mt-3">
                   <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-all border border-white/5">Yes, absolutely</button>
                   <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-all border border-white/5">Not quite</button>
                </div>
             </div>
             <button className="flex items-center gap-3 text-purple-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">
                Support Discord <MessageSquare className="w-4 h-4" />
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Mini Components for Docs */

const DocPage: React.FC<{ title: string, subtitle: string, children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <>
    <div className="flex items-center gap-3 mb-6">
      <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400">
        v2.4.0 Technical Docs
      </span>
      <span className="text-gray-700 text-xs font-bold uppercase tracking-widest">• Engineering Standard</span>
    </div>

    <h1 className="text-5xl md:text-7xl font-black font-satoshi tracking-tighter mb-4 leading-tight">
      {title}
    </h1>
    <p className="text-xl text-gray-500 leading-relaxed font-medium mb-16 max-w-3xl">
      {subtitle}
    </p>

    <div className="prose prose-invert prose-purple max-w-none">
       {children}
    </div>
  </>
);

const StepCard: React.FC<{ num: string, title: string, desc: string }> = ({ num, title, desc }) => (
  <div className="glass p-8 rounded-[2rem] border-white/5 group hover:border-purple-500/20 transition-all shadow-xl">
    <span className="text-4xl font-black text-white/[0.03] block mb-4 group-hover:text-purple-500/10 transition-colors">{num}</span>
    <h4 className="text-lg font-bold font-satoshi mb-2 text-white">{title}</h4>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const ArchItem: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => {
  const colorMap: any = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };
  return (
    <div className="flex gap-8 items-start group">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 group-hover:scale-110 transition-transform shadow-inner ${colorMap[color]}`}>
          {icon}
       </div>
       <div>
          <h4 className="text-xl font-black font-satoshi mb-2 text-white">{title}</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">{desc}</p>
       </div>
    </div>
  );
};

const LayerItem: React.FC<{ num: string, label: string, color: string, text: string }> = ({ num, label, color, text }) => {
  const colorMap: any = {
    purple: 'text-purple-500',
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
    orange: 'text-orange-500',
    pink: 'text-pink-500'
  };
  return (
    <div className="flex gap-6 items-center p-6 bg-[#0c0c14] border border-white/5 rounded-2xl hover:bg-white/[0.02] transition-colors">
       <div className={`text-sm font-black font-mono w-4 ${colorMap[color]}`}>{num}</div>
       <div className={`text-sm font-black font-mono px-3 py-1 bg-white/5 rounded border border-white/10 ${colorMap[color]}`}>{label}</div>
       <p className="text-gray-400 text-sm">{text}</p>
    </div>
  );
};

const Maximize2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);
