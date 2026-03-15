import React from 'react'
import { motion } from 'framer-motion'

export default function Header({ mobile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={mobile ? mobileStyles.header : styles.header}
    >
      <h1 style={mobile ? mobileStyles.title : styles.title}>Swarm Mode</h1>
      <p style={mobile ? mobileStyles.subtitle : styles.subtitle}>
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
    flex: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #93c5fd, #3b82f6, #1d4ed8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.03em',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'var(--text-muted)',
    maxWidth: 560,
    margin: '0 auto',
    lineHeight: 1.6,
  },
}

const mobileStyles = {
  header: {
    textAlign: 'center',
    marginBottom: 24,
    paddingTop: 12,
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #93c5fd, #3b82f6, #1d4ed8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.03em',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-muted)',
    maxWidth: '100%',
    margin: '0 auto',
    lineHeight: 1.5,
    padding: '0 8px',
  },
}
