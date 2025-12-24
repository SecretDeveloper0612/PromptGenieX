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

export const Landing: React.FC = () => {
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior AI Researcher",
      company: "NeuralSoft",
      content: "The Logic Mapper is a game changer. It reduced our hallucination rate by 40% overnight. We don't ship without PromptSmith anymore.",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Marcus Thorne",
      role: "Creative Director",
      company: "StudioVibe",
      content: "Midjourney prompts used to be a guessing game. Now, I get gallery-quality results on the first generation every single time.",
      avatar: "https://i.pravatar.cc/150?u=marcus"
    },
    {
      name: "Elena Rodriguez",
      role: "Growth Lead",
      company: "SaaSFlow",
      content: "Turning messy ideas into crystal-clear marketing logic saved our content team hundreds of hours per month.",
      avatar: "https://i.pravatar.cc/150?u=elena"
    },
    {
      name: "David Park",
      role: "Fullstack Architect",
      company: "DevGrid",
      content: "The Claude XML tagging engine in PromptSmith is incredible. It makes generating complex microservices feel like magic.",
      avatar: "https://i.pravatar.cc/150?u=david"
    },
    {
      name: "Jordan Lee",
      role: "Freelance Visionary",
      company: "Self-Employed",
      content: "The Private Vault alone is worth the price. Having all my high-performance patterns in one secure library is essential.",
      avatar: "https://i.pravatar.cc/150?u=jordan"
    }
  ];

  const useCases = [
    {
      title: "For Developers",
      icon: <Code className="w-6 h-6" />,
      desc: "Generate complex boilerplate, refactor legacy code, and write comprehensive test suites with logic-aware prompts.",
      sampleIntent: "Generate a production-ready React component for a data dashboard with Tailwind and Framer Motion.",
      category: "Code"
    },
    {
      title: "For Marketers",
      icon: <Megaphone className="w-6 h-6" />,
      desc: "Craft high-converting ad copy and social hooks that actually sound human and adhere to brand voice constraints.",
      sampleIntent: "Create a high-converting Facebook Ad copy for a luxury travel brand targeting high-net-worth individuals.",
      category: "Marketing"
    },
    {
      title: "For Designers",
      icon: <Palette className="w-6 h-6" />,
      desc: "Bridge the gap between vision and execution. Get pixel-perfect UI descriptions and studio-quality lighting prompts.",
      sampleIntent: "Create a minimalist UI concept for a mobile banking app with glassmorphism and deep purple accents.",
      category: "UI/UX"
    }
  ];

  return (
    <div className="relative overflow-hidden selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="px-4 pt-28 pb-10 md:pt-40 md:pb-20 relative min-h-[85vh] flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[160px] animate-hero-glow -z-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-reveal delay-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Engineering the Future of AI Interaction
          </div>
          <h1 className="text-6xl md:text-9xl font-black font-satoshi leading-[0.9] mb-10 tracking-tighter animate-reveal delay-200">
            Master the <span className="animate-shimmer italic">Art</span> of <br className="hidden md:block" /> AI Prompting.
          </h1>
          <p className="text-xl text-gray-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium animate-reveal delay-300">
            Join 50,000+ creators using PromptSmith to turn raw ideas into high-performance, studio-quality instructions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-reveal delay-500">
            <Link to="/dashboard">
              <Button size="lg" className="px-12 h-16 text-lg rounded-2xl shadow-2xl shadow-purple-500/20 hover:scale-[1.03] transition-soft">
                Get Started for Free <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 glass rounded-2xl border-white/5 animate-reveal delay-700">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-[#030712]" alt="user" />
                  ))}
               </div>
               <span className="text-xs font-bold text-gray-400"><span className="text-white">50k+</span> creators onboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite AI Icons Carousel - Direction: Right */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden pause-on-hover relative animate-reveal delay-1000">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-scroll-right whitespace-nowrap gap-12 items-center w-max">
          {[...integrationIcons, ...integrationIcons, ...integrationIcons, ...integrationIcons].map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 px-8 py-4 glass rounded-[2rem] border-white/5 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-soft cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-soft">
                {item.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-purple-400 transition-soft">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After Showcase */}
      <section className="py-32 px-4 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 animate-reveal">
              <h2 className="text-4xl font-black font-satoshi tracking-tight mb-4">The Precision <span className="text-purple-500 italic">Difference</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto font-medium">See how PromptSmith transforms generic requests into industrial-grade instructions.</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="glass p-10 rounded-[3rem] border-red-500/10 bg-red-500/[0.02] relative group animate-reveal delay-200">
                 <div className="absolute top-8 right-8 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">Generic Input</div>
                 <div className="mb-6 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500">
                    <XCircle className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-4">"Write me a blog post about AI."</h3>
                 <div className="space-y-3 opacity-60">
                    <div className="h-4 w-full bg-white/5 rounded-full" />
                    <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                    <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                 </div>
              </div>

              <div className="glass p-10 rounded-[3rem] border-purple-500/20 bg-purple-500/[0.02] shadow-3xl shadow-purple-500/10 relative group border-2 animate-reveal delay-300">
                 <div className="absolute top-8 right-8 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">PromptSmith Output</div>
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
              </div>
           </div>
        </div>
      </section>

      {/* Expanded Engineering Pipeline */}
      <section className="py-40 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2 space-y-8 animate-reveal">
                <div className="inline-flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                   <Workflow className="w-4 h-4" /> Engineering Standards
                </div>
                <h2 className="text-5xl md:text-7xl font-black font-satoshi tracking-tighter leading-none">
                  The Multi-Stage <br /> <span className="text-purple-500">Compiler</span> Pipeline.
                </h2>
                <div className="space-y-12">
                   <PipelineStep num="01" title="Semantic Deconstruction" desc="We parse your input for entities, hidden constraints, and target intent vectors." delay="delay-100" />
                   <PipelineStep num="02" title="Logic Pattern Mapping" desc="Assigning Chain-of-Thought or Tree-of-Thought reasoning based on complexity." delay="delay-200" />
                   <PipelineStep num="03" title="Role-Play & Persona Injection" desc="Defining a high-density domain authority persona to eliminate generic fluff." delay="delay-300" />
                   <PipelineStep num="04" title="Model-Specific Adaptation" desc="Injecting native parameters for the target platform." delay="delay-500" />
                </div>
             </div>

             <div className="lg:w-1/2 relative group animate-reveal delay-500">
                <div className="glass p-2 rounded-[3.5rem] border-white/5 shadow-4xl bg-black/40 backdrop-blur-3xl overflow-hidden transform group-hover:scale-[1.02] transition-soft duration-700">
                   <div className="bg-[#030712] rounded-[3rem] p-10 font-mono text-sm min-h-[500px] relative overflow-hidden">
                      <div className="flex gap-2 mb-8">
                         <div className="w-3 h-3 rounded-full bg-red-500/50" />
                         <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                         <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      </div>
                      <div className="space-y-6 text-gray-500">
                         <div className="animate-reveal delay-500">
                            <span className="text-purple-400">compiling</span> intent_v2.4.logic...
                         </div>
                         <div className="animate-reveal delay-700">
                            <span className="text-emerald-400">parsing</span> core_entities [MARKETING, SAAS, CONVERSION]
                         </div>
                         <div className="animate-reveal delay-1000">
                            <span className="text-blue-400">mapping</span> reasoning_pattern: <span className="text-white">CO_THOUGHT</span>
                         </div>
                         <div className="pt-4 border-t border-white/5 text-gray-300 animate-reveal delay-1000">
                            <span className="text-purple-500"># SYSTEM_INSTRUCTION_GEN</span>
                            <p className="mt-4">Act as a Senior Conversion Architect.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Professional Use Cases */}
      <section className="py-40 px-4 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-24 animate-reveal">
              <h2 className="text-4xl md:text-6xl font-black font-satoshi mb-6 tracking-tight">One Tool. <span className="text-purple-500">Endless</span> Solutions.</h2>
              <p className="text-gray-500 font-medium">Engineered patterns for every high-stakes creative workflow.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, idx) => (
                <div key={idx} className={`glass p-12 rounded-[4rem] border-white/5 hover:border-purple-500/20 transition-soft group flex flex-col h-full shadow-2xl relative overflow-hidden animate-reveal delay-${(idx + 1) * 150}`}>
                   <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-10 group-hover:scale-110 transition-soft">
                      {useCase.icon}
                   </div>
                   <h3 className="text-3xl font-black font-satoshi mb-6 leading-tight">{useCase.title}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed mb-10 flex-1">{useCase.desc}</p>
                   <Link 
                     to={`/dashboard?intent=${encodeURIComponent(useCase.sampleIntent)}`}
                     className="w-full"
                   >
                     <Button variant="secondary" className="w-full rounded-2xl h-14 hover:bg-purple-500 hover:text-white transition-soft">
                        Deploy Pattern
                     </Button>
                   </Link>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Discovery Gallery Preview */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 animate-reveal">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-5xl font-black font-satoshi tracking-tight">Discovery Gallery</h2>
               <p className="text-gray-500 font-medium mt-2">Industrial patterns leaked from top studios.</p>
            </div>
            <Link to="/dashboard?view=library" className="text-sm font-bold text-purple-400 flex items-center gap-2 hover:translate-x-1 transition-soft">
              Browse All Patterns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative pause-on-hover animate-reveal delay-300">
          <div className="flex animate-scroll-right whitespace-nowrap gap-6 w-max px-4">
            {[...TEMPLATES, ...TEMPLATES].map((tmpl, idx) => (
              <div key={idx} className="w-[340px] inline-block whitespace-normal shrink-0">
                <PromptPreviewCard {...tmpl} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Carousel - Direction: Left */}
      <section className="py-32 bg-white/[0.01] border-b border-white/5 overflow-hidden pause-on-hover relative">
        <div className="max-w-7xl mx-auto px-4 mb-16 text-center animate-reveal">
          <h2 className="text-4xl md:text-5xl font-black font-satoshi tracking-tight">Loved by Elite Engineers</h2>
          <p className="text-gray-500 font-medium mt-2">Join the ranks of high-performance builders.</p>
        </div>
        
        <div className="relative animate-reveal delay-300">
          <div className="flex animate-scroll-left whitespace-nowrap gap-8 w-max px-4">
            {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="w-[450px] inline-block whitespace-normal shrink-0">
                <TestimonialCard {...t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 py-40 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -z-10 animate-hero-glow" />
        <h2 className="text-5xl md:text-8xl font-black font-satoshi mb-12 tracking-tighter animate-reveal">Build it <span className="gradient-text italic">Properly</span>.</h2>
        <Link to="/dashboard" className="animate-reveal delay-300">
          <Button size="lg" className="px-16 h-20 text-2xl rounded-[2.5rem] shadow-3xl shadow-purple-500/30 font-black hover:scale-[1.05] transition-soft">
            Enter Workspace
          </Button>
        </Link>
      </section>
    </div>
  );
};

/* Mini Components for Landing */

const TestimonialCard: React.FC<{ name: string, role: string, company: string, content: string, avatar: string }> = ({ name, role, company, content, avatar }) => (
  <div className="bg-[#0c0f1a] p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-soft group h-[300px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
    <div className="mb-6 relative z-10">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
      </div>
      <p className="text-gray-400 font-medium leading-relaxed italic text-lg line-clamp-4">
        "{content}"
      </p>
    </div>
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-soft">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="font-black font-satoshi text-white">{name}</h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
          {role} <span className="text-purple-500/60 ml-1">@ {company}</span>
        </p>
      </div>
    </div>
  </div>
);

const PromptPreviewCard: React.FC<{ title: string, intent: string, category: string, tool: string }> = ({ title, intent, category, tool }) => (
  <div className="bg-[#0c0f1a] p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/40 transition-soft group cursor-pointer h-[320px] flex flex-col shadow-2xl">
    <div className="flex items-center justify-between mb-8">
       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-purple-400 group-hover:scale-110 transition-soft">
          {category === 'Image' ? <ImageIcon className="w-6 h-6" /> : <Code className="w-6 h-6" />}
       </div>
    </div>
    <div className="flex-1">
      <h4 className="text-xl font-black font-satoshi mb-3 text-white group-hover:text-purple-300 transition-soft">{title}</h4>
      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed font-medium">{intent}</p>
    </div>
  </div>
);

const PipelineStep: React.FC<{ num: string, title: string, desc: string, delay?: string }> = ({ num, title, desc, delay }) => (
  <div className={`flex gap-6 items-start group animate-reveal ${delay}`}>
     <div className="text-4xl font-black text-white/[0.03] group-hover:text-purple-500/10 transition-soft tabular-nums">{num}</div>
     <div>
        <h4 className="text-lg font-bold font-satoshi mb-1 text-white group-hover:text-purple-400 transition-soft">{title}</h4>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
     </div>
  </div>
);
