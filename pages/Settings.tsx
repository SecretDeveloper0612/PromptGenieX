
import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Zap, Save, Check, CreditCard, 
  ChevronRight, Lock, Key, Globe, Eye, EyeOff, 
  CreditCard as CardIcon, Receipt, AlertCircle, Plus,
  Info, Cpu, Terminal, Sparkles, Moon, Sun, Palette,
  Download, Trash2, Edit3, Type
} from 'lucide-react';
import { Button } from '../components/Button';
import { UserSettings, TonePreset } from '../types';

type TabType = 'Profile' | 'Appearance' | 'Prompt Defaults' | 'Billing' | 'Security' | 'Notifications';

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  theme: 'dark',
  defaultTone: 'Professional',
  defaultStyle: 'Modern',
  defaultLength: 'Medium',
  preferredModel: 'gemini-3-pro-preview',
  notificationsEnabled: true,
  notifyPatternUpdates: true,
  notifyAccountActivity: true,
  notifyPromptPerformance: false,
  notifyMarketingStrategy: false,
  customSystemInstruction: "",
  tonePresets: [
    { id: '1', name: 'Brand Voice A', description: 'Confident, professional, and slightly futuristic.' },
    { id: '2', name: 'Marketing Tone B', description: 'High-energy, persuasive, and casual.' }
  ],
  hasSeenTutorial: false
};

