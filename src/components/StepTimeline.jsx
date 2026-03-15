import React from 'react'
import { motion } from 'framer-motion'

export default function StepTimeline({ steps, currentStep, onStepClick }) {
  return (
    <div style={styles.container}>
      <div style={styles.line} />
      {steps.map((step, i) => {
        const isActive = i === currentStep
        const isPast = i < currentStep
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(i)}
            style={{
              ...styles.step,
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={{
                background: isActive
                  ? '#3b82f6'
                  : isPast
                  ? '#1d4ed8'
                  : 'rgba(255,255,255,0.08)',
                scale: isActive ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
              style={{
                ...styles.dot,
                border: isActive ? '2px solid #93c5fd' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 10, color: isActive || isPast ? '#fff' : '#555' }}>
                {i + 1}
              </span>
            </motion.div>
            <span
              style={{
                ...styles.label,
                color: isActive ? '#93c5fd' : isPast ? '#3b82f6' : '#555',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {step.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
    padding: '20px 0',
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 34,
    left: 30,
    right: 30,
    height: 2,
    background: 'rgba(255,255,255,0.06)',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'Inter, sans-serif',
    flex: 1,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 90,
    lineHeight: 1.3,
  },
}
