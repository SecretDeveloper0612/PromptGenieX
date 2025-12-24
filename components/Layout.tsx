
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles, LayoutDashboard, CreditCard, Menu, X, User,
  Settings as SettingsIcon, BookOpen, Send, Github,
  Twitter, Youtube, Instagram, MessageSquare, ArrowRight
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-white/5 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold font-satoshi tracking-tight">
              PromptGenie<span className="text-purple-500">X</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-400 ${location.pathname === link.path ? 'text-purple-400' : 'text-gray-400'
                  }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-white/10 mx-2" />
            <Link to="/auth">
              <button className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

      </nav>

      {/* Mobile Side Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Side Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] z-[70] md:hidden glass backdrop-blur-3xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <span className="font-bold font-satoshi text-lg tracking-tight">Navigation</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 text-xl font-bold font-satoshi group ${location.pathname === link.path ? 'text-purple-400' : 'text-gray-400'
                  }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${location.pathname === link.path ? 'bg-purple-500 text-white' : 'bg-white/5'
                  }`}>
                  <link.icon className="w-6 h-6" />
                </div>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="p-8 border-t border-white/5">
            <Link
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 p-5 rounded-[2rem] bg-purple-600 text-white font-black font-satoshi uppercase tracking-widest text-xs shadow-xl shadow-purple-500/20"
            >
              <User className="w-5 h-5" />
              Access Account
              <ArrowRight className="ml-auto w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-20 pb-12 px-4 md:px-8 mt-auto bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            {/* Branding & Socials */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white w-6 h-6" />
                </div>
                <span className="font-bold font-satoshi text-2xl tracking-tight">PromptGenieX AI</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-medium">
                The professional edge in prompt engineering. Architecting high-fidelity instructions for the next generation of builders and visionaries.
              </p>
              <div className="flex items-center gap-4">
                <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<MessageSquare className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                <SocialIcon icon={<Youtube className="w-5 h-5" />} href="#" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Platform</h4>
                <ul className="space-y-3">
                  <li><FooterLink to="/">Overview</FooterLink></li>
                  <li><FooterLink to="/dashboard">Workspace</FooterLink></li>
                  <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                  <li><FooterLink to="/dashboard?view=library">Library</FooterLink></li>
                  <li><FooterLink to="/affiliate">Affiliate Program</FooterLink></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Resources</h4>
                <ul className="space-y-3">
                  <li><FooterLink to="/documentation">Documentation</FooterLink></li>
                  <li><FooterLink to="/status">System Status</FooterLink></li>
                  <li><FooterLink to="/support">Support Center</FooterLink></li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-4 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Join the Lab</h4>
              <p className="text-sm text-gray-500 font-medium">Receive the latest prompt engineering patterns and model updates directly in your inbox.</p>
              <form onSubmit={handleSubscribe} className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-gray-700"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                  Success! You're now on the list.
                </p>
              )}
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              © {new Date().getFullYear()} PromptGenieX AI. Precision Engineered.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-purple-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-purple-400 transition-colors">Terms</Link>
              <Link to="/status" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-purple-400 transition-colors">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode, href: string }> = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-purple-500/10 hover:border-purple-500/20 transition-all group"
  >
    <div className="group-hover:scale-110 transition-transform">
      {icon}
    </div>
  </a>
);

const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-sm font-medium text-gray-500 hover:text-purple-400 transition-colors">
    {children}
  </Link>
);
