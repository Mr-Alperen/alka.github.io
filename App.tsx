
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Shield, 
  Cpu, 
  MessageSquare, 
  Gamepad2, 
  Users, 
  Home, 
  Mail,
  Send,
  Loader2,
  ChevronRight,
  Crosshair,
  Zap,
  HardDrive,
  MessageCircle,
  ArrowRight,
  Phone,
  MapPin,
  Activity,
  Box,
  Target,
  X,
  Server,
  Microchip,
  Network,
  Crosshair as TargetIcon,
  Lock,
  Package,
  Terminal,
  Search,
  Database,
  Eye,
  Globe,
  ExternalLink,
  Briefcase,
  Github,
  BarChart3,
  BarChart,
  GitBranch,
  Star,
  Code
} from 'lucide-react';
import { Tab, Message } from './types';
import { getGeminiConsultantResponse } from './services/geminiService';

// --- Confetti Utility ---

const triggerConfetti = () => {
  const count = 150;
  const fire = (particleRatio: number) => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#3b82f6', '#60a5fa'];

    for (let i = 0; i < count * particleRatio; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.8,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 1) * 20,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: Math.random() * 10 - 5,
        opacity: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.opacity -= 0.01;
        p.rotation += p.vr;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };
    animate();
  };

  fire(0.25);
  fire(0.2);
  fire(0.35);
  fire(0.1);
  fire(0.1);
};

// --- Heat Cursor Component ---

const HeatCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const s = dist / dt;
        setSpeed(prev => prev * 0.9 + s * 0.1);
        lastPos.current = { x: e.clientX, y: e.clientY };
        lastTime.current = now;
      }
      setPosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setIsMoving(false);
        setSpeed(0);
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getColors = () => {
    if (!isMoving) {
      return {
        glow: 'rgba(239, 68, 68, 0.4)', 
        icon: '#ef4444'
      };
    }
    const s = Math.min(speed, 2.5);
    if (s > 1.5) return { glow: 'rgba(234, 179, 8, 0.5)', icon: '#eab308' }; 
    if (s > 0.6) return { glow: 'rgba(249, 115, 22, 0.5)', icon: '#f97316' }; 
    return { glow: 'rgba(239, 68, 68, 0.5)', icon: '#ef4444' }; 
  };

  const colors = getColors();

  return (
    <div 
      className="heat-cursor-container"
      style={{ left: position.x, top: position.y }}
    >
      <div 
        className="heat-cursor-glow" 
        style={{ backgroundColor: colors.glow }}
      />
      <div style={{ color: colors.icon }} className="relative z-50">
        <Target className="w-8 h-8 opacity-80" />
      </div>
    </div>
  );
};

// --- Distributed Background Icons ---

