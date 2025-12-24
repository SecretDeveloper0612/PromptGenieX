
import React, { useState } from 'react';
import { 
  MessageSquare, Mail, Book, Terminal, ArrowRight, LifeBuoy, 
  Search, ChevronDown, ChevronUp, Zap, Shield, Sparkles,
  Globe, Clock, Headphones, MessageCircle, HelpCircle,
  AlertCircle, FileText, Cpu, Layout, Send, Users
} from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: "How do I optimize prompts for specific models?",
    a: "PromptGenieX uses model-specific logic mapping. Select your target engine (e.g., Claude 3.5) in the workspace, and our compiler will automatically inject the necessary XML tags, system framing, and parameter syntax required for peak performance on that architecture."
  },
  {
    q: "Can I use engineered prompts for commercial projects?",
    a: "Yes. You retain 100% ownership of the master prompts generated. PromptGenieX acts as your engineering compiler; the final instructions and their subsequent AI outputs are yours to use commercially without attribution."
  },
  {
    q: "What is the 'Visual Context Vector' system?",
    a: "It's our multi-modal synthesis engine. When you upload an image, we extract technical visual metadata (lighting temperature, focal length, stylistic weight) and translate those into high-fidelity text instructions that visual AI models understand."
  },
  {
    q: "How secure is my private prompt vault?",
    a: "We use AES-256 client-side encryption. Your data is encrypted before it leaves your browser, meaning even our team cannot read your proprietary prompt patterns. We never train our models on your private data."
  }
];

export const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Search Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-hero-glow" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <LifeBuoy className="w-3 h-3" /> 24/7 Global Support
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-satoshi tracking-tighter mb-8 leading-none">
            How can we <span className="text-purple-500 italic">Help</span> you?
          </h1>
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search documentation, patterns, or system status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-16 pr-8 py-6 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-gray-700 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Primary Channels */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <SupportCard 
          icon={<Book className="w-6 h-6" />}
          title="Knowledge Base"
          desc="Deep dives into model logic, engineering patterns, and universal frameworks."
          link="/documentation"
          cta="Read Docs"
          color="blue"
        />
        <SupportCard 
          icon={<MessageCircle className="w-6 h-6" />}
          title="Community Lab"
          desc="Join 12k+ prompt engineers on Discord to share patterns and get live help."
          link="#"
          cta="Join Discord"
          color="purple"
        />
        <SupportCard 
          icon={<AlertCircle className="w-6 h-6" />}
          title="System Status"
          desc="Check real-time performance of our compiler engines and API infrastructure."
          link="/status"
          cta="View Status"
          color="emerald"
        />
      </section>

      {/* Main Support Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <h2 className="text-4xl font-black font-satoshi tracking-tight mb-4">Popular Inquiries</h2>
            <p className="text-gray-500 font-medium">Quick solutions for common engineering challenges.</p>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="glass rounded-[2rem] border-white/5 overflow-hidden transition-all shadow-xl">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-lg font-bold font-satoshi tracking-tight">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${openFaq === idx ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-400 font-medium leading-relaxed border-t border-white/5 pt-6">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-10 glass rounded-[3rem] border-purple-500/10 bg-purple-500/5 relative overflow-hidden group">
            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-purple-500/5 group-hover:text-purple-500/10 transition-all" />
            <h3 className="text-2xl font-black font-satoshi mb-4">Engineering Consulting</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Need custom prompt logic for high-scale enterprise workflows? Our Agency tier includes direct access to senior prompt architects.
            </p>
            <Link to="/pricing">
              <Button variant="outline" size="sm" className="rounded-xl px-6">Explore Agency Plan</Button>
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-5">
          <div className="glass p-10 md:p-14 rounded-[4rem] border-white/5 shadow-2xl sticky top-28">
            <div className="mb-10">
              <h2 className="text-3xl font-black font-satoshi tracking-tight mb-2">Still need a Human?</h2>
              <p className="text-gray-500 text-sm font-medium">Submit a priority ticket and we'll get back to you within 4 hours.</p>
            </div>

            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 text-emerald-400 mb-6 shadow-2xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black font-satoshi mb-2">Ticket Received</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Our engineering team has been notified. You'll receive an email update shortly.
                </p>
                <Button variant="secondary" onClick={() => setFormSubmitted(false)} className="mt-8 rounded-xl px-8">New Inquiry</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Your Identity</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-bold transition-all placeholder:text-gray-800" />
                    <input type="email" placeholder="Email" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-bold transition-all placeholder:text-gray-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Support Category</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-bold transition-all appearance-none cursor-pointer">
                    <option className="bg-gray-900">General Technical Help</option>
                    <option className="bg-gray-900">Billing & Subscription</option>
                    <option className="bg-gray-900">Pattern Optimization Advice</option>
                    <option className="bg-gray-900">API Access Request</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The Challenge</label>
                  <textarea 
                    placeholder="Describe the logic drift or technical barrier you're encountering..."
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-6 h-40 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium leading-relaxed placeholder:text-gray-800"
                  />
                </div>

                <Button type="submit" className="w-full h-16 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-purple-500/20">
                  Deploy Ticket <Send className="ml-3 w-5 h-5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Global Presence */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem icon={<Globe className="w-5 h-5" />} label="Global Nodes" value="24/7" />
            <StatItem icon={<Headphones className="w-5 h-5" />} label="Response Time" value="< 4h" />
            <StatItem icon={<Users className="w-5 h-5" />} label="Community" value="12k+" />
            <StatItem icon={<CheckCircle2 className="w-5 h-5" />} label="Resolution Rate" value="99%" />
          </div>
        </div>
      </section>
    </div>
  );
};

const SupportCard: React.FC<{ 
  icon: React.ReactNode, 
  title: string, 
  desc: string, 
  link: string, 
  cta: string,
  color: 'purple' | 'blue' | 'emerald'
}> = ({ icon, title, desc, link, cta, color }) => {
  const colors = {
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5'
  };

  return (
    <Link to={link} className={`glass p-10 rounded-[3rem] border-white/5 hover:border-white/10 transition-all group flex flex-col shadow-2xl ${colors[color]}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-white/5`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black font-satoshi mb-4 text-white">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-1">{desc}</p>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-400 group-hover:text-white transition-colors">
        {cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

const StatItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="text-center group">
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 text-gray-500 group-hover:text-purple-400 transition-all">
      {icon}
    </div>
    <p className="text-2xl font-black font-satoshi text-white mb-1">{value}</p>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
  </div>
);

const CheckCircle2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);
