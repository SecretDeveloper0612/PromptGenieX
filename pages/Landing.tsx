
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Sparkles, Zap, Shield, ArrowRight, MessageSquare,
   Code, Image as ImageIcon, Video, CheckCircle2,
   Copy, Star, TrendingUp, Cpu, Layout, Globe,
   Terminal, Layers, Mic2, Palette, Megaphone,
   Briefcase, Database, Zap as Lightning, Users,
   BarChart3, Quote, ChevronDown, ChevronUp,
   Rocket, Shapes, Music, XCircle, MousePointer2,
   Lock, Eye, BrainCircuit, Workflow, Activity,
   Maximize2, Braces, FileText, Search, Gauge,
   Target, History
} from 'lucide-react';
import { Button } from '../components/Button';
import { TEMPLATES } from '../constants';

// Animated Counter Hook
const useCounter = (endValue: string, duration: number = 2000) => {
   const [count, setCount] = useState(0);
   const isFloat = endValue.includes('.');
   const numericPart = parseFloat(endValue.replace(/[^0-9.]/g, ''));
   const suffix = endValue.replace(/[0-9.]/g, '');

   useEffect(() => {
      let startTime: number | null = null;
      let animationFrame: number;

      const animate = (timestamp: number) => {
         if (!startTime) startTime = timestamp;
         const progress = Math.min((timestamp - startTime) / duration, 1);

         const currentVal = progress * numericPart;
         setCount(currentVal);

         if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
         }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
   }, [numericPart, duration]);

   if (isFloat) {
      return count.toFixed(1) + suffix;
   }
   return Math.floor(count).toLocaleString() + suffix;
};

// Reveal Animation Component
interface RevealProps {
   children: React.ReactNode;
   width?: 'fit-content' | '100%';
   delay?: number;
   duration?: number;
   y?: number;
   x?: number;
   scale?: number;
   blur?: boolean;
   threshold?: number;
}

const Reveal: React.FC<RevealProps> = ({
   children,
   width = '100%',
   delay = 0,
   duration = 1000,
   y = 30,
   x = 0,
   scale = 0.98,
   blur = false,
   threshold = 0.1
}) => {
   const [isVisible, setIsVisible] = useState(false);
   const domRef = React.useRef<HTMLDivElement>(null);

   useEffect(() => {
      const observer = new IntersectionObserver(entries => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               setIsVisible(true);
            }
         });
      }, { threshold });

      const { current } = domRef;
      if (current) observer.observe(current);

      return () => {
         if (current) observer.unobserve(current);
      };
   }, [threshold]);

   return (
      <div
         ref={domRef}
         className={`transition-all transform-gpu will-change-transform ${isVisible
            ? 'opacity-100 translate-y-0 translate-x-0 scale-100 blur-0'
            : `opacity-0 ${blur ? 'blur-md' : ''}`
            }`}
         style={{
            width,
            transform: isVisible
               ? 'none'
               : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: `${delay}ms`
         }}
      >
         {children}
      </div>
   );
};