const BackgroundSymbols: React.FC = () => {
  const symbols = useMemo(() => {
    const icons = [Cpu, Shield, Zap, HardDrive, Target, Box, Activity];
    return Array.from({ length: 40 }).map((_, i) => {
      const Icon = icons[Math.floor(Math.random() * icons.length)];
      return {
        id: i,
        Icon,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.floor(Math.random() * 40 + 20),
        rotate: Math.floor(Math.random() * 360)
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {symbols.map(s => (
        <s.Icon 
          key={s.id}
          className="bg-symbol"
          style={{ 
            top: s.top, 
            left: s.left, 
            width: s.size, 
            height: s.size,
            transform: `rotate(${s.rotate}deg)` 
          }} 
        />
      ))}
    </div>
  );
};

// --- Floating Chat Balloon ---

const FloatingChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Merhaba! Alka Savunma Uzmanı olarak savunma teknolojileri, siber güvenlik veya teçhizat üretimi hakkında size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    const response = await getGeminiConsultantResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 w-80 md:w-96 h-[500px] z-[100] animate-in slide-in-from-bottom-4 duration-300">
      <div className="h-full bg-slate-950/95 backdrop-blur-3xl border border-emerald-500/30 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 bg-emerald-600 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-orbitron font-bold text-xs tracking-widest uppercase">Savunma Uzmanı</span>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-space text-sm">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-xl ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
            placeholder="Savunma sistemleri hakkında sorun..." 
            className="flex-1 bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 transition-all font-space" 
          />
          <button onClick={handleSend} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-all disabled:opacity-50">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sidebar Item ---

const SidebarItem: React.FC<{ 
  tab: Tab; 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ tab, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 transition-all duration-500 group relative ${
      active ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_0_10px_#10b981]" />
    )}
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="text-xs font-bold tracking-[0.2em] font-orbitron uppercase">{tab}</span>
  </button>
);

// --- Sections ---

const HomeSection: React.FC<{ onNavigate: (tab: Tab) => void }> = ({ onNavigate }) => (
  <div className="flex flex-col min-h-screen bg-[#050505] relative">
    <BackgroundSymbols />
    
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 pt-20">
      <div className="relative mb-12">
        <h1 className="text-6xl md:text-8xl font-black font-orbitron tracking-tighter mb-4 select-none leading-none">
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">ALKA</span>
          <br />
          <span className="neon-green-glow">SAVUNMA</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-base md:text-xl font-light tracking-[0.6em] uppercase mt-8 mx-auto font-space">
          Geleceğin Savunma ve Bilişim Teknolojileri
        </p>
      </div>

      {/* Hakkımızda Box on Home Page */}
      <div className="max-w-3xl w-full bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] transform hover:scale-[1.02] transition-all duration-500 mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-[2px] bg-emerald-500" />
          <h2 className="text-2xl font-bold font-orbitron text-white tracking-widest uppercase">Hakkımızda</h2>
        </div>
        <p className="text-slate-300 font-space text-lg leading-relaxed text-left">
          Alka Savunma, yerli ve milli teknoloji hamlesinin öncü kuruluşlarından biri olarak; 
          stratejik savunma sistemleri, siber güvenlik altyapıları ve otonom harp platformları geliştirmektedir. 
          Mühendislik disiplini ve inovasyon odaklı yaklaşımımızla, küresel ölçekte rekabetçi ve güvenilir çözümler sunarak 
          geleceğin dijital ve fiziksel güvenliğini inşa ediyoruz.
        </p>
        <button 
          onClick={() => onNavigate(Tab.About)}
          className="mt-8 flex items-center gap-2 text-emerald-400 font-bold font-orbitron text-xs tracking-[0.2em] hover:text-emerald-300 transition-all uppercase"
        >
          DETAYLI VİZYONUMUZ <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Full-Width Structured Footer for Home Page */}
    <footer className="w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 py-12 px-12 md:px-24 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-2xl font-black font-orbitron text-white tracking-tighter">
            ALKA <span className="text-emerald-500">SAVUNMA</span>
          </div>
          <p className="text-slate-600 text-[10px] font-mono tracking-[0.3em] uppercase">
            © 2024 Tüm hakları saklıdır.
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Developed By</p>
          <p className="text-emerald-500 font-bold font-orbitron text-lg tracking-tighter shadow-emerald-500/20 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">ALPEREN</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center md:text-right">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-orbitron">E-Posta</h4>
            <a href="mailto:info@alkasavunma.com" className="text-slate-300 hover:text-emerald-400 font-space text-sm transition-colors">info@alkasavunma.com</a>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-orbitron">Telefon</h4>
            <p className="text-slate-300 font-space text-sm">+90 (312) 000 00 00</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

// --- About Section (Updated with GitHub & Repo Analysis) ---

const RepoCard: React.FC<{ name: string; stars: number; language: string; description: string }> = ({ name, stars, language, description }) => (
  <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <h4 className="text-emerald-400 font-bold font-orbitron text-sm">{name}</h4>
      </div>
      <div className="flex items-center gap-1 text-yellow-500/60 text-xs">
        <Star className="w-3 h-3" /> {stars}
      </div>
    </div>
    <p className="text-slate-400 text-xs font-space mb-4 leading-relaxed line-clamp-2">{description}</p>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-blue-500" />
      <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{language}</span>
    </div>
  </div>
);

const AnalysisStat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span style={{ color }}>%{value}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-1000 ease-out" 
        style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      />
    </div>
  </div>
);

const AboutSection: React.FC = () => (
  <div className="min-h-screen py-32 px-12 md:px-24 flex flex-col max-w-7xl mx-auto relative space-y-24">
    <BackgroundSymbols />
    
    <div className="relative z-10">
      <h2 className="text-5xl font-bold font-orbitron text-emerald-400 mb-12 flex items-center gap-6">
        <Users className="w-12 h-12" /> Hakkımızda
      </h2>
      
      {/* Enlarged Info Box */}
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12 p-12 md:p-16 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.05)]">
          <div className="space-y-8">
            <h3 className="text-3xl font-black font-orbitron text-white leading-tight">
              Savunma Teknolojilerinde <br/>
              <span className="text-emerald-500">Yeni Bir Vizyon</span>
            </h3>
            <p className="text-slate-300 font-space text-xl leading-relaxed">
              Alka Savunma, sadece bir mühendislik firması değil, Türkiye'nin teknolojik egemenliğini güçlendiren bir inovasyon merkezidir. 
              Uzman kadromuzla otonom sistemler, yapay zeka destekli harp platformları ve kritik siber güvenlik protokolleri üzerine 
              disiplinlerarası çözümler üretiyoruz.
            </p>
            <p className="text-slate-400 font-space text-lg leading-relaxed italic">
              "Geleceği tahmin etmiyoruz, onu gelişmiş algoritmalar ve sağlam mühendislik temelleriyle inşa ediyoruz."
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
             <div className="space-y-1">
                <p className="text-emerald-400 text-3xl font-black font-orbitron">150+</p>
                <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">Tamamlanan Proje</p>
             </div>
             <div className="space-y-1">
                <p className="text-emerald-400 text-3xl font-black font-orbitron">45</p>
                <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">Patent Başvurusu</p>
             </div>
          </div>
        </div>

        <div className="space-y-12">
           {/* GitHub Section */}
           <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 p-10 rounded-[2.5rem] space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Github className="w-10 h-10 text-white" />
                  <div>
                    <h4 className="text-white font-orbitron font-bold text-lg tracking-tighter leading-none">Açık Kaynak Ekosistemi</h4>
                    <a href="https://github.com/AlkaSavunma" target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-mono text-xs hover:underline mt-1 block">www.github.com/AlkaSavunma</a>
                  </div>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  Live Sync
                </div>
              </div>

              {/* Repo Samples */}
              <div className="grid gap-4">
                <RepoCard 
                  name="alka-core-engine" 
                  stars={128} 
                  language="C++ / Rust" 
                  description="High-performance autonomous navigation and decision making core for UAV/UGV systems." 
                />
                <RepoCard 
                  name="sentinel-sec-v2" 
                  stars={84} 
                  language="Python" 
                  description="Advanced threat intelligence and zero-day exploit analysis framework for critical infrastructures." 
                />
              </div>

              {/* Repo Analysis */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2 text-slate-300 font-orbitron font-bold text-sm">
                   <BarChart3 className="w-4 h-4 text-emerald-500" /> REPO ANALİZİ
                 </div>
                 <div className="grid gap-4">
                    <AnalysisStat label="Kod Kararlılığı" value={98} color="#10b981" />
                    <AnalysisStat label="Güvenlik Puanı" value={94} color="#3b82f6" />
                    <AnalysisStat label="Dökümantasyon" value={87} color="#f59e0b" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Defense Section (Updated with Proportional Alignment and Simple Chatbot) ---

const DefenseArea: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
  <div className="group flex flex-col justify-center py-24 border-b border-white/5 last:border-0 relative">
    <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
      <div className="w-full md:w-2/5 flex flex-col items-center md:items-start space-y-6">
        <div className="p-6 bg-emerald-500/10 rounded-[2rem] w-fit text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700 shadow-xl group-hover:shadow-emerald-500/20">
          {icon}
        </div>
        <h3 className="text-3xl md:text-4xl font-black font-orbitron text-white transition-all duration-700 group-hover:text-emerald-400 leading-tight">
          {title}
        </h3>
      </div>
      <div className="w-full md:w-3/5">
        <p className="text-lg md:text-xl font-light font-space leading-relaxed text-slate-400 transition-all duration-1000 group-hover:text-emerald-100">
          {content}
        </p>
      </div>
    </div>
  </div>
);

const DefenseChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Savunma protokolleri merkezi. Dinliyorum.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userTxt = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userTxt }]);
    setInput('');

    setTimeout(() => {
      if (userTxt.toLowerCase() === 'selam') {
        setMessages(prev => [...prev, { role: 'model', text: 'Aleyküm selam' }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Mesajınız kaydedildi. Savunma veritabanı analiz ediliyor.' }]);
      }
    }, 400);
  };

  return (
    <div className="mt-24 p-8 bg-slate-900/40 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-2xl space-y-6">
       <div className="flex items-center gap-3 text-emerald-400 border-b border-white/5 pb-4">
          <MessageCircle className="w-6 h-6" />
          <span className="font-orbitron font-bold tracking-widest text-sm">SAVUNMA ASİSTANI</span>
       </div>
       <div className="h-48 overflow-y-auto space-y-3 font-space text-sm scrollbar-thin pr-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none border border-white/5'}`}>
                 {m.text}
               </div>
            </div>
          ))}
       </div>
       <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mesajınızı girin..." 
            className="flex-1 bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-emerald-500 transition-colors"
          />
          <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl transition-all shadow-lg">
             <Send className="w-5 h-5 text-white" />
          </button>
       </div>
    </div>
  );
};

