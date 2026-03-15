import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AGENT_META = {
  user: { icon: '💼', name: 'Investment Analyst', color: '#94a3b8' },
  orchestrator: { icon: '🧠', name: 'Orchestrator', color: '#c084fc' },
  financial: { icon: '📊', name: 'Financial Agent', color: '#60a5fa' },
  competitive: { icon: '🏢', name: 'Competitive Agent', color: '#34d399' },
  management: { icon: '👤', name: 'Management Agent', color: '#fbbf24' },
  macro: { icon: '🌍', name: 'Macro Agent', color: '#f87171' },
  memory: { icon: '💾', name: 'Memory Layer', color: '#f472b6' },
  userA: { icon: '👤', name: 'User A (SaaS)', color: '#38bdf8' },
  userB: { icon: '👤', name: 'User B (Macro)', color: '#a78bfa' },
  userC: { icon: '👤', name: 'User C (Junior)', color: '#4ade80' },
  tracker: { icon: '📡', name: 'Outcome Tracker', color: '#fb923c' },
  patterns: { icon: '🔍', name: 'Pattern Discovery', color: '#2dd4bf' },
  scorer: { icon: '⚡', name: 'Risk/Chance Scorer', color: '#facc15' },
}

export default function MessageStream({ messages, agents }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.dot} />
        <span style={styles.headerText}>Agent Communication</span>
      </div>
      <div ref={scrollRef} style={styles.messages}>
        <AnimatePresence>
          {messages.map((msg, i) => {
            const meta = AGENT_META[msg.from] || AGENT_META.user
            return (
              <motion.div
                key={`${msg.from}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={styles.message}
              >
                <div style={styles.msgHeader}>
                  <span style={styles.msgIcon}>{meta.icon}</span>
                  <span style={{ ...styles.msgName, color: meta.color }}>{meta.name}</span>
                </div>
                <div style={styles.msgText}>{msg.text}</div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#22c55e',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  messages: {
    padding: 12,
    maxHeight: 320,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  message: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: '10px 14px',
  },
  msgHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  msgIcon: {
    fontSize: 14,
  },
  msgName: {
    fontSize: 12,
    fontWeight: 700,
  },
  msgText: {
    fontSize: 13,
    color: '#b0b0b0',
    lineHeight: 1.6,
    whiteSpace: 'pre-line',
  },
}