export const Landing: React.FC = () => {
   const [openFaq, setOpenFaq] = useState<number | null>(null);
   const [showScroll, setShowScroll] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setShowScroll(window.scrollY > 500);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const integrationIcons = [
      { icon: <Cpu />, name: "ChatGPT-4" },
      { icon: <Globe />, name: "Claude 3.5" },
      { icon: <ImageIcon />, name: "Midjourney" },
      { icon: <Video />, name: "Runway" },
      { icon: <Code />, name: "GitHub Copilot" },
      { icon: <Terminal />, name: "AutoGPT" },
      { icon: <Layout />, name: "Framer" },
      { icon: <MessageSquare />, name: "Slack" },
      { icon: <Database />, name: "Notion" },
      { icon: <Mic2 />, name: "ElevenLabs" },
      { icon: <Palette />, name: "Canva AI" },
      { icon: <Lightning />, name: "Zapier" },
   ];

   const features = [
      {
         title: "Cross-Model Logic",
         desc: "One intent, optimized for every architecture. We map prompts to specific transformer logic.",
         icon: <BrainCircuit className="w-6 h-6" />
      },
      {
         title: "Visual Context",
         desc: "Upload images to engineer prompts that maintain stylistic consistency and visual depth.",
         icon: <ImageIcon className="w-6 h-6" />
      },
      {
         title: "Private Vault",
         desc: "Securely store and version control your proprietary prompt patterns in an encrypted library.",
         icon: <Lock className="w-6 h-6" />
      },
      {
         title: "Rapid Refinement",
         desc: "Turn vague 'Hinglish' or broken sentences into professional logic in a single click.",
         icon: <Zap className="w-6 h-6" />
      },
      {
         title: "Performance Stats",
         desc: "Monitor how your prompts perform with metadata tracking for complexity and fidelity.",
         icon: <BarChart3 className="w-6 h-6" />
      },
      {
         title: "Team Workflows",
         desc: "Share engineered patterns across your organization with standardized role definitions.",
         icon: <Workflow className="w-6 h-6" />
      }
   ];

   const useCases = [
      {
         title: "For Developers",
         icon: <Code className="w-6 h-6" />,
         desc: "Generate complex boilerplate, refactor legacy code, and write comprehensive test suites with logic-aware prompts.",
         benefits: ["Context-rich refactoring", "Unit test generation", "Documentation automation"],
         metric: "45% Faster Sprints",
         sampleIntent: "Generate a production-ready React component for a data dashboard with Tailwind and Framer Motion.",
         category: "Code",
         tool: "Claude"
      },
      {
         title: "For Marketers",
         icon: <Megaphone className="w-6 h-6" />,
         desc: "Craft high-converting ad copy and social hooks that actually sound human and adhere to brand voice constraints.",
         benefits: ["Multi-platform hook strategy", "A/B copy variants", "Psychological trigger injection"],
         metric: "3.2x Higher CTR",
         sampleIntent: "Create a high-converting Facebook Ad copy for a luxury travel brand targeting high-net-worth individuals.",
         category: "Marketing",
         tool: "ChatGPT"
      },
      {
         title: "For Designers",
         icon: <Palette className="w-6 h-6" />,
         desc: "Bridge the gap between vision and execution. Get pixel-perfect UI descriptions and studio-quality lighting prompts.",
         benefits: ["UI/UX logic frameworks", "Complex lighting schemas", "Compositional guardrails"],
         metric: "Zero Hallucination",
         sampleIntent: "Create a minimalist UI concept for a mobile banking app with glassmorphism and deep purple accents.",
         category: "UI/UX",
         tool: "Midjourney"
      }
   ];

   const faqs = [
      { q: "How does PromptGenieX differ from just using ChatGPT?", a: "PromptGenieX isn't a chatbot; it's a compiler. We take your intent and run it through an engineering pipeline that injects role-play, constraints, and platform-specific logic to force the AI into high-precision output." },
      { q: "Do the prompts work on all AI models?", a: "Yes. Our Cross-Model Logic Mapping ensures that the core instructions are formatted to be interpreted correctly by all transformer-based architectures, including Gemini, GPT-4, and Claude." },
      { q: "Is my proprietary prompt data secure?", a: "Absolutely. We follow enterprise-grade privacy protocols. We never use your inputs or generated prompts to train our internal models. Your data belongs to you." },
      { q: "Can I save my own custom patterns?", a: "Yes, our Dashboard features a Private Vault where you can save, categorize, and refine your own reusable prompt structures and templates." }
   ];

   const testimonials = [
      {
         name: "Alex Rivera",
         role: "Senior Frontend Engineer",
         content: "PromptGenieX has changed how I prompt Claude. My code refactors are now 10x more accurate.",
         avatar: "https://i.pravatar.cc/150?u=alex"
      },
      {
         name: "Sarah Chen",
         role: "Growth Marketer",
         content: "The marketing hooks generated here actually sound human. Best tool for copywriters out there.",
         avatar: "https://i.pravatar.cc/150?u=sarah"
      },
      {
         name: "Marcus Thorne",
         role: "Creative Director",
         content: "Pixel-perfect UI descriptions. I no longer struggle with Midjourney focal lengths.",
         avatar: "https://i.pravatar.cc/150?u=marcus"
      },
      {
         name: "Elena Vogt",
         role: "AI Researcher",
         content: "The cross-model logic mapping is genius. It bridges the gap between architectures perfectly.",
         avatar: "https://i.pravatar.cc/150?u=elena"
      }
   ];

   return (
      <div className="relative overflow-hidden selection:bg-purple-500/30">
         {/* Hero Section */}
         <section className="px-4 pt-28 pb-10 md:pt-40 md:pb-20 relative min-h-[85vh] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[160px] animate-hero-glow -z-10 pointer-events-none" />
            <div className="max-w-5xl mx-auto text-center relative z-10">
               <Reveal delay={200} y={20} blur>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                     </span>
                     Engineering the Future of AI Interaction
                  </div>
               </Reveal>

               <Reveal delay={400} y={40} blur duration={1200}>
                  <h1 className="text-6xl md:text-9xl font-black font-satoshi leading-[0.9] mb-10 tracking-tighter">
                     Master the <span className="animate-shimmer italic">Art</span> of <br className="hidden md:block" /> AI Prompting.
                  </h1>
               </Reveal>

               <Reveal delay={600} y={30} blur duration={1200}>
                  <p className="text-xl text-gray-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                     Join 50,000+ creators using PromptGenieX to turn raw ideas into high-performance, studio-quality instructions.
                  </p>
               </Reveal>

               <Reveal delay={800} y={20} duration={1200}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                     <Link to="/dashboard">
                        <Button size="lg" className="px-12 h-16 text-lg rounded-2xl shadow-2xl shadow-purple-500/20">
                           Get Started for Free <ArrowRight className="ml-3 w-5 h-5" />
                        </Button>
                     </Link>
                     <div className="flex items-center gap-4 px-6 py-4 glass rounded-2xl border-white/5">
                        <div className="flex -space-x-3">
                           {[1, 2, 3, 4].map(i => (
                              <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-[#030712]" alt="user" />
                           ))}
                        </div>
                        <span className="text-xs font-bold text-gray-400"><span className="text-white">50k+</span> creators onboard</span>
                     </div>
                  </div>
               </Reveal>
            </div>
         </section>

         {/* AI Icons Carousel */}
         <section className="py-10 border-y border-white/5 bg-white/[0.01] overflow-hidden">
            <div className="relative pause-on-hover">
               <div className="flex animate-scroll whitespace-nowrap gap-12 w-max items-center">
                  {[...integrationIcons, ...integrationIcons, ...integrationIcons].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 group cursor-default">
                        <div className="text-purple-400 group-hover:scale-110 transition-transform duration-300">
                           {item.icon}
                        </div>
                        <span className="text-gray-400 font-bold text-sm tracking-tight group-hover:text-white transition-colors uppercase tabular-nums">
                           {item.name}
                        </span>
                     </div>
                  ))}
               </div>
               {/* Fades for smooth entry/exit */}
               <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
               <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />
            </div>
         </section>

         {/* Before/After Showcase */}
         <Reveal>
            <section className="py-24 px-4 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                     <h2 className="text-4xl font-black font-satoshi tracking-tight mb-4">The Precision <span className="text-purple-500 italic">Difference</span></h2>
                     <p className="text-gray-500 max-w-xl mx-auto">See how PromptGenieX transforms generic requests into industrial-grade instructions.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <Reveal x={-40} delay={200} duration={1200}>
                        <div className="glass p-8 rounded-[3rem] border-red-500/10 bg-red-500/[0.02] relative group">
                           <div className="absolute top-6 right-6 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">Generic Input</div>
                           <div className="mb-6 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500">
                              <XCircle className="w-6 h-6" />
                           </div>
                           <h3 className="text-xl font-bold mb-4">"Write me a blog post about AI."</h3>
                           <div className="space-y-3 opacity-60">
                              <div className="h-4 w-full bg-white/5 rounded-full" />
                              <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                              <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                           </div>
                           <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-600">Model Response: Generic, flat, uninspired.</span>
                           </div>
                        </div>
                     </Reveal>

                     <Reveal x={40} delay={400} duration={1200}>
                        <div className="glass p-8 rounded-[3rem] border-purple-500/20 bg-purple-500/[0.02] shadow-3xl shadow-purple-500/10 relative group border-2">
                           <div className="absolute top-6 right-6 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">PromptGenieX Output</div>
                           <div className="mb-6 w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white">
                              <Sparkles className="w-6 h-6" />
                           </div>
                           <h3 className="text-xl font-bold mb-4 font-mono text-purple-300">"ACT AS AN ELITE TECH CURATOR..."</h3>
                           <div className="font-mono text-xs text-gray-400 space-y-2 leading-relaxed">
                              <p><span className="text-purple-400 font-black">[ROLE]</span> Expert authority in Generative AI architecture.</p>
                              <p><span className="text-purple-400 font-black">[GOAL]</span> Draft a 1200-word deep dive into transformer logic.</p>
                              <p><span className="text-purple-400 font-black">[STYLE]</span> Technical but accessible; Wired-magazine prose.</p>
                              <p><span className="text-purple-400 font-black">[GUARD]</span> No buzzwords. No 'In the fast-paced world of AI'.</p>
                           </div>
                           <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-400">Model Response: High-fidelity, authoritative, unique.</span>
                              <Lightning className="w-5 h-5 text-emerald-400 animate-pulse" />
                           </div>
                        </div>
                     </Reveal>
                  </div>
               </div>
            </section>
         </Reveal>

         {/* Expanded Engineering Pipeline */}
         <Reveal>
            <section className="py-32 px-4 relative overflow-hidden">
               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col lg:flex-row items-center gap-20">
                     <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                           <Workflow className="w-4 h-4" /> Engineering Standards
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black font-satoshi tracking-tighter leading-none mb-8">
                           The Multi-Stage <br /> <span className="text-purple-500">Compiler</span> Pipeline.
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12">
                           Our architecture doesn't just "wrap" your prompt. We run a 4-stage optimization cycle that forces LLMs into a specific logical state.
                        </p>

                        <div className="space-y-12">
                           <Reveal y={20} delay={100} duration={800}>
                              <PipelineStep num="01" title="Semantic Deconstruction" desc="We parse your input for entities, hidden constraints, and target intent vectors." />
                           </Reveal>
                           <Reveal y={20} delay={200} duration={800}>
                              <PipelineStep num="02" title="Logic Pattern Mapping" desc="Assigning Chain-of-Thought or Tree-of-Thought reasoning based on complexity." />
                           </Reveal>
                           <Reveal y={20} delay={300} duration={800}>
                              <PipelineStep num="03" title="Role-Play & Persona Injection" desc="Defining a high-density domain authority persona to eliminate generic fluff." />
                           </Reveal>
                           <Reveal y={20} delay={400} duration={800}>
                              <PipelineStep num="04" title="Model-Specific Adaptation" desc="Injecting native parameters (MJ, Claude XML, GPT system tags) for the target platform." />
                           </Reveal>
                        </div>
                     </div>

                     <div className="lg:w-1/2 relative">
                        <div className="glass p-2 rounded-[3.5rem] border-white/5 shadow-4xl bg-black/40 backdrop-blur-3xl overflow-hidden">
                           <div className="bg-[#030712] rounded-[3rem] p-10 font-mono text-sm min-h-[500px] relative overflow-hidden">
                              <div className="flex gap-2 mb-8">
                                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                 <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                              </div>

                              <div className="space-y-6 text-gray-500">
                                 <div className="animate-in fade-in slide-in-from-left duration-500">
                                    <span className="text-purple-400">compiling</span> intent_v2.4.logic...
                                 </div>
                                 <div className="animate-in fade-in slide-in-from-left duration-700 delay-300">
                                    <span className="text-emerald-400">parsing</span> core_entities [MARKETING, SAAS, CONVERSION]
                                 </div>
                                 <div className="animate-in fade-in slide-in-from-left duration-700 delay-500">
                                    <span className="text-blue-400">mapping</span> reasoning_pattern: <span className="text-white">CO_THOUGHT</span>
                                 </div>
                                 <div className="pt-4 border-t border-white/5 text-gray-300">
                                    <span className="text-purple-500"># SYSTEM_INSTRUCTION_GEN</span>
                                    <p className="mt-4">Act as a Senior Conversion Architect.</p>
                                    <p>Objective: Engineer a high-fidelity hook stack.</p>
                                    <p>Constraints: [No_Buzzwords, Markdown_Strict]</p>
                                 </div>
                                 <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 animate-pulse">
                                    <div className="h-1 w-24 bg-purple-500/20 rounded-full overflow-hidden">
                                       <div className="h-full w-2/3 bg-purple-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-purple-400">LOGIC_OPTIMIZED 89%</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl border-emerald-500/20 shadow-2xl animate-bounce duration-[4000ms]">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                                 <Activity className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Latency</p>
                                 <p className="text-lg font-black font-satoshi">142ms <span className="text-[10px] text-emerald-500">Fast</span></p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </Reveal>

         {/* Professional Use Cases - Solution Showcase */}
         <Reveal>
            <section className="py-32 px-4 border-y border-white/5 bg-white/[0.01]">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-24">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Market Leadership
                     </div>
                     <h2 className="text-4xl md:text-6xl font-black font-satoshi mb-6 tracking-tight">One Tool. <span className="text-purple-500">Endless</span> Solutions.</h2>
                     <p className="text-gray-500 max-w-2xl mx-auto font-medium">PromptGenieX is the force multiplier for elite professionals across every domain.</p>
                  </div>

                  <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-8 pb-8 md:pb-0 scrollbar-hide md:grid-cols-3">
                     {useCases.map((useCase, idx) => (
                        <Reveal key={idx} delay={idx * 150} y={40} threshold={0.1}>
                           <div className="glass p-10 md:p-12 rounded-[3.5rem] md:rounded-[4rem] border-white/5 hover:border-purple-500/20 transition-all group flex flex-col h-full shadow-2xl relative overflow-hidden min-w-[300px] w-[85vw] md:w-auto md:min-w-0 snap-center shrink-0">
                              <div className="absolute top-0 right-0 p-8">
                                 <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">{useCase.metric}</div>
                              </div>
                              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-10 group-hover:scale-110 transition-transform shadow-inner">
                                 {useCase.icon}
                              </div>
                              <h3 className="text-3xl font-black font-satoshi mb-6 leading-tight">{useCase.title}</h3>
                              <p className="text-gray-500 text-sm leading-relaxed mb-10 flex-1">{useCase.desc}</p>

                              <div className="space-y-4 mb-10">
                                 {useCase.benefits.map((benefit, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-3">
                                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{benefit}</span>
                                    </div>
                                 ))}
                              </div>

                              <Link
                                 to={`/dashboard?intent=${encodeURIComponent(useCase.sampleIntent)}&tool=${encodeURIComponent(useCase.tool)}&category=${encodeURIComponent(useCase.category)}`}
                                 className="w-full"
                              >
                                 <Button variant="secondary" className="w-full rounded-2xl h-14 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                    Deploy for {useCase.title.split(' ')[1]}
                                 </Button>
                              </Link>
                           </div>
                        </Reveal>
                     ))}
                  </div>
               </div>
            </section>
         </Reveal>

         {/* Visual Platform Showcase */}
         <section className="py-32 px-4">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="relative order-2 lg:order-1">
                     <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
                     <div className="grid grid-cols-2 gap-6">
                        <Reveal delay={100} x={-20} y={20} blur>
                           <PlatformCard name="Midjourney" engine="Visual" icon={<ImageIcon className="w-5 h-5" />} desc="Lighting, focal length, and parameter logic injection." color="purple" />
                        </Reveal>
                        <Reveal delay={200} x={20} y={20} blur>
                           <PlatformCard name="Claude" engine="Logic" icon={<Globe className="w-5 h-5" />} desc="XML tagging and chain-of-thought architectural framing." color="orange" />
                        </Reveal>
                        <Reveal delay={300} x={-20} y={20} blur>
                           <PlatformCard name="GPT-4" engine="Omni" icon={<Cpu className="w-5 h-5" />} desc="System-buffer optimization and role-play density." color="emerald" />
                        </Reveal>
                        <Reveal delay={400} x={20} y={20} blur>
                           <PlatformCard name="ElevenLabs" engine="Voice" icon={<Mic2 className="w-5 h-5" />} desc="Performance markers and emotional scripting cues." color="blue" />
                        </Reveal>
                     </div>
                  </div>

                  <div className="order-1 lg:order-2">
                     <Reveal x={40} delay={200}>
                        <h2 className="text-4xl md:text-6xl font-black font-satoshi mb-8 tracking-tight">Platform-Native <br /> <span className="text-purple-500">Optimization</span>.</h2>
                     </Reveal>
                     <Reveal x={40} delay={300}>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                           Every AI model has its own unique reasoning logic. We don't just write prompts; we architect code that speaks natively to each model's internal transformer weights.
                        </p>
                     </Reveal>
                     <ul className="space-y-6">
                        <Reveal x={40} delay={400}>
                           <li className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                 <Braces className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium text-gray-500">Syntax-aware compilation for 12+ leading platforms.</p>
                           </li>
                        </Reveal>
                        <Reveal x={40} delay={500}>
                           <li className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                 <Maximize2 className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium text-gray-500">Resolution and parameter injection for visual tools.</p>
                           </li>
                        </Reveal>
                     </ul>
                     <Reveal x={40} delay={600}>
                        <div className="mt-12">
                           <Link to="/dashboard">
                              <Button size="lg" className="rounded-2xl px-10">Try Workspace</Button>
                           </Link>
                        </div>
                     </Reveal>
                  </div>
               </div>
            </div>
         </section>

         {/* Features Grid - ROI Focused */}
         <Reveal>
            <section className="py-32 px-4 border-t border-white/5 bg-white/[0.01]">
               <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-24">
                     <h2 className="text-4xl font-black font-satoshi tracking-tight">Why Pros <span className="text-purple-500">Choose</span> Us</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <Reveal delay={100} y={30}>
                        <FeatureBlock title="Zero Drift" desc="Mathematical instruction sets that prevent the AI from losing track of your goals." icon={<Target className="w-5 h-5" />} />
                     </Reveal>
                     <Reveal delay={200} y={30}>
                        <FeatureBlock title="Private Vault" desc="AES-256 encrypted storage for your proprietary business patterns." icon={<Lock className="w-5 h-5" />} />
                     </Reveal>
                     <Reveal delay={300} y={30}>
                        <FeatureBlock title="Version Control" desc="Roll back or refine iterations of your prompts with a single click." icon={<History className="w-5 h-5" />} />
                     </Reveal>
                     <Reveal delay={400} y={30}>
                        <FeatureBlock title="Variable Injection" desc="Create modular templates with dynamic slots for automated workflows." icon={<Database className="w-5 h-5" />} />
                     </Reveal>
                  </div>
               </div>
            </section>
         </Reveal>

         {/* Discovery Gallery Preview */}
         <section className="py-24 bg-white/[0.01] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-12">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                     <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <TrendingUp className="w-4 h-4" /> Trending Patterns
                     </div>
                     <h2 className="text-5xl font-black font-satoshi tracking-tight">Discovery Gallery</h2>
                  </div>
                  <Link to="/dashboard?view=library" className="text-sm font-bold text-gray-500 hover:text-white transition-colors flex items-center gap-2 mb-2">
                     Browse All 1,200+ Prompts <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>

            <div className="relative pause-on-hover">
               <div className="flex animate-scroll whitespace-nowrap gap-6 w-max px-4">
                  {[...TEMPLATES, ...TEMPLATES].map((tmpl, idx) => (
                     <div key={idx} className="w-[340px] inline-block whitespace-normal shrink-0">
                        <PromptPreviewCard {...tmpl} />
                     </div>
                  ))}
               </div>
               <div className="absolute top-0 left-0 w-60 h-full bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
               <div className="absolute top-0 right-0 w-60 h-full bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />
            </div>
         </section>

         {/* Customer Testimonials Carousel */}
         <section className="py-32 bg-[#030712] overflow-hidden border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 mb-16">
               <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                     <Users className="w-4 h-4" /> Trusted by the Best
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black font-satoshi tracking-tight">Wall of Love</h2>
               </div>
            </div>

            <div className="relative pause-on-hover">
               <div className="flex animate-scroll-reverse whitespace-nowrap gap-8 w-max px-4">
                  {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
                     <div key={idx} className="w-[450px] glass p-10 rounded-[3rem] border-white/5 inline-block whitespace-normal shrink-0 hover:border-purple-500/30 transition-all group">
                        <div className="flex items-center gap-5 mb-8">
                           <img src={t.avatar} className="w-14 h-14 rounded-full border-2 border-purple-500/20" alt={t.name} />
                           <div>
                              <h4 className="font-black text-lg text-white group-hover:text-purple-300 transition-colors">{t.name}</h4>
                              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{t.role}</p>
                           </div>
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium italic">"{t.content}"</p>
                        <div className="mt-8 flex gap-1.5">
                           {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                        </div>
                     </div>
                  ))}
               </div>
               <div className="absolute top-0 left-0 w-60 h-full bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
               <div className="absolute top-0 right-0 w-60 h-full bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />
            </div>
         </section>

         {/* Final Call to Action */}
         <section className="px-4 py-40 text-center relative overflow-hidden border-t border-white/5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />
            <Reveal y={30} blur duration={1500}>
               <h2 className="text-5xl md:text-8xl font-black font-satoshi mb-12 tracking-tighter">Build it <span className="gradient-text italic">Properly</span>.</h2>
            </Reveal>
            <Reveal y={20} delay={300} duration={1000}>
               <div className="flex flex-col items-center gap-6">
                  <Link to="/dashboard">
                     <Button size="lg" className="px-16 h-20 text-2xl rounded-[2rem] shadow-3xl shadow-purple-500/30 font-black">
                        Enter Workspace
                     </Button>
                  </Link>
               </div>
            </Reveal>
         </section>

         {/* Back to Top Button */}
         <div
            className={`fixed bottom-10 right-10 z-50 transition-all duration-500 transform ${showScroll ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
               }`}
         >
            <button
               onClick={scrollToTop}
               className="w-14 h-14 rounded-2xl bg-purple-500 text-white shadow-2xl shadow-purple-500/40 flex items-center justify-center hover:bg-purple-600 hover:scale-110 active:scale-95 transition-all group"
               aria-label="Back to top"
            >
               <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </button>
         </div>
      </div>
   );
};

