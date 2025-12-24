
import React from 'react';
import { Activity, Globe, Cpu, Database, CheckCircle2, Clock } from 'lucide-react';

export const Status: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Activity className="text-emerald-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black font-satoshi tracking-tight">System Status</h1>
            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mt-1">All Systems Operational</p>
          </div>
        </div>
        <div className="px-6 py-3 glass rounded-2xl border-white/5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Uptime 99.98%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <StatusCard name="Core Compiler Engine" status="Operational" icon={<Cpu />} />
        <StatusCard name="Cross-Model Logic Mapper" status="Operational" icon={<Globe />} />
        <StatusCard name="Private Vault (API)" status="Operational" icon={<Database />} />
        <StatusCard name="Dashboard Infrastructure" status="Operational" icon={<Activity />} />
      </div>

      <div className="glass p-10 rounded-[3rem] border-white/5">
        <h3 className="text-xl font-black font-satoshi mb-8 flex items-center gap-3">
          <Clock className="w-5 h-5 text-purple-400" />
          Incident History
        </h3>
        <div className="space-y-8">
          <IncidentRow date="May 12, 2024" title="Scheduled Maintenance" desc="Compiler optimization and token efficiency updates." status="Resolved" />
          <IncidentRow date="April 28, 2024" title="Logic Mapper Drift" desc="Minor latency in cross-model translation for Llama 3 models." status="Resolved" />
          <IncidentRow date="April 05, 2024" title="API Rate Limiting" desc="Enhanced throughput for Agency tier users." status="Resolved" />
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{ name: string, status: string, icon: React.ReactNode }> = ({ name, status, icon }) => (
  <div className="glass p-8 rounded-3xl border-white/5 flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
        {icon}
      </div>
      <span className="font-bold text-gray-300">{name}</span>
    </div>
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">{status}</span>
    </div>
  </div>
);

const IncidentRow: React.FC<{ date: string, title: string, desc: string, status: string }> = ({ date, title, desc, status }) => (
  <div className="flex gap-6 items-start">
    <div className="w-1 h-12 bg-white/5 rounded-full mt-2" />
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{date}</span>
        <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">{status}</span>
      </div>
      <h4 className="text-lg font-bold text-gray-300 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 font-medium">{desc}</p>
    </div>
  </div>
);