const DefenseSection: React.FC<{ onOpenChat: () => void; onNavigate: (tab: Tab) => void }> = ({ onOpenChat, onNavigate }) => (
  <div className="min-h-screen py-32 px-12 md:px-24 flex flex-col max-w-7xl mx-auto relative">
    <BackgroundSymbols />
    <h2 className="text-5xl font-bold font-orbitron text-emerald-400 mb-20 flex items-center gap-4">
      <Shield className="w-12 h-12" /> Savunma Sistemleri
    </h2>
    <div className="space-y-4">
      <DefenseArea 
        title="Harp Teknolojileri" 
        content="İleri düzey İHA/SİHA ve otonom kara platformları için geliştirilmiş, yüksek hassasiyetli seyrüsefer ve hedefleme sistemleri. Modern harp sahasının tüm gereksinimlerini karşılayan akıllı mühimmat entegrasyonu." 
        icon={<TargetIcon className="w-10 h-10" />} 
      />
      <DefenseArea 
        title="Siber Güvenlik" 
        content="Kritik askeri ve endüstriyel altyapılar için geliştirilmiş exploit koruma kalkanları, gelişmiş SIEM çözümleri ve yapay zeka destekli tehdit avcılığı protokolleri." 
        icon={<Lock className="w-10 h-10" />} 
      />
      <DefenseArea 
        title="Teçhizat Üretimi" 
        content="En zorlu saha koşullarına uygun balistik koruma sistemleri, kompozit kasklar ve ergonomik modern piyade teçhizatları. Maksimum güvenlik ve operasyonel esneklik prensibiyle üretim." 
        icon={<Package className="w-10 h-10" />} 
      />
    </div>

    {/* Section Specific Chatbot */}
    <DefenseChatbot />
  </div>
);

const TerminalCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="bg-[#0c0c0c] border border-emerald-500/20 rounded-lg overflow-hidden flex flex-col font-mono shadow-2xl group transition-all duration-500 hover:border-emerald-500/40">
    <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-white/5">
      <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/40" /><div className="w-3 h-3 rounded-full bg-yellow-500/40" /><div className="w-3 h-3 rounded-full bg-green-500/40" /></div>
      <div className="text-[10px] text-slate-500 tracking-widest uppercase">ALKA_SEC_TERMINAL</div>
    </div>
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 text-emerald-400">
        {icon}
        <div className="flex flex-wrap items-center text-xs md:text-sm">
           <span className="text-blue-400 font-bold">root@alkasavunma</span><span className="text-slate-500 mx-1">:</span><span className="text-emerald-500 font-bold">~$</span><span className="ml-2 text-white font-black uppercase font-orbitron">{title}</span>
        </div>
      </div>
      <p className="text-slate-400 group-hover:text-slate-200 transition-colors font-space">{desc}</p>
    </div>
  </div>
);

const ITSection: React.FC = () => (
  <div className="min-h-screen py-32 px-12 md:px-24 flex flex-col max-w-7xl mx-auto relative">
    <BackgroundSymbols />
    <h2 className="text-5xl font-bold font-orbitron text-emerald-400 mb-20">Bilişim Teknolojileri</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <TerminalCard title="Siber Güvenlik" desc="Uçtan uca kurumsal ve askeri koruma." icon={<Lock className="w-5 h-5" />} />
      <TerminalCard title="Thenos OSINT" desc="Gerçek zamanlı açık kaynak istihbaratı." icon={<Globe className="w-5 h-5" />} />
      <TerminalCard title="Infrascope SIEM" desc="Altyapı merkezli log analizi." icon={<Network className="w-5 h-5" />} />
      <TerminalCard title="Datascope SIEM" desc="Veri odaklı denetim ve güvenlik." icon={<Database className="w-5 h-5" />} />
    </div>
  </div>
);