/* Mini Components for Landing */

const PromptPreviewCard: React.FC<{ title: string, intent: string, category: string, tool: string }> = ({ title, intent, category, tool }) => (
   <div className="bg-[#0c0f1a] p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/40 transition-all group cursor-pointer h-[320px] flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-8">
         <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-all">
            {category === 'Image' && <ImageIcon className="w-6 h-6" />}
            {category === 'Marketing' && <Megaphone className="w-6 h-6" />}
            {category === 'Code' && <Code className="w-6 h-6" />}
            {category === 'Social Media' && <Zap className="w-6 h-6" />}
            {category === 'Logo' && <Shapes className="w-6 h-6" />}
            {category === 'Voice' && <Mic2 className="w-6 h-6" />}
            {category === 'Audio' && <Music className="w-6 h-6" />}
            {category === 'Video' && <Video className="w-6 h-6" />}
            {category === 'Business' && <Briefcase className="w-6 h-6" />}
            {category === 'UI/UX' && <Palette className="w-6 h-6" />}
         </div>
         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-black text-gray-400">4.9</span>
         </div>
      </div>

      <div className="flex-1">
         <h4 className="text-xl font-black font-satoshi mb-3 text-white group-hover:text-purple-300 transition-colors leading-tight">{title}</h4>
         <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed font-medium">{intent}</p>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">{tool}</span>
         <Link
            to={`/dashboard?intent=${encodeURIComponent(intent)}&tool=${encodeURIComponent(tool)}&category=${encodeURIComponent(category)}`}
            className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 hover:text-white hover:bg-purple-500 transition-all"
         >
            <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
   </div>
);

