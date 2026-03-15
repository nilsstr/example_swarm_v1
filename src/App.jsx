import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NetworkGraph from './components/NetworkGraph'
import StepTimeline from './components/StepTimeline'
import AgentCard from './components/AgentCard'
import MessageStream from './components/MessageStream'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'

const STEPS = [
  {
    id: 0,
    title: 'User Request',
    subtitle: 'The analyst submits their query',
    description: 'An investment analyst asks Claude to evaluate whether to invest in a mid-cap SaaS company. Claude enters Swarm Mode — spawning specialized sub-agents to work in parallel.',
    activeAgents: ['orchestrator'],
    messages: [
      { from: 'user', text: '"Evaluate TechCorp Inc. (TCHK) as a potential investment — analyze financials, competitive landscape, management, and macro risks. Provide a buy/hold/sell recommendation."' },
      { from: 'orchestrator', text: 'Complex multi-domain analysis detected. Activating Swarm Mode — I\'ll decompose this into parallel workstreams and spawn specialized agents.' },
    ],
    connections: [],
  },
  {
    id: 1,
    title: 'Task Decomposition',
    subtitle: 'The orchestrator breaks the task into sub-tasks',
    description: 'The Orchestrator agent analyzes the request, identifies independent workstreams, and plans which specialized agents to spawn. Each agent gets a focused brief.',
    activeAgents: ['orchestrator'],
    messages: [
      { from: 'orchestrator', text: 'Decomposing into 4 parallel workstreams:\n① Financial Analysis — revenue, margins, cash flow\n② Competitive Landscape — market position, moat\n③ Management Assessment — leadership track record\n④ Macro Risk Analysis — interest rates, sector trends' },
      { from: 'orchestrator', text: 'Spawning specialized agents with isolated contexts. Each agent receives only the data relevant to their task — no cross-contamination of analysis.' },
    ],
    connections: [],
  },
  {
    id: 2,
    title: 'Agent Spawning',
    subtitle: 'Specialized sub-agents are created in parallel',
    description: 'Four specialized agents launch simultaneously, each with their own context window, tools, and focused objective. They operate independently — like analysts in different departments.',
    activeAgents: ['orchestrator', 'financial', 'competitive', 'management', 'macro'],
    messages: [
      { from: 'orchestrator', text: 'Spawning agents in parallel with isolated worktrees...' },
      { from: 'financial', text: '📊 Financial Agent online. Analyzing TCHK 10-K filings, quarterly earnings, DCF model...' },
      { from: 'competitive', text: '🏢 Competitive Agent online. Mapping SaaS competitive landscape, TAM analysis...' },
      { from: 'management', text: '👤 Management Agent online. Reviewing C-suite track records, insider transactions...' },
      { from: 'macro', text: '🌍 Macro Agent online. Analyzing interest rate environment, sector rotation patterns...' },
    ],
    connections: [
      ['orchestrator', 'financial'],
      ['orchestrator', 'competitive'],
      ['orchestrator', 'management'],
      ['orchestrator', 'macro'],
    ],
  },
  {
    id: 3,
    title: 'Parallel Execution',
    subtitle: 'Agents work simultaneously on their tasks',
    description: 'All four agents work in parallel — reading documents, calling tools, running calculations. Each operates in its own isolated context, preventing bias from other analyses.',
    activeAgents: ['orchestrator', 'financial', 'competitive', 'management', 'macro'],
    messages: [
      { from: 'financial', text: 'Revenue growing 34% YoY. Gross margins expanding from 71% → 76%. Rule of 40 score: 52. Running 5-year DCF with 12% WACC...' },
      { from: 'competitive', text: 'TCHK holds #3 position in $42B TAM. Key differentiator: vertical-specific AI features. Switching costs: HIGH (avg 18-month implementation).' },
      { from: 'management', text: 'CEO founded 2 prior exits ($200M+). CFO ex-Goldman, joined 2023. Insider buying: 3 executives purchased $2.1M in shares last quarter.' },
      { from: 'macro', text: 'Fed holding rates. SaaS multiples compressing but stabilizing at 8-12x ARR. Enterprise IT budgets +7% YoY. Favorable tailwinds for vertical SaaS.' },
    ],
    connections: [
      ['orchestrator', 'financial'],
      ['orchestrator', 'competitive'],
      ['orchestrator', 'management'],
      ['orchestrator', 'macro'],
    ],
  },
  {
    id: 4,
    title: 'Results Collection',
    subtitle: 'Sub-agents return findings to the orchestrator',
    description: 'As each agent completes its analysis, it returns a structured summary to the orchestrator. The orchestrator waits for all agents, then begins synthesis.',
    activeAgents: ['orchestrator', 'financial', 'competitive', 'management', 'macro'],
    messages: [
      { from: 'financial', text: '✅ Complete. Fair value estimate: $47-54/share (current: $38). Strong unit economics, net revenue retention 128%.' },
      { from: 'competitive', text: '✅ Complete. Durable competitive position. Main risk: potential market entry by Salesforce. Probability: moderate.' },
      { from: 'management', text: '✅ Complete. Strong leadership team. Aligned incentives. No governance red flags.' },
      { from: 'macro', text: '✅ Complete. Macro environment neutral-to-positive. Sector rotation favoring quality growth names.' },
      { from: 'orchestrator', text: 'All 4 agents returned. Synthesizing cross-domain findings...' },
    ],
    connections: [
      ['financial', 'orchestrator'],
      ['competitive', 'orchestrator'],
      ['management', 'orchestrator'],
      ['macro', 'orchestrator'],
    ],
  },
  {
    id: 5,
    title: 'Synthesis & Response',
    subtitle: 'The orchestrator synthesizes and delivers the final analysis',
    description: 'The orchestrator merges all findings, resolves any conflicts between analyses, weighs the evidence, and produces a unified investment recommendation.',
    activeAgents: ['orchestrator'],
    messages: [
      { from: 'orchestrator', text: 'Cross-referencing findings. Financial strength + competitive moat + aligned management + favorable macro = strong conviction signal.' },
      { from: 'orchestrator', text: '📋 RECOMMENDATION: BUY\n\nTarget: $47-54 (24-42% upside)\nTimeframe: 12-18 months\nConviction: HIGH\n\nKey thesis: Undervalued vertical SaaS with expanding margins, durable moat via high switching costs, and insider buying conviction. Primary risk: large-cap competitive entry.' },
      { from: 'user', text: 'Received comprehensive analysis from 4 specialized agents, synthesized into a single recommendation with clear reasoning chain.' },
    ],
    connections: [],
  },
  {
    id: 6,
    title: 'Memory Storage',
    subtitle: 'The system persists learnings from this session',
    description: 'After delivering the analysis, the orchestrator writes structured memories to the persistent memory layer. This captures the user\'s preferences, successful analysis patterns, and domain-specific context for future sessions.',
    activeAgents: ['orchestrator', 'memory'],
    messages: [
      { from: 'orchestrator', text: 'Persisting session learnings to memory layer...' },
      { from: 'memory', text: '💾 Stored: User prefers quantitative metrics (Rule of 40, NRR) over qualitative narratives.\n💾 Stored: User focuses on vertical SaaS — weight sector-specific data higher.\n💾 Stored: Analysis pattern — user values insider transaction signals.\n💾 Stored: Successful DCF approach with 12% WACC for mid-cap SaaS.' },
      { from: 'orchestrator', text: 'Memory indexed. Next session will load user profile + domain context before decomposition.' },
    ],
    connections: [
      ['orchestrator', 'memory'],
    ],
  },
  {
    id: 7,
    title: 'Multi-User Knowledge',
    subtitle: 'How the network serves multiple users simultaneously',
    description: 'Each user gets their own isolated memory profile — preferences, past analyses, feedback. A shared knowledge layer captures anonymized patterns (e.g., "DCF works best for SaaS valuations") that benefit all users, while private context stays private.',
    activeAgents: ['memory', 'userA', 'userB', 'userC'],
    messages: [
      { from: 'memory', text: '🔒 Private Memory (per user):\n• User A: Prefers quantitative, focuses on SaaS\n• User B: Macro-first analyst, wants geopolitical risk\n• User C: Junior analyst, needs more explanation' },
      { from: 'memory', text: '🌐 Shared Knowledge Layer (anonymized):\n• Pattern: Insider buying correlates with 6-month outperformance 73% of the time\n• Pattern: Vertical SaaS companies with NRR >120% rarely churn below 90%\n• Pattern: DCF with sector-specific WACC outperforms generic multiples' },
      { from: 'userA', text: 'User A logs in → system loads their SaaS-focused profile, preferred metrics, and past analysis history.' },
      { from: 'userB', text: 'User B logs in → system loads their macro-first approach, geopolitical risk preferences.' },
    ],
    connections: [
      ['memory', 'userA'],
      ['memory', 'userB'],
      ['memory', 'userC'],
    ],
  },
  {
    id: 8,
    title: 'Adaptive Response',
    subtitle: 'Returning users get personalized, improved analysis',
    description: 'When the same analyst returns with a new query, the orchestrator loads their memory profile BEFORE decomposing the task. Past preferences shape which agents spawn, what tools they use, and how results are formatted — the network gets smarter with every interaction.',
    activeAgents: ['orchestrator', 'memory', 'financial', 'competitive'],
    messages: [
      { from: 'user', text: '"Now evaluate CloudNext (CNXT) — same sector."' },
      { from: 'memory', text: '📂 Loading user profile...\n• Prefers: Rule of 40, NRR, insider activity\n• Focus: Vertical SaaS mid-caps\n• Style: Data-dense, minimal narrative\n• History: 3 prior SaaS analyses, 2 were BUY' },
      { from: 'orchestrator', text: 'User profile loaded. Adapting agent configuration:\n• Financial Agent → pre-configured with preferred metrics (Rule of 40, NRR)\n• Skipping basic sector overview (user is an expert)\n• Prioritizing insider transaction data (user signal)\n• Formatting output as data-dense tables, not narrative' },
      { from: 'financial', text: '📊 Adapting to user preferences. Leading with Rule of 40 and NRR. Comparing against user\'s prior TCHK analysis for relative valuation.' },
      { from: 'competitive', text: '🏢 Cross-referencing CNXT against TCHK competitive positioning from prior session — no need to rebuild SaaS landscape from scratch.' },
    ],
    connections: [
      ['memory', 'orchestrator'],
      ['orchestrator', 'financial'],
      ['orchestrator', 'competitive'],
    ],
  },
  {
    id: 9,
    title: 'Outcome Tracking',
    subtitle: 'The system watches what actually happened',
    description: 'After every recommendation, a Tracker agent monitors the real-world outcome. Did the stock go up? Did the risk materialize? This ground-truth data is the raw fuel the system needs to learn — no human logic required.',
    activeAgents: ['orchestrator', 'tracker', 'memory'],
    messages: [
      { from: 'tracker', text: '📡 Monitoring TCHK (recommended BUY at $38)...\n\n+30 days: $41.20 (+8.4%)\n+90 days: $49.10 (+29.2%) ✅\n+180 days: $52.80 (+38.9%) ✅\n\nOutcome: CORRECT — hit target range within timeframe.' },
      { from: 'tracker', text: '📡 Also tracking prior recommendations:\n• DKWL (SELL at $67): now $44 → CORRECT ✅\n• VXRT (BUY at $22): now $19 → INCORRECT ❌\n• PLNR (HOLD at $31): now $33 → CORRECT ✅' },
      { from: 'memory', text: '💾 Storing outcome data. Linking each recommendation to the signals that produced it. This creates labeled training pairs:\n\n(signals → outcome) × thousands of analyses = learnable patterns.' },
    ],
    connections: [
      ['tracker', 'memory'],
      ['orchestrator', 'tracker'],
    ],
  },
  {
    id: 10,
    title: 'Pattern Discovery',
    subtitle: 'The model finds what predicts success — without being told',
    description: 'A Pattern Discovery agent analyzes the growing dataset of (signals → outcomes). It finds correlations, weights, and non-obvious combinations that predict investment success. Nobody programmed these rules — the model discovered them from data.',
    activeAgents: ['patterns', 'memory', 'orchestrator'],
    messages: [
      { from: 'patterns', text: '🔍 Analyzing 2,847 past analyses against outcomes...\n\nDiscovered signal clusters (no human logic provided):' },
      { from: 'patterns', text: '📈 HIGH CHANCE signals (discovered, not programmed):\n\n① Insider buying + NRR >125% + expanding margins\n   → 84% probability of 20%+ return in 12 months\n   Confidence: HIGH (n=342, p<0.001)\n\n② Revenue acceleration + shrinking short interest\n   → 71% probability of outperformance\n   Confidence: MEDIUM (n=128)\n\n③ New CEO from top-10 tech company + R&D spend increase\n   → 67% probability of re-rating within 18 months\n   Confidence: MEDIUM (n=89)' },
      { from: 'patterns', text: '📉 HIGH RISK signals (discovered, not programmed):\n\n① Declining NRR + CFO departure + rising DSO\n   → 78% probability of >15% drawdown\n   Risk Level: CRITICAL\n\n② Customer concentration >30% + sector ETF declining\n   → 63% probability of underperformance\n   Risk Level: ELEVATED\n\n③ Aggressive revenue recognition + auditor change\n   → 91% probability of negative event\n   Risk Level: CRITICAL (n=67, very high signal)' },
      { from: 'memory', text: '💾 Storing 23 newly discovered patterns. Weighted by sample size, recency, and statistical significance. These patterns will auto-apply to future analyses.' },
    ],
    connections: [
      ['memory', 'patterns'],
      ['patterns', 'orchestrator'],
    ],
  },
  {
    id: 11,
    title: 'Risk & Chance Scoring',
    subtitle: 'Every new company gets a data-driven probability score',
    description: 'When a new company is analyzed, the system automatically matches its signals against all discovered patterns. It outputs a probability-weighted chance/risk score — not based on rules you wrote, but on what the model learned actually predicts outcomes.',
    activeAgents: ['orchestrator', 'patterns', 'scorer', 'financial'],
    messages: [
      { from: 'user', text: '"Evaluate NovaTech (NVTK)."' },
      { from: 'scorer', text: '⚡ Auto-scoring NVTK against 23 discovered patterns...\n\nMatched CHANCE patterns:\n✅ Pattern #1: Insider buying + NRR 131% + margins expanding → 84% chance\n✅ Pattern #2: Revenue accelerating + short interest declining → 71% chance\n\nMatched RISK patterns:\n⚠️ Pattern #5: Customer concentration 28% (near threshold) → Watch\n❌ No critical risk patterns matched.' },
      { from: 'scorer', text: '📊 COMPOSITE SCORE:\n\n   Chance Score: 79/100 (strong)\n   Risk Score: 22/100 (low)\n   Net Signal: +57 (BUY territory)\n   Confidence: 82%\n\nThis score was generated entirely from learned patterns — no human-defined investment logic was used.' },
      { from: 'orchestrator', text: 'Enriching agent analysis with learned scores. The Financial Agent now knows which metrics matter MOST for this type of company — before it even starts analyzing.' },
      { from: 'financial', text: '📊 Pre-loaded with learned weights: prioritizing NRR and insider activity (highest predictive power for this company profile). Deprioritizing P/E ratio (low predictive signal for high-growth SaaS per pattern data).' },
    ],
    connections: [
      ['patterns', 'scorer'],
      ['scorer', 'orchestrator'],
      ['orchestrator', 'financial'],
    ],
  },
  {
    id: 12,
    title: 'Continuous Learning Loop',
    subtitle: 'The system gets smarter with every analysis it performs',
    description: 'This is the complete flywheel: Analyze → Recommend → Track Outcome → Discover Patterns → Score Future Companies → Analyze Better. Each cycle makes the model more accurate. The more users and analyses, the faster it learns. No human ever programs "what to look for" — the model figures it out.',
    activeAgents: ['orchestrator', 'tracker', 'patterns', 'scorer', 'memory'],
    messages: [
      { from: 'orchestrator', text: '🔄 THE LEARNING FLYWHEEL:\n\n① ANALYZE — Agents research a company\n② RECOMMEND — System outputs chance/risk score\n③ TRACK — Tracker monitors real-world outcome\n④ LEARN — Pattern agent finds what predicted correctly\n⑤ SCORE — Future analyses start with learned weights\n⑥ REPEAT — Each cycle sharpens predictions' },
      { from: 'tracker', text: '📊 System accuracy over time:\n\nMonth 1: 58% accuracy (near random)\nMonth 3: 67% accuracy (+9%)\nMonth 6: 74% accuracy (+7%)\nMonth 12: 81% accuracy (+7%)\nMonth 24: 86% accuracy (+5%)\n\nDiminishing gains but asymptotically improving.' },
      { from: 'patterns', text: '🧬 Pattern evolution:\n• Month 1: 0 patterns (cold start)\n• Month 3: 8 patterns discovered\n• Month 6: 19 patterns (some early ones invalidated)\n• Month 12: 31 patterns (stable core + seasonal)\n• Patterns self-prune when they stop predicting.' },
      { from: 'memory', text: '💡 Key insight: The model never needed a human to say "insider buying is bullish." It discovered that statistically, across 342 cases, insider buying combined with expanding margins predicted 20%+ returns 84% of the time. The logic emerged from data, not from programming.' },
    ],
    connections: [
      ['orchestrator', 'tracker'],
      ['tracker', 'memory'],
      ['memory', 'patterns'],
      ['patterns', 'scorer'],
      ['scorer', 'orchestrator'],
    ],
  },
]