const PARTNER_COMPANIES = [
  { name: 'Karmasis', url: 'https://karmasis.com', repId: 'REP-KA-001' },
  { name: 'Kafein', url: 'https://kafein.com.tr', repId: 'REP-KF-002' },
  { name: 'Epenek Savunma', url: 'https://epeneksavunma.com', repId: 'REP-ES-003' },
  { name: 'Turan Holding', url: 'https://turanholding.com.tr', repId: 'REP-TH-004' },
  ...Array.from({ length: 6 }).map((_, i) => ({
    name: `XXX Şirketi #${i + 5}`,
    url: '#',
    repId: `REP-X-${String(i + 5).padStart(3, '0')}`
  }))
];

const CompanyBox: React.FC<{ company: typeof PARTNER_COMPANIES[0] }> = ({ company }) => (
  <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl group hover:border-emerald-500/50 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-6">
    <div className="text-center md:text-left">
      <h4 className="text-2xl md:text-3xl font-black font-orbitron tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all">
        {company.name}
      </h4>
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <a href={company.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors font-space flex items-center gap-1">
          <Globe className="w-3 h-3" /> {company.url.replace('https://', '')}
        </a>
        <span className="text-xs text-slate-100 opacity-60 font-space flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> Temsilcilik: {company.repId}
        </span>
      </div>
    </div>
  </div>
);

const ConsultancySection: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'model', text: 'Strateji merkezimize hoş geldiniz. Partnerlerimiz hakkında bilgi almak için hazırım.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);
    const response = await getGeminiConsultantResponse(msg);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen py-32 px-12 md:px-24 flex flex-col max-w-5xl mx-auto relative pb-64">
      <BackgroundSymbols />
      <div className="relative z-10 space-y-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold font-orbitron text-emerald-400">Danışmanlık Ağı</h2>
          <p className="text-slate-500 font-space tracking-[0.4em] uppercase text-sm">Stratejik Partnerler</p>
        </div>
        
        <div className="space-y-4">
          {PARTNER_COMPANIES.map((company, idx) => (
            <CompanyBox key={idx} company={company} />
          ))}
        </div>

        <div className="mt-24 border border-red-500/30 bg-red-950/10 backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)]">
           <div className="bg-red-950/60 px-4 py-2 flex items-center justify-between border-b border-red-500/20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase font-bold">ALKA_KALI_CONSULTANT_v2.0</span>
           </div>
           
           <div className="p-6 h-[400px] overflow-y-auto font-mono space-y-4 text-xs md:text-sm">
             {chatMessages.map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={m.role === 'user' ? 'text-blue-400' : 'text-red-500'}>
                      {m.role === 'user' ? 'root@alkasavunma' : 'system@alkasavunma'}
                    </span>
                    <span className="text-slate-600">:~$</span>
                    {m.role === 'user' && <span className="text-white">{m.text}</span>}
                  </div>
                  {m.role === 'model' && (
                    <div className="text-red-400/90 pl-4 border-l border-red-500/20 leading-relaxed">
                      {m.text}
                    </div>
                  )}
                </div>
             ))}
             {chatLoading && (
               <div className="flex items-center gap-2 text-red-500">
                  <span className="animate-pulse">_</span>
                  <Loader2 className="w-3 h-3 animate-spin" />
               </div>
             )}
             <div ref={chatBottomRef} />
           </div>

           <div className="p-4 bg-black/40 border-t border-red-500/20 flex gap-3 items-center">
              <span className="text-blue-400 font-mono text-sm hidden md:block">root@alkasavunma:~$</span>
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Komut girin..." 
                className="flex-1 bg-transparent border-none text-red-400 focus:outline-none font-mono text-sm"
              />
              <button onClick={handleChatSubmit} disabled={chatLoading} className="text-red-500 hover:text-red-400 transition-colors">
                 <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    triggerConfetti();

    const subject = encodeURIComponent(`İletişim Formu - ${name || 'Ziyaretçi'}`);
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:info@alkasavunma.com?subject=${subject}&body=${body}`;
    
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1000);
  };

  return (
    <div className="min-h-screen p-12 flex flex-col justify-center max-w-4xl mx-auto relative">
      <BackgroundSymbols />
      <h2 className="text-4xl font-bold font-orbitron text-rose-400 mb-12">İletişim</h2>
      <div className="grid md:grid-cols-2 gap-12 bg-slate-950/40 p-10 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="space-y-10">
          <div>
            <h3 className="text-rose-400 font-bold uppercase tracking-[0.2em] text-xs mb-3 font-orbitron">E-Posta Adresimiz</h3>
            <p className="text-slate-300 font-space text-lg font-bold">info@alkasavunma.com</p>
          </div>
          <div>
            <h3 className="text-rose-400 font-bold uppercase tracking-[0.2em] text-xs mb-3 font-orbitron">Genel Merkez</h3>
            <p className="text-slate-300 font-space">Teknopark Ankara No:14, Türkiye</p>
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Ad Soyad" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/30 border border-slate-800 p-4 rounded-xl focus:border-rose-500 text-white transition-colors outline-none" 
          />
          <textarea 
            placeholder="Mesajınız" 
            rows={4} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-black/30 border border-slate-800 p-4 rounded-xl focus:border-rose-500 text-white transition-colors outline-none" 
            required
          />
          <button 
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-xl font-bold transition-all font-orbitron uppercase text-xs tracking-widest flex items-center justify-center gap-2 group"
          >
            Gönder <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

const GameSection: React.FC = () => {
  const [score, setScore] = useState(0);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  return (
    <div className="min-h-screen p-12 flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundSymbols />
      <div className="absolute top-12 text-center z-20">
        <h2 className="text-4xl font-bold font-orbitron text-emerald-400 mb-2">Siber Refleks</h2>
        <p className="text-slate-400 font-orbitron">SKOR: <span className="text-emerald-400 font-bold text-xl">{score}</span></p>
      </div>
      <div onClick={() => { setScore(s => s + 1); setTargetPos({ top: Math.random() * 70 + 15 + '%', left: Math.random() * 70 + 15 + '%' }) }} style={{ top: targetPos.top, left: targetPos.left }} className="absolute w-16 h-16 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_#10b981] cursor-crosshair flex items-center justify-center group z-50 transition-all duration-75">
        <Target className="w-8 h-8 text-emerald-400" />
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Home: return <HomeSection onNavigate={handleTabChange} />;
      case Tab.About: return <AboutSection />;
      case Tab.Defense: return <DefenseSection onOpenChat={() => setIsChatOpen(true)} onNavigate={handleTabChange} />;
      case Tab.IT: return <ITSection />;
      case Tab.Consultancy: return <ConsultancySection />;
      case Tab.Contact: return <ContactSection />;
      case Tab.Game: return <GameSection />;
      default: return <HomeSection onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <HeatCursor />
      <FloatingChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="fixed top-8 left-8 z-50 flex items-center select-none cursor-default group">
        <span className="font-space font-black text-4xl text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">ALKA</span>
        <span className="terminal-cursor text-emerald-500 ml-1 shadow-[0_0_10px_#10b981]" />
      </div>

      <nav className="fixed left-0 top-0 bottom-0 w-64 matte-glass z-40 flex flex-col py-12 pt-24">
        <div className="flex-1 flex flex-col space-y-1">
          <SidebarItem tab={Tab.Home} active={activeTab === Tab.Home} onClick={() => handleTabChange(Tab.Home)} icon={<Home className="w-4 h-4" />} />
          <SidebarItem tab={Tab.About} active={activeTab === Tab.About} onClick={() => handleTabChange(Tab.About)} icon={<Users className="w-4 h-4" />} />
          <SidebarItem tab={Tab.Defense} active={activeTab === Tab.Defense} onClick={() => handleTabChange(Tab.Defense)} icon={<Shield className="w-4 h-4" />} />
          <SidebarItem tab={Tab.IT} active={activeTab === Tab.IT} onClick={() => handleTabChange(Tab.IT)} icon={<Terminal className="w-4 h-4" />} />
          <SidebarItem tab={Tab.Consultancy} active={activeTab === Tab.Consultancy} onClick={() => handleTabChange(Tab.Consultancy)} icon={<Briefcase className="w-4 h-4" />} />
          <SidebarItem tab={Tab.Contact} active={activeTab === Tab.Contact} onClick={() => handleTabChange(Tab.Contact)} icon={<Mail className="w-4 h-4" />} />
          <SidebarItem tab={Tab.Game} active={activeTab === Tab.Game} onClick={() => handleTabChange(Tab.Game)} icon={<Gamepad2 className="w-4 h-4" />} />
        </div>
      </nav>

      <main className="ml-64 flex-1 relative min-h-screen bg-[#050505]">
        <div key={activeTab} className="relative z-10 animate-in fade-in duration-700 h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
