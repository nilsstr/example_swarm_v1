import React from 'react'
import { motion } from 'framer-motion'

export default function AgentCard({ agent, isActive }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      style={{
        ...styles.card,
        borderColor: isActive ? agent.color + '55' : 'var(--border-subtle)',
        boxShadow: isActive ? `0 0 20px ${agent.color}15` : 'none',
      }}
    >
      <div style={styles.iconRow}>
        <span style={styles.icon}>{agent.icon}</span>
        <span style={{ ...styles.name, color: agent.color }}>{agent.name}</span>
        {isActive && (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ ...styles.status, background: agent.color }}
          />
        )}
      </div>
      <p style={styles.desc}>{agent.description}</p>
    </motion.div>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card-alt)',
    border: '1px solid',
    borderRadius: 10,
    padding: '8px 12px',
    flex: '1 1 140px',
    minWidth: 140,
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  icon: {
    fontSize: 16,
  },
  name: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  status: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: 'auto',
  },
  desc: {
    fontSize: 11,
    color: 'var(--text-dim)',
    lineHeight: 1.4,
  },
}
