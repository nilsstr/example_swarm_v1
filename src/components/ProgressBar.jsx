import React from 'react'
import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100

  return (
    <div style={styles.container}>
      <div style={styles.track}>
        <motion.div
          style={styles.fill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  track: {
    height: 3,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
    borderRadius: 2,
  },
}
