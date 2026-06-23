import React, { useState, useEffect, useRef } from 'react';
import { 
  Skull, 
  TrendingDown, 
  Activity, 
  Flame, 
  ShieldAlert, 
  DollarSign, 
  Zap, 
  Users, 
  Radio, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Lock, 
  Unlock, 
  Server, 
  CheckCircle, 
  TrendingUp,
  X,
  FileText,
  AlertTriangle,
  Send,
  Bot,
  Cpu,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Strategy, GraveyardTrade } from './types';
import { presetStrategies, graveyardTrades, sampleScanLogs } from './data';

export default function App() {
  // State for active strategy list
  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    const saved = localStorage.getItem('alphadecay_watchlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved strategies", e);
      }
    }
    return presetStrategies;
  });

  // State for current selected strategy for detail view and decay calculator
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(presetStrategies[0].id);
  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];

  // Simulator override controls (live sliders that bend the decay curve)
  const [simCapital, setSimCapital] = useState<number>(selectedStrategy.currentCapital);
  const [simCompetitors, setSimCompetitors] = useState<number>(selectedStrategy.competitorsCount);
  const [simDifficulty, setSimDifficulty] = useState<number>(50); // 1-100 execution difficulty parameter

  // Sync simulator controls when selected strategy changes
  useEffect(() => {
    setSimCapital(selectedStrategy.currentCapital);
    setSimCompetitors(selectedStrategy.competitorsCount);
    // Determine implicit difficulty from replicability
    setSimDifficulty(Math.max(10, 100 - selectedStrategy.replicabilityScore));
  }, [selectedStrategyId]);

  // AI strategy creator state
  const [newStratName, setNewStratName] = useState('');
  const [newStratSector, setNewStratSector] = useState<'Crypto' | 'Equities' | 'FX' | 'Fixed Income' | 'Commodities' | 'Cross-Asset'>('Crypto');
  const [newStratDesc, setNewStratDesc] = useState('');
  const [newStratAlpha, setNewStratAlpha] = useState(150);
  const [newStratCapital, setNewStratCapital] = useState(5);
  const [newStratCompetitors, setNewStratCompetitors] = useState(3);
  
  // Loading & logs state during AI analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Selected graveyard post-mortem modal
  const [activeGraveId, setActiveGraveId] = useState<string | null>(null);

  // Active simulated scroll log state
  const [scanLogs, setScanLogs] = useState<string[]>(sampleScanLogs);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Real-time IND clock and tick state
  const [indTime, setIndTime] = useState<string>('');

  // Chat console states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    { role: 'model', text: 'Welcome to the AlphaDecay Copilot Terminal. I am your co-located AI research desk. Choose your agent profile and model below, and ask about trade mechanics, latency reduction, or crowding mitigation.' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [chatProfile, setChatProfile] = useState<'quant' | 'monitor' | 'router'>('quant');
  const [chatModel, setChatModel] = useState<'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'>('gemini-3.1-pro-preview');
  const [chatLatency, setChatLatency] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle profile change and adjust the default model
  const handleProfileChange = (profile: 'quant' | 'monitor' | 'router') => {
    setChatProfile(profile);
    if (profile === 'quant') {
      setChatModel('gemini-3.1-pro-preview');
    } else if (profile === 'monitor') {
      setChatModel('gemini-3.5-flash');
    } else if (profile === 'router') {
      setChatModel('gemini-3.1-flash-lite');
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    
    // Add user message to state
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(updatedMessages);
    setIsChatting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
          modelName: chatModel,
          profileRole: chatProfile
        })
      });

      if (!response.ok) {
        throw new Error("Chat core failure");
      }

      const resData = await response.json();
      setChatMessages(prev => [...prev, { role: 'model', text: resData.text }]);
      if (resData.latencyMs) {
        setChatLatency(resData.latencyMs);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'model', text: "ERROR: Lost synchronization with Quantum Chat Core. Try changing server, model or verify key status." }]);
    } finally {
      setIsChatting(false);
    }
  };

  // Save to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem('alphadecay_watchlist', JSON.stringify(strategies));
  }, [strategies]);

  // Clock tick & dynamic Alpha decay micro-ticks
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false
      });
      setIndTime(`${dateStr} ${timeStr}`);
    };
    
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // Micro-ticks representing dynamic active Alpha decay
    const decayInterval = setInterval(() => {
      setStrategies(prev => 
        prev.map(strat => {
          // Slowly decay current alpha at premium frequency
          // D-rated decay faster, A-rated decay very slowly
          const decayMultipliers: Record<string, number> = {
            'A+': 0.0000005,
            'A': 0.000001,
            'B': 0.000003,
            'C': 0.000008,
            'D': 0.000015,
            'F': 0.000032
          };
          const mult = decayMultipliers[strat.autopsyRating] || 0.000003;
          const delta = strat.initialAlphaBps * mult * (1 + Math.random() * 0.5);
          const nextAlpha = Math.max(0.0001, strat.currentAlphaBps - delta);
          return {
            ...strat,
            currentAlphaBps: nextAlpha
          };
        })
      );
    }, 450);

    return () => {
      clearInterval(clockInterval);
      clearInterval(decayInterval);
    };
  }, []);

  // Monitor scan logs dynamic generation
  useEffect(() => {
    const interval = setInterval(() => {
      const phrases = [
        `SCANLOG [DEX Sniffer] Parallel address executing arbitrage code blocks on liquidity route.`,
        `COMPETITOR [Macro Alert] Hedge fund raised priority allocation in Basis Futures spread.`,
        `ALGORITHM [Compiler Watch] GitHub repository committing similar strategy code files.`,
        `FORUM SCROLLER [Social Radar] Reddit thread discussing premium anomaly gained momentum.`,
        `COMPETITOR [Talent Scout] Citadel listing for Quantitative developer in specific routing sector.`,
        `DEX EXPLOIT [Mempool Sniffer] Sandwich protection gas fee bids rose to ${Math.round(25 + Math.random() * 40)} gwei on mainnet.`
      ];
      const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setScanLogs(prev => [...prev.slice(-30), `LIVE [${new Date().toLocaleTimeString()}] ${selectedPhrase}`]);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  // Keep log panel scrolled down
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [scanLogs]);

  // Custom simulator calculation parameters
  // Returns estimated adjusted half life based on slides
  const calculateSimulatedMetrics = () => {
    // Basic baseline half life is influenced by difficulty buffer
    // Higher difficulty -> longer half life
    const difficultyScore = simDifficulty / 100; // 0.1 to 1.0
    const capFactor = simCapital / selectedStrategy.capacityLimitMillions; // Ratio deployed vs capacity
    const compFactor = simCompetitors / 50; // competitors density ratio

    // Base formula for estimated half life in weeks
    let halfLife = (selectedStrategy.decayHalfLifeWeeks * 1.5) * (difficultyScore * 1.2);
    
    // Capital and competitor crowding penalty
    const crowdPressure = (capFactor * 1.4) + (compFactor * 2.2);
    halfLife = halfLife / Math.max(0.4, (0.5 + crowdPressure));
    
    // Cap minimum and maximums
    const finalHalfLife = Math.max(0.5, Math.min(260, halfLife));
    
    // Estimate resulting Alpha bps (eroded curve output at Year 1 / Week 52)
    // Formula: A_0 * (0.5)^(t / t_half)
    const baseAlpha = selectedStrategy.initialAlphaBps;
    
    // Monthly burn rate helper
    const monthlyBurnRate = (baseAlpha * (1 - Math.pow(0.5, 4.34 / finalHalfLife))).toFixed(2);
    
    return {
      halfLifeWeeks: finalHalfLife.toFixed(1),
      monthlyBurnBps: monthlyBurnRate,
      wipedOutEstimateWeeks: (finalHalfLife * 3.32).toFixed(1) // duration to lose ~90% alpha
    };
  };

  const simMetrics = calculateSimulatedMetrics();

  // Reset strategy to original values
  const handleResetStrategy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const original = presetStrategies.find(s => s.id === selectedStrategyId);
    if (original) {
      setStrategies(prev => prev.map(s => s.id === selectedStrategyId ? { ...original } : s));
      setSimCapital(original.currentCapital);
      setSimCompetitors(original.competitorsCount);
      setSimDifficulty(Math.max(10, 100 - original.replicabilityScore));
    }
  };

  // Delete a custom strategy
  const handleDeleteStrategy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextList = strategies.filter(s => s.id !== id);
    setStrategies(nextList);
    if (selectedStrategyId === id && nextList.length > 0) {
      setSelectedStrategyId(nextList[0].id);
    }
  };

  // Submit search request to Quantum Scanner (Express backend)
  const handleAnalyzeStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStratDesc.trim() || !newStratName.trim()) return;

    setIsAnalyzing(true);
    setAnalysisLogs([]);
    setActiveLogIndex(0);

    const simulationLogsList = [
      "Connecting to Quantum Scanner grid nodes...",
      "De-constructing transaction vectors & contract code blocks...",
      "Querying global alternative database and GitHub public index...",
      "Calculating Herfindahl-Hirschman Index (HHI) for capital deployment...",
      "Evaluating gas prioritization & slippage models under extreme load...",
      "Simulating competitive payoff matrices with evolutionary game theory...",
      "Finalizing Decay Autopsy scorecard..."
    ];

    // Artificial simulation of logs to make scanner feel incredibly mechanical & tech-dense
    let logCounter = 0;
    const logInterval = setInterval(() => {
      if (logCounter < simulationLogsList.length) {
        setAnalysisLogs(prev => [...prev, simulationLogsList[logCounter]]);
        logCounter++;
      } else {
        clearInterval(logInterval);
      }
    }, 800);

    try {
      const response = await fetch("/api/analyze-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyName: newStratName,
          description: newStratDesc,
          sector: newStratSector,
          initialAlphaBps: newStratAlpha,
          currentCapital: newStratCapital,
          competitorsCount: newStratCompetitors
        })
      });

      if (!response.ok) {
        throw new Error("Simulation pipeline error");
      }

      const report = await response.json();
      
      const newStrategyItem: Strategy = {
        id: `custom-${Date.now()}`,
        name: newStratName,
        sector: newStratSector,
        description: newStratDesc,
        initialAlphaBps: newStratAlpha,
        currentAlphaBps: newStratAlpha,
        currentCapital: newStratCapital,
        competitorsCount: newStratCompetitors,
        decayHalfLifeWeeks: report.decayHalfLifeWeeks,
        capacityLimitMillions: report.capacityLimitMillions,
        replicabilityScore: report.replicabilityScore,
        autopsyRating: report.autopsyRating,
        safeguards: report.safeguards,
        created: new Date().toISOString(),
        isCustom: true
      };

      // Add to state
      setStrategies(prev => [newStrategyItem, ...prev]);
      setSelectedStrategyId(newStrategyItem.id);
      
      // Reset inputs
      setNewStratName('');
      setNewStratDesc('');
      setNewStratAlpha(150);
      setNewStratCapital(5);
      setNewStratCompetitors(3);

    } catch (err) {
      console.error(err);
      setAnalysisLogs(prev => [...prev, "ERROR: Structural model crash. Generating algorithmic estimate..."]);
    } finally {
      clearInterval(logInterval);
      setIsAnalyzing(false);
    }
  };

  // Helper colors for decay ratings
  const getRatingBadgeClass = (rating: string) => {
    switch (rating) {
      case 'A+': case 'A':
        return 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/40';
      case 'B': case 'C':
        return 'text-amber-500 bg-amber-950/20 border border-amber-900/40';
      default:
        return 'text-red-500 bg-red-950/20 border border-red-900/40 animate-pulse';
    }
  };

  const getUrgencyText = (rating: string) => {
    switch (rating) {
      case 'A+': case 'A': return 'Extremely Defensive';
      case 'B': return 'Modest Capacity';
      case 'C': return 'Crowding Spotted';
      case 'D': return 'Decline Velocity High';
      default: return 'RED ALERT: Edge Wiped';
    }
  };

  // Generate SVG coordinates for dynamic exponential curve
  const generateCurvePath = () => {
    const width = 500;
    const height = 180;
    const padding = 20;
    
    const maxVal = selectedStrategy.initialAlphaBps;
    const hLife = parseFloat(simMetrics.halfLifeWeeks); // half-life in weeks
    
    let points = [];
    
    // Plot weeks 1 to 52
    for (let w = 0; w <= 52; w++) {
      // Exponential decay formula: A_t = A_0 * 2^(-t / halfLife)
      const alphaAtW = maxVal * Math.pow(0.5, w / hLife);
      
      // Map week to X coordinate
      const x = padding + (w / 52) * (width - padding * 2);
      // Map alpha level to Y coordinate (0 Alpha is bottom, maxVal is top)
      const y = (height - padding) - (alphaAtW / maxVal) * (height - padding * 2);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200 relative overflow-x-hidden scanline">
      {/* Upper high-tech diagnostic status rail */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 px-6 py-3.5 flex flex-wrap justify-between items-center text-xs gap-3 z-10 font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold tracking-tight text-zinc-300">LIVE MONITORING PROFILE</span>
          </div>
          <span className="hidden sm:inline-block text-zinc-500 border-l border-zinc-800 pl-4">
            Arb Latency: <span className="text-emerald-400 font-bold">14.2ms</span>
          </span>
          <span className="hidden md:inline-block border-l border-zinc-800 pl-4 text-zinc-500">
            Market Crowding: <span className="text-amber-500 font-bold">Severe</span>
          </span>
          <span className="hidden lg:inline-block border-l border-zinc-800 pl-4 text-zinc-500">
            Uptime: <span className="text-zinc-300 font-bold">99.98%</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-2 bg-zinc-900/80 px-3 py-1 rounded border border-zinc-800">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-zinc-300">{indTime ? `IND: ${indTime}` : "IND: SYNCHRONIZING..."}</span>
          </span>
          <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-[10px] text-zinc-400 border border-zinc-700">
            LIVE TERMINAL
          </span>
        </div>
      </div>

      {/* Main header block */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-6 border-b border-zinc-800 bg-zinc-900/30 gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center font-bold text-zinc-950 font-mono">AD</div>
            <h1 className="text-xl tracking-tighter font-bold uppercase italic font-mono text-zinc-50">
              AlphaDecay<span className="text-amber-500">.watch</span>
            </h1>
          </div>
          <div className="h-px w-8 bg-zinc-800 hidden md:block"></div>
          <p className="text-xs text-zinc-400 max-w-xl font-mono leading-relaxed">
            Continuous quantitative monitoring sandbox for arbitrageurs. Identify capital convergence and track the precise speed before your edge is fully arbed away.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              // Reset all to presets
              if (window.confirm("Restore quantitative database to factory presets? This deletes all custom strategies.")) {
                setStrategies(presetStrategies);
                setSelectedStrategyId(presetStrategies[0].id);
              }
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 transition text-xs font-mono text-zinc-300 cursor-pointer"
            id="reset-db-btn"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Reset Database Preset</span>
          </button>
        </div>
      </header>

      {/* High-level system statistics ribbon */}
      <section className="grid grid-cols-2 lg:grid-cols-4 border-b border-zinc-800 bg-zinc-900/20 font-mono">
        <div className="p-4 border-r border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">MONITORED TRADING COHORTS</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg font-bold text-zinc-200">{strategies.length}</span>
            <span className="text-xs text-red-400">-{strategies.filter(s => s.autopsyRating === 'F' || s.autopsyRating === 'D').length} saturated</span>
          </div>
        </div>
        <div className="p-4 border-r lg:border-r border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">AGGREGATE TRACKED CAPITAL</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg font-bold text-emerald-400">
              ${strategies.reduce((accum, curr) => accum + curr.currentCapital, 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}M
            </span>
            <span className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2.4%
            </span>
          </div>
        </div>
        <div className="p-4 border-r border-zinc-800 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">AVG DECAY HALF-LIFE</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg font-bold text-amber-500">
              {(strategies.reduce((accum, curr) => accum + curr.decayHalfLifeWeeks, 0) / strategies.length).toFixed(1)} Weeks
            </span>
            <span className="text-xs text-zinc-400">&#126; 5.2 months</span>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">REPLICATOR THREAT PROBABILITY</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg font-bold text-red-500">
              {(strategies.reduce((accum, curr) => accum + curr.replicabilityScore, 0) / strategies.length).toFixed(0)}%
            </span>
            <span className="text-[10px] text-red-500 font-bold tracking-tight">HIGH EXPOSURE</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Split View */}
      <main className="flex-1 px-6 py-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Watchlist Board (Col span 5) */}
        <section className="xl:col-span-5 space-y-6">
          <div className="bg-zinc-900/40 rounded-lg border border-zinc-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <h2 className="font-mono text-sm uppercase tracking-wider font-semibold text-zinc-100">Active Edge Watchlist</h2>
              </div>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                ACTIVE COHORT STATUS
              </span>
            </div>

            <div className="divide-y divide-zinc-800/60 max-h-[500px] overflow-y-auto bg-zinc-950/25">
              {strategies.map((strat) => {
                const isSelected = strat.id === selectedStrategyId;
                return (
                  <div
                    key={strat.id}
                    onClick={() => setSelectedStrategyId(strat.id)}
                    className={`p-4 transition cursor-pointer select-none flex flex-col space-y-3 relative overflow-hidden ${
                      isSelected 
                        ? 'bg-zinc-800/50 border-l-4 border-amber-500' 
                        : 'hover:bg-zinc-900/30 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Corner badge for customs */}
                    {strat.isCustom && (
                      <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider text-amber-500 bg-zinc-900 border border-zinc-800 font-mono px-1.5 py-0.5 rounded">
                        PROPRIETARY AI
                      </span>
                    )}

                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-900/30">
                            {strat.sector}
                          </span>
                          <h3 className="font-semibold text-sm text-zinc-100 hover:text-white line-clamp-1">
                            {strat.name}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{strat.description}</p>
                      </div>
                      <div className="text-right">
                        {/* Live decaying alpha. High precision counting down */}
                        <div className="font-mono font-bold text-xs whitespace-nowrap">
                          Alpha: <span className="text-emerald-400">{strat.currentAlphaBps.toFixed(4)}</span> <span className="text-[10px] text-zinc-500 font-normal">Bps</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          Initial: {strat.initialAlphaBps} Bps
                        </div>
                      </div>
                    </div>

                    {/* Progress representation: Deployed Capital ratio against Soft limit capacity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Allocated Cap: ${strat.currentCapital.toFixed(1)}M</span>
                        <span>Capacity Limit: ${strat.capacityLimitMillions < 1000 ? `${strat.capacityLimitMillions}M` : `${(strat.capacityLimitMillions/1000).toFixed(1)}B`}</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (strat.currentCapital / strat.capacityLimitMillions) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-800/50 font-mono text-zinc-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Competitor Count: <strong className="text-zinc-200">{strat.competitorsCount}</strong></span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Autopsy scores */}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${getRatingBadgeClass(strat.autopsyRating)}`}>
                          DEC-Rating: {strat.autopsyRating}
                        </span>
                        
                        {/* Delete strategy for customized items */}
                        {strat.isCustom && (
                          <button
                            onClick={(e) => handleDeleteStrategy(strat.id, e)}
                            className="text-zinc-500 hover:text-red-400 hover:bg-zinc-800 p-1 rounded transition cursor-pointer"
                            title="Purge customized track"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Urgent indicator of alpha depletion countdown */}
                    <div className="bg-zinc-900/30 px-2 py-1 rounded text-[10px] font-mono flex justify-between items-center border border-zinc-800/40 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Est. Alpha Half-Life:</span>
                      </span>
                      <span className="font-bold text-amber-500">
                        {strat.decayHalfLifeWeeks} Weeks ({Math.ceil(strat.decayHalfLifeWeeks * 7)} Days)
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Module: Live Network Leaks Stream (Visual feedback console) */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-[280px]">
            <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
              <div className="flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider font-semibold text-zinc-200">Alpha Leak Detector Feed</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Feed active"></span>
            </div>
            
            <div 
              ref={logContainerRef}
              className="p-3 font-mono text-[10px] text-zinc-300 space-y-2 overflow-y-auto max-h-56 flex-1 bg-zinc-950/80 scrollbar-thin scrollbar-thumb-zinc-800"
            >
              {scanLogs.map((log, index) => {
                let colorClass = 'text-zinc-400';
                if (log.includes('WARN')) colorClass = 'text-amber-500';
                else if (log.includes('ALERT')) colorClass = 'text-red-400 font-bold';
                else if (log.includes('COMPETITOR')) colorClass = 'text-zinc-300';
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    key={index} 
                    className={`leading-relaxed border-b border-zinc-900/40 pb-1.5 ${colorClass}`}
                  >
                    {log}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Side: Interactive Decay Simulator and Sandboxed Curve (Col span 7) */}
        <section className="xl:col-span-7 space-y-6">
          
          {/* Active Sandbox Chart Container */}
          <div className="bg-zinc-900/40 rounded-lg border border-zinc-800 p-6 shadow-xl relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-amber-500 uppercase font-black tracking-widest block">DECAY VISUALIZER SANDBOX</span>
                <h2 className="text-lg font-bold text-white font-mono mt-0.5">
                  {selectedStrategy.name} <span className="text-xs text-zinc-400 font-normal">({selectedStrategy.sector} Edge)</span>
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleResetStrategy}
                  className="px-2.5 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300 flex items-center space-x-1 transition cursor-pointer"
                  title="Restore strategy defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Defs</span>
                </button>
              </div>
            </div>

            {/* Custom SVG Curve Graph */}
            <div className="relative bg-zinc-950/60 rounded border border-zinc-800 p-4 flex flex-col items-center">
              <div className="w-full flex justify-between text-[11px] font-mono text-zinc-500 px-1 mb-2">
                <span>Alpha (Basis Points)</span>
                <span>Active Copycat Timelines (Weeks 1 to 52)</span>
              </div>
              
              <div className="relative w-full overflow-hidden" style={{ height: '180px' }}>
                {/* SVG Curve Line */}
                <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="480" y2="20" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="55" x2="480" y2="55" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="90" x2="480" y2="90" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="125" x2="480" y2="125" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="20" y1="160" x2="480" y2="160" stroke="#27272a" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Vertical dividers (Quarter lines) */}
                  <line x1="135" y1="20" x2="135" y2="160" stroke="#18181b" strokeWidth="1" />
                  <line x1="250" y1="20" x2="250" y2="160" stroke="#18181b" strokeWidth="1" />
                  <line x1="365" y1="20" x2="365" y2="160" stroke="#18181b" strokeWidth="1" />

                  {/* Gradient Area under curve */}
                  <defs>
                    <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Actual dynamic path */}
                  <path
                    d={`${generateCurvePath()} L 480,160 L 20,160 Z`}
                    fill="url(#decayGrad)"
                    className="transition-all duration-300"
                  />
                  
                  {/* The actual line curve */}
                  <path
                    d={generateCurvePath()}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-help"
                  />

                  {/* Intercept Point markers */}
                  <circle cx="20" cy={160 - (1 * 140)} r="5" fill="#f59e0b" />
                  <circle cx="480" cy={160 - (selectedStrategy.currentAlphaBps / selectedStrategy.initialAlphaBps * 140)} r="4" fill="#10b981" />
                </svg>

                {/* Simulated Floating Markers */}
                <div className="absolute top-2 left-6 text-[10px] font-mono text-amber-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                  Initial: {selectedStrategy.initialAlphaBps} Bps
                </div>

                <div className="absolute bottom-5 right-6 text-[10px] font-mono text-emerald-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                  Yr 1 Est: {(selectedStrategy.initialAlphaBps * Math.pow(0.5, 52 / parseFloat(simMetrics.halfLifeWeeks))).toFixed(1)} Bps
                </div>
              </div>
              
              {/* X Axis Legend */}
              <div className="w-full flex justify-between text-[10px] font-mono text-zinc-500 px-6 mt-1 pt-2 border-t border-zinc-800">
                <span>Week 0 (Execution)</span>
                <span>Week 13 (Q1)</span>
                <span>Week 26 (Q2)</span>
                <span>Week 39 (Q3)</span>
                <span>Week 52 (Year 1)</span>
              </div>
            </div>

            {/* Simulated Live Variables Panel based on sliders */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">SIMULATED HALF-LIFE</span>
                <span className="text-lg font-bold text-amber-500 mt-1">{simMetrics.halfLifeWeeks} Weeks</span>
                <span className="text-[10px] text-zinc-400">until edge collapses by 50%</span>
              </div>
              <div className="flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-4">
                <span className="text-[10px] text-zinc-500">EST. DEPRECIATION VELOCITY</span>
                <span className="text-lg font-bold text-amber-500 mt-1">~{simMetrics.monthlyBurnBps} Bps / Mo</span>
                <span className="text-[10px] text-zinc-400">rate of margin degradation</span>
              </div>
              <div className="flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 pt-3 md:pt-0 md:pl-4">
                <span className="text-[10px] text-zinc-500">FULL OBSOLESCENCE DATE</span>
                <span className="text-lg font-bold text-red-500 mt-1">&#126; {simMetrics.wipedOutEstimateWeeks} Weeks</span>
                <span className="text-[10px] text-zinc-400">decay to zero residual edge</span>
              </div>
            </div>

            {/* Sandbox Parameter Sliders (Bends curve dynamically) */}
            <h3 className="text-xs font-mono font-bold text-zinc-400 mt-6 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-500" />
              Tune Strategy Loading Bounds (Live Simulator Override)
            </h3>
            
            <div className="space-y-4 bg-zinc-950/40 p-4 rounded border border-zinc-800">
              {/* slider 1: capital scaling */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-350 flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Allocated Capital Target: <strong className="text-zinc-100">${simCapital.toFixed(1)} Million</strong></span>
                  </span>
                  <span className="text-zinc-400 font-bold">Capacity: ${(selectedStrategy.capacityLimitMillions).toFixed(0)}M</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max={(selectedStrategy.capacityLimitMillions * 1.5).toFixed(0)}
                  step="0.5"
                  value={simCapital}
                  onChange={(e) => setSimCapital(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Thin Slippage ($0.1M)</span>
                  <span>Extreme Congestion Threshold (${(selectedStrategy.capacityLimitMillions * 1.5).toFixed(0)}M)</span>
                </div>
              </div>

              {/* slider 2: competitor density */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-355 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Parallel Replicators Detected: <strong className="text-zinc-100">{simCompetitors} desks</strong></span>
                  </span>
                  <span className="text-zinc-400">Peak Saturation: 50</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={simCompetitors}
                  onChange={(e) => setSimCompetitors(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Isolative Edge (1 player)</span>
                  <span>Perfect Competition / Fully Crowded (50 desks)</span>
                </div>
              </div>

              {/* slider 3: execution difficulty buffer */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-350 flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Execution Barrier & Secretive Protocol: <strong className="text-zinc-100">{simDifficulty}%</strong></span>
                  </span>
                  <span className="text-zinc-400">Open-Source: 0%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={simDifficulty}
                  onChange={(e) => setSimDifficulty(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Easily Copyable (Simple Python scripts / REST APIs)</span>
                  <span>Secure Proprietary DMA (Fiber co-location / custom FPGA firmware)</span>
                </div>
              </div>
            </div>

            {/* Custom Safeguards list extracted dynamically */}
            <div className="mt-6 p-4 rounded border border-zinc-800/80 bg-zinc-900/30 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold flex items-center space-x-1.5">
                <Lock className="w-4 h-4" />
                <span>Quantitative Countermeasures / Safeguards</span>
              </h4>
              <p className="text-xs text-zinc-400">
                To suppress the decay constant and shield this alpha from predators, standard quant execution desks deploy the following structures:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {selectedStrategy.safeguards.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs bg-zinc-950/40 p-2.5 rounded border border-zinc-800/80">
                    <span className="bg-zinc-800 text-amber-500 border border-zinc-700 font-bold font-mono text-[10px] leading-tight px-1.5 py-0.5 rounded mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-zinc-300 leading-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Dynamic AI Scorecard Generation Block */}
          <div className="bg-zinc-900/40 rounded-lg border border-zinc-800 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32 text-amber-500" />
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <h2 className="font-mono text-sm uppercase tracking-wider font-semibold text-zinc-100">
                Quantum Scanner — AI Trade Crowding Detector
              </h2>
            </div>
            
            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              Establish a dynamic autopsy for your proprietary trading ideas. Describe your trade mechanics, asset sector, capital and team sizes below. The generative quant evaluator (powered by Gemini) will formulate a customized decay scorecard, half-life parameters, and direct infrastructure remedies.
            </p>

            <form onSubmit={handleAnalyzeStrategy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Strategy Identifier Name</label>
                  <input
                    type="text"
                    required
                    value={newStratName}
                    onChange={(e) => setNewStratName(e.target.value)}
                    placeholder="e.g., SOL-USDT Liquid Drift"
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:outline-none rounded p-2.5 text-zinc-105 placeholder:text-zinc-650"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Trading Sector</label>
                  <select
                    value={newStratSector}
                    onChange={(e) => setNewStratSector(e.target.value as any)}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:outline-none rounded p-2.5 text-zinc-300"
                  >
                    <option value="Crypto">Crypto (Spot/Derivatives)</option>
                    <option value="Equities">Equities / ETFs</option>
                    <option value="FX">Foreign Exchange (FX)</option>
                    <option value="Fixed Income">Fixed Income / Swaps</option>
                    <option value="Commodities">Commodities / Futures</option>
                    <option value="Cross-Asset">Cross-Asset Arbitrage</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Initial Standard Alpha (Bps)</label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={newStratAlpha}
                    onChange={(e) => setNewStratAlpha(parseInt(e.target.value))}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:outline-none rounded p-2.5 text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">
                  Proprietary Strategy Mechanics (Explain parameters clearly)
                </label>
                <textarea
                  required
                  rows={3}
                  value={newStratDesc}
                  onChange={(e) => setNewStratDesc(e.target.value)}
                  placeholder="Describe strategy vectors (e.g., frontrunning block inclusion parameters on Uniswap sub-mempools, routing order flow directly through prime brokers to bypass flash liquidity delays...)"
                  className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:outline-none rounded p-2.5 text-zinc-100 placeholder:text-zinc-650 leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Allocated Capital ($ USD Millions)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="10000"
                    step="0.1"
                    value={newStratCapital}
                    onChange={(e) => setNewStratCapital(parseFloat(e.target.value))}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:outline-none rounded p-2.5 text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Competitor Team Count Estimate</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={newStratCompetitors}
                    onChange={(e) => setNewStratCompetitors(parseInt(e.target.value))}
                    className="w-full text-xs font-mono bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:outline-none rounded p-2.5 text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-3 px-4 rounded font-mono font-bold text-xs uppercase tracking-wider text-zinc-950 bg-amber-500 hover:bg-amber-450 disabled:bg-zinc-800 disabled:text-zinc-500 transition cursor-pointer flex items-center justify-center space-x-2 border border-amber-600 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>COMPUTING QUANT MODELS DECAY MATRIX...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>EVALUATE EDGE DECAY INDEX</span>
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* AI Calculation Feed Terminal */}
            {isAnalyzing && (
              <div className="mt-4 p-3 bg-zinc-950 rounded font-mono text-[10px] border border-zinc-850 text-amber-500 leading-relaxed overflow-hidden">
                <div className="flex justify-between border-b border-zinc-855 pb-1 mb-2 text-amber-600">
                  <span>[QUANTUM ENGINE LOG ATTACHED]</span>
                  <span className="animate-pulse">&#9679; PROCESSING</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {analysisLogs.map((log, lIdx) => (
                    <div key={lIdx} className="flex items-start gap-1">
                      <span className="text-amber-750 font-bold">&#187;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="w-5 h-2 bg-amber-500 inline-block animate-pulse mt-1"></div>
                </div>
              </div>
            )}
          </div>

          {/* MULTI-TURN AI COPILOT TERMINAL */}
          <div className="bg-zinc-900/40 rounded-lg border border-zinc-800 shadow-xl relative overflow-hidden flex flex-col" id="copilot-panel">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
              <Bot className="w-32 h-32 text-amber-500" />
            </div>

            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="font-mono text-sm uppercase tracking-wider font-semibold text-zinc-100">
                  AlphaDecay Copilot Terminal
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                {chatLatency !== null && (
                  <span className="text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    LATENCY: <span className="text-emerald-400 font-bold">{chatLatency}ms</span>
                  </span>
                )}
                <span className="text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isChatting ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  {isChatting ? 'AI COMPUTING' : 'ONLINE'}
                </span>
              </div>
            </div>

            {/* Profile Subheader Selectors */}
            <div className="px-4 py-2.5 bg-zinc-950/60 border-b border-zinc-800/60 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Research Profile Role</label>
                <div className="flex bg-zinc-950 rounded p-0.5 border border-zinc-800">
                  <button 
                    type="button"
                    onClick={() => handleProfileChange('quant')}
                    className={`flex-1 text-center py-1 text-[10px] sm:text-xs font-mono rounded transition-all cursor-pointer ${chatProfile === 'quant' ? 'bg-amber-500 text-zinc-950 font-bold font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    🧠 Lead Quant
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleProfileChange('monitor')}
                    className={`flex-1 text-center py-1 text-[10px] sm:text-xs font-mono rounded transition-all cursor-pointer ${chatProfile === 'monitor' ? 'bg-amber-500 text-zinc-950 font-bold font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    📊 Monitor
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleProfileChange('router')}
                    className={`flex-1 text-center py-1 text-[10px] sm:text-xs font-mono rounded transition-all cursor-pointer ${chatProfile === 'router' ? 'bg-amber-500 text-zinc-950 font-bold font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    ⚡ Speed Router
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Compute Engine Model</label>
                <select
                  value={chatModel}
                  onChange={(e) => setChatModel(e.target.value as any)}
                  className="w-full text-[10px] sm:text-xs font-mono bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:outline-none rounded py-1.5 px-2 text-zinc-300"
                >
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Thinking: HIGH)</option>
                  <option value="gemini-3.5-flash">gemini-3.5-flash (Generalist Tasks)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Speed Mode)</option>
                </select>
              </div>
            </div>

            {/* Profile Info Header */}
            <div className="px-4 py-2 bg-zinc-950/20 text-[10px] border-b border-zinc-850 flex items-center justify-between text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Cpu className="w-3" />
                Active Mode: <strong className="text-zinc-200">
                  {chatProfile === 'quant' ? 'Lead Quantitative Reasoning Desk' : chatProfile === 'monitor' ? 'Continuous Market Monitoring Feed' : 'Ultra-Fast DMA Routing Strategy'}
                </strong>
              </span>
              <div>
                {chatModel === 'gemini-3.1-pro-preview' && (
                  <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight uppercase animate-pulse">
                    🧠 reasoning active • thinking level: HIGH
                  </span>
                )}
                {chatModel === 'gemini-3.1-flash-lite' && (
                  <span className="text-amber-400 bg-amber-950/40 border border-amber-900/60 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight uppercase">
                    ⚡ low-latency channels enabled
                  </span>
                )}
              </div>
            </div>

            {/* Chat message logs */}
            <div className="p-4 bg-zinc-950/25 h-[280px] overflow-y-auto space-y-3 font-mono text-xs flex flex-col" id="chat-thread">
              {chatMessages.map((msg, mIdx) => (
                <div 
                  key={mIdx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded p-3 border text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-350'
                  }`}>
                    <div className="flex items-center space-x-1.5 mb-1.5 select-none opacity-60 text-[9px] font-bold uppercase tracking-wider">
                      {msg.role === 'user' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>Arbitrageur (You)</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-amber-500" />
                          <span>
                            {chatProfile === 'quant' ? 'SYSTEM CO-PILOT [THINKING]' : chatProfile === 'monitor' ? 'MARKET DESK [MONITOR]' : 'DMA LINK [ROUTER]'}
                          </span>
                        </>
                      )}
                    </div>
                    {/* Render message formatting nicely */}
                    <div className="whitespace-pre-wrap leading-relaxed select-text font-mono">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900/80 border border-zinc-800 px-3 py-2.5 rounded text-xs text-zinc-400 max-w-[85%] flex items-center space-x-2">
                    <span className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                    <span className="italic text-[10px] text-zinc-500 font-mono">
                      {chatModel === 'gemini-3.1-pro-preview' ? 'Deep thinking underway...' : 'Retrieving low-latency response...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Form */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center gap-2">
              <input
                type="text"
                required
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatting}
                placeholder={chatProfile === 'quant' ? "Stress-test alpha decay: e.g., How does DEX sandwiching decay over time?" : "Ask market structure or low-latency DMA queries..."}
                className="flex-1 text-xs font-mono bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500 focus:outline-none rounded px-3 py-2.5 text-zinc-100 placeholder:text-zinc-650 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={isChatting || !chatInput.trim()}
                className="py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-450 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-650 font-mono font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-600 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SEND</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Historical Graveyard Grid Section */}
      <section className="px-6 py-6 border-t border-zinc-850 bg-zinc-950/20">
        <div className="flex items-center space-x-2 mb-6">
          <Skull className="w-4.5 h-4.5 text-zinc-400" />
          <h2 className="font-mono text-sm uppercase tracking-widest font-semibold text-zinc-350">
            Strategy Graveyard — Deceased Alphas & Post-Mortems
          </h2>
          <span className="text-[10px] font-mono text-zinc-500">
            HEAR THE LESSONS OF EXPIRED EDGES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {graveyardTrades.map((grave) => (
            <div
              key={grave.id}
              onClick={() => setActiveGraveId(grave.id)}
              className="bg-zinc-900/10 hover:bg-zinc-900/30 p-5 rounded-lg border border-zinc-850 hover:border-zinc-700 transition cursor-pointer select-none relative group overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono font-bold bg-zinc-850 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                    {grave.sector}
                  </span>
                  <span className="text-[10px] font-mono text-red-400 bg-zinc-900/40 px-1.5 py-0.5 rounded border border-red-950/40">
                    {grave.era}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-bold text-sm text-zinc-200 group-hover:text-white transition">
                    {grave.name}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1 text-zinc-500 text-[10px] font-mono">
                    <span>Peak Alpha:</span>
                    <strong className="text-emerald-400">{grave.peakAlpha}</strong>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-3">
                  {grave.mechanics}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500 group-hover:text-zinc-350">
                <span>View Autopsy Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Post-Mortem Autopsy Modal Dialog (AnimatePresence) */}
      <AnimatePresence>
        {activeGraveId && (() => {
          const grave = graveyardTrades.find(g => g.id === activeGraveId);
          if (!grave) return null;
          return (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900 border-2 border-zinc-800/85 rounded-lg max-w-xl w-full p-6 relative shadow-2xl font-mono text-xs text-zinc-350"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveGraveId(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 p-1 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-2 border-b border-zinc-850 pb-3 mb-4">
                  <Skull className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="uppercase text-red-400 font-bold tracking-widest text-[10px]">
                    OFFICIAL TRADE AUTOPSY REPORT
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight font-sans">
                      {grave.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10pt]">
                        Sector: {grave.sector}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                        Active Era: {grave.era}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-zinc-950/40 p-3 rounded border border-zinc-800/80">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block font-bold">PEAK STABLE ALPHA</span>
                      <span className="text-emerald-400 font-bold text-sm mt-0.5 block">{grave.peakAlpha}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block font-bold">COLLAPSE VELOCITY</span>
                      <span className="text-red-400 font-bold text-sm mt-0.5 block">{grave.collapseSpeed}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <strong className="text-zinc-300 block border-l-2 border-zinc-700 pl-2">Strategy Mechanics:</strong>
                    <p className="text-zinc-400 leading-relaxed font-sans">{grave.mechanics}</p>
                  </div>

                  <div className="space-y-2 p-3 bg-red-950/10 border border-red-950/60 rounded">
                    <strong className="text-red-400 block flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Post-Mortem Autopsy:</span>
                    </strong>
                    <p className="text-zinc-300 leading-relaxed font-sans">{grave.postMortem}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-850 flex justify-end">
                  <button
                    onClick={() => setActiveGraveId(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded text-white font-bold font-mono transition cursor-pointer"
                  >
                    DISMISS RECORDS
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto px-6 py-4 border-t border-zinc-850 bg-zinc-900/15 text-zinc-500 text-xs font-mono flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          &copy; 2026 AlphaDecay.watch. High Frequency Crowded Trade Analytics. All Rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-zinc-450">Node Status: Online</span>
          </span>
          <span className="text-zinc-650 border-l border-zinc-800 pl-4">
            v3.5 Quantum Grid
          </span>
        </div>
      </footer>
    </div>
  );
}
