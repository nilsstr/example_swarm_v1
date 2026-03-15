import React from 'react'
import { motion } from 'framer-motion'

export default function ThemeToggle({ light, onToggle }) {
  return (
    <button onClick={onToggle} style={styles.toggle} aria-label="Toggle light mode">
      <motion.div
        style={styles.track}
        animate={{
          background: light
            ? 'linear-gradient(135deg, #93c5fd, #60a5fa)'
            : 'rgba(255,255,255,0.1)',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          style={styles.thumb}
          animate={{ x: light ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <span style={styles.icon}>{light ? '☀️' : '🌙'}</span>
        </motion.div>
      </motion.div>
    </button>
  )
}

const styles = {
  toggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    display: 'flex',
    alignItems: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  icon: {
    fontSize: 11,
    lineHeight: 1,
  },
}
