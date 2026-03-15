import React from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={styles.header}
    >
      <div style={styles.badge}>CLAUDE CODE</div>
      <h1 style={styles.title}>Swarm Mode</h1>
      <p style={styles.subtitle}>
        How a network of specialized AI agents collaborates to produce
        investment-grade analysis — in parallel.
      </p>
    </motion.div>
  )
}

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: 40,
    paddingTop: 20,
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#c084fc',
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: 6,
    padding: '4px 12px',
    marginBottom: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #c084fc, #818cf8, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.03em',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    maxWidth: 560,
    margin: '0 auto',
    lineHeight: 1.6,
  },
}
