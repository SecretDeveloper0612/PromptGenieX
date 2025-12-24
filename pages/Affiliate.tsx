
import React, { useState } from 'react';
import { Rocket, Percent, Users, Award, ArrowRight, Sparkles, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';

export const Affiliate: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col justify-center">
      <div className="relative text-center mb-24">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-hero-glow" />

        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Status: Coming Soon
          </div>
        </div>

        <h1 className="text-6xl md:text-9xl font-black font-satoshi tracking-tighter mb-8 leading-[0.85]">
          Earn with the <br /> <span className="animate-shimmer italic">Best</span> in Class.
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
          The PromptGenieX Affiliate Portal is currently under construction. Get ready to earn <span className="text-white">30% recurring commissions</span> for life.
        </p>

        <div className="flex flex-wrap justify-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Launching Q3 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Partnerships Only</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <BenefitCard
          icon={<Percent className="w-6 h-6" />}
          title="Lifetime Revenue"
          desc="Not just a one-time bonus. Earn 30% recurring commission as long as your referrals stay active."
        />
        <BenefitCard
          icon={<Users className="w-6 h-6" />}
          title="Conversion Optimized"
          desc="Our high-conversion landing pages and engineered funnels do the selling for you."
        />
        <BenefitCard
          icon={<Award className="w-6 h-6" />}
          title="Exclusive Assets"
          desc="Get access to custom banners, social media kits, and direct engineering support."
        />
      </div>

      <div className="glass p-12 md:p-24 rounded-[4rem] border-white/5 relative overflow-hidden text-center shadow-4xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
            <Rocket className="text-purple-400 w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black font-satoshi tracking-tight mb-6">Secure Early Access</h2>
          <p className="text-gray-400 text-lg font-medium mb-12 leading-relaxed">
            Our private beta is nearly full. Join the waitlist now to receive your unique referral link as soon as we launch.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 text-emerald-400 mb-4 shadow-2xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <p className="text-2xl font-black font-satoshi tracking-tight">You're on the A-List</p>
              <p className="text-gray-500 font-medium">We'll notify you the moment the portal goes live.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your professional email"
                className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-bold text-lg transition-all placeholder:text-gray-700"
              />
              <Button size="lg" className="h-[72px] px-12 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] whitespace-nowrap shadow-2xl shadow-purple-500/20">
                Join Waitlist <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="glass p-12 rounded-[3.5rem] border-white/5 hover:border-purple-500/20 transition-all group shadow-2xl">
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 mb-10 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all shadow-inner border border-white/5">
      {icon}
    </div>
    <h3 className="text-2xl font-black font-satoshi mb-4 leading-tight">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);