const AGENTS = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Orchestrator',
    icon: '🧠',
    color: '#c084fc',
    description: 'Decomposes tasks, spawns agents, synthesizes results',
  },
  financial: {
    id: 'financial',
    name: 'Financial Analyst',
    icon: '📊',
    color: '#60a5fa',
    description: 'Revenue, margins, DCF modeling, unit economics',
  },
  competitive: {
    id: 'competitive',
    name: 'Competitive Intel',
    icon: '🏢',
    color: '#34d399',
    description: 'Market positioning, TAM, moat analysis',
  },
  management: {
    id: 'management',
    name: 'Management Review',
    icon: '👤',
    color: '#fbbf24',
    description: 'Leadership, governance, insider activity',
  },
  macro: {
    id: 'macro',
    name: 'Macro Analyst',
    icon: '🌍',
    color: '#f87171',
    description: 'Interest rates, sector trends, macro risk',
  },
  memory: {
    id: 'memory',
    name: 'Memory Layer',
    icon: '💾',
    color: '#f472b6',
    description: 'Persistent storage for user profiles & shared knowledge',
  },
  userA: {
    id: 'userA',
    name: 'User A (SaaS)',
    icon: '👤',
    color: '#38bdf8',
    description: 'Senior analyst — quantitative, SaaS-focused',
  },
  userB: {
    id: 'userB',
    name: 'User B (Macro)',
    icon: '👤',
    color: '#a78bfa',
    description: 'Macro strategist — geopolitical risk focus',
  },
  userC: {
    id: 'userC',
    name: 'User C (Junior)',
    icon: '👤',
    color: '#4ade80',
    description: 'Junior analyst — needs detailed explanations',
  },
  tracker: {
    id: 'tracker',
    name: 'Outcome Tracker',
    icon: '📡',
    color: '#fb923c',
    description: 'Monitors real-world outcomes of past recommendations',
  },
  patterns: {
    id: 'patterns',
    name: 'Pattern Discovery',
    icon: '🔍',
    color: '#2dd4bf',
    description: 'Finds predictive signals from outcome data — no human logic',
  },
  scorer: {
    id: 'scorer',
    name: 'Risk/Chance Scorer',
    icon: '⚡',
    color: '#facc15',
    description: 'Scores new companies against learned patterns',
  },
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  const step = STEPS[currentStep]
  const visibleMessages = step.messages.slice(0, messageIndex + 1)

  useEffect(() => {
    if (!isPlaying) return

    const messageCount = step.messages.length
    if (messageIndex < messageCount - 1) {
      const timer = setTimeout(() => setMessageIndex(i => i + 1), 2000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        if (currentStep < STEPS.length - 1) {
          setCurrentStep(s => s + 1)
          setMessageIndex(0)
        } else {
          setIsPlaying(false)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, messageIndex, currentStep, step.messages.length])

  const goToStep = useCallback((idx) => {
    setCurrentStep(idx)
    setMessageIndex(0)
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(() => {
    if (currentStep === STEPS.length - 1 && messageIndex >= step.messages.length - 1) {
      setCurrentStep(0)
      setMessageIndex(0)
    }
    setIsPlaying(p => !p)
  }, [currentStep, messageIndex, step.messages.length])

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow} />
      <Header />
      <ProgressBar current={currentStep} total={STEPS.length} />

      <div style={styles.controls}>
        <button onClick={togglePlay} style={styles.playBtn}>
          {isPlaying ? '⏸ Pause' : '▶ Play Animation'}
        </button>
        <div style={styles.stepButtons}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToStep(i)}
              style={{
                ...styles.stepBtn,
                ...(i === currentStep ? styles.stepBtnActive : {}),
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.stepHeader}
      >
        <div style={styles.stepNumber}>Step {currentStep + 1} of {STEPS.length}</div>
        <h2 style={styles.stepTitle}>{step.title}</h2>
        <p style={styles.stepSubtitle}>{step.subtitle}</p>
        <p style={styles.stepDescription}>{step.description}</p>
      </motion.div>

      <div style={styles.mainGrid}>
        <div style={styles.leftPanel}>
          <NetworkGraph
            agents={AGENTS}
            activeAgents={step.activeAgents}
            connections={step.connections}
            currentStep={currentStep}
          />
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.agentCards}>
            <AnimatePresence mode="popLayout">
              {step.activeAgents.map((agentId) => (
                <AgentCard
                  key={agentId}
                  agent={AGENTS[agentId]}
                  isActive={true}
                  currentStep={currentStep}
                />
              ))}
            </AnimatePresence>
          </div>

          <MessageStream
            messages={visibleMessages}
            agents={AGENTS}
          />
        </div>
      </div>

      <StepTimeline
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={goToStep}
      />
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '24px 40px 60px',
    position: 'relative',
    maxWidth: 1400,
    margin: '0 auto',
  },
  bgGlow: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 800,
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    position: 'relative',
    zIndex: 1,
  },
  playBtn: {
    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.02em',
  },
  stepButtons: {
    display: 'flex',
    gap: 6,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#999',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s',
  },
  stepBtnActive: {
    background: 'rgba(139,92,246,0.3)',
    borderColor: '#8b5cf6',
    color: '#c084fc',
  },
  stepHeader: {
    marginBottom: 32,
    position: 'relative',
    zIndex: 1,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 600,
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
    letterSpacing: '-0.02em',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#a78bfa',
    fontWeight: 500,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 1.6,
    maxWidth: 700,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 40,
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    minHeight: 420,
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  agentCards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
}