const downloadInvoice = (date: string, amount: string) => {
  const content = `
    PROMPTSMITH AI - INVOICE
    -------------------------
    Date: ${date}
    Description: Professional Tier Subscription
    Amount: ${amount}
    Status: PAID
    
    Thank you for being part of the elite.
    PromptSmith AI Team
  `;
  
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${date.replace(/ /g, '-')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<TabType>('Profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('promptsmith_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('promptsmith_settings', JSON.stringify(settings));
      
      if (settings.theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }

      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const addTonePreset = () => {
    const newPreset: TonePreset = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Preset',
      description: 'Describe the characteristics of this tone...'
    };
    setSettings({
      ...settings,
      tonePresets: [...(settings.tonePresets || []), newPreset]
    });
  };

  const updateTonePreset = (id: string, field: keyof TonePreset, value: string) => {
    const updated = settings.tonePresets.map(p => p.id === id ? { ...p, [field]: value } : p);
    setSettings({ ...settings, tonePresets: updated });
  };

  const removeTonePreset = (id: string) => {
    setSettings({ ...settings, tonePresets: settings.tonePresets.filter(p => p.id !== id) });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="glass rounded-3xl p-8 space-y-6 shadow-2xl">
              <h3 className="text-xl font-black font-satoshi flex items-center gap-2 tracking-tight">
                <User className="text-purple-400 w-6 h-6" />
                Public Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={settings.name}
                    onChange={e => setSettings({...settings, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={settings.email}
                    onChange={e => setSettings({...settings, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Professional Bio</label>
                <textarea 
                  placeholder="e.g. Senior Prompt Engineer focused on LLM safety and complex reasoning patterns."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 h-28 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium leading-relaxed"
                />
              </div>
            </section>
          </div>
        );

      case 'Appearance':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="glass rounded-3xl p-8 space-y-8 shadow-2xl">
              <div>
                <h3 className="text-xl font-black font-satoshi flex items-center gap-2 mb-1 tracking-tight">
                  <Palette className="text-purple-400 w-6 h-6" />
                  Appearance & Theme
                </h3>
                <p className="text-sm text-gray-500 font-medium">Customize how PromptSmith looks for you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-6 ${
                    settings.theme === 'dark' ? 'border-purple-500 bg-purple-500/10 shadow-xl' : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    settings.theme === 'dark' ? 'bg-purple-500 text-white' : 'bg-black/40 text-gray-500'
                  }`}>
                    <Moon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black font-satoshi mb-1">Deep Space</p>
                    <p className="text-xs text-gray-500 font-medium">Professional dark mode for late night sessions.</p>
                  </div>
                </button>

                <button 
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-6 ${
                    settings.theme === 'light' ? 'border-purple-500 bg-purple-500/10 shadow-xl' : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    settings.theme === 'light' ? 'bg-purple-500 text-white' : 'bg-black/40 text-gray-500'
                  }`}>
                    <Sun className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-black font-satoshi mb-1">Clear Horizon</p>
                    <p className="text-xs text-gray-500 font-medium">Clean light mode for maximum daytime clarity.</p>
                  </div>
                </button>
              </div>
            </section>
          </div>
        );

      case 'Prompt Defaults':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="glass rounded-3xl p-8 space-y-8 shadow-2xl">
              <div>
                <h3 className="text-xl font-black font-satoshi flex items-center gap-2 tracking-tight">
                  <Zap className="text-purple-400 w-6 h-6" />
                  Engineering Presets
                </h3>
                <p className="text-sm text-gray-500 font-medium">Configure the core logic applied to every generation.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Default Global Tone
                  </label>
                  <select 
                    value={settings.defaultTone}
                    onChange={e => setSettings({...settings, defaultTone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 appearance-none cursor-pointer font-bold"
                  >
                    <option className="bg-gray-900">Professional</option>
                    <option className="bg-gray-900">Casual</option>
                    <option className="bg-gray-900">Academic</option>
                    {settings.tonePresets?.map(p => (
                      <option key={p.id} value={p.name} className="bg-gray-900">{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> Preferred Engine
                  </label>
                  <select 
                    value={settings.preferredModel}
                    onChange={e => setSettings({...settings, preferredModel: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 appearance-none cursor-pointer font-bold"
                  >
                    <option className="bg-gray-900" value="gemini-3-pro-preview">Gemini 3 Pro (High Reasoning)</option>
                    <option className="bg-gray-900" value="gemini-3-flash-preview">Gemini 3 Flash (High Speed)</option>
                  </select>
                </div>
              </div>

              {/* Tone Presets Section */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <Type className="text-purple-400 w-5 h-5" />
                    <h4 className="text-lg font-black font-satoshi tracking-tight">Tone Presets</h4>
                  </div>
                  <Button variant="secondary" size="sm" onClick={addTonePreset} className="rounded-xl flex gap-2">
                    <Plus className="w-4 h-4" /> Add Preset
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.tonePresets?.map((preset) => (
                    <div key={preset.id} className="p-6 glass rounded-3xl border-white/5 space-y-4 group">
                      <div className="flex items-center justify-between">
                        <input 
                          type="text"
                          value={preset.name}
                          onChange={(e) => updateTonePreset(preset.id, 'name', e.target.value)}
                          className="bg-transparent text-lg font-black font-satoshi focus:outline-none focus:border-b border-purple-500/50 w-full mr-4"
                        />
                        <button 
                          onClick={() => removeTonePreset(preset.id)}
                          className="p-2 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea 
                        value={preset.description}
                        onChange={(e) => updateTonePreset(preset.id, 'description', e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none h-20 font-medium"
                      />
                    </div>
                  ))}
                  {(!settings.tonePresets || settings.tonePresets.length === 0) && (
                    <div className="col-span-2 py-10 text-center glass rounded-3xl border-dashed border-white/10">
                      <p className="text-gray-500 text-sm italic">No custom tone presets defined yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <label className="text-sm font-black font-satoshi uppercase tracking-tight text-purple-400">Custom Global Instruction</label>
                    </div>
                 </div>
                 <textarea 
                    value={settings.customSystemInstruction}
                    onChange={e => setSettings({...settings, customSystemInstruction: e.target.value})}
                    placeholder="e.g. Always include a section on performance optimization."
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 h-40 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                 />
              </div>
            </section>
          </div>
        );

      case 'Billing':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="glass rounded-3xl p-8 space-y-8 shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black font-satoshi flex items-center gap-2 mb-1 tracking-tight">
                    <CreditCard className="text-purple-400 w-6 h-6" />
                    Subscription Plan
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">Manage your billing and subscription details.</p>
                </div>
                <div className="px-4 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Professional Tier
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shadow-inner">
                    <CardIcon className="text-purple-400 w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-black font-satoshi text-lg tracking-tight">Visa ending in 4242</p>
                    <p className="text-xs text-gray-500 font-medium">Next billing cycle: June 01, 2024</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="px-6 rounded-xl">Update</Button>
              </div>
            </section>
          </div>
        );

      case 'Security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="glass rounded-3xl p-8 space-y-8 shadow-2xl">
              <div>
                <h3 className="text-xl font-black font-satoshi flex items-center gap-2 mb-1 tracking-tight">
                  <Lock className="text-purple-400 w-6 h-6" />
                  Security Vault
                </h3>
                <p className="text-sm text-gray-500 font-medium">Manage your credentials and session security.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 max-w-md">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-bold"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button variant="outline" size="md" className="rounded-xl px-10">Update Access</Button>
              </div>
            </section>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <section className="glass rounded-3xl p-8 space-y-10 shadow-2xl">
              <div>
                <h3 className="text-xl font-black font-satoshi flex items-center gap-2 mb-1 tracking-tight">
                  <Bell className="text-purple-400 w-6 h-6" />
                  Activity Center
                </h3>
                <p className="text-sm text-gray-500 font-medium">Choose what you want to be notified about.</p>
              </div>

              <div className="space-y-8">
                <NotificationToggle 
                  title="Pattern Updates" 
                  description="Be notified when our core engineering logic is enhanced for new LLMs."
                  active={settings.notifyPatternUpdates}
                  onChange={(val) => setSettings({ ...settings, notifyPatternUpdates: val })}
                />
                <NotificationToggle 
                  title="Account Activity" 
                  description="Security alerts for logins from unrecognized browsers or IPs."
                  active={settings.notifyAccountActivity}
                  onChange={(val) => setSettings({ ...settings, notifyAccountActivity: val })}
                />
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="w-full lg:w-72 shrink-0 space-y-1">
          <h1 className="text-5xl font-black font-satoshi mb-12 px-2 tracking-tighter">Account</h1>
          <SidebarItem 
            icon={<User className="w-4 h-4" />} 
            label="Profile" 
            active={activeTab === 'Profile'} 
            onClick={() => setActiveTab('Profile')} 
          />
          <SidebarItem 
            icon={<Palette className="w-4 h-4" />} 
            label="Appearance" 
            active={activeTab === 'Appearance'} 
            onClick={() => setActiveTab('Appearance')} 
          />
          <SidebarItem 
            icon={<Zap className="w-4 h-4" />} 
            label="Prompt Defaults" 
            active={activeTab === 'Prompt Defaults'} 
            onClick={() => setActiveTab('Prompt Defaults')} 
          />
          <SidebarItem 
            icon={<CreditCard className="w-4 h-4" />} 
            label="Billing" 
            active={activeTab === 'Billing'} 
            onClick={() => setActiveTab('Billing')} 
          />
          <SidebarItem 
            icon={<Shield className="w-4 h-4" />} 
            label="Security" 
            active={activeTab === 'Security'} 
            onClick={() => setActiveTab('Security')} 
          />
          <SidebarItem 
            icon={<Bell className="w-4 h-4" />} 
            label="Notifications" 
            active={activeTab === 'Notifications'} 
            onClick={() => setActiveTab('Notifications')} 
          />
        </aside>

        <div className="flex-1 space-y-12">
          {renderContent()}

          {(activeTab === 'Profile' || activeTab === 'Appearance' || activeTab === 'Prompt Defaults' || activeTab === 'Notifications') && (
            <div className="flex items-center justify-end gap-6 pt-10 border-t border-white/5">
              {showSuccess && (
                <span className="text-emerald-400 text-sm font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                  <Check className="w-4 h-4" /> Settings Updated
                </span>
              )}
              <Button 
                size="lg" 
                className="px-14 h-16 text-xl rounded-[1.5rem] shadow-3xl shadow-purple-500/30 font-black tracking-tight" 
                onClick={handleSave}
                isLoading={isSaving}
              >
                <Save className="mr-3 w-6 h-6" /> Save Settings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onClick?: () => void 
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl transition-all ${
      active 
        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-xl shadow-purple-500/5' 
        : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-sm font-black font-satoshi uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
  </button>
);

const InvoiceRow: React.FC<{ date: string, amount: string, status: string }> = ({ date, amount, status }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all cursor-default group shadow-sm gap-4">
    <div className="flex gap-4 items-center">
      <Receipt className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
      <div>
        <p className="text-sm font-black font-satoshi tracking-tight">{date}</p>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{amount}</p>
      </div>
    </div>
    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/5 px-3 py-1 rounded-lg border border-emerald-400/10">{status}</span>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          downloadInvoice(date, amount);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
      >
        <Download className="w-3.5 h-3.5" />
        PDF
      </button>
    </div>
  </div>
);

const NotificationToggle: React.FC<{ title: string, description: string, active: boolean, onChange: (val: boolean) => void }> = ({ title, description, active, onChange }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
      <div>
        <p className="text-lg font-black font-satoshi tracking-tight mb-1">{title}</p>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{description}</p>
      </div>
      <Toggle active={active} onClick={() => onChange(!active)} />
    </div>
  );
};

const Toggle: React.FC<{ active: boolean, onClick?: () => void }> = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-14 h-7 rounded-full p-1.5 transition-all duration-300 shadow-inner ${active ? 'bg-purple-500' : 'bg-white/10'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-md ${active ? 'translate-x-7' : 'translate-x-0'}`} />
  </button>
);