const PipelineStep: React.FC<{ num: string, title: string, desc: string }> = ({ num, title, desc }) => (
   <div className="flex gap-6 items-start group">
      <div className="text-4xl font-black text-white/[0.03] group-hover:text-purple-500/10 transition-colors tabular-nums">{num}</div>
      <div>
         <h4 className="text-lg font-bold font-satoshi mb-1 text-white group-hover:text-purple-400 transition-colors">{title}</h4>
         <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
   </div>
);

const PlatformCard: React.FC<{ name: string, engine: string, icon: React.ReactNode, desc: string, color: string }> = ({ name, engine, icon, desc, color }) => {
   const colorMap: any = {
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
   };
   return (
      <div className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group shadow-xl">
         <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 ${colorMap[color]}`}>
            {icon}
         </div>
         <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-black font-satoshi tracking-tight">{name}</h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{engine}</span>
         </div>
         <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
   );
};

const FeatureBlock: React.FC<{ title: string, desc: string, icon: React.ReactNode }> = ({ title, desc, icon }) => (
   <div className="glass p-10 rounded-[3rem] border-white/5 hover:border-purple-500/20 transition-all group flex flex-col shadow-xl">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
         {icon}
      </div>
      <h3 className="text-xl font-black font-satoshi mb-3">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
   </div>
);

const StatItem: React.FC<{ label: string, value: string, icon: React.ReactNode }> = ({ label, value, icon }) => {
   const animatedValue = useCounter(value);

   return (
      <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col items-center text-center group hover:border-purple-500/30 transition-all shadow-xl">
         <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
            {icon}
         </div>
         <h4 className="text-3xl font-black font-satoshi mb-1">{animatedValue}</h4>
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</p>
      </div>
   );
};
